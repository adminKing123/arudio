export class BaseModel {
  /** @type {import('../Db.js').Db | null} */
  #db = null;

  /**
   * @param {Record<string, unknown>} data
   * @param {import('../Db.js').Db} [db]
   */
  constructor(data, db = null) {
    Object.assign(this, data);
    this.#db = db;
  }

  /** @type {string} */
  static tableName = "";

  /**
   * @param {Record<string, unknown>} row
   * @param {import('../Db.js').Db} [db]
   */
  static fromRow(row, db = null) {
    return new this(row, db);
  }

  /** @protected */
  get db() {
    if (!this.#db) {
      throw new Error(`${this.constructor.name} is not attached to a Db instance.`);
    }

    return this.#db;
  }

  /** @param {import('../Db.js').Db} db */
  attach(db) {
    this.#db = db;
    return this;
  }

  toJSON() {
    const { id, ...rest } = this;
    return { id, ...rest };
  }
}
