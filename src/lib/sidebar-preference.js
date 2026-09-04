export const SIDEBAR_COLLAPSED_COOKIE = "sidebar-collapsed";
export const SIDEBAR_COLLAPSED_STORAGE_KEY = "arudio-sidebar-collapsed";

/** @param {boolean} collapsed */
export function setSidebarCollapsedPreference(collapsed) {
  const value = collapsed ? "true" : "false";

  window.localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, value);
  document.cookie = `${SIDEBAR_COLLAPSED_COOKIE}=${value}; path=/; max-age=31536000; SameSite=Lax`;
}

/** @returns {boolean | null} */
export function readSidebarCollapsedFromStorage() {
  const stored = window.localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY);

  if (stored === "true") {
    return true;
  }

  if (stored === "false") {
    return false;
  }

  return null;
}

/** @param {boolean} collapsed */
export function syncSidebarCollapsedCookie(collapsed) {
  const value = collapsed ? "true" : "false";
  document.cookie = `${SIDEBAR_COLLAPSED_COOKIE}=${value}; path=/; max-age=31536000; SameSite=Lax`;
}
