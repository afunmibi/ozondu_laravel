import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { postService, commentService } from '../../services/api';
import { getImageUrl, formatDate, getSocialShareUrls } from '../../lib/utils';
import { Calendar, Eye, User as UserIcon, ArrowLeft, Clock, Share2, Link2, MessageCircle, Send } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function BlogPostPage() {
    const { slug } = useParams();
    const [copied, setCopied] = useState(false);
    const [commentData, setCommentData] = useState({ name: '', email: '', comment: '' });
    const [showCommentForm, setShowCommentForm] = useState(false);

    const { data, isLoading, error } = useQuery({
        queryKey: ['post', slug],
        queryFn: () => postService.getBySlug(slug),
    });

    const post = data?.data?.post;
    const relatedPosts = data?.data?.related_posts || [];

    const { data: commentsData } = useQuery({
        queryKey: ['comments', post?.id],
        queryFn: () => commentService.getApproved(post?.id),
        enabled: !!post?.id,
    });

    const comments = commentsData?.data || [];

    const commentMutation = useMutation({
        mutationFn: commentService.create,
        onSuccess: () => {
            toast.success('Comment submitted! It will appear after admin approval.');
            setCommentData({ name: '', email: '', comment: '' });
            setShowCommentForm(false);
        },
        onError: () => toast.error('Failed to submit comment'),
    });

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!commentData.name || !commentData.email || !commentData.comment) {
            toast.error('Please fill all fields');
            return;
        }
        commentMutation.mutate({ ...commentData, post_id: post.id });
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="py-24 text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
                <p className="text-gray-600 mb-8">The post you're looking for doesn't exist.</p>
                <Link to="/blog" className="btn-primary">
                    Back to Blog
                </Link>
            </div>
        );
    }

    const shareUrls = getSocialShareUrls(post);

    return (
        <div className="py-12">
            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link to="/blog" className="inline-flex items-center text-gray-600 hover:text-emerald-600 mb-8 transition-colors">
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Blog
                </Link>

                <header className="mb-10">
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                        <span className="bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-sm font-medium">
                            {post.category?.name}
                        </span>
                        {post.is_featured && (
                            <span className="bg-amber-100 text-amber-700 px-4 py-1 rounded-full text-sm font-medium">
                                Featured
                            </span>
                        )}
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-gray-600">
                        <div className="flex items-center">
                            <UserIcon size={18} className="mr-2" />
                            <span>{post.author?.name || 'Admin'}</span>
                        </div>
                        <div className="flex items-center">
                            <Calendar size={18} className="mr-2" />
                            <span>{formatDate(post.published_at)}</span>
                        </div>
                        <div className="flex items-center">
                            <Eye size={18} className="mr-2" />
                            <span>{post.views} views</span>
                        </div>
                        <div className="flex items-center">
                            <Clock size={18} className="mr-2" />
                            <span>{post.read_time} min read</span>
                        </div>
                    </div>
                </header>

                {post.featured_image && (
                    <figure className="mb-10 rounded-2xl overflow-hidden">
                        <img
                            src={getImageUrl(post.featured_image)}
                            alt={post.title}
                            className="w-full h-auto max-h-[500px] bg-gray-50 object-contain"
                        />
                    </figure>
                )}

                <div className="flex items-center justify-between py-6 border-y border-gray-200 mb-10">
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-600 flex items-center">
                            <Share2 size={18} className="mr-2" />
                            Share:
                        </span>
                        <a
                            href={shareUrls.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
                        >
                            <span className="text-sm font-bold">f</span>
                        </a>
                        <a
                            href={shareUrls.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 transition-colors"
                        >
                            <span className="text-sm font-bold">𝕏</span>
                        </a>
                        <a
                            href={shareUrls.whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors"
                        >
                            <MessageCircle size={18} />
                        </a>
                        <a
                            href={shareUrls.telegram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-blue-400 text-white flex items-center justify-center hover:bg-blue-500 transition-colors"
                        >
                            <Send size={18} />
                        </a>
                        <a
                            href={shareUrls.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 text-white flex items-center justify-center hover:from-purple-700 hover:to-pink-600 transition-colors"
                        >
                            <span className="text-sm font-bold">IG</span>
                        </a>
                        <button
                            onClick={handleCopyLink}
                            className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300 transition-colors"
                        >
                            {copied ? '✓' : '🔗'}
                        </button>
                    </div>
                </div>

                <div className="prose prose-lg max-w-none mb-16">
                    <div dangerouslySetInnerHTML={{ __html: post.content }} className="leading-relaxed" />
                </div>

                {relatedPosts.length > 0 && (
                    <section className="border-t border-gray-200 pt-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Posts</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedPosts.map((relatedPost) => (
                                <Link key={relatedPost.id} to={`/blog/${relatedPost.slug}`} className="card group">
                                    <div className="relative h-36 overflow-hidden">
                                        <img
                                            src={getImageUrl(relatedPost.featured_image)}
                                            alt={relatedPost.title}
                                            className="w-full h-full bg-gray-50 object-contain group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2">
                                            {relatedPost.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-2">{formatDate(relatedPost.published_at)}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </article>

            <section className="mt-12 pt-12 border-t border-gray-200">
                {!showCommentForm ? (
                    <button
                        onClick={() => setShowCommentForm(true)}
                        className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-emerald-500 hover:text-emerald-600 transition-colors"
                    >
                        Write a Comment
                    </button>
                ) : (
                    <form onSubmit={handleCommentSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave a Comment</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                <input
                                    type="text"
                                    value={commentData.name}
                                    onChange={(e) => setCommentData({ ...commentData, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder="Your name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                <input
                                    type="email"
                                    value={commentData.email}
                                    onChange={(e) => setCommentData({ ...commentData, email: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Comment *</label>
                            <textarea
                                value={commentData.comment}
                                onChange={(e) => setCommentData({ ...commentData, comment: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 min-h-[120px]"
                                placeholder="Write your comment here..."
                                required
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setShowCommentForm(false)}
                                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={commentMutation.isPending}
                                className="flex-1 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                            >
                                {commentMutation.isPending ? 'Submitting...' : 'Submit Comment'}
                            </button>
                        </div>
                    </form>
                )}

                {comments.length > 0 && (
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments ({comments.length})</h3>
                        <div className="space-y-4">
                            {comments.map((comment) => (
                                <div key={comment.id} className="bg-white rounded-lg p-4 border border-gray-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                                <span className="text-emerald-600 font-medium text-sm">
                                                    {comment.name?.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <span className="font-medium text-gray-900">{comment.name}</span>
                                        </div>
                                        <span className="text-sm text-gray-500">{formatDate(comment.created_at)}</span>
                                    </div>
                                    <p className="text-gray-600">{comment.comment}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}
