import "server-only";
import { createClient, type Client } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "./schema";

type DB = LibSQLDatabase<typeof schema>;

const globalForDb = globalThis as unknown as {
  __dbClient?: Client;
  __dbReady?: Promise<void>;
};

function client(): Client {
  if (!globalForDb.__dbClient) {
    globalForDb.__dbClient = createClient({
      url: process.env.DATABASE_URL ?? "file:local.db",
      authToken: process.env.DATABASE_AUTH_TOKEN,
    });
  }
  return globalForDb.__dbClient;
}

const database: DB = drizzle(client(), { schema });

/** מחזיר את מסד הנתונים, ויוצר את הטבלאות בפעם הראשונה. */
export async function getDb(): Promise<DB> {
  if (!globalForDb.__dbReady) {
    globalForDb.__dbReady = client()
      .executeMultiple(schema.SCHEMA_SQL)
      .catch((err) => {
        globalForDb.__dbReady = undefined;
        throw err;
      });
  }
  await globalForDb.__dbReady;
  return database;
}

export { schema };
