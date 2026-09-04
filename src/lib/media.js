export const MEDIA_BASE_URL =
  "https://raw.githubusercontent.com/harshcore/arsongs-src-copy/main";

/** @typedef {"300x300" | "1200x1200"} ThumbnailSize */

/**
 * @param {string | null | undefined} path
 */
export function getMediaUrl(path) {
  if (!path) {
    return null;
  }

  const normalizedPath = path.replace(/^\/+/, "");
  return `${MEDIA_BASE_URL}/${normalizedPath}`;
}

/**
 * @param {{ thumbnail300x300?: string, thumbnail1200x1200?: string } | null | undefined} entity
 * @param {ThumbnailSize} [size="300x300"]
 */
export function getThumbnailUrl(entity, size = "300x300") {
  if (!entity) {
    return null;
  }

  const path =
    size === "1200x1200"
      ? entity.thumbnail1200x1200
      : entity.thumbnail300x300;

  return getMediaUrl(path);
}
