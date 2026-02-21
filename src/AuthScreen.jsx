// src/AuthScreen.jsx
// Hope Forward — Login / Sign Up screen
// Psycovery

import { useState } from "react";
import { signIn, signUp } from "./supabase";

const BLUE = "#4DAFE8";
const GOLD = "#F5C518";
const GRAD = `linear-gradient(135deg, ${BLUE}, #2e86c1)`;

export default function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login"); // login | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const inp = (extra = {}) => ({
    border: "1.5px solid #e0e0e0", borderRadius: 12, padding: "13px 14px",
    fontSize: 15, outline: "none", width: "100%", boxSizing: "border-box",
    fontFamily: "inherit", background: "#f4f7fb", color: "#333", ...extra,
  });

  const handleSubmit = async () => {
    setError(""); setSuccess("");
    if (!email.trim() || !password.trim()) { setError("Please enter your email and password."); return; }
    if (mode === "signup" && password !== confirm) { setError("Passwords don't match."); return; }
    if (mode === "signup" && password.length < 6) { setError("Password must be at least 6 characters."); return; }

    setLoading(true);
    if (mode === "login") {
      const { data, error: err } = await signIn(email.trim(), password);
      if (err) { setError(err.message); setLoading(false); return; }
      onAuth(data.session);
    } else {
      const { data, error: err } = await signUp(email.trim(), password);
      if (err) { setError(err.message); setLoading(false); return; }
      if (data.session) {
        onAuth(data.session);
      } else {
        setSuccess("Account created! Check your email to confirm, then log in.");
        setMode("login");
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: "'Segoe UI',sans-serif", maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#f4f7fb", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ background: GRAD, padding: "48px 28px 40px", textAlign: "center" }}>
        {/* Psycovery logo mark */}
        <div style={{ width: 72, height: 72, borderRadius: 20, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", border: "2px solid rgba(255,255,255,0.3)" }}>
          <svg width="48" height="48" viewBox="0 0 100 100">
            <path d="M50 8 C76 5, 95 26, 92 50 C89 72, 70 89, 50 90 C33 91, 14 79, 10 61" fill="none" stroke="#FFD700" strokeWidth="7.5" strokeLinecap="round"/>
            <path d="M15 38 C10 20, 26 6, 46 8 C66 10, 82 26, 80 46 C78 63, 64 76, 50 78" fill="none" stroke="#FFC200" strokeWidth="6" strokeLinecap="round"/>
            <path d="M50 22 C64 20, 76 32, 76 46 C76 60, 65 72, 52 73" fill="none" stroke="#FFE566" strokeWidth="4.5" strokeLinecap="round"/>
            <circle cx="50" cy="50" r="10" fill="#FFD700"/>
            {Array.from({length:16},(_,i)=>{const a=(i*22.5)*Math.PI/180;return <line key={i} x1={50+12*Math.cos(a)} y1={50+12*Math.sin(a)} x2={50+17*Math.cos(a)} y2={50+17*Math.sin(a)} stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round"/>;})}
          </svg>
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", marginBottom: 4 }}>Hope Forward</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>powered by <span style={{ color: GOLD }}>Psycovery</span></div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 8, lineHeight: 1.5 }}>
          Your progress, goals and hope score — saved forever, on any device.
        </div>
      </div>

      {/* Form */}
      <div style={{ flex: 1, padding: "28px 24px" }}>
        {/* Mode toggle */}
        <div style={{ display: "flex", background: "#e8edf2", borderRadius: 12, padding: 4, marginBottom: 24 }}>
          {["login", "signup"].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(""); setSuccess(""); }}
              style={{ flex: 1, padding: "10px", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 700, transition: "all 0.2s",
                background: mode === m ? "#fff" : "transparent",
                color: mode === m ? BLUE : "#888",
                boxShadow: mode === m ? "0 2px 8px rgba(0,0,0,0.1)" : "none" }}>
              {m === "login" ? "Log In" : "Create Account"}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 6 }}>Email address</div>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com" style={inp()}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
            />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 6 }}>Password</div>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder={mode === "signup" ? "At least 6 characters" : "Your password"} style={inp()}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
            />
          </div>
          {mode === "signup" && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 6 }}>Confirm password</div>
              <input
                type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                placeholder="Repeat your password" style={inp()}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
              />
            </div>
          )}

          {error && (
            <div style={{ background: "#fff5f5", borderRadius: 10, padding: "10px 14px", borderLeft: "4px solid #e74c3c", fontSize: 13, color: "#c0392b" }}>
              ⚠️ {error}
            </div>
          )}
          {success && (
            <div style={{ background: "#f0fff4", borderRadius: 10, padding: "10px 14px", borderLeft: "4px solid #5CB85C", fontSize: 13, color: "#2d6a2d" }}>
              ✅ {success}
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading}
            style={{ background: loading ? "#ccc" : GRAD, border: "none", borderRadius: 14, padding: "16px", color: "#fff", fontSize: 15, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", marginTop: 4, boxShadow: loading ? "none" : `0 4px 16px ${BLUE}55` }}>
            {loading ? "Please wait..." : mode === "login" ? "Log In to Hope Forward" : "Create My Account"}
          </button>
        </div>

        {/* Privacy note */}
        <div style={{ marginTop: 24, textAlign: "center", fontSize: 11, color: "#aaa", lineHeight: 1.6 }}>
          Your data is encrypted and stored securely.<br/>
          We never sell your data. <a href="https://psycovery.co.uk/privacy" target="_blank" rel="noopener noreferrer" style={{ color: BLUE }}>Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}
