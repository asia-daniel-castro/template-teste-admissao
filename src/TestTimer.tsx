import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

// Mantenha sincronizado com o tempo citado no README.
const TEST_DURATION_MINUTES = 45;
const WARNING_THRESHOLD_SECONDS = 10 * 60;
const CRITICAL_THRESHOLD_SECONDS = 5 * 60;

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function TestTimer() {
  const [secondsLeft, setSecondsLeft] = useState(TEST_DURATION_MINUTES * 60);

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((current) => (current > 0 ? current - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const expired = secondsLeft === 0;
  const critical = secondsLeft > 0 && secondsLeft <= CRITICAL_THRESHOLD_SECONDS;
  const warning =
    secondsLeft > CRITICAL_THRESHOLD_SECONDS &&
    secondsLeft <= WARNING_THRESHOLD_SECONDS;

  const colorClasses =
    expired || critical
      ? 'bg-red-500/10 text-red-400 border-red-500/20'
      : warning
        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
        : 'bg-slate-800/60 text-slate-300 border-slate-700';

  return (
    <div
      title="Tempo restante do teste"
      className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${colorClasses} ${
        critical || expired ? 'animate-pulse' : ''
      }`}
    >
      <Clock className="h-3.5 w-3.5" />
      {expired ? 'Tempo esgotado' : formatTime(secondsLeft)}
    </div>
  );
}
