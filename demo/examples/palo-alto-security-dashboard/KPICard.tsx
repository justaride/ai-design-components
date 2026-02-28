import type { KeyboardEvent, ReactNode } from 'react';
import type { KPIAlertLevel, Severity } from './dashboardData';
import './KPICard.css';

export interface KPICardProps {
  /** Label describing the metric */
  label: string;
  /** Primary metric value to display */
  value: string | number;
  /** Trend percentage (positive = up, negative = down) */
  trend?: number;
  /** Comparison period text */
  trendLabel?: string;
  /** Optional icon component */
  icon?: ReactNode;
  /** Loading state */
  isLoading?: boolean;
  /** Severity for security metrics */
  severity?: Severity;
  /** Timestamp shown below metric context */
  asOf?: string;
  /** Sparkline points used for quick trend scanning */
  sparkline?: number[];
  /** Alert level for threshold-driven states */
  alertLevel?: KPIAlertLevel;
  /** Optional alert context text */
  alertMessage?: string;
  /** Optional selection state when used as drilldown control */
  isSelected?: boolean;
  /** Optional click handler for drilldown */
  onSelect?: () => void;
}

function formatTrend(trend: number | undefined) {
  if (trend === undefined) return null;
  return `${Math.abs(trend).toFixed(2).replace(/\.00$/, '')}%`;
}

function getTrendClass(trend: number | undefined) {
  if (trend === undefined || trend === 0) return 'trend--neutral';
  return trend > 0 ? 'trend--positive' : 'trend--negative';
}

function getTrendIcon(trend: number | undefined) {
  if (trend === undefined || trend === 0) return '→';
  return trend > 0 ? '↑' : '↓';
}

function createSparklinePath(points: number[]): string {
  if (points.length < 2) {
    return '';
  }

  const width = 240;
  const height = 44;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  return points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * width;
      const y = height - (((point - min) / range) * height);
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');
}

function createSparklineAreaPath(points: number[]): string {
  if (points.length < 2) {
    return '';
  }

  const width = 240;
  const height = 44;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const linePoints = points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * width;
      const y = height - (((point - min) / range) * height);
      return `${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' L ');

  return `M 0 ${height} L ${linePoints} L ${width} ${height} Z`;
}

/**
 * KPI Card Component
 *
 * Displays a key performance indicator with trend and quick sparkline context.
 */
export function KPICard({
  label,
  value,
  trend,
  trendLabel = 'vs last period',
  icon,
  isLoading = false,
  severity,
  asOf,
  sparkline = [],
  alertLevel = 'none',
  alertMessage,
  isSelected = false,
  onSelect,
}: KPICardProps) {
  const isInteractive = typeof onSelect === 'function';

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!isInteractive) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect();
    }
  };

  if (isLoading) {
    return (
      <div className="kpi-card kpi-card--loading" aria-busy="true">
        <div className="kpi-card__spinner" aria-label="Loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  const trendClass = getTrendClass(trend);
  const trendText = formatTrend(trend);

  return (
    <article
      className={[
        'kpi-card',
        severity ? `kpi-card--${severity}` : '',
        alertLevel !== 'none' ? `kpi-card--alert-${alertLevel}` : '',
        isInteractive ? 'kpi-card--interactive' : '',
        isSelected ? 'kpi-card--selected' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      tabIndex={isInteractive ? 0 : undefined}
      role={isInteractive ? 'button' : undefined}
      aria-pressed={isInteractive ? isSelected : undefined}
    >
      <header className="kpi-card__header">
        {icon && <span className="kpi-card__icon">{icon}</span>}
        <h3 className="kpi-card__label">{label}</h3>
      </header>

      <div className="kpi-card__body">
        <p className="kpi-card__value">{value}</p>

        {trend !== undefined && trendText && (
          <div className={`kpi-card__trend ${trendClass}`}>
            <span className="trend__icon">{getTrendIcon(trend)}</span>
            <span className="trend__value">{trendText}</span>
            <span className="trend__label">{trendLabel}</span>
          </div>
        )}

        {sparkline.length > 1 && (
          <div className="kpi-card__sparkline-wrap" aria-hidden="true">
            <svg viewBox="0 0 240 44" className="kpi-card__sparkline">
              <path d={createSparklineAreaPath(sparkline)} className="kpi-card__sparkline-area" />
              <path d={createSparklinePath(sparkline)} className="kpi-card__sparkline-line" />
            </svg>
          </div>
        )}

        {asOf && <p className="kpi-card__timestamp">{asOf}</p>}
      </div>

      {alertLevel !== 'none' && alertMessage && (
        <p className={`kpi-card__alert kpi-card__alert--${alertLevel}`}>{alertMessage}</p>
      )}

      {severity && (
        <div className={`kpi-card__severity severity--${severity}`}>{severity.toUpperCase()}</div>
      )}
    </article>
  );
}

export default KPICard;
