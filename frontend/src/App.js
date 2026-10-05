import React, { useState, useEffect, useMemo } from "react";
import {
    PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area,
    XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from "recharts";
import "./App.css";

const API_BASE = "http://localhost:8081";

const BANKS = ["HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank", "Kotak Mahindra Bank", "Punjab National Bank"];
const TXN_TYPES = ["UPI", "Debit Card", "Credit Card", "Net Banking", "IMPS", "NEFT", "Wire Request", "ATM Withdrawal"];
const DEVICES = ["Chrome · Windows", "Safari · MacBook", "Android 15 · Galaxy S24", "Android 15 · Pixel 8", "Unrecognised device · Chrome"];

const COLORS = { safe: "#2dd4bf", suspicious: "#facc15", fraud: "#f43f5e" };

function parseLocation(loc) {
    if (!loc) return { bank: "-", type: "-", card: "", merchant: "-", city: "-", device: "-" };
    const parts = loc.split("•").map((p) => p.trim());
    return {
        bank: parts[0] || "-",
        type: parts[1] || "-",
        card: parts[2] || "",
        merchant: parts[3] || "-",
        city: parts[4] || "-",
        device: parts[5] || "Unknown device",
    };
}

function riskBand(score) {
    const s = (score || 0) * 100;
    if (s < 20) return "0-20";
    if (s < 40) return "20-40";
    if (s < 60) return "40-60";
    if (s < 80) return "60-80";
    return "80-100";
}

function Login({ onLogin }) {
    const [mode, setMode] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const url = mode === "login" ? `${API_BASE}/auth/login` : `${API_BASE}/auth/register`;
    const payload = mode === "login" ? { email, password } : { name, email, phone, password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }

      if (!res.ok) {
        throw new Error(typeof data === "string" ? data : "Something went wrong");
      }

      onLogin(data);
    } catch (err) {
      setError(err.message || "Could not reach server");
    } finally {
      setLoading(false);
    }
  };

    return (
        <div className="login-shell">
            <div className="login-card">
                <div className="login-brand">
                    <div className="brand-icon">🛡️</div>
                    <div>
                        <div className="brand-name">SecurePay</div>
                        <div className="brand-sub">INTELLIGENT TRANSACTION SECURITY</div>
                    </div>
                </div>

                <h2>{mode === "login" ? "Analyst sign in" : "Create account"}</h2>
                <p className="login-sub">
                    {mode === "login"
                        ? "Access the fraud operations console with your workspace credentials."
                        : "Register a new analyst account to get started."}
                </p>

                <form onSubmit={handleSubmit}>
                    
                    {mode === "register" && (
                        <>
                            <div className="field">
                                <label>NAME</label>
                                <input type="text" placeholder="Sahil Kumar" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div className="field">
                                <label>PHONE NUMBER</label>
                                <input type="tel" placeholder="9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                            </div>
                        </>
                    )}
                    <div className="field">
                        <label>EMAIL</label>
                        <input type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="field">
                        <label>PASSWORD</label>
                        <input type="password" placeholder="••••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    {error && <div className="alert error">{error}</div>}
                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? "Please wait..." : mode === "login" ? "Enter secure console" : "Create account"}
                    </button>
                </form>

                <div className="login-switch">
                    {mode === "login" ? (
                        <>Don't have an account? <span onClick={() => { setMode("register"); setError(""); }}>Sign up</span></>
                    ) : (
                        <>Already have an account? <span onClick={() => { setMode("login"); setError(""); }}>Sign in</span></>
                    )}
                </div>

                <div className="login-footer">🔒 Session protected by device binding and behavioural checks.</div>
            </div>
        </div>
    );
}

function Sidebar({ page, setPage }) {
    const items = [
        { key: "overview", label: "Overview", icon: "📊" },
        { key: "monitoring", label: "Transaction Monitoring", icon: "📈" },
        { key: "detection", label: "Fraud Detection", icon: "🛰️" },
        { key: "analytics", label: "Analytics", icon: "📉" },
    ];
    return (
        <aside className="sidebar">
            <div className="brand">
                <div className="brand-icon">🛡️</div>
                <div>
                    <div className="brand-name">SecurePay</div>
                    <div className="brand-sub">INTELLIGENT TRANSACTION SECURITY</div>
                </div>
            </div>
            <div className="nav-label">OPERATIONS</div>
            <nav>
                {items.map((it) => (
                    <button
                        key={it.key}
                        className={`nav-item ${page === it.key ? "active" : ""}`}
                        onClick={() => setPage(it.key)}
                    >
                        <span className="nav-icon">{it.icon}</span>
                        {it.label}
                    </button>
                ))}
            </nav>
            <div className="engine-box">
                <div className="engine-dot">
                    <span className="pulse"></span> Engine online
                </div>
                <div className="engine-desc">Behavioural scoring model v1.0 · connected to live ML service</div>
            </div>
        </aside>
    );
}

function TopBar({ title, subtitle, user, onLogout }) {
    const initials = user?.name ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "SK";
    return (
        <div className="topbar">
            <div>
                <h1>{title}</h1>
                <p>{subtitle}</p>
            </div>
            <div className="topbar-right">
                <span className="live-pill"><span className="pulse"></span> Live monitoring</span>
                <span className="icon-btn">🔔</span>
                <span className="avatar" title={user?.email} onClick={onLogout} style={{ cursor: "pointer" }}>{initials}</span>
            </div>
        </div>
    );
}

function StatCard({ label, value, accent }) {
    return (
        <div className={`stat-card accent-${accent}`}>
            <div className="stat-label">{label}</div>
            <div className="stat-value">{value}</div>
        </div>
    );
}

function TxnTable({ transactions, compact }) {
    return (
        <div className="table-wrap">
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Bank / Card</th>
                    <th>Merchant</th>
                    <th>City</th>
                    {!compact && <th>Device</th>}
                    <th>Amount</th>
                    <th>Risk</th>
                    <th>Status</th>
                    <th>Time</th>
                </tr>
                </thead>
                <tbody>
                {transactions.length === 0 ? (
                    <tr><td colSpan="9" className="empty">No transactions yet</td></tr>
                ) : (
                    transactions.map((t) => {
                        const loc = parseLocation(t.location);
                        const risk = Math.round((t.fraudScore || 0) * 100);
                        return (
                            <tr key={t.id}>
                                <td className="mono">TXN-{String(t.id).padStart(4, "0")}</td>
                                <td>
                                    <div className="bank-cell">
                                        <strong>{loc.bank}</strong>
                                        <span>{loc.type} {loc.card}</span>
                                    </div>
                                </td>
                                <td>{loc.merchant}</td>
                                <td>{loc.city}</td>
                                {!compact && <td className="muted">{loc.device}</td>}
                                <td className="amount">₹{t.amount}</td>
                                <td>
                                    <div className="risk-wrap">
                                        <div className="risk-bar-bg">
                                            <div
                                                className="risk-bar-fill"
                                                style={{ width: `${risk}%`, background: risk > 60 ? COLORS.fraud : risk > 35 ? COLORS.suspicious : COLORS.safe }}
                                            ></div>
                                        </div>
                                        <span>{risk}</span>
                                    </div>
                                </td>
                                <td>
                    <span className={`badge ${t.status === "Flagged" ? "flagged" : "safe"}`}>
                      {t.status === "Flagged" ? "● Fraud Detected" : "● Safe"}
                    </span>
                                </td>
                                <td className="muted">{new Date(t.timestamp).toLocaleString()}</td>
                            </tr>
                        );
                    })
                )}
                </tbody>
            </table>
        </div>
    );
}

function getGreeting(){
    const hour = new Date().getHours();
    if(hour >= 4 && hour < 12) return "Good Morning!";
    if(hour >= 12 && hour < 17) return "Good Afternoon!";
    if(hour>= 17 && hour < 21) return "Good Evening!";
    return "Heyy Owl!!";
}
function Overview({ stats, transactions, user, onLogout }) {
    const recent = transactions.slice(0, 6);
    const firstName = user?.name ? user.name.split(" ")[0] : "there";
    return (
        <div className="page">
            <TopBar title="Security Overview" subtitle="Real-time posture across all monitored channels" user={user} onLogout={onLogout} />

            <div className="welcome-banner">
                <div>
                    <div className="eyebrow">WELCOME BACK</div>
                    <h2>{getGreeting()}, {firstName}</h2>
                    <p>
                        The engine scored {stats.total} transactions so far. {stats.flagged} were flagged as
                        suspicious and blocked automatically.
                    </p>
                </div>
                <button className="cta">Run a fraud check →</button>
            </div>

            <div className="stat-row">
                <StatCard label="Total Transactions" value={stats.total} accent="teal" />
                <StatCard label="Safe Transactions" value={stats.safe} accent="green" />
                <StatCard label="Fraud Detected" value={stats.flagged} accent="red" />
                <StatCard label="Avg Risk Score" value={`${stats.avgRisk}/100`} accent="yellow" />
                <StatCard label="Total Volume" value={`₹${stats.volume.toFixed(0)}`} accent="teal" />
            </div>

            <div className="panel">
                <h3>Recent transactions</h3>
                <TxnTable transactions={recent} compact />
            </div>
        </div>
    );
}

function Monitoring({ transactions, search, setSearch, filter, setFilter, total, user, onLogout }) {
    return (
        <div className="page">
            <TopBar title="Transaction Monitoring" subtitle="Every scored movement across cards, wires and digital channels" user={user} onLogout={onLogout} />

            <div className="panel">
                <div className="monitor-controls">
                    <input
                        className="search-input"
                        placeholder="Search by ID, bank, merchant or city"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="filter-pills">
                        {["All", "Safe", "Flagged"].map((f) => (
                            <button
                                key={f}
                                className={`pill ${filter === f ? "active" : ""}`}
                                onClick={() => setFilter(f)}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="showing">Showing {transactions.length} of {total} transactions</div>
                <TxnTable transactions={transactions} />
            </div>
        </div>
    );
}

function Detection({ user, onSubmitted, loading, setLoading, onLogout }) {
    const [form, setForm] = useState({
        accountHolder: user?.name || "",
        bank: BANKS[0],
        cardNumber: "",
        txnType: TXN_TYPES[0],
        merchant: "",
        city: "",
        device: DEVICES[0],
        amount: "",
    });
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        let { name, value } = e.target;
        if (name === "cardNumber") {
            value = value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
        }
        setForm({ ...form, [name]: value });
    };

    const generateMlFeatures = (amount) => {
        const features = { Time: Date.now() % 100000, Amount: parseFloat(amount) };
        for (let i = 1; i <= 28; i++) {
            features[`V${i}`] = parseFloat((Math.random() * 4 - 2).toFixed(2));
        }
        return features;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setResult(null);

        const digits = form.cardNumber.replace(/\s/g, "");
        const last4 = digits.slice(-4) || "0000";

        const payload = {
            userId: user?.id || 1,
            amount: parseFloat(form.amount),
            location: `${form.bank} • ${form.txnType} •${last4} • ${form.merchant || "Merchant"} • ${form.city || "Unknown City"} • ${form.device}`,
            mlFeatures: generateMlFeatures(form.amount),
        };

        try {
            const res = await fetch(`${API_BASE}/transaction`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error();
            const data = await res.json();
            setResult(data);
            onSubmitted();
        } catch {
            setError("Could not reach backend. Is Spring Boot running on port 8081?");
        } finally {
            setLoading(false);
        }
    };

    const risk = result ? Math.round((result.fraudScore || 0) * 100) : null;

    return (
        <div className="page">
            <TopBar title="Fraud Detection" subtitle="Score any transaction against the live ML model" user={user} onLogout={onLogout} />

            <div className="detect-grid">
                <div className="panel">
                    <h3>Analyse a transaction</h3>
                    <form onSubmit={handleSubmit} className="form">
                        <div className="field">
                            <label>Account Holder Name</label>
                            <input name="accountHolder" value={form.accountHolder} onChange={handleChange} placeholder="e.g. Sahil Kumar" required />
                        </div>
                        <div className="field-row">
                            <div className="field">
                                <label>Bank</label>
                                <select name="bank" value={form.bank} onChange={handleChange}>
                                    {BANKS.map((b) => <option key={b}>{b}</option>)}
                                </select>
                            </div>
                            <div className="field">
                                <label>Transaction Type</label>
                                <select name="txnType" value={form.txnType} onChange={handleChange}>
                                    {TXN_TYPES.map((t) => <option key={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="field">
                            <label>Card / Account Number</label>
                            <input name="cardNumber" value={form.cardNumber} onChange={handleChange} placeholder="1234 5678 9012 3456" maxLength={19} required />
                        </div>
                        <div className="field-row">
                            <div className="field">
                                <label>Merchant / Payee</label>
                                <input name="merchant" value={form.merchant} onChange={handleChange} placeholder="e.g. Amazon" required />
                            </div>
                            <div className="field">
                                <label>City</label>
                                <input name="city" value={form.city} onChange={handleChange} placeholder="e.g. Delhi" required />
                            </div>
                        </div>
                        <div className="field">
                            <label>Device</label>
                            <select name="device" value={form.device} onChange={handleChange}>
                                {DEVICES.map((d) => <option key={d}>{d}</option>)}
                            </select>
                        </div>
                        <div className="field">
                            <label>Amount (₹)</label>
                            <input type="number" step="0.01" name="amount" value={form.amount} onChange={handleChange} placeholder="0.00" required />
                        </div>
                        <button type="submit" disabled={loading}>{loading ? "Scoring..." : "Run detection"}</button>
                    </form>
                    {error && <div className="alert error">{error}</div>}
                </div>

                <div className="panel result-panel">
                    <h3>Detection result</h3>
                    {!result ? (
                        <div className="empty-result">
                            <div className="empty-icon">✨</div>
                            <div className="empty-title">No analysis yet</div>
                            <p>Fill the form and run detection to see the model's verdict.</p>
                        </div>
                    ) : (
                        <div className="result-body">
                            <div className={`result-status ${result.status === "Flagged" ? "flagged" : "safe"}`}>
                                {result.status === "Flagged" ? "⚠ Fraud Detected" : "✓ Transaction Safe"}
                            </div>
                            <div className="gauge-wrap">
                                <div className="gauge-bg">
                                    <div
                                        className="gauge-fill"
                                        style={{ width: `${risk}%`, background: risk > 60 ? COLORS.fraud : risk > 35 ? COLORS.suspicious : COLORS.safe }}
                                    ></div>
                                </div>
                                <div className="gauge-label">Risk score: {risk}/100</div>
                            </div>
                            <div className="result-grid">
                                <div><span>Amount</span><strong>₹{result.amount}</strong></div>
                                <div><span>Status</span><strong>{result.status}</strong></div>
                                <div><span>Txn ID</span><strong>TXN-{String(result.id).padStart(4, "0")}</strong></div>
                                <div><span>Scored at</span><strong>{new Date(result.timestamp).toLocaleTimeString()}</strong></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function Analytics({ stats, pieData, riskDist, transactions, user, onLogout }) {
    const volumeData = useMemo(() => {
        const byDay = {};
        transactions.forEach((t) => {
            const d = new Date(t.timestamp).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
            byDay[d] = (byDay[d] || 0) + t.amount;
        });
        return Object.entries(byDay).map(([date, amount]) => ({ date, amount }));
    }, [transactions]);

    const precision = stats.total ? Math.round((stats.safe / stats.total) * 1000) / 10 : 0;

    return (
        <div className="page">
            <TopBar title="Fraud Analytics" subtitle="Model performance and portfolio risk over time" user={user} onLogout={onLogout} />

            <div className="stat-row">
                <StatCard label="Detection Precision" value={`${precision}%`} accent="teal" />
                <StatCard label="Total Volume" value={`₹${stats.volume.toFixed(0)}`} accent="green" />
                <StatCard label="Flagged Transactions" value={stats.flagged} accent="red" />
                <StatCard label="Avg Risk Score" value={`${stats.avgRisk}/100`} accent="yellow" />
            </div>

            <div className="chart-grid">
                <div className="panel">
                    <h3>Safe vs flagged</h3>
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={3}>
                                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="panel">
                    <h3>Transaction volume</h3>
                    <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={volumeData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                            <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                            <YAxis stroke="#64748b" fontSize={11} />
                            <Tooltip />
                            <Area type="monotone" dataKey="amount" stroke={COLORS.safe} fill="url(#colorAmt)" />
                            <defs>
                                <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={COLORS.safe} stopOpacity={0.4} />
                                    <stop offset="95%" stopColor={COLORS.safe} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="panel">
                <h3>Risk score distribution</h3>
                <div className="risk-dist-row">
                    {riskDist.map((r) => (
                        <div className="risk-dist-col" key={r.band}>
                            <div
                                className="risk-dist-bar"
                                style={{
                                    height: `${Math.max(r.count * 20, 4)}px`,
                                    background: r.band === "80-100" ? COLORS.fraud : r.band === "60-80" ? "#fb923c" : r.band === "40-60" ? COLORS.suspicious : COLORS.safe,
                                }}
                            ></div>
                            <div className="risk-dist-label">{r.band}</div>
                            <div className="risk-dist-count">{r.count}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [page, setPage] = useState("overview");
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");

    const fetchTransactions = async () => {
    try {
      const res = await fetch(`${API_BASE}/transactions`);
      const data = await res.json();
      const userTxns = currentUser
        ? data.filter((t) => t.userId === currentUser.id)
        : data;
      setTransactions(userTxns.reverse());
    } catch (err) {
      console.error(err);
    }
  };

    useEffect(() => {
        if (!currentUser) return;
        fetchTransactions();
        const t = setInterval(fetchTransactions, 8000);
        return () => clearInterval(t);
    }, [currentUser]);

    const stats = useMemo(() => {
        const total = transactions.length;
        const flagged = transactions.filter((t) => t.status === "Flagged").length;
        const safe = total - flagged;
        const avgRisk = total
            ? Math.round((transactions.reduce((s, t) => s + (t.fraudScore || 0), 0) / total) * 100)
            : 0;
        const volume = transactions.reduce((s, t) => s + (t.amount || 0), 0);
        return { total, flagged, safe, avgRisk, volume };
    }, [transactions]);

    const pieData = [
        { name: "Safe", value: stats.safe, color: COLORS.safe },
        { name: "Flagged", value: stats.flagged, color: COLORS.fraud },
    ];

    const riskBands = ["0-20", "20-40", "40-60", "60-80", "80-100"];
    const riskDist = riskBands.map((band) => ({
        band,
        count: transactions.filter((t) => riskBand(t.fraudScore) === band).length,
    }));

    const filteredTxns = transactions.filter((t) => {
        const loc = parseLocation(t.location);
        const matchesSearch =
            !search ||
            loc.bank.toLowerCase().includes(search.toLowerCase()) ||
            loc.merchant.toLowerCase().includes(search.toLowerCase()) ||
            loc.city.toLowerCase().includes(search.toLowerCase()) ||
            String(t.id).includes(search);
        const matchesFilter =
            filter === "All" ||
            (filter === "Safe" && t.status !== "Flagged") ||
            (filter === "Flagged" && t.status === "Flagged");
        return matchesSearch && matchesFilter;
    });

    const handleLogout = () => {
        setCurrentUser(null);
        setPage("overview");
    };

    if (!currentUser) {
        return <Login onLogin={(user) => setCurrentUser(user)} />;
    }

    return (
        <div className="shell">
            <Sidebar page={page} setPage={setPage} />
            <div className="main">
                {page === "overview" && <Overview stats={stats} transactions={transactions} user={currentUser} onLogout={handleLogout} />}
                {page === "monitoring" && (
                    <Monitoring
                        transactions={filteredTxns}
                        search={search}
                        setSearch={setSearch}
                        filter={filter}
                        setFilter={setFilter}
                        total={transactions.length}
                        user={currentUser}
                        onLogout={handleLogout}
                    />
                )}
                {page === "detection" && (
                    <Detection user={currentUser} onSubmitted={fetchTransactions} loading={loading} setLoading={setLoading} onLogout={handleLogout} />
                )}
                {page === "analytics" && <Analytics stats={stats} pieData={pieData} riskDist={riskDist} transactions={transactions} user={currentUser} onLogout={handleLogout} />}
            </div>
        </div>
    );
}