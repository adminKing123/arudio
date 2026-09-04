import { BaseModel } from "./BaseModel.js";
import { ModelRepository } from "./ModelRepository.js";

export class User extends BaseModel {
  /** @type {string} */
  static tableName = "users";

  toPublicJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      username: this.username,
      phone: this.phone,
      verified: this.verified,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export class UserRepository extends ModelRepository {
  constructor(db) {
    super(db, User, "users");
  }

  /** @param {number} id @returns {Promise<User | null>} */
  get(id) {
    return super.get(id);
  }

  /** @returns {Promise<User[]>} */
  all() {
    return super.all();
  }

  /** @param {string} email @returns {Promise<User | null>} */
  findByEmail(email) {
    return super.findBy("email", email.toLowerCase());
  }

  /** @param {string} username @returns {Promise<User | null>} */
  findByUsername(username) {
    return super.findBy("username", username.toLowerCase());
  }

  /** @returns {Promise<number>} */
  async nextId() {
    await this.db.ensureReady();
    const ids = this.db.data.users.map((user) => user.id);
    return ids.length ? Math.max(...ids) + 1 : 1;
  }

  /**
   * @param {Omit<import("../schema.js").User, "id">} data
   */
  async create(data) {
    await this.db.ensureReady();

    const user = {
      id: await this.nextId(),
      ...data,
    };

    this.db.data.users.push(user);
    await this.db.write();
    return User.fromRow(user, this.db);
  }

  /**
   * @param {number} id
   * @param {Partial<import("../schema.js").User>} updates
   */
  async update(id, updates) {
    await this.db.ensureReady();

    const index = this.db.data.users.findIndex((user) => user.id === id);

    if (index === -1) {
      return null;
    }

    this.db.data.users[index] = {
      ...this.db.data.users[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await this.db.write();
    return User.fromRow(this.db.data.users[index], this.db);
  }
}
