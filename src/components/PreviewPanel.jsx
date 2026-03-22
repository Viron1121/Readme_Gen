import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { saveAs } from 'file-saver';
import './PreviewPanel.css';

export default function PreviewPanel({ markdown }) {
  const [view, setView] = useState('rendered'); // 'rendered' | 'raw'
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement('textarea');
      el.value = markdown;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    saveAs(blob, 'README.md');
  };

  return (
    <div className="preview-panel">
      <div className="preview-header">
        <span className="preview-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          Preview
        </span>
        <div className="preview-controls">
          {/* View toggle */}
          <div className="view-toggle">
            <button
              id="view-rendered"
              className={`toggle-btn ${view === 'rendered' ? 'active' : ''}`}
              onClick={() => setView('rendered')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              Rendered
            </button>
            <button
              id="view-raw"
              className={`toggle-btn ${view === 'raw' ? 'active' : ''}`}
              onClick={() => setView('raw')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6"/>
                <polyline points="8 6 2 12 8 18"/>
              </svg>
              Raw
            </button>
          </div>

          {/* Copy button */}
          <button id="copy-btn" className={`action-btn ${copied ? 'success' : ''}`} onClick={handleCopy}>
            {copied ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Copy
              </>
            )}
          </button>

          {/* Download button */}
          <button id="download-btn" className="action-btn primary" onClick={handleDownload}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download
          </button>
        </div>
      </div>

      <div className="preview-body">
        {view === 'rendered' ? (
          <div className="markdown-rendered">
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              components={{
                code({ inline, className, children, ...props }) {
                  return inline ? (
                    <code className="inline-code" {...props}>{children}</code>
                  ) : (
                    <pre className="code-block">
                      <code {...props}>{children}</code>
                    </pre>
                  );
                },
                img({ src, alt }) {
                  return <img src={src} alt={alt} className="md-img" />;
                },
                a({ href, children }) {
                  return <a href={href} target="_blank" rel="noopener noreferrer" className="md-link">{children}</a>;
                },
              }}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="raw-view">
            <pre className="raw-code">{markdown}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
