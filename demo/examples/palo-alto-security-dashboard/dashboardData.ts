export const DATE_RANGES = ['24h', '7d', '30d', '90d'] as const;
export type DateRange = (typeof DATE_RANGES)[number];

export const SEVERITIES = ['critical', 'high', 'medium', 'low', 'info'] as const;
export type Severity = (typeof SEVERITIES)[number];

export const ATTACK_SOURCES = [
  'external_network',
  'phishing',
  'malware',
  'brute_force',
  'ddos',
] as const;
export type AttackSource = (typeof ATTACK_SOURCES)[number];

export const INCIDENT_STATUSES = ['open', 'investigating', 'mitigated', 'resolved'] as const;
export type IncidentStatus = (typeof INCIDENT_STATUSES)[number];

export type KPIId =
  | 'threats_blocked'
  | 'active_incidents'
  | 'vulnerabilities'
  | 'network_uptime';

export type KPIFormat = 'integer' | 'percent';
type KPIAggregation = 'sum' | 'weighted_average';

export interface KPIDataRow {
  source: AttackSource;
  severity: Severity;
  current: number;
  previous: number;
  series: number[];
  weight?: number;
}

export interface KPIModel {
  id: KPIId;
  label: string;
  severity: Severity;
  format: KPIFormat;
  aggregation: KPIAggregation;
  trendLabel: string;
  rows: KPIDataRow[];
}

export interface AttackSourceMetric {
  source: AttackSource;
  label: string;
  severity: Severity;
  value: number;
  color: string;
}

export interface IncidentRecord {
  id: string;
  title: string;
  source: AttackSource;
  severity: Severity;
  status: IncidentStatus;
  owner: string;
  affectedAssets: number;
  mttrMinutes: number;
  detectedAt: string;
  relatedKpi: KPIId;
}

export interface DashboardPayload {
  asOf: string;
  kpis: KPIModel[];
  attackSources: AttackSourceMetric[];
  incidents: IncidentRecord[];
}

export interface DashboardFilters {
  severities: Severity[];
  sources: AttackSource[];
}

export type KPIAlertLevel = 'none' | 'warning' | 'critical';

export interface KPIValue {
  id: KPIId;
  label: string;
  current: number;
  previous: number;
  delta: number;
  asOf: string;
  format: KPIFormat;
  severity: Severity;
  trendLabel: string;
  sparkline: number[];
  alertLevel: KPIAlertLevel;
  alertMessage: string;
}

export interface DashboardViewModel {
  asOf: string;
  kpis: KPIValue[];
  attackSources: AttackSourceMetric[];
  incidents: IncidentRecord[];
}

export const DATE_RANGE_LABELS: Record<DateRange, string> = {
  '24h': 'Last 24 hours',
  '7d': 'Last 7 days',
  '30d': 'Last 30 days',
  '90d': 'Last 90 days',
};

export const SEVERITY_LABELS: Record<Severity, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  info: 'Info',
};

export const SOURCE_LABELS: Record<AttackSource, string> = {
  external_network: 'External Network',
  phishing: 'Phishing Attempts',
  malware: 'Malware',
  brute_force: 'Brute Force',
  ddos: 'DDoS',
};

export const INCIDENT_STATUS_LABELS: Record<IncidentStatus, string> = {
  open: 'Open',
  investigating: 'Investigating',
  mitigated: 'Mitigated',
  resolved: 'Resolved',
};

const SOURCE_COLORS: Record<AttackSource, string> = {
  external_network: 'var(--color-cyber-orange)',
  phishing: 'var(--color-prisma-blue)',
  malware: 'var(--color-cortex-green)',
  brute_force: 'var(--color-strata-yellow)',
  ddos: 'var(--color-unit42-red)',
};

const BASE_THREAT_ROWS: KPIDataRow[] = [
  {
    source: 'external_network',
    severity: 'high',
    current: 4521,
    previous: 3918,
    series: [3200, 3450, 3520, 3640, 3712, 3801, 3899, 4010, 4140, 4305, 4408, 4521],
  },
  {
    source: 'phishing',
    severity: 'critical',
    current: 3892,
    previous: 3375,
    series: [2750, 2810, 2922, 3008, 3070, 3140, 3220, 3308, 3433, 3551, 3720, 3892],
  },
  {
    source: 'malware',
    severity: 'medium',
    current: 2134,
    previous: 2284,
    series: [2500, 2465, 2408, 2382, 2340, 2314, 2284, 2240, 2212, 2188, 2160, 2134],
  },
  {
    source: 'brute_force',
    severity: 'low',
    current: 1456,
    previous: 1607,
    series: [1802, 1776, 1742, 1711, 1677, 1648, 1607, 1574, 1539, 1510, 1484, 1456],
  },
  {
    source: 'ddos',
    severity: 'info',
    current: 844,
    previous: 686,
    series: [480, 516, 545, 563, 591, 623, 686, 701, 738, 780, 812, 844],
  },
];

const BASE_INCIDENT_ROWS: KPIDataRow[] = [
  {
    source: 'external_network',
    severity: 'high',
    current: 8,
    previous: 10,
    series: [14, 13, 13, 12, 12, 11, 10, 10, 9, 9, 8, 8],
  },
  {
    source: 'phishing',
    severity: 'critical',
    current: 6,
    previous: 8,
    series: [12, 11, 10, 10, 10, 9, 8, 8, 7, 7, 7, 6],
  },
  {
    source: 'malware',
    severity: 'medium',
    current: 4,
    previous: 3,
    series: [2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4],
  },
  {
    source: 'brute_force',
    severity: 'low',
    current: 3,
    previous: 2,
    series: [2, 2, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3],
  },
  {
    source: 'ddos',
    severity: 'info',
    current: 2,
    previous: 2,
    series: [1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  },
];

const BASE_VULNERABILITY_ROWS: KPIDataRow[] = [
  {
    source: 'external_network',
    severity: 'high',
    current: 42,
    previous: 39,
    series: [31, 31, 32, 33, 35, 35, 39, 39, 40, 40, 41, 42],
  },
  {
    source: 'phishing',
    severity: 'critical',
    current: 38,
    previous: 33,
    series: [24, 25, 26, 27, 28, 30, 33, 34, 35, 36, 37, 38],
  },
  {
    source: 'malware',
    severity: 'medium',
    current: 34,
    previous: 31,
    series: [21, 22, 23, 24, 25, 27, 31, 31, 32, 33, 33, 34],
  },
  {
    source: 'brute_force',
    severity: 'low',
    current: 26,
    previous: 25,
    series: [22, 23, 23, 24, 24, 24, 25, 25, 25, 26, 26, 26],
  },
  {
    source: 'ddos',
    severity: 'info',
    current: 16,
    previous: 22,
    series: [31, 30, 29, 28, 27, 25, 22, 20, 19, 18, 17, 16],
  },
];

const BASE_UPTIME_ROWS: KPIDataRow[] = [
  {
    source: 'external_network',
    severity: 'high',
    current: 99.95,
    previous: 99.9,
    weight: 0.35,
    series: [99.81, 99.82, 99.85, 99.86, 99.88, 99.89, 99.9, 99.91, 99.92, 99.93, 99.94, 99.95],
  },
  {
    source: 'phishing',
    severity: 'critical',
    current: 99.93,
    previous: 99.9,
    weight: 0.2,
    series: [99.78, 99.8, 99.81, 99.83, 99.84, 99.87, 99.9, 99.9, 99.91, 99.92, 99.93, 99.93],
  },
  {
    source: 'malware',
    severity: 'medium',
    current: 99.98,
    previous: 99.96,
    weight: 0.2,
    series: [99.91, 99.91, 99.92, 99.93, 99.94, 99.95, 99.96, 99.97, 99.97, 99.98, 99.98, 99.98],
  },
  {
    source: 'brute_force',
    severity: 'low',
    current: 99.99,
    previous: 99.98,
    weight: 0.15,
    series: [99.93, 99.94, 99.95, 99.95, 99.96, 99.97, 99.98, 99.98, 99.98, 99.99, 99.99, 99.99],
  },
  {
    source: 'ddos',
    severity: 'info',
    current: 100,
    previous: 99.99,
    weight: 0.1,
    series: [99.95, 99.95, 99.96, 99.97, 99.97, 99.98, 99.99, 99.99, 99.99, 100, 100, 100],
  },
];

interface IncidentTemplate {
  id: string;
  title: string;
  source: AttackSource;
  severity: Severity;
  status: IncidentStatus;
  owner: string;
  affectedAssets: number;
  mttrMinutes: number;
  hoursAgo: number;
  relatedKpi: KPIId;
}

const BASE_INCIDENTS: IncidentTemplate[] = [
  {
    id: 'INC-2401',
    title: 'Credential stuffing campaign on customer portal',
    source: 'external_network',
    severity: 'critical',
    status: 'investigating',
    owner: 'Nina Reyes',
    affectedAssets: 18,
    mttrMinutes: 165,
    hoursAgo: 5,
    relatedKpi: 'active_incidents',
  },
  {
    id: 'INC-2402',
    title: 'Suspicious phishing wave targeting finance group',
    source: 'phishing',
    severity: 'high',
    status: 'open',
    owner: 'Jordan Lee',
    affectedAssets: 24,
    mttrMinutes: 140,
    hoursAgo: 9,
    relatedKpi: 'threats_blocked',
  },
  {
    id: 'INC-2403',
    title: 'Malware beaconing observed on endpoint cluster',
    source: 'malware',
    severity: 'high',
    status: 'investigating',
    owner: 'Sam Patel',
    affectedAssets: 11,
    mttrMinutes: 190,
    hoursAgo: 13,
    relatedKpi: 'vulnerabilities',
  },
  {
    id: 'INC-2404',
    title: 'Brute-force traffic from rotating cloud IP ranges',
    source: 'brute_force',
    severity: 'medium',
    status: 'mitigated',
    owner: 'Avery Cole',
    affectedAssets: 7,
    mttrMinutes: 115,
    hoursAgo: 20,
    relatedKpi: 'threats_blocked',
  },
  {
    id: 'INC-2405',
    title: 'Volumetric DDoS spike on API gateway',
    source: 'ddos',
    severity: 'critical',
    status: 'mitigated',
    owner: 'Morgan Shah',
    affectedAssets: 5,
    mttrMinutes: 95,
    hoursAgo: 30,
    relatedKpi: 'network_uptime',
  },
  {
    id: 'INC-2406',
    title: 'Unpatched browser extensions in support workstations',
    source: 'malware',
    severity: 'medium',
    status: 'open',
    owner: 'Taylor Nguyen',
    affectedAssets: 14,
    mttrMinutes: 260,
    hoursAgo: 45,
    relatedKpi: 'vulnerabilities',
  },
  {
    id: 'INC-2407',
    title: 'Outbound C2 callback blocked by edge policy',
    source: 'external_network',
    severity: 'high',
    status: 'resolved',
    owner: 'Nina Reyes',
    affectedAssets: 4,
    mttrMinutes: 80,
    hoursAgo: 76,
    relatedKpi: 'threats_blocked',
  },
  {
    id: 'INC-2408',
    title: 'Email impersonation run against HR mailbox',
    source: 'phishing',
    severity: 'medium',
    status: 'resolved',
    owner: 'Jordan Lee',
    affectedAssets: 9,
    mttrMinutes: 70,
    hoursAgo: 122,
    relatedKpi: 'active_incidents',
  },
  {
    id: 'INC-2409',
    title: 'Anomalous login retries on bastion hosts',
    source: 'brute_force',
    severity: 'high',
    status: 'investigating',
    owner: 'Avery Cole',
    affectedAssets: 6,
    mttrMinutes: 145,
    hoursAgo: 190,
    relatedKpi: 'active_incidents',
  },
  {
    id: 'INC-2410',
    title: 'Legacy TLS package vulnerable to downgrade attack',
    source: 'external_network',
    severity: 'critical',
    status: 'open',
    owner: 'Sam Patel',
    affectedAssets: 21,
    mttrMinutes: 330,
    hoursAgo: 290,
    relatedKpi: 'vulnerabilities',
  },
  {
    id: 'INC-2411',
    title: 'Low-rate UDP flood against regional edge POP',
    source: 'ddos',
    severity: 'medium',
    status: 'resolved',
    owner: 'Morgan Shah',
    affectedAssets: 3,
    mttrMinutes: 65,
    hoursAgo: 405,
    relatedKpi: 'network_uptime',
  },
  {
    id: 'INC-2412',
    title: 'Suspicious macro execution in accounts payable inbox',
    source: 'phishing',
    severity: 'high',
    status: 'mitigated',
    owner: 'Taylor Nguyen',
    affectedAssets: 8,
    mttrMinutes: 120,
    hoursAgo: 520,
    relatedKpi: 'threats_blocked',
  },
  {
    id: 'INC-2413',
    title: 'Potential ransomware prep blocked by EDR policy',
    source: 'malware',
    severity: 'critical',
    status: 'resolved',
    owner: 'Sam Patel',
    affectedAssets: 12,
    mttrMinutes: 110,
    hoursAgo: 755,
    relatedKpi: 'threats_blocked',
  },
  {
    id: 'INC-2414',
    title: 'Repeated token abuse attempts in service accounts',
    source: 'external_network',
    severity: 'high',
    status: 'mitigated',
    owner: 'Nina Reyes',
    affectedAssets: 10,
    mttrMinutes: 175,
    hoursAgo: 1090,
    relatedKpi: 'active_incidents',
  },
  {
    id: 'INC-2415',
    title: 'Credential harvesting page mirrored in regional DNS',
    source: 'phishing',
    severity: 'critical',
    status: 'resolved',
    owner: 'Jordan Lee',
    affectedAssets: 16,
    mttrMinutes: 92,
    hoursAgo: 1590,
    relatedKpi: 'threats_blocked',
  },
];

const wait = (ms: number) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

const roundCount = (value: number) => Math.max(0, Math.round(value));
const clampPercent = (value: number) => Number(Math.min(100, Math.max(95, value)).toFixed(2));

function scaleSeries(series: number[], factor: number, format: KPIFormat): number[] {
  if (format === 'percent') {
    return series.map((point) => clampPercent(point + factor));
  }
  return series.map((point) => roundCount(point * factor));
}

function scaleCountRows(rows: KPIDataRow[], factor: number): KPIDataRow[] {
  return rows.map((row) => ({
    ...row,
    current: roundCount(row.current * factor),
    previous: roundCount(row.previous * factor),
    series: scaleSeries(row.series, factor, 'integer'),
  }));
}

function scaleUptimeRows(rows: KPIDataRow[], adjustment: number): KPIDataRow[] {
  return rows.map((row) => ({
    ...row,
    current: clampPercent(row.current + adjustment),
    previous: clampPercent(row.previous + adjustment - 0.01),
    series: scaleSeries(row.series, adjustment, 'percent'),
  }));
}

function buildIncidents(asOf: string, maxHours: number, volumeFactor: number): IncidentRecord[] {
  const asOfTime = new Date(asOf).getTime();
  return BASE_INCIDENTS
    .filter((incident) => incident.hoursAgo <= maxHours)
    .map((incident) => ({
      ...incident,
      detectedAt: new Date(asOfTime - (incident.hoursAgo * 60 * 60 * 1000)).toISOString(),
      affectedAssets: Math.max(1, roundCount(incident.affectedAssets * volumeFactor)),
      mttrMinutes: Math.max(10, roundCount(incident.mttrMinutes * (1 + ((volumeFactor - 1) * 0.1)))),
    }));
}

function createPayload(config: {
  asOf: string;
  threatFactor: number;
  incidentFactor: number;
  vulnerabilityFactor: number;
  uptimeAdjustment: number;
  windowHours: number;
  incidentVolumeFactor: number;
}): DashboardPayload {
  const threatRows = scaleCountRows(BASE_THREAT_ROWS, config.threatFactor);
  const incidentRows = scaleCountRows(BASE_INCIDENT_ROWS, config.incidentFactor);
  const vulnerabilityRows = scaleCountRows(BASE_VULNERABILITY_ROWS, config.vulnerabilityFactor);
  const uptimeRows = scaleUptimeRows(BASE_UPTIME_ROWS, config.uptimeAdjustment);

  return {
    asOf: config.asOf,
    kpis: [
      {
        id: 'threats_blocked',
        label: 'Threats Blocked',
        severity: 'info',
        format: 'integer',
        aggregation: 'sum',
        trendLabel: 'vs previous period',
        rows: threatRows,
      },
      {
        id: 'active_incidents',
        label: 'Active Incidents',
        severity: 'high',
        format: 'integer',
        aggregation: 'sum',
        trendLabel: 'vs previous period',
        rows: incidentRows,
      },
      {
        id: 'vulnerabilities',
        label: 'Vulnerabilities',
        severity: 'medium',
        format: 'integer',
        aggregation: 'sum',
        trendLabel: 'vs previous period',
        rows: vulnerabilityRows,
      },
      {
        id: 'network_uptime',
        label: 'Network Uptime',
        severity: 'low',
        format: 'percent',
        aggregation: 'weighted_average',
        trendLabel: 'vs previous period',
        rows: uptimeRows,
      },
    ],
    attackSources: threatRows.map((row) => ({
      source: row.source,
      label: SOURCE_LABELS[row.source],
      severity: row.severity,
      value: row.current,
      color: SOURCE_COLORS[row.source],
    })),
    incidents: buildIncidents(config.asOf, config.windowHours, config.incidentVolumeFactor),
  };
}

const PAYLOADS_BY_RANGE: Record<DateRange, DashboardPayload> = {
  '24h': createPayload({
    asOf: '2026-02-28T14:30:00Z',
    threatFactor: 0.06,
    incidentFactor: 0.22,
    vulnerabilityFactor: 0.3,
    uptimeAdjustment: 0.02,
    windowHours: 24,
    incidentVolumeFactor: 0.35,
  }),
  '7d': createPayload({
    asOf: '2026-02-28T12:00:00Z',
    threatFactor: 0.32,
    incidentFactor: 0.48,
    vulnerabilityFactor: 0.55,
    uptimeAdjustment: 0.01,
    windowHours: 24 * 7,
    incidentVolumeFactor: 0.6,
  }),
  '30d': createPayload({
    asOf: '2026-02-28T09:30:00Z',
    threatFactor: 1,
    incidentFactor: 1,
    vulnerabilityFactor: 1,
    uptimeAdjustment: 0,
    windowHours: 24 * 30,
    incidentVolumeFactor: 1,
  }),
  '90d': createPayload({
    asOf: '2026-02-28T00:00:00Z',
    threatFactor: 2.95,
    incidentFactor: 2.1,
    vulnerabilityFactor: 2.4,
    uptimeAdjustment: -0.03,
    windowHours: 24 * 90,
    incidentVolumeFactor: 1.8,
  }),
};

export async function fetchDashboardData(dateRange: DateRange): Promise<DashboardPayload> {
  await wait(450);
  return structuredClone(PAYLOADS_BY_RANGE[dateRange]);
}

function aggregateRows(
  rows: KPIDataRow[],
  aggregation: KPIAggregation,
  format: KPIFormat
): { current: number; previous: number; series: number[] } {
  if (!rows.length) {
    return { current: 0, previous: 0, series: [] };
  }

  const seriesLength = Math.max(...rows.map((row) => row.series.length));
  const accumulatedSeries = Array.from({ length: seriesLength }, () => 0);

  if (aggregation === 'weighted_average') {
    let weightSum = 0;
    let currentWeighted = 0;
    let previousWeighted = 0;

    for (const row of rows) {
      const weight = row.weight ?? 1;
      weightSum += weight;
      currentWeighted += row.current * weight;
      previousWeighted += row.previous * weight;

      for (let index = 0; index < seriesLength; index += 1) {
        const point = row.series[index] ?? row.series[row.series.length - 1] ?? 0;
        accumulatedSeries[index] += point * weight;
      }
    }

    if (weightSum === 0) {
      return { current: 0, previous: 0, series: [] };
    }

    const series = accumulatedSeries.map((value) => Number((value / weightSum).toFixed(2)));

    return {
      current: Number((currentWeighted / weightSum).toFixed(2)),
      previous: Number((previousWeighted / weightSum).toFixed(2)),
      series,
    };
  }

  const current = rows.reduce((sum, row) => sum + row.current, 0);
  const previous = rows.reduce((sum, row) => sum + row.previous, 0);

  for (const row of rows) {
    for (let index = 0; index < seriesLength; index += 1) {
      const point = row.series[index] ?? row.series[row.series.length - 1] ?? 0;
      accumulatedSeries[index] += point;
    }
  }

  const series = format === 'integer'
    ? accumulatedSeries.map((value) => roundCount(value))
    : accumulatedSeries.map((value) => Number(value.toFixed(2)));

  return { current, previous, series };
}

function evaluateAlert(id: KPIId, current: number, delta: number, hasData: boolean): { level: KPIAlertLevel; message: string } {
  if (!hasData) {
    return { level: 'none', message: 'No data in current filter scope' };
  }

  switch (id) {
    case 'threats_blocked': {
      if (current >= 15000 || delta >= 20) {
        return { level: 'critical', message: 'Attack traffic spike - investigate campaign sources' };
      }
      if (current >= 10000 || delta >= 10) {
        return { level: 'warning', message: 'Elevated threat volume vs previous period' };
      }
      return { level: 'none', message: 'Threat volume is within expected range' };
    }
    case 'active_incidents': {
      if (current >= 25 || delta >= 20) {
        return { level: 'critical', message: 'Incident backlog above critical threshold' };
      }
      if (current >= 15 || delta >= 5) {
        return { level: 'warning', message: 'Incident load trending upward' };
      }
      return { level: 'none', message: 'Incident queue is stable' };
    }
    case 'vulnerabilities': {
      if (current >= 180 || delta >= 15) {
        return { level: 'critical', message: 'Vulnerability inventory exceeds remediation capacity' };
      }
      if (current >= 120 || delta >= 5) {
        return { level: 'warning', message: 'Vulnerability trend requires prioritization' };
      }
      return { level: 'none', message: 'Vulnerability trend is controlled' };
    }
    case 'network_uptime': {
      if (current < 99.9 || delta < -0.08) {
        return { level: 'critical', message: 'Uptime dropped below SLO guardrail' };
      }
      if (current < 99.95 || delta < -0.02) {
        return { level: 'warning', message: 'Uptime deterioration detected' };
      }
      return { level: 'none', message: 'Uptime remains healthy' };
    }
    default:
      return { level: 'none', message: '' };
  }
}

export function buildDashboardViewModel(
  payload: DashboardPayload,
  filters: DashboardFilters
): DashboardViewModel {
  const sourceSet = new Set(filters.sources);
  const severitySet = new Set(filters.severities);

  const kpis: KPIValue[] = payload.kpis.map((kpi) => {
    const scopedRows = kpi.rows.filter(
      (row) => sourceSet.has(row.source) && severitySet.has(row.severity)
    );

    const { current, previous, series } = aggregateRows(scopedRows, kpi.aggregation, kpi.format);
    const delta =
      previous === 0
        ? (current === 0 ? 0 : 100)
        : Number((((current - previous) / previous) * 100).toFixed(2));

    const alert = evaluateAlert(kpi.id, current, delta, scopedRows.length > 0);

    return {
      id: kpi.id,
      label: kpi.label,
      current,
      previous,
      delta,
      asOf: payload.asOf,
      format: kpi.format,
      severity: kpi.severity,
      trendLabel: kpi.trendLabel,
      sparkline: series,
      alertLevel: alert.level,
      alertMessage: alert.message,
    };
  });

  const mergedSources = new Map<AttackSource, AttackSourceMetric>();
  for (const sourceMetric of payload.attackSources) {
    if (!sourceSet.has(sourceMetric.source) || !severitySet.has(sourceMetric.severity)) {
      continue;
    }

    const existing = mergedSources.get(sourceMetric.source);
    if (existing) {
      existing.value += sourceMetric.value;
      continue;
    }

    mergedSources.set(sourceMetric.source, { ...sourceMetric });
  }

  const attackSources = [...mergedSources.values()].sort((a, b) => b.value - a.value);

  const incidents = payload.incidents
    .filter((incident) => sourceSet.has(incident.source) && severitySet.has(incident.severity))
    .sort((left, right) => new Date(right.detectedAt).getTime() - new Date(left.detectedAt).getTime());

  return {
    asOf: payload.asOf,
    kpis,
    attackSources,
    incidents,
  };
}
