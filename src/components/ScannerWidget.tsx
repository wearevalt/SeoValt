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

  if (state === 'idle') return (
    <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '28px 24px', maxWidth: 580, margin: '32px auto' }}>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 8, textAlign: 'center' }}>
        Analysez votre site gratuitement — résultats en 60 secondes
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleScan()}
          placeholder="https://votresite.com"
          style={{ flex: 1, padding: '12px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.07)', color: '#fff', fontSize: 14, outline: 'none' }}
        />
        <button
          onClick={handleScan}
          style={{ padding: '12px 20px', borderRadius: 10, background: '#0ea5e9', color: '#fff', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          Analyser →
        </button>
      </div>
      {urlError && <div style={{ color: '#ef4444', fontSize: 12, marginBottom: 8 }}>{urlError}</div>}
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
        <span>✓ Gratuit</span>
        <span>✓ Aucune carte</span>
        <span>✓ Résultats immédiats</span>
      </div>
    </div>
  );

  if (state === 'loading') return (
    <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '28px 24px', maxWidth: 580, margin: '32px auto', textAlign: 'center' }}>
      <div style={{ fontSize: 15, color: '#fff', marginBottom: 16 }}>⚡ Analyse en cours...</div>
      <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, height: 6, marginBottom: 12, overflow: 'hidden' }}>
        <div style={{ height: '100%', background: '#0ea5e9', borderRadius: 8, animation: 'progress 2s ease-in-out infinite', width: '60%' }} />
      </div>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{loadingMessages[msgIndex]}</div>
      <style>{`@keyframes progress { 0%{width:10%} 50%{width:80%} 100%{width:95%} }`}</style>
    </div>
  );

  if (state === 'error') return (
    <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '28px 24px', maxWidth: 580, margin: '32px auto', textAlign: 'center' }}>
      <div style={{ fontSize: 15, color: '#ef4444', marginBottom: 8 }}>⚠️ Impossible d'analyser ce site</div>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>{error}</div>
      <button onClick={() => { setState('idle'); setUrl(''); }} style={{ padding: '10px 20px', borderRadius: 10, background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13 }}>
        Essayer une autre URL
      </button>
    </div>
  );

  if (state === 'result' && result) return (
    <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '28px 24px', maxWidth: 580, margin: '32px auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>Score SEO de {result.url}</div>
        <div style={{ fontSize: 56, fontWeight: 700, color: scoreColor(result.score), lineHeight: 1 }}>{result.score}</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>/ 100</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: scoreColor(result.score), letterSpacing: 2 }}>{result.label}</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {result.visibleErrors.map((err: any) => (
          <div key={err.id} style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 14px' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fca5a5', marginBottom: 2 }}>⚠️ {err.title}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{err.description}</div>
          </div>
        ))}
        {result.lockedErrors.length > 0 && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>🔒 +{result.lockedErrors.length} autres erreurs détectées</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 2 }}>Débloquez avec Pro pour tout voir</div>
          </div>
        )}
      </div>

      <a href="/#pricing" style={{ display: 'block', background: '#0ea5e9', color: '#fff', textAlign: 'center', padding: '13px 20px', borderRadius: 10, fontWeight: 600, fontSize: 14, textDecoration: 'none', marginBottom: 8 }}>
        {result.upgradeCta.sub}
      </a>
      <button onClick={() => { setState('idle'); setUrl(''); setResult(null); }} style={{ width: '100%', padding: '10px', borderRadius: 10, background: 'transparent', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', fontSize: 13 }}>
        Scanner un autre site
      </button>
    </div>
  );

  return null;
}
