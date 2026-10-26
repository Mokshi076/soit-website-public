'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import HashLink from '@components/HashLink';

/* ---------- Nav data: single source of truth for desktop + mobile ---------- */

// `external` = opens in a new tab
type NavChild = { label: string; href: string; external?: boolean };
type NavLeaf = { key: string; label: string; href: string; hash?: string };
type NavGroup = { key: string; label: string; width: string; children: NavChild[] };
type NavItem = NavLeaf | NavGroup;

const NAV: NavItem[] = [
  { key: 'home', label: 'Home', href: '/' },
  { key: 'about', label: 'About', href: '/#about', hash: 'about' },
  {
    key: 'academics',
    label: 'Academics',
    width: 'w-48',
    children: [
      { label: 'Programs & Courses', href: '/academics' },
      { label: 'Placements', href: '/placements' },
    ],
  },
  {
    key: 'student',
    label: 'Student Hub',
    width: 'w-56',
    children: [
      { label: 'Student Life', href: '/student-life' },
      { label: 'Achievements', href: '/student-achievements' },
      { label: 'Alumni Network', href: '/alumni-network' },
      { label: 'Campus Amenities', href: '/amenities' },
      { label: 'Virtual Tour', href: '/virtual-tour' },
    ],
  },
  {
    key: 'resources',
    label: 'Resources',
    width: 'w-52',
    children: [
      { label: 'Gallery', href: '/gallery' },
      { label: 'News & Events', href: '/news-events' },
      { label: 'MOU & Partnerships', href: '/mou' },
      { label: 'Analytics', href: '/analytics' },
      { label: 'Calendars', href: '/calendars' },
      { label: '📖 Magazine', href: '/work-in-progress', external: true },
    ],
  },
  { key: 'faq', label: 'FAQ', href: '/faq' },
  { key: 'contact', label: 'Contact', href: '/contact' },
];

const isGroup = (item: NavItem): item is NavGroup => 'children' in item;

// Active key for every page except the homepage (the homepage uses the scroll-spy below).
// Derived from NAV, so adding a page to the menu automatically makes it "active-aware".
function getActiveKey(pathname: string): string {
  for (const item of NAV) {
    if (isGroup(item)) {
      if (item.children.some((c) => c.href === pathname)) return item.key;
    } else if (!item.hash && item.href === pathname) {
      return item.key;
    }
  }
  return '';
}

const STUDENT_PORTAL = 'https://www.rgpv.ac.in/Login/StudentLogin.aspx';

/* ---------- Component ---------- */

export default function Header() {
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [prevPath, setPrevPath] = useState(pathname);

  const navRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // On route change: close menus and reset the active section. (Adjusting state during render is the
  // React-recommended alternative to a setState-in-effect, and avoids a stale frame.)
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setOpenKey(null);
    setMobileMenuOpen(false);
    // Reset the homepage active section for the new page
    setActiveSection(
      pathname !== '/' ? '' : window.location.hash === '#about' ? 'about' : 'home'
    );
  }

  // Homepage: Home/About follow the section in view (scroll-spy).
  // Other pages: the active item comes from the URL.
  const activeKey =
    pathname === '/'
      ? activeSection === 'home'
        ? 'home'
        : activeSection === 'about'
          ? 'about'
          : ''
      : getActiveKey(pathname);

  // setState bails out when the value is unchanged, so this re-renders only when
  // the 50px threshold is crossed, not on every scroll event.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Homepage section observer (scroll-spy)
  useEffect(() => {
    if (pathname !== '/') return;

    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-100px 0px -60% 0px', threshold: 0.1 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  // Close dropdown on outside click / Escape.
  useEffect(() => {
    if (!openKey) return;
    const onPointerDown = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenKey(null);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenKey(null);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [openKey]);

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    []
  );

  const openMenu = (key: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenKey(key);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenKey(null), 150);
  };

  const closeMobile = () => setMobileMenuOpen(false);

  // Home: on the homepage, scroll smoothly to the top instead of reloading.
  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setActiveSection('home');
    if (pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    closeMobile();
  };

  const handleAboutClick = () => {
    setActiveSection('about');
    closeMobile();
  };

  // `nav-link` owns the underline (absolutely positioned, animated via transform
  // only, so it never shifts layout); `nav-link-active` keeps it visible.
  // A dropdown also counts as active while it is open.
  const navLinkClass = (active: boolean, extra = '') =>
    `nav-link font-medium transition-colors hover:text-primary ${
      active ? 'nav-link-active font-semibold' : 'text-gray-700'
    } ${extra}`.trim();

  const mobileLinkClass = (active: boolean, extra: string) =>
    `block py-2 hover:text-primary ${
      active ? 'font-semibold text-primary' : 'text-gray-700'
    } ${extra}`;

  return (
    <header
      className={`
        border-secondary w-full border-b-[3px] bg-white py-2 transition-shadow
        duration-300
        ${scrolled ? 'shadow-md' : ''}
      `}
    >
      <div className="
        mx-auto px-4
        sm:px-6
        lg:px-8
      ">
        <div className="flex items-center justify-between">
          {/* Logo and Site Name */}
          <div className="flex items-center">
            <div className="relative size-12">
              <Image
                src="/images/logo.jpg"
                alt="School Crest"
                priority
                fill
                sizes="48px"
                className="rounded-full object-contain"
              />
            </div>
            <div className="ml-3">
              <p className="font-poppins text-primary text-xl font-bold">SoIT</p>
              <p className="text-xs text-gray-600">School of Information Technology</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav ref={navRef} aria-label="Main" className="
            hidden items-center space-x-6
            lg:flex
          ">
            {NAV.map((item) => {
              if (!isGroup(item)) {
                return item.hash ? (
                  <HashLink
                    key={item.key}
                    href={item.href}
                    hash={item.hash}
                    className={navLinkClass(activeKey === item.key)}
                    onClick={handleAboutClick}
                  >
                    {item.label}
                  </HashLink>
                ) : (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={navLinkClass(activeKey === item.key)}
                    onClick={item.key === 'home' ? handleHomeClick : undefined}
                  >
                    {item.label}
                  </Link>
                );
              }

              const isOpen = openKey === item.key;
              return (
                <div
                  key={item.key}
                  className="relative"
                  onMouseEnter={() => openMenu(item.key)}
                  onMouseLeave={scheduleClose}
                >
                  <button
                    type="button"
                    className={navLinkClass(activeKey === item.key || isOpen, 'flex items-center')}
                    aria-expanded={isOpen}
                    onClick={() => openMenu(item.key)}
                  >
                    {item.label}
                    <svg
                      className={`
                        ml-1 size-4 transition-transform duration-200
                        ${
                        isOpen ? 'rotate-180' : ''
                      }
                      `}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isOpen && (
                    <div className={`
                      absolute top-full left-0 z-50 pt-2
                      ${item.width}
                    `}>
                      <div className="
                        rounded-lg border border-gray-100 bg-white py-2
                        shadow-xl
                      ">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            {...(child.external ? { target: '_blank' } : {})}
                            className={`
                              hover:text-primary
                              block px-4 py-2 text-sm
                              hover:bg-gray-50
                              ${
                              pathname === child.href
                                ? 'text-primary bg-gray-50 font-medium'
                                : 'text-gray-700'
                            }
                            `}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Student Portal */}
          <div className="
            hidden items-center
            md:flex
          ">
            <Link
              href={STUDENT_PORTAL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-4 py-2 text-sm"
            >
              Student Portal
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="
              text-gray-700
              focus:outline-none
              lg:hidden
            "
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu (inert while closed so hidden links can't be tabbed to) */}
      <div
        inert={!mobileMenuOpen}
        className={`
          overflow-hidden transition-all duration-300
          lg:hidden
          ${
            mobileMenuOpen
              ? 'max-h-[calc(100vh-5rem)] overflow-y-auto bg-white shadow-lg'
              : 'max-h-0'
          }
        `}
      >
        <div className="space-y-1 px-4 py-2 pb-4">
          {NAV.map((item) =>
            isGroup(item) ? (
              <div key={item.key} className="mt-2 border-t border-gray-100 pt-2">
                <p
                  className={`
                    px-2 text-xs font-semibold uppercase
                    ${
                    activeKey === item.key ? 'text-primary' : 'text-gray-500'
                  }
                  `}
                >
                  {item.label}
                </p>
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    {...(child.external ? { target: '_blank' } : {})}
                    className={mobileLinkClass(pathname === child.href, 'pl-4')}
                    onClick={closeMobile}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ) : item.hash ? (
              <HashLink
                key={item.key}
                href={item.href}
                hash={item.hash}
                className={mobileLinkClass(activeKey === item.key, 'font-medium')}
                onClick={handleAboutClick}
              >
                {item.label}
              </HashLink>
            ) : (
              <Link
                key={item.key}
                href={item.href}
                className={mobileLinkClass(activeKey === item.key, 'font-medium')}
                onClick={item.key === 'home' ? handleHomeClick : closeMobile}
              >
                {item.label}
              </Link>
            )
          )}

          <div className="pt-4 pb-2">
            <Link
              href={STUDENT_PORTAL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary block w-full text-center"
              onClick={closeMobile}
            >
              Student Portal
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}