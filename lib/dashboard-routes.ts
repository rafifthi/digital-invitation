import type { MenuId } from "@/components/dashboard/types";

export const DASHBOARD_ROUTES: Record<MenuId, string> = {
  overview: "/",
  design: "/design",
  "guest-list": "/guest-list",
  wishes: "/wishes",
  settings: "/settings",
  account: "/account",
};

export function menuFromPathname(pathname: string): MenuId {
  const match = (Object.entries(DASHBOARD_ROUTES) as Array<[MenuId, string]>)
    .find(([, route]) => route === pathname || (route !== "/" && pathname.startsWith(`${route}/`)));
  return match?.[0] ?? "overview";
}
