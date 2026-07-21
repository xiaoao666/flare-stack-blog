import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const slides = [
  {
    src: "/images/oacia/hero-sky.jpg",
    alt: "晴空下飞舞的少女插画",
    eyebrow: "SUMMER LETTER · 01",
    caption: "把今天写成一封寄往晴空的信。",
    position: "center center",
  },
  {
    src: "/images/oacia/hero-sakura.jpg",
    alt: "粉紫色花瓣中的少女插画",
    eyebrow: "SAKURA DREAM · 02",
    caption: "在花落以前，收藏所有温柔瞬间。",
    position: "center 38%",
  },
  {
    src: "/images/oacia/hero-afternoon.jpg",
    alt: "临海空间里的午后时光插画",
    eyebrow: "SLOW AFTERNOON · 03",
    caption: "海风、甜点，以及不急着结束的午后。",
    position: "center center",
  },
] as const;

export function HeroCarousel({ title }: { title: string }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (paused || reducedMotion) return;
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % slides.length),
      6200,
    );
    return () => window.clearInterval(timer);
  }, [paused]);

  const select = (index: number) =>
    setActive((index + slides.length) % slides.length);

  return (
    <section
      className="oacia-carousel"
      aria-roledescription="carousel"
      aria-label="首页插画轮播"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
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

      <div className="oacia-carousel-controls">
        <button type="button" onClick={() => select(active - 1)} aria-label="上一张图片">
          <ChevronLeft size={18} strokeWidth={1.7} />
        </button>
        <div className="oacia-carousel-dots" aria-label="选择轮播图片">
          {slides.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => select(index)}
              className={cn("oacia-carousel-dot", index === active && "is-active")}
              aria-label={`显示第 ${index + 1} 张图片`}
              aria-current={index === active ? "true" : undefined}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          aria-label={paused ? "继续自动播放" : "暂停自动播放"}
        >
          {paused ? <Play size={16} /> : <Pause size={16} />}
        </button>
        <button type="button" onClick={() => select(active + 1)} aria-label="下一张图片">
          <ChevronRight size={18} strokeWidth={1.7} />
        </button>
      </div>

      <div className="oacia-wave" aria-hidden="true">
        <div className="oacia-wave-layer oacia-wave-back" />
        <div className="oacia-wave-layer oacia-wave-front" />
      </div>
    </section>
  );
}
