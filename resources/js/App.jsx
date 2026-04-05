import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';
import HomePage from './pages/public/HomePage';
import BlogPage from './pages/public/BlogPage';
import BlogPostPage from './pages/public/BlogPostPage';
import GalleryPage from './pages/public/GalleryPage';
import SubmitPostPage from './pages/public/SubmitPostPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/admin/Dashboard';
import AdminPosts from './pages/admin/Posts';
import AdminCategories from './pages/admin/Categories';
import AdminGalleries from './pages/admin/Galleries';
import AdminSliders from './pages/admin/Sliders';
import AdminSubscribers from './pages/admin/Subscribers';
import Newsletter from './pages/admin/Newsletter';
import Comments from './pages/admin/Comments';

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
            </div>
        );
    }
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
}

export default function App() {
    return (
        <Routes>
            <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/submit-post" element={<SubmitPostPage />} />
            </Route>
            
            <Route path="/login" element={<LoginPage />} />
            
            <Route path="/admin" element={
                <ProtectedRoute>
                    <AdminLayout />
                </ProtectedRoute>
            }>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="posts" element={<AdminPosts />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="galleries" element={<AdminGalleries />} />
                <Route path="sliders" element={<AdminSliders />} />
                <Route path="subscribers" element={<AdminSubscribers />} />
                <Route path="newsletter" element={<Newsletter />} />
                <Route path="comments" element={<Comments />} />
            </Route>
        </Routes>
    );
}
