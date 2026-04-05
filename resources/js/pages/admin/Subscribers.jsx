import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriberService } from '../../services/api';
import { formatDate } from '../../lib/utils';
import toast from 'react-hot-toast';
import { Search, Download, Trash2, Mail, Users } from 'lucide-react';

export default function AdminSubscribers() {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    const { data, isLoading } = useQuery({
        queryKey: ['admin-subscribers', { search, page }],
        queryFn: () => subscriberService.getAll({ search, page }),
    });

    const subscribers = data?.data?.data || [];
    const pagination = data?.data;

    const deleteMutation = useMutation({
        mutationFn: subscriberService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-subscribers'] });
            toast.success('Subscriber deleted');
        },
        onError: () => toast.error('Failed to delete'),
    });

    const handleExport = async () => {
        try {
            const response = await subscriberService.export();
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'subscribers.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('Export downloaded');
        } catch (err) {
            toast.error('Export failed');
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this subscriber?')) {
            deleteMutation.mutate(id);
        }
    };

    const activeCount = subscribers.filter(s => s.status === 'active').length;

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Subscribers</h1>
                    <p className="text-gray-600">Manage your newsletter subscribers</p>
                </div>
                <button onClick={handleExport} className="btn-primary flex items-center">
                    <Download size={20} className="mr-2" />
                    Export CSV
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <Users size={24} className="text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Subscribers</p>
                            <p className="text-2xl font-bold text-gray-900">{pagination?.total || 0}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <Mail size={24} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Active</p>
                            <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                            <Mail size={24} className="text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Unverified</p>
                            <p className="text-2xl font-bold text-gray-900">{(pagination?.total || 0) - activeCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-4 border-b border-gray-100">
                    <div className="relative">
                        <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search subscribers..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subscribed</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600 mx-auto"></div>
                                    </td>
                                </tr>
                            ) : subscribers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        No subscribers found
                                    </td>
                                </tr>
                            ) : (
                                subscribers.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                                                    <Mail size={14} className="text-emerald-600" />
                                                </div>
                                                <span className="font-medium text-gray-900">{sub.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{sub.name || '-'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                sub.status === 'active'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-gray-100 text-gray-600'
                                            }`}>
                                                {sub.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{formatDate(sub.subscribed_at)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(sub.id)}
                                                className="p-2 text-gray-400 hover:text-red-600"
                                            >
                                                <Trash2 size={18} />
                                            </button>
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
        </div>
    );
}
