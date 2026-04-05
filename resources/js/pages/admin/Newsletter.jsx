import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { subscriberService } from '../../services/api';
import toast from 'react-hot-toast';
import { Send, Mail, Users, Loader2 } from 'lucide-react';

export default function NewsletterPage() {
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [sending, setSending] = useState(false);

    const { data: subscribersData } = useQuery({
        queryKey: ['admin-subscribers'],
        queryFn: () => subscriberService.getAll({}),
    });

    const subscribers = subscribersData?.data?.data || [];
    const activeCount = subscribers.filter(s => s.status === 'active').length;

    const handleSend = async (e) => {
        e.preventDefault();
        
        if (!subject.trim()) {
            toast.error('Please enter a subject');
            return;
        }
        if (!content.trim() || content.length < 10) {
            toast.error('Please enter message content (min 10 characters)');
            return;
        }
        if (activeCount === 0) {
            toast.error('No active subscribers to send to');
            return;
        }

        if (!confirm(`Send newsletter to ${activeCount} subscribers?`)) {
            return;
        }

        setSending(true);
        try {
            const res = await subscriberService.sendNewsletter({ subject, content });
            toast.success(res.data.message);
            setSubject('');
            setContent('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send newsletter');
        } finally {
            setSending(false);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Newsletter</h1>
                    <p className="text-gray-600">Send emails to all your subscribers</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <Users size={24} className="text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Subscribers</p>
                            <p className="text-2xl font-bold text-gray-900">{subscribers.length}</p>
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
                            <Send size={24} className="text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Ready to Send</p>
                            <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Compose Newsletter</h2>
                    <p className="text-sm text-gray-500">Send to all active subscribers</p>
                </div>

                <form onSubmit={handleSend} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Subject Line *
                        </label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="Enter email subject"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Message Content *
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 min-h-[200px]"
                            placeholder="Write your newsletter content here..."
                            required
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            This will be sent as plain text to all {activeCount} subscribers
                        </p>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                        <p className="text-sm text-gray-500">
                            {activeCount} recipients will receive this email
                        </p>
                        <button
                            type="submit"
                            disabled={sending || activeCount === 0}
                            className="flex items-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {sending ? (
                                <>
                                    <Loader2 size={20} className="mr-2 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send size={20} className="mr-2" />
                                    Send Newsletter
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
