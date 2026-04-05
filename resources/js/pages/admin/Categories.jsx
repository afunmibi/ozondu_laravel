import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../../services/api';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Palette } from 'lucide-react';

export default function AdminCategories() {
    const queryClient = useQueryClient();
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState('#10b981');

    const { data, isLoading } = useQuery({
        queryKey: ['admin-categories'],
        queryFn: categoryService.getAll,
    });

    const categories = data?.data || [];

    const createMutation = useMutation({
        mutationFn: categoryService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
            toast.success('Category created');
            closeModal();
        },
        onError: (err) => toast.error(err.response?.data?.errors?.name?.[0] || 'Failed to create'),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => categoryService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
            toast.success('Category updated');
            closeModal();
        },
        onError: (err) => toast.error(err.response?.data?.errors?.name?.[0] || 'Failed to update'),
    });

    const deleteMutation = useMutation({
        mutationFn: categoryService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
            toast.success('Category deleted');
        },
        onError: () => toast.error('Failed to delete category'),
    });

    const openModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setName(category.name);
            setDescription(category.description || '');
            setColor(category.color || '#10b981');
        } else {
            setEditingCategory(null);
            setName('');
            setDescription('');
            setColor('#10b981');
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingCategory(null);
        setName('');
        setDescription('');
        setColor('#10b981');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = { name, description, color };
        if (editingCategory) {
            updateMutation.mutate({ id: editingCategory.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure? Posts in this category will become uncategorized.')) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                    <p className="text-gray-600">Organize your posts with categories</p>
                </div>
                <button onClick={() => openModal()} className="btn-primary flex items-center">
                    <Plus size={20} className="mr-2" />
                    New Category
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                {isLoading ? (
                    <div className="p-12 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600 mx-auto"></div>
                    </div>
                ) : categories.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        No categories yet. Create your first one!
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {categories.map((cat) => (
                            <div key={cat.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
                                <div className="flex items-center space-x-4">
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: cat.color || '#10b981' }}
                                    />
                                    <div>
                                        <p className="font-medium text-gray-900">{cat.name}</p>
                                        {cat.description && (
                                            <p className="text-sm text-gray-500">{cat.description}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                                        {cat.posts_count} posts
                                    </span>
                                    <button
                                        onClick={() => openModal(cat)}
                                        className="p-2 text-gray-400 hover:text-blue-600"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cat.id)}
                                        className="p-2 text-gray-400 hover:text-red-600"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-2xl w-full max-w-md">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold">
                                {editingCategory ? 'Edit Category' : 'New Category'}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="input-field"
                                    placeholder="Category name"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="input-field"
                                    rows="2"
                                    placeholder="Optional description"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                    <Palette size={16} className="mr-2" />
                                    Color
                                </label>
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="color"
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                        className="w-12 h-12 rounded cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                        className="input-field flex-1"
                                        placeholder="#10b981"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4 pt-4">
                                <button type="button" onClick={closeModal} className="btn-secondary">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    {editingCategory ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
