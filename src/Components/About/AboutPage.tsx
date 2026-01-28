import React, { useState } from 'react';
import { useSpring, animated, useTrail, config } from '@react-spring/web';
import {
    MapPin,
    Copy,
    Send,
    AtSign,
    PhoneCall,
    Clock,
    Codesandbox,
    Code,
    Coffee,
    Link,
    Linkedin,
    GitHub,
    Twitter,
} from 'react-feather';
import aboutJSON from '@assets/about.json';
import BackButton from '@comp/Common/BackButton';

interface SocialLink {
    platform: string;
    url: string;
    icon: string;
}

interface AboutData {
    profile: {
        name: string;
        title: string;
        tagline: string;
        avatar: string;
        bio: string;
        location: string;
        available: boolean;
    };
    contact: {
        email: string;
        phone: string;
        telegram: string;
    };
    social: SocialLink[];
    stats: {
        yearsExperience: number;
        projectsCompleted: number;
        coffeeConsumed: number;
        linesOfCode: number;
    };
}

const AboutPage: React.FC = () => {
    const [aboutData] = useState<AboutData>(aboutJSON as AboutData);
    const [copiedEmail, setCopiedEmail] = useState(false);
    const [copiedTelegram, setCopiedTelegram] = useState(false);

    const headerSpring = useSpring({
        from: { opacity: 0, y: -20 },
        to: { opacity: 1, y: 0 },
        config: config.gentle,
    });

    const profileSpring = useSpring({
        from: { opacity: 0, scale: 0.9 },
        to: { opacity: 1, scale: 1 },
        delay: 200,
        config: config.gentle,
    });

    const statsTrail = useTrail(4, {
        from: { opacity: 0, y: 20 },
        to: { opacity: 1, y: 0 },
        delay: 400,
        config: config.gentle,
    });

    const contactSpring = useSpring({
        from: { opacity: 0, x: -30 },
        to: { opacity: 1, x: 0 },
        delay: 600,
        config: config.gentle,
    });

    const socialTrail = useTrail(aboutData.social.length, {
        from: { opacity: 0, scale: 0.8 },
        to: { opacity: 1, scale: 1 },
        delay: 700,
        config: config.gentle,
    });

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(aboutData.contact.email);
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
    };

    const handleCopyTelegram = () => {
        navigator.clipboard.writeText(aboutData.contact.telegram);
        setCopiedTelegram(true);
        setTimeout(() => setCopiedTelegram(false), 2000);
    };

    const stats = [
        {
            value: aboutData.stats.yearsExperience,
            label: 'Years XP',
            icon: Clock,
        },
        {
            value: aboutData.stats.projectsCompleted,
            label: 'Projects Done',
            icon: Codesandbox,
        },
        {
            value: `${(aboutData.stats.linesOfCode / 1000).toFixed(0)}K`,
            label: 'Lines Written',
            icon: Code,
        },
        {
            value: aboutData.stats.coffeeConsumed,
            label: 'Coffee Consumed',
            icon: Coffee,
        },
    ];

    return (
        <div className="page-container overflow-y-auto">
            <div className="content-container glass-panel-dark p-8 max-w-4xl">
                <div className="mb-6 flex justify-start">
                    <BackButton />
                </div>
                {/* Header */}
                <animated.div style={headerSpring} className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2">
                        <span className="text-game-primary glow-text">
                            CHARACTER{' '}
                        </span>
                        <span className="text-game-text-primary">INFO</span>
                    </h1>
                    <p className="text-game-text-secondary tracking-wider">
                        PROFILE & CONTACT DETAILS
                    </p>
                    <div className="mt-4 h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-game-primary to-transparent" />
                </animated.div>

                {/* Profile Card */}
                <animated.div
                    style={profileSpring}
                    className="game-card p-8 mb-8"
                >
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Info */}
                        <div className="text-center md:text-left flex-1">
                            <h2 className="text-3xl font-bold text-game-text-primary mb-1">
                                {aboutData.profile.name}
                            </h2>
                            <p className="text-game-primary text-lg mb-2">
                                {aboutData.profile.title}
                            </p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                                <span className="flex items-center gap-2 text-game-text-secondary">
                                    <MapPin size={16} />{' '}
                                    {aboutData.profile.location}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="mt-6 pt-6 border-t border-game-glass-border">
                        <h3 className="text-sm font-semibold text-game-text-primary mb-2 tracking-wider">
                            BACKSTORY
                        </h3>
                        <p className="text-game-text-secondary leading-relaxed">
                            {aboutData.profile.bio}
                        </p>
                    </div>
                </animated.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {statsTrail.map((style, index) => {
                        const StatIcon = stats[index].icon;
                        return (
                            <animated.div
                                key={stats[index].label}
                                style={style}
                                className="game-card p-4 text-center flex flex-col items-center gap-2"
                            >
                                <div className="flex items-center gap-2">
                                    <StatIcon size={24} />
                                    <p className="text-2xl font-bold text-game-primary">
                                        {stats[index].value}+
                                    </p>
                                </div>
                                <p className="text-game-text-muted text-sm">
                                    {stats[index].label}
                                </p>
                            </animated.div>
                        );
                    })}
                </div>

                {/* Contact Section */}
                <animated.div
                    style={contactSpring}
                    className="game-card p-6 mb-8"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <PhoneCall size={32} />
                        <h3 className="flex items-center text-lg font-semibold text-game-text-primary tracking-wide h-4">
                            COMMUNICATION CHANNELS
                        </h3>
                    </div>
                    <div className="space-y-4">
                        {/* Email */}
                        <div
                            className="flex items-center justify-between p-3 bg-game-bg-light rounded-lg cursor-pointer hover:bg-game-bg-medium transition-colors"
                            onClick={handleCopyEmail}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xl">
                                    <AtSign size={24} />
                                </span>
                                <div>
                                    <p className="text-game-text-muted text-xs">
                                        EMAIL
                                    </p>
                                    <p className="text-game-text-primary">
                                        {aboutData.contact.email}
                                    </p>
                                </div>
                            </div>
                            <span className="text-game-primary text-sm">
                                {copiedEmail ? '✓ Copied!' : <Copy size={20} />}
                            </span>
                        </div>

                        {/* Website */}
                        <div
                            onClick={handleCopyTelegram}
                            className="flex items-center justify-between p-3 bg-game-bg-light rounded-lg hover:bg-game-bg-medium transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xl">
                                    <Send size={24} />
                                </span>
                                <div>
                                    <p className="text-game-text-muted text-xs">
                                        TELEGRAM
                                    </p>
                                    <p className="text-game-text-primary">
                                        {aboutData.contact.telegram}
                                    </p>
                                </div>
                            </div>
                            <span className="text-game-primary text-sm">
                                {copiedTelegram ? (
                                    '✓ Copied!'
                                ) : (
                                    <Copy size={20} />
                                )}
                            </span>
                        </div>
                    </div>
                </animated.div>

                {/* Social Links */}
                <div>
                    <div className="flex flex-wrap justify-center gap-4">
                        {socialTrail.map((style, index) => (
                            <animated.a
                                key={aboutData.social[index].platform}
                                style={style}
                                href={aboutData.social[index].url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="game-card p-4 flex flex-col items-center gap-2 min-w-[100px] hover:border-game-primary transition-colors"
                            >
                                <span className="text-3xl">
                                    {aboutData.social[index].platform ===
                                    'LinkedIn' ? (
                                        <Linkedin />
                                    ) : aboutData.social[index].platform ===
                                      'GitHub' ? (
                                        <GitHub />
                                    ) : aboutData.social[index].platform ===
                                      'X' ? (
                                        <Twitter />
                                    ) : (
                                        <Link />
                                    )}
                                </span>
                            </animated.a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
