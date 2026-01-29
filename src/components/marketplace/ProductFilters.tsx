'use client';

import React, { useState } from 'react';
import { Search, Filter, SortAsc } from 'lucide-react';

interface ProductFiltersProps {
    onSearch: (query: string) => void;
    onCategoryChange: (category: string) => void;
    onSortChange: (sortBy: string) => void;
    selectedCategory: string;
}

const CATEGORIES = [
    { value: 'all', label: 'All Categories' },
    { value: 'seeds', label: 'Seeds' },
    { value: 'fertilizers', label: 'Fertilizers' },
    { value: 'pesticides', label: 'Pesticides' },
    { value: 'tools', label: 'Tools' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'produce', label: 'Produce' },
];

const SORT_OPTIONS = [
    { value: 'dateAdded', label: 'Newest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
];

const ProductFilters: React.FC<ProductFiltersProps> = ({
    onSearch,
    onCategoryChange,
    onSortChange,
    selectedCategory,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        onSearch(query);
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md space-y-4">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-700 dark:text-white"
                />
            </div>

            {/* Mobile Filter Toggle */}
            <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="w-full md:hidden flex items-center justify-center gap-2 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700"
            >
                <Filter size={18} />
                <span>Filters</span>
            </button>

            {/* Desktop Filters */}
            <div className={`space-y-4 ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
                {/* Category Filter */}
                <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                        Category
                    </label>
                    <div className="space-y-2">
                        {CATEGORIES.map((cat) => (
                            <label key={cat.value} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="category"
                                    value={cat.value}
                                    checked={selectedCategory === cat.value}
                                    onChange={(e) => onCategoryChange(e.target.value)}
                                    className="w-4 h-4 cursor-pointer"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                    {cat.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Sort Filter */}
                <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <SortAsc size={18} />
                        Sort By
                    </label>
                    <select
                        onChange={(e) => onSortChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-700 dark:text-white"
                    >
                        {SORT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default ProductFilters;
