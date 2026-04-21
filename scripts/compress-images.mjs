/**
 * Image compression script using Sharp.
 *
 * Pass 1 – Original compression (in-place):
 *   PNG/JPG files exceeding ORIGINAL_THRESHOLD_KB are re-encoded at reduced
 *   quality and written back over the original. A ".bak" copy is kept.
 *   GIF files are never touched in this pass.
 *   Skipped if a ".bak" already exists (unless --force is passed).
 *
 * Pass 2 – Mobile variant generation:
 *   PNG/JPG files exceeding MOBILE_THRESHOLD_KB get a "-mobile" sibling at a
 *   smaller resolution (max 800 px).
 *   GIF files exceeding MOBILE_THRESHOLD_KB are converted to an animated
 *   "-mobile.webp" — animated WebP is 50-80 % smaller than GIF and is
 *   supported by all modern mobile browsers.
 *   Skipped if the variant already exists (unless --force).
 *
 * Settings:
 *   - Mobile max dim      : 800 px (preserves aspect ratio)
 *   - JPEG quality        : 75 (original) / 70 (mobile)
 *   - PNG quality         : 75 (original) / 70 (mobile)
 *   - WebP quality (GIF)  : 70 (mobile only, animated)
 *
 * Usage:
 *   node scripts/compress-images.mjs           # incremental – skips already-processed files
 *   node scripts/compress-images.mjs --force   # reprocess everything
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ─── Config ──────────────────────────────────────────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = path.resolve(__dirname, '../src/assets/images');

/** Originals larger than this are compressed in-place (original replaced). */
const ORIGINAL_THRESHOLD_KB = 500;

/** Files larger than this will also have a "-mobile" variant generated. */
const MOBILE_THRESHOLD_KB = 200;

/** Maximum dimension (width or height) for the mobile variant. */
const MOBILE_MAX_DIM = 800;

const JPEG_QUALITY_ORIGINAL = 75;
const PNG_QUALITY_ORIGINAL = 75;
const JPEG_QUALITY_MOBILE = 70;
const PNG_QUALITY_MOBILE = 70;
const WEBP_QUALITY_MOBILE = 70; // used for animated GIF → WebP conversion
// ─────────────────────────────────────────────────────────────────────────────

const SUPPORTED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif']);
const FORCE = process.argv.includes('--force');

/** Recursively collect all image file paths that are NOT already mobile variants. */
function collectImages(dir) {
    const results = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results.push(...collectImages(fullPath));
        } else if (entry.isFile()) {
            const ext = path.extname(entry.name).toLowerCase();
            const base = path.basename(entry.name, ext);
            // Skip files that are already mobile variants (including .webp siblings)
            if (base.endsWith('-mobile')) continue;
            if (SUPPORTED_EXTENSIONS.has(ext)) {
                results.push(fullPath);
            }
        }
    }
    return results;
}

/** Return the mobile variant path for a given source path. */
function mobilePathFor(srcPath) {
    const ext = path.extname(srcPath);
    const base = path.basename(srcPath, ext);
    const dir = path.dirname(srcPath);
    return path.join(dir, `${base}-mobile${ext}`);
}

/** Format bytes as a human-readable string. */
function fmtBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function compressOriginal(srcPath) {
    const stats = fs.statSync(srcPath);
    const sizeKB = stats.size / 1024;
    const ext = path.extname(srcPath).toLowerCase();
    const relSrc = path.relative(IMAGES_DIR, srcPath);
    const bakPath = `${srcPath}.bak`;

    if (sizeKB <= ORIGINAL_THRESHOLD_KB) return; // handled silently; logged in main

    // GIFs are never compressed in-place — handled separately in Pass 2
    if (ext === '.gif') return;

    if (!FORCE && fs.existsSync(bakPath)) {
        console.log(`  ✅ ${relSrc} — already compressed in-place, skipped`);
        return;
    }

    try {
        // Write compressed output to a temp file first, then atomically replace
        const tmpPath = `${srcPath}.tmp`;

        const image = sharp(srcPath);
        let pipeline = image;

        if (ext === '.jpg' || ext === '.jpeg') {
            pipeline = pipeline.jpeg({
                quality: JPEG_QUALITY_ORIGINAL,
                mozjpeg: true,
            });
        } else if (ext === '.png') {
            pipeline = pipeline.png({
                quality: PNG_QUALITY_ORIGINAL,
                compressionLevel: 9,
            });
        }

        await pipeline.toFile(tmpPath);

        const newSize = fs.statSync(tmpPath).size;

        // Only replace if the compressed version is actually smaller
        if (newSize >= stats.size) {
            fs.unlinkSync(tmpPath);
            console.log(
                `  ⏭  ${relSrc} (${fmtBytes(stats.size)}) — compressed output not smaller, kept original`
            );
            return;
        }

        // Back up the original then replace it
        fs.copyFileSync(srcPath, bakPath);
        fs.renameSync(tmpPath, srcPath);
        console.log(
            `  🗜  ${relSrc} (${fmtBytes(stats.size)}) → compressed in-place (${fmtBytes(newSize)})  [backup: ${path.basename(bakPath)}]`
        );
    } catch (err) {
        console.error(
            `  ❌ ${relSrc} — in-place compression failed: ${err.message}`
        );
    }
}

async function generateMobileVariant(srcPath) {
    const stats = fs.statSync(srcPath);
    const sizeKB = stats.size / 1024;
    const mobilePath = mobilePathFor(srcPath);
    const ext = path.extname(srcPath).toLowerCase();
    const relSrc = path.relative(IMAGES_DIR, srcPath);

    if (sizeKB <= MOBILE_THRESHOLD_KB) {
        console.log(
            `  ⏭  ${relSrc} (${fmtBytes(stats.size)}) — below mobile threshold, skipped`
        );
        return;
    }

    // For GIFs the mobile variant is an animated WebP (same stem, -mobile.webp).
    // Animated WebP is 50-80 % smaller than GIF and supported by all modern mobile browsers.
    const gifVariant = ext === '.gif';
    const mobileVariantPath = gifVariant
        ? path.join(
              path.dirname(srcPath),
              `${path.basename(srcPath, '.gif')}-mobile.webp`
          )
        : mobilePath;

    if (!FORCE && fs.existsSync(mobileVariantPath)) {
        console.log(
            `  ✅ ${relSrc} — mobile variant already exists, skipped (use --force to regenerate)`
        );
        return;
    }

    try {
        if (gifVariant) {
            await sharp(srcPath, { animated: true })
                .resize({
                    width: MOBILE_MAX_DIM,
                    height: MOBILE_MAX_DIM,
                    fit: 'inside',
                    withoutEnlargement: true,
                })
                .webp({ quality: WEBP_QUALITY_MOBILE, effort: 4 })
                .toFile(mobileVariantPath);

            const mobileStats = fs.statSync(mobileVariantPath);
            console.log(
                `  🖼  ${relSrc} → ${path.basename(mobileVariantPath)} (${fmtBytes(mobileStats.size)}) [animated WebP]`
            );
            return;
        }

        const image = sharp(srcPath);
        const meta = await image.metadata();

        const needsResize =
            (meta.width && meta.width > MOBILE_MAX_DIM) ||
            (meta.height && meta.height > MOBILE_MAX_DIM);

        let pipeline = needsResize
            ? image.resize({
                  width: MOBILE_MAX_DIM,
                  height: MOBILE_MAX_DIM,
                  fit: 'inside',
                  withoutEnlargement: true,
              })
            : image;

        if (ext === '.jpg' || ext === '.jpeg') {
            pipeline = pipeline.jpeg({
                quality: JPEG_QUALITY_MOBILE,
                mozjpeg: true,
            });
        } else if (ext === '.png') {
            pipeline = pipeline.png({
                quality: PNG_QUALITY_MOBILE,
                compressionLevel: 9,
            });
        }

        await pipeline.toFile(mobilePath);
        const mobileStats = fs.statSync(mobilePath);
        console.log(
            `  🖼  ${relSrc} → ${path.basename(mobilePath)} (${fmtBytes(mobileStats.size)})`
        );
    } catch (err) {
        console.error(`  ❌ ${relSrc} — mobile variant failed: ${err.message}`);
    }
}

async function main() {
    console.log(`\n📂 Scanning: ${IMAGES_DIR}`);
    console.log(
        `📏 Original threshold : ${ORIGINAL_THRESHOLD_KB} KB (compress in-place)`
    );
    console.log(
        `📱 Mobile threshold   : ${MOBILE_THRESHOLD_KB} KB (generate -mobile variant, max ${MOBILE_MAX_DIM}px)`
    );
    console.log(`🔁 Force              : ${FORCE}\n`);

    const images = collectImages(IMAGES_DIR);
    console.log(`Found ${images.length} source image(s).\n`);

    // ── Pass 1: compress large originals in-place ──────────────────────────
    console.log(
        '── Pass 1: in-place compression ─────────────────────────────'
    );
    for (const imgPath of images) {
        await compressOriginal(imgPath);
    }

    // ── Pass 2: generate mobile variants ──────────────────────────────────
    console.log(
        '\n── Pass 2: mobile variant generation ────────────────────────'
    );
    for (const imgPath of images) {
        await generateMobileVariant(imgPath);
    }

    console.log('\n✨ Done.\n');
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
