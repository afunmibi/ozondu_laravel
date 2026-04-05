import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentService } from '../../services/api';
import { formatDate } from '../../lib/utils';
import toast from 'react-hot-toast';
import { Search, Check, X, MessageCircle, User as UserIcon } from 'lucide-react';

export default function Comments() {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('pending');
    const [page, setPage] = useState(1);

    const { data, isLoading } = useQuery({
        queryKey: ['admin-comments', { search, status, page }],
        queryFn: () => commentService.getAll({ search, status, page }),
    });

    const comments = data?.data?.data || [];
    const pagination = data?.data;

    const approveMutation = useMutation({
        mutationFn: commentService.approve,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-comments'] });
            toast.success('Comment approved');
        },
    });

    const rejectMutation = useMutation({
        mutationFn: commentService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-comments'] });
            toast.success('Comment rejected');
        },
    });

    const handleApprove = (id) => {
        approveMutation.mutate(id);
    };

    const handleReject = (id) => {
        if (confirm('Reject and delete this comment?')) {
            rejectMutation.mutate(id);
        }
    };

    const pendingCount = comments.filter(c => !c.is_approved).length;

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Comments</h1>
                    <p className="text-gray-600">Manage post comments</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                            <MessageCircle size={24} className="text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Pending</p>
                            <p className="text-2xl font-bold text-gray-900">{pagination?.total || 0}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search comments..."
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
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comment</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Post</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
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
                            ) : comments.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        No comments found
                                    </td>
                                </tr>
                            ) : (
                                comments.map((comment) => (
                                    <tr key={comment.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-900 line-clamp-2 max-w-xs">{comment.comment}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {comment.post?.title || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <UserIcon size={14} className="text-gray-400" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{comment.name}</p>
                                                    <p className="text-xs text-gray-500">{comment.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                comment.is_approved
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {comment.is_approved ? 'Approved' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{formatDate(comment.created_at)}</td>
                                        <td className="px-6 py-4 text-right">
                                            {!comment.is_approved && (
                                                <button
                                                    onClick={() => handleApprove(comment.id)}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg mr-2"
                                                    title="Approve"
                                                >
                                                    <Check size={18} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleReject(comment.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                title="Reject"
                                            >
                                                <X size={18} />
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
