import { BaseModel } from "./BaseModel.js";
import { ModelRepository } from "./ModelRepository.js";

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
 * }} SongData
 */

export class Song extends BaseModel {
  /** @type {string} */
  static tableName = "songs";

  getAlbum() {
    return this.db.album.getSync(this.album_id);
  }

  getArtists() {
    return this.db.artist.manySync(this.artists);
  }

  getLanguages() {
    return this.db.language.manySync(this.languages);
  }

  toJSONWithRelations() {
    const album = this.getAlbum();

    return {
      id: this.id,
      title: this.title,
      url: this.url,
      original_name: this.original_name,
      lyrics: this.lyrics,
      count: this.count,
      liked_count: this.liked_count,
      duration: this.duration,
      short_video_url: this.short_video_url,
      album: album ? album.toJSONWithActors() : null,
      artists: this.getArtists().map((artist) => artist.toJSON()),
      languages: this.getLanguages().map((language) => language.toJSON()),
    };
  }

  toJSONWithArtistsAndLanguages() {
    return {
      id: this.id,
      title: this.title,
      url: this.url,
      original_name: this.original_name,
      lyrics: this.lyrics,
      count: this.count,
      liked_count: this.liked_count,
      duration: this.duration,
      short_video_url: this.short_video_url,
      artists: this.getArtists().map((artist) => artist.toJSON()),
      languages: this.getLanguages().map((language) => language.toJSON()),
    };
  }
}

export class SongRepository extends ModelRepository {
  constructor(db) {
    super(db, Song, "songs");
  }

  /** @param {number} id @returns {Promise<Song | null>} */
  get(id) {
    return super.get(id);
  }

  /** @returns {Promise<Song[]>} */
  all() {
    return super.all();
  }

  /** @param {number[]} ids @returns {Promise<Song[]>} */
  many(ids) {
    return super.many(ids);
  }

  /** @returns {Promise<number>} */
  count() {
    return super.count();
  }

  /** @param {number} id @returns {Promise<boolean>} */
  exists(id) {
    return super.exists(id);
  }

  /** @param {string} title @returns {Promise<Song | null>} */
  findByTitle(title) {
    return super.findBy("title", title);
  }

  /** @param {string} originalName @returns {Promise<Song | null>} */
  findByOriginalName(originalName) {
    return super.findBy("original_name", originalName);
  }

  /** @param {number} albumId @returns {Promise<Song[]>} */
  async getByAlbumId(albumId) {
    await this.db.ensureReady();
    return this.allSync().filter((song) => song.album_id === albumId);
  }

  /** @param {number} id */
  async getWithRelations(id) {
    const song = await this.get(id);
    return song ? song.toJSONWithRelations() : null;
  }

  /** @param {number} page @param {number} limit */
  async paginateWithRelations(page, limit) {
    const result = await this.paginate(page, limit);

    return {
      ...result,
      items: result.items.map((song) => song.toJSONWithRelations()),
    };
  }
}
