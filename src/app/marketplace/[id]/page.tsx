'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { Star, Loader2, ShoppingCart, ArrowLeft } from 'lucide-react';

export default function ProductDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params.id as string;

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);

    const { addToCart } = useCart();

    useEffect(() => {
        fetchProduct();
    }, [productId]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/marketplace/products/${productId}`);
            const data = await response.json();
            setProduct(data);
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (product) {
            addToCart(product, quantity);
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 2000);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-slate-900">
                <Loader2 className="animate-spin text-green-600" size={40} />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
                <div className="container mx-auto px-4">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-6"
                    >
                        <ArrowLeft size={20} />
                        Back
                    </button>
                    <p className="text-center text-gray-600 dark:text-gray-400">
                        Product not found
                    </p>
                </div>
            </div>
        );
    }

    const discountedPrice = product.discount
        ? product.price * (1 - product.discount / 100)
        : product.price;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
            <div className="container mx-auto px-4 max-w-5xl">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-6"
                >
                    <ArrowLeft size={20} />
                    Back to Marketplace
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Product Image */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
                        <div className="relative w-full h-96 bg-gray-100 dark:bg-slate-700 rounded-lg overflow-hidden">
                            {product.imageUrl && (
                                <Image
                                    src={product.imageUrl}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                />
                            )}
                            {product.discount && (
                                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-lg font-bold">
                                    -{product.discount}%
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 flex flex-col justify-between">
                        <div>
                            <div className="mb-4">
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    {product.name}
                                </h1>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Star className="fill-yellow-400 text-yellow-400" />
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {product.rating || 4.5}
                                        </span>
                                    </div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        ({Math.floor(Math.random() * 200) + 10} reviews)
                                    </span>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="mb-6 pb-6 border-b border-gray-200 dark:border-slate-700">
                                <div className="flex items-center gap-4">
                                    <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                                        ৳{discountedPrice.toFixed(2)}
                                    </p>
                                    {product.discount && (
                                        <p className="text-lg text-gray-400 line-through">
                                            ৳{product.price.toFixed(2)}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Details */}
                            <div className="space-y-4 mb-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {product.category}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Unit</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {product.unit}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {product.location}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Seller</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {product.brand || 'Verified Seller'}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        {product.description || 'Premium quality product carefully selected for farmers.'}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Stock Available</p>
                                    <p className={`font-semibold ${product.stockQuantity > 0
                                            ? 'text-green-600 dark:text-green-400'
                                            : 'text-red-600 dark:text-red-400'
                                        }`}>
                                        {product.stockQuantity > 0
                                            ? `${product.stockQuantity} units available`
                                            : 'Out of Stock'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Add to Cart Section */}
                        {product.stockQuantity > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <label className="text-sm font-semibold text-gray-900 dark:text-white">
                                        Quantity:
                                    </label>
                                    <div className="flex items-center border border-gray-300 dark:border-slate-600 rounded-lg">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700"
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                            className="w-12 text-center border-l border-r border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                            min="1"
                                            max={product.stockQuantity}
                                        />
                                        <button
                                            onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                                            className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition ${addedToCart
                                            ? 'bg-green-700 text-white'
                                            : 'bg-green-600 hover:bg-green-700 text-white'
                                        }`}
                                >
                                    <ShoppingCart size={20} />
                                    {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
                                </button>

                                <Link
                                    href="/marketplace/cart"
                                    className="w-full text-center bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-white font-semibold py-3 rounded-lg transition"
                                >
                                    View Cart
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products Suggestion */}
                <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">
                        💡 Tip
                    </h3>
                    <p className="text-blue-800 dark:text-blue-200">
                        Add this product to your cart and explore more items. We offer free shipping for orders over ৳5000.
                    </p>
                </div>
            </div>
        </div>
    );
}
