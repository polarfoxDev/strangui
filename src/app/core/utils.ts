import { RiddleConfig, RiddleConfigUnknownVersion } from "../strands/models";
import { firstRiddleDateISO } from "./constants";

export const getRiddleIndex = (dateISO: string): number => {
  const date = new Date(dateISO);
  const firstRiddleDate = new Date(firstRiddleDateISO);
  const diffTime = Math.abs(date.getTime() - firstRiddleDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1;
}

export const upgradeConfigVersion = (config: RiddleConfigUnknownVersion): RiddleConfig => {
  switch (config.configVersion) {
    case 3:
      return config;
    case 2:
      return {
        configVersion: 3,
        theme: config.theme,
        letters: config.letters,
        solutions: config.solutions.map((solution) => ({
          locations: solution.locations.map((location) => ({
            row: location.x,
            col: location.y,
          })),
          isSuperSolution: solution.isSuperSolution,
        })),
      };
    default:
      throw new Error(`Unsupported config version: ${(config as any).configVersion}`);
  }
}

export const compareVersions = (v1: string, v2: string): number => {
  const v1Parts = v1.split('.').map(Number);
  const v2Parts = v2.split('.').map(Number);

  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const part1 = v1Parts[i] || 0;
    const part2 = v2Parts[i] || 0;

    if (part1 !== part2) {
      return part1 - part2;
    }
  }

  return 0;
}
export const isVersionNewer = (v1: string, v2: string): boolean => {
  return compareVersions(v1, v2) > 0;
}
