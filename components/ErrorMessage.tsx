import Button from "@/components/Button";

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorMessage({
  message = "Что-то пошло не так",
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-red-500/30 bg-red-500/5 px-6 py-12 text-center">
      <span className="text-3xl" aria-hidden>
        ⚠️
      </span>
      <div>
        <p className="font-medium">Ошибка загрузки</p>
        <p className="mt-1 text-sm text-muted">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Попробовать снова
        </Button>
      )}
    </div>
  );
}
