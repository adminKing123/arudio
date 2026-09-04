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
 *   actors: Actor[],
 *   artists: Artist[],
 *   languages: Language[],
 *   albums: Album[],
 *   songs: Song[]
 * }} DatabaseSchema
 */

/** @type {DatabaseSchema} */
export const emptyDatabase = {
  actors: [],
  artists: [],
  languages: [],
  albums: [],
  songs: [],
};

export const TABLE_NAMES = [
  "actors",
  "artists",
  "languages",
  "albums",
  "songs",
];
