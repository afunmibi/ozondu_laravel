import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postService, categoryService } from '../../services/api';
import { getImageUrl, formatDate } from '../../lib/utils';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Eye, Search, X, ToggleLeft, ToggleRight } from 'lucide-react';

export default function AdminPosts() {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [page, setPage] = useState(1);

    const { data, isLoading } = useQuery({
        queryKey: ['admin-posts', { search, status, page }],
        queryFn: () => postService.getAll({ search, status, page }),
    });

    const categoriesQuery = useQuery({
        queryKey: ['admin-categories'],
        queryFn: categoryService.getAll,
    });

    const posts = data?.data?.posts?.data || [];
    const pagination = data?.data?.posts;
    const categories = categoriesQuery.data?.data || [];

    const deleteMutation = useMutation({
        mutationFn: postService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
            toast.success('Post deleted successfully');
        },
        onError: () => toast.error('Failed to delete post'),
    });

    const toggleStatusMutation = useMutation({
        mutationFn: postService.toggleStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
            toast.success('Status updated');
        },
    });

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this post?')) {
            deleteMutation.mutate(id);
        }
    };

    const handleEdit = (post) => {
        setEditingPost(post);
        setShowModal(true);
    };

    const handleNew = () => {
        setEditingPost(null);
        setShowModal(true);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
                    <p className="text-gray-600">Manage your blog posts</p>
                </div>
                <button onClick={handleNew} className="btn-primary flex items-center">
                    <Plus size={20} className="mr-2" />
                    New Post
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="">All Status</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Post</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600 mx-auto"></div>
                                    </td>
                                </tr>
                            ) : posts.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        No posts found
                                    </td>
                                </tr>
                            ) : (
                                posts.map((post) => (
                                    <tr key={post.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <img
                                                    src={getImageUrl(post.featured_image)}
                                                    alt=""
                                                    className="w-12 h-12 rounded-lg object-cover"
                                                />
                                                <div>
                                                    <p className="font-medium text-gray-900 line-clamp-1">{post.title}</p>
                                                    <p className="text-sm text-gray-500 flex items-center">
                                                        <Eye size={14} className="mr-1" />
                                                        {post.views} views
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-600">{post.category?.name}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleStatusMutation.mutate(post.id)}
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                    post.status === 'published'
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : 'bg-gray-100 text-gray-600'
                                                }`}
                                            >
                                                {post.status === 'published' ? (
                                                    <ToggleRight size={16} className="mr-1" />
                                                ) : (
                                                    <ToggleLeft size={16} className="mr-1" />
                                                )}
                                                {post.status}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{post.views}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{formatDate(post.created_at)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <a
                                                    href={`/blog/${post.slug}`}
                                                    target="_blank"
                                                    className="p-2 text-gray-400 hover:text-emerald-600"
                                                >
                                                    <Eye size={18} />
                                                </a>
                                                <button
                                                    onClick={() => handleEdit(post)}
                                                    className="p-2 text-gray-400 hover:text-blue-600"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(post.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {pagination && pagination.last_page > 1 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                            Showing {pagination.from} to {pagination.to} of {pagination.total}
                        </span>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={!pagination.prev_page_url}
                                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={!pagination.next_page_url}
                                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {showModal && (
                <PostModal
                    post={editingPost}
                    categories={categories}
                    onClose={() => setShowModal(false)}
                    onSuccess={() => {
                        setShowModal(false);
                        queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
                    }}
                />
            )}
        </div>
    );
}

function PostModal({ post, categories, onClose, onSuccess }) {
    const queryClient = useQueryClient();
    const [form, setForm] = useState({
        title: post?.title || '',
        category_id: post?.category_id || '',
        excerpt: post?.excerpt || '',
        content: post?.content || '',
        status: post?.status || 'draft',
        is_featured: post?.is_featured || false,
        featured_image: null,
    });
    const [loading, setLoading] = useState(false);

    const mutation = useMutation({
        mutationFn: (data) => post ? postService.update(post.id, data) : postService.create(data),
        onSuccess: () => {
            toast.success(post ? 'Post updated' : 'Post created');
            onSuccess();
        },
        onError: (err) => toast.error(err.response?.data?.message || 'Operation failed'),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Convert boolean to 1/0 for FormData compatibility
        const formData = {
            ...form,
            is_featured: form.is_featured ? 1 : 0,
        };
        mutation.mutate(formData);
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold">{post ? 'Edit Post' : 'New Post'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="input-field"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                value={form.category_id}
                                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                                className="input-field"
                                required
                            >
                                <option value="">Select category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                value={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.value })}
                                className="input-field"
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                        <textarea
                            value={form.excerpt}
                            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                            className="input-field"
                            rows="2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                        <textarea
                            value={form.content}
                            onChange={(e) => setForm({ ...form, content: e.target.value })}
                            className="input-field"
                            rows="10"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setForm({ ...form, featured_image: e.target.files[0] })}
                            className="w-full"
                        />
                        {post?.featured_image && (
                            <img src={getImageUrl(post.featured_image)} alt="" className="mt-2 h-32 object-cover rounded" />
                        )}
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="is_featured"
                            checked={form.is_featured}
                            onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                            className="w-4 h-4 text-emerald-600 rounded"
                        />
                        <label htmlFor="is_featured" className="ml-2 text-sm text-gray-700">
                            Mark as featured
                        </label>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="btn-primary">
                            {loading ? 'Saving...' : (post ? 'Update' : 'Create')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
