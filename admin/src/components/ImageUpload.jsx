import React, { useRef, useState, useEffect } from 'react';
import { Upload, X, ImageIcon, Loader2, Link, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

export default function ImageUpload({ value, onChange, hint, aspectHint, label = 'Image', required = false }) {
  const inputRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [localPreview, setLocalPreview] = useState(null); // blob URL for instant preview

  // Revoke blob URL when component unmounts or preview changes
  useEffect(() => {
    return () => { if (localPreview) URL.revokeObjectURL(localPreview); };
  }, [localPreview]);

  // Clear local preview when value is externally cleared
  useEffect(() => {
    if (!value && localPreview) {
      URL.revokeObjectURL(localPreview);
      setLocalPreview(null);
    }
  }, [value]);

  const upload = async (file) => {
    if (!file) return;
    const allowed = /\.(jpe?g|png|gif|webp|svg)$/i;
    if (!allowed.test(file.name)) {
      toast.error('Only image files are allowed (JPG, PNG, GIF, WebP, SVG)');
      return;
    }

    // Show local preview immediately — no waiting for S3
    const blobUrl = URL.createObjectURL(file);
    if (localPreview) URL.revokeObjectURL(localPreview);
    setLocalPreview(blobUrl);
    setUploading(true);

    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await api.post('/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onChange(res.data.url);
      toast.success('Image uploaded successfully!');
      setShowUrlInput(false);
    } catch (err) {
      URL.revokeObjectURL(blobUrl);
      setLocalPreview(null);
      toast.error(err?.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFile = (e) => upload(e.target.files[0]);
  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); upload(e.dataTransfer.files[0]); };
  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);

  const clear = () => {
    onChange('');
    if (localPreview) { URL.revokeObjectURL(localPreview); setLocalPreview(null); }
    if (inputRef.current) inputRef.current.value = '';
  };

  // Show local blob preview while uploading or right after; fall back to saved S3 URL
  const previewSrc = localPreview || value;
  const isUploaded = !uploading && value && localPreview; // just finished uploading

  return (
    <div>
      {/* Label row */}
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-sm font-medium text-gray-700">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        {hint && (
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <ImageIcon size={11} />
            {hint}{aspectHint && <span className="ml-1 px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 font-mono text-[10px]">{aspectHint}</span>}
          </span>
        )}
      </div>

      {/* Preview */}
      {previewSrc && (
        <div className="relative mb-2 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
          <img
            src={previewSrc}
            alt="Preview"
            className="w-full max-h-48 object-cover"
          />
          {/* Uploaded badge */}
          {isUploaded && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-white bg-opacity-90 rounded-full px-2 py-0.5 shadow-sm">
              <CheckCircle size={12} className="text-green-500" />
              <span className="text-[11px] font-medium text-gray-700">Saved to S3</span>
            </div>
          )}
          <button
            type="button"
            onClick={clear}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow"
            title="Remove image"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Upload zone */}
      <div
        className={`relative border-2 border-dashed rounded-lg transition-colors cursor-pointer ${
          dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-400 bg-gray-50'
        }`}
        onClick={() => !uploading && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="flex flex-col items-center justify-center py-5 px-4 text-center pointer-events-none select-none">
          {uploading ? (
            <>
              <Loader2 size={20} className="text-gray-400 animate-spin mb-2" />
              <p className="text-xs text-gray-500">Uploading to S3...</p>
            </>
          ) : (
            <>
              <Upload size={18} className="text-gray-400 mb-2" />
              <p className="text-xs text-gray-600 font-medium">
                {previewSrc ? 'Replace image' : 'Click or drag to upload'}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">JPG, PNG, WebP, SVG · max 5 MB</p>
            </>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
          className="hidden"
          onChange={handleFile}
          disabled={uploading}
        />
      </div>

      {/* URL fallback toggle */}
      <div className="mt-1.5">
        <button
          type="button"
          onClick={() => setShowUrlInput((v) => !v)}
          className="text-[11px] text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
        >
          <Link size={10} />
          {showUrlInput ? 'Hide URL input' : 'Or paste a URL instead'}
        </button>
        {showUrlInput && (
          <input
            type="url"
            value={value}
            onChange={(e) => { onChange(e.target.value); setLocalPreview(null); }}
            placeholder="https://example.com/image.jpg"
            className="mt-1.5 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
          />
        )}
      </div>
    </div>
  );
}
