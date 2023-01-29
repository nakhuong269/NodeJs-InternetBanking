import db from "../utils/db.js";
import { register } from "./account.model.js";

export async function GetListEmployee() {
  const rows = await db("account")
    .join("role", "role.ID", "=", "account.role")
    .where("role.Name", "Employee")
    .join("user", "account.ID", "=", "user.ID")
    .select([
      "account.ID",
      "user.Name",
      "user.Email",
      "user.Phone",
      "user.IDCard",
      "user.CreatedDate",
    ]);

  if (rows.length === 0) {
    return null;
  }

  return rows;
}

export async function addEmployee(employee) {
  return await register(employee);
}

export function updateEmployee(id, employee) {
  return db("user").where("ID", id).update(employee);
}

export async function deleteEmployee(id) {
  return (
    (await db("user").where("ID", id).update("IsDeleted", true)) &&
    (await db("account").where("ID", id).update("IsDeleted", true))
  );
}
