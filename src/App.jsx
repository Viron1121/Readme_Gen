import { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import FormPanel from './components/FormPanel';
import PreviewPanel from './components/PreviewPanel';
import { generateMarkdown } from './utils/generateMarkdown';
import './App.css';

const DEFAULT_DATA = {
  title: '',
  description: '',
  techStack: [],
  installation: '',
  usage: '',
  features: [],
  screenshotUrl: '',
  screenshotAlt: '',
  authorName: '',
  githubUsername: '',
  license: 'MIT',
  badges: ['license'],
  // Profile specific
  subtitle: '',
  currentlyLearning: '',
  collaborateOn: '',
  portfolioUrl: '',
  twitterUsername: '',
  linkedinUsername: '',
  showGithubStats: false,
  showTopLangs: false,
};

export default function App() {
  const [data, setData] = useState(DEFAULT_DATA);
  const [readmeType, setReadmeType] = useState('project'); // 'project' or 'profile'
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('rmg-dark');
    if (stored !== null) return stored === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('rmg-dark', darkMode);
  }, [darkMode]);

  const markdown = useMemo(() => generateMarkdown(data, readmeType), [data, readmeType]);

  return (
    <div className="app-layout">
      <Header darkMode={darkMode} onToggleDark={() => setDarkMode(d => !d)} />
      <div className="app-body">
        <FormPanel data={data} onChange={setData} readmeType={readmeType} setReadmeType={setReadmeType} />
        <PreviewPanel markdown={markdown} />
      </div>
    </div>
  );
}
