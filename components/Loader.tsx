export default function Loader({ label = "Загрузка..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <span
        aria-hidden
        className="h-9 w-9 animate-spin rounded-full border-2 border-line border-t-accent"
      />
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}
