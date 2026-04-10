import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { galleryService } from '../../services/api';
import FileUploadStatus from '../../components/ui/FileUploadStatus';
import { getImageUrl } from '../../lib/utils';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Video, ToggleLeft, ToggleRight, Play, Loader2 } from 'lucide-react';

function isActiveStatus(value) {
    return value === true || value === 1 || value === '1' || value === 'active';
}

function toGalleryStatus(value) {
    return isActiveStatus(value) ? 'active' : 'inactive';
}

export default function AdminGalleries() {
    const queryClient = useQueryClient();
    const [type, setType] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const { data, isLoading } = useQuery({
        queryKey: ['admin-galleries', type],
        queryFn: () => galleryService.getAll({ type: type === 'all' ? undefined : type }),
    });

    const galleries = data?.data?.data || [];

    const deleteMutation = useMutation({
        mutationFn: galleryService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-galleries'] });
            toast.success('Item deleted');
        },
    });

    const toggleMutation = useMutation({
        mutationFn: galleryService.toggleStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-galleries'] });
            toast.success('Status updated');
        },
    });

    const openModal = (item = null) => {
        setEditingItem(item);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingItem(null);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this item?')) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gallery</h1>
                    <p className="text-gray-600">Manage images and videos</p>
                </div>
                <button onClick={() => openModal()} className="btn-primary flex items-center">
                    <Plus size={20} className="mr-2" />
                    Add Media
                </button>
            </div>

            <div className="flex gap-2 mb-6">
                {['all', 'image', 'video'].map((t) => (
                    <button
                        key={t}
                        onClick={() => setType(t)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            type === t ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        {t === 'all' ? 'All' : t === 'image' ? 'Images' : 'Videos'}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                {isLoading ? (
                    <div className="p-12 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600 mx-auto"></div>
                    </div>
                ) : galleries.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        No items in gallery yet
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-6">
                        {galleries.map((item) => (
                            <div key={item.id} className="relative group">
                                <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                                    {item.type === 'image' ? (
                                        <img
                                            src={getImageUrl(item.file_path)}
                                            alt={item.title}
                                            className="w-full h-full bg-gray-50 object-contain"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-900 flex items-center justify-center relative">
                                            <img
                                                src={getImageUrl(item.thumbnail)}
                                                alt={item.title}
                                                className="w-full h-full bg-gray-900 object-contain opacity-60"
                                            />
                                            <Play size={32} className="absolute text-white" />
                                        </div>
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => openModal(item)}
                                            className="p-2 bg-white rounded-lg text-gray-700 hover:text-blue-600"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-2 bg-white rounded-lg text-gray-700 hover:text-red-600"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleMutation.mutate(item.id)}
                                    className={`absolute top-2 right-2 p-1 rounded ${
                                        isActiveStatus(item.status) ? 'bg-emerald-500' : 'bg-gray-400'
                                    } text-white`}
                                >
                                    {isActiveStatus(item.status) ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                                </button>
                                <div className="mt-2">
                                    <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                                    <span className="text-xs text-gray-500">{item.type}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showModal && (
                <GalleryModal
                    item={editingItem}
                    onClose={closeModal}
                    onSuccess={() => {
                        closeModal();
                        queryClient.invalidateQueries({ queryKey: ['admin-galleries'] });
                    }}
                />
            )}
        </div>
    );
}

function GalleryModal({ item, onClose, onSuccess }) {
    const queryClient = useQueryClient();
    const [form, setForm] = useState({
        type: item?.type || 'image',
        title: item?.title || '',
        description: item?.description || '',
        file_path: null,
        video_url: item?.video_url || '',
        status: toGalleryStatus(item?.status),
    });

    const mutation = useMutation({
        mutationFn: (data) => item ? galleryService.update(item.id, data) : galleryService.create(data),
        onSuccess: () => {
            toast.success(item ? 'Updated' : 'Created');
            onSuccess();
        },
        onError: (error) => toast.error(error.response?.data?.message || 'Operation failed'),
    });

    const isSubmitting = mutation.isPending;

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmedDescription = form.description.trim();
        const trimmedVideoUrl = form.video_url.trim();

        if (form.type === 'image' && !form.file_path && !item?.file_path) {
            toast.error('Select an image file before saving');
            return;
        }

        if (form.type === 'video' && !form.file_path && !trimmedVideoUrl && !item?.file_path) {
            toast.error('Add a video file or paste a video URL');
            return;
        }

        mutation.mutate({
            ...form,
            description: trimmedDescription || null,
            video_url: trimmedVideoUrl || null,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-2xl w-full max-w-md">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold">{item ? 'Edit Media' : 'Add Media'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setForm({ ...form, type: 'image', video_url: '' })}
                            className={`flex-1 py-2 rounded-lg flex items-center justify-center ${
                                form.type === 'image' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100'
                            }`}
                        >
                            <ImageIcon size={18} className="mr-2" />
                            Image
                        </button>
                        <button
                            type="button"
                            onClick={() => setForm({ ...form, type: 'video' })}
                            className={`flex-1 py-2 rounded-lg flex items-center justify-center ${
                                form.type === 'video' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100'
                            }`}
                        >
                            <Video size={18} className="mr-2" />
                            Video
                        </button>
                    </div>

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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="input-field"
                            rows="2"
                        />
                    </div>

                    {form.type === 'image' ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Image File *</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setForm({ ...form, file_path: e.target.files[0] })}
                                className="w-full"
                                required={!item}
                                disabled={isSubmitting}
                            />
                            <FileUploadStatus file={form.file_path} isUploading={isSubmitting} kind="image" />
                            {item?.file_path && (
                                <img src={getImageUrl(item.file_path)} alt="" className="mt-2 h-32 w-full rounded bg-gray-50 object-contain" />
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Video File (MP4, MOV, AVI)</label>
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => setForm({ ...form, file_path: e.target.files[0] })}
                                    className="w-full"
                                    disabled={isSubmitting}
                                />
                                <FileUploadStatus file={form.file_path} isUploading={isSubmitting} kind="video" />
                                {item?.type === 'video' && !form.file_path ? (
                                    <p className="text-xs text-gray-500 mt-1">Leave empty to keep current video</p>
                                ) : (
                                    <p className="text-xs text-gray-500 mt-1">Upload a file or paste a video URL below.</p>
                                )}
                            </div>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">or</span>
                                <input
                                    type="text"
                                    value={form.video_url}
                                    onChange={(e) => setForm({ ...form, video_url: e.target.value })}
                                    className="input-field pl-8"
                                    placeholder="Video URL (YouTube, Vimeo)"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            value={form.status}
                            onChange={(e) => setForm({ ...form, status: e.target.value })}
                            className="input-field"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="btn-primary inline-flex items-center justify-center">
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={18} className="mr-2 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                item ? 'Update' : 'Create'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
