import type { Skill } from "@/types/content";
import { getSkillLevelLabel } from "@/lib/skillLevel";

export default function SkillBadge({ skill }: { skill: Skill }) {
  const label = getSkillLevelLabel(skill.level);

  return (
    <div className="rounded-lg border border-line bg-surface p-4 transition-colors hover:border-accent/40">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-medium">{skill.name}</span>
        <span className="shrink-0 text-xs text-accent">{label}</span>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-background"
        role="progressbar"
        aria-valuenow={skill.level}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${skill.name}: ${label}`}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent-2 to-accent transition-all duration-700"
          style={{ width: `${skill.level}%` }}
        />
      </div>
    </div>
  );
}
