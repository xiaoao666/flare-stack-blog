import { Link, useLocation, useRouteContext } from "@tanstack/react-router";
import { Menu, Search, UserRound, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/common/theme-toggle";
import type { PublicLayoutProps } from "@/features/theme/contract/layouts";
import { cn } from "@/lib/utils";
import { m } from "@/paraglide/messages";

export function PublicLayout({
  children,
  navOptions,
  user,
  logout,
}: PublicLayoutProps) {
  const { siteConfig } = useRouteContext({ from: "__root__" });
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

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
                  location.pathname === option.to && "is-active",
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

      <main>{children}</main>

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
