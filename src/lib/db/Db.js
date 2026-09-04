import { JSONFilePreset } from "lowdb/node";
import {
  emptyDatabase,
  SYNC_TABLE_NAMES,
  TABLE_NAMES,
} from "./schema.js";
import { ensureDbDirectory, getDbFilePath } from "./paths.js";
import { SongRepository } from "./models/Song.js";
import { ArtistRepository } from "./models/Artist.js";
import { AlbumRepository } from "./models/Album.js";
import { ActorRepository } from "./models/Actor.js";
import { LanguageRepository } from "./models/Language.js";
import { UserRepository } from "./models/User.js";
import { OtpRepository } from "./models/Otp.js";

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

  /** @type {UserRepository} */
  user;

  /** @type {OtpRepository} */
  otp;

  constructor() {
    this.song = new SongRepository(this);
    this.artist = new ArtistRepository(this);
    this.album = new AlbumRepository(this);
    this.actor = new ActorRepository(this);
    this.language = new LanguageRepository(this);
    this.user = new UserRepository(this);
    this.otp = new OtpRepository(this);
  }

  static getFilePath() {
    return getDbFilePath();
  }

  static ensureDataDirectory() {
    ensureDbDirectory();
  }

  ensureLocalTables() {
    this.data.users = Array.isArray(this.data.users) ? this.data.users : [];
    this.data.otps = Array.isArray(this.data.otps) ? this.data.otps : [];
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
    this.ensureLocalTables();
  }

  async write() {
    const lowdb = await this.connect();
    this.ensureLocalTables();
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
   * Replace only synced music tables. Users and OTPs are preserved.
   * @param {Record<string, unknown[]>} syncData
   */
  async replaceSyncData(syncData) {
    await this.ensureReady();

    for (const table of SYNC_TABLE_NAMES) {
      if (!Array.isArray(syncData[table])) {
        throw new Error(`Invalid database payload: missing table "${table}".`);
      }

      this.data[table] = structuredClone(syncData[table]);
    }

    this.ensureLocalTables();
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
      users: this.data.users.length,
    };
  }
}

export { TABLE_NAMES, SYNC_TABLE_NAMES };
