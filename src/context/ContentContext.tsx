import React, { createContext, useContext, useState, useEffect } from 'react';
import type { WebsiteContent } from '../types';
import { staticContent } from '../data/staticContent';
import api from '../api/axios';

const STORAGE_KEY = 'bemprkk_content_v1';

interface ContentContextType {
  content: WebsiteContent;
  updateContent: (newContent: Partial<WebsiteContent> | ((prev: WebsiteContent) => WebsiteContent)) => Promise<void>;
  resetToDefault: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<WebsiteContent>(staticContent);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial content
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/content');
        if (response.data) {
          setContent({ ...staticContent, ...response.data });
        }
      } catch (e: any) {
        console.error('API /content fetch failed:', e.message);
        setError('Gagal memuat konten dari server.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, []);

  const updateContent = async (update: Partial<WebsiteContent> | ((prev: WebsiteContent) => WebsiteContent)) => {
    const newContent = typeof update === 'function' ? update(content) : { ...content, ...update };
    
    try {
      await api.put('/content', newContent);
      setContent(newContent);
    } catch (e: any) {
      console.error('API /content update failed:', e.message);
      throw new Error('Gagal menyimpan ke server');
    }
  };

  const resetToDefault = async () => {
    try {
      await api.delete('/content/reset');
      setContent(staticContent);
    } catch (e: any) {
      console.error('API /content/reset failed:', e.message);
      throw new Error('Gagal mereset konten');
    }
  };

  return (
    <ContentContext.Provider value={{ content, updateContent, resetToDefault, isLoading, error }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) throw new Error('useContent must be used within a ContentProvider');
  return context;
};
