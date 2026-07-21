import type { JSONContent } from "@tiptap/react";
import type { Context } from "hono";
import { Hono } from "hono";
import * as ConfigService from "@/features/config/service/config.service";
import * as FriendLinkService from "@/features/friend-links/friend-links.service";
import * as PostService from "@/features/posts/services/posts.service";
import { getServiceContext } from "@/lib/hono/helper";
import { baseMiddleware } from "@/lib/hono/middlewares";

const app = new Hono<{ Bindings: Env }>();

app.use("*", baseMiddleware);

function serviceContext(c: Parameters<typeof getServiceContext>[0]) {
  return getServiceContext(c);
}

async function requireAdmin(c: Context<{ Bindings: Env }>) {
  const session = await c
    .get("auth")
    .api.getSession({ headers: c.req.raw.headers });
  if (!session) return { response: c.json({ error: "UNAUTHORIZED" }, 401) };
  if (session.user.role !== "admin") {
    return { response: c.json({ error: "FORBIDDEN" }, 403) };
  }
  return { session };
}

app.get("/site", async (c) => {
  const [site, friendLinks] = await Promise.all([
    ConfigService.getSiteConfig(serviceContext(c)),
    FriendLinkService.getApprovedFriendLinks(serviceContext(c)),
  ]);
  return c.json({ site, friendLinks });
});

app.get("/admin/session", async (c) => {
  const result = await requireAdmin(c);
  if ("response" in result) return result.response;
  return c.json({ user: result.session.user });
});

app.get("/admin/posts", async (c) => {
  const result = await requireAdmin(c);
  if ("response" in result) return result.response;
  const posts = await PostService.getPosts(serviceContext(c), {
    offset: Number(c.req.query("offset") ?? 0),
    limit: Math.min(Number(c.req.query("limit") ?? 50), 100),
    search: c.req.query("search"),
    sortBy: "updatedAt",
    sortDir: "DESC",
  });
  return c.json({ items: posts });
});

app.get("/admin/posts/:id", async (c) => {
  const result = await requireAdmin(c);
  if ("response" in result) return result.response;
  const post = await PostService.findPostById(serviceContext(c), {
    id: Number(c.req.param("id")),
  });
  return post ? c.json(post) : c.json({ error: "POST_NOT_FOUND" }, 404);
});

app.post("/admin/posts", async (c) => {
  const result = await requireAdmin(c);
  if ("response" in result) return result.response;
  return c.json(await PostService.createEmptyPost(serviceContext(c)), 201);
});

app.put("/admin/posts/:id", async (c) => {
  const result = await requireAdmin(c);
  if ("response" in result) return result.response;
  const body = await c.req.json<{
    title?: string;
    slug?: string;
    summary?: string;
    contentJson?: JSONContent | null;
    readTimeInMinutes?: number;
    pinned?: boolean;
  }>();
  const updated = await PostService.updatePost(serviceContext(c), {
    id: Number(c.req.param("id")),
    data: {
      title: body.title,
      slug: body.slug,
      summary: body.summary,
      contentJson: body.contentJson,
      readTimeInMinutes: body.readTimeInMinutes,
      pinnedAt:
        body.pinned === undefined ? undefined : body.pinned ? new Date() : null,
    },
  });
  return updated.error
    ? c.json({ error: updated.error.reason }, 404)
    : c.json(updated.data);
});

app.post("/admin/posts/:id/status", async (c) => {
  const result = await requireAdmin(c);
  if ("response" in result) return result.response;
  const body = await c.req.json<{ status: "draft" | "published" }>();
  const id = Number(c.req.param("id"));
  const updated = await PostService.updatePost(serviceContext(c), {
    id,
    data: { status: body.status },
  });
  if (updated.error) return c.json({ error: updated.error.reason }, 404);
  await PostService.startPostProcessWorkflow(serviceContext(c), {
    id,
    status: body.status,
    clientToday: new Date().toISOString().slice(0, 10),
  });
  return c.json({ success: true });
});

app.delete("/admin/posts/:id", async (c) => {
  const result = await requireAdmin(c);
  if ("response" in result) return result.response;
  const deleted = await PostService.deletePost(serviceContext(c), {
    id: Number(c.req.param("id")),
  });
  return deleted.error
    ? c.json({ error: deleted.error.reason }, 404)
    : c.json(deleted.data);
});

app.get("/admin/config", async (c) => {
  const result = await requireAdmin(c);
  if ("response" in result) return result.response;
  return c.json(await ConfigService.getSystemConfig(serviceContext(c)));
});

app.patch("/admin/config/site", async (c) => {
  const result = await requireAdmin(c);
  if ("response" in result) return result.response;
  const body = await c.req.json<{
    title?: string;
    author?: string;
    description?: string;
    activeTheme?: "default" | "fuwari" | "oacia";
    carouselImages?: string[];
  }>();
  const current = await ConfigService.getSystemConfig(serviceContext(c));
  const site = current.site ?? {};
  const next = {
    ...current,
    site: {
      ...site,
      title: body.title ?? site.title,
      author: body.author ?? site.author,
      description: body.description ?? site.description,
      activeTheme: body.activeTheme ?? site.activeTheme,
      theme: body.carouselImages
        ? {
            ...site.theme,
            oacia: {
              ...site.theme?.oacia,
              carouselImages: body.carouselImages,
            },
          }
        : site.theme,
    },
  };
  await ConfigService.updateSystemConfig(serviceContext(c), next);
  return c.json({ success: true });
});

export default app;
