import type { Metadata } from "next";
import ProjectsClient from "./ProjectsClient";

export const metadata: Metadata = {
  title: "Проекты",
  description:
    "Мои проекты: кейсы с описанием задачи, роли, стека и результата. Поиск и фильтрация по категориям.",
};

export default function ProjectsPage() {
  return <ProjectsClient />;
}
