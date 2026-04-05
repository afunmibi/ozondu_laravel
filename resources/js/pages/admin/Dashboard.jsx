import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../../services/api';
import { Link } from 'react-router-dom';
import { FileText, Eye, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { formatDate } from '../../lib/utils';

export default function AdminDashboard() {
    const { data, isLoading } = useQuery({
        queryKey: ['admin-dashboard'],
        queryFn: dashboardService.getStats,
    });

    const stats = data?.data?.stats || {};
    const recentPosts = data?.data?.recent_posts || [];
    const popularPosts = data?.data?.popular_posts || [];

    const statCards = [
        { label: 'Total Posts', value: stats.total_posts, icon: FileText, color: 'bg-blue-500' },
        { label: 'Published', value: stats.published_posts, icon: TrendingUp, color: 'bg-emerald-500' },
        { label: 'Total Views', value: stats.total_views?.toLocaleString(), icon: Eye, color: 'bg-purple-500' },
        { label: 'Subscribers', value: stats.total_subscribers, icon: Users, color: 'bg-orange-500' },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Welcome back! Here's an overview of your content.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">{stat.label}</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">
                                    {isLoading ? '...' : stat.value}
                                </p>
                            </div>
                            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                                <stat.icon size={24} className="text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="font-semibold text-gray-900">Recent Posts</h2>
                        <Link to="/admin/posts" className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center">
                            View All <ArrowRight size={16} className="ml-1" />
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {recentPosts.length === 0 ? (
                            <div className="p-6 text-center text-gray-500">No posts yet</div>
                        ) : (
                            recentPosts.map((post) => (
                                <div key={post.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                                    <div>
                                        <p className="font-medium text-gray-900">{post.title}</p>
                                        <p className="text-sm text-gray-500">{formatDate(post.created_at)}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        post.status === 'published'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {post.status}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="font-semibold text-gray-900">Popular Posts</h2>
                        <Link to="/admin/posts" className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center">
                            View All <ArrowRight size={16} className="ml-1" />
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {popularPosts.length === 0 ? (
                            <div className="p-6 text-center text-gray-500">No posts yet</div>
                        ) : (
                            popularPosts.map((post, index) => (
                                <div key={post.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                                    <div className="flex items-center space-x-4">
                                        <span className="text-2xl font-bold text-gray-200">{String(index + 1).padStart(2, '0')}</span>
                                        <div>
                                            <p className="font-medium text-gray-900">{post.title}</p>
                                            <p className="text-sm text-gray-500 flex items-center">
                                                <Eye size={14} className="mr-1" />
                                                {post.views} views
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
