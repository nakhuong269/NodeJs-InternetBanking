import db from "../utils/db.js";

export function findAllRecipientByAccountId(accountId) {
  return db("recipient").where("AccountID", accountId);
}

export function addRecipient(recipient) {
  return db("recipient").insert(recipient);
}

export function updateRecipient(id, recipient) {
  return db("recipient").where("ID", id).update(recipient);
}

export function deleteRecpient(id) {
  return db("recipient").where("ID", id).update("IsDeleted", true);
}
