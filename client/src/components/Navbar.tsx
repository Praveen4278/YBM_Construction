import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import Magnetic from './Magnetic';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setDropdownOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    setMobileOpen(false);
    if (location.pathname === '/') {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/#${hash}`);
    }
  };

  const isProjectsActive =
    location.pathname === '/projects/completed' ||
    location.pathname === '/projects/upcoming' ||
    location.pathname.startsWith('/projects/');

  const dropdownItems = [
    { label: 'Completed Projects', path: '/projects/completed' },
    { label: 'Upcoming Projects',  path: '/projects/upcoming' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 py-4 px-5 md:py-7 md:px-8 lg:px-16 flex justify-between items-center transition-all duration-500 ${
          scrolled
            ? 'glass-nav py-3 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border-b border-black/5 bg-white/80'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        {/* Logo */}
        <a
          href="/#hero"
          onClick={(e) => handleNavClick(e, 'hero')}
          className="flex items-center gap-3 group pointer-events-auto"
        >
          <img
            src="/Logo.png"
            alt="YBM Logo"
            className="h-16 md:h-28 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-[11px] font-sans font-bold tracking-[2px] uppercase text-dark/80 pointer-events-auto">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              location.pathname === '/' ? window.scrollTo({ top: 0, behavior: 'smooth' }) : navigate('/');
            }}
            className={`relative py-1 hover:text-primary transition-colors ${
              location.pathname === '/' && !location.hash ? 'text-primary' : ''
            }`}
          >
            Home
            {location.pathname === '/' && !location.hash && (
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-primary" />
            )}
          </a>

          <a
            href="/#about"
            onClick={(e) => handleNavClick(e, 'about')}
            className="relative py-1 hover:text-primary transition-colors"
          >
            About
          </a>

          {/* Projects Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setDropdownOpen((o) => !o);
                if (e.key === 'Escape') setDropdownOpen(false);
              }}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
              aria-label="Projects menu"
              className={`flex items-center gap-1 py-1 uppercase hover:text-primary transition-colors cursor-pointer ${
                isProjectsActive ? 'text-primary' : ''
              }`}
            >
              Projects
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
              />
              {isProjectsActive && (
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-primary" />
              )}
            </button>

            {dropdownOpen && (
              <div
                role="menu"
                aria-label="Project categories"
                className="absolute top-full left-0 mt-3 w-52 bg-white border border-slate-100 rounded-xl shadow-lg overflow-hidden z-50"
              >
                {dropdownItems.map((item) => (
                  <button
                    key={item.path}
                    role="menuitem"
                    onClick={() => { navigate(item.path); setDropdownOpen(false); }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') { navigate(item.path); setDropdownOpen(false); }
                      if (e.key === 'Escape') setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-5 py-3.5 text-[11px] font-sans font-bold tracking-[1.5px] uppercase transition-colors hover:bg-primary/10 hover:text-primary ${
                      location.pathname === item.path ? 'text-primary bg-primary/5' : 'text-dark/80'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <a
            href="/#services"
            onClick={(e) => handleNavClick(e, 'services')}
            className="relative py-1 hover:text-primary transition-colors"
          >
            Services
          </a>

          <a
            href="/joint-venture"
            onClick={(e) => { e.preventDefault(); navigate('/joint-venture'); }}
            className={`relative py-1 transition-colors hover:text-primary ${
              location.pathname === '/joint-venture' ? 'text-primary' : ''
            }`}
          >
            Joint Venture
            {location.pathname === '/joint-venture' && (
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-primary" />
            )}
          </a>

          <a
            href="/#contact"
            onClick={(e) => handleNavClick(e, 'contact')}
            className="relative py-1 hover:text-primary transition-colors"
          >
            Contact
          </a>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4 pointer-events-auto">
          <Magnetic>
            <a
              href="/#contact"
              onClick={(e) => handleNavClick(e, 'contact')}
              className="bg-primary hover:bg-white text-dark-2 text-[10px] font-sans font-bold tracking-[2px] px-6 py-3 rounded uppercase transition-all duration-300 hover:shadow-premium-glow hover:-translate-y-[2px]"
            >
              Get In Touch
            </a>
          </Magnetic>
          <a
            href="/admin/login"
            onClick={(e) => { e.preventDefault(); navigate('/admin/login'); }}
            className="text-dark/40 hover:text-primary text-[10px] font-sans font-bold tracking-[1px] uppercase transition-colors"
          >
            CMS Login
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 text-dark z-50 pointer-events-auto"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white z-50 md:hidden shadow-2xl transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full pt-24 pb-10 px-8 overflow-y-auto">
          <nav className="flex flex-col gap-1 text-[12px] font-sans font-bold tracking-[2px] uppercase">
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); setMobileOpen(false); location.pathname === '/' ? window.scrollTo({ top: 0, behavior: 'smooth' }) : navigate('/'); }}
              className={`py-4 border-b border-slate-100 hover:text-primary transition-colors ${location.pathname === '/' && !location.hash ? 'text-primary' : 'text-dark/80'}`}
            >
              Home
            </a>
            <a
              href="/#about"
              onClick={(e) => handleNavClick(e, 'about')}
              className="py-4 border-b border-slate-100 text-dark/80 hover:text-primary transition-colors"
            >
              About
            </a>
            <div className="border-b border-slate-100">
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className={`w-full flex items-center justify-between py-4 uppercase hover:text-primary transition-colors ${isProjectsActive ? 'text-primary' : 'text-dark/80'}`}
              >
                Projects
                <ChevronDown size={13} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {dropdownOpen && (
                <div className="pb-2 pl-4 flex flex-col gap-1">
                  {dropdownItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => { navigate(item.path); setMobileOpen(false); setDropdownOpen(false); }}
                      className={`text-left py-2.5 text-[11px] tracking-[1.5px] uppercase hover:text-primary transition-colors ${location.pathname === item.path ? 'text-primary' : 'text-dark/60'}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <a
              href="/#services"
              onClick={(e) => handleNavClick(e, 'services')}
              className="py-4 border-b border-slate-100 text-dark/80 hover:text-primary transition-colors"
            >
              Services
            </a>
            <a
              href="/joint-venture"
              onClick={(e) => { e.preventDefault(); navigate('/joint-venture'); setMobileOpen(false); }}
              className={`py-4 border-b border-slate-100 hover:text-primary transition-colors ${location.pathname === '/joint-venture' ? 'text-primary' : 'text-dark/80'}`}
            >
              Joint Venture
            </a>
            <a
              href="/#contact"
              onClick={(e) => handleNavClick(e, 'contact')}
              className="py-4 border-b border-slate-100 text-dark/80 hover:text-primary transition-colors"
            >
              Contact
            </a>
          </nav>

          <div className="mt-8 flex flex-col gap-3">
            <a
              href="/#contact"
              onClick={(e) => handleNavClick(e, 'contact')}
              className="bg-primary text-dark-2 text-[10px] font-sans font-bold tracking-[2px] px-6 py-4 rounded uppercase text-center transition-all duration-300"
            >
              Get In Touch
            </a>
            <a
              href="/admin/login"
              onClick={(e) => { e.preventDefault(); navigate('/admin/login'); setMobileOpen(false); }}
              className="text-dark/40 hover:text-primary text-[10px] font-sans font-bold tracking-[1px] uppercase text-center transition-colors"
            >
              CMS Login
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
