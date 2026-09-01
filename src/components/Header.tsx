'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import HashLink from '@components/HashLink';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrolled = scrollY > 50;

  // ----------------------------------------
  // PATHS FOR DROPDOWN ACTIVE STATES
  // ----------------------------------------

  const academicsPaths = [
    '/academics',
    '/placements',
  ];

  const studentPaths = [
    '/student-life',
    '/student-achievements',
    '/alumni-network',
    '/amenities',
    '/virtual-tour',
  ];

  const resourcesPaths = [
    '/gallery',
    '/news-events',
    '/mou',
    '/analytics',
    '/calendars',
    '/work-in-progress',
  ];

  // ----------------------------------------
  // CHECK ACTIVE DROPDOWNS
  // ----------------------------------------

  const isAcademicsActive =
    academicsPaths.includes(pathname) || openDropdown === 'academics';

  const isStudentActive =
    studentPaths.includes(pathname) || openDropdown === 'student';

  const isResourcesActive =
    resourcesPaths.includes(pathname) || openDropdown === 'resources';

  // ----------------------------------------
  // SCROLL
  // ----------------------------------------

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // ----------------------------------------
  // HOMEPAGE SECTION OBSERVER
  // ----------------------------------------

  useEffect(() => {
    if (pathname !== '/') {
      return;
    }

    const sections = document.querySelectorAll('section[id]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-100px 0px -60% 0px',
        threshold: 0.1,
      }
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
    };
  }, [pathname]);

  // ----------------------------------------
  // RESET HOMEPAGE ACTIVE SECTION
  // WHEN NAVIGATING TO OTHER PAGES
  // ----------------------------------------

  useEffect(() => {
    if (pathname !== '/') {
      setActiveSection('');
    } else if (window.location.hash === '#about') {
      setActiveSection('about');
    } else {
      setActiveSection('home');
    }
  }, [pathname]);

  // ----------------------------------------
  // DROPDOWN HANDLERS
  // ----------------------------------------

  const handleMouseEnter = (dropdown: string) => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }

    setOpenDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    closeTimeout.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  // ----------------------------------------
  // HOME CLICK
  // ----------------------------------------

  const handleHomeClick = (
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    setActiveSection('home');

    if (pathname === '/') {
      e.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }

    setMobileMenuOpen(false);
  };

  // ----------------------------------------
  // ABOUT CLICK
  // ----------------------------------------

  const handleAboutClick = () => {
    setActiveSection('about');
    setMobileMenuOpen(false);
  };

  // ----------------------------------------
  // CLOSE MOBILE MENU
  // ----------------------------------------

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`
        w-full
        bg-white
        transition-all
        duration-300
        ${scrolled ? 'shadow-md' : ''}
      `}
    >
      {/* ================================
          HEADER CONTAINER
      ================================= */}

      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* ================================
              LOGO
          ================================= */}

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
              <p className="font-poppins text-xl font-bold text-primary">
                SoIT
              </p>

              <p className="text-xs text-gray-600">
                School of Information Technology
              </p>
            </div>
          </div>

          {/* ================================
              DESKTOP NAVIGATION
          ================================= */}

          <nav className="hidden items-center space-x-6 lg:flex">

            {/* HOME */}

            <Link
              href="/"
              onClick={handleHomeClick}
              className={`
                relative
                font-medium
                transition-colors
                ${
                  pathname === '/' && activeSection === 'home'
                    ? 'font-semibold text-primary after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-primary'
                    : 'text-gray-700 hover:text-primary'
                }
              `}
            >
              Home
            </Link>

            {/* ABOUT */}

            <HashLink
              href="/#about"
              hash="about"
              onClick={handleAboutClick}
              className={`
                relative
                font-medium
                transition-colors
                ${
                  pathname === '/' && activeSection === 'about'
                    ? 'font-semibold text-primary after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-primary'
                    : 'text-gray-700 hover:text-primary'
                }
              `}
            >
              About
            </HashLink>

            {/* ============================
                ACADEMICS
            ============================= */}

            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('academics')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className={`
                  relative
                  flex
                  items-center
                  font-medium
                  transition-colors
                  ${
                    isAcademicsActive
                      ? 'font-semibold text-primary after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-primary'
                      : 'text-gray-700 hover:text-primary'
                  }
                `}
              >
                Academics

                <svg
                  className="ml-1 size-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {openDropdown === 'academics' && (
                <div className="absolute left-0 top-full z-50 w-48 pt-2">
                  <div className="rounded-lg border border-gray-100 bg-white py-2 shadow-xl">

                    <Link
                      href="/academics"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                    >
                      Programs & Courses
                    </Link>

                    <Link
                      href="/placements"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                    >
                      Placements
                    </Link>

                  </div>
                </div>
              )}
            </div>

            {/* ============================
                STUDENT HUB
            ============================= */}

            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('student')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className={`
                  relative
                  flex
                  items-center
                  font-medium
                  transition-colors
                  ${
                    isStudentActive
                      ? 'font-semibold text-primary after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-primary'
                      : 'text-gray-700 hover:text-primary'
                  }
                `}
              >
                Student Hub

                <svg
                  className="ml-1 size-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {openDropdown === 'student' && (
                <div className="absolute left-0 top-full z-50 w-56 pt-2">
                  <div className="rounded-lg border border-gray-100 bg-white py-2 shadow-xl">

                    <Link
                      href="/student-life"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                    >
                      Student Life
                    </Link>

                    <Link
                      href="/student-achievements"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                    >
                      Achievements
                    </Link>

                    <Link
                      href="/alumni-network"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                    >
                      Alumni Network
                    </Link>

                    <Link
                      href="/amenities"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                    >
                      Campus Amenities
                    </Link>

                    <Link
                      href="/virtual-tour"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                    >
                      Virtual Tour
                    </Link>

                  </div>
                </div>
              )}
            </div>

            {/* ============================
                RESOURCES
            ============================= */}

            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('resources')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className={`
                  relative
                  flex
                  items-center
                  font-medium
                  transition-colors
                  ${
                    isResourcesActive
                      ? 'font-semibold text-primary after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-primary'
                      : 'text-gray-700 hover:text-primary'
                  }
                `}
              >
                Resources

                <svg
                  className="ml-1 size-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {openDropdown === 'resources' && (
                <div className="absolute left-0 top-full z-50 w-52 pt-2">
                  <div className="rounded-lg border border-gray-100 bg-white py-2 shadow-xl">

                    <Link
                      href="/gallery"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                    >
                      Gallery
                    </Link>

                    <Link
                      href="/news-events"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                    >
                      News & Events
                    </Link>

                    <Link
                      href="/mou"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                    >
                      MOU & Partnerships
                    </Link>

                    <Link
                      href="/analytics"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                    >
                      Analytics
                    </Link>

                    <Link
                      href="/calendars"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                    >
                      Calendars
                    </Link>

                    <Link
                      href="/work-in-progress"
                      target="_blank"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                    >
                      📖 Magazine
                    </Link>

                  </div>
                </div>
              )}
            </div>

            {/* FAQ */}

            <Link
              href="/faq"
              className={`
                relative
                font-medium
                transition-colors
                ${
                  pathname === '/faq'
                    ? 'font-semibold text-primary after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-primary'
                    : 'text-gray-700 hover:text-primary'
                }
              `}
            >
              FAQ
            </Link>

            {/* CONTACT */}

            <Link
              href="/contact"
              className={`
                relative
                font-medium
                transition-colors
                ${
                  pathname === '/contact'
                    ? 'font-semibold text-primary after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-primary'
                    : 'text-gray-700 hover:text-primary'
                }
              `}
            >
              Contact
            </Link>

          </nav>

          {/* ================================
              STUDENT PORTAL
          ================================= */}

          <div className="hidden items-center md:flex">
            <Link
              href="https://www.rgpv.ac.in/Login/StudentLogin.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-4 py-2 text-sm"
            >
              Student Portal
            </Link>
          </div>

          {/* ================================
              MOBILE MENU BUTTON
          ================================= */}

          <button
            type="button"
            className="text-gray-700 focus:outline-none lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  mobileMenuOpen
                    ? 'M6 18L18 6M6 6l12 12'
                    : 'M4 6h16M4 12h16M4 18h16'
                }
              />
            </svg>
          </button>

        </div>
      </div>

      {/* ================================
          MOBILE MENU
      ================================= */}

      <div
        className={`
          overflow-hidden
          transition-all
          duration-300
          lg:hidden
          ${
            mobileMenuOpen
              ? 'max-h-[calc(100vh-5rem)] overflow-y-auto bg-white shadow-lg'
              : 'max-h-0'
          }
        `}
      >
        <div className="space-y-1 px-4 py-2 pb-4">

          {/* HOME */}

          <Link
            href="/"
            className={`
              block py-2 font-medium
              ${
                pathname === '/' && activeSection === 'home'
                  ? 'font-semibold text-primary'
                  : 'text-gray-700 hover:text-primary'
              }
            `}
            onClick={handleHomeClick}
          >
            Home
          </Link>

          {/* ABOUT */}

          <HashLink
            href="/#about"
            hash="about"
            className={`
              block py-2 font-medium
              ${
                pathname === '/' && activeSection === 'about'
                  ? 'font-semibold text-primary'
                  : 'text-gray-700 hover:text-primary'
              }
            `}
            onClick={handleAboutClick}
          >
            About
          </HashLink>

          {/* ============================
              ACADEMICS
          ============================= */}

          <div className="mt-2 border-t border-gray-100 pt-2">

            <p
              className={`
                px-2 text-xs font-semibold uppercase
                ${
                  isAcademicsActive
                    ? 'text-primary'
                    : 'text-gray-500'
                }
              `}
            >
              Academics
            </p>

            <Link
              href="/academics"
              className={`
                block py-2 pl-4
                ${
                  pathname === '/academics'
                    ? 'font-semibold text-primary'
                    : 'text-gray-700 hover:text-primary'
                }
              `}
              onClick={closeMobileMenu}
            >
              Programs & Courses
            </Link>

            <Link
              href="/placements"
              className={`
                block py-2 pl-4
                ${
                  pathname === '/placements'
                    ? 'font-semibold text-primary'
                    : 'text-gray-700 hover:text-primary'
                }
              `}
              onClick={closeMobileMenu}
            >
              Placements
            </Link>

          </div>

          {/* ============================
              STUDENT HUB
          ============================= */}

          <div className="mt-2 border-t border-gray-100 pt-2">

            <p
              className={`
                px-2 text-xs font-semibold uppercase
                ${
                  isStudentActive
                    ? 'text-primary'
                    : 'text-gray-500'
                }
              `}
            >
              Student Hub
            </p>

            <Link
              href="/student-life"
              className={`
                block py-2 pl-4
                ${
                  pathname === '/student-life'
                    ? 'font-semibold text-primary'
                    : 'text-gray-700 hover:text-primary'
                }
              `}
              onClick={closeMobileMenu}
            >
              Student Life
            </Link>

            <Link
              href="/student-achievements"
              className={`
                block py-2 pl-4
                ${
                  pathname === '/student-achievements'
                    ? 'font-semibold text-primary'
                    : 'text-gray-700 hover:text-primary'
                }
              `}
              onClick={closeMobileMenu}
            >
              Achievements
            </Link>

            <Link
              href="/alumni-network"
              className={`
                block py-2 pl-4
                ${
                  pathname === '/alumni-network'
                    ? 'font-semibold text-primary'
                    : 'text-gray-700 hover:text-primary'
                }
              `}
              onClick={closeMobileMenu}
            >
              Alumni Network
            </Link>

            <Link
              href="/amenities"
              className={`
                block py-2 pl-4
                ${
                  pathname === '/amenities'
                    ? 'font-semibold text-primary'
                    : 'text-gray-700 hover:text-primary'
                }
              `}
              onClick={closeMobileMenu}
            >
              Campus Amenities
            </Link>

            <Link
              href="/virtual-tour"
              className={`
                block py-2 pl-4
                ${
                  pathname === '/virtual-tour'
                    ? 'font-semibold text-primary'
                    : 'text-gray-700 hover:text-primary'
                }
              `}
              onClick={closeMobileMenu}
            >
              Virtual Tour
            </Link>

          </div>

          {/* ============================
              RESOURCES
          ============================= */}

          <div className="mt-2 border-t border-gray-100 pt-2">

            <p
              className={`
                px-2 text-xs font-semibold uppercase
                ${
                  isResourcesActive
                    ? 'text-primary'
                    : 'text-gray-500'
                }
              `}
            >
              Resources
            </p>

            <Link
              href="/gallery"
              className={`
                block py-2 pl-4
                ${
                  pathname === '/gallery'
                    ? 'font-semibold text-primary'
                    : 'text-gray-700 hover:text-primary'
                }
              `}
              onClick={closeMobileMenu}
            >
              Gallery
            </Link>

            <Link
              href="/news-events"
              className={`
                block py-2 pl-4
                ${
                  pathname === '/news-events'
                    ? 'font-semibold text-primary'
                    : 'text-gray-700 hover:text-primary'
                }
              `}
              onClick={closeMobileMenu}
            >
              News & Events
            </Link>

            <Link
              href="/mou"
              className={`
                block py-2 pl-4
                ${
                  pathname === '/mou'
                    ? 'font-semibold text-primary'
                    : 'text-gray-700 hover:text-primary'
                }
              `}
              onClick={closeMobileMenu}
            >
              MOU & Partnerships
            </Link>

            <Link
              href="/analytics"
              className={`
                block py-2 pl-4
                ${
                  pathname === '/analytics'
                    ? 'font-semibold text-primary'
                    : 'text-gray-700 hover:text-primary'
                }
              `}
              onClick={closeMobileMenu}
            >
              Analytics
            </Link>

            <Link
              href="/calendars"
              className={`
                block py-2 pl-4
                ${
                  pathname === '/calendars'
                    ? 'font-semibold text-primary'
                    : 'text-gray-700 hover:text-primary'
                }
              `}
              onClick={closeMobileMenu}
            >
              Calendars
            </Link>

            <Link
              href="/work-in-progress"
              target="_blank"
              className={`
                block py-2 pl-4
                ${
                  pathname === '/work-in-progress'
                    ? 'font-semibold text-primary'
                    : 'text-gray-700 hover:text-primary'
                }
              `}
              onClick={closeMobileMenu}
            >
              📖 Magazine
            </Link>

          </div>

          {/* FAQ */}

          <Link
            href="/faq"
            className={`
              mt-2 block border-t border-gray-100 py-2 pt-2 font-medium
              ${
                pathname === '/faq'
                  ? 'font-semibold text-primary'
                  : 'text-gray-700 hover:text-primary'
              }
            `}
            onClick={closeMobileMenu}
          >
            FAQ
          </Link>

          {/* CONTACT */}

          <Link
            href="/contact"
            className={`
              block py-2 font-medium
              ${
                pathname === '/contact'
                  ? 'font-semibold text-primary'
                  : 'text-gray-700 hover:text-primary'
              }
            `}
            onClick={closeMobileMenu}
          >
            Contact
          </Link>

          {/* STUDENT PORTAL */}

          <div className="pb-2 pt-4">
            <Link
              href="https://www.rgpv.ac.in/Login/StudentLogin.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary block w-full text-center"
              onClick={closeMobileMenu}
            >
              Student Portal
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}