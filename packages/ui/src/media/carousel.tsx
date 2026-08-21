'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { useLabels } from '../lib/labels.js';
import { cn } from '../lib/cn.js';
import { useMotionSettings } from '../motion/motion-provider.js';
import { Skeleton } from '../feedback/skeleton.js';
import { shouldAutoplay } from './autoplay.js';

export interface CarouselProps {
  children: ReactNode;
  /** Accessible name — a carousel with no name is an unlabelled region to a screen reader. */
  label: string;
  /** Slide width as a CSS length or fraction of the viewport, e.g. '18rem' or '50%'. */
  slideWidth?: string;
  gap?: 2 | 3 | 4 | 5;
  loop?: boolean;
  align?: 'start' | 'center';
  /** Milliseconds between advances. Omit for a carousel that only moves when asked. */
  autoplay?: number;
  showArrows?: boolean;
  showDots?: boolean;
  className?: string;
}

function CarouselRoot({
  children,
  label,
  slideWidth = '18rem',
  gap = 4,
  loop = false,
  align = 'start',
  autoplay,
  showArrows = true,
  showDots = true,
  className,
}: CarouselProps) {
  const { enabled: motionEnabled } = useMotionSettings();
  const labels = useLabels();
  const [emblaRef, embla] = useEmblaCarousel({ loop, align, containScroll: 'trimSnaps' });
  const [selected, setSelected] = useState(0);
  const [snapCount, setSnapCount] = useState(0);
  const [pointerInside, setPointerInside] = useState(false);
  const [focusInside, setFocusInside] = useState(false);
  const [documentHidden, setDocumentHidden] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!embla) return;
    const sync = () => {
      setSelected(embla.selectedScrollSnap());
      setSnapCount(embla.scrollSnapList().length);
    };
    sync();
    embla.on('select', sync).on('reInit', sync);
    return () => {
      embla.off('select', sync).off('reInit', sync);
    };
  }, [embla]);

  useEffect(() => {
    const onVisibility = () => setDocumentHidden(document.hidden);
    onVisibility();
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const running = shouldAutoplay({
    requested: Boolean(autoplay),
    pointerInside,
    focusInside,
    documentHidden,
    reducedMotion: !motionEnabled,
  });

  useEffect(() => {
    if (!embla || !running || !autoplay) return;
    const timer = window.setInterval(() => {
      if (embla.canScrollNext()) embla.scrollNext();
      else embla.scrollTo(0);
    }, autoplay);
    return () => window.clearInterval(timer);
  }, [embla, running, autoplay]);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!embla) return;
      if (event.key === 'ArrowRight') {
        embla.scrollNext();
        event.preventDefault();
      }
      if (event.key === 'ArrowLeft') {
        embla.scrollPrev();
        event.preventDefault();
      }
    },
    [embla],
  );

  const style = {
    '--cb-carousel-slide': slideWidth,
    '--cb-carousel-gap': `var(--cb-space-${gap})`,
  } as CSSProperties;

  return (
    <div
      ref={rootRef}
      className={cn('cb-carousel', className)}
      style={style}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerEnter={() => setPointerInside(true)}
      onPointerLeave={() => setPointerInside(false)}
      onFocus={() => setFocusInside(true)}
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node)) setFocusInside(false);
      }}
    >
      <div className="cb-carousel__viewport" ref={emblaRef}>
        <div className="cb-carousel__track">{children}</div>
      </div>

      {showArrows ? (
        <div className="cb-carousel__arrows">
          <button
            type="button"
            className="cb-carousel__arrow"
            aria-label={labels.previousSlide}
            onClick={() => embla?.scrollPrev()}
            disabled={!loop && selected === 0}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            className="cb-carousel__arrow"
            aria-label={labels.nextSlide}
            onClick={() => embla?.scrollNext()}
            disabled={!loop && snapCount > 0 && selected === snapCount - 1}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      ) : null}

      {showDots && snapCount > 1 ? (
        <div className="cb-carousel__dots">
          {Array.from({ length: snapCount }, (_, index) => (
            <button
              key={index}
              type="button"
              className="cb-carousel__dot"
              data-active={index === selected || undefined}
              aria-label={labels.goToSlide(index + 1)}
              aria-current={index === selected || undefined}
              onClick={() => embla?.scrollTo(index)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export interface CarouselSlideProps {
  children: ReactNode;
  className?: string;
}

function CarouselSlide({ children, className }: CarouselSlideProps) {
  return (
    <div className={cn('cb-carousel__slide', className)} role="group" aria-roledescription="slide">
      {children}
    </div>
  );
}

export interface CarouselSkeletonProps {
  slides?: number;
  slideWidth?: string;
  slideHeight?: string;
  gap?: 2 | 3 | 4 | 5;
}

/** Same track geometry as the real carousel, so slides do not resize on load (ADR 0009). */
function CarouselSkeleton({
  slides = 3,
  slideWidth = '18rem',
  slideHeight = '10rem',
  gap = 4,
}: CarouselSkeletonProps) {
  const style = {
    '--cb-carousel-slide': slideWidth,
    '--cb-carousel-gap': `var(--cb-space-${gap})`,
  } as CSSProperties;
  return (
    <div className="cb-carousel" style={style} aria-hidden="true">
      <div className="cb-carousel__viewport">
        <div className="cb-carousel__track">
          {Array.from({ length: slides }, (_, index) => (
            <div className="cb-carousel__slide" key={index}>
              <Skeleton height={slideHeight} radius="lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const Carousel = Object.assign(CarouselRoot, {
  Slide: CarouselSlide,
  Skeleton: CarouselSkeleton,
});
