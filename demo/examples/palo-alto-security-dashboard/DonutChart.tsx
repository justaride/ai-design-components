import { useMemo } from 'react';
import './DonutChart.css';

export interface DonutChartData {
  /** Stable id used for drilldown interactions */
  id?: string;
  /** Segment label */
  label: string;
  /** Segment value */
  value: number;
  /** Optional custom color (uses brand palette by default) */
  color?: string;
}

export interface DonutChartProps {
  /** Chart data segments */
  data: DonutChartData[];
  /** Chart title */
  title?: string;
  /** Chart size in pixels */
  size?: number;
  /** Donut hole size (0-1, where 0.6 = 60% hole) */
  innerRadius?: number;
  /** Show legend */
  showLegend?: boolean;
  /** Show value labels on segments */
  showLabels?: boolean;
  /** Loading state */
  isLoading?: boolean;
  /** Accessible description */
  ariaLabel?: string;
  /** Selected segment id for external drilldown state */
  selectedSegmentId?: string | null;
  /** Callback when segment is clicked */
  onSegmentSelect?: (segmentId: string) => void;
}

// Palo Alto Networks brand colors
const BRAND_COLORS = [
  'var(--color-cyber-orange)',
  'var(--color-prisma-blue)',
  'var(--color-cortex-green)',
  'var(--color-strata-yellow)',
  'var(--color-unit42-red)',
  '#785EF0',
];

/**
 * Donut Chart Component
 *
 * Displays a donut chart for composition/breakdown data.
 * Uses Palo Alto Networks brand colors with colorblind-safe palette.
 */
export function DonutChart({
  data,
  title,
  size = 200,
  innerRadius = 0.6,
  showLegend = true,
  showLabels = false,
  isLoading = false,
  ariaLabel,
  selectedSegmentId,
  onSegmentSelect,
}: DonutChartProps) {
  const total = useMemo(() => data.reduce((sum, d) => sum + d.value, 0), [data]);

  const segments = useMemo(() => {
    let currentAngle = -90;

    return data.map((item, index) => {
      const percentage = total > 0 ? (item.value / total) * 100 : 0;
      const angle = (percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle = endAngle;

      return {
        ...item,
        segmentId: item.id || item.label,
        percentage,
        startAngle,
        endAngle,
        color: item.color || BRAND_COLORS[index % BRAND_COLORS.length],
      };
    });
  }, [data, total]);

  const hasSelection = Boolean(selectedSegmentId);
  const isInteractive = typeof onSegmentSelect === 'function';

  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const describeArc = (
    x: number,
    y: number,
    outerRadius: number,
    innerRadiusValue: number,
    startAngle: number,
    endAngle: number
  ) => {
    const start = polarToCartesian(x, y, outerRadius, endAngle);
    const end = polarToCartesian(x, y, outerRadius, startAngle);
    const innerStart = polarToCartesian(x, y, innerRadiusValue, endAngle);
    const innerEnd = polarToCartesian(x, y, innerRadiusValue, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

    return [
      'M', start.x, start.y,
      'A', outerRadius, outerRadius, 0, largeArcFlag, 0, end.x, end.y,
      'L', innerEnd.x, innerEnd.y,
      'A', innerRadiusValue, innerRadiusValue, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
      'Z',
    ].join(' ');
  };

  const center = size / 2;
  const outerRadius = size / 2 - 4;
  const innerRadiusValue = outerRadius * innerRadius;

  if (isLoading) {
    return (
      <div className="donut-chart donut-chart--loading" style={{ width: size }}>
        <div className="donut-chart__spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!data.length || total <= 0) {
    return (
      <div className="donut-chart donut-chart--empty" style={{ width: size }}>
        {title && <h3 className="donut-chart__title">{title}</h3>}
        <div className="donut-chart__empty-icon" aria-hidden="true">
          ◌
        </div>
        <p className="donut-chart__empty-text">No data available</p>
      </div>
    );
  }

  const chartDescription = ariaLabel
    || `${title || 'Chart'}: ${segments.map((segment) => `${segment.label} ${segment.percentage.toFixed(1)}%`).join(', ')}`;

  return (
    <div className="donut-chart">
      {title && <h3 className="donut-chart__title">{title}</h3>}

      <div className="donut-chart__content">
        <figure className="donut-chart__figure" role="img" aria-label={chartDescription}>
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="donut-chart__svg"
          >
            {segments.map((segment) => {
              const selected = selectedSegmentId === segment.segmentId;
              const dimmed = hasSelection && !selected;

              return (
                <path
                  key={segment.segmentId}
                  d={describeArc(
                    center,
                    center,
                    outerRadius,
                    innerRadiusValue,
                    segment.startAngle + 90,
                    segment.endAngle + 90
                  )}
                  fill={segment.color}
                  className={[
                    'donut-chart__segment',
                    isInteractive ? 'donut-chart__segment--interactive' : '',
                    selected ? 'is-selected' : '',
                    dimmed ? 'is-dimmed' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  data-label={segment.label}
                  data-value={segment.value}
                  data-percentage={segment.percentage.toFixed(1)}
                  onClick={isInteractive ? () => onSegmentSelect(segment.segmentId) : undefined}
                  onKeyDown={isInteractive ? (event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      onSegmentSelect(segment.segmentId);
                    }
                  } : undefined}
                  tabIndex={isInteractive ? 0 : undefined}
                  role={isInteractive ? 'button' : undefined}
                  aria-pressed={isInteractive ? selected : undefined}
                >
                  <title>{`${segment.label}: ${segment.value} (${segment.percentage.toFixed(1)}%)`}</title>
                </path>
              );
            })}

            {showLabels && segments.map((segment) => {
              if (segment.percentage < 6) return null;
              const midAngle = ((segment.startAngle + segment.endAngle) / 2) + 90;
              const point = polarToCartesian(
                center,
                center,
                (outerRadius + innerRadiusValue) / 2,
                midAngle
              );
              return (
                <text
                  key={`${segment.segmentId}-label`}
                  x={point.x}
                  y={point.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="donut-chart__segment-label"
                >
                  {segment.percentage.toFixed(0)}%
                </text>
              );
            })}

            <text
              x={center}
              y={center - 8}
              textAnchor="middle"
              className="donut-chart__center-value"
            >
              {total.toLocaleString()}
            </text>
            <text
              x={center}
              y={center + 16}
              textAnchor="middle"
              className="donut-chart__center-label"
            >
              Total
            </text>
          </svg>
        </figure>

        {showLegend && (
          <ul className="donut-chart__legend" aria-label="Chart legend">
            {segments.map((segment) => {
              const selected = selectedSegmentId === segment.segmentId;
              const dimmed = hasSelection && !selected;

              return (
                <li key={segment.segmentId} className="legend__item">
                  <button
                    type="button"
                    className={[
                      'legend__button',
                      selected ? 'is-selected' : '',
                      dimmed ? 'is-dimmed' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={isInteractive ? () => onSegmentSelect(segment.segmentId) : undefined}
                    disabled={!isInteractive}
                    aria-pressed={isInteractive ? selected : undefined}
                  >
                    <span
                      className="legend__color"
                      style={{ backgroundColor: segment.color }}
                      aria-hidden="true"
                    />
                    <span className="legend__label">{segment.label}</span>
                    <span className="legend__value">{segment.value.toLocaleString()}</span>
                    <span className="legend__percentage">({segment.percentage.toFixed(1)}%)</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default DonutChart;
