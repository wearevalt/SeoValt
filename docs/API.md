# SEOVALT API Reference

Base URL: `https://your-project.supabase.co/functions/v1`

All requests require a valid license key in the request body.

---

## Authentication

No API key needed in the request headers — authentication is done via the `license_key` field in the request body. Your license key is available in your SEOVALT dashboard.

---

## Rate Limits

- **100 requests/minute** per license key
- Exceeding limits returns `429 Too Many Requests`

---

## Error Codes

| Code | Meaning |
|------|---------|
| `400` | Bad request — missing or invalid parameters |
| `401` | Invalid or inactive license key |
| `402` | Subscription not active |
| `403` | License bound to different site |
| `429` | Quota exceeded or rate limit hit |
| `500` | Server error |

---

## Endpoints

### 1. Verify License

`POST /verify-license`

Verify a license key and get current quota status.

**Request:**
```json
{
  "license_key": "SVT-XXXX-XXXX-XXXX-XXXX",
  "site_url": "https://your-site.com"
}
```

**Response:**
```json
{
  "valid": true,
  "license_id": "uuid",
  "user_id": "uuid",
  "plan": "pro",
  "quota": {
    "allowed": true,
    "used": 12,
    "limit": 50,
    "plan": "pro"
  }
}
```

**PHP Example (WordPress):**
```php
function seovalt_verify_license($license_key, $site_url) {
    $response = wp_remote_post('https://your-project.supabase.co/functions/v1/verify-license', [
        'headers' => ['Content-Type' => 'application/json'],
        'body'    => json_encode([
            'license_key' => $license_key,
            'site_url'    => $site_url,
        ]),
        'timeout' => 15,
    ]);
    if (is_wp_error($response)) return false;
    $data = json_decode(wp_remote_retrieve_body($response), true);
    return $data['valid'] === true ? $data : false;
}
```

---

### 2. Generate Article

`POST /generate-article`

Generate an SEO-optimized blog article using Claude AI.

**Request:**
```json
{
  "license_key": "SVT-XXXX-XXXX-XXXX-XXXX",
  "keyword": "best wordpress seo plugins 2026",
  "niche": "wordpress development",
  "language": "en",
  "tone": "professional",
  "word_count": 1200
}
```

**Response:**
```json
{
  "success": true,
  "article": {
    "title": "Best WordPress SEO Plugins in 2026: The Definitive Guide",
    "meta_description": "Discover the top WordPress SEO plugins of 2026...",
    "slug": "best-wordpress-seo-plugins-2026",
    "excerpt": "...",
    "content": "<h2>Introduction</h2><p>...</p>",
    "focus_keyword": "best wordpress seo plugins 2026",
    "tags": ["wordpress", "seo", "plugins"],
    "schema": { "@type": "Article", "headline": "..." },
    "alt_texts": ["WordPress SEO plugin dashboard screenshot"],
    "word_count": 1200
  }
}
```

**PHP Example:**
```php
function seovalt_generate_article($license_key, $keyword, $niche = '') {
    $response = wp_remote_post('https://your-project.supabase.co/functions/v1/generate-article', [
        'headers' => ['Content-Type' => 'application/json'],
        'body'    => json_encode([
            'license_key' => $license_key,
            'keyword'     => $keyword,
            'niche'       => $niche,
            'language'    => get_locale() === 'fr_FR' ? 'fr' : 'en',
        ]),
        'timeout' => 60,
    ]);
    if (is_wp_error($response)) return null;
    $data = json_decode(wp_remote_retrieve_body($response), true);
    return $data['success'] ? $data['article'] : null;
}

// Insert article as WordPress draft
function seovalt_insert_article($article) {
    return wp_insert_post([
        'post_title'   => $article['title'],
        'post_content' => $article['content'],
        'post_excerpt' => $article['excerpt'],
        'post_status'  => 'draft',
        'post_name'    => $article['slug'],
        'meta_input'   => [
            '_yoast_wpseo_title'    => $article['title'],
            '_yoast_wpseo_metadesc' => $article['meta_description'],
            '_yoast_wpseo_focuskw'  => $article['focus_keyword'],
        ],
        'tags_input'   => $article['tags'],
    ]);
}
```

---

### 3. Check PageSpeed

`POST /check-pagespeed`

Analyze a URL with Google PageSpeed Insights.

**Request:**
```json
{
  "license_key": "SVT-XXXX-XXXX-XXXX-XXXX",
  "url": "https://your-site.com/page",
  "strategy": "mobile"
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "url": "https://your-site.com",
    "strategy": "mobile",
    "scores": { "performance": 87, "accessibility": 94, "seo": 98 },
    "metrics": { "lcp": "1.8 s", "inp": "45 ms", "cls": "0.02" },
    "opportunities": [
      { "title": "Eliminate render-blocking resources", "savings": "1.2s" }
    ]
  }
}
```

---

### 4. Fix SEO

`POST /fix-seo`

Analyze a page and get specific SEO fix recommendations.

**Request:**
```json
{
  "license_key": "SVT-XXXX-XXXX-XXXX-XXXX",
  "page_data": {
    "url": "https://your-site.com/my-post",
    "title": "My Post",
    "meta_description": "",
    "h1": "",
    "slug": "my-post",
    "focus_keyword": "seo tips",
    "content": "<p>...</p>"
  }
}
```

**Response:**
```json
{
  "success": true,
  "fixes": {
    "issues": [
      { "type": "meta", "severity": "error", "message": "Missing meta description" },
      { "type": "h1", "severity": "error", "message": "Missing H1 tag" }
    ],
    "fixes": {
      "title": "10 Proven SEO Tips to Rank #1 in 2026",
      "meta_description": "Discover 10 actionable SEO tips...",
      "h1": "10 Proven SEO Tips",
      "slug": "seo-tips-2026",
      "focus_keyword": "seo tips 2026"
    },
    "score": 42,
    "summary": "Page has critical SEO issues requiring immediate attention."
  }
}
```

---

### 5. Optimize Images

`POST /optimize-images`

Generate AI alt texts for images.

**Request:**
```json
{
  "license_key": "SVT-XXXX-XXXX-XXXX-XXXX",
  "site_niche": "e-commerce",
  "images": [
    { "id": 123, "url": "https://site.com/wp-content/uploads/product.jpg", "filename": "product.jpg", "current_alt": "" }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "results": [
    { "id": 123, "alt_text": "Blue wireless headphones with noise cancellation", "success": true }
  ]
}
```

---

### 6. Scan Site

`POST /scan-site`

Full site SEO audit.

**Request:**
```json
{
  "license_key": "SVT-XXXX-XXXX-XXXX-XXXX",
  "site_data": {
    "url": "https://your-site.com",
    "posts_count": 45,
    "pages": [{ "title": "Home", "slug": "/" }, { "title": "About", "slug": "/about" }],
    "categories": ["news", "tutorials"],
    "sitemap_url": "https://your-site.com/sitemap.xml",
    "robots_txt": "User-agent: *\nDisallow: /wp-admin/"
  }
}
```

**Response:**
```json
{
  "success": true,
  "audit": {
    "overall_score": 68,
    "business_type": "blog",
    "niche": "wordpress development",
    "critical_issues": ["No schema markup detected", "Missing canonical URLs on 12 pages"],
    "warnings": ["Thin content on 5 pages (< 300 words)"],
    "recommended_keywords": ["wordpress tutorial", "wp plugins", "wordpress themes"],
    "action_plan": [
      { "priority": 1, "action": "Add schema markup to all posts", "impact": "high" },
      { "priority": 2, "action": "Write 300+ words for thin pages", "impact": "medium" }
    ]
  }
}
```

---

## WordPress Plugin Quick Start

```php
// wp-content/plugins/seovalt/seovalt.php

class SEOVALT_Plugin {
    private $license_key;
    private $api_base = 'https://your-project.supabase.co/functions/v1';

    public function __construct() {
        $this->license_key = get_option('seovalt_license_key');
        add_action('admin_menu', [$this, 'add_menu']);
        add_action('publish_post', [$this, 'on_publish']);
        add_filter('the_seo_framework_meta_tags', [$this, 'inject_meta']);
    }

    public function api_request($endpoint, $data) {
        $data['license_key'] = $this->license_key;
        $response = wp_remote_post("{$this->api_base}/{$endpoint}", [
            'headers' => ['Content-Type' => 'application/json'],
            'body'    => json_encode($data),
            'timeout' => 60,
        ]);
        if (is_wp_error($response)) return null;
        return json_decode(wp_remote_retrieve_body($response), true);
    }
}

new SEOVALT_Plugin();
```
