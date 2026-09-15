export const G = 9.81;
export const APPLE_KG = 0.18;
export const DURIAN_KG = 2.5;
export const DEFAULT_HEIGHT_M = 4;
export const MIN_HEIGHT_M = 1;
export const MAX_HEIGHT_M = 12;
export type RiskId = "shock" | "bruise" | "fracture" | "critical";
export type Locale = "th" | "en";
export function velocityMs(heightM: number) { return Math.sqrt(2 * G * heightM); }
export function kineticEnergyJ(massKg: number, heightM: number) { return massKg * G * heightM; }
export function fallTimeS(heightM: number) { return Math.sqrt((2 * heightM) / G); }
export function riskFromJoules(joules: number): { id: RiskId; rank: 1 | 2 | 3 | 4 } {
  if (joules < 15) return { id: "shock", rank: 1 };
  if (joules < 40) return { id: "bruise", rank: 2 };
  if (joules < 80) return { id: "fracture", rank: 3 };
  return { id: "critical", rank: 4 };
}
export function formatNumber(value: number, digits = 1, locale: Locale = "th") {
  return value.toLocaleString(locale === "th" ? "th-TH" : "en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}
export function prefersReducedMotion() { if (typeof window === "undefined") return false; return window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
