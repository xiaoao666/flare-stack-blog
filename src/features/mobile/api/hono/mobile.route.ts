import type { JSONContent } from "@tiptap/react";
import type { Context } from "hono";
import { Hono } from "hono";
import * as CommentService from "@/features/comments/comments.service";
import * as ConfigService from "@/features/config/service/config.service";
import * as FriendLinkService from "@/features/friend-links/friend-links.service";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_SIZE,
} from "@/features/media/media.schema";
import * as MediaService from "@/features/media/service/media.service";
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

app.get("/session", async (c) => {
  const session = await c
    .get("auth")
    .api.getSession({ headers: c.req.raw.headers });
  return c.json({ user: session?.user ?? null });
});

app.get("/auth/connect", async (c) => {
  const session = await c
    .get("auth")
    .api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    const redirectTo = encodeURIComponent("/api/mobile/auth/connect");
    return c.redirect(`/login?redirectTo=${redirectTo}`);
  }
  const cookie = c.req.header("cookie");
  if (!cookie) return c.json({ error: "SESSION_COOKIE_MISSING" }, 401);
  const code = crypto.randomUUID();
  await c.env.KV.put(
    `mobile-auth:${code}`,
    JSON.stringify({ cookie, userId: session.user.id }),
    { expirationTtl: 300 },
  );
  return c.redirect(`xiaoaoblog://auth?code=${encodeURIComponent(code)}`);
});

app.post("/auth/exchange", async (c) => {
  const { code } = await c.req.json<{ code?: string }>();
  if (!code) return c.json({ error: "CODE_REQUIRED" }, 400);
  const key = `mobile-auth:${code}`;
  const value = await c.env.KV.get(key);
  if (!value) return c.json({ error: "CODE_INVALID_OR_EXPIRED" }, 401);
  await c.env.KV.delete(key);
  const payload = JSON.parse(value) as { cookie: string };
  return c.json({ cookie: payload.cookie });
});

app.get("/posts/:postId/comments", async (c) => {
  const session = await c
    .get("auth")
    .api.getSession({ headers: c.req.raw.headers });
  const data = await CommentService.getRootCommentsByPostId(serviceContext(c), {
    postId: Number(c.req.param("postId")),
    offset: Number(c.req.query("offset") ?? 0),
    limit: Math.min(Number(c.req.query("limit") ?? 50), 100),
    viewerId: session?.user.id,
  });
  return c.json(data);
});

app.get("/posts/:postId/comments/:rootId/replies", async (c) => {
  const session = await c
    .get("auth")
    .api.getSession({ headers: c.req.raw.headers });
  const data = await CommentService.getRepliesByRootId(serviceContext(c), {
    postId: Number(c.req.param("postId")),
    rootId: Number(c.req.param("rootId")),
    offset: 0,
    limit: 100,
    viewerId: session?.user.id,
  });
  return c.json(data);
});

app.post("/posts/:postId/comments", async (c) => {
  const session = await c
    .get("auth")
    .api.getSession({ headers: c.req.raw.headers });
  if (!session) return c.json({ error: "UNAUTHORIZED" }, 401);
  const body = await c.req.json<{
    content: unknown;
    rootId?: number;
    replyToCommentId?: number;
  }>();
  const created = await CommentService.createComment(
    { ...serviceContext(c), auth: c.get("auth"), session },
    {
      postId: Number(c.req.param("postId")),
      content: body.content as JSONContent,
      rootId: body.rootId,
      replyToCommentId: body.replyToCommentId,
    },
  );
  return created.error
    ? c.json({ error: created.error.reason }, 400)
    : c.json(created.data, 201);
});

app.delete("/comments/:id", async (c) => {
  const session = await c
    .get("auth")
    .api.getSession({ headers: c.req.raw.headers });
  if (!session) return c.json({ error: "UNAUTHORIZED" }, 401);
  const deleted = await CommentService.deleteComment(
    { ...serviceContext(c), auth: c.get("auth"), session },
    { id: Number(c.req.param("id")) },
  );
  return deleted.error
    ? c.json({ error: deleted.error.reason }, 403)
    : c.json(deleted.data);
});

app.get("/my/comments", async (c) => {
  const session = await c
    .get("auth")
    .api.getSession({ headers: c.req.raw.headers });
  if (!session) return c.json({ error: "UNAUTHORIZED" }, 401);
  const items = await CommentService.getMyComments(
    { ...serviceContext(c), auth: c.get("auth"), session },
    { offset: 0, limit: 20 },
  );
  return c.json({ items });
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

app.get("/admin/comments", async (c) => {
  const result = await requireAdmin(c);
  if ("response" in result) return result.response;
  return c.json(
    await CommentService.getAllComments(serviceContext(c), {
      offset: 0,
      limit: 100,
      status: c.req.query("status") as never,
    }),
  );
});

app.post("/admin/comments/:id/moderate", async (c) => {
  const result = await requireAdmin(c);
  if ("response" in result) return result.response;
  const body = await c.req.json<{
    status: "published" | "deleted" | "pending";
  }>();
  const moderated = await CommentService.moderateComment(
    serviceContext(c),
    { id: Number(c.req.param("id")), status: body.status },
    result.session.user.id,
  );
  return moderated.error
    ? c.json({ error: moderated.error.reason }, 404)
    : c.json(moderated.data);
});

app.get("/admin/posts/:id", async (c) => {
  const result = await requireAdmin(c);
  if ("response" in result) return result.response;
  const post = await PostService.findPostById(serviceContext(c), {
    id: Number(c.req.param("id")),
  });
  return post ? c.json(post) : c.json({ error: "POST_NOT_FOUND" }, 404);
});

app.get("/admin/media", async (c) => {
  const result = await requireAdmin(c);
  if ("response" in result) return result.response;
  const items = await MediaService.getMediaList(serviceContext(c), {
    cursor: c.req.query("cursor") ? Number(c.req.query("cursor")) : undefined,
    limit: Math.min(Number(c.req.query("limit") ?? 50), 100),
    search: c.req.query("search"),
  });
  return c.json(items);
});

app.post("/admin/media", async (c) => {
  const authResult = await requireAdmin(c);
  if ("response" in authResult) return authResult.response;

  const formData = await c.req.formData();
  const file = formData.get("image");
  if (!(file instanceof File)) {
    return c.json({ error: "IMAGE_REQUIRED" }, 400);
  }
  if (file.size > MAX_FILE_SIZE) {
    return c.json({ error: "IMAGE_TOO_LARGE" }, 413);
  }
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return c.json({ error: "IMAGE_TYPE_NOT_SUPPORTED" }, 415);
  }

  const uploaded = await MediaService.upload(serviceContext(c), { file });
  return uploaded.error
    ? c.json({ error: uploaded.error.reason }, 500)
    : c.json(uploaded.data, 201);
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
    coverImageUrl?: string | null;
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
      coverImageUrl: body.coverImageUrl,
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
