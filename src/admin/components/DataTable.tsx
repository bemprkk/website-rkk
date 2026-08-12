import React from 'react';
import { Edit2, Trash2, Plus } from 'lucide-react';

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  onAdd: () => void;
  addLabel?: string;
  keyExtractor: (item: T) => string;
}

export function DataTable<T>({ data, columns, onEdit, onDelete, onAdd, addLabel = 'Tambah Data', keyExtractor }: DataTableProps<T>) {
  return (
    <div style={{ background: 'var(--admin-card-bg)', borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid var(--admin-card-border)', width: '100%', maxWidth: '100%' }}>
      <div className="admin-page-header" style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--admin-card-border)', marginBottom: 0 }}>
        <h3 style={{ margin: 0, color: 'var(--admin-text-main)', fontSize: '1.1rem' }}>Data List</h3>
        <button 
          onClick={onAdd}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f97316', color: 'var(--admin-text-main)', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}
        >
          <Plus size={16} />
          {addLabel}
        </button>
      </div>
      
      <div style={{ overflowX: 'auto', width: '100%' }}>
        <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--admin-input-bg)', color: 'var(--admin-text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {columns.map(col => (
                <th key={col.key} style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>{col.label}</th>
              ))}
              <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
                  Tidak ada data.
                </td>
              </tr>
            ) : (
              data.map(item => (
                <tr key={keyExtractor(item)} style={{ borderTop: '1px solid var(--admin-card-border)', transition: 'background 0.2s' }}>
                  {columns.map(col => (
                    <td key={col.key} style={{ padding: '1rem 1.5rem', color: 'var(--admin-text-main)' }}>
                      {col.render ? col.render(item) : (item as any)[col.key]}
                    </td>
                  ))}
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button 
                        onClick={() => onEdit(item)}
                        style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '0.4rem', borderRadius: '0.375rem', cursor: 'pointer' }}
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm('Yakin ingin menghapus data ini?')) {
                            onDelete(item);
                          }
                        }}
                        style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.4rem', borderRadius: '0.375rem', cursor: 'pointer' }}
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
