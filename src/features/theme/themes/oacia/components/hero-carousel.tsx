import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const slideContent = [
  {
    alt: "晴空下飞舞的少女插画",
    eyebrow: "SUMMER LETTER · 01",
    caption: "把今天写成一封寄往晴空的信。",
    position: "center center",
  },
  {
    alt: "粉紫色花瓣中的少女插画",
    eyebrow: "SAKURA DREAM · 02",
    caption: "在花落以前，收藏所有温柔瞬间。",
    position: "center 38%",
  },
  {
    alt: "临海空间里的午后时光插画",
    eyebrow: "SLOW AFTERNOON · 03",
    caption: "海风、甜点，以及不急着结束的午后。",
    position: "center center",
  },
] as const;

export function HeroCarousel({
  title,
  images,
}: {
  title: string;
  images: Array<string>;
}) {
  const slides = images.map((src, index) => ({
    ...slideContent[index % slideContent.length],
    src,
  }));
  const [active, setActive] = useState(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion || slides.length < 2) return;
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % slides.length),
      6200,
    );
    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <section
      className="oacia-carousel"
      aria-roledescription="carousel"
      aria-label="首页插画轮播"
    >
      <div className="oacia-carousel-stage">
        {slides.map((slide, index) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={index === active ? slide.alt : ""}
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

      <div className="oacia-hero-copy" aria-live="polite">
        <p>{slides[active].eyebrow}</p>
        <h1>{title}</h1>
        <span>{slides[active].caption}</span>
      </div>

      <div className="oacia-scroll-cue" aria-hidden="true">
        <i />
        <span>SCROLL</span>
      </div>

      <div className="oacia-wave" aria-hidden="true">
        <div className="oacia-wave-layer oacia-wave-back" />
        <div className="oacia-wave-layer oacia-wave-front" />
      </div>
    </section>
  );
}
