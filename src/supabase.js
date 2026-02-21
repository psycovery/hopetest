// src/supabase.js
// Hope Forward — Supabase client & data layer
// Psycovery · All cloud sync logic lives here

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('[Supabase] Missing env vars — running in offline mode');
}

export const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// ── AUTH ─────────────────────────────────────────────────────────────────────

export async function signUp(email, password) {
  if (!supabase) return { error: { message: 'Offline mode' } };
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { data, error };
}

export async function signIn(email, password) {
  if (!supabase) return { error: { message: 'Offline mode' } };
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function getSession() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data?.session ?? null;
}

export function onAuthStateChange(callback) {
  if (!supabase) return () => {};
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
  return () => subscription.unsubscribe();
}

// ── PROFILE ───────────────────────────────────────────────────────────────────

export async function loadProfile(userId) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error && error.code !== 'PGRST116') console.error('[Supabase] loadProfile:', error);
  return data ?? null;
}

export async function saveProfile(userId, profile) {
  if (!supabase) return;
  const row = {
    id:                   userId,
    first_name:           profile.firstName || '',
    last_name:            profile.lastName || '',
    preferred_name:       profile.preferredName || '',
    name:                 profile.name || '',
    region:               profile.region || '',
    prison:               profile.prison || '',
    bio:                  profile.bio || '',
    photo:                profile.photo || '',
    onboarded:            profile.onboarded ?? false,
    purchased_hope_plan:  profile.purchasedHopePlan ?? false,
  };
  const { error } = await supabase.from('profiles').upsert(row);
  if (error) console.error('[Supabase] saveProfile:', error);
}

// Convert DB row → app profile shape
export function dbToProfile(row) {
  if (!row) return null;
  return {
    firstName:          row.first_name,
    lastName:           row.last_name,
    preferredName:      row.preferred_name,
    name:               row.name,
    region:             row.region,
    prison:             row.prison,
    bio:                row.bio,
    photo:              row.photo,
    onboarded:          row.onboarded,
    purchasedHopePlan:  row.purchased_hope_plan,
  };
}

// ── GOALS ─────────────────────────────────────────────────────────────────────

export async function loadGoals(userId) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });
  if (error) { console.error('[Supabase] loadGoals:', error); return null; }
  return data.map(dbToGoal);
}

export async function saveGoal(userId, goal) {
  if (!supabase) return;
  const row = {
    id:        typeof goal.id === 'number' ? undefined : goal.id, // new goals have numeric IDs
    user_id:   userId,
    title:     goal.title,
    category:  goal.category,
    steps:     goal.steps,
    completed: goal.completed,
    agency:    goal.agency,
  };
  // If numeric ID it's a local-only goal — insert new
  if (typeof goal.id === 'number') {
    const { data, error } = await supabase.from('goals').insert(row).select().single();
    if (error) console.error('[Supabase] saveGoal insert:', error);
    return data ? dbToGoal(data) : null;
  } else {
    const { error } = await supabase.from('goals').upsert({ ...row, id: goal.id });
    if (error) console.error('[Supabase] saveGoal upsert:', error);
    return null;
  }
}

export async function deleteGoal(goalId) {
  if (!supabase || typeof goalId === 'number') return;
  const { error } = await supabase.from('goals').delete().eq('id', goalId);
  if (error) console.error('[Supabase] deleteGoal:', error);
}

export async function updateGoalStep(userId, goalId, completed, agency) {
  if (!supabase || typeof goalId === 'number') return;
  const { error } = await supabase
    .from('goals')
    .update({ completed, agency, updated_at: new Date().toISOString() })
    .eq('id', goalId)
    .eq('user_id', userId);
  if (error) console.error('[Supabase] updateGoalStep:', error);
}

function dbToGoal(row) {
  return {
    id:        row.id,
    title:     row.title,
    category:  row.category,
    steps:     row.steps,
    completed: row.completed,
    agency:    row.agency,
  };
}

// ── HOPE SCORE ────────────────────────────────────────────────────────────────

export async function recordHopeScore(userId, score) {
  if (!supabase) return;
  const { error } = await supabase
    .from('hope_scores')
    .insert({ user_id: userId, score });
  if (error) console.error('[Supabase] recordHopeScore:', error);
}

export async function loadHopeScoreHistory(userId) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('hope_scores')
    .select('score, recorded_at')
    .eq('user_id', userId)
    .order('recorded_at', { ascending: true })
    .limit(30);
  if (error) { console.error('[Supabase] loadHopeScoreHistory:', error); return []; }
  return data;
}

// ── LEADERBOARD ───────────────────────────────────────────────────────────────

export async function loadLeaderboard() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('leaderboard_view')
    .select('id, name, region, prison, score')
    .order('score', { ascending: false })
    .limit(100);
  if (error) { console.error('[Supabase] loadLeaderboard:', error); return null; }
  return data;
}

// ── USER SERVICES ─────────────────────────────────────────────────────────────

export async function loadUserServices() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('user_services')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { console.error('[Supabase] loadUserServices:', error); return []; }
  return data;
}

export async function submitUserService(userId, service) {
  if (!supabase) return;
  const { error } = await supabase.from('user_services').insert({
    user_id:     userId,
    name:        service.name,
    category:    service.category,
    city:        service.city,
    address:     service.address || '',
    phone:       service.phone || '',
    website:     service.website || '',
    description: service.description || '',
  });
  if (error) console.error('[Supabase] submitUserService:', error);
}
