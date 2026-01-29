'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, defaultLanguage } from '@/i18n.config';

interface Translations {
    [key: string]: any;
}

interface I18nContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string, defaultValue?: string) => string;
    translations: Translations;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>(defaultLanguage);
    const [translations, setTranslations] = useState<Translations>({});
    const [mounted, setMounted] = useState(false);

    // Load translations on mount and when language changes
    useEffect(() => {
        const loadTranslations = async () => {
            try {
                const response = await fetch(`/locales/${language}/common.json`);
                const data = await response.json();
                setTranslations(data);
            } catch (error) {
                console.error(`Failed to load translations for ${language}:`, error);
            }
        };

        loadTranslations();
    }, [language]);

    useEffect(() => {
        // Check localStorage for saved language preference
        const savedLanguage = localStorage.getItem('language') as Language | null;
        if (savedLanguage) {
            setLanguageState(savedLanguage);
        }
        setMounted(true);
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('language', lang);
        // Update document language attribute for accessibility
        document.documentElement.lang = lang;
    };

    // Recursive function to get nested translation values
    const getNestedValue = (obj: any, path: string, defaultValue?: string): string => {
        const keys = path.split('.');
        let value = obj;

        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                return defaultValue || path;
            }
        }

        return typeof value === 'string' ? value : defaultValue || path;
    };

    const t = (key: string, defaultValue?: string): string => {
        return getNestedValue(translations, key, defaultValue);
    };

    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <I18nContext.Provider value={{ language, setLanguage, t, translations }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    const context = useContext(I18nContext);
    if (context === undefined) {
        throw new Error('useI18n must be used within I18nProvider');
    }
    return context;
}

// Alias for convenience
export const useTranslation = useI18n;
