import { NextResponse } from 'next/server';

const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const API_VERSION = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || '2026-01';

// Maps Shopify value_type to an icon key used by the cart UI
function resolveIcon(valueType: string): string {
    if (valueType === 'percentage') return 'percent';
    if (valueType === 'fixed_amount') return 'tag';
    return 'gift';
}

export async function GET() {
    // If no admin token is configured, return empty — no error shown
    if (!ADMIN_TOKEN || !STORE_DOMAIN) {
        return NextResponse.json({ offers: [] });
    }

    try {
        // Fetch active price rules from Shopify Admin REST API
        const rulesRes = await fetch(
            `https://${STORE_DOMAIN}/admin/api/${API_VERSION}/price_rules.json?status=enabled&limit=50`,
            {
                headers: {
                    'X-Shopify-Access-Token': ADMIN_TOKEN,
                    'Content-Type': 'application/json',
                },
                next: { revalidate: 300 }, // cache for 5 minutes
            },
        );

        if (!rulesRes.ok) {
            return NextResponse.json({ offers: [] });
        }

        const { price_rules: rules } = await rulesRes.json();

        // For each price rule fetch its discount codes
        const offers = (
            await Promise.all(
                (rules ?? []).map(async (rule: Record<string, unknown>) => {
                    const codesRes = await fetch(
                        `https://${STORE_DOMAIN}/admin/api/${API_VERSION}/price_rules/${rule.id}/discount_codes.json?limit=1`,
                        {
                            headers: {
                                'X-Shopify-Access-Token': ADMIN_TOKEN,
                                'Content-Type': 'application/json',
                            },
                            next: { revalidate: 300 },
                        },
                    );

                    if (!codesRes.ok) return null;
                    const { discount_codes: codes } = await codesRes.json();
                    if (!codes?.length) return null;

                    const valueType = rule.value_type as string;
                    const value = parseFloat(rule.value as string);
                    const isPercent = valueType === 'percentage';
                    const displayValue = isPercent ? `${Math.abs(value)}% off` : `₹${Math.abs(value)} off`;

                    return {
                        id: String(rule.id),
                        code: (codes[0].code as string).toUpperCase(),
                        title: (rule.title as string) || displayValue,
                        description: `Use this code to get ${displayValue} on your order.`,
                        icon: resolveIcon(valueType),
                        tag: isPercent ? 'Sale' : 'Deal',
                        endsAt: rule.ends_at ?? null,
                    };
                }),
            )
        ).filter(Boolean);

        return NextResponse.json({ offers });
    } catch {
        return NextResponse.json({ offers: [] });
    }
}
