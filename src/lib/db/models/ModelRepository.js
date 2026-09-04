import { BaseModel } from "./BaseModel.js";
import { PAGINATION_LIMIT } from "@config";

export class ModelRepository {
  /**
   * @param {import('../Db.js').Db} db
   * @param {typeof BaseModel} Model
   * @param {keyof import('../schema.js').DatabaseSchema} tableName
   */
  constructor(db, Model, tableName) {
    this.db = db;
    this.Model = Model;
    this.tableName = tableName;
  }

  /**
   * @param {number} id
   * @returns {BaseModel | null}
   */
  getSync(id) {
    const row = this.db.data[this.tableName].find((item) => item.id === id);
    return row ? this.Model.fromRow(row, this.db) : null;
  }

  /**
   * @param {number[]} ids
   * @returns {BaseModel[]}
   */
  manySync(ids) {
    const idSet = new Set(ids);
    return this.db.data[this.tableName]
      .filter((item) => idSet.has(item.id))
      .map((row) => this.Model.fromRow(row, this.db));
  }

  /** @returns {BaseModel[]} */
  allSync() {
    return this.db.data[this.tableName].map((row) =>
      this.Model.fromRow(row, this.db),
    );
  }

  /**
   * @param {number} id
   * @returns {Promise<BaseModel | null>}
   */
  async get(id) {
    await this.db.ensureReady();
    return this.getSync(id);
  }

  /**
   * @param {number[]} ids
   * @returns {Promise<BaseModel[]>}
   */
  async many(ids) {
    await this.db.ensureReady();
    return this.manySync(ids);
  }

  /** @returns {Promise<BaseModel[]>} */
  async all() {
    await this.db.ensureReady();
    return this.allSync();
  }

  /** @returns {Promise<number>} */
  async count() {
    await this.db.ensureReady();
    return this.db.data[this.tableName].length;
  }

  /** @returns {Promise<boolean>} */
  async exists(id) {
    await this.db.ensureReady();
    return this.db.data[this.tableName].some((item) => item.id === id);
  }

  /**
   * @param {string} field
   * @param {unknown} value
   * @returns {Promise<BaseModel | null>}
   */
  async findBy(field, value) {
    await this.db.ensureReady();
    const row = this.db.data[this.tableName].find((item) => item[field] === value);
    return row ? this.Model.fromRow(row, this.db) : null;
  }

  /**
   * @param {number} [page=1]
   * @param {number} [limit=PAGINATION_LIMIT]
   */
  async paginate(page = 1, limit = PAGINATION_LIMIT) {
    await this.db.ensureReady();

    const total = this.db.data[this.tableName].length;
    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, limit);
    const offset = (safePage - 1) * safeLimit;
    const rows = this.db.data[this.tableName].slice(offset, offset + safeLimit);

    return {
      items: rows.map((row) => this.Model.fromRow(row, this.db)),
      total,
      page: safePage,
      limit: safeLimit,
    };
  }
}
