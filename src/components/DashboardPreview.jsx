import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid,
  PolarAngleAxis, Radar
} from 'recharts'
import './DashboardPreview.css'

const areaData = [
  { month: 'Jan', score: 32 },
  { month: 'Feb', score: 41 },
  { month: 'Mar', score: 38 },
  { month: 'Apr', score: 55 },
  { month: 'May', score: 63 },
  { month: 'Jun', score: 72 },
  { month: 'Jul', score: 78 },
]

const radarData = [
  { skill: 'React', you: 80, required: 95 },
  { skill: 'TypeScript', you: 55, required: 90 },
  { skill: 'Node.js', you: 70, required: 85 },
  { skill: 'AWS', you: 30, required: 75 },
  { skill: 'CI/CD', you: 45, required: 80 },
  { skill: 'Testing', you: 60, required: 85 },
]

const SKILL_GAPS = [
  { name: 'AWS / Cloud', gap: 45, criticality: 'High' },
  { name: 'TypeScript', gap: 35, criticality: 'High' },
  { name: 'CI/CD Pipelines', gap: 35, criticality: 'Medium' },
  { name: 'Unit Testing', gap: 25, criticality: 'Medium' },
]

const STATS = [
  { label: 'Overall Match', value: '68%', trend: '+12.5%', up: true },
  { label: 'Skills You Have', value: '14', trend: '+3', up: true },
  { label: 'Gaps Identified', value: '8', trend: '-20%', up: false },
  { label: 'Readiness Score', value: '7.2', trend: '+4.5%', up: true },
]

export default function DashboardPreview() {
  return (
    <div className="dbp-shell">
      {/* Sidebar */}
      <aside className="dbp-sidebar">
        <div className="dbp-sidebar-header">
          <div className="dbp-sidebar-avatar">JD</div>
          <div>
            <div className="dbp-sidebar-name">John Doe</div>
            <div className="dbp-sidebar-role">Frontend Dev</div>
          </div>
        </div>

        <div className="dbp-sidebar-section-label">Overview</div>
        <nav className="dbp-nav">
          <div className="dbp-nav-item active">
            <span className="dbp-nav-dot" />
            Dashboard
          </div>
          <div className="dbp-nav-item">
            <span className="dbp-nav-dot" />
            Skill Profile
          </div>
          <div className="dbp-nav-item">
            <span className="dbp-nav-dot" />
            Gap Analysis
          </div>
          <div className="dbp-nav-item">
            <span className="dbp-nav-dot" />
            Learning Path
          </div>
        </nav>

        <div className="dbp-sidebar-section-label">Reports</div>
        <nav className="dbp-nav">
          <div className="dbp-nav-item">
            <span className="dbp-nav-dot" />
            Skill Report
          </div>
          <div className="dbp-nav-item">
            <span className="dbp-nav-dot" />
            Progress
          </div>
          <div className="dbp-nav-item">
            <span className="dbp-nav-dot" />
            Resources
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <main className="dbp-main">
        {/* Header */}
        <div className="dbp-main-header">
          <div>
            <h3 className="dbp-main-title">Gap Analysis</h3>
            <p className="dbp-main-subtitle">Target: Senior Frontend Engineer</p>
          </div>
          <button className="dbp-quick-btn">Quick Analyze</button>
        </div>

        {/* Stats Row */}
        <div className="dbp-stats-row">
          {STATS.map((s, i) => (
            <div className="dbp-stat-card" key={i}>
              <div className="dbp-stat-header">
                <span className="dbp-stat-label">{s.label}</span>
                <span className={`dbp-stat-trend ${s.up ? 'up' : 'down'}`}>{s.trend}</span>
              </div>
              <div className="dbp-stat-value">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="dbp-charts-row">
          {/* Area Chart */}
          <div className="dbp-chart-card dbp-chart-wide">
            <div className="dbp-chart-header">
              <span className="dbp-chart-title">Readiness Score Over Time</span>
              <div className="dbp-chart-tabs">
                <span className="dbp-chart-tab">3 months</span>
                <span className="dbp-chart-tab">30 days</span>
                <span className="dbp-chart-tab active">7 days</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={130}>
              <AreaChart data={areaData} margin={{ top: 8, right: 0, left: -30, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a8e63d" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#a8e63d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.35)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.35)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: '#fff' }}
                  itemStyle={{ color: '#a8e63d' }}
                />
                <Area type="monotone" dataKey="score" stroke="#a8e63d" strokeWidth={2} fill="url(#scoreGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Skill Gaps List */}
          <div className="dbp-chart-card dbp-chart-narrow">
            <div className="dbp-chart-header">
              <span className="dbp-chart-title">Top Skill Gaps</span>
            </div>
            <div className="dbp-gaps-list">
              {SKILL_GAPS.map((g, i) => (
                <div className="dbp-gap-item" key={i}>
                  <div className="dbp-gap-header">
                    <span className="dbp-gap-name">{g.name}</span>
                    <span className={`dbp-gap-badge ${g.criticality.toLowerCase()}`}>{g.criticality}</span>
                  </div>
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill gap" style={{ width: `${g.gap}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
