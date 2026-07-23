import { ClientOnly, Link } from "@tanstack/react-router";
import { CalendarDays, Clock3 } from "lucide-react";
import { useEffect, useState } from "react";
import { cn, formatDate } from "@/lib/utils";
import { m } from "@/paraglide/messages";

const fallbackImage = "/images/oacia/hero-sakura.jpg";

const slideContent = [
  {
    eyebrow: "夏日来信",
    caption: "把今天写成一封寄往晴空的信。",
    position: "center center",
  },
  {
    eyebrow: "樱色片刻",
    caption: "在花落以前，收藏所有温柔的瞬间。",
    position: "center 38%",
  },
  {
    eyebrow: "慢慢生活",
    caption: "海风、甜点，还有不急着结束的午后。",
    position: "center center",
  },
] as const;

export interface HeroPostMeta {
  publishedAt?: Date | string | null;
  readTimeInMinutes?: number;
  tags?: Array<{ id: number; name: string }>;
}

export function HeroCarousel({
  title,
  images,
  eyebrow,
  caption,
  variant = "home",
  post,
}: {
  title: string;
  images: Array<string>;
  eyebrow?: string;
  caption?: string;
  variant?: "home" | "inner";
  post?: HeroPostMeta;
}) {
  const usableImages = images.length > 0 ? images : [fallbackImage];
  const slides = usableImages.map((src, index) => ({
    ...slideContent[index % slideContent.length],
    src,
  }));
  const slideCount = slides.length;
  const slideKey = `${title}\u0000${usableImages.join("\u0000")}`;
  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive(0);
  }, [slideKey]);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion || slideCount < 2) return;

    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % slideCount),
      6200,
    );
    return () => window.clearInterval(timer);
  }, [slideCount, slideKey]);

  const activeSlide = slides[active] ?? slides[0];

  return (
    <section
      className={cn("oacia-carousel", `is-${variant}`)}
      aria-roledescription="carousel"
      aria-label={`${title} 顶部插画轮播`}
    >
      <div className="oacia-carousel-stage">
        {slides.map((slide, index) => (
          <img
            key={`${slide.src}-${index}`}
            src={slide.src}
            alt={index === active ? `${title} 顶部插画` : ""}
            fetchPriority={index === 0 ? "high" : "auto"}
            loading={index === 0 ? "eager" : "lazy"}
            style={{ objectPosition: slide.position }}
            className={cn(
              "oacia-carousel-image",
              index === active ? "is-active" : "is-idle",
            )}
          />
        ))}
        <div className="oacia-carousel-gradient" />
        <div className="oacia-carousel-glow" />
      </div>

      <div className="oacia-hero-copy" key={title} aria-live="polite">
        <p>{eyebrow ?? activeSlide.eyebrow}</p>
        <h1>{title}</h1>

        {post ? (
          <div className="oacia-hero-meta">
            {post.publishedAt && (
              <time dateTime={new Date(post.publishedAt).toISOString()}>
                <CalendarDays size={14} strokeWidth={1.7} />
                <ClientOnly fallback="">
                  {formatDate(post.publishedAt)}
                </ClientOnly>
              </time>
            )}
            {typeof post.readTimeInMinutes === "number" && (
              <span>
                <Clock3 size={14} strokeWidth={1.7} />
                {m.read_time({ count: post.readTimeInMinutes })}
              </span>
            )}
            {(post.tags ?? []).slice(0, 4).map((tag) => (
              <Link key={tag.id} to="/posts" search={{ tagName: tag.name }}>
                #{tag.name}
              </Link>
            ))}
          </div>
        ) : (
          <span>{caption ?? activeSlide.caption}</span>
        )}
      </div>

      <div className="oacia-wave" aria-hidden="true">
        <svg
          className="oacia-wave-svg oacia-wave-back"
          viewBox="0 0 2400 180"
          preserveAspectRatio="none"
        >
          <path d="M0 85C180 28 360 142 540 84S900 27 1080 85s360 58 540 0 360-58 540 0 180 32 240 18v77H0Z" />
        </svg>
        <svg
          className="oacia-wave-svg oacia-wave-middle"
          viewBox="0 0 2400 180"
          preserveAspectRatio="none"
        >
          <path d="M0 104c220-74 400 54 620-8s386-73 600-5 390 67 600 0 402-54 580 8v81H0Z" />
        </svg>
        <svg
          className="oacia-wave-svg oacia-wave-front"
          viewBox="0 0 2400 180"
          preserveAspectRatio="none"
        >
          <path d="M0 116c210-44 390 38 590-1s390-44 590 0 390 43 590 0 410-38 630 6v59H0Z" />
        </svg>
      </div>
    </section>
  );
}
