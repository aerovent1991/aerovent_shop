"use client";
import Link from 'next/link';
import React, { use } from 'react';
import Image from "next/image";
import logo from '../../public/images/logo_item.svg';
import {SITE_CONFIG} from '../../config/site';
import { FaWhatsapp } from "react-icons/fa";
import {
  Facebook,
  Instagram,
  Send,
  MapPin,
  Phone,
  Mail,
  
  ChevronRight } from
'lucide-react';
export function Footer() {
  
  return (
    <footer className="bg-black relative pt-16 pb-8 border-t border-aero/20">
      {/* Blue Accent Strip */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-aero-dark via-aero to-aero-dark opacity-50"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          {/* Column 1: Brand */}
          <div>
            <div className="flex items-center mb-6">
              <div className="mr-3 h-20 w-20 relative">
                 <Image
                  src={logo}
                  alt="АЕРОВЕНТ логотип"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-xl font-stencil tracking-widest text-white">
                АЕРО ВЕНТ
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Розробка та виробництво безпілотних авіаційних комплексів для
              виконання тактичних завдань. Надійність, перевірена  боєм.
            </p>
            <div className="flex space-x-4">
              <a
                href={SITE_CONFIG.social.facebook}
                className="text-gray-400 hover:text-aero-accent transition-colors">

                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={SITE_CONFIG.social.instagram}
                className="text-gray-400 hover:text-aero-accent transition-colors">

                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={SITE_CONFIG.social.whatsapp}
                className="text-gray-400 hover:text-aero-accent transition-colors">

                <FaWhatsapp className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h3 className="text-white font-stencil text-lg mb-6 tracking-wider">
              НАВІГАЦІЯ
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Продукція', href: '/uav' },
                { label: 'Про нас', href: '/about' },
                { label: 'Технології', href: '/technologies' },
                { label: 'Новини', href: '/news' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-aero-accent text-sm uppercase tracking-wide transition-colors flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-[1px] bg-aero-accent mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="text-white font-stencil text-lg mb-6 tracking-wider">
              КОНТАКТИ
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center text-gray-400 text-sm">
                <Phone className="h-5 w-5 text-aero-accent mr-3 flex-shrink-0" />
                <a
                  href={SITE_CONFIG.contact.phoneHref}
                  className="hover:text-white transition-colors"
                >
                  {SITE_CONFIG.contact.phone}
                </a>
              </li>
              <li className="flex items-center text-gray-400 text-sm">
  <Mail className="h-5 w-5 text-aero-accent mr-3 flex-shrink-0" />
  <a
    href={SITE_CONFIG.contact.emailHref}
    className="hover:text-white transition-colors"
  >
    {SITE_CONFIG.contact.email}
  </a>
</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>© 2026 АЕРО ВЕНТ. Всі права захищені.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">
              Політика конфіденційності
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Умови використання
            </a>
          </div>
        </div>
      </div>
    </footer>);

}
