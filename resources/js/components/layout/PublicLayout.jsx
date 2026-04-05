import { Outlet, Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { homeService } from '../../services/api';
import { Menu, X, Home, BookOpen, Image, LogOut, ChevronDown, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';

export default function PublicLayout() {
    const location = useLocation();
    const { user, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    const { data } = useQuery({
        queryKey: ['home'],
        queryFn: homeService.getData,
    });

    const socialLinks = data?.data?.social_links || [];

    const navLinks = [
        { href: '/', label: 'Home', icon: Home },
        { href: '/blog', label: 'Blog', icon: BookOpen },
        { href: '/gallery', label: 'Gallery', icon: Image },
    ];

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    return (
        <div className="min-h-screen flex flex-col">
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link to="/" className="flex items-center space-x-2">
                            <img src="/storage/logo.png" alt="MAO" className="h-10 w-auto" />
                            <span className="font-bold text-xl text-gray-900 hidden sm:block">Hon. Ozondu</span>
                        </Link>

                        <div className="hidden md:flex items-center space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    to={link.href}
                                    className={cn(
                                        'text-gray-600 hover:text-emerald-600 font-medium transition-colors',
                                        location.pathname === link.href && 'text-emerald-600'
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        <div className="flex items-center space-x-4">
                            {user ? (
                                <div className="relative group">
                                    <button className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600">
                                        <UserIcon size={20} />
                                        <span className="hidden sm:inline">{user.name}</span>
                                        <ChevronDown size={16} />
                                    </button>
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                        <Link to="/admin/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                            Dashboard
                                        </Link>
                                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center">
                                            <LogOut size={16} className="mr-2" />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <Link to="/login" className="btn-primary text-sm py-2 px-4">
                                    Login
                                </Link>
                            )}

                            <button
                                className="md:hidden p-2 text-gray-600"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>

                    {mobileMenuOpen && (
                        <div className="md:hidden py-4 border-t border-gray-100">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.href}
                                        to={link.href}
                                        className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <Icon size={20} />
                                        <span>{link.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </nav>
            </header>

            <main className="flex-1">
                <Outlet />
            </main>

            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">MO</span>
                                </div>
                                <span className="font-bold text-xl">Hon. Muywa Adewale Ozondu</span>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Councillor representing Ilare Ward in Obokun LGA, Osun State. 
                                Committed to grassroots development and community service.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link></li>
                                <li><Link to="/blog" className="hover:text-emerald-400 transition-colors">Blog</Link></li>
                                <li><Link to="/gallery" className="hover:text-emerald-400 transition-colors">Gallery</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Connect With Us</h4>
                            <div className="flex space-x-4">
                                {socialLinks.map((link) => (
                                    <a
                                        key={link.id}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-emerald-600 transition-colors"
                                        title={link.platform}
                                    >
                                        <span className="text-lg">{getSocialIcon(link.platform)}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
                        <p>&copy; {new Date().getFullYear()} Hon. Muywa Adewale Ozondu. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function getSocialIcon(platform) {
    const icons = {
        facebook: '📘',
        twitter: '🐦',
        instagram: '📷',
        youtube: '▶️',
        whatsapp: '💬',
        telegram: '✈️',
    };
    return icons[platform.toLowerCase()] || '🔗';
}
