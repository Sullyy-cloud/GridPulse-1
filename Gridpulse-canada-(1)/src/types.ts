export type TariffTierType = 'ulo' | 'weekend_offpeak' | 'midpeak' | 'onpeak';

export interface TariffTier {
  id: TariffTierType;
  name: string;
  shortName: string;
  rateCents: number; // in cents CAD per kWh (e.g. 3.9, 9.8, 15.7, 39.1)
  timeWindow: string;
  applicableDays: string;
  actionTitle: string;
  actionDescription: string;
  accentColor: 'emerald' | 'cyan' | 'amber' | 'rose';
  isPeak: boolean;
  isULO: boolean;
}

export interface OntarioGridState {
  ontarioTimeString: string;
  formattedHour: string;
  isWeekend: boolean;
  activeTier: TariffTier;
  nextTier: TariffTier;
  minutesUntilNextTier: number;
  arbitrageSpreadCents: number; // Current difference compared to peak or baseline
  activeRecommendation: string;
}

export type AssetCategory = 'ev' | 'battery' | 'solar_generator' | 'thermostat' | 'smart_plug';

export interface HardwareDevice {
  id: string;
  name: string;
  brand: string;
  model: string;
  category: AssetCategory;
  connectionProtocol: string;
  status: 'connected' | 'dispatching' | 'charging' | 'standby' | 'pre-cooling' | 'blocked';
  powerKw: number;
  batterySoc?: number; // 0 to 100%
  capacityKwh?: number;
  currentAction: string;
  annualSavingsEstimate: number;
  oemLogoUrl?: string;
  features: string[];
  firmwareVersion: string;
  telematicsActive: boolean;
}

export interface OntarioUtility {
  id: string;
  name: string;
  region: string;
  customers: string;
  fixedMonthlyFee: number;
  deliveryPerKwh: number;
}

export interface MonthlySavingsDataPoint {
  month: string;
  baselineBill: number;
  gridpulseBill: number;
  netSavings: number;
  batterySavings?: number;
  evSavings?: number;
  thermostatSavings?: number;
  heavyLoadSavings?: number;
}

export interface SavingsCalculatorState {
  batteryCapacityKwh: number; // 0 to 27+ kWh
  evKwhPerDay: number; // 0 to 50 kWh/day
  smartThermostatEnabled: boolean;
  heavyShiftKwhPerDay?: number;
  selectedUtilityId?: string;
}

export interface SavingsOutput {
  annualSavingsCad: number;
  monthlyAverageCad: number;
  fiveYearRoiCad: number;
  peakReductionPercent: number;
  carbonOffsetKgPerYear: number;
  monthlyData: MonthlySavingsDataPoint[];
}

// Alias for backward compatibility
export type SavingsCalculationOutput = SavingsOutput;

export interface GuardrailSettings {
  autopilotEnabled: boolean;
  emergencyOverride: boolean;
  socFloorPct: number; // 20 - 80% (default 50%)
  morningDepartureTime: string; // e.g. "07:00"
  sleepProtection12v: boolean;
  preCoolingOffsetDegrees: number; // e.g. 2.0 °C
}

export interface WaitlistSubmission {
  id: string;
  fullName: string;
  email: string;
  postalCode: string;
  feederZone: string;
  selectedHardware: string[];
  utilityId: string;
  timestamp: string;
  queueNumber: number;
  referralCode: string;
  estimatedAnnualSavings: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'hardware' | 'rates' | 'safety' | 'renters';
}

export interface GreenButtonAuditResult {
  utilityName: string;
  accountNumberMasked: string;
  meterId: string;
  intervalCount: number;
  historicalAnnualKwh: number;
  historicalAnnualCost: number;
  projectedUloAnnualCost: number;
  projectedAnnualSavings: number;
  peakKwhBurned: number; // kWh burned during 4-9 PM on-peak
  peakCostBurned: number;
  topWasteSources: Array<{ name: string; kwh: number; cost: number; percentage: number }>;
  monthlyAudit: Array<{
    month: string;
    historicalCost: number;
    projectedCost: number;
    peakKwh: number;
  }>;
}

export interface SolarForecastOutput {
  condition: 'sunny' | 'partly_cloudy' | 'overcast' | 'rain';
  uvIndex: number;
  peakIrradianceWpM2: number;
  projectedGenerationKwh: number;
  sunriseTime: string;
  solarNoonTime: string;
  soakRecommendation: string;
  batteryOvernightHoldPct: number; // e.g. 35% on sunny day, 100% on overcast
  hourlyIrradiance: Array<{ hour: string; irradiance: number; generationKw: number }>;
}

// Alias for backward compatibility
export type SolarWeatherForecast = SolarForecastOutput;

export interface FuelMixState {
  timestamp: string;
  totalDemandMw: number;
  nuclearPct: number;
  hydroPct: number;
  windSolarPct: number;
  gasPeakerPct: number;
  biofuelPct: number;
  marginalCarbonIntensityGPerKwh: number;
  householdAvoidedCo2TodayKg: number;
  gridStatus: 'Clean Baseload' | 'Peaker Surge' | 'Moderate';
}

// Alias for backward compatibility
export type IesoGridFuelMix = FuelMixState;

export interface SmartEvseDevice {
  id: string;
  name: string;
  brand: string;
  ratingKw: number;
  connectionType: 'OCPP 1.6J' | 'Local REST API' | 'Cloud Webhook' | 'Smart Breaker';
  fallbackActive: boolean;
  status: 'Peak Blocked' | 'Scheduled 11 PM' | 'Charging' | 'Manual Override';
  firmware: string;
  description: string;
}

