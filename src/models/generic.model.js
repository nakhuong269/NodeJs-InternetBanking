import db from "../utils/db.js";

export default function (TABLE_NAME, TABLE_ID) {
  return {
    findAll() {
      return db(TABLE_NAME);
    },

    async findById(id) {
      const list = await db(TABLE_NAME).where(TABLE_ID, id);
      if (list.length === 0) {
        return null;
      }

      return list[0];
    },

    add(entity) {
      return db(TABLE_NAME).insert(entity);
    },

    del(id) {
      return db(TABLE_NAME).where(TABLE_ID, id).del();
    },

    patch(id, entity) {
      return db(TABLE_NAME).where(TABLE_ID, id).update(entity);
    },
  };
}
