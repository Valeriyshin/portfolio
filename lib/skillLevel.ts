export interface SkillLevelBand {
  min: number;
  label: string;
}

/** Границы подобраны под шаг слайдера в 5%, от новичка до эксперта */
const BANDS: SkillLevelBand[] = [
  { min: 0, label: "Изучаю" },
  { min: 26, label: "Базовый уровень" },
  { min: 51, label: "Уверенно" },
  { min: 76, label: "Профессионально" },
];

export function getSkillLevelLabel(level: number): string {
  let label = BANDS[0].label;
  for (const band of BANDS) {
    if (level >= band.min) label = band.label;
  }
  return label;
}
