'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupIcon from '@mui/icons-material/Group';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArticleIcon from '@mui/icons-material/Article';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FeedIcon from '@mui/icons-material/Feed';

interface NavLink {
  href: string;
  label: string;
  icon: React.ComponentType<{
    sx?: object;
    fontSize?: 'small' | 'inherit' | 'medium' | 'large';
  }>;
}

interface NavGroup {
  label: string;
  items: NavLink[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Markets',
    items: [
      { href: '/stocks', label: 'Stocks', icon: TrendingUpIcon },
      { href: '/announcements', label: 'Announcement', icon: FeedIcon },
      { href: '/screener', label: 'Screener', icon: FilterListIcon },
    ],
  },
  {
    label: 'Ownership',
    items: [
      { href: '/investor', label: 'Investor', icon: GroupIcon },
      {
        href: '/ownership/insider',
        label: 'Insider Activity',
        icon: GroupIcon,
      },
    ],
  },
  {
    label: 'News',
    items: [{ href: '/news', label: 'News', icon: ArticleIcon }],
  },
];

function useMarketStatus() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function check() {
      const now = new Date();
      const wib = new Date(
        now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }),
      );
      const day = wib.getDay();
      const minutes = wib.getHours() * 60 + wib.getMinutes();

      const isWeekday = day >= 1 && day <= 5;
      const session1 = minutes >= 9 * 60 && minutes < 11 * 60 + 30;
      const session2Start = day === 5 ? 14 * 60 : 13 * 60 + 30;
      const session2 = minutes >= session2Start && minutes < 15 * 60;

      setIsOpen(isWeekday && (session1 || session2));
    }

    check();
    const id = setInterval(check, 30_000);
    return () => clearInterval(id);
  }, []);

  return isOpen;
}

function MarketStatus() {
  const isOpen = useMarketStatus();

  return (
    <div className='hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-900 border border-gray-800'>
      <span className='relative flex h-2 w-2'>
        {isOpen && (
          <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75' />
        )}
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            isOpen ? 'bg-emerald-400' : 'bg-gray-600'
          }`}
        />
      </span>
      <span
        className={`text-xs font-medium ${isOpen ? 'text-emerald-400' : 'text-gray-500'}`}
      >
        {isOpen ? 'Pasar Buka' : 'Pasar Tutup'}
      </span>
    </div>
  );
}

function TickerSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ticker = query.trim().toUpperCase();
    if (!ticker) return;
    router.push(`/stocks/${ticker}`);
    setQuery('');
  }

  return (
    <form onSubmit={handleSubmit} className='relative w-full max-w-xs'>
      <SearchIcon
        sx={{ fontSize: 16 }}
        className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'
      />
      <input
        type='text'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder='Cari ticker, mis. BBCA'
        className='w-full bg-gray-900 border border-gray-800 rounded-md pl-9 pr-3 py-1.5 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-colors'
      />
    </form>
  );
}

function NavDropdown({ group }: { group: NavGroup }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isGroupActive = group.items.some(
    (item) => pathname === item.href || pathname?.startsWith(`${item.href}/`),
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  if (group.items.length === 1) {
    const item = group.items[0];
    const Icon = item.icon;
    const isActive =
      pathname === item.href || pathname?.startsWith(`${item.href}/`);
    return (
      <Link
        href={item.href}
        className={`relative flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          isActive ? 'text-white' : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        <Icon sx={{ fontSize: 18 }} />
        {item.label}
        {isActive && (
          <span className='absolute left-3 right-3 -bottom-[9px] h-0.5 bg-emerald-400 rounded-full' />
        )}
      </Link>
    );
  }

  return (
    <div ref={ref} className='relative'>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          isGroupActive || open
            ? 'text-white'
            : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        {group.label}
        <KeyboardArrowDownIcon
          sx={{
            fontSize: 16,
            transition: 'transform 0.2s',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
        {isGroupActive && (
          <span className='absolute left-3 right-3 -bottom-[9px] h-0.5 bg-emerald-400 rounded-full' />
        )}
      </button>

      {open && (
        <div className='absolute top-full left-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-lg shadow-lg shadow-black/40 py-1.5 z-50'>
          {group.items.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2.5 px-3.5 py-2 text-sm transition-colors ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon sx={{ fontSize: 18 }} />
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className='sticky top-0 z-40 border-b border-gray-800 bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-gray-950/80'>
      <div className='max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4'>
        <div className='flex items-center gap-8'>
          <Link href='/' className='flex items-center gap-2 shrink-0 group'>
            <span className='w-2 h-2 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform' />
            <span className='font-bold text-xl text-white tracking-tight'>
              Equity<span className='text-emerald-400'>Lens</span>
            </span>
          </Link>

          <div className='hidden md:flex items-center gap-1'>
            {NAV_GROUPS.map((group) => (
              <NavDropdown key={group.label} group={group} />
            ))}
          </div>
        </div>

        <div className='hidden md:flex items-center gap-3'>
          <TickerSearch />
          <MarketStatus />
        </div>

        <button
          onClick={() => setMobileOpen((v) => !v)}
          className='md:hidden p-2 text-gray-400 hover:text-white'
          aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
        >
          {mobileOpen ? (
            <CloseIcon sx={{ fontSize: 22 }} />
          ) : (
            <MenuIcon sx={{ fontSize: 22 }} />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className='md:hidden border-t border-gray-800 bg-gray-950 px-6 py-4 space-y-4'>
          <TickerSearch />

          <div className='flex flex-col gap-4'>
            {NAV_GROUPS.map((group) => (
              <div key={group.label}>
                {group.items.length > 1 && (
                  <p className='px-1 text-xs font-medium text-gray-600 uppercase tracking-wide mb-1.5'>
                    {group.label}
                  </p>
                )}
                <div className='flex flex-col gap-1'>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      pathname === item.href ||
                      pathname?.startsWith(`${item.href}/`);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md ${
                          isActive
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'text-gray-400 hover:bg-gray-900 hover:text-gray-200'
                        }`}
                      >
                        <Icon sx={{ fontSize: 18 }} />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <MarketStatus />
        </div>
      )}
    </nav>
  );
}
