'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/marketplace/ProductCard';
import ProductFilters from '@/components/marketplace/ProductFilters';
import { Product } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function MarketPlace() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('dateAdded');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedCategory, sortBy, currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        search: searchQuery,
        category: selectedCategory,
        sortBy,
        page: currentPage.toString(),
        limit: '12',
      });

      const response = await fetch(`/api/marketplace/products?${params}`);
      const data = await response.json();

      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-green-800 dark:text-green-400 mb-2">
            Marketplace
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover quality farm inputs and produce from trusted sellers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <div className="md:col-span-1">
            <ProductFilters
              onSearch={handleSearch}
              onCategoryChange={handleCategoryChange}
              onSortChange={handleSortChange}
              selectedCategory={selectedCategory}
            />
          </div>

          {/* Products Grid */}
          <div className="md:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-green-600" size={40} />
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                    >
                      Previous
                    </button>

                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-2 rounded-lg transition ${currentPage === i + 1
                            ? 'bg-green-600 text-white'
                            : 'border border-gray-300 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700'
                          }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  No products found matching your criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}