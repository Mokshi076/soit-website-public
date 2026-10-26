'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, ChevronsRight } from 'lucide-react';
import { newsItems } from '@/data/news_and_events/news';

const MAX_ITEMS = 6;
const SECONDS_PER_ITEM = 9;

/**
 * "Latest news" bar under the navbar, styled after the GATE 2027 notifications strip:
 * amber label block, dark bar, highlighted titles, NEW badge, dot separators and
 * faded edges.
 * - Reuses the existing `animate-scroll` keyframes (translateX 0 → -50%), so the
 *   list is rendered twice for a seamless loop.
 * - Pauses on hover/keyboard focus; stops for users who prefer reduced motion
 *   (they get a scrollable row instead).
 * - Sits in the normal page flow (the navbar is the sticky part), so it scrolls
 *   away with the page and the content below starts directly under it.
 */
export default function NewsTicker() {
  const pathname = usePathname();
  const items = newsItems.slice(0, MAX_ITEMS);

  if (items.length === 0) return null;

  // Already on the News & Events page: the router won't scroll for us, so tell the
  // page which card to show. From any other page, the normal link navigation
  // (with the #news-<id> hash) is used and the page focuses the card on load.
  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, id: number | string) => {
    if (pathname !== '/news-events') return;
    e.preventDefault();
    window.history.pushState(null, '', `#news-${id}`);
    window.dispatchEvent(new CustomEvent('soit:focus-news', { detail: `news-${id}` }));
  };

  const renderItems = (hidden: boolean) =>
    items.map((item, index) => (
      <div key={`${hidden ? 'dup' : 'main'}-${item.id}`} className="
        flex shrink-0 items-center gap-10
      ">
        <Link
          href={`/news-events#news-${item.id}`}
          onClick={(e) => handleItemClick(e, item.id)}
          tabIndex={hidden ? -1 : undefined}
          aria-hidden={hidden || undefined}
          className="
            flex items-center gap-2 text-sm whitespace-nowrap
            hover:underline
          "
        >
          {index === 0 && (
            <span className="
              bg-accent rounded-sm px-1.5 py-0.5 text-[10px] leading-none
              font-bold tracking-wide text-white uppercase
            ">
              New
            </span>
          )}
          <span className="text-secondary font-semibold">{item.title}</span>
          <span className="text-white/80">{item.date}</span>
        </Link>
        <span className="bg-secondary/70 size-1.5 shrink-0 rounded-full" aria-hidden="true" />
      </div>
    ));

  return (
    <div className="bg-white pt-1">
      {/* pt-1 = the small gap between the navbar's amber line and the ticker */}
      <section
        aria-label="Latest news"
        className="bg-primary-dark flex h-10 w-full items-center text-white"
      >
        {/* Label block (links to the news page) */}
        <Link
          href="/news-events"
          aria-label="Latest news - view all"
          className="
            bg-secondary text-primary-dark z-10 flex h-full shrink-0
            items-center gap-2 px-3 text-xs font-bold tracking-wider uppercase
            hover:brightness-95
            sm:px-4
          "
        >
          <Bell className="size-4" aria-hidden="true" />
          <span className="
            hidden
            sm:inline
          ">Latest News</span>
          <ChevronsRight className="size-4 opacity-70" aria-hidden="true" />
        </Link>

        {/* Scrolling track with faded edges */}
        <div
          className="
            group relative min-w-0 flex-1 overflow-hidden
            mask-[linear-gradient(to_right,transparent,black_28px,black_calc(100%-28px),transparent)]
            motion-reduce:overflow-x-auto
          "
        >
          <div
            className="
              animate-scroll flex w-max gap-10 pl-6
              group-focus-within:[animation-play-state:paused]
              group-hover:[animation-play-state:paused]
              motion-reduce:animate-none
            "
            style={{ animationDuration: `${items.length * SECONDS_PER_ITEM}s` }}
          >
            <div className="flex gap-10">{renderItems(false)}</div>
            <div className="
              flex gap-10
              motion-reduce:hidden
            ">{renderItems(true)}</div>
          </div>
        </div>
      </section>
    </div>
  );
}