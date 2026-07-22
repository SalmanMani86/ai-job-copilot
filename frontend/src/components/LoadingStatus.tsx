interface LoadingStatusProps {
  elapsedSeconds: number;
  baseLabel: string;
}

export function LoadingStatus({ elapsedSeconds, baseLabel }: LoadingStatusProps) {
  let message = baseLabel;

  if (elapsedSeconds >= 15) {
    message = "Still working — this can take up to a minute while everything processes.";
  } else if (elapsedSeconds >= 5) {
    message = "Waking up the backend — free hosting sleeps after inactivity, first request can take ~50s.";
  }

  return (
    <p className="mt-3 text-sm text-zinc-500" aria-live="polite">
      {message}
      {elapsedSeconds > 0 && <span className="text-zinc-600"> ({elapsedSeconds}s)</span>}
    </p>
  );
}
