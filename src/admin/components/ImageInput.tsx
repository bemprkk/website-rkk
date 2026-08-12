import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';

interface ImageInputProps {
  label: string;
  value?: string;
  onChange: (base64: string) => void;
  className?: string;
}

const ImageInput: React.FC<ImageInputProps> = ({ label, value, onChange, className = '' }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar (JPG, PNG, dll)');
      return;
    }
    
    // Maksimal 2MB untuk base64 di localStorage agar tidak kepenuhan
    if (file.size > 2 * 1024 * 1024) {
      setError('Ukuran gambar maksimal 2MB');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result);
      }
    };
    reader.onerror = () => {
      setError('Gagal membaca file gambar');
    };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  return (
    <div className={`admin-input-group ${className}`}>
      <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--admin-text-muted)', fontSize: '0.9rem' }}>{label}</label>
      
      {value ? (
        <div style={{ position: 'relative', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid var(--admin-card-border)' }}>
          <img src={value} alt="Preview" style={{ width: '100%', height: 'auto', maxHeight: '200px', objectFit: 'cover', display: 'block' }} />
          <button
            type="button"
            onClick={() => onChange('')}
            style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', padding: '0.25rem', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragActive ? '#f97316' : 'var(--admin-input-border)'}`,
            borderRadius: '0.5rem',
            padding: '2rem 1rem',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: dragActive ? 'rgba(249, 115, 22, 0.05)' : 'var(--admin-input-bg)',
            transition: 'all 0.2s',
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            style={{ display: 'none' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--admin-text-muted)' }}>
            <Upload size={24} style={{ color: dragActive ? '#f97316' : '#6b7280' }} />
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              <span style={{ color: '#f97316', fontWeight: 600 }}>Klik untuk upload</span> atau drag and drop
            </p>
            <p style={{ margin: 0, fontSize: '0.75rem' }}>PNG, JPG up to 2MB</p>
          </div>
        </div>
      )}
      
      {error && (
        <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.5rem' }}>{error}</p>
      )}
    </div>
  );
};

export default ImageInput;
