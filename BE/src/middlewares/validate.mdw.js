import Ajv from "ajv";
import db from "../utils/db.js";

export default function (schema) {
  return function validate(req, res, next) {
    const ajv = new Ajv();
    ajv.addKeyword({
      keyword: "idExists",
      async: true,
      type: "number",
      validate: checkIdExists,
    });

    ajv.addKeyword({
      keyword: "emailExists",
      async: true,
      type: "string",
      validate: checkEmailExists,
    });

    ajv.addKeyword({
      keyword: "phoneExists",
      async: true,
      type: "string",
      validate: checkPhoneExists,
    });

    ajv.addKeyword({
      keyword: "idnumberExists",
      async: true,
      type: "string",
      validate: checkIdnumberExists,
    });

    ajv.addKeyword({
      keyword: "checkBalanceTransaction",
      async: true,
      type: "object",
      validate: checkBalance,
    });

    async function checkIdExists(schema, data) {
      const rows = await db(schema.table).where("ID", data);

      return !rows.length; // true if record is found
    }

    async function checkEmailExists(schema, data) {
      const rows = await db(schema.table).where("Email", data);

      return !rows.length; // true if record is found
    }
    async function checkPhoneExists(schema, data) {
      const rows = await db(schema.table).where("Phone", data);

      return !rows.length; // true if record is found
    }
    async function checkIdnumberExists(schema, data) {
      const rows = await db(schema.table).where("IDCard", data);
      return !rows.length; // true if record is found
    }

    async function checkBalance(schema, data, parentSchema, dataPath) {
      const balance = (
        await db("account_payment")
          .where("AccountNumber", data.AccountPaymentSend)
          .select(["Balance"])
      )[0].Balance;

      if (Number(balance) < Number(data.Amount)) {
        return false;
      } else {
        return true;
      }
    }

    const validate = ajv.compile(schema);
    if (schema.$async) {
      validate(req.body)
        .then(function (data) {
          //data is valid
          next();
        })
        .catch(function (err) {
          if (!(err instanceof Ajv.ValidationError)) throw err;
          // data is invalid
          //console.log(err);
          res.status(400).json({
            error: err.errors,
          });
        });
    } else {
      const valid = validate(req.body);
      if (!valid) {
        res.status(400).json({
          error: validate.errors,
        });
      } else {
        next();
      }
    }
  };
}
