// src/useSupabase.js
// Hope Forward — Cloud sync hook
// Psycovery · Handles loading, saving and syncing all user data

import { useState, useEffect, useCallback, useRef } from "react";
import {
  getSession, onAuthStateChange, signOut,
  loadProfile, saveProfile, dbToProfile,
  loadGoals, saveGoal, updateGoalStep, deleteGoal,
  recordHopeScore, loadHopeScoreHistory,
  loadLeaderboard,
  loadUserServices, submitUserService,
} from "./supabase";

export function useSupabase() {
  const [session, setSession] = useState(undefined); // undefined = loading
  const [userId, setUserId] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [cloudReady, setCloudReady] = useState(false);
  const lastScoreRef = useRef(null);

  // ── Auth state ─────────────────────────────────────────────────────────────
  useEffect(() => {
    getSession().then(s => {
      setSession(s);
      setUserId(s?.user?.id ?? null);
    });
    const unsub = onAuthStateChange(s => {
      setSession(s);
      setUserId(s?.user?.id ?? null);
    });
    return unsub;
  }, []);

  // ── Load all user data from Supabase ──────────────────────────────────────
  const loadAll = useCallback(async (uid) => {
    if (!uid) return null;
    setSyncing(true);
    try {
      const [profileRow, goals, leaderboard, userServices, scoreHistory] = await Promise.all([
        loadProfile(uid),
        loadGoals(uid),
        loadLeaderboard(),
        loadUserServices(),
        loadHopeScoreHistory(uid),
      ]);
      setCloudReady(true);
      return {
        profile:      dbToProfile(profileRow),
        goals:        goals ?? null,
        leaderboard:  leaderboard ?? null,
        userServices: userServices ?? [],
        scoreHistory: scoreHistory ?? [],
      };
    } catch (e) {
      console.error('[useSupabase] loadAll failed:', e);
      return null;
    } finally {
      setSyncing(false);
    }
  }, []);

  // ── Save profile ──────────────────────────────────────────────────────────
  const syncProfile = useCallback(async (profile) => {
    if (!userId) return;
    await saveProfile(userId, profile);
  }, [userId]);

  // ── Save a new goal (returns goal with cloud UUID) ───────────────────────
  const syncNewGoal = useCallback(async (goal) => {
    if (!userId) return goal;
    const saved = await saveGoal(userId, goal);
    return saved ?? goal; // saved has UUID id, fallback to local
  }, [userId]);

  // ── Toggle a step on a goal ───────────────────────────────────────────────
  const syncToggleStep = useCallback(async (goalId, completed, agency) => {
    if (!userId) return;
    await updateGoalStep(userId, goalId, completed, agency);
  }, [userId]);

  // ── Delete a goal ─────────────────────────────────────────────────────────
  const syncDeleteGoal = useCallback(async (goalId) => {
    if (!userId) return;
    await deleteGoal(goalId);
  }, [userId]);

  // ── Record hope score (deduplicated — only saves if changed) ─────────────
  const syncHopeScore = useCallback(async (score) => {
    if (!userId || score === lastScoreRef.current) return;
    lastScoreRef.current = score;
    await recordHopeScore(userId, score);
  }, [userId]);

  // ── Submit a community service ────────────────────────────────────────────
  const syncSubmitService = useCallback(async (service) => {
    if (!userId) return;
    await submitUserService(userId, service);
  }, [userId]);

  // ── Reload leaderboard ────────────────────────────────────────────────────
  const refreshLeaderboard = useCallback(async () => {
    const data = await loadLeaderboard();
    return data ?? null;
  }, []);

  // ── Sign out ──────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    await signOut();
    setSession(null);
    setUserId(null);
    setCloudReady(false);
    lastScoreRef.current = null;
  }, []);

  return {
    session,
    userId,
    syncing,
    cloudReady,
    isLoading: session === undefined,
    isLoggedIn: !!session,
    loadAll,
    syncProfile,
    syncNewGoal,
    syncToggleStep,
    syncDeleteGoal,
    syncHopeScore,
    syncSubmitService,
    refreshLeaderboard,
    logout,
  };
}
