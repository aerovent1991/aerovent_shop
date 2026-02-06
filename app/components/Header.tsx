'use client'; // Компонент клієнтський бо використовує useState

import React, { useState } from 'react';
import {SITE_CONFIG} from '../../config/site';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Menu, X, ChevronRight, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import logo from '../../public/images/logo_item.svg'; // або '/logo_item.svg' якщо в public

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const toggleDropdown = (name: string) => {
    if (activeDropdown === name) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(name);
    }
  };

  const navItems = [
    {
      name: 'ПРОДУКЦІЯ',
      href: '/uav',
      dropdown: [
        {
          name: 'БПЛА',
          href: '/uav'
        },
        {
          name: 'РЕБ',
          href: '/electronic_warfare_systems'
        },
        {
          name: 'ДЕТЕКТОРИ',
          href: '/drone_detectors'
        },
        {
          name: 'АКУМУЛЯТОРИ',
          href: '/batteries'
        },
        {
          name: 'НРК',
          href: '/nrk'
        }
      ]
    },
    {
      name: 'ПРО НАС',
      href: '/about'
    },
    {
      name: 'ТЕХНОЛОГІЇ',
      href: '/technologies'
    },
    {
      name: 'НОВИНИ',
      href: '/news'
    }
  ];

  const handleLinkClick = () => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-aero/20">
      {/* Tactical Grid Overlay */}
      <div className="absolute inset-0 bg-tactical-grid opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link
            href="/"
            className="flex-shrink-0 flex items-center group cursor-pointer z-10"
            onClick={handleLinkClick}
          >
            <div className="relative mr-3">
              {/* Варіант 1: Якщо SVG в public папці */}
              {/* <img
                src="/logo_item.svg"
                alt="АЕРОВЕНТ логотип"
                className="h-12 w-12 text-aero fill-current"
              /> */}
              
              {/* Варіант 2: Якщо імпортуєте через next/image */}
              <div className="mr-3 relative h-20 w-20 ">
                <Image
                  src={logo}
                  alt="АЕРОВЕНТ логотип"
                  fill
                  className="object-contain"
                  priority
                  
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-stencil tracking-widest text-white group-hover:text-aero-accent transition-colors">
                АЕРО ВЕНТ
              </span>
              <span className="text-[10px] tracking-[0.2em] text-gray-400 uppercase">
                Безпілотні системи
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className={`relative text-sm font-medium transition-colors py-2 flex items-center ${
                    pathname === item.href ? 'text-white' : 'text-gray-300 hover:text-white'
                  }`}
                  onClick={handleLinkClick}
                >
                  {item.name}
                  {item.dropdown && <ChevronDown className="ml-1 h-3 w-3" />}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-aero-accent transition-all duration-300 ${
                      pathname === item.href ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  ></span>
                </Link>

                {/* Dropdown Menu */}
                {item.dropdown && (
                  <div className="absolute top-full left-0 w-48 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2 z-50">
                    <div className="bg-black/95 border border-aero/30 backdrop-blur-md rounded-lg shadow-lg shadow-aero/10">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-aero/20 border-b border-white/5 last:border-0 transition-colors"
                          onClick={handleLinkClick}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Contact & CTA */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center text-gray-400 text-sm">
              <Phone className="h-4 w-4 mr-2 text-aero-accent" />
              <a
                href={SITE_CONFIG.contact.phoneHref}
                className="font-mono hover:text-white transition-colors"
              >
                {SITE_CONFIG.contact.phone}
              </a>
            </div>
            <a 
              href={SITE_CONFIG.social.whatsapp}
              className="bg-aero hover:bg-aero-light text-white font-bold py-2 px-6 rounded-lg transition-all transform hover:scale-105 active:scale-95 uppercase tracking-wider text-sm flex items-center shadow-lg shadow-aero/20 no-underline"
              target="_blank"
              rel="noreferrer"
            >
              Зв'язатись
              <ChevronRight className="ml-1 h-4 w-4" />
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center z-10">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white p-2"
              aria-label={isMenuOpen ? "Закрити меню" : "Відкрити меню"}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu with Animation */}
      <div
        className={`md:hidden bg-black/95 backdrop-blur-md border-b border-aero/20 absolute w-full overflow-hidden transition-all duration-300 ease-in-out z-40 ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pt-4 pb-6 space-y-2">
          {navItems.map((item) => (
            <div key={item.name}>
              <div
                className="flex items-center justify-between px-3 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 border-l-2 border-transparent hover:border-aero-accent transition-all cursor-pointer"
                onClick={() =>
                  item.dropdown
                    ? toggleDropdown(item.name)
                    : (() => {
                        setIsMenuOpen(false);
                        setActiveDropdown(null);
                      })()
                }
              >
                <Link
                  href={item.href}
                  onClick={(e) => item.dropdown && e.preventDefault()}
                  className="flex-grow"
                >
                  {item.name}
                </Link>
                {item.dropdown && (
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      activeDropdown === item.name ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </div>

              {/* Mobile Dropdown */}
              {item.dropdown && (
                <div
                  className={`pl-6 space-y-1 overflow-hidden transition-all duration-300 ${
                    activeDropdown === item.name
                      ? 'max-h-40 opacity-100 mt-1'
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  {item.dropdown.map((subItem) => (
                    <Link
                      key={subItem.name}
                      href={subItem.href}
                      className="block px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 border-l border-white/10"
                      onClick={handleLinkClick}
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="mt-6 pt-6 border-t border-white/10 px-3">
            <div className="flex items-center text-gray-400 mb-4">
              <Phone className="h-4 w-4 mr-2 text-aero-accent" />
              <a
                href={SITE_CONFIG.contact.phoneHref}
                className="font-mono hover:text-white transition-colors"
              >
                {SITE_CONFIG.contact.phone}
              </a>
            </div>
            <a 
              href={SITE_CONFIG.social.whatsapp}
              className="w-full bg-aero hover:bg-aero-light text-white font-bold py-3 px-6 rounded-lg uppercase tracking-wider text-sm shadow-lg shadow-aero/20 flex justify-center items-center no-underline"
              target="_blank"
              rel="noreferrer"
              onClick={handleLinkClick}
            >
              Зв'язатись
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
