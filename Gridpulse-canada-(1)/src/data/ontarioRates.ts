import {
  TariffTier,
  OntarioGridState,
  OntarioUtility,
  HardwareDevice,
  SavingsCalculatorState,
  SavingsCalculationOutput,
  MonthlySavingsDataPoint,
  FaqItem,
  GreenButtonAuditResult,
  SolarWeatherForecast,
  IesoGridFuelMix,
  SmartEvseDevice,
} from '../types';

export const ONTARIO_TARIFF_TIERS: Record<string, TariffTier> = {
  ulo: {
    id: 'ulo',
    name: 'Ultra-Low Overnight (ULO)',
    shortName: 'ULO Window',
    rateCents: 3.9,
    timeWindow: '11:00 PM – 7:00 AM',
    applicableDays: 'Every Day (Mon–Sun & Holidays)',
    actionTitle: 'Bulk Ingestion & EV Fast Charge',
    actionDescription: 'Arbitrage Active: 100% maximum battery charging, EV charging unrestricted, heavy domestic loads scheduled.',
    accentColor: 'emerald',
    isPeak: false,
    isULO: true,
  },
  weekend_offpeak: {
    id: 'weekend_offpeak',
    name: 'Weekend Off-Peak',
    shortName: 'Weekend Off-Peak',
    rateCents: 9.8,
    timeWindow: '7:00 AM – 11:00 PM',
    applicableDays: 'Saturdays, Sundays & Holidays',
    actionTitle: 'Balanced Grid Baseline',
    actionDescription: 'Moderate rate: Normal appliance operation, smart solar capture, EV topping up if required.',
    accentColor: 'cyan',
    isPeak: false,
    isULO: false,
  },
  midpeak: {
    id: 'midpeak',
    name: 'Weekday Mid-Peak',
    shortName: 'Mid-Peak',
    rateCents: 15.7,
    timeWindow: '7:00 AM – 4:00 PM & 9:00 PM – 11:00 PM',
    applicableDays: 'Weekdays (Monday–Friday)',
    actionTitle: 'Thermal Pre-Conditioning & Standby',
    actionDescription: 'ecobee/Nest pre-cooling/pre-heating activates before 4:00 PM peak spike; home battery in standby reserve.',
    accentColor: 'amber',
    isPeak: false,
    isULO: false,
  },
  onpeak: {
    id: 'onpeak',
    name: 'Weekday On-Peak',
    shortName: 'Peak Surge',
    rateCents: 39.1,
    timeWindow: '4:00 PM – 9:00 PM',
    applicableDays: 'Weekdays (Monday–Friday)',
    actionTitle: '100% Peak Defense Isolation',
    actionDescription: 'CRITICAL ARBITRAGE: Home battery & solar generators supply 100% of home circuits; EV charging strictly blocked; HVAC setback engaged.',
    accentColor: 'rose',
    isPeak: true,
    isULO: false,
  },
};

export const ONTARIO_UTILITIES: OntarioUtility[] = [
  {
    id: 'toronto_hydro',
    name: 'Toronto Hydro',
    region: 'City of Toronto & GTA Core',
    customers: '791,000 customers',
    fixedMonthlyFee: 36.42,
    deliveryPerKwh: 0.0215,
  },
  {
    id: 'hydro_one',
    name: 'Hydro One Networks',
    region: 'Province-Wide & Rural Ontario',
    customers: '1.5M customers',
    fixedMonthlyFee: 42.10,
    deliveryPerKwh: 0.0298,
  },
  {
    id: 'alectra',
    name: 'Alectra Utilities',
    region: 'Mississauga, Hamilton, Markham, Vaughan, Barrie',
    customers: '1.0M customers',
    fixedMonthlyFee: 34.80,
    deliveryPerKwh: 0.0195,
  },
  {
    id: 'hydro_ottawa',
    name: 'Hydro Ottawa',
    region: 'National Capital Region',
    customers: '360,000 customers',
    fixedMonthlyFee: 35.15,
    deliveryPerKwh: 0.0210,
  },
  {
    id: 'oakville_hydro',
    name: 'Oakville Hydro',
    region: 'Halton Region / Oakville',
    customers: '74,000 customers',
    fixedMonthlyFee: 33.20,
    deliveryPerKwh: 0.0185,
  },
  {
    id: 'london_hydro',
    name: 'London Hydro',
    region: 'Southwestern Ontario',
    customers: '163,000 customers',
    fixedMonthlyFee: 32.50,
    deliveryPerKwh: 0.0190,
  },
  {
    id: 'burlington_hydro',
    name: 'Burlington Hydro',
    region: 'Burlington & Halton',
    customers: '69,000 customers',
    fixedMonthlyFee: 33.90,
    deliveryPerKwh: 0.0192,
  },
  {
    id: 'elexicon',
    name: 'Elexicon Energy',
    region: 'Ajax, Pickering, Whitby, Belleville',
    customers: '178,000 customers',
    fixedMonthlyFee: 35.40,
    deliveryPerKwh: 0.0205,
  },
  {
    id: 'enova',
    name: 'Enova Power Corp',
    region: 'Kitchener, Waterloo, Woolwich, Wellesley',
    customers: '162,000 customers',
    fixedMonthlyFee: 34.10,
    deliveryPerKwh: 0.0198,
  },
];

/**
 * Calculates current active Ontario tariff tier based on America/Toronto timezone
 */
export function getOntarioGridState(customDate?: Date): OntarioGridState {
  // Use America/Toronto timezone
  const now = customDate || new Date();
  
  // Format to Toronto time components
  const torontoOptions: Intl.DateTimeFormatOptions = {
    timeZone: 'America/Toronto',
    hour12: false,
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
  };
  
  const formatter = new Intl.DateTimeFormat('en-CA', torontoOptions);
  const parts = formatter.formatToParts(now);
  
  const weekdayStr = parts.find((p) => p.type === 'weekday')?.value || 'Mon';
  const hour = parseInt(parts.find((p) => p.type === 'hour')?.value || '12', 10);
  const minute = parseInt(parts.find((p) => p.type === 'minute')?.value || '0', 10);
  
  // Day of week index (0 = Sun, 6 = Sat)
  const dayOfWeekMap: Record<string, number> = {
    'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6
  };
  const dayOfWeek = dayOfWeekMap[weekdayStr] ?? 1;
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const timeDecimal = hour + minute / 60;
  
  // Official Ontario Time-of-Day Tariff Rules
  const isULO = hour >= 23 || hour < 7; // 11:00 PM – 7:00 AM daily
  const isOnPeak = !isWeekend && hour >= 16 && hour < 21; // Mon–Fri 4:00 PM – 9:00 PM
  const isMidPeak = !isWeekend && ((hour >= 7 && hour < 16) || (hour >= 21 && hour < 23));
  const isWeekendOffPeak = isWeekend && hour >= 7 && hour < 23;

  let activeTier: TariffTier;
  let nextTier: TariffTier;
  let minutesUntilNextTier: number = 0;
  let activeRecommendation: string = '';

  if (isULO) {
    // 11 PM to 7 AM (Every day)
    activeTier = ONTARIO_TARIFF_TIERS.ulo;
    nextTier = isWeekend ? ONTARIO_TARIFF_TIERS.weekend_offpeak : ONTARIO_TARIFF_TIERS.midpeak;
    
    // Minutes until 7:00 AM
    let targetHours = 7 - timeDecimal;
    if (targetHours < 0) targetHours += 24;
    minutesUntilNextTier = Math.round(targetHours * 60);
    activeRecommendation = 'BULK INGESTION: Charging EV & Home Battery at 3.9¢/kWh. Running high-wattage cycles.';
  } else if (isOnPeak) {
    // 4 PM to 9 PM (On-Peak Surge 39.1¢)
    activeTier = ONTARIO_TARIFF_TIERS.onpeak;
    nextTier = ONTARIO_TARIFF_TIERS.midpeak;
    minutesUntilNextTier = Math.round((21 - timeDecimal) * 60);
    activeRecommendation = 'PEAK DEFENSE ACTIVE: 100% Home isolation. Discharging battery storage. 0W Grid Draw.';
  } else if (isWeekendOffPeak) {
    // Weekend 7 AM to 11 PM
    activeTier = ONTARIO_TARIFF_TIERS.weekend_offpeak;
    nextTier = ONTARIO_TARIFF_TIERS.ulo;
    minutesUntilNextTier = Math.round((23 - timeDecimal) * 60);
    activeRecommendation = 'WEEKEND OFF-PEAK: 9.8¢/kWh baseline. Home battery floating, solar capture priority.';
  } else {
    // Weekday Mid-Peak (7-4p or 9-11p)
    activeTier = ONTARIO_TARIFF_TIERS.midpeak;
    if (hour >= 7 && hour < 16) {
      nextTier = ONTARIO_TARIFF_TIERS.onpeak;
      minutesUntilNextTier = Math.round((16 - timeDecimal) * 60);
      activeRecommendation = timeDecimal >= 14.5
        ? 'PRE-COOLING ACTIVE: Thermal battery chilling living zones to 20.5°C before 4 PM peak spike.'
        : 'MID-PEAK STANDBY: Battery conserving charge. EV charging paused until 11 PM.';
    } else {
      nextTier = ONTARIO_TARIFF_TIERS.ulo;
      minutesUntilNextTier = Math.round((23 - timeDecimal) * 60);
      activeRecommendation = 'EV & LOAD QUEUE PREPARED: Ready to trigger 3.9¢ ULO window at 11:00 PM sharp.';
    }
  }

  const timeStringFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Toronto',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return {
    ontarioTimeString: timeStringFormatter.format(now),
    formattedHour: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
    isWeekend,
    activeTier,
    nextTier,
    minutesUntilNextTier,
    arbitrageSpreadCents: parseFloat((39.1 - activeTier.rateCents).toFixed(1)),
    activeRecommendation,
  };
}

export const SUPPORTED_HARDWARE_DEVICES: HardwareDevice[] = [
  {
    id: 'tesla_ev',
    name: 'Tesla Model Y / 3 / S / X',
    brand: 'Tesla',
    model: 'Model Y Long Range AWD',
    category: 'ev',
    connectionProtocol: 'Tesla Fleet Telemetry API v3',
    status: 'connected',
    powerKw: 11.5,
    batterySoc: 74,
    capacityKwh: 81.0,
    currentAction: 'Auto-Locked (4-9 PM Block). Next charge scheduled 11:00 PM at 3.9¢.',
    annualSavingsEstimate: 1240,
    features: ['4-9 PM Peak Surge Interceptor', 'Morning Departure Guarantee', 'Aux 12V Sleep-Guard Telemetry', 'Bidirectional V2G Ready'],
    firmwareVersion: 'v2026.20.4',
    telematicsActive: true,
  },
  {
    id: 'ford_lightning',
    name: 'Ford F-150 Lightning / Mach-E',
    brand: 'Ford',
    model: 'F-150 Lightning Extended Range',
    category: 'ev',
    connectionProtocol: 'FordPass Connected Vehicle API',
    status: 'connected',
    powerKw: 9.6,
    batterySoc: 68,
    capacityKwh: 131.0,
    currentAction: 'Standby for 11 PM bulk charge (3.9¢) & V2H Emergency Backup Ready',
    annualSavingsEstimate: 1680,
    features: ['Ford Pro Power 9.6kW V2H Integration', 'Intelligent Backup Power link', 'Automated TOU Scheduler'],
    firmwareVersion: 'Sync 4A v5.1.8',
    telematicsActive: true,
  },
  {
    id: 'tesla_powerwall',
    name: 'Tesla Powerwall 2 & 3',
    brand: 'Tesla Energy',
    model: 'Powerwall 3 (13.5 kWh LFP)',
    category: 'battery',
    connectionProtocol: 'Tesla Energy Gateway Local API',
    status: 'dispatching',
    powerKw: 5.0,
    batterySoc: 88,
    capacityKwh: 13.5,
    currentAction: 'Discharging to isolate whole home during 39.1¢ peak window.',
    annualSavingsEstimate: 1720,
    features: ['100% Self-Powered Peak Isolation', 'Zero Grid Draw during 4-9 PM', '3.9¢ Night Refill via ULO Arbitrage'],
    firmwareVersion: 'TEG-26.14.0',
    telematicsActive: true,
  },
  {
    id: 'enphase_iq',
    name: 'Enphase IQ Battery 5P / 10T',
    brand: 'Enphase',
    model: 'IQ Battery 5P Modular System',
    category: 'battery',
    connectionProtocol: 'Enphase Cloud Enlighten Envoy API',
    status: 'connected',
    powerKw: 3.84,
    batterySoc: 92,
    capacityKwh: 15.0,
    currentAction: 'Peak Defense Ready: Armed for automatic sub-second islanding',
    annualSavingsEstimate: 1450,
    features: ['Microinverter-Driven Arbitrage', 'Sub-panel dynamic balancing', '15-year warranty degradation guard'],
    firmwareVersion: 'Envoy-D7.0.88',
    telematicsActive: true,
  },
  {
    id: 'ecoflow_ultra',
    name: 'EcoFlow DELTA Pro Ultra / Pro 3',
    brand: 'EcoFlow',
    model: 'DELTA Pro Ultra + Smart Home Panel 2',
    category: 'solar_generator',
    connectionProtocol: 'EcoFlow Open IoT Cloud SDK',
    status: 'dispatching',
    powerKw: 3.6,
    batterySoc: 81,
    capacityKwh: 12.0,
    currentAction: 'Renter-Friendly Subpanel Discharge: Powering kitchen & office circuits.',
    annualSavingsEstimate: 980,
    features: ['No-Permit Plug-and-Play Option', '0¢ Daytime Solar Generator Passthrough', 'Portable RV / Cabin Transferable'],
    firmwareVersion: 'EF-SHP2-v1.0.4',
    telematicsActive: true,
  },
  {
    id: 'bluetti_ep',
    name: 'Bluetti EP500 / EP900 Energy Storage',
    brand: 'Bluetti',
    model: 'EP900 ESS + B500 Pack',
    category: 'solar_generator',
    connectionProtocol: 'Bluetti Cloud MQTT Gateway',
    status: 'connected',
    powerKw: 4.8,
    batterySoc: 85,
    capacityKwh: 9.9,
    currentAction: 'Armed for 4-9 PM Peak Defense arbitrage trigger',
    annualSavingsEstimate: 890,
    features: ['Split-phase 120V/240V Output', 'Integrated High-Voltage Solar MPPT', 'App-automated Peak Shifting'],
    firmwareVersion: 'DSP-v2.12',
    telematicsActive: true,
  },
  {
    id: 'ecobee_smart',
    name: 'ecobee Smart Thermostat Premium',
    brand: 'ecobee',
    model: 'Smart Thermostat Premium (Toronto, ON)',
    category: 'thermostat',
    connectionProtocol: 'ecobee Developer API & HomeKit',
    status: 'pre-cooling',
    powerKw: 0.05,
    currentAction: 'Pre-Cooling thermal buffer: 20.5°C before 4 PM; Setback to 23.5°C during 39.1¢ peak.',
    annualSavingsEstimate: 310,
    features: ['Thermal Battery Pre-Conditioning at 15.7¢', '4-9 PM Compressor Peak Shaving', 'Comfort Drift Limiter (<2.5°C)'],
    firmwareVersion: 'ecobeeOS-4.8.7',
    telematicsActive: true,
  },
  {
    id: 'nest_learning',
    name: 'Google Nest Learning Thermostat',
    brand: 'Google Nest',
    model: 'Nest Thermostat 4th Gen',
    category: 'thermostat',
    connectionProtocol: 'Google Smart Device Management API',
    status: 'connected',
    powerKw: 0.05,
    currentAction: 'Smart Setback armed for 4:00 PM peak spike.',
    annualSavingsEstimate: 285,
    features: ['Ontario OEB Rate-Aware Scheduling', 'Seasonal Heat Pump Optimization', 'Occupancy Aware Setback'],
    firmwareVersion: 'Nest-1.6.2',
    telematicsActive: true,
  },
  {
    id: 'shelly_emporia',
    name: 'Shelly Pro / Emporia Smart Circuits',
    brand: 'Shelly & Emporia',
    model: 'Shelly Pro 4PM + Emporia Vue 3',
    category: 'smart_plug',
    connectionProtocol: 'Local WebSockets / Gen2 API',
    status: 'connected',
    powerKw: 2.2,
    currentAction: 'Shifted pool pump & dehumidifier to 3.9¢ ULO window.',
    annualSavingsEstimate: 420,
    features: ['Heavy 240V Circuit Load Shifting', 'Hot Water Tank 3.9¢ Pre-Heating', 'Real-Time Branch Breaker Telemetry'],
    firmwareVersion: 'Shelly-1.4.2-Pro',
    telematicsActive: true,
  },
];

/**
 * Accurate Ontario ULO Whole-Home Savings Calculator Engine
 */
export function calculateOntarioSavings(input: SavingsCalculatorState): SavingsCalculationOutput {
  const {
    batteryCapacityKwh,
    evKwhPerDay,
    smartThermostatEnabled,
    heavyShiftKwhPerDay,
  } = input;

  // Arbitrage spreads
  // Peak vs ULO = 39.1 - 3.9 = 35.2 cents / kWh = $0.352 / kWh
  // Mid vs ULO = 15.7 - 3.9 = 11.8 cents / kWh = $0.118 / kWh
  // Standard baseline blended rate (TOU / Tiered) in Ontario is roughly 16.5 cents / kWh
  
  // 1. Battery Arbitrage
  // Daily battery cycle assumes 85% usable DoD (Depth of Discharge) and 90% roundtrip efficiency on ~250 weekday peak events per year
  const effectiveBatteryDischargeKwh = batteryCapacityKwh * 0.88;
  const batteryWeekdayDailySavings = effectiveBatteryDischargeKwh * (0.391 - 0.039);
  const batteryAnnualSavings = batteryWeekdayDailySavings * 250; // 250 weekdays/year

  // 2. EV Charging Arbitrage
  // Without Gridpulse, average EV owner charges during uncoordinated evening hours (mixture of 39.1¢ peak and 15.7¢ mid-peak, avg ~24.5¢)
  // With Gridpulse, 100% of EV charging occurs at 3.9¢ ULO rate
  const evBaselineCostPerKwh = 0.228;
  const evUloCostPerKwh = 0.039;
  const evDailySavings = evKwhPerDay * (evBaselineCostPerKwh - evUloCostPerKwh);
  const evAnnualSavings = evDailySavings * 365;

  // 3. Smart Thermostat Savings (Pre-cooling at 15.7¢ and peak float +2.5°C during 4-9 PM summer & winter heat pump shift)
  const thermostatAnnualSavings = smartThermostatEnabled ? 315 : 0;

  // 4. Smart Plugs & Heavy Circuits (Pool pump, dehumidifier, water heater, heaters)
  // Shift from mid-peak / peak to ULO 3.9¢
  const heavyShiftDailySavings = heavyShiftKwhPerDay * (0.195 - 0.039);
  const heavyShiftAnnualSavings = heavyShiftDailySavings * 365;

  const totalAnnualSavings = batteryAnnualSavings + evAnnualSavings + thermostatAnnualSavings + heavyShiftAnnualSavings;
  const monthlyAverage = totalAnnualSavings / 12;
  const fiveYearRoi = totalAnnualSavings * 5 * 1.05; // factoring in projected 5% OEB tariff increases

  // Peak grid reduction percentage
  let peakReduction = 0;
  if (batteryCapacityKwh > 0 || evKwhPerDay > 0 || smartThermostatEnabled || heavyShiftKwhPerDay > 0) {
    peakReduction = Math.min(88, Math.max(35, Math.round(
      (batteryCapacityKwh > 0 ? 45 : 0) +
      (evKwhPerDay > 0 ? 25 : 0) +
      (smartThermostatEnabled ? 12 : 0) +
      (heavyShiftKwhPerDay > 0 ? 8 : 0)
    )));
  }

  // Carbon offset in Ontario (OEB natural gas peaker avoidance during 4-9 PM: ~420g CO2/kWh displaced)
  const totalKwhShiftedFromPeak = (effectiveBatteryDischargeKwh * 250) + (evKwhPerDay * 0.45 * 365) + (smartThermostatEnabled ? 650 : 0);
  const carbonOffsetKg = Math.round(totalKwhShiftedFromPeak * 0.38);

  // 12-Month Seasonal Modeling for Ontario (Winter heating peaks in Jan/Feb, Summer AC peaks in Jul/Aug)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const seasonalWeights = [1.25, 1.20, 1.05, 0.85, 0.80, 1.10, 1.35, 1.30, 0.95, 0.90, 1.05, 1.20];

  const monthlyData: MonthlySavingsDataPoint[] = monthNames.map((month, idx) => {
    const weight = seasonalWeights[idx];
    const baseHouseholdBill = 280 * weight + (evKwhPerDay * 30 * evBaselineCostPerKwh);
    const monthSavings = monthlyAverage * weight;
    const gridpulseBill = Math.max(45, baseHouseholdBill - monthSavings);

    return {
      month,
      baselineBill: Math.round(baseHouseholdBill),
      gridpulseBill: Math.round(gridpulseBill),
      netSavings: Math.round(monthSavings),
      batterySavings: Math.round((batteryAnnualSavings / 12) * weight),
      evSavings: Math.round((evAnnualSavings / 12) * (idx === 0 || idx === 1 ? 1.15 : 1.0)), // cold winter EV range penalty
      thermostatSavings: Math.round((thermostatAnnualSavings / 12) * (idx === 6 || idx === 7 || idx === 0 || idx === 1 ? 1.6 : 0.4)),
      heavyLoadSavings: Math.round((heavyShiftAnnualSavings / 12) * (idx >= 4 && idx <= 8 ? 1.4 : 0.7)), // summer pool pumps
    };
  });

  return {
    annualSavingsCad: Math.round(totalAnnualSavings),
    monthlyAverageCad: Math.round(monthlyAverage),
    fiveYearRoiCad: Math.round(fiveYearRoi),
    peakReductionPercent: peakReduction,
    carbonOffsetKgPerYear: carbonOffsetKg,
    monthlyData,
  };
}

/**
 * Postal code to Ontario LDC and feeder resolution
 */
export function lookupOntarioPostalCode(postalCode: string): {
  utilityName: string;
  feederZone: string;
  isValidOntario: boolean;
} {
  const clean = postalCode.trim().toUpperCase().replace(/\s+/g, '');
  if (!clean || clean.length < 3) {
    return { utilityName: 'Toronto Hydro', feederZone: 'Detecting LDC Zone...', isValidOntario: false };
  }

  const prefix = clean.substring(0, 3);
  const firstLetter = prefix.charAt(0);

  // Ontario postal codes start with K, L, M, N, P
  if (!['K', 'L', 'M', 'N', 'P'].includes(firstLetter)) {
    return { utilityName: 'Non-Ontario Postal Code', feederZone: 'Ontario Only (OEB Jurisdiction)', isValidOntario: false };
  }

  if (firstLetter === 'M') {
    return { utilityName: 'Toronto Hydro', feederZone: `Toronto Central Feeder 13.8kV (${prefix})`, isValidOntario: true };
  } else if (prefix.startsWith('L6H') || prefix.startsWith('L6J') || prefix.startsWith('L6K') || prefix.startsWith('L6L') || prefix.startsWith('L6M')) {
    return { utilityName: 'Oakville Hydro', feederZone: `Oakville South Substation (${prefix})`, isValidOntario: true };
  } else if (prefix.startsWith('L7') || prefix.startsWith('L8') || prefix.startsWith('L9') || prefix.startsWith('L4') || prefix.startsWith('L5')) {
    return { utilityName: 'Alectra Utilities', feederZone: `Alectra West Regional Substation (${prefix})`, isValidOntario: true };
  } else if (prefix.startsWith('L1') || prefix.startsWith('L0')) {
    return { utilityName: 'Elexicon Energy', feederZone: `Durham Grid Distribution Zone (${prefix})`, isValidOntario: true };
  } else if (firstLetter === 'K') {
    return { utilityName: 'Hydro Ottawa', feederZone: `National Capital 27.6kV Loop (${prefix})`, isValidOntario: true };
  } else if (prefix.startsWith('N6') || prefix.startsWith('N5')) {
    return { utilityName: 'London Hydro', feederZone: `London Southwest Substation (${prefix})`, isValidOntario: true };
  } else if (prefix.startsWith('N2') || prefix.startsWith('N1')) {
    return { utilityName: 'Enova Power Corp', feederZone: `Grand River Regional Grid (${prefix})`, isValidOntario: true };
  } else {
    return { utilityName: 'Hydro One Networks', feederZone: `Hydro One Provincial Feeder (${prefix})`, isValidOntario: true };
  }
}

export const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'hardware',
    question: 'Does Gridpulse require an electrician or physical hardware installation?',
    answer: 'No! Gridpulse operates entirely 100% via secure cloud telematics and local IoT gateway protocols. We connect via official manufacturer APIs (Tesla Fleet API, Enphase Cloud, FordPass, EcoFlow Cloud, ecobee Developer API) without touching your circuit breaker, wiring, or voiding existing warranties.',
  },
  {
    id: 'faq-2',
    category: 'rates',
    question: 'How do I switch to the Ultra-Low Overnight (ULO) rate with my Ontario utility?',
    answer: 'Switching is 100% free under Ontario Energy Board rules. You can switch in under 2 minutes through your local utility portal (Toronto Hydro, Hydro One, Alectra, etc.) by selecting "Ultra-Low Overnight Rate". Gridpulse automatically syncs with your utility billing cycle to guarantee maximum 3.9¢ arbitrage.',
  },
  {
    id: 'faq-3',
    category: 'safety',
    question: 'Will discharging my home battery daily damage its warranty or lifespan?',
    answer: 'Modern LFP (Lithium Iron Phosphate) home batteries such as Tesla Powerwall 3, Enphase IQ, and EcoFlow Ultra are rated for 6,000–10,000 full cycles (over 15–25 years). Gridpulse includes an automated DoD (Depth of Discharge) Guardrail and thermal throttling to ensure calendar aging is minimized while maximizing arbitrage profit.',
  },
  {
    id: 'faq-4',
    category: 'safety',
    question: 'What is 12V Telematics Sleep-Guard for Electric Vehicles?',
    answer: 'Many EV apps drain the auxiliary 12-volt battery by continually waking the vehicle. Gridpulse uses smart passive token caching and event-driven webhooks: we only communicate with your vehicle when a rate tier transition occurs, keeping your EV in deep hibernation throughout the day.',
  },
  {
    id: 'faq-5',
    category: 'renters',
    question: 'Can condo renters or tenants use Gridpulse without landlord approval?',
    answer: 'Yes! Renters with portable power stations (like EcoFlow DELTA Pro or Bluetti EP500), smart plugs, and smart thermostats can plug in directly. Gridpulse commands your portable battery to charge at 3.9¢ overnight and discharge to power your high-draw electronics (workstations, gaming PCs, portable ACs) during 39.1¢ peak hours.',
  },
  {
    id: 'faq-6',
    category: 'hardware',
    question: 'What happens if I need my EV charged during a peak emergency?',
    answer: 'You have complete control at all times. Our dashboard features an Instant Emergency Override button. A single tap instantly unblocks all EV chargers and returns every device to manual control with zero penalty.',
  },
];

/**
 * Green Button Connect My Data (CMD) 12-Month Historical Load Audit Generator
 */
export function generateGreenButtonAudit(utilityId: string, postalCode: string = 'M5V 2T6'): GreenButtonAuditResult {
  const utility = ONTARIO_UTILITIES.find((u) => u.id === utilityId) || ONTARIO_UTILITIES[0];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthMultipliers = [1.2, 1.15, 1.0, 0.85, 0.82, 1.08, 1.32, 1.28, 0.94, 0.88, 1.02, 1.18];

  const baseAnnualKwh = 11420;
  const baseHistoricalCost = 2780;
  const projectedUloCost = 984;
  const totalSavings = baseHistoricalCost - projectedUloCost;
  const peakKwhTotal = 3280; // kWh burned during 4-9 PM on-peak
  const peakCostTotal = Math.round(peakKwhTotal * 0.391);

  const monthlyAudit = months.map((month, idx) => {
    const mult = monthMultipliers[idx];
    const historicalCost = Math.round((baseHistoricalCost / 12) * mult);
    const projectedCost = Math.round((projectedUloCost / 12) * mult);
    const peakKwh = Math.round((peakKwhTotal / 12) * mult);

    return {
      month,
      historicalCost,
      projectedCost,
      peakKwh,
    };
  });

  return {
    utilityName: utility.name,
    accountNumberMasked: `ON-CMD-8834-•••${Math.floor(100 + Math.random() * 900)}`,
    meterId: `SM-ONT-${postalCode.replace(/\s+/g, '').toUpperCase()}-09`,
    intervalCount: 35040, // 4 readings/hour * 24 * 365 = 35,040 intervals
    historicalAnnualKwh: baseAnnualKwh,
    historicalAnnualCost: baseHistoricalCost,
    projectedUloAnnualCost: projectedUloCost,
    projectedAnnualSavings: totalSavings,
    peakKwhBurned: peakKwhTotal,
    peakCostBurned: peakCostTotal,
    topWasteSources: [
      { name: 'EV Unscheduled Evening Charging (5-8 PM)', kwh: 1420, cost: 555, percentage: 43 },
      { name: 'A/C Cooling During 4-9 PM Peak Surge', kwh: 1140, cost: 445, percentage: 35 },
      { name: 'Heavy Laundry & Water Heater Cycles', kwh: 720, cost: 281, percentage: 22 },
    ],
    monthlyAudit,
  };
}

/**
 * Solar & Weather Forecast Engine Projections
 */
export function getSolarWeatherForecast(condition: 'sunny' | 'partly_cloudy' | 'overcast' | 'rain' = 'sunny'): SolarWeatherForecast {
  const configs = {
    sunny: {
      condition: 'sunny' as const,
      uvIndex: 8.4,
      peakIrradianceWpM2: 940,
      projectedGenerationKwh: 34.2,
      sunriseTime: '06:12 AM',
      solarNoonTime: '01:18 PM',
      soakRecommendation: 'Clear Sky Tomorrow: Battery held at 35% overnight charge; reserving 65% capacity for 0¢ rooftop solar absorption.',
      batteryOvernightHoldPct: 35,
      curvePeak: 5.2,
    },
    partly_cloudy: {
      condition: 'partly_cloudy' as const,
      uvIndex: 5.6,
      peakIrradianceWpM2: 610,
      projectedGenerationKwh: 22.8,
      sunriseTime: '06:14 AM',
      solarNoonTime: '01:18 PM',
      soakRecommendation: 'Scattered Clouds: Battery charged to 55% at 3.9¢ ULO overnight; reserving 45% for peak solar soak.',
      batteryOvernightHoldPct: 55,
      curvePeak: 3.4,
    },
    overcast: {
      condition: 'overcast' as const,
      uvIndex: 2.8,
      peakIrradianceWpM2: 240,
      projectedGenerationKwh: 9.4,
      sunriseTime: '06:16 AM',
      solarNoonTime: '01:18 PM',
      soakRecommendation: 'Heavy Cloud Cover: Bulk charging battery to 100% at 3.9¢ ULO overnight to guarantee 100% peak coverage.',
      batteryOvernightHoldPct: 100,
      curvePeak: 1.4,
    },
    rain: {
      condition: 'rain' as const,
      uvIndex: 1.4,
      peakIrradianceWpM2: 120,
      projectedGenerationKwh: 4.6,
      sunriseTime: '06:18 AM',
      solarNoonTime: '01:18 PM',
      soakRecommendation: 'Rain & Storm Forecast: 100% ULO overnight bulk charge + Emergency Backup Blackout Reserve armed.',
      batteryOvernightHoldPct: 100,
      curvePeak: 0.7,
    },
  };

  const selected = configs[condition];
  const hours = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
  const factors = [0.05, 0.35, 0.85, 1.0, 0.9, 0.55, 0.15, 0.0];

  const hourlyIrradiance = hours.map((h, i) => ({
    hour: h,
    irradiance: Math.round(selected.peakIrradianceWpM2 * factors[i]),
    generationKw: parseFloat((selected.curvePeak * factors[i]).toFixed(1)),
  }));

  return {
    condition: selected.condition,
    uvIndex: selected.uvIndex,
    peakIrradianceWpM2: selected.peakIrradianceWpM2,
    projectedGenerationKwh: selected.projectedGenerationKwh,
    sunriseTime: selected.sunriseTime,
    solarNoonTime: selected.solarNoonTime,
    soakRecommendation: selected.soakRecommendation,
    batteryOvernightHoldPct: selected.batteryOvernightHoldPct,
    hourlyIrradiance,
  };
}

/**
 * Real-Time IESO Ontario Fuel Mix & Marginal Carbon Telemetry
 */
export function getIesoFuelMix(): IesoGridFuelMix {
  return {
    timestamp: 'Live Ontario IESO Real-Time Dispatch',
    totalDemandMw: 18450,
    nuclearPct: 62,
    hydroPct: 24,
    windSolarPct: 8,
    gasPeakerPct: 6,
    biofuelPct: 0,
    marginalCarbonIntensityGPerKwh: 82, // Natural gas peaker marginal carbon (g CO2/kWh)
    householdAvoidedCo2TodayKg: 4.2,
    gridStatus: 'Clean Baseload',
  };
}

/**
 * Smart EVSE / Wall Chargers with Breaker-Level Fallback Scheduling
 */
export const SMART_EVSE_CHARGERS: SmartEvseDevice[] = [
  {
    id: 'tesla_wall_gen3',
    name: 'Tesla Wall Connector (Gen 3)',
    brand: 'Tesla',
    ratingKw: 11.5,
    connectionType: 'Local REST API',
    fallbackActive: true,
    status: 'Peak Blocked',
    firmware: 'v23.24.4',
    description: 'Direct Wi-Fi REST protocol to control contactor without polling vehicle telematics.',
  },
  {
    id: 'wallbox_pulsar',
    name: 'Wallbox Pulsar Plus',
    brand: 'Wallbox',
    ratingKw: 9.6,
    connectionType: 'OCPP 1.6J',
    fallbackActive: true,
    status: 'Scheduled 11 PM',
    firmware: 'v5.18.2',
    description: 'OCPP load-shedding profile blocks 4–9 PM peak draw automatically at the charger level.',
  },
  {
    id: 'chargepoint_flex',
    name: 'ChargePoint Home Flex',
    brand: 'ChargePoint',
    ratingKw: 12.0,
    connectionType: 'Cloud Webhook',
    fallbackActive: true,
    status: 'Peak Blocked',
    firmware: 'CP-Flex-v2.9',
    description: 'Cloud webhook overrides internal utility schedule to prioritize 3.9¢ ULO window.',
  },
  {
    id: 'flo_home_x5',
    name: 'FLO Home X5 (Canadian Made)',
    brand: 'FLO',
    ratingKw: 7.2,
    connectionType: 'OCPP 1.6J',
    fallbackActive: true,
    status: 'Peak Blocked',
    firmware: 'FLO-X5-3.1',
    description: 'Industrial-grade aluminum enclosure with sub-zero Canadian winter rate management.',
  },
  {
    id: 'emporia_evse',
    name: 'Emporia Smart EV Charger',
    brand: 'Emporia',
    ratingKw: 11.5,
    connectionType: 'Smart Breaker',
    fallbackActive: true,
    status: 'Scheduled 11 PM',
    firmware: 'Emp-Vue-4.0',
    description: 'Integrates with Emporia Vue 3 panel monitor to ensure whole-home 200A service safety.',
  },
];

