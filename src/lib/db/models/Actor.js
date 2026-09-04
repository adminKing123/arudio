import { BaseModel } from "./BaseModel.js";
import { ModelRepository } from "./ModelRepository.js";

/** @typedef {{ id: number, name: string, thumbnail300x300: string, thumbnail1200x1200: string }} ActorData */

export class Actor extends BaseModel {
  /** @type {string} */
  static tableName = "actors";

  getAlbums() {
    return this.db.album.allSync().filter((album) => album.actors.includes(this.id));
  }

  toJSONWithAlbums() {
    return {
      ...this.toJSON(),
      albums: this.getAlbums().map((album) => album.toJSON()),
    };
  }
}

export class ActorRepository extends ModelRepository {
  constructor(db) {
    super(db, Actor, "actors");
  }

  /** @param {number} id @returns {Promise<Actor | null>} */
  get(id) {
    return super.get(id);
  }

  /** @returns {Promise<Actor[]>} */
  all() {
    return super.all();
  }

  /** @param {number[]} ids @returns {Promise<Actor[]>} */
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

  /** @param {string} name @returns {Promise<Actor | null>} */
  findByName(name) {
    return super.findBy("name", name);
  }

  /** @param {number} id */
  async getWithAlbums(id) {
    const actor = await this.get(id);
    return actor ? actor.toJSONWithAlbums() : null;
  }
}
