import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, X, ArrowRight, ChevronDown, Briefcase, Sparkles } from 'lucide-react'
import Navbar from '../components/Navbar'
import AnimatedBackground from '../components/AnimatedBackground'
import './Analyze.css'

const SKILL_CATEGORIES = {
  'Frontend': ['React', 'Vue.js', 'Angular', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Next.js', 'Tailwind CSS', 'Redux', 'GraphQL'],
  'Backend': ['Node.js', 'Python', 'Java', 'Go', 'Express.js', 'FastAPI', 'Django', 'Spring Boot', 'REST APIs', 'PostgreSQL', 'MongoDB'],
  'DevOps / Cloud': ['AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Linux', 'GitHub Actions'],
  'Data / AI': ['Python', 'SQL', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'Data Visualization', 'LLMs', 'NLP'],
  'Mobile': ['React Native', 'Flutter', 'iOS (Swift)', 'Android (Kotlin)', 'Expo'],
  'Soft Skills': ['Communication', 'Leadership', 'Agile / Scrum', 'Problem Solving', 'Mentoring', 'Technical Writing'],
}

const ROLES = [
  'Senior Frontend Engineer',
  'Full Stack Developer',
  'Backend Engineer',
  'DevOps / SRE Engineer',
  'Data Scientist',
  'ML Engineer',
  'Product Manager',
  'Engineering Manager',
  'Mobile Developer',
  'Cloud Architect',
]

const EXPERIENCE_LEVELS = ['Student / Intern', 'Junior (0-2 yrs)', 'Mid-Level (2-5 yrs)', 'Senior (5-8 yrs)', 'Staff / Lead (8+ yrs)']

export default function Analyze() {
  const navigate = useNavigate()
  const [selectedSkills, setSelectedSkills] = useState([])
  const [customSkill, setCustomSkill] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [customRole, setCustomRole] = useState('')
  const [experienceLevel, setExperienceLevel] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [activeCategory, setActiveCategory] = useState('Frontend')
  const [step, setStep] = useState(1)

  const toggleSkill = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    )
  }

  const addCustomSkill = () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills(prev => [...prev, customSkill.trim()])
      setCustomSkill('')
    }
  }

  const canProceedStep1 = selectedSkills.length >= 3
  const canProceedStep2 = (targetRole || customRole) && experienceLevel

  const handleAnalyze = () => {
    navigate('/results', {
      state: {
        skills: selectedSkills,
        role: customRole || targetRole,
        experience: experienceLevel,
        jobDescription,
      }
    })
  }

  return (
    <div className="analyze-page">
      <AnimatedBackground variant="light" particles={false} grid={true} />
      <Navbar />

      <div className="analyze-layout">
        {/* Left Panel */}
        <aside className="analyze-sidebar">
          <div className="analyze-sidebar-inner">
            <div className="analyze-progress-label">Your Progress</div>

            {[1, 2, 3].map(s => (
              <div key={s} className={`progress-step ${step === s ? 'active' : step > s ? 'done' : ''}`}>
                <div className="progress-step-num">{step > s ? '✓' : s}</div>
                <div>
                  <div className="progress-step-title">
                    {s === 1 ? 'Your Skills' : s === 2 ? 'Target Role' : 'Review & Analyze'}
                  </div>
                  <div className="progress-step-desc">
                    {s === 1 ? 'Select skills you have' : s === 2 ? 'Where do you want to go?' : 'Generate your gap report'}
                  </div>
                </div>
              </div>
            ))}

            {/* Selected skills summary */}
            {selectedSkills.length > 0 && (
              <div className="analyze-selected-summary">
                <div className="analyze-summary-label">{selectedSkills.length} Skills Selected</div>
                <div className="analyze-summary-tags">
                  {selectedSkills.slice(0, 6).map(s => (
                    <span key={s} className="skill-tag active" style={{ fontSize: 11, padding: '3px 10px' }}>
                      {s}
                    </span>
                  ))}
                  {selectedSkills.length > 6 && (
                    <span className="skill-tag" style={{ fontSize: 11, padding: '3px 10px' }}>
                      +{selectedSkills.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Panel */}
        <main className="analyze-main">

          {/* ── STEP 1: Your Skills ──────────────────── */}
          {step === 1 && (
            <div className="analyze-step">
              <div className="analyze-step-header">
                <p className="section-label">Step 1 of 3</p>
                <h1 className="analyze-step-title">What skills do you currently have?</h1>
                <p className="analyze-step-desc">
                  Select all technologies, tools, and competencies you're comfortable with.
                  Be honest — this helps generate accurate gap analysis.
                </p>
              </div>

              {/* Category Tabs */}
              <div className="skill-category-tabs">
                {Object.keys(SKILL_CATEGORIES).map(cat => (
                  <button
                    key={cat}
                    className={`skill-cat-tab ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Skill Chips */}
              <div className="skill-chips-grid">
                {SKILL_CATEGORIES[activeCategory].map(skill => (
                  <button
                    key={skill}
                    className={`skill-tag ${selectedSkills.includes(skill) ? 'active' : ''}`}
                    onClick={() => toggleSkill(skill)}
                  >
                    {selectedSkills.includes(skill) && <span style={{ color: 'var(--accent)' }}>✓</span>}
                    {skill}
                  </button>
                ))}
              </div>

              {/* Custom skill input */}
              <div className="custom-skill-row">
                <input
                  className="input-field"
                  placeholder="Add a custom skill (e.g., Figma, Rust, Kafka)…"
                  value={customSkill}
                  onChange={e => setCustomSkill(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addCustomSkill()}
                  style={{ flex: 1 }}
                />
                <button className="btn btn-accent" onClick={addCustomSkill} style={{ flexShrink: 0, borderRadius: 12 }}>
                  <Plus size={18} />
                  Add
                </button>
              </div>

              {/* Selected chips with remove */}
              {selectedSkills.length > 0 && (
                <div className="selected-skills-section">
                  <p className="input-label">Selected Skills ({selectedSkills.length})</p>
                  <div className="selected-skills-wrap">
                    {selectedSkills.map(s => (
                      <span key={s} className="skill-tag active">
                        {s}
                        <button
                          className="skill-remove"
                          onClick={() => toggleSkill(s)}
                          aria-label={`Remove ${s}`}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="analyze-step-footer">
                {!canProceedStep1 && (
                  <p className="analyze-hint">Select at least 3 skills to continue</p>
                )}
                <button
                  className="btn btn-primary"
                  onClick={() => setStep(2)}
                  disabled={!canProceedStep1}
                  style={{ opacity: canProceedStep1 ? 1 : 0.4, padding: '14px 14px 14px 24px' }}
                >
                  <span>Continue to Target Role</span>
                  <div className="btn-icon"><ArrowRight size={16} /></div>
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Target Role ──────────────────── */}
          {step === 2 && (
            <div className="analyze-step">
              <div className="analyze-step-header">
                <p className="section-label">Step 2 of 3</p>
                <h1 className="analyze-step-title">Where do you want to go?</h1>
                <p className="analyze-step-desc">
                  Select your target role and experience level so we can benchmark
                  you against real industry expectations.
                </p>
              </div>

              {/* Role Selection */}
              <div className="form-group">
                <label className="input-label">Target Role</label>
                <div className="role-grid">
                  {ROLES.map(role => (
                    <button
                      key={role}
                      className={`role-card ${targetRole === role ? 'active' : ''}`}
                      onClick={() => { setTargetRole(role); setCustomRole('') }}
                    >
                      <Briefcase size={14} />
                      <span>{role}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="input-label">Or enter a custom role / paste job title</label>
                <input
                  className="input-field"
                  placeholder="e.g., Principal Platform Engineer, AI Product Manager…"
                  value={customRole}
                  onChange={e => { setCustomRole(e.target.value); setTargetRole('') }}
                />
              </div>

              <div className="form-group">
                <label className="input-label">Your Current Experience Level</label>
                <div className="exp-grid">
                  {EXPERIENCE_LEVELS.map(lvl => (
                    <button
                      key={lvl}
                      className={`exp-card ${experienceLevel === lvl ? 'active' : ''}`}
                      onClick={() => setExperienceLevel(lvl)}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="input-label">Job Description (optional but recommended)</label>
                <textarea
                  className="input-field"
                  placeholder="Paste the full job description here for more precise analysis…"
                  value={jobDescription}
                  onChange={e => setJobDescription(e.target.value)}
                  rows={5}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div className="analyze-step-footer">
                <button
                  className="btn"
                  onClick={() => setStep(1)}
                  style={{ color: 'var(--text-secondary)', background: 'var(--bg-off)', borderRadius: 999 }}
                >
                  ← Back
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => setStep(3)}
                  disabled={!canProceedStep2}
                  style={{ opacity: canProceedStep2 ? 1 : 0.4, padding: '14px 14px 14px 24px' }}
                >
                  <span>Review & Analyze</span>
                  <div className="btn-icon"><ArrowRight size={16} /></div>
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Review ───────────────────────── */}
          {step === 3 && (
            <div className="analyze-step">
              <div className="analyze-step-header">
                <p className="section-label">Step 3 of 3</p>
                <h1 className="analyze-step-title">Ready to generate your report?</h1>
                <p className="analyze-step-desc">
                  Review your inputs below before we analyze your skill gaps.
                </p>
              </div>

              <div className="review-cards">
                <div className="review-card">
                  <div className="review-card-label">Target Role</div>
                  <div className="review-card-value">{customRole || targetRole}</div>
                  <div className="review-card-sub">{experienceLevel}</div>
                </div>
                <div className="review-card">
                  <div className="review-card-label">Your Skills ({selectedSkills.length})</div>
                  <div className="selected-skills-wrap" style={{ marginTop: 12 }}>
                    {selectedSkills.map(s => (
                      <span key={s} className="skill-tag active" style={{ fontSize: 12 }}>{s}</span>
                    ))}
                  </div>
                </div>
                {jobDescription && (
                  <div className="review-card">
                    <div className="review-card-label">Job Description</div>
                    <p className="review-card-jd">{jobDescription.substring(0, 200)}{jobDescription.length > 200 ? '…' : ''}</p>
                  </div>
                )}
              </div>

              <div className="analyze-step-footer">
                <button
                  className="btn"
                  onClick={() => setStep(2)}
                  style={{ color: 'var(--text-secondary)', background: 'var(--bg-off)', borderRadius: 999 }}
                >
                  ← Back
                </button>
                <button
                  className="btn btn-accent"
                  onClick={handleAnalyze}
                  style={{ fontSize: 16, padding: '15px 15px 15px 28px' }}
                >
                  <Sparkles size={18} />
                  <span>Generate Gap Report</span>
                  <div className="btn-icon" style={{ background: 'rgba(0,0,0,0.15)', color: '#fff' }}>
                    <ArrowRight size={16} />
                  </div>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
