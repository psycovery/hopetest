// src/AppRoot.jsx
// Hope Forward — Auth gate + cloud data loader
// Psycovery
//
// This component:
// 1. Shows a loading spinner while checking auth
// 2. Shows AuthScreen if not logged in
// 3. Loads all cloud data then passes it to HopeForward
// 4. Keeps HopeForward in sync with Supabase on every change

import { useState, useEffect, useCallback } from "react";
import { useSupabase } from "./useSupabase";
import AuthScreen from "./AuthScreen";
import HopeForward from "./HopeForward";

const BLUE = "#4DAFE8";
const GOLD = "#F5C518";

// ── Loading splash ─────────────────────────────────────────────────────────
function LoadingScreen({ message = "Loading..." }) {
  return (
    <div style={{ fontFamily: "'Segoe UI',sans-serif", maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: `linear-gradient(135deg, ${BLUE}, #2e86c1)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
      <div style={{ width: 72, height: 72, borderRadius: 20, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid rgba(255,255,255,0.3)" }}>
        <span style={{ fontSize: 36 }}>🌅</span>
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>Hope Forward</div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>powered by <span style={{ color: GOLD, fontWeight: 700 }}>Psycovery</span></div>
      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff", opacity: 0.6,
            animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
        ))}
      </div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>{message}</div>
      <style>{`@keyframes bounce{0%,60%,100%{transform:translateY(0);opacity:0.4}30%{transform:translateY(-8px);opacity:1}}`}</style>
    </div>
  );
}

export default function AppRoot() {
  const {
    session, userId, isLoading, isLoggedIn,
    loadAll, syncProfile, syncNewGoal, syncToggleStep,
    syncDeleteGoal, syncHopeScore, syncSubmitService,
    refreshLeaderboard, logout,
  } = useSupabase();

  const [cloudData, setCloudData] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);

  // Load cloud data when user logs in
  useEffect(() => {
    if (!userId) { setCloudData(null); return; }
    setDataLoading(true);
    loadAll(userId).then(data => {
      setCloudData(data);
      setDataLoading(false);
    });
  }, [userId, loadAll]);

  // Callbacks passed into HopeForward so it can sync changes up
  const handleProfileSave = useCallback(async (profile) => {
    await syncProfile({ ...profile, onboarded: true });
  }, [syncProfile]);

  const handleNewGoal = useCallback(async (goal) => {
    return await syncNewGoal(goal);
  }, [syncNewGoal]);

  const handleToggleStep = useCallback(async (goalId, completed, agency) => {
    await syncToggleStep(goalId, completed, agency);
  }, [syncToggleStep]);

  const handleDeleteGoal = useCallback(async (goalId) => {
    await syncDeleteGoal(goalId);
  }, [syncDeleteGoal]);

  const handleHopeScore = useCallback(async (score) => {
    await syncHopeScore(score);
  }, [syncHopeScore]);

  const handleSubmitService = useCallback(async (service) => {
    await syncSubmitService(service);
  }, [syncSubmitService]);

  const handleRefreshLeaderboard = useCallback(async () => {
    return await refreshLeaderboard();
  }, [refreshLeaderboard]);

  // ── Auth loading ────────────────────────────────────────────────────────
  if (isLoading) return <LoadingScreen message="Checking your account..." />;

  // ── Not logged in ───────────────────────────────────────────────────────
  if (!isLoggedIn) return <AuthScreen onAuth={() => {}} />;

  // ── Loading cloud data ──────────────────────────────────────────────────
  if (dataLoading || !cloudData) return <LoadingScreen message="Loading your progress..." />;

  // ── Main app ────────────────────────────────────────────────────────────
  return (
    <HopeForward
      // Inject cloud data as initial state
      cloudProfile={cloudData.profile}
      cloudGoals={cloudData.goals}
      cloudLeaderboard={cloudData.leaderboard}
      cloudUserServices={cloudData.userServices}
      cloudScoreHistory={cloudData.scoreHistory}

      // Sync callbacks
      onProfileSave={handleProfileSave}
      onNewGoal={handleNewGoal}
      onToggleStep={handleToggleStep}
      onDeleteGoal={handleDeleteGoal}
      onHopeScore={handleHopeScore}
      onSubmitService={handleSubmitService}
      onRefreshLeaderboard={handleRefreshLeaderboard}
      onLogout={logout}
    />
  );
}
