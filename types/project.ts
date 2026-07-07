export type ProjectCategory = "frontend" | "fullstack" | "backend" | "design";

export interface Project {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  description: string;
  problem: string;
  role: string;
  stack: string[];
  features: string[];
  result: string;
  improvements: string;
  github_url: string | null;
  demo_url: string | null;
  image_url: string | null;
  category: ProjectCategory;
  published: boolean;
  sort_order: number;
  created_at: string;
}

/** Данные формы админки — всё, что редактируется вручную */
export type ProjectInput = Omit<Project, "id" | "created_at">;

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/** Сохранённая заявка из формы обратной связи (для просмотра в админке) */
export interface StoredMessage extends ContactMessage {
  id: string;
  created_at: string;
}
