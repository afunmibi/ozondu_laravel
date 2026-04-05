import { useQuery } from '@tanstack/react-query';
import { galleryService } from '../../services/api';
import { getImageUrl } from '../../lib/utils';
import { useState } from 'react';
import { X, Play, Image as ImageIcon } from 'lucide-react';

export default function GalleryPage() {
    const [filter, setFilter] = useState('all');
    const [lightbox, setLightbox] = useState(null);

    const { data, isLoading } = useQuery({
        queryKey: ['galleries'],
        queryFn: () => galleryService.getAll(),
    });

    const galleries = data?.data?.data || [];

    const filteredGalleries = galleries.filter(item => {
        if (filter === 'all') return true;
        return item.type === filter;
    });

    const images = galleries.filter(g => g.type === 'image');
    const videos = galleries.filter(g => g.type === 'video');

    return (
        <div className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Photo & <span className="gradient-text">Video Gallery</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Browse through moments captured from events, community activities, and more.
                    </p>
                </div>

                <div className="flex justify-center mb-10">
                    <div className="inline-flex bg-gray-100 rounded-xl p-1">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-6 py-2 rounded-lg font-medium transition-all ${
                                filter === 'all'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            All ({galleries.length})
                        </button>
                        <button
                            onClick={() => setFilter('image')}
                            className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center ${
                                filter === 'image'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <ImageIcon size={18} className="mr-2" />
                            Photos ({images.length})
                        </button>
                        <button
                            onClick={() => setFilter('video')}
                            className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center ${
                                filter === 'video'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <Play size={18} className="mr-2" />
                            Videos ({videos.length})
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : filteredGalleries.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl">
                        <p className="text-gray-500">No items in the gallery yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredGalleries.map((item) => (
                            <div
                                key={item.id}
                                className="relative aspect-square group cursor-pointer overflow-hidden rounded-xl"
                                onClick={() => setLightbox(item)}
                            >
                                {item.type === 'image' ? (
                                    <img
                                        src={getImageUrl(item.file_path)}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-900 flex items-center justify-center relative">
                                        {item.file_path ? (
                                            <video
                                                src={getImageUrl(item.file_path)}
                                                className="w-full h-full object-cover"
                                                muted
                                                onMouseOver={(e) => e.target.play()}
                                                onMouseOut={(e) => { e.target.pause(); e.target.currentTime = 0; }}
                                            />
                                        ) : item.thumbnail ? (
                                            <img
                                                src={getImageUrl(item.thumbnail)}
                                                alt={item.title}
                                                className="w-full h-full object-cover opacity-60"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                                <Play size={40} className="text-gray-600" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                                                <Play size={32} className="text-gray-900 ml-1" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h3 className="text-white font-medium">{item.title}</h3>
                                        {item.description && (
                                            <p className="text-white/80 text-sm line-clamp-2 mt-1">{item.description}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {lightbox && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
                    onClick={() => setLightbox(null)}
                >
                    <button
                        className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                        onClick={() => setLightbox(null)}
                    >
                        <X size={24} />
                    </button>
                    <div className="max-w-5xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
                        {lightbox.type === 'image' ? (
                            <img
                                src={getImageUrl(lightbox.file_path)}
                                alt={lightbox.title}
                                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                            />
                        ) : lightbox.file_path ? (
                            <video
                                controls
                                autoPlay
                                className="w-full max-h-[80vh] rounded-lg"
                            >
                                <source src={getImageUrl(lightbox.file_path)} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        ) : lightbox.video_url ? (
                            <div className="aspect-video">
                                <iframe
                                    src={lightbox.video_url}
                                    title={lightbox.title}
                                    className="w-full h-full rounded-lg"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        ) : null}
                        <div className="mt-4 text-center">
                            <h3 className="text-white text-xl font-medium">{lightbox.title}</h3>
                            {lightbox.description && (
                                <p className="text-white/70 mt-2">{lightbox.description}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
