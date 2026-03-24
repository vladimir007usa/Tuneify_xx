'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (lang: string) => void;
}

const languages = [
  { native: 'English', english: 'English' },
  { native: 'Afrikaans', english: 'Afrikaans' },
  { native: 'አማርኛ', english: 'Amharic' },
  { native: 'العربية', english: 'Arabic' },
  { native: 'عربي مصري', english: 'Arabic (Egypt)' },
  { native: 'العَرَبِيَّة مغربي', english: 'Arabic (Morocco)' },
  { native: 'العربية السعودية', english: 'Arabic (Saudi Arabia)' },
  { native: 'Azərbaycanca', english: 'Azerbaijani' },
  { native: 'Български', english: 'Bulgarian' },
  { native: 'भोजपुरी', english: 'Bhojpuri' },
  { native: 'বাংলা', english: 'Bengali' },
  { native: 'Bosanski', english: 'Bosnian' },
  { native: 'Català', english: 'Catalan' },
  { native: 'Čeština', english: 'Czech' },
  { native: 'Dansk', english: 'Danish' },
  { native: 'Deutsch', english: 'German' },
  { native: 'Ελληνικά', english: 'Greek' },
  { native: 'English', english: 'United Kingdom' },
  { native: 'Español de España', english: 'European Spanish' },
  { native: 'Español de Latinoamérica', english: 'Latin American Spanish' },
  { native: 'Español (Argentina)', english: 'Spanish (Argentina)' },
  { native: 'Español (México)', english: 'Spanish (Mexico)' },
  { native: 'Eesti', english: 'Estonian' },
  { native: 'Euskara', english: 'Basque' },
];

export default function LanguageModal({ isOpen, onClose, onSelect }: LanguageModalProps) {
  // Prevent scrolling on background when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4">
      {/* Click outside to close */}
      <div className="absolute inset-0 cursor-default" onClick={onClose} />
      
      <div className="bg-[#282828] w-full max-w-[980px] rounded-lg shadow-2xl flex flex-col max-h-[85vh] overflow-hidden relative z-10">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/10 flex items-start justify-between sticky top-0 bg-[#282828] z-10">
          <div className="flex flex-col gap-y-1 text-white">
            <h2 className="text-2xl font-bold tracking-tight">Choose a language</h2>
            <p className="text-[15px] font-medium opacity-90 text-gray-400">This updates what you read on Tuneify</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/80 hover:scale-105 transition-all text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Grid */}
        <div className="overflow-y-auto p-4 sm:p-6 scrollbar-hide py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-6 gap-x-4">
            {languages.map((lang, index) => (
              <button
                key={`${lang.native}-${index}`}
                onClick={() => {
                  onSelect(lang.native);
                  onClose();
                }}
                className="flex flex-col items-start px-3 py-1.5 rounded-md hover:bg-[#3E3E3E] transition-colors focus:bg-[#3E3E3E] text-left group border border-transparent focus:outline-none"
              >
                <span className="text-[15px] text-white font-medium group-hover:underline">
                  {lang.native}
                </span>
                <span className="text-[13.5px] text-[#A7A7A7] font-medium tracking-tight mt-0.5 group-hover:underline">
                  {lang.english}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
