import { JSONFilePreset } from "lowdb/node";
import { emptyDatabase, TABLE_NAMES } from "./schema.js";
import { ensureDbDirectory, getDbFilePath } from "./paths.js";
import { SongRepository } from "./models/Song.js";
import { ArtistRepository } from "./models/Artist.js";
import { AlbumRepository } from "./models/Album.js";
import { ActorRepository } from "./models/Actor.js";
import { LanguageRepository } from "./models/Language.js";

export class Db {
  /** @type {import('lowdb').Low<import('./schema.js').DatabaseSchema> | null} */
  #lowdb = null;

  /** @type {Promise<void> | null} */
  #ready = null;

  /** @type {import('./schema.js').DatabaseSchema} */
  data = structuredClone(emptyDatabase);

  /** @type {SongRepository} */
  song;

  /** @type {ArtistRepository} */
  artist;

  /** @type {AlbumRepository} */
  album;

  /** @type {ActorRepository} */
  actor;

  /** @type {LanguageRepository} */
  language;

  constructor() {
    this.song = new SongRepository(this);
    this.artist = new ArtistRepository(this);
    this.album = new AlbumRepository(this);
    this.actor = new ActorRepository(this);
    this.language = new LanguageRepository(this);
  }

  static getFilePath() {
    return getDbFilePath();
  }

  static ensureDataDirectory() {
    ensureDbDirectory();
  }

  async connect() {
    if (!this.#lowdb) {
      Db.ensureDataDirectory();
      this.#lowdb = await JSONFilePreset(
        Db.getFilePath(),
        structuredClone(emptyDatabase),
      );
    }

    return this.#lowdb;
  }

  async read() {
    const lowdb = await this.connect();
    await lowdb.read();
    this.data = lowdb.data;
  }

  async write() {
    const lowdb = await this.connect();
    lowdb.data = structuredClone(this.data);
    await lowdb.write();
  }

  async ensureReady() {
    if (!this.#ready) {
      this.#ready = this.read();
    }

    await this.#ready;
    return this;
  }

  /**
   * @param {import('./schema.js').DatabaseSchema} nextData
   */
  async replace(nextData) {
    for (const table of TABLE_NAMES) {
      if (!Array.isArray(nextData[table])) {
        throw new Error(`Invalid database payload: missing table "${table}".`);
      }
    }

    this.data = structuredClone(nextData);
    await this.connect();
    await this.write();
    this.#ready = Promise.resolve();
    return this;
  }

  async getCounts() {
    await this.ensureReady();

    return {
      actors: await this.actor.count(),
      artists: await this.artist.count(),
      languages: await this.language.count(),
      albums: await this.album.count(),
      songs: await this.song.count(),
    };
  }
}
