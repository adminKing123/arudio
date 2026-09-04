/** @typedef {{ id: number, name: string, thumbnail300x300: string, thumbnail1200x1200: string }} Actor */

/** @typedef {{ id: number, name: string, thumbnail300x300: string, thumbnail1200x1200: string }} Artist */

/** @typedef {{ id: number, name: string }} Language */

/**
 * @typedef {{
 *   id: number,
 *   code: string,
 *   title: string,
 *   year: number,
 *   thumbnail300x300: string,
 *   thumbnail1200x1200: string,
 *   actors: number[]
 * }} Album
 */

/**
 * @typedef {{
 *   id: number,
 *   title: string,
 *   url: string,
 *   original_name: string,
 *   lyrics: string,
 *   count: number,
 *   liked_count: number,
 *   duration: number | null,
 *   short_video_url: string | null,
 *   album_id: number,
 *   artists: number[],
 *   languages: number[]
 * }} Song
 */

/**
 * @typedef {{
 *   id: number,
 *   email: string,
 *   passwordHash: string,
 *   name: string,
 *   username: string,
 *   phone: string,
 *   verified: boolean,
 *   createdAt: string,
 *   updatedAt: string
 * }} User
 */

/**
 * @typedef {{
 *   id: number,
 *   email: string,
 *   code: string,
 *   type: "signup" | "password_reset",
 *   expiresAt: string,
 *   used: boolean,
 *   createdAt: string
 * }} Otp
 */

/**
 * @typedef {{
 *   actors: Actor[],
 *   artists: Artist[],
 *   languages: Language[],
 *   albums: Album[],
 *   songs: Song[],
 *   users: User[],
 *   otps: Otp[]
 * }} DatabaseSchema
 */

/** @type {DatabaseSchema} */
export const emptyDatabase = {
  actors: [],
  artists: [],
  languages: [],
  albums: [],
  songs: [],
  users: [],
  otps: [],
};

/** Replaced by remote sync — users and otps are always preserved locally. */
export const SYNC_TABLE_NAMES = [
  "actors",
  "artists",
  "languages",
  "albums",
  "songs",
];

export const TABLE_NAMES = [...SYNC_TABLE_NAMES, "users", "otps"];
