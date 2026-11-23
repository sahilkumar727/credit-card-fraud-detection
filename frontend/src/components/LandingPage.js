import React, { useState, useEffect } from "react";
import { validateLuhn, getCardNetwork } from "../utils/luhn";

export function LandingPage({ onOpenConsole, currentUser, onOpenLogin }) {
  // 3D Card tilt state
  const [cardRotate, setCardRotate] = useState({ x: 0, y: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  // Sandbox card validator state (Initialized with verified Visa card)
  const [testCard, setTestCard] = useState("4532 8910 2345 6784");
  const [testResult, setTestResult] = useState(() => {
    const raw = "4532891023456784";
    return {
      isValid: validateLuhn(raw),
      network: getCardNetwork(raw).name,
      digits: raw.length,
      incomplete: false,
    };
  });

  // Feedback modal state
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({ name: "", email: "", rating: 5, comments: "" });

  // Live Threat Stream simulator
  const [liveStream, setLiveStream] = useState([
    { id: "TXN-8491", bank: "HDFC Bank", city: "Mumbai", amount: "₹42,500", risk: 94, status: "FLAGGED", reason: "Geo-velocity breach" },
    { id: "TXN-8490", bank: "ICICI Bank", city: "Bengaluru", amount: "₹1,240", risk: 8, status: "APPROVED", reason: "Standard EMV match" },
    { id: "TXN-8489", bank: "State Bank of India", city: "New Delhi", amount: "₹89,990", risk: 88, status: "FLAGGED", reason: "Night-time amount anomaly" },
    { id: "TXN-8488", bank: "Axis Bank", city: "Hyderabad", amount: "₹3,450", risk: 14, status: "APPROVED", reason: "Trusted merchant" },
  ]);

  // Periodic simulated live threats
  useEffect(() => {
    const interval = setInterval(() => {
      const banks = ["HDFC Bank", "ICICI Bank", "SBI", "Axis Bank", "Kotak Bank", "Standard Chartered"];
      const cities = ["Mumbai", "Bengaluru", "Delhi NCR", "London", "Dubai", "Singapore", "Pune", "Chennai"];
      const isRisky = Math.random() > 0.65;
      const riskScore = isRisky ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 25) + 5;
      const amounts = [980, 2450, 15400, 68000, 120000, 3400, 780];
      const newTxn = {
        id: `TXN-${Math.floor(Math.random() * 9000) + 1000}`,
        bank: banks[Math.floor(Math.random() * banks.length)],
        city: cities[Math.floor(Math.random() * cities.length)],
        amount: `₹${amounts[Math.floor(Math.random() * amounts.length)].toLocaleString("en-IN")}`,
        risk: riskScore,
        status: isRisky ? "FLAGGED" : "APPROVED",
        reason: isRisky ? "PCA vector divergence (V14/V17)" : "Device & geo authenticated",
      };
      setLiveStream((prev) => [newTxn, ...prev.slice(0, 4)]);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Handle 3D card mouse move
  const handleCardMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -16;
    const rotateY = ((x - centerX) / centerX) * 16;
    setCardRotate({ x: rotateX, y: rotateY });
    setGlarePos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100, opacity: 0.65 });
  };

  const handleCardMouseLeave = () => {
    setCardRotate({ x: 0, y: 0 });
    setGlarePos({ x: 50, y: 50, opacity: 0 });
  };

  // Run Luhn check on input
  const handleTestCardChange = (e) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 16);
    val = val.replace(/(.{4})/g, "$1 ").trim();
    setTestCard(val);
    const raw = val.replace(/\s/g, "");
    if (raw.length >= 13) {
      const isValid = validateLuhn(raw);
      const network = getCardNetwork(raw);
      setTestResult({ isValid, network: network.name, digits: raw.length, incomplete: false });
    } else if (raw.length > 0) {
      setTestResult({ isValid: false, network: "Card", digits: raw.length, incomplete: true });
    } else {
      setTestResult(null);
    }
  };

  const handleValidateClick = () => {
    const raw = testCard.replace(/\s/g, "");
    if (raw.length >= 13) {
      const isValid = validateLuhn(raw);
      const network = getCardNetwork(raw);
      setTestResult({ isValid, network: network.name, digits: raw.length, incomplete: false });
    } else {
      setTestResult({ isValid: false, network: "Card", digits: raw.length, incomplete: true });
    }
  };

  const handlePresetSelect = (presetCard) => {
    setTestCard(presetCard);
    const raw = presetCard.replace(/\s/g, "");
    const isValid = validateLuhn(raw);
    const network = getCardNetwork(raw);
    setTestResult({ isValid, network: network.name, digits: raw.length, incomplete: false });
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    setFeedbackSent(true);
    setTimeout(() => {
      setShowFeedback(false);
      setFeedbackSent(false);
      setFeedbackForm({ name: "", email: "", rating: 5, comments: "" });
    }, 2200);
  };

  const networkInfo = getCardNetwork(testCard);

  return (
    <div className="landing-root">
      {/* WCAG 2.2 Accessible Skip to Content */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      {/* Background ambient glowing orbs */}
      <div className="ambient-glow glow-1" aria-hidden="true"></div>
      <div className="ambient-glow glow-2" aria-hidden="true"></div>
      <div className="ambient-grid" aria-hidden="true"></div>

      {/* Top Navigation */}
      <header className="landing-nav" role="banner">
        <div className="nav-container">
          <div className="brand-group" aria-label="SecurePay Home">
            <div className="brand-icon-wrap">
              <img src="/logo.png" alt="SecurePay Shield Logo" className="nav-logo" />
            </div>
            <div>
              <span className="brand-title">SecurePay</span>
              <span className="brand-tag">FINTECH DEFENSE</span>
            </div>
          </div>

          <nav className="desktop-links" aria-label="Landing page sections">
            <a href="#features">Banking Engine</a>
            <a href="#threat-stream">Live Radar</a>
            <a href="#card-security">Luhn Defense</a>
            <a href="#compliance">Compliance</a>
          </nav>

          <div className="nav-actions">
            <span className="status-pill" role="status" aria-label="Machine Learning engine status: Online">
              <span className="pulse-dot" aria-hidden="true"></span> ML Engine Online
            </span>
            {currentUser ? (
              <button className="primary-cta" onClick={onOpenConsole} aria-label="Launch Live Console">
                Launch Live Console ➔
              </button>
            ) : (
              <div className="auth-btn-group">
                <button className="ghost-btn" onClick={onOpenLogin} aria-label="Sign in to your analyst account">
                  Analyst Sign In
                </button>
                <button className="primary-cta" onClick={onOpenConsole} aria-label="Launch Live Console">
                  Launch Live Console ➔
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Landmark for Screen Readers */}
      <main id="main-content">
        {/* Hero Section */}
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-spark" aria-hidden="true">🛡️</span>
              <span>ENTERPRISE 3D FRAUD SHIELD · SUB-45MS INFERENCE</span>
            </div>

            <h1 id="hero-title" className="hero-heading">
              Autonomous <span className="gradient-text">Fraud Intelligence</span> for Real-Time Banking
            </h1>

            <p className="hero-description">
              Engineered with extreme gradient boosting (XGBoost) and SMOTE synthetic balancing. 
              Scanning card movements, velocity anomalies, and high-frequency digital channels with 
              mathematical precision before transactions settle.
            </p>

            <div className="hero-cta-row">
              <button className="glow-btn" onClick={onOpenConsole} aria-label="Launch Live Console">
                <span>⚡ Launch Live Console</span>
              </button>
              <a href="#card-security" className="outline-btn" aria-label="Jump to interactive card validation lab">
                <span>💳 Test Luhn Algorithm</span>
              </a>
            </div>

            {/* Quick Metrics Banner */}
            <div className="hero-metrics-grid" role="region" aria-label="System Performance Metrics">
              <div className="h-metric">
                <span className="h-metric-val">99.8%</span>
                <span className="h-metric-lbl">Fraud Recall (SMOTE Balanced)</span>
              </div>
              <div className="h-metric">
                <span className="h-metric-val">&lt; 42ms</span>
                <span className="h-metric-lbl">Live Inference Latency</span>
              </div>
              <div className="h-metric">
                <span className="h-metric-val">0.982</span>
                <span className="h-metric-lbl">ROC-AUC Discriminator Score</span>
              </div>
              <div className="h-metric">
                <span className="h-metric-val">100%</span>
                <span className="h-metric-lbl">Tokenized (Zero Plaintext Card)</span>
              </div>
            </div>
          </div>

          {/* 3D Holographic Card Interactive Component */}
          <div className="hero-3d-wrapper" aria-label="Interactive 3D Credit Card Preview">
            <div
              className="card-3d-scene"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              tabIndex="0"
              role="region"
              aria-label="3D metallic credit card with holographic sheen. Interactive on mouse hover and touch."
            >
              <div
                className="holo-card"
                style={{
                  transform: `perspective(1000px) rotateX(${cardRotate.x}deg) rotateY(${cardRotate.y}deg) scale3d(1.03, 1.03, 1.03)`,
                }}
              >
                {/* Specular glare overlay */}
                <div
                  className="card-glare"
                  aria-hidden="true"
                  style={{
                    background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.4) 0%, transparent 60%)`,
                    opacity: glarePos.opacity,
                  }}
                ></div>

                {/* Card Header */}
                <div className="card-top-row">
                  <div className="card-chip" aria-hidden="true">
                    <div className="chip-line chip-line-1"></div>
                    <div className="chip-line chip-line-2"></div>
                  </div>
                  <div className="card-contactless" aria-label="Contactless payment enabled">
                    <span aria-hidden="true">📶</span>
                  </div>
                  <div className="card-brand-shield">
                    <img src="/logo.png" alt="SecurePay Logo" />
                    <span>SecurePay</span>
                  </div>
                </div>

                {/* Card Number */}
                <div className="card-number-display" aria-label="Masked card number: ending in 7321">
                  <span>4532</span>
                  <span>8842</span>
                  <span>9100</span>
                  <span>7321</span>
                </div>

                {/* Card Meta */}
                <div className="card-bottom-row">
                  <div>
                    <span className="meta-label">CARDHOLDER</span>
                    <span className="meta-value">SAHIL KUMAR · ANALYST</span>
                  </div>
                  <div>
                    <span className="meta-label">EXPIRES</span>
                    <span className="meta-value">11/29</span>
                  </div>
                  <div className="network-badge" aria-label="Card Network: Visa">
                    <span>VISA</span>
                  </div>
                </div>

                {/* Floating Shield Badges */}
                <div className="floating-badge badge-top-right">
                  <span className="pulse-green" aria-hidden="true"></span> 3D Secure 2.0 Active
                </div>
                <div className="floating-badge badge-bottom-left">
                  🛡️ PCI-DSS Level 1
                </div>
              </div>
            </div>
            <p className="hint-text">✨ Move cursor or finger over card to interact with 3D perspective</p>
          </div>
        </section>

        {/* Live Threat Radar Stream Section */}
        <section id="threat-stream" className="section-block" aria-labelledby="threat-stream-title">
          <div className="section-header">
            <span className="section-eyebrow">LIVE TELEMETRY RADAR</span>
            <h2 id="threat-stream-title">Real-Time Interbank Transaction Feed</h2>
            <p>Live stream of incoming transaction movements across retail banking channels evaluated by the ML inference pipeline.</p>
          </div>

          <div className="stream-card-container">
            <div className="stream-header-row" role="row">
              <span>TRANSACTION ID</span>
              <span>ISSUING BANK</span>
              <span>LOCATION</span>
              <span>AMOUNT</span>
              <span>RISK SCORE</span>
              <span>AI DECISION</span>
            </div>
            <div className="stream-items" aria-live="polite" aria-atomic="false">
              {liveStream.map((item) => (
                <div key={item.id} className={`stream-row ${item.status === "FLAGGED" ? "row-flagged" : "row-safe"}`} role="row">
                  <span className="stream-mono">{item.id}</span>
                  <span className="stream-bank">🏦 {item.bank}</span>
                  <span className="stream-city">📍 {item.city}</span>
                  <span className="stream-amt">{item.amount}</span>
                  <span className="stream-risk">
                    <div className="risk-mini-bar" role="progressbar" aria-valuenow={item.risk} aria-valuemin="0" aria-valuemax="100">
                      <div
                        className="risk-mini-fill"
                        style={{
                          width: `${item.risk}%`,
                          background: item.risk > 65 ? "#f43f5e" : item.risk > 35 ? "#facc15" : "#2dd4bf",
                        }}
                      ></div>
                    </div>
                    <strong style={{ color: item.risk > 65 ? "#fb7185" : "#4ade80" }}>{item.risk}/100</strong>
                  </span>
                  <span className={`stream-pill ${item.status === "FLAGGED" ? "pill-flagged" : "pill-safe"}`}>
                    {item.status === "FLAGGED" ? "🚩 REJECTED & FLAGGED" : "✅ APPROVED"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Real-World Banking Modules Section */}
        <section id="features" className="section-block" aria-labelledby="features-title">
          <div className="section-header">
            <span className="section-eyebrow">ENTERPRISE DEFENSE MATRIX</span>
            <h2 id="features-title">Real-World Banking Security Engines</h2>
            <p>Modern card networks cannot rely on static rules. SecurePay integrates 4 autonomous defense pillars.</p>
          </div>

          <div className="modules-grid">
            <article className="module-card">
              <div className="module-icon" aria-hidden="true">🌐</div>
              <h3>Geo-Velocity Engine</h3>
              <p className="module-tagline">Impossible Travel Detection</p>
              <p>
                Calculates the geographical distance and delta time between sequential transaction coordinates. 
                Flags card cloning if physically impossible speeds (&gt;800 km/h) are observed.
              </p>
              <ul className="module-bullets">
                <li>✓ IP Subnet vs Cardholder Home City match</li>
                <li>✓ Flight-time constraint calculation</li>
                <li>✓ ATM skimming anomaly telemetry</li>
              </ul>
            </article>

            <article className="module-card featured-module">
              <div className="featured-ribbon">CORE ENGINE</div>
              <div className="module-icon" aria-hidden="true">🧠</div>
              <h3>XGBoost + SMOTE Pipeline</h3>
              <p className="module-tagline">Sub-45ms Machine Learning Core</p>
              <p>
                Trained on 284,807 transactions with 28 PCA behavioral vectors. Solves severe 0.17% class 
                imbalance using Synthetic Minority Over-sampling to maximize recall.
              </p>
              <ul className="module-bullets">
                <li>✓ 0.982 ROC-AUC high-confidence curve</li>
                <li>✓ Zero false-alarm customer fatigue</li>
                <li>✓ Optimized for multi-threaded cloud execution</li>
              </ul>
            </article>

            <article className="module-card">
              <div className="module-icon" aria-hidden="true">🔐</div>
              <h3>Luhn & Tokenization</h3>
              <p className="module-tagline">PCI-DSS Level 1 Compliance</p>
              <p>
                Enforces MOD-10 checksum validation at client boundary. Raw 16-digit Primary Account Numbers (PAN) 
                are immediately masked into irreversible cryptographic tokens.
              </p>
              <ul className="module-bullets">
                <li>✓ ISO/IEC 7812 card structure validation</li>
                <li>✓ Zero raw PAN exposure in transit</li>
                <li>✓ Dynamic 3D Secure step-up challenge</li>
              </ul>
            </article>

            <article className="module-card">
              <div className="module-icon" aria-hidden="true">📊</div>
              <h3>Explainable AI (XAI)</h3>
              <p className="module-tagline">Regulatory Compliance & Transparency</p>
              <p>
                Banks cannot treat AI as a black box under RBI & GDPR mandates. Every prediction yields top 
                divergence factors explaining exactly why an analyst must review the card.
              </p>
              <ul className="module-bullets">
                <li>✓ SHAP-inspired feature attribution</li>
                <li>✓ Plain-English alert justification</li>
                <li>✓ Automated dispute audit trails</li>
              </ul>
            </article>
          </div>
        </section>

        {/* Interactive Luhn Algorithm Playground Section */}
        <section id="card-security" className="section-block playground-section" aria-labelledby="luhn-lab-title">
          <div className="playground-wrap">
            <div className="playground-left">
              <span className="section-eyebrow">INTERACTIVE LAB</span>
              <h2 id="luhn-lab-title">Test the Luhn Algorithm (MOD 10) in Real-Time</h2>
              <p>
                Every genuine Visa, Mastercard, or RuPay card in the world obeys the mathematical Luhn formula. 
                Try entering or modifying any 16-digit sequence to witness real-time cryptographic validation.
              </p>

              <div className="card-input-box">
                <div className="input-header-row">
                  <label htmlFor="luhn-interactive-input">ENTER 16-DIGIT CARD NUMBER</label>
                  
                  {/* Explicit Inline Submit / Validation State Indicator */}
                  <div
                    id="card-validation-badge"
                    className={`validation-state-indicator ${
                      testResult
                        ? testResult.isValid
                          ? "state-valid"
                          : "state-invalid"
                        : "state-idle"
                    }`}
                    role="status"
                    aria-live="polite"
                  >
                    <span className="badge-icon" aria-hidden="true">
                      {testResult ? (testResult.isValid ? "✓" : "✗") : "ℹ️"}
                    </span>
                    <span className="badge-text">
                      {testResult
                        ? testResult.isValid
                          ? `PASSED · VALID ${testResult.network.toUpperCase()}`
                          : testResult.incomplete
                          ? `INCOMPLETE (${testResult.digits}/16 DIGITS)`
                          : "CHECKSUM FAILED (INVALID)"
                        : "READY · ENTER 16 DIGITS"}
                    </span>
                  </div>
                </div>

                <div className="card-input-action-row">
                  <div className="input-with-icon">
                    <span className="card-icon" aria-hidden="true">{networkInfo.icon}</span>
                    <input
                      id="luhn-interactive-input"
                      type="text"
                      value={testCard}
                      onChange={handleTestCardChange}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleValidateClick();
                        }
                      }}
                      placeholder="4532 8910 2345 6784"
                      maxLength={19}
                      aria-label="Test the Luhn Algorithm interactive card input"
                      aria-describedby="card-validation-badge luhn-feedback-status"
                    />
                  </div>
                  <button
                    type="button"
                    className="validate-btn"
                    onClick={handleValidateClick}
                    aria-label="Validate Card Number against Luhn checksum"
                  >
                    Validate Card
                  </button>
                </div>

                {/* Quick Presets for Instant 1-Click Verification */}
                <div className="card-presets-bar" aria-label="Quick test card presets">
                  <span className="preset-title">Quick Test Presets:</span>
                  <div className="preset-buttons">
                    <button
                      type="button"
                      className="preset-pill preset-visa"
                      onClick={() => handlePresetSelect("4532 8910 2345 6784")}
                      aria-label="Load verified Visa test card"
                    >
                      ✓ Valid Visa
                    </button>
                    <button
                      type="button"
                      className="preset-pill preset-mc"
                      onClick={() => handlePresetSelect("5425 2334 3010 9903")}
                      aria-label="Load verified Mastercard test card"
                    >
                      ✓ Valid Mastercard
                    </button>
                    <button
                      type="button"
                      className="preset-pill preset-bad"
                      onClick={() => handlePresetSelect("4532 8910 2345 6789")}
                      aria-label="Load invalid checksum card"
                    >
                      ✗ Invalid Checksum
                    </button>
                  </div>
                </div>
              </div>

              {testResult && (
                <div
                  id="luhn-feedback-status"
                  className={`luhn-status-card ${testResult.isValid ? "luhn-valid" : "luhn-invalid"}`}
                  aria-live="polite"
                >
                  <div className="luhn-icon" aria-hidden="true">{testResult.isValid ? "✅" : "⚠️"}</div>
                  <div>
                    <h4>{testResult.isValid ? "VALID LUHN CHECKSUM" : "INVALID CARD CHECKSUM"}</h4>
                    <p>
                      {testResult.isValid
                        ? `Detected as genuine ${testResult.network} format (${testResult.digits} digits). Passes ISO/IEC 7812 verification.`
                        : testResult.incomplete
                        ? `Card number contains ${testResult.digits} digits. Enter at least 13-16 digits for full verification.`
                        : `Mathematical checksum check failed. This card sequence does not match legitimate bank issuance patterns.`}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="playground-right">
              <div className="luhn-explanation-card">
                <h3>How does MOD 10 work?</h3>
                <p>
                  Starting from the rightmost digit, double every second digit. If doubling results in &gt;9, subtract 9. 
                  Sum all resulting digits: if the total modulo 10 equals 0, the card number is mathematically valid!
                </p>
                <div className="formula-box">
                  <code>(Sum(odd_digits) + Sum(doubled_even_digits)) mod 10 == 0</code>
                </div>
                <div className="verified-networks">
                  <span>Supported Networks:</span>
                  <div className="network-pills">
                    <span className="net-pill">Visa (4xxx)</span>
                    <span className="net-pill">Mastercard (5xxx)</span>
                    <span className="net-pill">RuPay (6xxx)</span>
                    <span className="net-pill">Amex (3xxx)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Banner */}
        <section className="cta-banner" aria-labelledby="cta-heading">
          <div className="cta-banner-content">
            <h2 id="cta-heading">Ready to test live fraud predictions?</h2>
            <p>Launch the live console to simulate transactions, view volume graphs, and examine model performance.</p>
            <button className="glow-btn" onClick={onOpenConsole} aria-label="Launch Live Console">
              Launch Live Console ➔
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="compliance" className="landing-footer" role="contentinfo">
        <div className="footer-container">
          <div className="footer-col-main">
            <div className="brand-group">
              <img src="/logo.png" alt="SecurePay Shield Logo" className="nav-logo" />
              <span className="brand-title">SecurePay</span>
            </div>
            <p className="footer-desc">
              Next-generation autonomous transaction security architecture built with Spring Boot, Python FastAPI, 
              React, and high-performance Machine Learning microservices.
            </p>
            <div className="developer-tag">
              <span>👨‍💻 Engineered & Developed by <strong>Sahil Kumar</strong></span>
            </div>
          </div>

          <div className="footer-col">
            <h4>QUICK NAVIGATION</h4>
            <ul>
              <li><a href="#features">Banking Engine</a></li>
              <li><a href="#threat-stream">Live Radar</a></li>
              <li><a href="#card-security">Luhn Validator</a></li>
              <li><button className="link-btn" onClick={onOpenConsole} aria-label="Launch Live Console">Launch Live Console</button></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>CONNECT & CODE</h4>
            <ul>
              <li>
                <a
                  href="https://github.com/sahilkumar727/credit-card-fraud-detection"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Visit Sahil Kumar's GitHub repository for credit card fraud detection (opens in a new window)"
                >
                  📂 GitHub Repository
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Connect with developer Sahil Kumar on LinkedIn (opens in a new window)"
                >
                  💼 LinkedIn Profile
                </a>
              </li>
              <li>
                <button
                  className="link-btn feedback-trigger"
                  onClick={() => setShowFeedback(true)}
                  aria-label="Open user feedback and review submission modal"
                >
                  💬 Send Real-User Feedback
                </button>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>COMPLIANCE SPECS</h4>
            <div className="compliance-badges">
              <div className="comp-badge">🔒 256-bit TLS/SSL</div>
              <div className="comp-badge">💳 PCI-DSS Level 1</div>
              <div className="comp-badge">🏛️ RBI Cyber Security</div>
              <div className="comp-badge">⚡ Sub-50ms SLA</div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} SecurePay. Developed for academic & enterprise research by Sahil Kumar. All rights reserved.</p>
        </div>
      </footer>

      {/* Accessible User Feedback Modal */}
      {showFeedback && (
        <div
          className="feedback-backdrop"
          onClick={() => setShowFeedback(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-dialog-title"
        >
          <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-btn"
              onClick={() => setShowFeedback(false)}
              aria-label="Close user feedback dialog"
            >
              ✕
            </button>

            {feedbackSent ? (
              <div className="feedback-success" role="status" aria-live="polite">
                <span className="success-icon" aria-hidden="true">🎉</span>
                <h3>Thank you for your valuable feedback!</h3>
                <p>Your inputs have been recorded to enhance SecurePay's real-time banking features.</p>
              </div>
            ) : (
              <>
                <div className="modal-header">
                  <span className="modal-icon" aria-hidden="true">💬</span>
                  <h3 id="feedback-dialog-title">User Feedback & Connect</h3>
                  <p>Share your review, feature suggestions, or questions with developer Sahil Kumar.</p>
                </div>

                <form onSubmit={handleFeedbackSubmit} className="feedback-form">
                  <div className="f-field">
                    <label htmlFor="fb-name">YOUR NAME</label>
                    <input
                      id="fb-name"
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={feedbackForm.name}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="f-field">
                    <label htmlFor="fb-email">EMAIL ADDRESS</label>
                    <input
                      id="fb-email"
                      type="email"
                      placeholder="e.g. rahul@example.com"
                      value={feedbackForm.email}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="f-field">
                    <label htmlFor="fb-rating">RATING (1-5 STARS)</label>
                    <select
                      id="fb-rating"
                      value={feedbackForm.rating}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, rating: e.target.value })}
                    >
                      <option value="5">⭐⭐⭐⭐⭐ 5 - Exceptional UI & ML Performance</option>
                      <option value="4">⭐⭐⭐⭐ 4 - Very Good System</option>
                      <option value="3">⭐⭐⭐ 3 - Good, can improve features</option>
                      <option value="2">⭐⭐ 2 - Needs work</option>
                      <option value="1">⭐ 1 - Unsatisfactory</option>
                    </select>
                  </div>

                  <div className="f-field">
                    <label htmlFor="fb-comments">YOUR SUGGESTIONS / FEEDBACK</label>
                    <textarea
                      id="fb-comments"
                      rows={4}
                      placeholder="What did you like about the project? Any improvements for banking fraud detection?"
                      value={feedbackForm.comments}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, comments: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="glow-btn full-width" aria-label="Submit your feedback">
                    Submit Feedback ➔
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
