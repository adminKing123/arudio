import { BaseModel } from "./BaseModel.js";
import { ModelRepository } from "./ModelRepository.js";

/**
 * @typedef {{
 *   id: number,
 *   code: string,
 *   title: string,
 *   year: number,
 *   thumbnail300x300: string,
 *   thumbnail1200x1200: string,
 *   actors: number[]
 * }} AlbumData
 */

export class Album extends BaseModel {
  /** @type {string} */
  static tableName = "albums";

  getActors() {
    return this.db.actor.manySync(this.actors);
  }

  getSongs() {
    return this.db.song.allSync().filter((song) => song.album_id === this.id);
  }

  toJSONWithActors() {
    return {
      ...this.toJSON(),
      actors: this.getActors().map((actor) => actor.toJSON()),
    };
  }

  toJSONWithSongs() {
    return {
      ...this.toJSON(),
      songs: this.getSongs().map((song) => song.toJSONWithArtistsAndLanguages()),
    };
  }

  toJSONWithRelations() {
    return {
      id: this.id,
      code: this.code,
      title: this.title,
      year: this.year,
      thumbnail300x300: this.thumbnail300x300,
      thumbnail1200x1200: this.thumbnail1200x1200,
      actors: this.getActors().map((actor) => actor.toJSON()),
    };
  }
}

export class AlbumRepository extends ModelRepository {
  constructor(db) {
    super(db, Album, "albums");
  }

  /** @param {number} id @returns {Promise<Album | null>} */
  get(id) {
    return super.get(id);
  }

  /** @returns {Promise<Album[]>} */
  all() {
    return super.all();
  }

  /** @param {number[]} ids @returns {Promise<Album[]>} */
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

  /** @param {string} code @returns {Promise<Album | null>} */
  findByCode(code) {
    return super.findBy("code", code);
  }

  /** @param {string} title @returns {Promise<Album | null>} */
  findByTitle(title) {
    return super.findBy("title", title);
  }

  /** @param {number} id */
  async getWithActors(id) {
    const album = await this.get(id);
    return album ? album.toJSONWithActors() : null;
  }

  /** @param {number} id */
  async getWithSongs(id) {
    const album = await this.get(id);
    return album ? album.toJSONWithSongs() : null;
  }

  /** @param {number} id */
  async getWithRelations(id) {
    const album = await this.get(id);
    return album ? album.toJSONWithRelations() : null;
  }

  /** @param {number} page @param {number} limit */
  async paginateWithRelations(page, limit) {
    const result = await this.paginate(page, limit);

    return {
      ...result,
      items: result.items.map((album) => album.toJSONWithRelations()),
    };
  }
}
