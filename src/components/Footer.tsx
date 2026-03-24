'use client';

import { Instagram, Twitter, Facebook } from 'lucide-react';

const footerLinks = [
  {
    title: 'Company',
    links: ['About', 'Jobs', 'For the Record'],
  },
  {
    title: 'Communities',
    links: ['For Artists', 'Developers', 'Advertising', 'Investors', 'Vendors'],
  },
  {
    title: 'Useful links',
    links: ['Support', 'Free Mobile App'],
  },
  {
    title: 'Spotify Plans',
    links: ['Premium Individual', 'Premium Student', 'Premium Family', 'Premium Duo', 'Spotify Free'],
  },
];

export default function Footer() {
  return (
    <footer className="mt-12 px-6 pb-24 border-t border-white/5 pt-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {footerLinks.map((section) => (
          <div key={section.title} className="flex flex-col gap-y-3">
            <h3 className="font-bold text-white text-sm">{section.title}</h3>
            {section.links.map((link) => (
              <a
                key={link}
                href="#"
                className="text-gray-400 hover:text-white hover:underline transition-all text-sm font-medium"
              >
                {link}
              </a>
            ))}
          </div>
        ))}

        <div className="flex gap-x-4 lg:justify-end xl:col-span-1">
          <button className="w-10 h-10 bg-[#292929] hover:bg-[#727272] flex items-center justify-center rounded-full transition-colors">
            <Instagram size={20} className="text-white" />
          </button>
          <button className="w-10 h-10 bg-[#292929] hover:bg-[#727272] flex items-center justify-center rounded-full transition-colors">
            <Twitter size={20} className="text-white" />
          </button>
          <button className="w-10 h-10 bg-[#292929] hover:bg-[#727272] flex items-center justify-center rounded-full transition-colors">
            <Facebook size={20} className="text-white" />
          </button>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-x-4 gap-y-2 text-[13px] text-gray-400 font-medium">
        <a href="#" className="hover:text-white">Legal</a>
        <a href="#" className="hover:text-white">Safety & Privacy Center</a>
        <a href="#" className="hover:text-white">Privacy Policy</a>
        <a href="#" className="hover:text-white">Cookies</a>
        <a href="#" className="hover:text-white">About Ads</a>
        <a href="#" className="hover:text-white">Accessibility</a>
        <span className="ml-auto text-gray-500">© 2026 Tuneify</span>
      </div>
    </footer>
  );
}
