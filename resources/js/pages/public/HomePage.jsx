import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { homeService } from '../../services/api';
import { getImageUrl, formatDate, truncate } from '../../lib/utils';
import { ArrowRight, Eye, Calendar, ChevronLeft, ChevronRight, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { subscriberService } from '../../services/api';

export default function HomePage() {
    const { data, isLoading } = useQuery({
        queryKey: ['home'],
        queryFn: homeService.getData,
    });

    const [currentSlide, setCurrentSlide] = useState(0);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [subscribing, setSubscribing] = useState(false);

    const sliders = data?.data?.sliders || [];
    const featuredPosts = data?.data?.featured_posts || [];
    const latestPosts = data?.data?.latest_posts || [];
    const popularPosts = data?.data?.popular_posts || [];
    const categories = data?.data?.categories || [];
    const galleryImages = data?.data?.gallery_images || [];

    useEffect(() => {
        if (sliders.length > 1) {
            const interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % sliders.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [sliders.length]);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;
        
        setSubscribing(true);
        try {
            await subscriberService.subscribe({ email, name });
            toast.success('Successfully subscribed!');
            setEmail('');
            setName('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to subscribe');
        } finally {
            setSubscribing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    return (
        <div>
            {sliders.length > 0 && (
                <section className="relative h-[500px] md:h-[600px] overflow-hidden">
                    {sliders.map((slider, index) => (
                        <div
                            key={slider.id}
                            className={`absolute inset-0 transition-opacity duration-700 ${
                                index === currentSlide ? 'opacity-100' : 'opacity-0'
                            }`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 z-10" />
                            <img
                                src={getImageUrl(slider.image)}
                                alt={slider.title}
                                className="w-full h-full bg-gray-900 object-contain"
                            />
                            <div className="absolute inset-0 z-20 flex items-center">
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                                    <div className="max-w-2xl">
                                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                                            {slider.title}
                                        </h1>
                                        {slider.subtitle && (
                                            <p className="text-xl text-gray-200 mb-6">{slider.subtitle}</p>
                                        )}
                                        {slider.button_text && slider.button_url && (
                                            <a
                                                href={slider.button_url}
                                                className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                                            >
                                                {slider.button_text}
                                                <ArrowRight size={20} className="ml-2" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {sliders.length > 1 && (
                        <>
                            <button
                                onClick={() => setCurrentSlide((prev) => (prev - 1 + sliders.length) % sliders.length)}
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={() => setCurrentSlide((prev) => (prev + 1) % sliders.length)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                            >
                                <ChevronRight size={24} />
                            </button>
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
                                {sliders.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentSlide(index)}
                                        className={`w-3 h-3 rounded-full transition-all ${
                                            index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
                                        }`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </section>
            )}

            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="section-title">Latest Updates</h2>
                                    <p className="text-gray-500">Stay informed with recent news</p>
                                </div>
                                <Link to="/blog" className="flex items-center text-emerald-600 hover:text-emerald-700 font-medium">
                                    View All <ArrowRight size={18} className="ml-1" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {latestPosts.map((post) => (
                                    <Link key={post.id} to={`/blog/${post.slug}`} className="card group">
                                        <div className="relative h-40 overflow-hidden">
                                            {post.featured_image ? (
                                                <img
                                                    src={getImageUrl(post.featured_image)}
                                                    alt={post.title}
                                                    className="w-full h-full bg-gray-50 object-contain group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                                                    <span className="text-3xl text-emerald-300 font-bold">
                                                        {post.title?.charAt(0)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-5">
                                            <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
                                                <span className="text-emerald-600">{post.category?.name}</span>
                                                <span>•</span>
                                                <span>{formatDate(post.published_at)}</span>
                                            </div>
                                            <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2">
                                                {post.title}
                                            </h3>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                                <h3 className="font-bold text-sm mb-2">Categories</h3>
                                <div className="space-y-1">
                                    {categories.map((cat) => (
                                        <Link
                                            key={cat.id}
                                            to={`/blog?category=${cat.id}`}
                                            className="flex items-center justify-between py-1 text-xs text-gray-600 hover:text-emerald-600"
                                        >
                                            <span>{cat.name}</span>
                                            <span className="text-gray-400">({cat.posts_count})</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                                <h3 className="font-bold text-sm mb-2">Popular</h3>
                                <div className="space-y-2">
                                    {popularPosts.slice(0, 3).map((post, index) => (
                                        <Link key={post.id} to={`/blog/${post.slug}`} className="flex items-start gap-2 group">
                                            <span className="text-xs font-bold text-gray-300">{index + 1}</span>
                                            <h4 className="font-medium text-gray-700 text-xs group-hover:text-emerald-600 line-clamp-2">
                                                {post.title}
                                            </h4>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg p-2 text-white">
                                <h3 className="font-semibold text-xs mb-1">Newsletter</h3>
                                <form onSubmit={handleSubscribe} className="flex gap-1">
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="flex-1 px-2 py-1 rounded bg-white/20 placeholder-emerald-200 text-white border border-white/30 focus:outline-none focus:border-white text-xs"
                                    />
                                    <button
                                        type="submit"
                                        disabled={subscribing}
                                        className="px-2 py-1 bg-white text-emerald-700 font-semibold rounded text-xs"
                                    >
                                        {subscribing ? '...' : 'Go'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {featuredPosts.length > 0 && (
                <section className="py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="section-title">Featured Posts</h2>
                                <p className="text-gray-500">Don't miss these important updates</p>
                            </div>
                            <Link to="/blog" className="hidden sm:flex items-center text-emerald-600 hover:text-emerald-700 font-medium">
                                View All <ArrowRight size={18} className="ml-1" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {featuredPosts.map((post) => (
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
                                        <span className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                            Featured
                                        </span>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                                            <Calendar size={14} />
                                            <span>{formatDate(post.published_at)}</span>
                                            <span>•</span>
                                            <Eye size={14} />
                                            <span>{post.views} views</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                                            {post.title}
                                        </h3>
                                        <p className="text-gray-600 line-clamp-2">{truncate(post.excerpt, 100)}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {galleryImages.length > 0 && (
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="section-title">Photo Gallery</h2>
                                <p className="text-gray-500">Moments captured from events and activities</p>
                            </div>
                            <Link to="/gallery" className="flex items-center text-emerald-600 hover:text-emerald-700 font-medium">
                                View All <ArrowRight size={18} className="ml-1" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {galleryImages.slice(0, 8).map((image) => (
                                <div key={image.id} className="relative aspect-square overflow-hidden rounded-xl group cursor-pointer">
                                    <img
                                        src={getImageUrl(image.file_path)}
                                        alt={image.title}
                                        className="w-full h-full bg-gray-50 object-contain group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                                            {image.title}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
