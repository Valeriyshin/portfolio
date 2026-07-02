import Button from "@/components/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="bg-gradient-to-r from-accent-2 to-accent bg-clip-text text-8xl font-bold text-transparent">
        404
      </p>
      <div>
        <h1 className="text-2xl font-bold">Страница не найдена</h1>
        <p className="mt-2 text-muted">
          Такого маршрута нет — возможно, ссылка устарела или в адресе опечатка.
        </p>
      </div>
      <Button href="/">На главную</Button>
    </div>
  );
}
