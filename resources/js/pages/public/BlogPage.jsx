import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { postService, categoryService } from '../../services/api';
import { getImageUrl, formatDate, truncate } from '../../lib/utils';
import { Search, Filter, Calendar, Eye, X } from 'lucide-react';
import { useState } from 'react';

export default function BlogPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [showFilters, setShowFilters] = useState(false);

    const categoryId = searchParams.get('category') || '';
    const page = parseInt(searchParams.get('page') || '1');

    const { data, isLoading } = useQuery({
        queryKey: ['posts', { category_id: categoryId, page }],
        queryFn: () => postService.getAll({ category_id: categoryId, page }),
    });

    const posts = data?.data?.posts?.data || [];
    const categories = data?.data?.categories || [];
    const pagination = data?.data?.posts;

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams);
        if (search) {
            params.set('search', search);
        } else {
            params.delete('search');
        }
        params.set('page', '1');
        setSearchParams(params);
    };

    const handleCategoryChange = (catId) => {
        const params = new URLSearchParams(searchParams);
        if (catId) {
            params.set('category', catId);
        } else {
            params.delete('category');
        }
        params.set('page', '1');
        setSearchParams(params);
    };

    const clearFilters = () => {
        setSearch('');
        setSearchParams({});
    };

    return (
        <div className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Blog & <span className="gradient-text">Updates</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Stay informed about the latest news, events, and developments from Ilare Ward.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <form onSubmit={handleSearch} className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                    </form>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors md:hidden"
                    >
                        <Filter size={20} />
                        <span>Filters</span>
                    </button>
                </div>

                <div className="flex gap-8">
                    <aside className={`w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
                        <div className="sticky top-24">
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold">Categories</h3>
                                    <button
                                        onClick={() => setShowFilters(false)}
                                        className="md:hidden text-gray-400 hover:text-gray-600"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="space-y-1">
                                    <button
                                        onClick={() => handleCategoryChange('')}
                                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                                            !categoryId ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-gray-100'
                                        }`}
                                    >
                                        All Categories
                                    </button>
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => handleCategoryChange(cat.id)}
                                            className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center justify-between ${
                                                categoryId === String(cat.id) ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-gray-100'
                                            }`}
                                        >
                                            <span>{cat.name}</span>
                                            <span className="text-sm text-gray-500">{cat.posts_count}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    <div className="flex-1">
                        {(search || categoryId) && (
                            <div className="flex items-center gap-2 mb-6">
                                <span className="text-gray-600">Filters:</span>
                                {search && (
                                    <span className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                                        Search: {search}
                                    </span>
                                )}
                                {categoryId && (
                                    <span className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                                        {categories.find(c => String(c.id) === categoryId)?.name}
                                    </span>
                                )}
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-gray-500 hover:text-emerald-600"
                                >
                                    Clear all
                                </button>
                            </div>
                        )}

                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                                        <div className="h-48 bg-gray-200" />
                                        <div className="p-6 space-y-3">
                                            <div className="h-4 bg-gray-200 rounded w-1/4" />
                                            <div className="h-6 bg-gray-200 rounded" />
                                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-2xl">
                                <p className="text-gray-500">No posts found. Try adjusting your filters.</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {posts.map((post) => (
                                        <Link key={post.id} to={`/blog/${post.slug}`} className="card group">
                                            <div className="relative h-48 overflow-hidden">
                                                {post.featured_image ? (
                                                    <img
                                                        src={getImageUrl(post.featured_image)}
                                                        alt={post.title}
                                                        className="w-full h-full bg-gray-50 object-contain group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                                                        <span className="text-4xl text-emerald-300 font-bold">
                                                            {post.title?.charAt(0)}
                                                        </span>
                                                    </div>
                                                )}
                                                {post.is_featured && (
                                                    <span className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                                        Featured
                                                    </span>
                                                )}
                                            </div>
                                            <div className="p-6">
                                                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                                                    <span className="text-emerald-600 font-medium">{post.category?.name}</span>
                                                    <span>•</span>
                                                    <span className="flex items-center">
                                                        <Calendar size={14} className="mr-1" />
                                                        {formatDate(post.published_at)}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                                                    {post.title}
                                                </h3>
                                                <p className="text-gray-600 text-sm line-clamp-2">
                                                    {truncate(post.excerpt, 120)}
                                                </p>
                                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                                    <span className="text-sm text-gray-500 flex items-center">
                                                        <Eye size={14} className="mr-1" />
                                                        {post.views} views
                                                    </span>
                                                    <span className="text-sm text-emerald-600 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
                                                        Read more →
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {pagination && pagination.last_page > 1 && (
                                    <div className="flex justify-center mt-12">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => {
                                                    const params = new URLSearchParams(searchParams);
                                                    params.set('page', String(pagination.current_page - 1));
                                                    setSearchParams(params);
                                                }}
                                                disabled={!pagination.prev_page_url}
                                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Previous
                                            </button>
                                            <span className="px-4 py-2 text-gray-600">
                                                Page {pagination.current_page} of {pagination.last_page}
                                            </span>
                                            <button
                                                onClick={() => {
                                                    const params = new URLSearchParams(searchParams);
                                                    params.set('page', String(pagination.current_page + 1));
                                                    setSearchParams(params);
                                                }}
                                                disabled={!pagination.next_page_url}
                                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
