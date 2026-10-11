import { requireAdmin } from "@/lib/auth";
import { getAllMatches, getBonusAnswers, getTeamsMap, getUsers } from "@/lib/queries";
import { getBonusDeadline, getGroupCode, getSettings } from "@/lib/settings";
import { formatDateTime, requestTime, timeAgo } from "@/lib/format";
import { ruleFor } from "@/lib/scoring";
import { teamName } from "@/lib/team-names";
import {
  BonusAnswersForm,
  DeadlineForm,
  GroupCodeForm,
  MatchAdminRow,
  SyncButton,
  UserRow,
} from "@/components/admin/AdminControls";

const DAY = 24 * 3600_000;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card flex flex-col gap-3 p-4">
      <h2 className="font-bold">{title}</h2>
      {children}
    </section>
  );
}

export default async function AdminPage() {
  const me = await requireAdmin();
  const [settings, groupCode, deadline, users, teams, matches, answers] = await Promise.all([
    getSettings(),
    getGroupCode(),
    getBonusDeadline(),
    getUsers(),
    getTeamsMap(),
    getAllMatches(),
    getBonusAnswers(),
  ]);
  const now = requestTime();
  const hasFd = Boolean(process.env.FOOTBALL_DATA_API_KEY);
  const hasOdds = Boolean(process.env.ODDS_API_KEY);
  const teamList = [...teams.values()]
    .map((t) => ({ id: t.id, name: teamName(t) }))
    .sort((a, b) => a.name.localeCompare(b.name, "he"));
  const windowMatches = matches.filter((m) => m.utcDate > now - 7 * DAY && m.utcDate < now + 14 * DAY);

  return (
    <div className="flex flex-col gap-4 pt-2">
      <h1 className="text-2xl font-black">ניהול</h1>

      <Section title="סנכרון נתונים">
        <ul className="text-sm">
          <li>תוצאות (football-data.org): {hasFd ? <span className="text-win">מחובר</span> : <span className="text-lose">חסר FOOTBALL_DATA_API_KEY</span>}</li>
          <li>יחסים לאנדרדוג (the-odds-api.com): {hasOdds ? <span className="text-win">מחובר</span> : <span className="text-gold">לא הוגדר — אפשר לקבוע ידנית</span>}</li>
          <li className="text-muted">
            סנכרון אחרון: {settings.last_sync ? timeAgo(Number(settings.last_sync)) : "עוד לא היה"}
          </li>
          {settings.last_sync_error && <li className="text-lose" dir="auto">שגיאה: {settings.last_sync_error}</li>}
        </ul>
        <p className="text-xs text-muted">
          הסנכרון רץ אוטומטית ברקע כשמישהו נכנס לאפליקציה (כל דקה בזמן משחקים, כל 20 דקות בשאר הזמן).
        </p>
        <SyncButton />
      </Section>

      <Section title="קוד הצטרפות לקבוצה">
        <p className="text-xs text-muted">
          רק מי שיודע את הקוד יכול להירשם. שלחו לחברים את הקישור לאפליקציה ואת הקוד.
        </p>
        <GroupCodeForm current={groupCode} />
      </Section>

      <Section title="דדליין לניחושי בונוס">
        <p className="text-xs text-muted">
          {deadline ? `כרגע: ${formatDateTime(deadline)}` : "כרגע: המשחק הראשון בשלב הנוקאאוט (עוד לא נקבע)"}
        </p>
        <DeadlineForm current={deadline} isCustom={Boolean(settings.bonus_deadline)} />
      </Section>

      <Section title="תשובות הבונוס">
        <p className="text-xs text-muted">נקבעות אוטומטית אחרי הגמר. אפשר לתקן ידנית.</p>
        <BonusAnswersForm teams={teamList} championTeamId={answers.championTeamId} topScorers={answers.topScorers} />
      </Section>

      <Section title={`משתתפים (${users.length})`}>
        <ul className="divide-y divide-line">
          {users.map((u) => (
            <UserRow key={u.id} user={u} isMe={u.id === me.id} />
          ))}
        </ul>
      </Section>

      <Section title="משחקים (שבוע אחורה, שבועיים קדימה)">
        <p className="text-xs text-muted">
          עקיפה ידנית של האנדרדוג, או הזנת תוצאת 90 דקות אם ה-API לא מעדכן.
        </p>
        {windowMatches.length === 0 ? (
          <p className="text-sm text-muted">אין משחקים בטווח.</p>
        ) : (
          <ul className="divide-y divide-line">
            {windowMatches.map((m) => (
              <MatchAdminRow
                key={m.id}
                match={{
                  id: m.id,
                  label: ruleFor(m.stage).label,
                  when: formatDateTime(m.utcDate),
                  homeName: teamName(m.homeTeamId ? teams.get(m.homeTeamId) : undefined),
                  awayName: teamName(m.awayTeamId ? teams.get(m.awayTeamId) : undefined),
                  odds:
                    m.homeOdds && m.awayOdds
                      ? `${m.homeOdds.toFixed(2)} / ${m.drawOdds?.toFixed(2) ?? "-"} / ${m.awayOdds.toFixed(2)}`
                      : null,
                  underdogOverride: m.underdogOverride,
                  manualResult: m.manualResult,
                  score: m.homeScore !== null && m.awayScore !== null ? { home: m.homeScore, away: m.awayScore } : null,
                }}
              />
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
