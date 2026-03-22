import { getTechBadgeMd } from './techLogos.js';

const BADGE_URLS = {
  npm: (pkg, gh) => `[![npm version](https://img.shields.io/npm/v/${pkg}.svg?style=flat-square)](https://www.npmjs.com/package/${pkg})`,
  pypi: (pkg) => `[![PyPI version](https://img.shields.io/pypi/v/${pkg}.svg?style=flat-square)](https://pypi.org/project/${pkg}/)`,
  license: (pkg, gh, license) => `[![License: ${license}](https://img.shields.io/badge/License-${encodeURIComponent(license)}-blue.svg?style=flat-square)](https://opensource.org/licenses/${license})`,
  build: (pkg, gh) => `[![Build Status](https://img.shields.io/github/actions/workflow/status/${gh}/${pkg}/ci.yml?style=flat-square)](https://github.com/${gh}/${pkg}/actions)`,
  coverage: (pkg, gh) => `[![Coverage](https://img.shields.io/codecov/c/github/${gh}/${pkg}?style=flat-square)](https://codecov.io/gh/${gh}/${pkg})`,
  downloads: (pkg) => `[![Downloads](https://img.shields.io/npm/dm/${pkg}.svg?style=flat-square)](https://www.npmjs.com/package/${pkg})`,
  stars: (pkg, gh) => `[![GitHub Stars](https://img.shields.io/github/stars/${gh}/${pkg}?style=flat-square)](https://github.com/${gh}/${pkg}/stargazers)`,
  react: () => `[![React](https://img.shields.io/badge/React-18+-61DAFB.svg?style=flat-square&logo=react)](https://reactjs.org/)`,
};

function generateProjectMarkdown(data) {
  const lines = [];
  const pkg = data.title?.toLowerCase().replace(/\s+/g, '-') || 'my-project';
  const gh = data.githubUsername || 'username';

  // Badges
  if (data.badges?.length > 0) {
    const badgeRow = data.badges
      .filter(b => BADGE_URLS[b])
      .map(b => BADGE_URLS[b](pkg, gh, data.license))
      .join(' ');
    if (badgeRow) {
      lines.push(badgeRow);
      lines.push('');
    }
  }

  // Title
  lines.push(`# ${data.title || 'My Awesome Project'}`);
  lines.push('');

  // Description
  if (data.description) {
    lines.push(data.description);
    lines.push('');
  }

  // Screenshot
  if (data.screenshotUrl) {
    lines.push(`![${data.screenshotAlt || 'Screenshot'}](${data.screenshotUrl})`);
    lines.push('');
  }

  // Features
  if (data.features?.length > 0) {
    lines.push('## ✨ Features');
    lines.push('');
    data.features.forEach(f => lines.push(`- ${f}`));
    lines.push('');
  }

  // Tech Stack
  if (data.techStack?.length > 0) {
    lines.push('## 🛠️ Tech Stack');
    lines.push('');
    const badges = data.techStack.map(t => getTechBadgeMd(t)).join(' ');
    lines.push(badges);
    lines.push('');
  }

  // Installation
  if (data.installation) {
    lines.push('## 🚀 Getting Started');
    lines.push('');
    lines.push('### Installation');
    lines.push('');
    lines.push('```bash');
    lines.push(data.installation);
    lines.push('```');
    lines.push('');
  }

  // Usage
  if (data.usage) {
    lines.push('### Usage');
    lines.push('');
    lines.push('```bash');
    lines.push(data.usage);
    lines.push('```');
    lines.push('');
  }

  // Author
  if (data.authorName || data.githubUsername) {
    lines.push('## 👤 Author');
    lines.push('');
    if (data.authorName) lines.push(`**${data.authorName}**`);
    if (data.githubUsername) lines.push(`- GitHub: [@${data.githubUsername}](https://github.com/${data.githubUsername})`);
    lines.push('');
  }

  // License
  if (data.license) {
    lines.push('## 📄 License');
    lines.push('');
    lines.push(`This project is licensed under the **${data.license}** License.`);
    lines.push('');
  }

  // Footer
  lines.push('---');
  lines.push('');
  lines.push('*Made with ❤️ using [ReadMeGen](https://github.com/Viron1121/Readme_Gen)*');

  return lines.join('\n');
}

function generateProfileMarkdown(data) {
  const lines = [];
  const gh = data.githubUsername;

  // Title / Greeting
  const title = data.title || 'Hi there 👋';
  if (!title.trim().startsWith('<') && !title.trim().startsWith('#')) {
    lines.push(`# ${title}`);
  } else {
    lines.push(title);
  }

  // Subtitle
  if (data.subtitle) {
    if (!data.subtitle.startsWith('#')) {
      lines.push(`### ${data.subtitle}`);
    } else {
      lines.push(data.subtitle);
    }
  }
  lines.push('');

  // Description / Intro
  if (data.description) {
    lines.push(data.description);
    lines.push('');
  }

  // Current activity
  if (data.currentlyLearning || data.collaborateOn) {
    lines.push('---');
    lines.push('');
    if (data.currentlyLearning) lines.push(`- 🌱 I’m currently learning **${data.currentlyLearning}**`);
    if (data.collaborateOn) lines.push(`- 👯 I’m looking to collaborate on **${data.collaborateOn}**`);
    lines.push('');
  }

  // Tech Stack / Skills
  if (data.techStack?.length > 0) {
    lines.push('---');
    lines.push('### 🛠️ Languages and Tools:');
    lines.push('');
    const badges = data.techStack.map(t => getTechBadgeMd(t)).join(' ');
    lines.push(badges);
    lines.push('');
  }

  // GitHub Stats — shown as simple markdown images (compatible with GitHub README)
  if (gh && (data.showGithubStats || data.showTopLangs)) {
    lines.push('---');
    lines.push('### 📊 GitHub Stats:');
    lines.push('');
    if (data.showGithubStats) {
      lines.push(`![${gh}'s GitHub Stats](https://github-readme-stats.vercel.app/api?username=${gh}&show_icons=true&theme=tokyonight)`);
    }
    if (data.showTopLangs) {
      lines.push(`![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=${gh}&layout=compact&theme=tokyonight)`);
    }
    lines.push('');
  }

  // Socials / Connect
  const socials = gh || data.twitterUsername || data.linkedinUsername || data.portfolioUrl;
  if (socials) {
    lines.push('---');
    lines.push('### 📫 Connect with me:');
    lines.push('');
    if (data.portfolioUrl) lines.push(`- 🌐 **Portfolio:** [${data.portfolioUrl}](${data.portfolioUrl})`);
    if (gh) lines.push(`- 🐙 **GitHub:** [@${gh}](https://github.com/${gh})`);
    if (data.linkedinUsername) lines.push(`- 💼 **LinkedIn:** [${data.linkedinUsername}](https://linkedin.com/in/${data.linkedinUsername})`);
    if (data.twitterUsername) lines.push(`- 🐦 **Twitter:** [@${data.twitterUsername}](https://twitter.com/${data.twitterUsername})`);
    lines.push('');
  }

  // Footer — plain markdown, no raw HTML
  lines.push('---');
  lines.push('');
  lines.push('*Generated with ❤️ by [ReadMeGen](https://github.com)*');

  return lines.join('\n');
}

export function generateMarkdown(data, type = 'project') {
  if (type === 'profile') {
    return generateProfileMarkdown(data);
  }
  return generateProjectMarkdown(data);
}
