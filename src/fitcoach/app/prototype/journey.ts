import type { Equipment, Intake } from './data';

export const metricDefinitions = [
  { key: 'weight', label: 'Weight', unit: 'kg', min: 20, max: 400, step: 0.1, days: 7 },
  { key: 'sleep', label: 'Sleep', unit: 'hrs', min: 0, max: 24, step: 0.1, days: 1 },
  { key: 'energy', label: 'Energy', unit: '/ 10', min: 1, max: 10, step: 1, days: 1 },
  { key: 'bodyFat', label: 'Body fat', unit: '%', min: 1, max: 75, step: 0.1, days: 30 },
  { key: 'soreness', label: 'Soreness', unit: '/ 10', min: 0, max: 10, step: 1, days: 1 },
  { key: 'sleepQuality', label: 'Sleep quality', unit: '/ 10', min: 1, max: 10, step: 1, days: 1 },
] as const;
export type MetricKey = typeof metricDefinitions[number]['key'];
export type Reading = { value: number; at: string };
export type JourneyProfile = Omit<Intake, 'minutes'> & { minutes: number | null };
export type Journey = {
  profile: JourneyProfile;
  metrics: Partial<Record<MetricKey, Reading>>;
  goals: { weight: number | null; sleep: number | null; energy?: number | null; bodyFat?: number | null; soreness?: number | null; sleepQuality?: number | null };
  weightHistory: Reading[];
  metricHistory?: Partial<Record<MetricKey, Reading[]>>;
  profileUpdatedAt?: string;
  updatedAt?: string;
};
export const goalOptions = ['Build strength', 'Build muscle', 'Improve fitness', 'Build consistency'];
export const experienceOptions = ['Getting started', 'Some experience', 'Experienced'];
export const equipmentOptions: Equipment[] = ['Bodyweight', 'Dumbbells', 'Barbell', 'Cable', 'Machine'];
export function createJourney(intake: Intake | null): Journey {
  return { profile: intake ? { ...intake } : { name: '', goal: '', experience: '', days: [], minutes: null, equipment: [], limitations: '', motivation: '' }, metrics: {}, goals: { weight: null, sleep: null }, weightHistory: [] };
}
export function toIntake(profile: JourneyProfile): Intake | null {
  if (!profile.name.trim() || !goalOptions.includes(profile.goal) || !experienceOptions.includes(profile.experience) || !profile.days.length || !profile.equipment.length || profile.minutes == null || profile.minutes < 15 || profile.minutes > 90) return null;
  return { ...profile, name: profile.name.trim(), minutes: profile.minutes };
}
export function readingStatus(reading: Reading | undefined, days: number, now = Date.now()) {
  if (!reading) return 'Add';
  return now - new Date(reading.at).getTime() >= days * 86400000 ? 'Update' : 'Current';
}
export function weightProgress(history: Reading[], target: number | null) {
  if (!history.length || target == null) return null;
  const start = history[0].value, current = history.at(-1)!.value;
  if (start === target) return current === target ? 100 : 0;
  return Math.max(0, Math.min(100, Math.round((current - start) / (target - start) * 100)));
}
export function recordJourney(base: Journey, profile: JourneyProfile, goals: Journey['goals'], values: Partial<Record<MetricKey, string>>, touched: MetricKey[], at = new Date().toISOString()): Journey {
  const metrics = { ...base.metrics };
  let weightHistory = [...base.weightHistory];
  const metricHistory = { ...base.metricHistory };
  for (const key of touched) {
    const raw = values[key] ?? '';
    if (raw === '') { delete metrics[key]; continue; }
    const value = Number(raw), def = metricDefinitions.find(x => x.key === key)!;
    if (!Number.isFinite(value) || value < def.min || value > def.max || (def.step === 1 && !Number.isInteger(value))) throw new Error(`${def.label} · ${def.min}–${def.max}`);
    const reading = { value, at };
    metrics[key] = reading;
    const day = new Date(at).toLocaleDateString('en-CA');
    const previous = metricHistory[key] ?? (key === 'weight' ? base.weightHistory : base.metrics[key] ? [base.metrics[key]!] : []);
    metricHistory[key] = [...previous.filter(x => new Date(x.at).toLocaleDateString('en-CA') !== day), reading].sort((a,b)=>Date.parse(a.at)-Date.parse(b.at));
    if (key === 'weight') {
      const day = new Date(at).toLocaleDateString('en-CA');
      weightHistory = weightHistory.filter(x => new Date(x.at).toLocaleDateString('en-CA') !== day);
      weightHistory.push(reading);
      weightHistory.sort((a,b) => Date.parse(a.at) - Date.parse(b.at));
    }
  }
  return { ...base, profile, goals, metrics, weightHistory, metricHistory, updatedAt: at, profileUpdatedAt: JSON.stringify(profile) !== JSON.stringify(base.profile) ? at : base.profileUpdatedAt };
}
