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
