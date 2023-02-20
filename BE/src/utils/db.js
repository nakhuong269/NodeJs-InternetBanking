import { config } from "dotenv";
import knex from "knex";

config();

export default knex({
  client: "mysql2",
  connection: {
    host: process.env.DATABASE_HOST || "localhost",
    port: process.env.DATABASE_PORT || 3306,
    user: process.env.DATABASE_USER || "root",
    password: process.env.DATABASE_PASSWORD || "root",
    database: process.env.DATABASE_NAME || "internet_banking",
  },
  pool: { min: 0, max: 10 },
});
