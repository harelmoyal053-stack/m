"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Check, Lock, Minus, Plus, Sparkles, Users } from "lucide-react";
import { savePrediction } from "@/app/actions";
import { Crest } from "./Crest";
import { ScorePair } from "./ScorePair";

export interface MatchView {
  id: number;
  kickoff: string; // שעה מפורמטת
  stageLabel: string;
  state: "open" | "live" | "finished" | "locked";
  home: { name: string; crest: string | null };
  away: { name: string; crest: string | null };
  score: { home: number; away: number } | null; // 90 דק׳ / חי
  fullScore: { home: number; away: number } | null; // אחרי הארכה (אם שונה)
  advanced: "HOME" | "AWAY" | null; // מי זכתה (בגמר)
  underdog: "HOME" | "AWAY" | null;
  underdogBonus: number;
  prediction: { home: number; away: number } | null;
  points: { total: number; kind: "exact" | "direction" | "miss"; underdogBonus: number } | null;
  teamsKnown: boolean;
}

function Stepper({
  value,
  onChange,
  disabled,
  label,
}: {
  value: number | null;
  onChange: (v: number) => void;
  disabled: boolean;
  label: string;
}) {
  const v = value ?? 0;
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        aria-label={`הוסף שער ל${label}`}
        disabled={disabled || v >= 20}
        onClick={() => onChange(value === null ? 0 : v + 1)}
        className="grid h-8 w-12 place-items-center rounded-lg bg-deep text-cyan active:scale-95 disabled:opacity-30"
      >
        <Plus size={18} />
      </button>
      <div
        className={`grid h-12 w-12 place-items-center rounded-xl text-2xl font-black tabular-nums ${
          value === null ? "bg-deep text-muted" : "bg-ink text-night"
        }`}
      >
        {value === null ? "–" : value}
      </div>
      <button
        type="button"
        aria-label={`הורד שער ל${label}`}
        disabled={disabled || v <= 0}
        onClick={() => onChange(Math.max(0, v - 1))}
        className="grid h-8 w-12 place-items-center rounded-lg bg-deep text-cyan active:scale-95 disabled:opacity-30"
      >
        <Minus size={18} />
      </button>
    </div>
  );
}

function TeamSide({
  team,
  isUnderdog,
  bonus,
  advanced,
}: {
  team: MatchView["home"];
  isUnderdog: boolean;
  bonus: number;
  advanced: boolean;
}) {
  return (
    <div className="flex w-24 flex-col items-center gap-1.5 text-center">
      <Crest src={team.crest} name={team.name} size={44} />
      <div className="text-sm font-bold leading-tight">{team.name}</div>
      {isUnderdog && (
        <span className="inline-flex items-center gap-0.5 rounded-full bg-gold/15 px-2 py-0.5 text-[11px] font-bold text-gold">
          <Sparkles size={11} /> אנדרדוג <bdi dir="ltr">+{bonus}</bdi>
        </span>
      )}
      {advanced && <span className="text-[11px] font-bold text-gold">🏆 אלופה</span>}
    </div>
  );
}

function PointsChip({ points }: { points: NonNullable<MatchView["points"]> }) {
  const style =
    points.kind === "exact"
      ? "bg-win text-night"
      : points.kind === "direction"
        ? "bg-cyan/20 text-cyan"
        : "bg-lose/15 text-lose";
  const label =
    points.kind === "exact" ? "בול!" : points.kind === "direction" ? "כיוון נכון" : "פספוס";
  return (
    <span className={`rounded-full px-3 py-1 text-sm font-black ${style}`}>
      {label} · {points.total} נק׳
      {points.underdogBonus > 0 && " ✨"}
    </span>
  );
}

export function MatchCard({ match }: { match: MatchView }) {
  const [home, setHome] = useState<number | null>(match.prediction?.home ?? null);
  const [away, setAway] = useState<number | null>(match.prediction?.away ?? null);
  const [saved, setSaved] = useState(match.prediction);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const open = match.state === "open" && match.teamsKnown;
  const dirty = home !== null && away !== null && (home !== saved?.home || away !== saved?.away);

  const save = () => {
    if (home === null || away === null) return;
    setError(null);
    start(async () => {
      const res = await savePrediction(match.id, home, away);
      if (res.error) setError(res.error);
      else setSaved({ home, away });
    });
  };

  const setSide = (side: "home" | "away", v: number) => {
    // לחיצה ראשונה על צד אחד ממלאת 0 בצד השני
    if (side === "home") {
      setHome(v);
      if (away === null) setAway(0);
    } else {
      setAway(v);
      if (home === null) setHome(0);
    }
  };

  return (
    <article className="card p-4">
      <header className="mb-3 flex items-center justify-between text-xs text-muted">
        <span>{match.stageLabel}</span>
        <span className="flex items-center gap-1">
          {match.state === "live" && (
            <span className="flex items-center gap-1 font-bold text-lose">
              <span className="h-2 w-2 animate-pulse rounded-full bg-lose" /> חי
            </span>
          )}
          {match.state === "locked" && <Lock size={12} />}
          {match.kickoff}
        </span>
      </header>

      <div className="flex items-start justify-between gap-2">
        <TeamSide
          team={match.home}
          isUnderdog={match.underdog === "HOME"}
          bonus={match.underdogBonus}
          advanced={match.advanced === "HOME"}
        />

        <div className="flex flex-1 items-center justify-center gap-2 pt-1">
          {open ? (
            <>
              <Stepper value={home} onChange={(v) => setSide("home", v)} disabled={pending} label={match.home.name} />
              <span className="text-xl font-black text-muted">:</span>
              <Stepper value={away} onChange={(v) => setSide("away", v)} disabled={pending} label={match.away.name} />
            </>
          ) : match.score ? (
            <div className="text-center">
              <ScorePair home={match.score.home} away={match.score.away} className="text-4xl font-black" />
              {match.fullScore && (
                <div className="mt-1 text-xs text-muted">
                  אחרי הארכה <ScorePair home={match.fullScore.home} away={match.fullScore.away} />
                </div>
              )}
            </div>
          ) : (
            <div className="pt-3 text-center text-sm text-muted">
              {match.teamsKnown ? "ממתין לתוצאה" : "הקבוצות טרם נקבעו"}
            </div>
          )}
        </div>

        <TeamSide
          team={match.away}
          isUnderdog={match.underdog === "AWAY"}
          bonus={match.underdogBonus}
          advanced={match.advanced === "AWAY"}
        />
      </div>

      <footer className="mt-3 flex min-h-9 flex-wrap items-center justify-between gap-2 border-t border-line pt-3 text-sm">
        {open ? (
          <>
            <span className="text-muted">
              {saved ? (
                <span className="inline-flex items-center gap-1 text-win">
                  <Check size={16} /> הניחוש שלך: <ScorePair home={saved.home} away={saved.away} className="font-bold" />
                </span>
              ) : (
                "עוד לא ניחשת"
              )}
            </span>
            {dirty && (
              <button onClick={save} disabled={pending} className="btn px-4 py-1.5 text-sm">
                {pending ? "שומר…" : "שמור ניחוש"}
              </button>
            )}
          </>
        ) : (
          <>
            <span className="text-muted">
              {match.prediction ? (
                <>
                  ניחשת <ScorePair home={match.prediction.home} away={match.prediction.away} className="font-bold text-ink" />
                </>
              ) : (
                "לא ניחשת"
              )}
            </span>
            <span className="flex items-center gap-2">
              {match.points && <PointsChip points={match.points} />}
              <Link
                href={`/match/${match.id}`}
                className="inline-flex items-center gap-1 rounded-full bg-deep px-3 py-1 text-xs text-cyan"
              >
                <Users size={13} /> כולם
              </Link>
            </span>
          </>
        )}
        {error && <p className="w-full text-xs text-lose">{error}</p>}
      </footer>
    </article>
  );
}
