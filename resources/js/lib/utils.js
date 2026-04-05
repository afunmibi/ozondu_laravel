import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function formatDate(date) {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export function truncate(str, length = 100) {
    if (!str) return '';
    return str.length > length ? str.substring(0, length) + '...' : str;
}

export function getImageUrl(path) {
    if (!path || path === 'null' || path === 'undefined') return null;
    if (path.startsWith('http')) return path;
    return '/storage/' + path;
}

export function getSocialShareUrls(post) {
    const url = encodeURIComponent(window.location.origin + '/blog/' + post.slug);
    const title = encodeURIComponent(post.title);
    const text = encodeURIComponent(post.excerpt || post.title);
    const username = 'ozondu';

    return {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
        whatsapp: `https://wa.me/?text=${title}%20${url}`,
        telegram: `https://t.me/share/url?url=${url}&text=${text}`,
        instagram: `https://www.instagram.com/${username}`,
    };
}
