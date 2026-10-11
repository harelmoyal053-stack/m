import { BONUS_POINTS, STAGE_ORDER, STAGE_RULES } from "@/lib/scoring";

export default function RulesPage() {
  return (
    <div className="flex flex-col gap-4 pt-2">
      <h1 className="text-2xl font-black">חוקי המשחק</h1>

      <section className="card flex flex-col gap-2 p-4 text-sm leading-relaxed">
        <h2 className="text-base font-bold">איך משחקים?</h2>
        <p>לפני כל משחק בליגת האלופות מנחשים את התוצאה המדויקת. אפשר לשנות את הניחוש עד שריקת הפתיחה, ואז הוא ננעל.</p>
        <p>הניקוד נקבע לפי <b>תוצאת 90 הדקות</b> (כולל תוספת זמן, בלי הארכה ופנדלים).</p>
        <p>הניחושים של כולם נחשפים בשריקת הפתיחה.</p>
      </section>

      <section className="card p-4 text-sm">
        <h2 className="mb-3 text-base font-bold">טבלת ניקוד</h2>
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-3 gap-y-2 text-center">
          <span className="text-start text-xs text-muted">שלב</span>
          <span className="text-xs text-muted">בול</span>
          <span className="text-xs text-muted">כיוון</span>
          <span className="text-xs text-muted">✨ אנדרדוג</span>
          {STAGE_ORDER.map((s) => (
            <div key={s} className="contents">
              <span className="text-start font-bold">{STAGE_RULES[s].label}</span>
              <span className="font-black text-win">{STAGE_RULES[s].exact}</span>
              <span className="font-black text-cyan">{STAGE_RULES[s].direction}</span>
              <span className="font-black text-gold"><bdi dir="ltr">+{STAGE_RULES[s].underdog}</bdi></span>
            </div>
          ))}
        </div>
        <ul className="mt-4 flex flex-col gap-1.5 text-muted">
          <li><b className="text-win">בול</b> — ניחשת בדיוק את התוצאה.</li>
          <li><b className="text-cyan">כיוון</b> — ניחשת נכון מי מנצחת או שיהיה תיקו, אבל לא את התוצאה המדויקת.</li>
          <li>
            <b className="text-gold">✨ אנדרדוג</b> — הקבוצה עם הסיכוי הנמוך יותר (לפי יחסי ההימורים) מסומנת בכרטיס
            המשחק. מי שניחש שהיא תנצח, והיא באמת ניצחה, מקבל בונוס על הניקוד הרגיל.
          </li>
        </ul>
      </section>

      <section className="card p-4 text-sm">
        <h2 className="mb-2 text-base font-bold">ניחושי בונוס</h2>
        <ul className="flex flex-col gap-1.5">
          <li>🏆 מי תזכה בגביע — <b className="text-gold">{BONUS_POINTS.champion} נק׳</b></li>
          <li>⚽ מלך השערים של הטורניר — <b className="text-gold">{BONUS_POINTS.topScorer} נק׳</b> (בשוויון — כל מי שבראש נחשב)</li>
        </ul>
        <p className="mt-2 text-muted">אפשר לשנות עד הדדליין, בדרך כלל תחילת שלב הנוקאאוט.</p>
      </section>

      <section className="card p-4 text-sm">
        <h2 className="mb-2 text-base font-bold">דוגמה</h2>
        <p className="text-muted">
          שמינית גמר, ליברפול (פייבוריטית) נגד בנפיקה (אנדרדוג). בנפיקה ניצחה 2–1.
        </p>
        <ul className="mt-2 flex flex-col gap-1">
          <li>ניחשת 2–1 לבנפיקה → 4 (בול) + 2 (אנדרדוג) = <b className="text-win">6 נק׳</b></li>
          <li>ניחשת 1–0 לבנפיקה → 2 (כיוון) + 2 (אנדרדוג) = <b className="text-cyan">4 נק׳</b></li>
          <li>ניחשת תיקו 1–1 → <b className="text-lose">0 נק׳</b></li>
        </ul>
      </section>
    </div>
  );
}
