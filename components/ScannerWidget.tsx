'use client';

import { useState } from 'react';

const SCANNER_URL = process.env.NEXT_PUBLIC_SCANNER_API_URL || 'https://seovalt-scanner.wearevalt.workers.dev/scan';

const loadingMessages = [
  'Scan des balises meta...',
  'Vérification du Schema.org...',
  'Analyse des images et balises ALT...',
  'Calcul du score SEO...',
];

export default function ScannerWidget() {
  const [url, setUrl] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'result' | 'error'>('idle');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [msgIndex, setMsgIndex] = useState(0);
  const [urlError, setUrlError] = useState('');

  const handleScan = async () => {
    setUrlError('');
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setUrlError('Entrez une URL valide (ex: https://monsite.com)');
      return;
    }
    setState('loading');
    setMsgIndex(0);
    const interval = setInterval(() => {
      setMsgIndex(i => (i + 1) % loadingMessages.length);
    }, 1500);
    try {
      const res = await fetch(SCANNER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
        signal: AbortSignal.timeout(15000),
      });
      const data = await res.json();
      clearInterval(interval);
      if (data.error) {
        setError(data.error);
        setState('error');
      } else {
        setResult(data);
        setState('result');
      }
    } catch {
      clearInterval(interval);
      setError('Site inaccessible ou trop lent.');
      setState('error');
    }
  };

  const scoreColor = (score: number) => {
    if (score <= 30) return '#ef4444';
    if (score <= 60) return '#f97316';
    if (score <= 80) return '#eab308';
    return '#22c55e';
  };

  const containerStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '32px 28px',
    maxWidth: '600px',
    margin: '0 auto',
    backdropFilter: 'blur(12px)',
  };

  if (state === 'idle') return (
    <div style={containerStyle}>
      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px', textAlign: 'center', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        Analyse gratuite
      </p>
      <h2 style={{ fontSize: '22px', fontWeight: 600, color: '#fff', textAlign: 'center', marginBottom: '24px', lineHeight: 1.3 }}>
        Voyez la santé SEO de votre site en 60 secondes
      </h2>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <input
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleScan()}
          placeholder="https://votresite.com"
          style={{
            flex: 1,
            padding: '14px 18px',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.06)',
            color: '#fff',
            fontSize: '15px',
            outline: 'none',
          }}
        />
        <button
          onClick={handleScan}
          style={{
            padding: '14px 22px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #00e5a0, #00c07f)',
            color: '#000',
            border: 'none',
            fontWeight: 700,
            fontSize: '15px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Analyser →
        </button>
      </div>
      {urlError && (
        <div style={{ color: '#ef4444', fontSize: '12px', marginBottom: '8px', paddingLeft: '4px' }}>
          {urlError}
        </div>
      )}
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '12px' }}>
        <span>✓ Gratuit</span>
        <span>✓ Aucune carte requise</span>
        <span>✓ Résultats immédiats</span>
      </div>
    </div>
  );

  if (state === 'loading') return (
    <div style={{ ...containerStyle, textAlign: 'center' }}>
      <div style={{ fontSize: '16px', color: '#00e5a0', marginBottom: '20px', fontWeight: 600 }}>
        ⚡ Analyse en cours...
      </div>
      <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '8px', height: '4px', marginBottom: '16px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, #00e5a0, #00c07f)',
          borderRadius: '8px',
          animation: 'progress 2s ease-in-out infinite',
          width: '60%',
        }} />
      </div>
      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
        {loadingMessages[msgIndex]}
      </div>
      <style>{`@keyframes progress { 0%{width:10%} 50%{width:80%} 100%{width:95%} }`}</style>
    </div>
  );

  if (state === 'error') return (
    <div style={{ ...containerStyle, textAlign: 'center' }}>
      <div style={{ fontSize: '16px', color: '#ef4444', marginBottom: '10px', fontWeight: 600 }}>
        ⚠️ Impossible d'analyser ce site
      </div>
      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>
        {error}
      </div>
      <button
        onClick={() => { setState('idle'); setUrl(''); }}
        style={{ padding: '10px 20px', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontSize: '13px' }}
      >
        Essayer une autre URL
      </button>
    </div>
  );

  if (state === 'result' && result) return (
    <div style={containerStyle}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginBottom: '10px', letterSpacing: '0.05em' }}>
          SCORE SEO — {result.url}
        </div>
        <div style={{ fontSize: '64px', fontWeight: 700, color: scoreColor(result.score), lineHeight: 1 }}>
          {result.score}
        </div>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', margin: '4px 0' }}>/ 100</div>
        <div style={{ fontSize: '13px', fontWeight: 700, color: scoreColor(result.score), letterSpacing: '0.15em' }}>
          {result.label}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
        {result.visibleErrors.map((err: any) => (
          <div key={err.id} style={{
            background: 'rgba(239,68,68,0.07)',
            border: '1px solid rgba(239,68,68,0.15)',
            borderRadius: '10px',
            padding: '12px 16px',
          }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#fca5a5', marginBottom: '3px' }}>
              ⚠️ {err.title}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
              {err.description}
            </div>
          </div>
        ))}
        {result.lockedErrors.length > 0 && (
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px dashed rgba(255,255,255,0.08)',
            borderRadius: '10px',
            padding: '12px 16px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.25)' }}>
              🔒 +{result.lockedErrors.length} autres erreurs détectées
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.15)', marginTop: '3px' }}>
              Débloquez tout avec Pro
            </div>
          </div>
        )}
      </div>

      
        href="/#pricing"
        style={{
          display: 'block',
          background: 'linear-gradient(135deg, #00e5a0, #00c07f)',
          color: '#000',
          textAlign: 'center',
          padding: '14px 20px',
          borderRadius: '10px',
          fontWeight: 700,
          fontSize: '15px',
          textDecoration: 'none',
          marginBottom: '10px',
        }}
      >
        {result.upgradeCta.sub}
      </a>
      <button
        onClick={() => { setState('idle'); setUrl(''); setResult(null); }}
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: '10px',
          background: 'transparent',
          color: 'rgba(255,255,255,0.25)',
          border: '1px solid rgba(255,255,255,0.06)',
          cursor: 'pointer',
          fontSize: '13px',
        }}
      >
        Scanner un autre site
      </button>
    </div>
  );

  return null;
}
