import { count } from "drizzle-orm";
import { AuthForm } from "@/components/AuthForm";
import { getDb, schema } from "@/lib/db";
import { getGroupCode } from "@/lib/settings";

export default async function RegisterPage() {
  const db = await getDb();
  const [{ n }] = await db.select({ n: count() }).from(schema.users);
  const hasCode = Boolean(await getGroupCode());
  const isFirst = n === 0;

  return (
    <>
      {isFirst && (
        <p className="card border-gold/50 p-3 text-sm text-gold">
          המשתמש הראשון שנרשם הופך למנהל הקבוצה. אחרי ההרשמה מגדירים קוד הצטרפות ושולחים אותו לחברים.
        </p>
      )}
      <AuthForm mode="register" needsCode={!isFirst || hasCode} />
    </>
  );
}
