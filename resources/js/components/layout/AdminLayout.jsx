import { Outlet, Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
    LayoutDashboard, FileText, Folder, Image, Sliders, Users, 
    LogOut, Menu, X, ChevronRight, Mail, MessageCircle 
} from 'lucide-react';
import { useState } from 'react';

const sidebarLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/posts', icon: FileText, label: 'Posts' },
    { to: '/admin/categories', icon: Folder, label: 'Categories' },
    { to: '/admin/galleries', icon: Image, label: 'Galleries' },
    { to: '/admin/sliders', icon: Sliders, label: 'Sliders' },
    { to: '/admin/subscribers', icon: Users, label: 'Subscribers' },
    { to: '/admin/comments', icon: MessageCircle, label: 'Comments' },
    { to: '/admin/newsletter', icon: Mail, label: 'Newsletter' },
];

export default function AdminLayout() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-gray-900 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-gray-800">
                        <Link to="/" className="flex items-center space-x-3">
                            <img src="/storage/logo.png" alt="MAO" className="h-10 w-auto" />
                            <div>
                                <span className="text-white font-bold block">Admin Panel</span>
                                <span className="text-gray-400 text-xs">Ozondu CMS</span>
                            </div>
                        </Link>
                    </div>

                    <nav className="flex-1 p-4 space-y-1">
                        {sidebarLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                onClick={() => setSidebarOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                                        isActive
                                            ? 'bg-emerald-600 text-white'
                                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }`
                                }
                            >
                                <link.icon size={20} />
                                <span>{link.label}</span>
                            </NavLink>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-gray-800">
                        <Link to="/" className="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-white transition-colors mb-2">
                            <ChevronRight size={20} />
                            <span>Back to Site</span>
                        </Link>
                        <div className="flex items-center space-x-3 px-4 py-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-medium truncate">{user?.name}</p>
                                <p className="text-gray-400 text-xs truncate">{user?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-gray-800 rounded-lg transition-colors mt-2"
                        >
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            <div className="lg:pl-64">
                <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between px-4 py-4">
                        <button
                            className="lg:hidden p-2 text-gray-600"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        
                        <div className="flex-1 lg:flex-none" />

                        <div className="flex items-center space-x-4">
                            <Link to="/" className="text-sm text-gray-600 hover:text-emerald-600 transition-colors">
                                View Site
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="p-6">
                    <Outlet />
                </main>
            </div>

            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}
