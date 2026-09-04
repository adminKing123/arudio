import { BaseModel } from "./BaseModel.js";
import { ModelRepository } from "./ModelRepository.js";

export class Otp extends BaseModel {
  /** @type {string} */
  static tableName = "otps";

  isExpired() {
    return new Date(this.expiresAt).getTime() <= Date.now();
  }
}

export class OtpRepository extends ModelRepository {
  constructor(db) {
    super(db, Otp, "otps");
  }

  /** @returns {Promise<number>} */
  async nextId() {
    await this.db.ensureReady();
    const ids = this.db.data.otps.map((otp) => otp.id);
    return ids.length ? Math.max(...ids) + 1 : 1;
  }

  /**
   * @param {string} email
   * @param {import("../schema.js").Otp["type"]} type
   */
  async findActive(email, type) {
    await this.db.ensureReady();

    const row = this.db.data.otps.find(
      (otp) =>
        otp.email === email.toLowerCase() &&
        otp.type === type &&
        !otp.used &&
        new Date(otp.expiresAt).getTime() > Date.now(),
    );

    return row ? Otp.fromRow(row, this.db) : null;
  }

  /**
   * @param {{
   *   email: string,
   *   code: string,
   *   type: import("../schema.js").Otp["type"],
   *   expiresAt: string
   * }} data
   */
  async create(data) {
    await this.db.ensureReady();

    const otp = {
      id: await this.nextId(),
      email: data.email.toLowerCase(),
      code: data.code,
      type: data.type,
      expiresAt: data.expiresAt,
      used: false,
      createdAt: new Date().toISOString(),
    };

    this.db.data.otps.push(otp);
    await this.db.write();
    return Otp.fromRow(otp, this.db);
  }

  /** @param {number} id */
  async markUsed(id) {
    await this.db.ensureReady();

    const index = this.db.data.otps.findIndex((otp) => otp.id === id);

    if (index === -1) {
      return null;
    }

    this.db.data.otps[index].used = true;
    await this.db.write();
    return Otp.fromRow(this.db.data.otps[index], this.db);
  }

  /**
   * @param {string} email
   * @param {import("../schema.js").Otp["type"]} type
   */
  async invalidateActive(email, type) {
    await this.db.ensureReady();

    let changed = false;

    for (const otp of this.db.data.otps) {
      if (
        otp.email === email.toLowerCase() &&
        otp.type === type &&
        !otp.used
      ) {
        otp.used = true;
        changed = true;
      }
    }

    if (changed) {
      await this.db.write();
    }
  }
}
