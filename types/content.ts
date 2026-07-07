export type SkillCategory = "Frontend" | "Backend" | "Design" | "Tools" | "Soft Skills";

export interface Skill {
  id: string;
  category: SkillCategory;
  name: string;
  level: number;
  sort_order: number;
  created_at: string;
}

export type SkillInput = Omit<Skill, "id" | "created_at">;

export interface Contact {
  id: string;
  label: string;
  value: string;
  href: string;
  sort_order: number;
  created_at: string;
}

export type ContactInput = Omit<Contact, "id" | "created_at">;

export interface AboutFact {
  title: string;
  text: string;
}

export interface SiteContent {
  id: number;
  hero_eyebrow: string;
  hero_title: string;
  hero_highlight: string;
  hero_subtitle: string;
  about_intro: string;
  about_facts: AboutFact[];
  about_strengths: string[];
  contacts_intro: string;
  dev_wing_title: string;
  dev_wing_text: string;
  marketing_wing_title: string;
  marketing_wing_text: string;
}

export type SiteContentInput = Omit<SiteContent, "id">;
