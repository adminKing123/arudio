import {
  HiArrowRightOnRectangle,
  HiCog6Tooth,
  HiHeart,
  HiHome,
  HiMusicalNote,
  HiQueueList,
} from "react-icons/hi2";

/** @typedef {{ href: string, label: string, icon: import("react").IconType }} DashboardNavItem */

/** @type {DashboardNavItem[]} */
export const DASHBOARD_NAV_ITEMS = [
  { href: "/", label: "Home", icon: HiHome },
  { href: "/songs", label: "Songs", icon: HiMusicalNote },
  { href: "/playlists", label: "Playlists", icon: HiQueueList },
  { href: "/liked", label: "Liked Songs", icon: HiHeart },
  { href: "/settings", label: "Settings", icon: HiCog6Tooth },
];

export const DASHBOARD_LOGOUT_ICON = HiArrowRightOnRectangle;
