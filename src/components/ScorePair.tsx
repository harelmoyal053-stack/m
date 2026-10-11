/** תוצאה מימין לשמאל: בית מימין, חוץ משמאל (כמו מיקום הקבוצות בכרטיס). */
export function ScorePair({ home, away, className = "" }: { home: number; away: number; className?: string }) {
  return (
    <span dir="rtl" className={`inline-flex items-baseline gap-[0.25em] tabular-nums ${className}`}>
      <span>{home}</span>
      <span className="opacity-60">:</span>
      <span>{away}</span>
    </span>
  );
}
