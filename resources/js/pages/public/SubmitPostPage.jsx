import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { postService, categoryService } from '../../services/api';
import toast from 'react-hot-toast';
import { Send } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SubmitPostPage() {
    const [form, setForm] = useState({
        title: '',
        author_name: '',
        author_email: '',
        category_id: '',
        content: '',
        featured_image: null,
    });
    const [submitting, setSubmitting] = useState(false);

    const { data: categoriesData } = useQuery({
        queryKey: ['categories'],
        queryFn: categoryService.getAll,
    });

    const categories = categoriesData?.data || [];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title || !form.author_name || !form.author_email || !form.category_id || !form.content) {
            toast.error('Please fill in all required fields');
            return;
        }
        if (form.content.length < 100) {
            toast.error('Content must be at least 100 characters');
            return;
        }

        setSubmitting(true);
        try {
            await postService.submit(form);
            toast.success('Post submitted successfully! It will be reviewed by our team.');
            setForm({
                title: '',
                author_name: '',
                author_email: '',
                category_id: '',
                content: '',
                featured_image: null,
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit post');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Submit a Post</h1>
                            <p className="text-gray-500 mt-1">Share your story or news with the community</p>
                        </div>
                        <Link to="/" className="text-emerald-600 hover:text-emerald-700 font-medium">
                            Back to Home
                        </Link>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Your Name *
                                </label>
                                <input
                                    type="text"
                                    value={form.author_name}
                                    onChange={(e) => setForm({ ...form, author_name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    value={form.author_email}
                                    onChange={(e) => setForm({ ...form, author_email: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Post Title *
                            </label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Enter a compelling title"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category *
                            </label>
                            <select
                                value={form.category_id}
                                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                required
                            >
                                <option value="">Select a category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Content * <span className="text-gray-400 text-sm">(min. 100 characters)</span>
                            </label>
                            <textarea
                                value={form.content}
                                onChange={(e) => setForm({ ...form, content: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 min-h-[200px]"
                                placeholder="Write your post content here..."
                                required
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                {form.content.length} / 100 characters minimum
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Featured Image <span className="text-gray-400">(optional)</span>
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setForm({ ...form, featured_image: e.target.files[0] })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                            <p className="text-sm text-gray-500 mt-1">Recommended size: 1200x800px, max 2MB</p>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full flex items-center justify-center px-6 py-4 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                        >
                            {submitting ? (
                                'Submitting...'
                            ) : (
                                <>
                                    <Send size={20} className="mr-2" />
                                    Submit Post
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
