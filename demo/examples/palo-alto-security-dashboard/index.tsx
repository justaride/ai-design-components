/**
 * Palo Alto Networks Security Dashboard
 *
 * Generated using AI Design Components Skill Chain:
 * - theming-components: Brand colors, design tokens, light/dark themes
 * - designing-layouts: Responsive grid layout (3 → 2 → 1 columns)
 * - creating-dashboards: KPI cards, dashboard patterns
 * - visualizing-data: Donut chart for attack source breakdown
 * - providing-feedback: Toast notifications, loading states, empty states
 *
 * @see https://github.com/anthropics/ai-design-components
 */

// Main Dashboard
export { Dashboard } from './Dashboard';
export {
  ATTACK_SOURCES,
  DATE_RANGES,
  DATE_RANGE_LABELS,
  INCIDENT_STATUSES,
  INCIDENT_STATUS_LABELS,
  SEVERITIES,
  SEVERITY_LABELS,
  SOURCE_LABELS,
  buildDashboardViewModel,
  fetchDashboardData,
} from './dashboardData';
export type {
  AttackSource,
  DashboardFilters,
  DashboardPayload,
  DashboardViewModel,
  DateRange,
  IncidentRecord,
  IncidentStatus,
  KPIAlertLevel,
  KPIId,
  KPIValue,
  Severity,
} from './dashboardData';

// Individual Components
export { KPICard } from './KPICard';
export type { KPICardProps } from './KPICard';

export { DonutChart } from './DonutChart';
export type { DonutChartProps, DonutChartData } from './DonutChart';

export { EmptyState } from './EmptyState';
export type { EmptyStateProps } from './EmptyState';

export { ToastProvider, useToast } from './Toast';
export type { ToastMessage, ToastType } from './Toast';

// Default export
export { Dashboard as default } from './Dashboard';
