'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star, TrendingDown } from 'lucide-react';
import { Product } from '@/lib/types';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const discountedPrice = product.discount
        ? product.price * (1 - product.discount / 100)
        : product.price;

    return (
        <Link href={`/marketplace/${product._id}`}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer h-full">
                <div className="relative w-full h-48 bg-gray-100 dark:bg-slate-700">
                    {product.imageUrl && (
                        <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                        />
                    )}
                    {product.discount && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                            <TrendingDown size={12} />
                            {product.discount}% OFF
                        </div>
                    )}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setIsWishlisted(!isWishlisted);
                        }}
                        className="absolute top-3 left-3 bg-white dark:bg-slate-700 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-600 transition"
                    >
                        <Heart
                            size={18}
                            className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-300'}
                        />
                    </button>
                </div>

                <div className="p-4">
                    <h3 className="font-semibold text-sm line-clamp-2 text-gray-900 dark:text-white mb-2">
                        {product.name}
                    </h3>

                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                        {product.location}
                    </p>

                    <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                            <Star size={14} className="fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                {product.rating || 4.5}
                            </span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            ({Math.floor(Math.random() * 200) + 10} reviews)
                        </span>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                ৳{discountedPrice.toFixed(2)}
                            </p>
                            {product.discount && (
                                <p className="text-xs text-gray-400 line-through">
                                    ৳{product.price.toFixed(2)}
                                </p>
                            )}
                        </div>
                        <span className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                            {product.unit}
                        </span>
                    </div>

                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                        <p>Stock: {product.stockQuantity > 0 ? `${product.stockQuantity} available` : 'Out of Stock'}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
