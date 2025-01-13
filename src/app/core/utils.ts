import { firstRiddleDateISO } from "./constants";

export const getRiddleIndex = (dateISO: string): number => {
  const date = new Date(dateISO);
  const firstRiddleDate = new Date(firstRiddleDateISO);
  const diffTime = Math.abs(date.getTime() - firstRiddleDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1;
}
