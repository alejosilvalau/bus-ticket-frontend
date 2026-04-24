import { useLocation } from "react-router-dom";

interface RouteConfig {
  path: string;
  hideNavbar?: boolean;
  hideFooter?: boolean;
}

const HIDDEN_NAVBAR_ROUTES: RouteConfig[] = [
  { path: "/login", hideNavbar: true, hideFooter: true },
];

export const useHideNavbar = (): boolean => {
  const location = useLocation();
  return HIDDEN_NAVBAR_ROUTES.some(route => route.path === location.pathname && route.hideNavbar);
};

export const useHideFooter = (): boolean => {
  const location = useLocation();
  return HIDDEN_NAVBAR_ROUTES.some(route => route.path === location.pathname && route.hideFooter);
};
