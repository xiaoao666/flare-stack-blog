import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Globe2 } from "lucide-react";
import type { FriendLinksPageProps } from "@/features/theme/contract/pages";
import { m } from "@/paraglide/messages";

function FriendLinkCard({ link }: { link: FriendLinksPageProps["links"][number] }) {
  const displayUrl = link.siteUrl
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");

  return (
    <a
      href={link.siteUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="oacia-friend-card"
    >
      <div className="oacia-friend-card-icon">
        {link.logoUrl ? (
          <img src={link.logoUrl} alt="" loading="lazy" />
        ) : (
          <Globe2 size={20} strokeWidth={1.4} />
        )}
      </div>
      <div className="oacia-friend-card-copy">
        <div className="oacia-friend-card-heading">
          <h2>{link.siteName}</h2>
          <ArrowUpRight size={16} strokeWidth={1.5} />
        </div>
        <span>{displayUrl}</span>
        {link.description && <p>{link.description}</p>}
      </div>
    </a>
  );
}

export function FriendLinksPage({ links }: FriendLinksPageProps) {
  return (
    <div className="oacia-friend-links-page">
      <div className="oacia-friend-links-intro">
        <span>{String(links.length).padStart(2, "0")} 个链接</span>
        <p>{m.friend_links_desc()}</p>
      </div>

      {links.length === 0 ? (
        <div className="oacia-friend-links-empty">
          <Globe2 size={30} strokeWidth={1.3} />
          <p>{m.friend_links_no_links()}</p>
          <span>{m.friend_links_first_link()}</span>
        </div>
      ) : (
        <div className="oacia-friend-links-grid">
          {links.map((link) => (
            <FriendLinkCard key={link.id} link={link} />
          ))}
        </div>
      )}

      <div className="oacia-friend-links-cta">
        <div>
          <strong>{m.friend_links_join_title()}</strong>
          <p>{m.friend_links_join_desc()}</p>
        </div>
        <Link to="/submit-friend-link">
          {m.friend_links_apply()}
          <ArrowUpRight size={15} strokeWidth={1.5} />
        </Link>
      </div>
    </div>
  );
}
