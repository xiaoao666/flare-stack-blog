import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const slides = [
  { src: "/images/oacia/sky-day.jpg", alt: "蓝色天空与人物构成的夏日插画" },
  { src: "/images/oacia/afternoon.jpg", alt: "临海空间里的午后时光插画" },
  { src: "/images/oacia/sakura.jpg", alt: "樱花树下手持花朵的人物插画" },
] as const;

export function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (paused || reducedMotion) return;
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % slides.length),
      6500,
    );
    return () => window.clearInterval(timer);
  }, [paused]);

  const select = (index: number) =>
    setActive((index + slides.length) % slides.length);

  return (
    <section
      className="oacia-carousel group"
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
            className={cn(
              "oacia-carousel-image",
              index === active ? "is-active" : "is-idle",
            )}
          />
        ))}
        <div className="oacia-carousel-wash" />
      </div>

      <div className="oacia-carousel-controls">
        <button
          type="button"
          onClick={() => select(active - 1)}
          className="oacia-icon-button"
          aria-label="上一张图片"
        >
          <ChevronLeft size={17} strokeWidth={1.7} />
        </button>
        <div className="oacia-carousel-dots" aria-label="选择轮播图片">
          {slides.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => select(index)}
              className={cn(
                "oacia-carousel-dot",
                index === active && "is-active",
              )}
              aria-label={`显示第 ${index + 1} 张图片`}
              aria-current={index === active ? "true" : undefined}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          className="oacia-icon-button"
          aria-label={paused ? "继续自动播放" : "暂停自动播放"}
        >
          {paused ? (
            <Play size={15} strokeWidth={1.7} />
          ) : (
            <Pause size={15} strokeWidth={1.7} />
          )}
        </button>
        <button
          type="button"
          onClick={() => select(active + 1)}
          className="oacia-icon-button"
          aria-label="下一张图片"
        >
          <ChevronRight size={17} strokeWidth={1.7} />
        </button>
      </div>
    </section>
  );
}
