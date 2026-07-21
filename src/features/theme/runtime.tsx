import { useRouteContext } from "@tanstack/react-router";
import type { ComponentType } from "react";
import type { SiteConfig } from "@/features/config/site-config.schema";
import type { ThemeComponents } from "./contract/components";
import type { AuthLayoutProps, PublicLayoutProps, UserLayoutProps } from "./contract/layouts";
import type {
  ForgotPasswordPageProps,
  FriendLinksPageProps,
  HomePageProps,
  LoginPageProps,
  PostPageProps,
  PostsPageProps,
  ProfilePageProps,
  RegisterPageProps,
  ResetPasswordPageProps,
  SearchPageProps,
  SubmitFriendLinkPageProps,
  VerifyEmailPageProps,
} from "./contract/pages";
import defaultTheme from "./themes/default";
import fuwariTheme from "./themes/fuwari";
import oaciaTheme from "./themes/oacia";

const runtimeThemes = {
  default: defaultTheme,
  fuwari: fuwariTheme,
  oacia: oaciaTheme,
} satisfies Record<SiteConfig["activeTheme"], ThemeComponents>;

function useActiveTheme() {
  const { siteConfig } = useRouteContext({ from: "__root__" });
  return runtimeThemes[siteConfig.activeTheme];
}

function themedComponent<TProps extends object>(key: keyof ThemeComponents) {
  return function RuntimeThemeComponent(props: TProps) {
    const activeTheme = useActiveTheme();
    const Component = activeTheme[key] as ComponentType<TProps>;
    return <Component {...props} />;
  };
}

const runtimeTheme: ThemeComponents = {
  config: oaciaTheme.config,
  getDocumentStyle: (siteConfig) =>
    runtimeThemes[siteConfig.activeTheme].getDocumentStyle?.(siteConfig),
  PublicLayout: themedComponent<PublicLayoutProps>("PublicLayout"),
  HomePage: themedComponent<HomePageProps>("HomePage"),
  HomePageSkeleton: themedComponent<Record<string, never>>("HomePageSkeleton"),
  PostsPage: themedComponent<PostsPageProps>("PostsPage"),
  PostsPageSkeleton: themedComponent<Record<string, never>>("PostsPageSkeleton"),
  PostPage: themedComponent<PostPageProps>("PostPage"),
  PostPageSkeleton: themedComponent<Record<string, never>>("PostPageSkeleton"),
  FriendLinksPage: themedComponent<FriendLinksPageProps>("FriendLinksPage"),
  FriendLinksPageSkeleton: themedComponent<Record<string, never>>("FriendLinksPageSkeleton"),
  SearchPage: themedComponent<SearchPageProps>("SearchPage"),
  SubmitFriendLinkPage: themedComponent<SubmitFriendLinkPageProps>("SubmitFriendLinkPage"),
  AuthLayout: themedComponent<AuthLayoutProps>("AuthLayout"),
  UserLayout: themedComponent<UserLayoutProps>("UserLayout"),
  LoginPage: themedComponent<LoginPageProps>("LoginPage"),
  RegisterPage: themedComponent<RegisterPageProps>("RegisterPage"),
  ForgotPasswordPage: themedComponent<ForgotPasswordPageProps>("ForgotPasswordPage"),
  ResetPasswordPage: themedComponent<ResetPasswordPageProps>("ResetPasswordPage"),
  VerifyEmailPage: themedComponent<VerifyEmailPageProps>("VerifyEmailPage"),
  ProfilePage: themedComponent<ProfilePageProps>("ProfilePage"),
  Toaster: themedComponent<Record<string, never>>("Toaster"),
};

export default runtimeTheme;
