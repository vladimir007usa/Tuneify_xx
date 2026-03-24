export const translations: Record<string, Record<string, string>> = {
  'English': {
    home: 'Home',
    search: 'Search',
    library: 'Your Library',
    createPlaylist: 'Create your first playlist',
    helpPlaylist: "It's easy, we'll help you",
    createBtn: 'Create playlist',
    signUp: 'Sign up',
    logIn: 'Log in',
    all: 'All',
    music: 'Music',
    podcasts: 'Podcasts'
  },
  'Deutsch': {
    home: 'Startseite',
    search: 'Suchen',
    library: 'Deine Bibliothek',
    createPlaylist: 'Erstelle deine erste Playlist',
    helpPlaylist: 'Es ist ganz einfach, wir helfen dir',
    createBtn: 'Playlist erstellen',
    signUp: 'Registrieren',
    logIn: 'Anmelden',
    all: 'Alle',
    music: 'Musik',
    podcasts: 'Podcasts'
  },
  'Español de España': {
    home: 'Inicio',
    search: 'Buscar',
    library: 'Tu biblioteca',
    createPlaylist: 'Crea tu primera lista',
    helpPlaylist: 'Es muy fácil, te ayudaremos',
    createBtn: 'Crear lista',
    signUp: 'Registrarte',
    logIn: 'Iniciar sesión',
    all: 'Todo',
    music: 'Música',
    podcasts: 'Podcasts'
  },
  'العربية': {
    home: 'الرئيسية',
    search: 'ابحث',
    library: 'مكتبتك',
    createPlaylist: 'قم بإنشاء قائمة التشغيل',
    helpPlaylist: 'الأمر سهل، سنساعدك',
    createBtn: 'إنشاء قائمة',
    signUp: 'اشتراك',
    logIn: 'تسجيل الدخول',
    all: 'الكل',
    music: 'موسيقى',
    podcasts: 'بودكاست'
  },
  'বাংলা': {
    home: 'হোম',
    search: 'অনুসন্ধান করুন',
    library: 'লাইব্রেরি',
    createPlaylist: 'প্রথম প্লেলিস্ট তৈরি করুন',
    helpPlaylist: 'এটি সহজ, আমরা সাহায্য করব',
    createBtn: 'প্লেলিস্ট তৈরি করুন',
    signUp: 'সাইন আপ',
    logIn: 'লগ ইন',
    all: 'সব',
    music: 'সংগীত',
    podcasts: 'পডকাস্ট'
  },
  'हिन्दी': {
    home: 'होम',
    search: 'खोजें',
    library: 'लाइब्रेरी',
    createPlaylist: 'अपनी पहली प्लेलिस्ट बनाएं',
    helpPlaylist: 'हम मदद करेंगे',
    createBtn: 'प्लेलिस्ट बनाएं',
    signUp: 'साइन अप',
    logIn: 'लॉग इन',
    all: 'सभी',
    music: 'संगीत',
    podcasts: 'पॉडकास्ट'
  }
};

export function t(lang: string, key: string): string {
  const dictionary = translations[lang] || translations.English;
  return dictionary[key] || translations.English[key] || key;
}
