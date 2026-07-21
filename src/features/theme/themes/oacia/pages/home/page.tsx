import { Link, useRouteContext } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useMemo } from "react";
import {
  resolveSocialHref,
  SOCIAL_PLATFORMS,
} from "@/features/config/utils/social-platforms";
import type { HomePageProps } from "@/features/theme/contract/pages";
import { m } from "@/paraglide/messages";
import { HeroCarousel } from "../../components/hero-carousel";
import { PostRow } from "../../components/post-row";

export function HomePage({ posts, pinnedPosts }: HomePageProps) {
  const { siteConfig } = useRouteContext({ from: "__root__" });
  const pinned = pinnedPosts ?? [];
  const pinnedIds = useMemo(
    () => new Set(pinned.map((post) => post.id)),
    [pinned],
  );
  const recent = posts.filter((post) => !pinnedIds.has(post.id));

  return (
    <div className="oacia-home">
      <HeroCarousel title={siteConfig.title} />

      <section className="oacia-intro">
        <div>
          <p className="oacia-kicker">WELCOME TO MY LITTLE UNIVERSE</p>
          <h2>写下喜欢的事，<br /><em>也收藏闪闪发光的日常。</em></h2>
          <p className="oacia-description">{siteConfig.description}</p>
        </div>
        <div className="oacia-socials" aria-label="社交链接">
          {siteConfig.social
            .filter((link) => link.url)
            .map((link, index) => {
              const preset =
                link.platform === "custom"
                  ? null
                  : SOCIAL_PLATFORMS[link.platform];
              const Icon = preset?.icon;
              const label = preset?.label ?? link.label ?? "Link";
              return (
                <a
                  key={`${link.platform}-${index}`}
                  href={resolveSocialHref(link.platform, link.url)}
                  target={link.platform === "email" ? undefined : "_blank"}
                  rel={link.platform === "email" ? undefined : "noreferrer"}
                >
                  {Icon ? <Icon size={16} strokeWidth={1.6} /> : null}
                  <span>{label}</span>
                </a>
              );
            })}
        </div>
      </section>

      {pinned.length > 0 && (
        <section className="oacia-post-section">
          <div className="oacia-section-heading">
            <h2>{m.home_pinned_posts()}</h2>
            <span>{String(pinned.length).padStart(2, "0")}</span>
          </div>
          <div>
            {pinned.map((post, index) => (
              <PostRow key={post.id} post={post} pinned index={index} />
            ))}
          </div>
        </section>
      )}

      <section className="oacia-post-section">
        <div className="oacia-section-heading">
          <h2>{m.home_latest_posts()}</h2>
          <Link to="/posts" className="oacia-all-posts-link">
            {m.home_view_all_posts()}
            <ArrowRight size={15} strokeWidth={1.6} />
          </Link>
        </div>
        <div>
          {recent.map((post, index) => (
            <PostRow key={post.id} post={post} index={index + pinned.length} />
          ))}
        </div>
      </section>
    </div>
  );
}
