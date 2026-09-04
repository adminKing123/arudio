import { BaseModel } from "./BaseModel.js";
import { ModelRepository } from "./ModelRepository.js";

/** @typedef {{ id: number, name: string, thumbnail300x300: string, thumbnail1200x1200: string }} ArtistData */

export class Artist extends BaseModel {
  /** @type {string} */
  static tableName = "artists";

  getSongs() {
    return this.db.song.allSync().filter((song) => song.artists.includes(this.id));
  }

  getAlbums() {
    const albumIds = new Set(this.getSongs().map((song) => song.album_id));
    return this.db.album.allSync().filter((album) => albumIds.has(album.id));
  }

  toJSONWithSongs() {
    return {
      ...this.toJSON(),
      songs: this.getSongs().map((song) => song.toJSON()),
    };
  }
}

export class ArtistRepository extends ModelRepository {
  constructor(db) {
    super(db, Artist, "artists");
  }

  /** @param {number} id @returns {Promise<Artist | null>} */
  get(id) {
    return super.get(id);
  }

  /** @returns {Promise<Artist[]>} */
  all() {
    return super.all();
  }

  /** @param {number[]} ids @returns {Promise<Artist[]>} */
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

  /** @param {string} name @returns {Promise<Artist | null>} */
  findByName(name) {
    return super.findBy("name", name);
  }

  /** @param {number} id */
  async getWithSongs(id) {
    const artist = await this.get(id);
    return artist ? artist.toJSONWithSongs() : null;
  }
}
