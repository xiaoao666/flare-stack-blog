import {
  Link,
  useLocation,
  useRouteContext,
  useRouterState,
} from "@tanstack/react-router";
import { Menu, Search, UserRound, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/common/theme-toggle";
import type { PublicLayoutProps } from "@/features/theme/contract/layouts";
import { cn } from "@/lib/utils";
import { m } from "@/paraglide/messages";
import { HeroCarousel, type HeroPostMeta } from "../components/hero-carousel";

type HeroRouteData = {
  title?: unknown;
  description?: unknown;
  post?: unknown;
};

type HeroRoutePost = HeroPostMeta & {
  title: string;
  summary?: string | null;
  coverImageUrl?: string | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getHeroRouteData(value: unknown): HeroRouteData {
  return isRecord(value) ? (value as HeroRouteData) : {};
}

function isHeroRoutePost(value: unknown): value is HeroRoutePost {
  return isRecord(value) && typeof value.title === "string";
}

function shortenHeroCaption(value: string) {
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized.length > 72
    ? `${normalized.slice(0, 72).trimEnd()}...`
    : normalized;
}

export function PublicLayout({
  children,
  navOptions,
  user,
  logout,
}: PublicLayoutProps) {
  const { siteConfig } = useRouteContext({ from: "__root__" });
  const location = useLocation();
  const activeLoaderData = useRouterState({
    select: (state) =>
      state.matches[state.matches.length - 1]?.loaderData as unknown,
  });
  const [menuOpen, setMenuOpen] = useState(false);

  const routeData = getHeroRouteData(activeLoaderData);
  const post = isHeroRoutePost(routeData.post) ? routeData.post : undefined;
  const isHome = location.pathname === "/";
  const pageTitle =
    post?.title ??
    (typeof routeData.title === "string" ? routeData.title : siteConfig.title);
  const pageCaption = shortenHeroCaption(
    post?.summary ||
      (typeof routeData.description === "string"
        ? routeData.description
        : siteConfig.description),
  );
  const carouselImages = siteConfig.theme.oacia.carouselImages;
  const heroImages = post?.coverImageUrl
    ? [
        post.coverImageUrl,
        ...carouselImages.filter((image) => image !== post.coverImageUrl),
      ]
    : carouselImages;

  const heroPost = post
    ? {
        publishedAt: post.publishedAt,
        readTimeInMinutes: post.readTimeInMinutes,
        tags: post.tags,
      }
    : undefined;

  return (
    <div className="oacia-theme min-h-[100dvh]">
      <header className="oacia-header">
        <div className="oacia-nav-shell">
          <Link to="/" className="oacia-brand" aria-label={siteConfig.title}>
            <span>{siteConfig.title}</span>
            <small>{siteConfig.author}</small>
          </Link>
          <nav className="oacia-desktop-nav" aria-label="主导航">
            {navOptions.map((option) => (
              <Link
                key={option.id}
                to={option.to}
                className={cn(
                  "oacia-nav-link",
                  (location.pathname === option.to ||
                    (option.to === "/posts" &&
                      location.pathname.startsWith("/post/"))) &&
                    "is-active",
                )}
              >
                {option.label}
              </Link>
            ))}
          </nav>
          <div className="oacia-nav-actions">
            <Link
              to="/search"
              className="oacia-icon-button"
              aria-label={m.nav_search()}
            >
              <Search size={16} strokeWidth={1.6} />
            </Link>
            <ThemeToggle className="oacia-icon-button" />
            <Link
              to={user ? "/profile" : "/login"}
              className="oacia-icon-button hidden sm:grid"
              aria-label={user ? m.profile_settings() : m.nav_login()}
            >
              <UserRound size={16} strokeWidth={1.6} />
            </Link>
            <button
              type="button"
              className="oacia-icon-button lg:hidden"
              onClick={() => setMenuOpen((value) => !value)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "关闭菜单" : "打开菜单"}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="oacia-mobile-nav">
            {navOptions.map((option) => (
              <Link
                key={option.id}
                to={option.to}
                onClick={() => setMenuOpen(false)}
              >
                {option.label}
              </Link>
            ))}
            <Link
              to={user ? "/profile" : "/login"}
              onClick={() => setMenuOpen(false)}
            >
              {user ? m.profile_settings() : m.nav_login()}
            </Link>
            {user && (
              <button type="button" onClick={() => void logout()}>
                {m.profile_logout()}
              </button>
            )}
          </div>
        )}
      </header>

      <HeroCarousel
        title={pageTitle}
        images={heroImages}
        eyebrow={isHome ? siteConfig.author : siteConfig.title}
        caption={pageCaption}
        variant={isHome ? "home" : "inner"}
        post={heroPost}
      />

      <main className="oacia-public-main">{children}</main>

      <footer className="oacia-footer">
        <div>
          <strong>{siteConfig.title}</strong>
          <span>{siteConfig.description}</span>
        </div>
        <p>
          <span suppressHydrationWarning>{new Date().getFullYear()}</span>{" "}
          {siteConfig.author}
        </p>
      </footer>
    </div>
  );
}
