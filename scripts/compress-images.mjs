/**
 * Image compression script using Sharp.
 *
 * Pass 1 – Original compression (in-place):
 *   PNG/JPG/WebP files exceeding ORIGINAL_THRESHOLD_KB are re-encoded at
 *   reduced quality and written back over the original. A ".bak" copy is kept.
 *   Skipped if a ".bak" already exists (unless --force is passed).
 *
 * Pass 2 – Tablet variant (-tablet):
 *   Files exceeding TABLET_THRESHOLD_KB get a "-tablet" sibling at max
 *   TABLET_MAX_DIM px (quality 72). Skipped if already exists (unless --force).
 *
 * Pass 3 – Mobile variant (-mobile):
 *   Files exceeding MOBILE_THRESHOLD_KB get a "-mobile" sibling at max
 *   MOBILE_MAX_DIM px (quality 70). Skipped if already exists (unless --force).
 *
 * Settings:
 *   - Original       : quality 75, no resize
 *   - Tablet (-tablet): quality 72, max 1200 px
 *   - Mobile (-mobile): quality 70, max 800 px
 *   Formats: JPEG, PNG, WebP (animated WebP supported)
 *
 * Usage:
 *   node scripts/compress-images.mjs                        # incremental (all images)
 *   node scripts/compress-images.mjs --force                # reprocess everything
 *   node scripts/compress-images.mjs <file> [file2 ...]     # specific files only
 *   node scripts/compress-images.mjs --force <file> [...]   # force-reprocess specific files
 *   e.g. node scripts/compress-images.mjs --force src/assets/images/svg_morph/morphing_sun.webp
 * <file> paths can be absolute or relative to the current working directory.
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

/** Files larger than this get a "-tablet" variant. */
const TABLET_THRESHOLD_KB = 300;

/** Files larger than this get a "-mobile" variant. */
const MOBILE_THRESHOLD_KB = 200;

/** Maximum dimension for the tablet variant. */
const TABLET_MAX_DIM = 1200;

/** Maximum dimension for the mobile variant. */
const MOBILE_MAX_DIM = 800;

const JPEG_QUALITY_ORIGINAL = 75;
const PNG_QUALITY_ORIGINAL = 75;
const WEBP_QUALITY_ORIGINAL = 75;
const JPEG_QUALITY_TABLET = 72;
const PNG_QUALITY_TABLET = 72;
const WEBP_QUALITY_TABLET = 72;
const JPEG_QUALITY_MOBILE = 70;
const PNG_QUALITY_MOBILE = 70;
const WEBP_QUALITY_MOBILE = 70;
// ─────────────────────────────────────────────────────────────────────────────

const SUPPORTED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp']);
const FORCE = process.argv.includes('--force');

/** Specific files passed as CLI args (absolute paths). Empty = process all. */
const TARGET_FILES = process.argv
    .slice(2)
    .filter((a) => !a.startsWith('--'))
    .map((a) => path.resolve(process.cwd(), a));

/** Recursively collect all image file paths that are NOT already variants. */
function collectImages(dir) {
    const results = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results.push(...collectImages(fullPath));
        } else if (entry.isFile()) {
            const ext = path.extname(entry.name).toLowerCase();
            const base = path.basename(entry.name, ext);
            // Skip files that are already generated variants
            if (base.endsWith('-mobile') || base.endsWith('-tablet')) continue;
            if (SUPPORTED_EXTENSIONS.has(ext)) {
                results.push(fullPath);
            }
        }
    }
    return results;
}

/** Return the tablet variant path for a given source path. */
function tabletPathFor(srcPath) {
    const ext = path.extname(srcPath);
    const base = path.basename(srcPath, ext);
    return path.join(path.dirname(srcPath), `${base}-tablet${ext}`);
}

/** Return the mobile variant path for a given source path. */
function mobilePathFor(srcPath) {
    const ext = path.extname(srcPath);
    const base = path.basename(srcPath, ext);
    return path.join(path.dirname(srcPath), `${base}-mobile${ext}`);
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

    if (!FORCE && fs.existsSync(bakPath)) {
        console.log(`  ✅ ${relSrc} — already compressed in-place, skipped`);
        return;
    }

    try {
        // Write compressed output to a temp file first, then atomically replace
        const tmpPath = `${srcPath}.tmp`;

        const image = sharp(srcPath, { animated: ext === '.webp' });
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
        } else if (ext === '.webp') {
            pipeline = pipeline.webp({
                quality: WEBP_QUALITY_ORIGINAL,
                effort: 4,
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

    if (!FORCE && fs.existsSync(mobilePath)) {
        console.log(
            `  ✅ ${relSrc} — mobile variant already exists, skipped (use --force to regenerate)`
        );
        return;
    }

    try {
        const image = sharp(srcPath, { animated: ext === '.webp' });
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
        } else if (ext === '.webp') {
            pipeline = pipeline.webp({
                quality: WEBP_QUALITY_MOBILE,
                effort: 4,
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

async function generateTabletVariant(srcPath) {
    const stats = fs.statSync(srcPath);
    const sizeKB = stats.size / 1024;
    const tabletPath = tabletPathFor(srcPath);
    const ext = path.extname(srcPath).toLowerCase();
    const relSrc = path.relative(IMAGES_DIR, srcPath);

    if (sizeKB <= TABLET_THRESHOLD_KB) {
        console.log(
            `  ⏭  ${relSrc} (${fmtBytes(stats.size)}) — below tablet threshold, skipped`
        );
        return;
    }

    if (!FORCE && fs.existsSync(tabletPath)) {
        console.log(
            `  ✅ ${relSrc} — tablet variant already exists, skipped (use --force to regenerate)`
        );
        return;
    }

    try {
        const image = sharp(srcPath, { animated: ext === '.webp' });
        const meta = await image.metadata();

        const needsResize =
            (meta.width && meta.width > TABLET_MAX_DIM) ||
            (meta.height && meta.height > TABLET_MAX_DIM);

        let pipeline = needsResize
            ? image.resize({
                  width: TABLET_MAX_DIM,
                  height: TABLET_MAX_DIM,
                  fit: 'inside',
                  withoutEnlargement: true,
              })
            : image;

        if (ext === '.jpg' || ext === '.jpeg') {
            pipeline = pipeline.jpeg({
                quality: JPEG_QUALITY_TABLET,
                mozjpeg: true,
            });
        } else if (ext === '.png') {
            pipeline = pipeline.png({
                quality: PNG_QUALITY_TABLET,
                compressionLevel: 9,
            });
        } else if (ext === '.webp') {
            pipeline = pipeline.webp({
                quality: WEBP_QUALITY_TABLET,
                effort: 4,
            });
        }

        await pipeline.toFile(tabletPath);
        const tabletStats = fs.statSync(tabletPath);
        console.log(
            `  🖼  ${relSrc} → ${path.basename(tabletPath)} (${fmtBytes(tabletStats.size)})`
        );
    } catch (err) {
        console.error(`  ❌ ${relSrc} — tablet variant failed: ${err.message}`);
    }
}

async function main() {
    console.log(`\n📂 Scanning: ${IMAGES_DIR}`);
    console.log(
        `📏 Original threshold : ${ORIGINAL_THRESHOLD_KB} KB (compress in-place)`
    );
    console.log(
        `🖥  Tablet threshold   : ${TABLET_THRESHOLD_KB} KB (generate -tablet variant, max ${TABLET_MAX_DIM}px)`
    );
    console.log(
        `📱 Mobile threshold   : ${MOBILE_THRESHOLD_KB} KB (generate -mobile variant, max ${MOBILE_MAX_DIM}px)`
    );
    console.log(`🔁 Force              : ${FORCE}\n`);

    let images;
    if (TARGET_FILES.length > 0) {
        // Validate each provided path
        images = [];
        for (const filePath of TARGET_FILES) {
            if (!fs.existsSync(filePath)) {
                console.warn(`  ⚠️  File not found, skipping: ${filePath}`);
                continue;
            }
            const ext = path.extname(filePath).toLowerCase();
            if (!SUPPORTED_EXTENSIONS.has(ext)) {
                console.warn(`  ⚠️  Unsupported format, skipping: ${filePath}`);
                continue;
            }
            const base = path.basename(filePath, ext);
            if (base.endsWith('-mobile') || base.endsWith('-tablet')) {
                console.warn(`  ⚠️  Skipping generated variant: ${filePath}`);
                continue;
            }
            images.push(filePath);
        }
        console.log(`Targeting ${images.length} specific image(s).\n`);
    } else {
        images = collectImages(IMAGES_DIR);
        console.log(`Found ${images.length} source image(s).\n`);
    }

    // ── Pass 1: compress large originals in-place ──────────────────────────
    console.log(
        '── Pass 1: in-place compression ─────────────────────────────'
    );
    for (const imgPath of images) {
        await compressOriginal(imgPath);
    }

    // ── Pass 2: generate tablet variants ──────────────────────────────────
    console.log(
        '\n── Pass 2: tablet variant generation ────────────────────────'
    );
    for (const imgPath of images) {
        await generateTabletVariant(imgPath);
    }

    // ── Pass 3: generate mobile variants ──────────────────────────────────
    console.log(
        '\n── Pass 3: mobile variant generation ────────────────────────'
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
