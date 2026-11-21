import { Project } from '../types';

const escapeHtml = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export const generateLuxuryDossierHtml = (
  project: Project,
  clientName: string,
  clientPhone: string
): string => {
  const safeName = escapeHtml(project.name);
  const safeDeveloper = escapeHtml(project.developer);
  const safeLocality = escapeHtml(project.locality);
  const safePrice = escapeHtml(project.priceStarting);
  const safeUnits = escapeHtml(project.units);
  const safeStatus = escapeHtml(project.status);
  const safePossession = escapeHtml(project.possessionDate);
  const safeRera = escapeHtml(project.reraNumber || 'UPRERAAGT2024/9999');
  const safeTotalArea = escapeHtml(project.totalArea || '3.5 Acres Land Parcel');
  const safeDescription = escapeHtml(project.description);
  const safeClientName = escapeHtml(clientName);
  const safeClientPhone = escapeHtml(clientPhone);

  const highlights = project.highlights && project.highlights.length > 0
    ? project.highlights
    : [
        'Prime Agra Strategic Location',
        'ADA Sanctioned & UP RERA Registered',
        'Gated Multi-Tier Electronic Security & Surveillance',
        'Private Clubhouse, Pool & Landscaped Parkland',
        '100% Power Redundancy with High-Speed Elevators',
        'High Capital Appreciation Corridor'
      ];

  const configs = project.unitConfigurations && project.unitConfigurations.length > 0
    ? project.unitConfigurations
    : ['3 BHK Luxury Residences', '4 BHK Grand Imperial Suites', 'Limited Sky Penthouses'];

  const dossierId = `RAE-DOSSIER-${project.id.toUpperCase()}-${Date.now().toString().slice(-5)}`;
  const generationDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeName} — Luxury Executive Dossier | Royal Agra Estate</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #0F382C;
      --primary-light: #164E3D;
      --gold: #C5A880;
      --gold-light: #E4D5B7;
      --gold-dark: #8A704C;
      --bg: #FAF8F5;
      --card-bg: #FFFFFF;
      --text-main: #1E293B;
      --text-muted: #64748B;
      --border: #E2D9CE;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: var(--bg);
      color: var(--text-main);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      padding-bottom: 50px;
    }

    /* Print & Action Bar */
    .action-bar {
      background-color: #0B2920;
      color: #FFFFFF;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      border-bottom: 1px solid var(--gold-dark);
    }
    .action-bar span {
      font-size: 13px;
      font-weight: 500;
      color: var(--gold-light);
      letter-spacing: 0.5px;
    }
    .action-btn {
      background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%);
      color: #0F382C;
      font-weight: 700;
      font-size: 13px;
      padding: 8px 18px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    }
    .action-btn:hover {
      filter: brightness(1.1);
      transform: translateY(-1px);
    }

    /* Dossier Container */
    .dossier-wrapper {
      max-width: 900px;
      margin: 30px auto;
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(15, 56, 44, 0.08);
      overflow: hidden;
    }

    /* Header & Crest */
    .dossier-header {
      background: linear-gradient(135deg, #09231B 0%, #0F382C 60%, #164E3D 100%);
      color: #FFFFFF;
      padding: 35px 40px;
      border-bottom: 3px solid var(--gold);
      position: relative;
    }
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
    }
    .brand-group h1 {
      font-family: 'Cinzel', serif;
      font-size: 24px;
      letter-spacing: 2.5px;
      color: #FFFFFF;
      font-weight: 800;
      text-transform: uppercase;
    }
    .brand-group p {
      font-size: 11px;
      letter-spacing: 1.5px;
      color: var(--gold-light);
      text-transform: uppercase;
      margin-top: 4px;
      font-weight: 600;
    }
    .badge-dossier {
      background: rgba(197, 168, 128, 0.15);
      border: 1px solid var(--gold);
      color: var(--gold-light);
      padding: 6px 14px;
      border-radius: 50px;
      font-size: 11px;
      letter-spacing: 1px;
      text-transform: uppercase;
      font-weight: 700;
      font-family: 'Cinzel', serif;
    }
    .dossier-meta {
      display: flex;
      gap: 20px;
      font-size: 11px;
      color: rgba(255,255,255,0.75);
      border-top: 1px solid rgba(255,255,255,0.1);
      padding-top: 15px;
    }
    .dossier-meta strong {
      color: var(--gold-light);
      font-weight: 600;
    }

    /* Cover Hero */
    .hero-banner {
      position: relative;
      height: 380px;
      overflow: hidden;
      background: #000000;
    }
    .hero-banner img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.92;
    }
    .hero-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(to top, rgba(9, 35, 27, 0.95) 0%, rgba(9, 35, 27, 0.6) 60%, transparent 100%);
      padding: 30px 40px;
      color: #FFFFFF;
    }
    .status-tag {
      display: inline-block;
      background: #10B981;
      color: #FFFFFF;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 8px;
    }
    .hero-overlay h2 {
      font-family: 'Playfair Display', serif;
      font-size: 34px;
      font-weight: 700;
      line-height: 1.2;
      color: #FFFFFF;
      text-shadow: 0 2px 4px rgba(0,0,0,0.5);
    }
    .hero-overlay .sub-line {
      font-size: 14px;
      color: var(--gold-light);
      margin-top: 6px;
      display: flex;
      align-items: center;
      gap: 15px;
    }

    /* Content Body */
    .content-body {
      padding: 40px;
    }

    /* Metric Grid */
    .specs-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 35px;
    }
    .spec-card {
      background: #FAF8F5;
      border: 1px solid var(--border);
      padding: 16px;
      border-radius: 8px;
      text-align: left;
    }
    .spec-card .label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-muted);
      font-weight: 700;
      display: block;
      margin-bottom: 4px;
    }
    .spec-card .val {
      font-size: 16px;
      font-weight: 700;
      color: var(--primary);
      font-family: 'Playfair Display', serif;
    }

    /* Section Styles */
    .section-title {
      font-family: 'Cinzel', serif;
      font-size: 16px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: var(--primary);
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 1.5px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .section-title::after {
      content: '';
      display: block;
      width: 40px;
      height: 2px;
      background: var(--gold);
    }
    .description-text {
      font-size: 14px;
      color: #334155;
      line-height: 1.7;
      margin-bottom: 35px;
    }

    /* Configurations & Amenities */
    .features-list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-bottom: 35px;
    }
    .feature-item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 13px;
      color: #334155;
      background: #FAF8F5;
      padding: 10px 14px;
      border-radius: 6px;
      border: 1px solid rgba(226, 217, 206, 0.7);
    }
    .feature-icon {
      color: #0F382C;
      font-weight: bold;
      font-size: 14px;
    }

    /* Official Seals & Regulatory Approval */
    .verification-box {
      background: #F0FDF4;
      border: 1.5px solid #86EFAC;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 35px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .verification-details h4 {
      font-size: 14px;
      font-weight: 700;
      color: #166534;
      margin-bottom: 4px;
    }
    .verification-details p {
      font-size: 12px;
      color: #15803D;
    }
    .rera-badge {
      font-family: monospace;
      font-size: 13px;
      background: #DCFCE7;
      color: #14532D;
      padding: 6px 12px;
      border-radius: 6px;
      font-weight: 700;
      border: 1px solid #86EFAC;
    }

    /* Advisory Contacts */
    .advisory-box {
      background: #0F382C;
      color: #FFFFFF;
      border-radius: 8px;
      padding: 25px 30px;
      margin-bottom: 30px;
      border-left: 4px solid var(--gold);
    }
    .advisory-box h4 {
      font-family: 'Cinzel', serif;
      font-size: 14px;
      letter-spacing: 1px;
      color: var(--gold-light);
      margin-bottom: 15px;
      text-transform: uppercase;
    }
    .advisory-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }
    .advisor-card h5 {
      font-size: 14px;
      font-weight: 700;
      color: #FFFFFF;
    }
    .advisor-card p {
      font-size: 12px;
      color: rgba(255,255,255,0.75);
      margin-top: 2px;
    }
    .advisor-card a {
      color: var(--gold-light);
      text-decoration: none;
      font-weight: 600;
      font-size: 12px;
      display: inline-block;
      margin-top: 4px;
    }

    /* Footer */
    .dossier-footer {
      border-top: 1px solid var(--border);
      padding: 20px 40px;
      background: #FAF8F5;
      font-size: 11px;
      color: var(--text-muted);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .dossier-footer strong {
      color: var(--primary);
    }

    /* Print Styles */
    @media print {
      body {
        background: #FFFFFF;
        padding-bottom: 0;
      }
      .no-print {
        display: none !important;
      }
      .dossier-wrapper {
        border: none;
        box-shadow: none;
        margin: 0;
        max-width: 100%;
        border-radius: 0;
      }
      .hero-banner {
        height: 280px;
      }
      @page {
        margin: 10mm;
        size: A4 portrait;
      }
      .spec-card, .feature-item, .verification-box, .advisory-box {
        page-break-inside: avoid;
      }
    }

    @media (max-width: 640px) {
      .dossier-header { padding: 25px 20px; }
      .content-body { padding: 25px 20px; }
      .specs-grid { grid-template-columns: 1fr; }
      .features-list { grid-template-columns: 1fr; }
      .advisory-grid { grid-template-columns: 1fr; }
      .header-top { flex-direction: column; gap: 10px; }
      .dossier-meta { flex-direction: column; gap: 5px; }
      .dossier-footer { flex-direction: column; gap: 10px; text-align: center; }
    }
  </style>
</head>
<body>

  <!-- Sticky Print Bar -->
  <div class="action-bar no-print">
    <span>ROYAL AGRA ESTATE • OFFICIAL EXECUTIVE PROJECT DOSSIER</span>
    <button class="action-btn" onclick="window.print()">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 6 2 18 2 18 9"></polyline>
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
        <rect x="6" y="14" width="12" height="8"></rect>
      </svg>
      Print / Save as PDF
    </button>
  </div>

  <div class="dossier-wrapper">

    <!-- Dossier Header -->
    <header class="dossier-header">
      <div class="header-top">
        <div class="brand-group">
          <h1>Royal Agra Estate</h1>
          <p>Private Client Architectural Advisory & Landmark Developments</p>
        </div>
        <div class="badge-dossier">Executive Dossier</div>
      </div>
      <div class="dossier-meta">
        <div>Ref: <strong>#${dossierId}</strong></div>
        <div>Date of Issue: <strong>${generationDate}</strong></div>
        <div>Sanction: <strong>ADA Approved & UP RERA Verified</strong></div>
        <div>Prepared For: <strong>${safeClientName} (${safeClientPhone})</strong></div>
      </div>
    </header>

    <!-- Project Hero Image Banner -->
    <div class="hero-banner">
      <img src="${project.coverImage || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80'}" alt="${safeName}" onerror="this.src='https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80'">
      <div class="hero-overlay">
        <span class="status-tag">${safeStatus}</span>
        <h2>${safeName}</h2>
        <div class="sub-line">
          <span>By ${safeDeveloper}</span>
          <span>•</span>
          <span>📍 ${safeLocality}</span>
          <span>•</span>
          <span>Starting at ${safePrice}</span>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <main class="content-body">

      <!-- Executive Metric Grid -->
      <div class="specs-grid">
        <div class="spec-card">
          <span class="label">Investment Guide</span>
          <span class="val">${safePrice}</span>
        </div>
        <div class="spec-card">
          <span class="label">Target Possession</span>
          <span class="val">${safePossession}</span>
        </div>
        <div class="spec-card">
          <span class="label">Inventory Density</span>
          <span class="val">${safeUnits}</span>
        </div>
        <div class="spec-card">
          <span class="label">Estate Land Area</span>
          <span class="val">${safeTotalArea}</span>
        </div>
        <div class="spec-card">
          <span class="label">RERA Registration</span>
          <span class="val" style="font-size: 13px; font-family: monospace;">${safeRera}</span>
        </div>
        <div class="spec-card">
          <span class="label">Development Authority</span>
          <span class="val" style="font-size: 14px;">ADA Sanctioned</span>
        </div>
      </div>

      <!-- Project Overview -->
      <h3 class="section-title">Architectural Overview</h3>
      <p class="description-text">
        ${safeDescription}
      </p>

      <!-- Unit Configurations -->
      <h3 class="section-title">Inventory Configurations</h3>
      <div class="features-list">
        ${configs.map(cfg => `
          <div class="feature-item">
            <span class="feature-icon">❖</span>
            <span>${escapeHtml(cfg)}</span>
          </div>
        `).join('')}
      </div>

      <!-- Highlights & Amenities -->
      <h3 class="section-title">Specifications & Strategic Amenities</h3>
      <div class="features-list">
        ${highlights.map(h => `
          <div class="feature-item">
            <span class="feature-icon">✓</span>
            <span>${escapeHtml(h)}</span>
          </div>
        `).join('')}
      </div>

      <!-- RERA & ADA Verification Seal -->
      <div class="verification-box">
        <div class="verification-details">
          <h4>✓ Verified Title & Statutory Sanctions</h4>
          <p>This development is fully ADA-approved with clear, encumbrance-free title records and registered under UP RERA.</p>
        </div>
        <div class="rera-badge">${safeRera}</div>
      </div>

      <!-- Private Concierge Advisory -->
      <div class="advisory-box">
        <h4>Confidential Private Client Advisory</h4>
        <div class="advisory-grid">
          <div class="advisor-card">
            <h5>Shrey Gupta</h5>
            <p>Chief Executive Officer & Principal Advisor</p>
            <a href="tel:+919149079913">Direct: +91 91490 79913</a><br>
            <a href="mailto:shrey@royalagraestate.in">shrey@royalagraestate.in</a>
          </div>
          <div class="advisor-card">
            <h5>Abhishek Singh Jadon</h5>
            <p>Managing Director & Land Acquisitions</p>
            <a href="tel:+919557138449">Direct: +91 95571 38449</a><br>
            <a href="mailto:abhishek@royalagraestate.in">abhishek@royalagraestate.in</a>
          </div>
        </div>
      </div>

    </main>

    <!-- Footer -->
    <footer class="dossier-footer">
      <div>
        Prepared exclusively for <strong>${safeClientName}</strong> (${safeClientPhone})
      </div>
      <div>
        Official Portal: <strong>https://royalagraestate.in</strong> • Shastripuram, Agra
      </div>
    </footer>

  </div>

</body>
</html>`;
};

export const downloadLuxuryDossier = (
  project: Project,
  clientName: string,
  clientPhone: string
): void => {
  const htmlContent = generateLuxuryDossierHtml(project, clientName, clientPhone);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const fileName = `${project.name.replace(/[^a-zA-Z0-9]/g, '_')}_Luxury_Dossier.html`;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
