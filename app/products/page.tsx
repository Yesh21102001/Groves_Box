'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProductsByCollection } from '@/src/lib/shopify_utilis';
import { useCart } from '@/src/context/CartContext';

interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    description: string;
    image: string;
    handle: string;
    tags?: string[];
}

export default function CollectionProductsPage() {
    const { handle } = useParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const { addToCart } = useCart();

    useEffect(() => {
        async function loadProducts() {
            setLoading(true);
            const data = await getProductsByCollection(handle as string);
            setProducts(data);
            setLoading(false);
        }

        loadProducts();
    }, [handle]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading collection...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white py-12">
            <div className="max-w-7xl mx-auto px-4">

                <h1 className="text-3xl font-semibold text-[#2F4F3E] mb-8 capitalize">
                    {handle?.toString().replace('-', ' ')}
                </h1>

                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="group">
                            <Link href={`/products/${product.handle}`}>
                                <img
                                    src={product.image}
                                    className="rounded-lg aspect-[3/4] object-cover"
                                />
                            </Link>

                            <h3 className="mt-3 text-sm font-medium">
                                {product.name}
                            </h3>

                            <p className="text-sm text-[#244033]">
                                ${product.price}
                            </p>

                            <button
                                onClick={() =>
                                    addToCart({
                                        id: product.id,
                                        name: product.name,
                                        price: product.price,
                                        quantity: 1,
                                        image: product.image,
                                    })
                                }
                                className="mt-2 w-full bg-[#244033] text-white py-2 rounded hover:bg-[#2F4F3E]"
                            >
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>

                {products.length === 0 && (
                    <p className="text-center text-gray-500 mt-20">
                        No products found in this collection.
                    </p>
                )}
            </div>
        </div>
    );
}
