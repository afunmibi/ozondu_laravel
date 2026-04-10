import { FileImage, FileVideo, Loader2, Upload } from 'lucide-react';

function formatFileSize(bytes) {
    if (!bytes) {
        return null;
    }

    if (bytes < 1024 * 1024) {
        return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function FileUploadStatus({ file, isUploading, kind = 'file' }) {
    if (!file) {
        return null;
    }

    const Icon = kind === 'video' ? FileVideo : kind === 'image' ? FileImage : Upload;
    const size = formatFileSize(file.size);

    return (
        <div className="mt-3 flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600">
            {isUploading ? (
                <Loader2 size={18} className="shrink-0 animate-spin text-emerald-600" />
            ) : (
                <Icon size={18} className="shrink-0 text-emerald-600" />
            )}
            <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-gray-700">{file.name}</p>
                <p className="text-xs text-gray-500">
                    {isUploading ? 'Uploading file...' : size || 'Ready to upload'}
                </p>
            </div>
        </div>
    );
}
