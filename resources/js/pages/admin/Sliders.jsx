import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sliderService } from '../../services/api';
import { getImageUrl } from '../../lib/utils';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, GripVertical, ToggleLeft, ToggleRight } from 'lucide-react';

export default function AdminSliders() {
    const queryClient = useQueryClient();
    const [showModal, setShowModal] = useState(false);
    const [editingSlider, setEditingSlider] = useState(null);

    const { data, isLoading } = useQuery({
        queryKey: ['admin-sliders'],
        queryFn: sliderService.getAll,
    });

    const sliders = data?.data || [];

    const createMutation = useMutation({
        mutationFn: sliderService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-sliders'] });
            toast.success('Slider created');
            closeModal();
        },
        onError: () => toast.error('Failed to create'),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => sliderService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-sliders'] });
            toast.success('Slider updated');
            closeModal();
        },
        onError: () => toast.error('Failed to update'),
    });

    const deleteMutation = useMutation({
        mutationFn: sliderService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-sliders'] });
            toast.success('Slider deleted');
        },
    });

    const toggleMutation = useMutation({
        mutationFn: sliderService.toggleStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-sliders'] });
            toast.success('Status updated');
        },
    });

    const openModal = (slider = null) => {
        setEditingSlider(slider);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingSlider(null);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure?')) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Hero Sliders</h1>
                    <p className="text-gray-600">Manage homepage carousel slides</p>
                </div>
                <button onClick={() => openModal()} className="btn-primary flex items-center">
                    <Plus size={20} className="mr-2" />
                    Add Slide
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                {isLoading ? (
                    <div className="p-12 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600 mx-auto"></div>
                    </div>
                ) : sliders.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        No slides yet. Create your first hero slide!
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {sliders.map((slider, index) => (
                            <div key={slider.id} className="p-6 flex items-center">
                                <div className="text-gray-400 mr-4">
                                    <GripVertical size={20} />
                                </div>
                                <div className="flex-shrink-0 w-32 h-20 rounded-lg overflow-hidden mr-6">
                                    <img
                                        src={getImageUrl(slider.image)}
                                        alt={slider.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900">{slider.title}</p>
                                    <p className="text-sm text-gray-500 truncate">{slider.subtitle}</p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <span className="text-xs text-gray-400">Order: {slider.sort_order || index + 1}</span>
                                        {slider.button_text && (
                                            <span className="text-xs text-gray-400">Button: {slider.button_text}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => toggleMutation.mutate(slider.id)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${
                                            slider.status === 'active'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-gray-100 text-gray-600'
                                        }`}
                                    >
                                        {slider.status === 'active' ? <ToggleRight size={16} className="mr-1" /> : <ToggleLeft size={16} className="mr-1" />}
                                        {slider.status}
                                    </button>
                                    <button onClick={() => openModal(slider)} className="p-2 text-gray-400 hover:text-blue-600">
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(slider.id)} className="p-2 text-gray-400 hover:text-red-600">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showModal && (
                <SliderModal
                    slider={editingSlider}
                    onClose={closeModal}
                    onSuccess={() => {
                        closeModal();
                        queryClient.invalidateQueries({ queryKey: ['admin-sliders'] });
                    }}
                    onSubmit={(data, isEdit) => {
                        if (isEdit) {
                            updateMutation.mutate({ id: editingSlider.id, data });
                        } else {
                            createMutation.mutate(data);
                        }
                    }}
                />
            )}
        </div>
    );
}

function SliderModal({ slider, onClose, onSuccess, onSubmit }) {
    const [form, setForm] = useState({
        title: slider?.title || '',
        subtitle: slider?.subtitle || '',
        button_text: slider?.button_text || '',
        button_url: slider?.button_url || '',
        sort_order: slider?.sort_order || '',
        status: slider?.status || 'active',
        image: null,
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        onSubmit(form, !!slider);
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-2xl w-full max-w-lg">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold">{slider ? 'Edit Slide' : 'Add Slide'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="input-field"
                            placeholder="Slide title"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                        <input
                            type="text"
                            value={form.subtitle}
                            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                            className="input-field"
                            placeholder="Optional subtitle"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                            <input
                                type="text"
                                value={form.button_text}
                                onChange={(e) => setForm({ ...form, button_text: e.target.value })}
                                className="input-field"
                                placeholder="Learn More"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Button URL</label>
                            <input
                                type="url"
                                value={form.button_url}
                                onChange={(e) => setForm({ ...form, button_url: e.target.value })}
                                className="input-field"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                            <input
                                type="number"
                                value={form.sort_order}
                                onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                                className="input-field"
                                placeholder="1"
                            />
                        </div>
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
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Background Image {slider ? '(Leave empty to keep current)' : '*'}
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
                            className="w-full"
                            required={!slider}
                        />
                        {slider?.image && (
                            <img src={getImageUrl(slider.image)} alt="" className="mt-2 h-32 w-full object-cover rounded" />
                        )}
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                        <button type="submit" disabled={loading} className="btn-primary">
                            {loading ? 'Saving...' : (slider ? 'Update' : 'Create')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
