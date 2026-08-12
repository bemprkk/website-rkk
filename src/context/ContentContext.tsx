import React, { createContext, useContext, useState, useEffect } from 'react';
import type { WebsiteContent } from '../types';
import { staticContent } from '../data/staticContent';
import api from '../api/axios';

interface ContentContextType {
  content: WebsiteContent;
  updateContent: (newContent: Partial<WebsiteContent> | ((prev: WebsiteContent) => WebsiteContent)) => Promise<void>;
  resetToDefault: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

/**
 * Merge data dari DB ke atas staticContent.
 * - Array & objek dari DB akan menggantikan (bukan di-merge) default staticContent.
 * - Field Mongoose internal (_id, __v) di-strip.
 */
function mergeWithStatic(dbData: Record<string, any>): WebsiteContent {
  const { _id, __v, ...clean } = dbData;

  return {
    ...staticContent,
    ...clean,
    // Nested objek: merge satu level lebih dalam agar field yg tidak ada di DB
    // tetap menggunakan nilai staticContent sebagai fallback
    translations: {
      ID: {
        ...staticContent.translations.ID,
        ...(clean.translations?.ID ?? {}),
        // Merge setiap section terjemahan secara mendalam
        hero: { ...staticContent.translations.ID.hero, ...(clean.translations?.ID?.hero ?? {}) },
        home: { ...staticContent.translations.ID.home, ...(clean.translations?.ID?.home ?? {}) },
        about: { ...staticContent.translations.ID.about, ...(clean.translations?.ID?.about ?? {}) },
        footer: { ...staticContent.translations.ID.footer, ...(clean.translations?.ID?.footer ?? {}) },
        history: { ...staticContent.translations.ID.history, ...(clean.translations?.ID?.history ?? {}) },
        accreditation: { ...staticContent.translations.ID.accreditation, ...(clean.translations?.ID?.accreditation ?? {}) },
      },
      EN: {
        ...staticContent.translations.EN,
        ...(clean.translations?.EN ?? {}),
        hero: { ...staticContent.translations.EN.hero, ...(clean.translations?.EN?.hero ?? {}) },
        home: { ...staticContent.translations.EN.home, ...(clean.translations?.EN?.home ?? {}) },
        about: { ...staticContent.translations.EN.about, ...(clean.translations?.EN?.about ?? {}) },
        footer: { ...staticContent.translations.EN.footer, ...(clean.translations?.EN?.footer ?? {}) },
        history: { ...staticContent.translations.EN.history, ...(clean.translations?.EN?.history ?? {}) },
        accreditation: { ...staticContent.translations.EN.accreditation, ...(clean.translations?.EN?.accreditation ?? {}) },
      },
    },
    images: {
      ...staticContent.images,
      ...(clean.images ?? {}),
    },
    stats: {
      ...staticContent.stats,
      ...(clean.stats ?? {}),
    },
    contact: {
      ...staticContent.contact,
      ...(clean.contact ?? {}),
    },
  } as WebsiteContent;
}

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
          setContent(mergeWithStatic(response.data));
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
