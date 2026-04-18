const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

interface ScanResult {
  score: number;
  label: string;
  url: string;
  scannedAt: string;
  totalErrors: number;
  visibleErrors: ErrorItem[];
  lockedErrors: LockedItem[];
  upgradeCta: UpgradeCta;
}

interface ErrorItem {
  id: string;
  type: string;
  title: string;
  description: string;
  impact: string;
  locked: boolean;
}

interface LockedItem {
  id: string;
  title: string;
  locked: boolean;
}

interface UpgradeCta {
  message: string;
  sub: string;
  url: string;
}

export default {
  async fetch(request: Request): Promise<Response> {

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Méthode non autorisée' }), {
        status: 405,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    let body: { url?: string };
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Body JSON invalide' }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    const rawUrl = body.url?.trim();
    if (!rawUrl || (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://'))) {
      return new Response(JSON.stringify({ error: 'URL invalide' }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    let html = '';
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(rawUrl, {
        signal: controller.signal,
        headers: { 'User-Agent': 'SEOVALT-Scanner/1.0' },
      });
      clearTimeout(timeout);
      html = await res.text();
    } catch {
      return new Response(JSON.stringify({ error: 'Site inaccessible ou trop lent' }), {
        status: 422,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    const errors: ErrorItem[] = [];
    let totalPoints = 0;

    // CHECK 1 — Title
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const title = titleMatch?.[1]?.trim() ?? '';
    if (!title) {
      errors.push({ id: 'missing-title', type: 'CRITIQUE', title: 'Balise Title absente', description: 'Votre page n\'a pas de titre. Google ne sait pas comment vous référencer.', impact: 'Élevé', locked: false });
    } else if (title.length < 30 || title.length > 60) {
      totalPoints += 5;
      errors.push({ id: 'bad-title-length', type: 'WARNING', title: 'Title trop court ou trop long', description: `Votre title fait ${title.length} caractères. L'idéal est entre 30 et 60.`, impact: 'Moyen', locked: false });
    } else {
      totalPoints += 10;
    }

    // CHECK 2 — Meta description
    const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i)
      ?? html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i);
    const metaDesc = metaDescMatch?.[1]?.trim() ?? '';
    if (!metaDesc) {
      errors.push({ id: 'missing-meta-description', type: 'CRITIQUE', title: 'Meta description absente', description: 'Google ne sait pas quoi afficher dans les résultats de recherche pour votre site.', impact: 'Élevé', locked: false });
    } else if (metaDesc.length < 80 || metaDesc.length > 160) {
      totalPoints += 5;
      errors.push({ id: 'bad-meta-length', type: 'WARNING', title: 'Meta description trop courte ou trop longue', description: `Votre meta description fait ${metaDesc.length} caractères. L'idéal est entre 80 et 160.`, impact: 'Moyen', locked: false });
    } else {
      totalPoints += 10;
    }

    // CHECK 3 — H1
    const h1Matches = html.match(/<h1[^>]*>/gi) ?? [];
    if (h1Matches.length === 0) {
      errors.push({ id: 'missing-h1', type: 'CRITIQUE', title: 'Balise H1 manquante', description: 'Votre page n\'a pas de titre principal. Google et les IA ne peuvent pas identifier votre sujet principal.', impact: 'Élevé', locked: false });
    } else if (h1Matches.length > 1) {
      totalPoints += 5;
      errors.push({ id: 'multiple-h1', type: 'WARNING', title: 'Plusieurs H1 détectés', description: `Vous avez ${h1Matches.length} balises H1. Il ne doit y en avoir qu'une seule.`, impact: 'Moyen', locked: false });
    } else {
      totalPoints += 10;
    }

    // CHECK 4 — Images sans ALT
    const imgTags = html.match(/<img[^>]*>/gi) ?? [];
    const imgsWithoutAlt = imgTags.filter(img => !img.match(/alt=["'][^"']+["']/i));
    if (imgsWithoutAlt.length > 3) {
      errors.push({ id: 'images-missing-alt', type: 'CRITIQUE', title: 'Images sans balise ALT', description: `${imgsWithoutAlt.length} images sans texte ALT. Google et les IA ne peuvent pas comprendre vos images.`, impact: 'Élevé', locked: false });
    } else if (imgsWithoutAlt.length > 0) {
      totalPoints += 5;
      errors.push({ id: 'some-images-missing-alt', type: 'WARNING', title: 'Quelques images sans ALT', description: `${imgsWithoutAlt.length} image(s) sans texte ALT détectée(s).`, impact: 'Moyen', locked: false });
    } else {
      totalPoints += 10;
    }

    // CHECK 5 — HTTPS
    if (rawUrl.startsWith('http://')) {
      errors.push({ id: 'no-https', type: 'CRITIQUE', title: 'Site non sécurisé (HTTP)', description: 'Votre site n\'utilise pas HTTPS. Google pénalise les sites non sécurisés.', impact: 'Élevé', locked: false });
    } else {
      totalPoints += 10;
    }

    // CHECK 6 — Canonical
    const hasCanonical = /<link[^>]*rel=["']canonical["']/i.test(html);
    if (!hasCanonical) {
      totalPoints += 5;
      errors.push({ id: 'missing-canonical', type: 'WARNING', title: 'Balise Canonical absente', description: 'Sans canonical, Google peut indexer plusieurs versions de votre page et diluer votre autorité SEO.', impact: 'Moyen', locked: false });
    } else {
      totalPoints += 10;
    }

    // CHECK 7 — Schema.org
    const hasSchema = html.includes('application/ld+json');
    if (!hasSchema) {
      errors.push({ id: 'missing-schema', type: 'CRITIQUE', title: 'Aucun Schema.org détecté', description: 'Sans Schema.org, ChatGPT, Perplexity et les AI Overviews ne peuvent pas comprendre votre contenu.', impact: 'Élevé', locked: false });
    } else {
      totalPoints += 10;
    }

    // CHECK 8 — Open Graph
    const hasOgTitle = /<meta[^>]*property=["']og:title["']/i.test(html);
    const hasOgDesc = /<meta[^>]*property=["']og:description["']/i.test(html);
    if (!hasOgTitle && !hasOgDesc) {
      errors.push({ id: 'missing-og', type: 'CRITIQUE', title: 'Open Graph absent', description: 'Vos pages ne sont pas optimisées pour le partage sur les réseaux sociaux.', impact: 'Moyen', locked: false });
    } else if (!hasOgTitle || !hasOgDesc) {
      totalPoints += 5;
      errors.push({ id: 'incomplete-og', type: 'WARNING', title: 'Open Graph incomplet', description: 'og:title ou og:description manquant.', impact: 'Faible', locked: false });
    } else {
      totalPoints += 10;
    }

    // CHECK 9 — llms.txt (AEO)
    try {
      const domain = new URL(rawUrl).origin;
      const llmsRes = await fetch(`${domain}/llms.txt`, { signal: AbortSignal.timeout(3000) });
      if (llmsRes.ok) {
        totalPoints += 10;
      } else {
        errors.push({ id: 'missing-llms-txt', type: 'CRITIQUE', title: 'llms.txt absent (AEO)', description: 'Sans llms.txt, les IA comme ChatGPT et Perplexity ne savent pas comment explorer votre site.', impact: 'Élevé', locked: false });
      }
    } catch {
      errors.push({ id: 'missing-llms-txt', type: 'CRITIQUE', title: 'llms.txt absent (AEO)', description: 'Sans llms.txt, les IA comme ChatGPT et Perplexity ne savent pas comment explorer votre site.', impact: 'Élevé', locked: false });
    }

    // CHECK 10 — Noindex
    const hasNoindex = /<meta[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html);
    if (hasNoindex) {
      errors.push({ id: 'noindex-detected', type: 'CRITIQUE', title: 'Page bloquée au référencement', description: 'Une balise noindex empêche Google d\'indexer votre page.', impact: 'Élevé', locked: false });
    } else {
      totalPoints += 10;
    }

    // Score final
    const score = Math.min(100, totalPoints);
    let label = 'EXCELLENT';
    if (score <= 30) label = 'CRITIQUE';
    else if (score <= 60) label = 'À AMÉLIORER';
    else if (score <= 80) label = 'CORRECT';

    // Séparer visible vs locked
    const visibleErrors = errors.slice(0, 3).map(e => ({ ...e, locked: false }));
    const lockedErrors: LockedItem[] = errors.slice(3).map((e, i) => ({
      id: `locked-${i}`,
      title: e.title,
      locked: true,
    }));

    const result: ScanResult = {
      score,
      label,
      url: rawUrl,
      scannedAt: new Date().toISOString(),
      totalErrors: errors.length,
      visibleErrors,
      lockedErrors,
      upgradeCta: {
        message: `${errors.length} erreurs détectées sur votre site.`,
        sub: 'Réparez tout avec SEOVALT Pro →',
        url: 'https://seo-valt.vercel.app/#pricing',
      },
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  },
};
