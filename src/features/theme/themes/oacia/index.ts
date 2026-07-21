import "./styles/index.css";
import Toaster from "@/components/ui/toaster";
import type { SiteConfig } from "@/features/config/site-config.schema";
import type { ThemeComponents } from "@/features/theme/contract/components";
import { AuthLayout } from "../default/layouts/auth-layout";
import { UserLayout } from "../default/layouts/user-layout";
import { ForgotPasswordPage } from "../default/pages/auth/forgot-password";
import { LoginPage } from "../default/pages/auth/login";
import { RegisterPage } from "../default/pages/auth/register";
import { ResetPasswordPage } from "../default/pages/auth/reset-password";
import { VerifyEmailPage } from "../default/pages/auth/verify-email";
import {
  FriendLinksPage,
  FriendLinksPageSkeleton,
} from "../default/pages/friend-links";
import { PostPage, PostPageSkeleton } from "../default/pages/post";
import { PostsPage, PostsPageSkeleton } from "../default/pages/posts";
import { SearchPage } from "../default/pages/search";
import { SubmitFriendLinkPage } from "../default/pages/submit-friend-link";
import { ProfilePage } from "../default/pages/user/profile";
import { config } from "./config";
import { PublicLayout } from "./layouts/public-layout";
import { HomePage, HomePageSkeleton } from "./pages/home";

export default {
  config,
  getDocumentStyle: (_siteConfig: SiteConfig) => undefined,
  HomePage,
  HomePageSkeleton,
  PostsPage,
  PostsPageSkeleton,
  PostPage,
  PostPageSkeleton,
  PublicLayout,
  AuthLayout,
  UserLayout,
  FriendLinksPage,
  FriendLinksPageSkeleton,
  SearchPage,
  SubmitFriendLinkPage,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  VerifyEmailPage,
  ProfilePage,
  Toaster,
} satisfies ThemeComponents;
