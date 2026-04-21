"use client";

import Image from 'next/image';
import Link from 'next/link';

import {
    images,
    heroContent,
    founderContent,
    ctaContent,
    features,
} from '../../src/config/About-Us.config';

/* ──────────────────────────────────────────────────────────────────────────
   MINIMAL ABOUT — drop-in redesign
   Palette:  ink #1F2A14  ·  leaf #6B9238  ·  moss #8CAB4F
             sage #C2DEA3 ·  paper #F5F7F2

   Fonts (add once in your <head> or via next/font):
     Fraunces        — display serif (opsz variable, light weights)
     Instrument Sans — body sans
     JetBrains Mono  — eyebrow labels
   ────────────────────────────────────────────────────────────────────────── */

const palette = {
    ink: '#1F2A14',
    inkSoft: '#4A5A3A',
    leaf: '#6B9238',
    moss: '#8CAB4F',
    sage: '#C2DEA3',
    sageSoft: '#E3EED1',
    paper: '#F5F7F2',
    paperWarm: '#EEF2E6',
};

const font = {
    display: '"Fraunces", "Cormorant Garamond", Georgia, serif',
    body: '"Instrument Sans", "Inter Tight", system-ui, sans-serif',
    mono: '"JetBrains Mono", "IBM Plex Mono", ui-monospace, monospace',
};

/* ─────────────────────────────── RichParagraph ─────────────────────────── */
function RichParagraph({ paragraph }) {
    const linkStyle = {
        color: palette.leaf,
        textDecoration: 'none',
        borderBottom: `1px solid ${palette.moss}`,
        paddingBottom: '1px',
        transition: 'color .25s ease, border-color .25s ease',
    };
    const hoverIn = e => { e.currentTarget.style.color = palette.ink; e.currentTarget.style.borderColor = palette.ink; };
    const hoverOut = e => { e.currentTarget.style.color = palette.leaf; e.currentTarget.style.borderColor = palette.moss; };

    const pStyle = {
        color: palette.inkSoft,
        fontFamily: font.body,
        fontSize: '1.0625rem',
        lineHeight: 1.75,
        letterSpacing: '-0.005em',
        margin: 0,
    };

    if (typeof paragraph === 'string') {
        return <p style={pStyle}>{paragraph}</p>;
    }

    if (paragraph.linkText) {
        return (
            <p style={pStyle}>
                {paragraph.before}
                <a href={paragraph.linkHref} style={linkStyle} onMouseOver={hoverIn} onMouseOut={hoverOut}>
                    {paragraph.linkText}
                </a>
                {paragraph.after}
            </p>
        );
    }

    if (paragraph.parts) {
        return (
            <p style={pStyle}>
                {paragraph.parts.map((part, i) => {
                    if (part.type === 'link') {
                        return (
                            <a key={i} href={part.href} style={linkStyle} onMouseOver={hoverIn} onMouseOut={hoverOut}>
                                {part.value}
                            </a>
                        );
                    }
                    if (part.type === 'italic') {
                        return (
                            <span key={i} style={{ fontStyle: 'italic', fontFamily: font.display, color: palette.ink }}>
                                {part.value}
                            </span>
                        );
                    }
                    return <span key={i}>{part.value}</span>;
                })}
            </p>
        );
    }
    return null;
}

/* ─────────────────────────────── Small bits ────────────────────────────── */
const Eyebrow = ({ children, number }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.875rem',
        fontFamily: font.mono,
        fontSize: '0.75rem',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: palette.leaf,
        marginBottom: '2rem',
    }}>
        {number && <span style={{ color: palette.moss }}>{number}</span>}
        <span style={{ width: '2rem', height: '1px', backgroundColor: palette.moss }} />
        <span>{children}</span>
    </div>
);

const ThinRule = ({ color = palette.sage, width = '100%' }) => (
    <div style={{ width, height: '1px', backgroundColor: color }} />
);

/* ─────────────────────────────── Page ──────────────────────────────────── */
export default function AboutUs() {
    return (
        <div style={{ backgroundColor: palette.paper, color: palette.ink, minHeight: '100vh' }}>

            {/* ── HERO ────────────────────────────────────────────────────── */}
            {features.showHeroSection && (
                <section style={{
                    paddingTop: 'clamp(4rem, 10vh, 7rem)',
                    paddingBottom: 'clamp(4rem, 10vh, 7rem)',
                    paddingLeft: 'clamp(1.5rem, 6vw, 6rem)',
                    paddingRight: 'clamp(1.5rem, 6vw, 6rem)',
                }}>
                    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

                        <Eyebrow number="01">About</Eyebrow>

                        <h1 style={{
                            fontFamily: font.display,
                            fontWeight: 300,
                            fontSize: 'clamp(2.75rem, 7vw, 5.5rem)',
                            lineHeight: 1.02,
                            letterSpacing: '-0.025em',
                            color: palette.ink,
                            margin: 0,
                            maxWidth: '18ch',
                        }}>
                            {heroContent.heading}
                            {features.showTrademark && (
                                <sup style={{
                                    fontSize: '0.32em',
                                    fontWeight: 400,
                                    color: palette.leaf,
                                    marginLeft: '0.1em',
                                    top: '-1.2em',
                                }}>®</sup>
                            )}
                        </h1>

                        {/* Asymmetric split: image left, text right */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'minmax(0, 5fr) minmax(0, 7fr)',
                            gap: 'clamp(2rem, 5vw, 5rem)',
                            alignItems: 'start',
                            marginTop: 'clamp(3rem, 7vh, 5rem)',
                        }} className="hero-split">

                            {/* Image column */}
                            <div style={{
                                position: 'relative',
                                aspectRatio: '4 / 5',
                                overflow: 'hidden',
                                borderRadius: '2px',
                                backgroundColor: palette.sageSoft,
                            }}>
                                <Image
                                    src={images.hero.src}
                                    alt={images.hero.alt}
                                    fill
                                    style={{ objectFit: images.hero.objectFit || 'cover' }}
                                    priority={images.hero.priority}
                                />
                                {/* subtle corner tick */}
                                <div style={{
                                    position: 'absolute',
                                    top: '1rem', left: '1rem',
                                    width: '20px', height: '20px',
                                    borderTop: `1px solid ${palette.paper}`,
                                    borderLeft: `1px solid ${palette.paper}`,
                                    opacity: 0.8,
                                }} />
                                <div style={{
                                    position: 'absolute',
                                    bottom: '1rem', right: '1rem',
                                    width: '20px', height: '20px',
                                    borderBottom: `1px solid ${palette.paper}`,
                                    borderRight: `1px solid ${palette.paper}`,
                                    opacity: 0.8,
                                }} />
                            </div>

                            {/* Text column */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1.5rem',
                                paddingTop: '0.5rem',
                            }}>
                                {heroContent.paragraphs.map((para, i) => (
                                    <RichParagraph key={i} paragraph={para} />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ── FOUNDER'S NOTE ──────────────────────────────────────────── */}
            {features.showFounderNote && (
                <section style={{
                    backgroundColor: palette.paperWarm,
                    paddingTop: 'clamp(5rem, 12vh, 8rem)',
                    paddingBottom: 'clamp(5rem, 12vh, 8rem)',
                    paddingLeft: 'clamp(1.5rem, 6vw, 6rem)',
                    paddingRight: 'clamp(1.5rem, 6vw, 6rem)',
                    position: 'relative',
                }}>
                    {/* Top hairline */}
                    <div style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0,
                        height: '1px',
                        backgroundColor: palette.sage,
                    }} />

                    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
                        <Eyebrow number="02">Founder's Note</Eyebrow>

                        <h2 style={{
                            fontFamily: font.display,
                            fontWeight: 300,
                            fontSize: 'clamp(2rem, 4.5vw, 3.25rem)',
                            lineHeight: 1.1,
                            letterSpacing: '-0.02em',
                            color: palette.ink,
                            margin: '0 0 3rem 0',
                        }}>
                            {founderContent.sectionHeading}
                        </h2>

                        {/* Founder portrait — smaller, restrained */}
                        <div style={{
                            position: 'relative',
                            width: '100%',
                            aspectRatio: '3 / 2',
                            marginBottom: '3rem',
                            overflow: 'hidden',
                            borderRadius: '2px',
                            backgroundColor: palette.sage,
                        }}>
                            <Image
                                src={images.founder.src}
                                alt={images.founder.alt}
                                fill
                                style={{ objectFit: images.founder.objectFit || 'cover' }}
                                priority={images.founder.priority}
                            />
                        </div>

                        {/* Body */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {founderContent.paragraphs.map((para, i) => (
                                <RichParagraph key={i} paragraph={para} />
                            ))}
                        </div>

                        {/* Sign-off */}
                        <div style={{ marginTop: '3.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                            <div style={{ width: '3rem', height: '1px', backgroundColor: palette.leaf }} />
                            <div>
                                <p style={{
                                    fontFamily: font.display,
                                    fontStyle: 'italic',
                                    fontWeight: 300,
                                    fontSize: '1.375rem',
                                    color: palette.ink,
                                    margin: 0,
                                    lineHeight: 1.3,
                                }}>
                                    {founderContent.signOff.line1}
                                </p>
                                <p style={{
                                    fontFamily: font.mono,
                                    fontSize: '0.75rem',
                                    letterSpacing: '0.18em',
                                    textTransform: 'uppercase',
                                    color: palette.moss,
                                    margin: '0.5rem 0 0 0',
                                }}>
                                    {founderContent.signOff.line2}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ── CTA ─────────────────────────────────────────────────────── */}
            {features.showCtaSection && (
                <section style={{
                    backgroundColor: palette.sageSoft,
                    paddingTop: 'clamp(5rem, 12vh, 8rem)',
                    paddingBottom: 'clamp(5rem, 12vh, 8rem)',
                    paddingLeft: 'clamp(1.5rem, 6vw, 6rem)',
                    paddingRight: 'clamp(1.5rem, 6vw, 6rem)',
                    position: 'relative',
                }}>
                    {/* Top hairline to separate from founder section */}
                    <div style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0,
                        height: '1px',
                        backgroundColor: palette.sage,
                    }} />

                    <div style={{ maxWidth: '840px', margin: '0 auto', position: 'relative' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.875rem',
                            fontFamily: font.mono,
                            fontSize: '0.75rem',
                            letterSpacing: '0.18em',
                            textTransform: 'uppercase',
                            color: palette.leaf,
                            marginBottom: '2rem',
                        }}>
                            <span style={{ color: palette.moss }}>03</span>
                            <span style={{ width: '2rem', height: '1px', backgroundColor: palette.moss }} />
                            <span>Get in touch</span>
                        </div>

                        <h2 style={{
                            fontFamily: font.display,
                            fontWeight: 300,
                            fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
                            lineHeight: 1.05,
                            letterSpacing: '-0.025em',
                            color: palette.ink,
                            margin: '0 0 1.5rem 0',
                            maxWidth: '20ch',
                        }}>
                            {ctaContent.heading}
                        </h2>

                        <p style={{
                            fontFamily: font.body,
                            fontSize: '1.0625rem',
                            lineHeight: 1.7,
                            color: palette.inkSoft,
                            maxWidth: '42rem',
                            margin: '0 0 3rem 0',
                        }}>
                            {ctaContent.subtext}
                        </p>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                            {ctaContent.buttons.map((btn, i) => {
                                const isPrimary = btn.style === 'primary';
                                return (
                                    <Link
                                        key={i}
                                        href={btn.href}
                                        className="cta-btn"
                                        data-variant={isPrimary ? 'primary' : 'ghost'}
                                        style={{
                                            fontFamily: font.body,
                                            fontSize: '0.9375rem',
                                            fontWeight: 500,
                                            letterSpacing: '0.01em',
                                            padding: '1rem 1.75rem',
                                            borderRadius: '2px',
                                            textDecoration: 'none',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            transition: 'all .3s cubic-bezier(.2,.6,.2,1)',
                                            backgroundColor: isPrimary ? palette.leaf : 'transparent',
                                            color: isPrimary ? palette.paper : palette.ink,
                                            border: isPrimary ? '1px solid transparent' : `1px solid ${palette.ink}`,
                                        }}
                                    >
                                        {btn.label}
                                        <span aria-hidden style={{ display: 'inline-block', transition: 'transform .3s ease' }}>→</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* Scoped styles: hover, responsive hero split */}
            <style jsx>{`
                :global(.cta-btn[data-variant="primary"]:hover) {
                    background-color: ${palette.moss};
                    transform: translateY(-1px);
                }
                :global(.cta-btn[data-variant="ghost"]:hover) {
                    background-color: ${palette.ink};
                    border-color: ${palette.ink};
                    color: ${palette.paper};
                }
                :global(.cta-btn:hover span[aria-hidden]) {
                    transform: translateX(4px);
                }
                @media (max-width: 860px) {
                    :global(.hero-split) {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
}