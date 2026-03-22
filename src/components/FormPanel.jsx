import { useState, useRef } from 'react';
import { ALL_TECH_NAMES, getTechBadgeUrl, TECH_LOGOS } from '../utils/techLogos.js';
import './FormPanel.css';

const TEMPLATES = {
  'Node.js Library': {
    title: 'awesome-node-lib',
    description: 'A blazing-fast Node.js library for handling async operations with ease.',
    techStack: ['Node.js', 'TypeScript', 'Jest'],
    installation: 'npm install awesome-node-lib',
    usage: "const lib = require('awesome-node-lib');\nlib.doSomething();",
    features: ['Async support', 'TypeScript types', 'Zero dependencies'],
    authorName: 'John Doe',
    githubUsername: 'johndoe',
    license: 'MIT',
    badges: ['npm', 'license', 'build'],
  },
  'React App': {
    title: 'my-react-app',
    description: 'A modern React application built with Vite, TypeScript, and Tailwind CSS.',
    techStack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS'],
    installation: 'npm install\nnpm run dev',
    usage: 'Open http://localhost:5173 in your browser.',
    features: ['Fast HMR', 'TypeScript support', 'Responsive design'],
    authorName: 'Jane Smith',
    githubUsername: 'janesmith',
    license: 'MIT',
    badges: ['react', 'license', 'build'],
  },
  'Python Package': {
    title: 'pypackage',
    description: 'A Python package that makes data processing simple and efficient.',
    techStack: ['Python', 'Poetry', 'pytest'],
    installation: 'pip install pypackage',
    usage: 'import pypackage\npypackage.process(data)',
    features: ['Easy installation', 'Comprehensive docs', 'High test coverage'],
    authorName: 'Alex Dev',
    githubUsername: 'alexdev',
    license: 'Apache 2.0',
    badges: ['pypi', 'license', 'coverage'],
  },
};

const LICENSES = ['MIT', 'Apache 2.0', 'GPL-3.0', 'BSD-2-Clause', 'BSD-3-Clause', 'ISC', 'MPL-2.0', 'Unlicense'];
const BADGE_OPTIONS = [
  { id: 'npm', label: 'NPM Version' },
  { id: 'pypi', label: 'PyPI Version' },
  { id: 'license', label: 'License' },
  { id: 'build', label: 'Build Status' },
  { id: 'coverage', label: 'Coverage' },
  { id: 'downloads', label: 'Downloads' },
  { id: 'stars', label: 'Stars' },
  { id: 'react', label: 'React' },
];

function Section({ title, icon, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="form-section">
      <button className="section-header" onClick={() => setOpen(o => !o)}>
        <div className="section-title-row">
          <span className="section-icon">{icon}</span>
          <span className="section-title">{title}</span>
        </div>
        <span className={`section-chevron ${open ? 'open' : ''}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </span>
      </button>
      {open && <div className="section-body">{children}</div>}
    </div>
  );
}

function Field({ label, hint, required, children }) {
  return (
    <div className="field">
      <label className="field-label">
        {label}
        {required && <span className="required-dot">*</span>}
      </label>
      {children}
      {hint && <span className="field-hint">{hint}</span>}
    </div>
  );
}

export default function FormPanel({ data, onChange, readmeType, setReadmeType }) {
  const [techInput, setTechInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [featureInput, setFeatureInput] = useState('');
  const techRef = useRef(null);

  const handleTemplate = (e) => {
    const tpl = TEMPLATES[e.target.value];
    if (tpl) onChange({ ...data, ...tpl });
  };

  const addTech = (val = techInput.trim()) => {
    if (val && !data.techStack.includes(val)) {
      onChange({ ...data, techStack: [...data.techStack, val] });
    }
    setTechInput('');
    setShowSuggestions(false);
  };

  const filteredSuggestions = techInput.trim().length > 0
    ? ALL_TECH_NAMES.filter(
        n => n.toLowerCase().includes(techInput.toLowerCase()) && !data.techStack.includes(n)
      ).slice(0, 8)
    : [];

  const removeTech = (t) => onChange({ ...data, techStack: data.techStack.filter(x => x !== t) });

  const addFeature = () => {
    const val = featureInput.trim();
    if (val) {
      onChange({ ...data, features: [...data.features, val] });
    }
    setFeatureInput('');
  };

  const removeFeature = (i) => onChange({ ...data, features: data.features.filter((_, idx) => idx !== i) });

  const updateFeature = (i, val) => {
    const updated = [...data.features];
    updated[i] = val;
    onChange({ ...data, features: updated });
  };

  const toggleBadge = (id) => {
    const badges = data.badges.includes(id)
      ? data.badges.filter(b => b !== id)
      : [...data.badges, id];
    onChange({ ...data, badges });
  };

  const renderTechStack = () => (
    <Section title={readmeType === 'project' ? 'Tech Stack' : 'Languages & Tools'} icon="⚡">
      <Field label="Add Technologies" hint="Search or type a technology name">
        <div className="tech-autocomplete" ref={techRef}>
          <div className="input-with-btn">
            <input
              id="tech-input"
              className="input"
              type="text"
              placeholder="Search: React, Python, Docker..."
              value={techInput}
              autoComplete="off"
              onChange={e => { setTechInput(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              onKeyDown={e => {
                if (e.key === 'Enter') { e.preventDefault(); addTech(); }
                if (e.key === 'Escape') setShowSuggestions(false);
              }}
            />
            <button className="icon-btn" onClick={() => addTech()} title="Add">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
          </div>
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {filteredSuggestions.map(name => (
                <button
                  key={name}
                  className="suggestion-item"
                  onMouseDown={() => addTech(name)}
                >
                  <img
                    className="suggestion-logo"
                    src={getTechBadgeUrl(name)}
                    alt={name}
                    loading="lazy"
                  />
                  <span>{name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        {data.techStack.length > 0 && (
          <div className="tag-list">
            {data.techStack.map(t => (
              <span key={t} className="tag tag-logo">
                {TECH_LOGOS[t] && (
                  <img
                    src={`https://cdn.simpleicons.org/${TECH_LOGOS[t].logo}/ffffff`}
                    alt=""
                    className="tag-logo-img"
                    loading="lazy"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                )}
                {t}
                <button className="tag-remove" onClick={() => removeTech(t)}>×</button>
              </span>
            ))}
          </div>
        )}
      </Field>
    </Section>
  );

  return (
    <div className="form-panel">
      <div className="type-switcher">
        <button 
          className={`type-tab ${readmeType === 'project' ? 'active' : ''}`} 
          onClick={() => setReadmeType('project')}
        >
          🚀 Project
        </button>
        <button 
          className={`type-tab ${readmeType === 'profile' ? 'active' : ''}`} 
          onClick={() => setReadmeType('profile')}
        >
          👤 Profile
        </button>
      </div>

      {readmeType === 'project' && (
        <>
          <div className="quick-start-card">
            <div className="quick-start-left">
              <div className="quick-start-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
              </div>
              <div>
                <div className="quick-start-title">Quick Start</div>
                <div className="quick-start-sub">Choose a template to get started faster</div>
              </div>
            </div>
            <select className="template-select" onChange={handleTemplate} defaultValue="">
              <option value="" disabled>Select template</option>
              {Object.keys(TEMPLATES).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="form-sections">
            <Section title="Basic Information" icon="📋" defaultOpen={true}>
              <Field label="Project Title" required hint="">
                <input
                  id="project-title"
                  className="input"
                  type="text"
                  placeholder="My Awesome Project"
                  value={data.title}
                  onChange={e => onChange({ ...data, title: e.target.value })}
                />
              </Field>
              <Field label="Description" required hint="Explain what your project does and why it's useful">
                <textarea
                  id="project-desc"
                  className="textarea"
                  placeholder="A brief description of your project..."
                  rows={4}
                  value={data.description}
                  onChange={e => onChange({ ...data, description: e.target.value })}
                />
              </Field>
            </Section>

            {renderTechStack()}

            <Section title="Installation & Usage" icon="🔧">
              <Field label="Installation Steps" hint="Commands to install and set up your project">
                <textarea
                  id="install-steps"
                  className="textarea code-textarea"
                  placeholder="npm install&#10;npm start"
                  rows={4}
                  value={data.installation}
                  onChange={e => onChange({ ...data, installation: e.target.value })}
                />
              </Field>
              <Field label="Usage" hint="How to run/use your project">
                <textarea
                  id="usage"
                  className="textarea code-textarea"
                  placeholder="npm run dev"
                  rows={3}
                  value={data.usage}
                  onChange={e => onChange({ ...data, usage: e.target.value })}
                />
              </Field>
            </Section>

            <Section title="Features" icon="✨">
              <div className="features-list">
                {data.features.map((f, i) => (
                  <div key={i} className="feature-row">
                    <input
                      className="input"
                      type="text"
                      value={f}
                      onChange={e => updateFeature(i, e.target.value)}
                      placeholder="Enter a feature..."
                    />
                    <button className="danger-btn" onClick={() => removeFeature(i)}>×</button>
                  </div>
                ))}
                <button className="add-feature-btn" onClick={addFeature}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Add Feature
                </button>
              </div>
            </Section>

            <Section title="Screenshots" icon="📸" defaultOpen={false}>
              <Field label="Screenshot URL" hint="Link to a screenshot or demo GIF">
                <input
                  id="screenshot-url"
                  className="input"
                  type="text"
                  placeholder="https://example.com/screenshot.png"
                  value={data.screenshotUrl || ''}
                  onChange={e => onChange({ ...data, screenshotUrl: e.target.value })}
                />
              </Field>
              <Field label="Screenshot Alt Text" hint="">
                <input
                  id="screenshot-alt"
                  className="input"
                  type="text"
                  placeholder="App Screenshot"
                  value={data.screenshotAlt || ''}
                  onChange={e => onChange({ ...data, screenshotAlt: e.target.value })}
                />
              </Field>
            </Section>

            <Section title="Author & License" icon="👤">
              <Field label="Author Name" hint="">
                <input
                  id="author-name"
                  className="input"
                  type="text"
                  placeholder="John Doe"
                  value={data.authorName}
                  onChange={e => onChange({ ...data, authorName: e.target.value })}
                />
              </Field>
              <Field label="GitHub Username" hint="">
                <input
                  id="github-username"
                  className="input"
                  type="text"
                  placeholder="johndoe"
                  value={data.githubUsername}
                  onChange={e => onChange({ ...data, githubUsername: e.target.value })}
                />
              </Field>
              <Field label="License" hint="">
                <select
                  id="license"
                  className="input select-input"
                  value={data.license}
                  onChange={e => onChange({ ...data, license: e.target.value })}
                >
                  {LICENSES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </Field>
            </Section>

            <Section title="Badges" icon="🏷️" defaultOpen={false}>
              <div className="badge-grid">
                {BADGE_OPTIONS.map(b => (
                  <label key={b.id} className={`badge-toggle ${data.badges.includes(b.id) ? 'active' : ''}`}>
                    <input
                      type="checkbox"
                      checked={data.badges.includes(b.id)}
                      onChange={() => toggleBadge(b.id)}
                      style={{ display: 'none' }}
                    />
                    {b.label}
                  </label>
                ))}
              </div>
            </Section>
          </div>
        </>
      )}

      {readmeType === 'profile' && (
        <div className="form-sections" style={{ paddingTop: 0 }}>
          <Section title="Introduction" icon="👋" defaultOpen={true}>
            <Field label="Name / Greeting" hint="e.g. Hi, I'm John Doe 👋">
              <input
                className="input"
                type="text"
                placeholder="Hi, I'm John Doe 👋"
                value={data.title}
                onChange={e => onChange({ ...data, title: e.target.value })}
              />
            </Field>
            <Field label="Subtitle" hint="e.g. A passionate frontend developer from somewhere">
              <input
                className="input"
                type="text"
                placeholder="A passionate frontend developer from Planet Earth"
                value={data.subtitle}
                onChange={e => onChange({ ...data, subtitle: e.target.value })}
              />
            </Field>
            <Field label="About Me / Bio" hint="Write a short intro">
              <textarea
                className="textarea"
                placeholder="I love to build modern web applications..."
                rows={4}
                value={data.description}
                onChange={e => onChange({ ...data, description: e.target.value })}
              />
            </Field>
          </Section>

          {renderTechStack()}

          <Section title="What I'm doing" icon="🔭">
            <Field label="Currently Learning" hint="e.g. Rust, Go, Next.js">
              <input
                className="input"
                type="text"
                placeholder="Rust, Go, Next.js"
                value={data.currentlyLearning}
                onChange={e => onChange({ ...data, currentlyLearning: e.target.value })}
              />
            </Field>
            <Field label="Looking to collaborate on" hint="e.g. Open Source Projects">
              <input
                className="input"
                type="text"
                placeholder="Open Source Projects"
                value={data.collaborateOn}
                onChange={e => onChange({ ...data, collaborateOn: e.target.value })}
              />
            </Field>
          </Section>

          <Section title="Social & Connect" icon="🌐">
            <Field label="GitHub Username" required hint="Required for stats">
              <input
                className="input"
                type="text"
                placeholder="johndoe"
                value={data.githubUsername}
                onChange={e => onChange({ ...data, githubUsername: e.target.value })}
              />
            </Field>
            <Field label="Portfolio URL" hint="">
              <input
                className="input"
                type="url"
                placeholder="https://johndoe.com"
                value={data.portfolioUrl}
                onChange={e => onChange({ ...data, portfolioUrl: e.target.value })}
              />
            </Field>
            <Field label="Twitter / X Username" hint="">
              <input
                className="input"
                type="text"
                placeholder="johndoe"
                value={data.twitterUsername}
                onChange={e => onChange({ ...data, twitterUsername: e.target.value })}
              />
            </Field>
            <Field label="LinkedIn Username" hint="">
              <input
                className="input"
                type="text"
                placeholder="johndoe"
                value={data.linkedinUsername}
                onChange={e => onChange({ ...data, linkedinUsername: e.target.value })}
              />
            </Field>
          </Section>

          <Section title="GitHub Add-ons" icon="📊" defaultOpen={true}>
            <div className="badge-grid">
              <label className={`badge-toggle ${data.showGithubStats ? 'active' : ''}`}>
                <input
                  type="checkbox"
                  checked={data.showGithubStats}
                  onChange={e => onChange({ ...data, showGithubStats: e.target.checked })}
                  style={{ display: 'none' }}
                />
                GitHub Stats
              </label>
              <label className={`badge-toggle ${data.showTopLangs ? 'active' : ''}`}>
                <input
                  type="checkbox"
                  checked={data.showTopLangs}
                  onChange={e => onChange({ ...data, showTopLangs: e.target.checked })}
                  style={{ display: 'none' }}
                />
                Top Languages
              </label>
            </div>
            {(!data.githubUsername && (data.showGithubStats || data.showTopLangs)) && (
              <div className="field-hint" style={{ color: 'var(--accent-rose)', marginTop: '8px' }}>
                Please enter your GitHub Username above to view stats.
              </div>
            )}
          </Section>
        </div>
      )}

      <div className="form-footer">Built for developers ✨</div>
    </div>
  );
}
