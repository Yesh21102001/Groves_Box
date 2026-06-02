"use client";

import React from "react";
import Link from "next/link";

type Variant = "primary" | "outline";

interface BaseProps {
    variant?: Variant;
    className?: string;
    children: React.ReactNode;
}

type ButtonAsButton = BaseProps &
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
        href?: undefined;
    };

type ButtonAsLink = BaseProps &
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
        href: string;
    };

type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * Shared site button — matches the product-card gradient button.
 * Renders a <Link> when `href` is provided, otherwise a <button>.
 *
 * Usage:
 *   <Button onClick={...}>Add to Cart</Button>
 *   <Button variant="outline" href="/products">Browse</Button>
 */
export default function Button({
    variant = "primary",
    className = "",
    children,
    ...rest
}: ButtonProps) {
    const cls = `${variant === "outline" ? "btn-outline" : "btn-primary"} ${className}`.trim();

    if ("href" in rest && rest.href) {
        const { href, ...anchorRest } = rest as ButtonAsLink;
        return (
            <Link href={href} className={cls} {...anchorRest}>
                {children}
            </Link>
        );
    }

    return (
        <button className={cls} {...(rest as ButtonAsButton)}>
            {children}
        </button>
    );
}
