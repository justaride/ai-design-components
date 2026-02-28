import { useMemo, useState, useEffect } from 'react';
import { KPICard } from './KPICard';
import { DonutChart } from './DonutChart';
import { EmptyState } from './EmptyState';
import { ToastProvider, useToast } from './Toast';
import {
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
  type AttackSource,
  type DateRange,
  type IncidentRecord,
  type IncidentStatus,
  type KPIId,
  type KPIValue,
  type Severity,
} from './dashboardData';
import './Dashboard.css';

const DEFAULT_DATE_RANGE: DateRange = '30d';

type IncidentSortKey = 'detectedAt' | 'severity' | 'status' | 'affectedAssets' | 'mttrMinutes';

const SEVERITY_ORDER: Record<Severity, number> = {
  critical: 5,
  high: 4,
  medium: 3,
  low: 2,
  info: 1,
};

const STATUS_ORDER: Record<IncidentStatus, number> = {
  open: 4,
  investigating: 3,
  mitigated: 2,
  resolved: 1,
};

function isAttackSource(value: string): value is AttackSource {
  return ATTACK_SOURCES.includes(value as AttackSource);
}

function formatKPIValue(metric: KPIValue) {
  if (metric.format === 'percent') {
    return `${metric.current.toFixed(2)}%`;
  }
  return Math.round(metric.current).toLocaleString();
}

function formatAsOf(asOf: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(new Date(asOf));
}

function formatDetectedAt(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function toggleSort(
  current: { key: IncidentSortKey; direction: 'asc' | 'desc' },
  key: IncidentSortKey
): { key: IncidentSortKey; direction: 'asc' | 'desc' } {
  if (current.key === key) {
    return {
      key,
      direction: current.direction === 'asc' ? 'desc' : 'asc',
    };
  }
  return {
    key,
    direction: key === 'detectedAt' ? 'desc' : 'asc',
  };
}

function compareIncidents(left: IncidentRecord, right: IncidentRecord, key: IncidentSortKey): number {
  switch (key) {
    case 'detectedAt':
      return new Date(left.detectedAt).getTime() - new Date(right.detectedAt).getTime();
    case 'severity':
      return SEVERITY_ORDER[left.severity] - SEVERITY_ORDER[right.severity];
    case 'status':
      return STATUS_ORDER[left.status] - STATUS_ORDER[right.status];
    case 'affectedAssets':
      return left.affectedAssets - right.affectedAssets;
    case 'mttrMinutes':
      return left.mttrMinutes - right.mttrMinutes;
    default:
      return 0;
  }
}

/**
 * Security Dashboard Component
 *
 * Main dashboard displaying security metrics, threat data, and attack sources.
 * Built with Palo Alto Networks brand styling.
 */
function DashboardContent() {
  const [dateRange, setDateRange] = useState<DateRange>(DEFAULT_DATE_RANGE);
  const [selectedSeverities, setSelectedSeverities] = useState<Severity[]>([...SEVERITIES]);
  const [selectedSources, setSelectedSources] = useState<AttackSource[]>([...ATTACK_SOURCES]);

  const [drilldownKpi, setDrilldownKpi] = useState<KPIId | 'all'>('all');
  const [drilldownSource, setDrilldownSource] = useState<AttackSource | 'all'>('all');

  const [incidentStatusFilter, setIncidentStatusFilter] = useState<IncidentStatus | 'all'>('all');
  const [incidentQuery, setIncidentQuery] = useState('');
  const [incidentSort, setIncidentSort] = useState<{ key: IncidentSortKey; direction: 'asc' | 'desc' }>({
    key: 'detectedAt',
    direction: 'desc',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [payload, setPayload] = useState<Awaited<ReturnType<typeof fetchDashboardData>> | null>(null);

  const { success, info, error, warning } = useToast();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const nextPayload = await fetchDashboardData(dateRange);
        if (cancelled) return;
        setPayload(nextPayload);
        info('Dashboard loaded', `Showing data for ${DATE_RANGE_LABELS[dateRange].toLowerCase()}`);
      } catch (loadError) {
        if (cancelled) return;
        const message = loadError instanceof Error ? loadError.message : 'Unable to load dashboard data';
        setErrorMessage(message);
        error('Data load failed', message);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [dateRange, error, info]);

  const handleRefresh = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const nextPayload = await fetchDashboardData(dateRange);
      setPayload(nextPayload);
      success('Data refreshed', 'All metrics updated successfully');
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : 'Unable to refresh dashboard data';
      setErrorMessage(message);
      error('Refresh failed', message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeverityToggle = (severity: Severity) => {
    setSelectedSeverities((current) => {
      if (current.includes(severity)) {
        if (current.length === 1) {
          warning('At least one severity required', 'Keep one severity selected to display data.');
          return current;
        }
        return current.filter((item) => item !== severity);
      }
      return [...current, severity];
    });
  };

  const handleSourceToggle = (source: AttackSource) => {
    setSelectedSources((current) => {
      if (current.includes(source)) {
        if (current.length === 1) {
          warning('At least one source required', 'Keep one source selected to display data.');
          return current;
        }
        return current.filter((item) => item !== source);
      }
      return [...current, source];
    });
  };

  const handleKpiSelect = (kpiId: KPIId) => {
    setDrilldownKpi((current) => {
      const next = current === kpiId ? 'all' : kpiId;
      if (next === 'all') {
        info('KPI drilldown cleared', 'Incident table is back to all metrics.');
      } else {
        info('KPI drilldown active', 'Incident table is now scoped to selected KPI.');
      }
      return next;
    });
  };

  const handleSourceDrilldown = (segmentId: string) => {
    if (!isAttackSource(segmentId)) {
      return;
    }

    setDrilldownSource((current) => {
      const next = current === segmentId ? 'all' : segmentId;
      if (next === 'all') {
        info('Source drilldown cleared', 'Incident table now includes all attack sources.');
      } else {
        info('Source drilldown active', `Focused on ${SOURCE_LABELS[next]}.`);
      }
      return next;
    });
  };

  const clearDrilldowns = () => {
    setDrilldownKpi('all');
    setDrilldownSource('all');
    setIncidentStatusFilter('all');
    setIncidentQuery('');
    info('Drilldown reset', 'Returned to full incident workbench view.');
  };

  const viewModel = payload
    ? buildDashboardViewModel(payload, {
      severities: selectedSeverities,
      sources: selectedSources,
    })
    : null;

  const metrics = viewModel?.kpis ?? [];

  const chartData = viewModel?.attackSources.map((item) => ({
    id: item.source,
    label: item.label,
    value: item.value,
    color: item.color,
  })) ?? [];

  const incidents = useMemo(() => {
    const base = viewModel?.incidents ?? [];
    const query = incidentQuery.trim().toLowerCase();

    const filtered = base.filter((incident) => {
      if (drilldownKpi !== 'all' && incident.relatedKpi !== drilldownKpi) {
        return false;
      }
      if (drilldownSource !== 'all' && incident.source !== drilldownSource) {
        return false;
      }
      if (incidentStatusFilter !== 'all' && incident.status !== incidentStatusFilter) {
        return false;
      }
      if (!query) {
        return true;
      }

      return [
        incident.id,
        incident.title,
        incident.owner,
        SOURCE_LABELS[incident.source],
        SEVERITY_LABELS[incident.severity],
      ]
        .join(' ')
        .toLowerCase()
        .includes(query);
    });

    filtered.sort((left, right) => {
      const comparison = compareIncidents(left, right, incidentSort.key);
      return incidentSort.direction === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [
    drilldownKpi,
    drilldownSource,
    incidentQuery,
    incidentSort.direction,
    incidentSort.key,
    incidentStatusFilter,
    viewModel,
  ]);

  const filterSummary = `${selectedSources.length}/${ATTACK_SOURCES.length} sources • ${selectedSeverities.length}/${SEVERITIES.length} severities`;

  const activeDrilldowns = [
    drilldownKpi !== 'all' ? `KPI: ${metrics.find((metric) => metric.id === drilldownKpi)?.label || drilldownKpi}` : null,
    drilldownSource !== 'all' ? `Source: ${SOURCE_LABELS[drilldownSource]}` : null,
  ].filter(Boolean);

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <div className="dashboard__header-content">
          <div className="dashboard__branding">
            <h1 className="dashboard__title">Security Analytics</h1>
            <p className="dashboard__subtitle">Palo Alto Networks Threat Dashboard</p>
          </div>

          <div className="dashboard__actions">
            <ThemeToggle />
            <label className="dashboard__range-control">
              <span className="dashboard__range-label">Range</span>
              <select
                className="dashboard__range-select"
                value={dateRange}
                onChange={(event) => setDateRange(event.target.value as DateRange)}
                disabled={isLoading}
              >
                {DATE_RANGES.map((range) => (
                  <option key={range} value={range}>
                    {DATE_RANGE_LABELS[range]}
                  </option>
                ))}
              </select>
            </label>
            <button className="dashboard__refresh" onClick={handleRefresh} disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard__main">
        <section className="dashboard__section">
          <h2 className="dashboard__section-title">Global Filters</h2>
          <div className="dashboard__filters">
            <fieldset className="dashboard__filter-group">
              <legend className="dashboard__filter-legend">Severity</legend>
              <div className="dashboard__chip-grid">
                {SEVERITIES.map((severity) => {
                  const checked = selectedSeverities.includes(severity);
                  return (
                    <label
                      key={severity}
                      className={`dashboard__chip ${checked ? 'dashboard__chip--active' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleSeverityToggle(severity)}
                      />
                      <span>{SEVERITY_LABELS[severity]}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="dashboard__filter-group">
              <legend className="dashboard__filter-legend">Attack Source</legend>
              <div className="dashboard__chip-grid">
                {ATTACK_SOURCES.map((source) => {
                  const checked = selectedSources.includes(source);
                  return (
                    <label
                      key={source}
                      className={`dashboard__chip ${checked ? 'dashboard__chip--active' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleSourceToggle(source)}
                      />
                      <span>{SOURCE_LABELS[source]}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </div>
          <p className="dashboard__filters-summary">
            {filterSummary}
            {viewModel ? ` • As of ${formatAsOf(viewModel.asOf)}` : ''}
          </p>
        </section>

        {errorMessage && !viewModel ? (
          <section className="dashboard__section">
            <EmptyState
              title="Unable to load dashboard data"
              description={errorMessage}
              variant="error"
              action={{ label: 'Retry', onClick: handleRefresh }}
            />
          </section>
        ) : (
          <>
            <section className="dashboard__section">
              <h2 className="dashboard__section-title">Key Metrics</h2>
              <div className="dashboard__grid dashboard__grid--kpis">
                {metrics.map((metric) => (
                  <KPICard
                    key={metric.id}
                    label={metric.label}
                    value={formatKPIValue(metric)}
                    trend={metric.delta}
                    trendLabel={metric.trendLabel}
                    severity={metric.severity}
                    asOf={`As of ${formatAsOf(metric.asOf)}`}
                    sparkline={metric.sparkline}
                    alertLevel={metric.alertLevel}
                    alertMessage={metric.alertMessage}
                    isSelected={drilldownKpi === metric.id}
                    onSelect={() => handleKpiSelect(metric.id)}
                    isLoading={isLoading}
                  />
                ))}
              </div>
            </section>

            <section className="dashboard__section">
              <h2 className="dashboard__section-title">Threat Analysis</h2>
              <div className="dashboard__grid dashboard__grid--charts">
                {isLoading ? (
                  <div className="dashboard__chart-placeholder">
                    <div className="spinner" />
                  </div>
                ) : viewModel ? (
                  <DonutChart
                    title="Attack Sources"
                    data={chartData}
                    size={220}
                    showLegend={true}
                    showLabels={true}
                    selectedSegmentId={drilldownSource === 'all' ? null : drilldownSource}
                    onSegmentSelect={handleSourceDrilldown}
                  />
                ) : (
                  <EmptyState
                    title="No data available"
                    description="Unable to load attack source data"
                    variant="error"
                    action={{ label: 'Retry', onClick: handleRefresh }}
                  />
                )}
              </div>
            </section>

            <section className="dashboard__section">
              <div className="dashboard__section-head">
                <h2 className="dashboard__section-title">Incident Workbench</h2>
                <button
                  type="button"
                  className="dashboard__ghost-button"
                  onClick={clearDrilldowns}
                  disabled={activeDrilldowns.length === 0 && incidentStatusFilter === 'all' && !incidentQuery}
                >
                  Clear Drilldown
                </button>
              </div>

              <div className="dashboard__drilldown-meta">
                {activeDrilldowns.length > 0 ? (
                  activeDrilldowns.map((item) => (
                    <span key={item} className="dashboard__pill">{item}</span>
                  ))
                ) : (
                  <span className="dashboard__text-muted">No KPI/source drilldown active</span>
                )}
              </div>

              <div className="dashboard__incident-controls">
                <label className="dashboard__control">
                  <span>Status</span>
                  <select
                    value={incidentStatusFilter}
                    onChange={(event) => setIncidentStatusFilter(event.target.value as IncidentStatus | 'all')}
                  >
                    <option value="all">All statuses</option>
                    {INCIDENT_STATUSES.map((status) => (
                      <option key={status} value={status}>{INCIDENT_STATUS_LABELS[status]}</option>
                    ))}
                  </select>
                </label>

                <label className="dashboard__control dashboard__control--search">
                  <span>Search</span>
                  <input
                    type="search"
                    placeholder="Search incident id, owner, title"
                    value={incidentQuery}
                    onChange={(event) => setIncidentQuery(event.target.value)}
                  />
                </label>
              </div>

              {incidents.length === 0 ? (
                <EmptyState
                  title="No incidents in current scope"
                  description="Try clearing drilldowns or broadening filters to see more incidents."
                  variant="no-results"
                  action={{ label: 'Reset filters', onClick: clearDrilldowns }}
                />
              ) : (
                <div className="dashboard__table-wrap">
                  <table className="dashboard__table">
                    <thead>
                      <tr>
                        <th>Incident</th>
                        <th>
                          <button
                            type="button"
                            className="dashboard__sort-button"
                            onClick={() => setIncidentSort((current) => toggleSort(current, 'severity'))}
                          >
                            Severity
                            <span>{incidentSort.key === 'severity' ? (incidentSort.direction === 'asc' ? '↑' : '↓') : '↕'}</span>
                          </button>
                        </th>
                        <th>Source</th>
                        <th>
                          <button
                            type="button"
                            className="dashboard__sort-button"
                            onClick={() => setIncidentSort((current) => toggleSort(current, 'status'))}
                          >
                            Status
                            <span>{incidentSort.key === 'status' ? (incidentSort.direction === 'asc' ? '↑' : '↓') : '↕'}</span>
                          </button>
                        </th>
                        <th>
                          <button
                            type="button"
                            className="dashboard__sort-button"
                            onClick={() => setIncidentSort((current) => toggleSort(current, 'affectedAssets'))}
                          >
                            Assets
                            <span>{incidentSort.key === 'affectedAssets' ? (incidentSort.direction === 'asc' ? '↑' : '↓') : '↕'}</span>
                          </button>
                        </th>
                        <th>
                          <button
                            type="button"
                            className="dashboard__sort-button"
                            onClick={() => setIncidentSort((current) => toggleSort(current, 'mttrMinutes'))}
                          >
                            MTTR (min)
                            <span>{incidentSort.key === 'mttrMinutes' ? (incidentSort.direction === 'asc' ? '↑' : '↓') : '↕'}</span>
                          </button>
                        </th>
                        <th>
                          <button
                            type="button"
                            className="dashboard__sort-button"
                            onClick={() => setIncidentSort((current) => toggleSort(current, 'detectedAt'))}
                          >
                            Detected
                            <span>{incidentSort.key === 'detectedAt' ? (incidentSort.direction === 'asc' ? '↑' : '↓') : '↕'}</span>
                          </button>
                        </th>
                        <th>Owner</th>
                      </tr>
                    </thead>
                    <tbody>
                      {incidents.map((incident) => (
                        <tr key={incident.id}>
                          <td>
                            <div className="dashboard__incident-title">{incident.title}</div>
                            <div className="dashboard__incident-meta">
                              <span className="dashboard__mono">{incident.id}</span>
                              <span className="dashboard__pill dashboard__pill--soft">
                                {metrics.find((metric) => metric.id === incident.relatedKpi)?.label || incident.relatedKpi}
                              </span>
                            </div>
                          </td>
                          <td>
                            <span className={`dashboard__severity-badge dashboard__severity-badge--${incident.severity}`}>
                              {SEVERITY_LABELS[incident.severity]}
                            </span>
                          </td>
                          <td>{SOURCE_LABELS[incident.source]}</td>
                          <td>
                            <span className={`dashboard__status-badge dashboard__status-badge--${incident.status}`}>
                              {INCIDENT_STATUS_LABELS[incident.status]}
                            </span>
                          </td>
                          <td>{incident.affectedAssets}</td>
                          <td>{incident.mttrMinutes}</td>
                          <td>{formatDetectedAt(incident.detectedAt)}</td>
                          <td>{incident.owner}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <footer className="dashboard__footer">
        <p>&copy; 2025 Palo Alto Networks. Generated with AI Design Components.</p>
      </footer>
    </div>
  );
}

/**
 * Theme Toggle Button
 */
function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}

/**
 * Dashboard with Toast Provider
 */
export function Dashboard() {
  return (
    <ToastProvider>
      <DashboardContent />
    </ToastProvider>
  );
}

export default Dashboard;
