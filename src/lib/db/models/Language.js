import { BaseModel } from "./BaseModel.js";
import { ModelRepository } from "./ModelRepository.js";

/** @typedef {{ id: number, name: string }} LanguageData */

export class Language extends BaseModel {
  /** @type {string} */
  static tableName = "languages";

  getSongs() {
    return this.db.song.allSync().filter((song) => song.languages.includes(this.id));
  }

  toJSONWithSongs() {
    return {
      ...this.toJSON(),
      songs: this.getSongs().map((song) => song.toJSON()),
    };
  }
}

export class LanguageRepository extends ModelRepository {
  constructor(db) {
    super(db, Language, "languages");
  }

  /** @param {number} id @returns {Promise<Language | null>} */
  get(id) {
    return super.get(id);
  }

  /** @returns {Promise<Language[]>} */
  all() {
    return super.all();
  }

  /** @param {number[]} ids @returns {Promise<Language[]>} */
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

  /** @param {string} name @returns {Promise<Language | null>} */
  findByName(name) {
    return super.findBy("name", name);
  }

  /** @param {number} id */
  async getWithSongs(id) {
    const language = await this.get(id);
    return language ? language.toJSONWithSongs() : null;
  }
}
