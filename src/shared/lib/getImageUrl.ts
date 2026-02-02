import { API_CONFIG } from '../config';

export const getImageUrl = (image?: string | null): string => {
    if (!image) return '';
    if (image.startsWith('http')) return image;
    
    return `${API_CONFIG.adminBaseUrl}${image.startsWith('/') ? '' : '/'}${image}`;
}