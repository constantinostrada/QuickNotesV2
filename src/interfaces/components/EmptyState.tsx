/**
 * EmptyState — displayed when the notes list is empty.
 *
 * Pure presentational component — no logic.
 * Layer: interfaces
 */

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-stone-300 py-16 text-center"
      role="status"
    >
      <span className="text-4xl" aria-hidden="true">
        🗒️
      </span>
      <h3 className="text-base font-semibold text-stone-700">{title}</h3>
      <p className="max-w-xs text-sm text-stone-400">{description}</p>
    </div>
  );
}
