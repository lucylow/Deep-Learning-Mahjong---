import { useState } from 'react'
import type React from 'react'

/* ─── COLOR TOKENS ─── */
const C = {
  ink: '#08080E',
  navy: '#0D1529',
  navyMid: '#152040',
  jade: '#1A3A2F',
  jadeLight: '#234D3E',
  jadeDark: '#0F2820',
  ivory: '#F5F0E8',
  ivoryDim: '#C0BBA8',
  ivoryMuted: '#7A776F',
  brass: '#B8955A',
  brassBright: '#D4AF70',
  brassDark: '#7A6238',
  brassGlass: 'rgba(184,149,90,0.12)',
  brassGlassBorder: 'rgba(184,149,90,0.25)',
  vermilion: '#CC2200',
  glass: 'rgba(255,255,255,0.04)',
  glassBorder: 'rgba(255,255,255,0.08)',
}

type Screen = 'home' | 'arena' | 'game' | 'result' | 'profile' | 'review' | 'learn'
  | 'import-game' | 'review-overview' | 'decision-moment' | 'practice-drill'
  | 'journey-onboard' | 'journey-home' | 'journey-table' | 'journey-game'
  | 'journey-learn' | 'journey-result' | 'journey-friends' | 'journey-profile'
  | 'copilot-setup' | 'copilot-table' | 'copilot-review' | 'copilot-settings'
  | 'lab-home' | 'lab-library' | 'lab-builder' | 'lab-memory' | 'lab-match'
  | 'lab-experiment' | 'lab-compare' | 'lab-results' | 'lab-ethics'

/* ─── TILE COMPONENT ─── */
type TSize = 'xs' | 'sm' | 'md'
const TS: Record<TSize, { w: number; h: number; f: number }> = {
  xs: { w: 18, h: 25, f: 8 },
  sm: { w: 23, h: 32, f: 10 },
  md: { w: 33, h: 46, f: 14 },
}

const TM: Record<string, { ch: string; col: string; sub?: string }> = {
  '1m': { ch: '一', col: '#1A1000' }, '2m': { ch: '二', col: '#1A1000' }, '3m': { ch: '三', col: '#1A1000' },
  '4m': { ch: '四', col: '#1A1000' }, '5m': { ch: '五', col: '#AA0000' }, '6m': { ch: '六', col: '#1A1000' },
  '7m': { ch: '七', col: '#1A1000' }, '8m': { ch: '八', col: '#1A1000' }, '9m': { ch: '九', col: '#1A1000' },
  '1p': { ch: '①', col: '#0A2060' }, '2p': { ch: '②', col: '#0A2060' }, '3p': { ch: '③', col: '#0A2060' },
  '4p': { ch: '④', col: '#0A2060' }, '5p': { ch: '⑤', col: '#AA0000' }, '6p': { ch: '⑥', col: '#0A2060' },
  '7p': { ch: '⑦', col: '#0A2060' }, '8p': { ch: '⑧', col: '#0A2060' }, '9p': { ch: '⑨', col: '#0A2060' },
  '1s': { ch: '１', col: '#0A4020', sub: '竹' }, '2s': { ch: '２', col: '#0A4020', sub: '竹' },
  '3s': { ch: '３', col: '#0A4020', sub: '竹' }, '4s': { ch: '４', col: '#0A4020', sub: '竹' },
  '5s': { ch: '５', col: '#AA0000', sub: '竹' }, '6s': { ch: '６', col: '#0A4020', sub: '竹' },
  '7s': { ch: '７', col: '#0A4020', sub: '竹' }, '8s': { ch: '８', col: '#0A4020', sub: '竹' },
  '9s': { ch: '９', col: '#0A4020', sub: '竹' },
  'E': { ch: '東', col: '#1A1000' }, 'S': { ch: '南', col: '#1A1000' },
  'W': { ch: '西', col: '#1A1000' }, 'N': { ch: '北', col: '#1A1000' },
  'Haku': { ch: '白', col: '#1A1000' }, 'Hatsu': { ch: '発', col: '#0A4020' }, 'Chun': { ch: '中', col: '#AA0000' },
}

function Tile({ n, size = 'md', sel = false, fd = false, onClick }: {
  n: string; size?: TSize; sel?: boolean; fd?: boolean; onClick?: () => void
}) {
  const s = TS[size]
  if (fd) return (
    <div style={{
      width: s.w, height: s.h, borderRadius: 3, flexShrink: 0,
      background: 'linear-gradient(145deg,#1A2A4A,#0D1629)',
      border: '1px solid rgba(184,149,90,0.2)', boxShadow: '0 2px 5px rgba(0,0,0,0.6)',
    }} />
  )
  const t = TM[n] || { ch: n, col: '#1A1000' }
  return (
    <div onClick={onClick} style={{
      width: s.w, height: s.h, borderRadius: 3, flexShrink: 0,
      background: 'linear-gradient(155deg,#FFFFFF,#F5F0E8 40%,#EDE8DE)',
      border: sel ? `1.5px solid ${C.brass}` : '1px solid rgba(150,140,120,0.5)',
      boxShadow: sel
        ? `0 0 14px rgba(184,149,90,0.4),0 5px 10px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.9)`
        : `0 3px 6px rgba(0,0,0,0.45),inset 0 1px 0 rgba(255,255,255,0.9)`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', transform: sel ? 'translateY(-10px)' : 'none',
      transition: 'transform 0.15s ease,box-shadow 0.15s ease',
    }}>
      <span style={{ fontSize: s.f, color: t.col, fontFamily: 'Noto Serif JP,serif', fontWeight: 700, lineHeight: 1, userSelect: 'none' }}>
        {t.ch}
      </span>
      {t.sub && <span style={{ fontSize: s.f * 0.6, color: t.col, opacity: 0.6, fontFamily: 'Noto Serif JP,serif', lineHeight: 1 }}>{t.sub}</span>}
    </div>
  )
}

/* ─── TOGGLE ─── */
function Toggle({ val, onToggle }: { val: boolean; onToggle: () => void }) {
  return (
    <div onClick={onToggle} style={{
      width: 44, height: 24, borderRadius: 12, cursor: 'pointer', flexShrink: 0,
      background: val ? C.brass : 'rgba(255,255,255,0.15)',
      position: 'relative', transition: 'background 0.2s',
    }}>
      <div style={{
        position: 'absolute', top: 2, left: val ? 22 : 2,
        width: 20, height: 20, borderRadius: 10, background: 'white',
        transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
      }} />
    </div>
  )
}

function SettingRow({ label, desc, val, onToggle }: { label: string; desc?: string; val: boolean; onToggle: () => void }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '13px 16px', borderRadius: 12, marginBottom: 6,
      background: C.glass, border: `1px solid ${C.glassBorder}`,
    }}>
      <div>
        <span style={{ color: C.ivoryDim, fontSize: 13, fontFamily: 'Inter,sans-serif', display: 'block' }}>{label}</span>
        {desc && <span style={{ color: C.ivoryMuted, fontSize: 10, fontFamily: 'Inter,sans-serif' }}>{desc}</span>}
      </div>
      <Toggle val={val} onToggle={onToggle} />
    </div>
  )
}

/* ─── STATUS BAR ─── */
function StatusBar() {
  return (
    <div style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px 0', flexShrink: 0 }}>
      <span style={{ color: C.ivory, fontSize: 15, fontWeight: 600, fontFamily: 'Inter,sans-serif' }}>9:41</span>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <svg width="17" height="12" viewBox="0 0 17 12" fill={C.ivory}>
          <rect x="0" y="8" width="3" height="4" rx="0.5" />
          <rect x="4.5" y="5" width="3" height="7" rx="0.5" />
          <rect x="9" y="2" width="3" height="10" rx="0.5" />
          <rect x="13.5" y="0" width="3" height="12" rx="0.5" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M8 9a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" fill={C.ivory} />
          <path d="M8 5.5C6.3 5.5 4.8 6.2 3.7 7.3l1 1c.8-.8 1.9-1.3 3.3-1.3s2.5.5 3.3 1.3l1-1C11.2 6.2 9.7 5.5 8 5.5z" fill={C.ivory} />
          <path d="M8 1.5C5.2 1.5 2.7 2.6 1 4.5l1 1C3.5 4 5.6 3 8 3s4.5 1 5.9 2.5l1-1C13.3 2.6 10.8 1.5 8 1.5z" fill={C.ivory} />
        </svg>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 23, height: 11, border: '1.5px solid rgba(255,255,255,0.5)', borderRadius: 3, padding: 1.5 }}>
            <div style={{ width: '80%', height: '100%', background: C.ivory, borderRadius: 1 }} />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── BOTTOM NAV ─── */
const TABS = [
  { id: 'home', label: 'Home' },
  { id: 'arena', label: 'Arena' },
  { id: 'review', label: 'Review' },
  { id: 'learn', label: 'Learn' },
  { id: 'profile', label: 'Profile' },
]

function NavIcon({ type, active }: { type: string; active: boolean }) {
  const col = active ? C.brass : '#55524D'
  const sw = active ? '1.8' : '1.5'
  const icons: Record<string, React.ReactElement> = {
    home: <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
      <path d="M3 12L12 3l9 9" stroke={col} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10v10a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1V10" stroke={col} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </svg>,
    arena: <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
      <rect x="4" y="8" width="6" height="9" rx="1" stroke={col} strokeWidth={sw} />
      <rect x="14" y="4" width="6" height="13" rx="1" stroke={col} strokeWidth={sw} />
      <path d="M3 19.5h18" stroke={col} strokeWidth={sw} strokeLinecap="round" />
    </svg>,
    review: <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" stroke={col} strokeWidth={sw} />
      <path d="M12 7v5l3 3" stroke={col} strokeWidth={sw} strokeLinecap="round" />
    </svg>,
    learn: <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
      <path d="M4 19V7a2 2 0 012-2h12a2 2 0 012 2v12" stroke={col} strokeWidth={sw} strokeLinecap="round" />
      <path d="M4 19h16M8 11h8M8 15h5" stroke={col} strokeWidth={sw} strokeLinecap="round" />
    </svg>,
    profile: <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="4" stroke={col} strokeWidth={sw} />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={col} strokeWidth={sw} strokeLinecap="round" />
    </svg>,
  }
  return icons[type] || <svg width="22" height="22" />
}

function BottomNav({ active, onNav }: { active: string; onNav: (t: string) => void }) {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, height: 83,
      background: 'rgba(8,8,14,0.97)', backdropFilter: 'blur(24px)',
      borderTop: `0.5px solid ${C.brassGlassBorder}`,
      display: 'flex', alignItems: 'flex-start', paddingTop: 10,
    }}>
      {TABS.map(t => (
        <button key={t.id} onClick={() => onNav(t.id)} style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        }}>
          <NavIcon type={t.id} active={active === t.id} />
          <span style={{
            fontSize: 10, fontFamily: 'Inter,sans-serif', letterSpacing: 0.2,
            fontWeight: active === t.id ? 600 : 400,
            color: active === t.id ? C.brass : '#55524D',
          }}>{t.label}</span>
        </button>
      ))}
    </div>
  )
}

/* ─── HOME SCREEN ─── */
function HomeScreen({ onNav, appMode = 'arena', onSwitchMode }: {
  onNav: (s: Screen) => void
  appMode?: 'arena' | 'journey' | 'copilot' | 'lab'
  onSwitchMode?: (m: 'arena' | 'journey' | 'copilot' | 'lab') => void
}) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 0' }}>
      {onSwitchMode && <ModeSwitcher mode={appMode} onSwitch={onSwitchMode} />}
      {/* Player profile row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 16, flexShrink: 0,
          background: 'linear-gradient(135deg,#2A3A6A,#4A2A5A)',
          border: `2px solid ${C.brass}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 14px rgba(184,149,90,0.28)`,
        }}>
          <span style={{ color: C.ivory, fontSize: 20, fontFamily: 'Noto Serif JP,serif', fontWeight: 700 }}>雅</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
            <span style={{ color: C.ivory, fontSize: 16, fontWeight: 700, fontFamily: 'Noto Serif JP,serif' }}>Miya_Hana</span>
            <span style={{
              fontSize: 10, fontWeight: 700, color: C.brass, fontFamily: 'Inter,sans-serif',
              background: C.brassGlass, padding: '2px 7px', borderRadius: 8,
              border: `1px solid ${C.brassGlassBorder}`, letterSpacing: 0.8,
            }}>GOLD III</span>
          </div>
          <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden', width: 160 }}>
            <div style={{ width: '68%', height: '100%', background: `linear-gradient(90deg,${C.brassDark},${C.brass})`, borderRadius: 3 }} />
          </div>
          <span style={{ color: C.ivoryMuted, fontSize: 10, fontFamily: 'Inter,sans-serif', marginTop: 3, display: 'block' }}>1,847 / 2,000 pts · Season 4</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ color: C.brassBright, fontSize: 15, fontWeight: 700, fontFamily: 'JetBrains Mono,monospace', display: 'block' }}>2.41</span>
          <span style={{ color: C.ivoryMuted, fontSize: 9, fontFamily: 'Inter,sans-serif' }}>avg place</span>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        {[
          { label: 'Continue\nMatch', icon: '▶', cb: () => onNav('game') },
          { label: 'Practice\nwith AI', icon: '◆', primary: true, cb: () => onNav('arena') },
          { label: 'Review\nLast Game', icon: '↺', cb: () => onNav('result') },
        ].map(a => (
          <button key={a.label} onClick={a.cb} style={{
            flex: 1, padding: '11px 4px',
            background: a.primary ? C.brassGlass : C.glass,
            border: `1px solid ${a.primary ? C.brassGlassBorder : C.glassBorder}`,
            borderRadius: 16, cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
          }}>
            <span style={{ fontSize: 15, color: a.primary ? C.brass : C.ivoryMuted }}>{a.icon}</span>
            <span style={{
              fontSize: 10, fontFamily: 'Inter,sans-serif', fontWeight: 500, lineHeight: 1.3,
              color: a.primary ? C.ivory : C.ivoryDim, textAlign: 'center', whiteSpace: 'pre-line',
            }}>{a.label}</span>
          </button>
        ))}
      </div>

      {/* Tonight's Challenge hero */}
      <div style={{
        borderRadius: 22, marginBottom: 18, position: 'relative', overflow: 'hidden',
        background: `linear-gradient(135deg,${C.navyMid} 0%,${C.jade} 55%,${C.jadeDark} 100%)`,
        border: `1px solid ${C.brassGlassBorder}`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.5)`,
        padding: '22px 20px 20px',
      }}>
        <div style={{
          position: 'absolute', top: 0, right: 0, width: 130, height: 130,
          background: `radial-gradient(circle at 75% 25%,rgba(184,149,90,0.18) 0%,transparent 70%)`,
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'repeating-linear-gradient(45deg,rgba(184,149,90,0.025) 0px,rgba(184,149,90,0.025) 1px,transparent 1px,transparent 18px)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
            <div style={{ width: 6, height: 6, borderRadius: 3, background: C.vermilion, boxShadow: `0 0 6px ${C.vermilion}` }} />
            <span style={{ color: C.brass, fontSize: 10, fontWeight: 700, fontFamily: 'Inter,sans-serif', letterSpacing: 1.4, textTransform: 'uppercase' }}>Tonight's Challenge</span>
          </div>
          <h2 style={{ color: C.ivory, fontSize: 21, fontWeight: 700, fontFamily: 'Noto Serif JP,serif', lineHeight: 1.3, marginBottom: 8 }}>
            Phoenix Cup — East Round Sprint
          </h2>
          <p style={{ color: C.ivoryDim, fontSize: 12, fontFamily: 'Inter,sans-serif', lineHeight: 1.65, marginBottom: 16 }}>
            4-game East-round series. Top 2 finishers advance to the weekly qualifier. Ranked points at stake.
          </p>
          <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
            {['East Rounds', '4 Players', 'Ranked'].map(tag => (
              <span key={tag} style={{
                fontSize: 10, fontFamily: 'Inter,sans-serif', color: C.ivoryDim,
                background: 'rgba(255,255,255,0.07)', padding: '3px 9px', borderRadius: 8,
                border: `1px solid ${C.glassBorder}`,
              }}>{tag}</span>
            ))}
          </div>
          <button onClick={() => onNav('arena')} style={{
            width: '100%', padding: '13px', borderRadius: 14, cursor: 'pointer',
            background: `linear-gradient(135deg,${C.brass},${C.brassBright})`,
            border: 'none', boxShadow: `0 4px 18px rgba(184,149,90,0.38)`,
          }}>
            <span style={{ color: C.ink, fontSize: 15, fontWeight: 700, fontFamily: 'Inter,sans-serif', letterSpacing: 0.4 }}>Enter Arena</span>
          </button>
        </div>
      </div>

      {/* Recent results */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ color: C.ivory, fontSize: 14, fontWeight: 600, fontFamily: 'Noto Serif JP,serif' }}>Recent Results</span>
          <span style={{ color: C.brass, fontSize: 11, fontFamily: 'Inter,sans-serif', cursor: 'pointer' }}>See all</span>
        </div>
        <div style={{ display: 'flex', gap: 7 }}>
          {[
            { p: 1, s: '+48', g: 'E2', c: C.brass },
            { p: 2, s: '+12', g: 'E1', c: C.ivoryDim },
            { p: 3, s: '−18', g: 'E4', c: C.ivoryMuted },
            { p: 1, s: '+62', g: 'E3', c: C.brass },
            { p: 4, s: '−40', g: 'E2', c: C.vermilion },
          ].map((r, i) => (
            <div key={i} style={{
              flex: 1, borderRadius: 14, padding: '10px 4px',
              background: r.p === 1 ? C.brassGlass : C.glass,
              border: `1px solid ${r.p === 1 ? C.brassGlassBorder : C.glassBorder}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            }}>
              <span style={{ fontSize: 19, fontWeight: 800, fontFamily: 'JetBrains Mono,monospace', color: r.c }}>{r.p}</span>
              <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono,monospace', fontWeight: 600, color: r.s.startsWith('+') ? '#4CAF50' : '#CC4444' }}>{r.s}</span>
              <span style={{ fontSize: 9, color: C.ivoryMuted, fontFamily: 'Inter,sans-serif' }}>{r.g}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI status card */}
      <div style={{
        borderRadius: 18, padding: '15px 16px', marginBottom: 20,
        background: C.glass, border: `1px solid ${C.glassBorder}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ color: C.ivory, fontSize: 13, fontWeight: 600, fontFamily: 'Noto Serif JP,serif' }}>AI Opponent</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 7, height: 7, borderRadius: 4, background: '#4CAF50', boxShadow: '0 0 6px rgba(76,175,80,0.5)' }} />
            <span style={{ color: '#4CAF50', fontSize: 10, fontFamily: 'Inter,sans-serif' }}>Ready</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12, flexShrink: 0,
            background: 'linear-gradient(135deg,#2A4A3A,#1A2A3A)',
            border: `1px solid ${C.brassGlassBorder}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: C.brass, fontSize: 18, fontFamily: 'Noto Serif JP,serif', fontWeight: 700 }}>美</span>
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ color: C.ivory, fontSize: 14, fontWeight: 600, fontFamily: 'Noto Serif JP,serif', display: 'block' }}>Mika · Balanced</span>
            <div style={{ display: 'flex', gap: 5, marginTop: 4 }}>
              {['Ukeire Focus', 'Even Tempo'].map(t => (
                <span key={t} style={{ fontSize: 9, fontFamily: 'Inter,sans-serif', color: C.ivoryMuted, background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: 5, border: `1px solid ${C.glassBorder}` }}>{t}</span>
              ))}
            </div>
          </div>
          <button onClick={() => onNav('arena')} style={{
            padding: '7px 12px', borderRadius: 10,
            background: C.brassGlass, border: `1px solid ${C.brassGlassBorder}`, cursor: 'pointer',
          }}>
            <span style={{ color: C.brass, fontSize: 11, fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>Change</span>
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── ARENA SCREEN ─── */
function ArenaScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const [mode, setMode] = useState<'Casual' | 'Ranked' | 'Scenario'>('Ranked')

  const opponents = [
    {
      name: 'Mika', title: 'Balanced Analyst', style: 'Balanced', diff: 3,
      desc: 'Maximises tile acceptance across all suit paths. Adapts to defence when an opponent reaches riichi. Rarely takes unnecessary risks.',
      traits: ['Ukeire Focus', 'Adaptive Defence', 'Steady Tempo'],
      grad: ['#3A2A6A', '#5A3A8A'], kanji: '美',
    },
    {
      name: 'Ren', title: 'Aggressive Chaser', style: 'Aggressive', diff: 4,
      desc: 'Pursues speed and tsumo wins. High risk tolerance — will push through potentially dangerous tiles to complete fast hands.',
      traits: ['Speed Dealer', 'High Risk Pushes', 'Tsumo Hunter'],
      grad: ['#6A1A1A', '#8A2A20'], kanji: '烈',
    },
    {
      name: 'Sora', title: 'Defensive Wall', style: 'Defensive', diff: 2,
      desc: 'Prioritises deal-in avoidance above all. Switches to full defence after first riichi. Patient, waits for safe openings.',
      traits: ['Deal-in Shield', 'Patient Play', 'Safe Discards'],
      grad: ['#1A3A5A', '#2A4A70'], kanji: '蒼',
    },
  ]

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 0' }}>
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ color: C.ivory, fontSize: 22, fontWeight: 700, fontFamily: 'Noto Serif JP,serif', marginBottom: 4 }}>Choose Opponent</h1>
        <p style={{ color: C.ivoryMuted, fontSize: 12, fontFamily: 'Inter,sans-serif', lineHeight: 1.5 }}>
          AI behaviour is probabilistic — based on visible tiles and inferred patterns, not guaranteed play.
        </p>
      </div>

      {/* Mode selector */}
      <div style={{
        display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 12,
        padding: 3, marginBottom: 20, border: `1px solid ${C.glassBorder}`,
      }}>
        {(['Casual', 'Ranked', 'Scenario'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)} style={{
            flex: 1, padding: '9px 4px', borderRadius: 9, cursor: 'pointer',
            border: mode === m ? `1px solid ${C.brassGlassBorder}` : '1px solid transparent',
            background: mode === m ? C.brassGlass : 'transparent',
          }}>
            <span style={{
              fontSize: 12, fontFamily: 'Inter,sans-serif', fontWeight: mode === m ? 600 : 400,
              color: mode === m ? C.ivory : C.ivoryMuted,
            }}>{m}</span>
          </button>
        ))}
      </div>

      {/* Opponent cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
        {opponents.map(opp => (
          <div key={opp.name} style={{
            borderRadius: 22, overflow: 'hidden',
            background: `linear-gradient(160deg,${C.navyMid},${C.ink})`,
            border: `1px solid ${C.glassBorder}`,
            boxShadow: '0 6px 24px rgba(0,0,0,0.45)',
          }}>
            <div style={{ padding: '16px 16px 14px' }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{
                  width: 58, height: 58, borderRadius: 18, flexShrink: 0,
                  background: `linear-gradient(135deg,${opp.grad[0]},${opp.grad[1]})`,
                  border: `1.5px solid ${C.brassGlassBorder}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.45)',
                }}>
                  <span style={{ color: C.ivory, fontSize: 22, fontFamily: 'Noto Serif JP,serif', fontWeight: 700 }}>{opp.kanji}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ color: C.ivory, fontSize: 17, fontWeight: 700, fontFamily: 'Noto Serif JP,serif' }}>{opp.name}</span>
                    <span style={{
                      fontSize: 9, color: C.brass, fontFamily: 'Inter,sans-serif', fontWeight: 700,
                      background: C.brassGlass, padding: '2px 7px', borderRadius: 7,
                      border: `1px solid ${C.brassGlassBorder}`, letterSpacing: 0.8,
                    }}>{opp.style.toUpperCase()}</span>
                  </div>
                  <span style={{ color: C.ivoryDim, fontSize: 11, fontFamily: 'Inter,sans-serif', display: 'block', marginBottom: 6 }}>{opp.title}</span>
                  <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <div key={i} style={{
                        width: 9, height: 9, borderRadius: 5,
                        background: i < opp.diff ? C.brass : 'rgba(255,255,255,0.12)',
                      }} />
                    ))}
                    <span style={{ color: C.ivoryMuted, fontSize: 9, fontFamily: 'Inter,sans-serif', marginLeft: 4 }}>
                      {opp.diff === 4 ? 'Hard' : opp.diff === 3 ? 'Moderate' : 'Adaptable'}
                    </span>
                  </div>
                </div>
              </div>
              <p style={{ color: C.ivoryDim, fontSize: 12, fontFamily: 'Inter,sans-serif', lineHeight: 1.6, marginBottom: 10 }}>{opp.desc}</p>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {opp.traits.map(t => (
                  <span key={t} style={{
                    fontSize: 10, fontFamily: 'Inter,sans-serif', color: C.ivoryMuted,
                    background: C.glass, padding: '3px 8px', borderRadius: 7,
                    border: `1px solid ${C.glassBorder}`,
                  }}>{t}</span>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', borderTop: `1px solid rgba(255,255,255,0.05)` }}>
              <button style={{
                flex: 1, padding: '12px', background: 'transparent', border: 'none', cursor: 'pointer',
                borderRight: `1px solid rgba(255,255,255,0.05)`,
              }}>
                <span style={{ color: C.brass, fontSize: 11, fontFamily: 'Inter,sans-serif' }}>Explain my opponent ↗</span>
              </button>
              <button onClick={() => onNav('game')} style={{
                flex: 1, padding: '12px', cursor: 'pointer',
                background: C.brassGlass, border: 'none',
              }}>
                <span style={{ color: C.ivory, fontSize: 13, fontWeight: 600, fontFamily: 'Inter,sans-serif' }}>Select · Play →</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        padding: '12px 14px', borderRadius: 12, marginBottom: 20,
        background: 'rgba(184,149,90,0.06)', border: `1px solid rgba(184,149,90,0.14)`,
      }}>
        <p style={{ color: C.ivoryMuted, fontSize: 11, fontFamily: 'Inter,sans-serif', lineHeight: 1.6, margin: 0 }}>
          AI recommendations are probabilistic estimates based on visible tile information. Hidden tiles are inferred, not known. Results may vary from predictions.
        </p>
      </div>
    </div>
  )
}

/* ─── GAME SCREEN ─── */
function GameScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const [selIdx, setSelIdx] = useState<number | null>(null)
  const [showAI, setShowAI] = useState(false)
  const [showReasoning, setShowReasoning] = useState(false)

  const hand = ['1m', '2m', '3m', '8m', '9m', '5p', '6p', '7p', '2s', '3s', '4s', 'E', 'E']
  const drawTile = '6s'
  const topDisc = ['3m', '7p', 'N', '2s', '8m', '1p', 'S', '4s']
  const leftDisc = ['9m', 'W', '5p', '1s', '6m', '3p']
  const rightDisc = ['E', '8p', '2m', '7s', '4p', 'N']
  const playerDisc = ['9s', 'Haku', '4m', '1p', '7m']

  const aiSugg = [
    { tile: '6s', label: '6-Sou', pct: 42, chips: ['Keeps tenyai path', 'Lower deal-in risk'] },
    { tile: 'E', label: 'East Wind', pct: 31, chips: ['Isolated honour tile', 'Improves ukeire slightly'] },
    { tile: '9m', label: '9-Man', pct: 19, chips: ['Tightens 1m–2m–3m block'] },
  ]

  const allTiles = [...hand, drawTile]
  const handleTap = (i: number) => setSelIdx(selIdx === i ? null : i)

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* Round info bar */}
      <div style={{
        background: 'rgba(13,21,41,0.9)', borderBottom: `0.5px solid ${C.brassGlassBorder}`,
        padding: '0 16px', height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ color: C.brass, fontSize: 14, fontWeight: 700, fontFamily: 'JetBrains Mono,monospace' }}>東1局</span>
          <span style={{ color: C.ivoryMuted, fontSize: 11, fontFamily: 'Inter,sans-serif' }}>East 1 · 本場 0</span>
        </div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ color: C.ivoryMuted, fontSize: 10, fontFamily: 'Inter,sans-serif' }}>Tiles</span>
            <span style={{ color: C.ivory, fontSize: 14, fontWeight: 700, fontFamily: 'JetBrains Mono,monospace' }}>72</span>
          </div>
          <div style={{
            width: 30, height: 30, borderRadius: 15,
            background: C.glass, border: `1px solid ${C.glassBorder}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: C.ivory, fontSize: 12, fontFamily: 'JetBrains Mono,monospace', fontWeight: 600 }}>15</span>
          </div>
          <button onClick={() => onNav('result')} style={{
            padding: '4px 10px', borderRadius: 8, cursor: 'pointer',
            background: 'rgba(204,34,0,0.15)', border: '1px solid rgba(204,34,0,0.3)',
          }}>
            <span style={{ color: C.vermilion, fontSize: 10, fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>★ End</span>
          </button>
        </div>
      </div>

      {/* Table area */}
      <div style={{
        flexShrink: 0, height: 272, position: 'relative',
        background: `radial-gradient(ellipse at 50% 50%,${C.jadeLight} 0%,${C.jade} 50%,${C.jadeDark} 100%)`,
        padding: '8px',
      }}>
        {/* Felt texture */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'repeating-linear-gradient(0deg,rgba(0,0,0,0.025) 0px,rgba(0,0,0,0.025) 1px,transparent 1px,transparent 4px)',
        }} />

        {/* Top opponent */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 5, height: 5, borderRadius: 3, background: C.jade, border: `1px solid ${C.brassGlassBorder}` }} />
            <span style={{ color: C.ivoryDim, fontSize: 9, fontFamily: 'Inter,sans-serif', background: 'rgba(0,0,0,0.35)', padding: '2px 8px', borderRadius: 5 }}>
              Ren · 北家 · 28,400
            </span>
          </div>
          <div style={{ display: 'flex', gap: 1 }}>
            {Array.from({ length: 13 }).map((_, i) => <Tile key={i} n="?" size="xs" fd />)}
          </div>
          <div style={{ display: 'flex', gap: 1 }}>
            {topDisc.map((t, i) => <Tile key={i} n={t} size="xs" />)}
          </div>
        </div>

        {/* Middle row */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', margin: '4px 0', position: 'relative', zIndex: 1 }}>
          {/* Left */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, width: 54 }}>
            <span style={{ color: C.ivoryDim, fontSize: 9, fontFamily: 'Inter,sans-serif', background: 'rgba(0,0,0,0.35)', padding: '1px 5px', borderRadius: 4, textAlign: 'center', lineHeight: 1.5 }}>
              Sora{'\n'}西家
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
              {Array.from({ length: 3 }).map((_, r) => (
                <div key={r} style={{ display: 'flex', gap: 1 }}>
                  {Array.from({ length: 2 }).map((_, c) => (
                    <Tile key={c} n={leftDisc[r * 2 + c] || '?'} size="xs" fd={!leftDisc[r * 2 + c]} />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Center */}
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
            background: 'rgba(0,0,0,0.22)', borderRadius: 12, padding: '8px 6px',
            border: `0.5px solid rgba(184,149,90,0.1)`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ color: C.ivoryMuted, fontSize: 8, fontFamily: 'Inter,sans-serif', display: 'block' }}>Dora Indicator</span>
                <div style={{ display: 'flex', gap: 2, marginTop: 2 }}>
                  <Tile n="6p" size="xs" />
                </div>
              </div>
              <div style={{
                width: 34, height: 34, borderRadius: 17,
                background: `linear-gradient(135deg,${C.navyMid},${C.navy})`,
                border: `1.5px solid ${C.brassGlassBorder}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: C.brass, fontSize: 13, fontWeight: 700, fontFamily: 'Noto Serif JP,serif' }}>東</span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ color: C.ivoryMuted, fontSize: 8, fontFamily: 'Inter,sans-serif', display: 'block' }}>Dora</span>
                <div style={{ display: 'flex', gap: 2, marginTop: 2 }}>
                  <Tile n="7p" size="xs" />
                </div>
              </div>
            </div>
            {/* Riichi stick */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.55)', border: '0.5px solid rgba(0,0,0,0.3)' }} />
              <span style={{ color: C.ivoryDim, fontSize: 8, fontFamily: 'JetBrains Mono,monospace' }}>×1</span>
            </div>
            {/* Player discards in center */}
            <div style={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 90 }}>
              {playerDisc.map((t, i) => <Tile key={i} n={t} size="xs" />)}
            </div>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, width: 54 }}>
            <span style={{ color: C.ivoryDim, fontSize: 9, fontFamily: 'Inter,sans-serif', background: 'rgba(0,0,0,0.35)', padding: '1px 5px', borderRadius: 4, textAlign: 'center', lineHeight: 1.5 }}>
              Mika{'\n'}東家
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
              {Array.from({ length: 3 }).map((_, r) => (
                <div key={r} style={{ display: 'flex', gap: 1 }}>
                  {Array.from({ length: 2 }).map((_, c) => (
                    <Tile key={c} n={rightDisc[r * 2 + c] || '?'} size="xs" fd={!rightDisc[r * 2 + c]} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Score chips */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, position: 'relative', zIndex: 1 }}>
          {[{ n: 'Ren', s: '28,400', w: '北' }, { n: 'Sora', s: '27,100', w: '西' }, { n: 'Mika', s: '31,200', w: '東' }].map(p => (
            <div key={p.n} style={{ background: 'rgba(0,0,0,0.35)', borderRadius: 7, padding: '3px 8px', display: 'flex', gap: 5, alignItems: 'center' }}>
              <span style={{ color: C.brass, fontSize: 9, fontFamily: 'Noto Serif JP,serif' }}>{p.w}</span>
              <span style={{ color: C.ivoryDim, fontSize: 9, fontFamily: 'JetBrains Mono,monospace' }}>{p.s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Player info strip */}
      <div style={{
        background: 'rgba(13,21,41,0.95)', padding: '7px 16px', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderTop: `0.5px solid ${C.brassGlassBorder}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: C.brass, fontSize: 12, fontFamily: 'Noto Serif JP,serif', fontWeight: 700 }}>南家</span>
          <span style={{ color: C.ivory, fontSize: 13, fontWeight: 600, fontFamily: 'Inter,sans-serif' }}>You · Miya_Hana</span>
          {selIdx !== null && (
            <span style={{ color: C.ivoryMuted, fontSize: 10, fontFamily: 'Inter,sans-serif' }}>
              Selected: {allTiles[selIdx]}
            </span>
          )}
        </div>
        <span style={{ color: C.ivory, fontSize: 15, fontWeight: 700, fontFamily: 'JetBrains Mono,monospace' }}>30,700</span>
      </div>

      {/* Player hand */}
      <div style={{
        background: '#06060C', padding: '14px 8px 6px', flexShrink: 0,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 2,
        borderTop: `0.5px solid rgba(255,255,255,0.05)`,
        overflow: 'visible',
      }}>
        {hand.map((t, i) => (
          <Tile key={i} n={t} size="sm" sel={selIdx === i} onClick={() => handleTap(i)} />
        ))}
        <div style={{ width: 7 }} />
        <Tile n={drawTile} size="sm" sel={selIdx === hand.length} onClick={() => handleTap(hand.length)} />
      </div>
      <div style={{
        background: '#06060C', padding: '0 0 6px',
        display: 'flex', justifyContent: 'center',
      }}>
        <span style={{ color: C.ivoryMuted, fontSize: 9, fontFamily: 'Inter,sans-serif' }}>Tap to select · Tap again to confirm discard</span>
      </div>

      {/* Action tray */}
      <div style={{
        background: 'rgba(8,8,14,0.99)', padding: '10px 12px 10px', flexShrink: 0,
        borderTop: `0.5px solid ${C.brassGlassBorder}`,
      }}>
        <div style={{ display: 'flex', gap: 5, marginBottom: 8 }}>
          {[
            { label: 'Discard', primary: true, active: selIdx !== null },
            { label: 'Riichi', active: true },
            { label: 'Chi', active: false },
            { label: 'Pon', active: false },
            { label: 'Kan', active: false },
            { label: 'Skip', active: true },
          ].map(a => (
            <button key={a.label} onClick={a.label === 'Discard' ? () => setSelIdx(null) : undefined} style={{
              flex: 1, padding: '9px 2px', borderRadius: 10, cursor: a.active ? 'pointer' : 'default',
              background: a.primary && a.active
                ? `linear-gradient(135deg,${C.brass},${C.brassBright})`
                : C.glass,
              border: a.primary && a.active ? 'none' : `1px solid ${a.active ? C.glassBorder : 'rgba(255,255,255,0.04)'}`,
              opacity: a.active ? 1 : 0.3,
            }}>
              <span style={{
                fontSize: 11, fontFamily: 'Inter,sans-serif', fontWeight: 600,
                color: a.primary && a.active ? C.ink : a.active ? C.ivory : C.ivoryMuted,
              }}>{a.label}</span>
            </button>
          ))}
        </div>
        <button onClick={() => setShowAI(true)} style={{
          width: '100%', padding: '9px', cursor: 'pointer',
          background: C.brassGlass, border: `1px solid ${C.brassGlassBorder}`, borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
        }}>
          <span style={{ fontSize: 13, color: C.brass }}>◈</span>
          <span style={{ color: C.brass, fontSize: 12, fontWeight: 600, fontFamily: 'Inter,sans-serif' }}>AI Assist</span>
          <span style={{ color: C.ivoryMuted, fontSize: 10, fontFamily: 'Inter,sans-serif' }}>— estimates only</span>
        </button>
      </div>

      {/* AI Panel bottom sheet */}
      {showAI && (
        <>
          <div onClick={() => setShowAI(false)} style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.52)', zIndex: 10,
          }} />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 11,
            background: `linear-gradient(180deg,${C.navyMid} 0%,${C.navy} 100%)`,
            borderTop: `1px solid ${C.brassGlassBorder}`,
            borderRadius: '20px 20px 0 0',
            boxShadow: '0 -8px 40px rgba(0,0,0,0.65)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 8px' }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.15)' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '0 20px 14px' }}>
              <div>
                <span style={{ color: C.ivory, fontSize: 16, fontWeight: 700, fontFamily: 'Noto Serif JP,serif', display: 'block' }}>AI Assist</span>
                <span style={{ color: C.ivoryMuted, fontSize: 10, fontFamily: 'Inter,sans-serif' }}>AI estimate · Visible tiles only · Not guaranteed</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: C.ivoryMuted, fontSize: 10, fontFamily: 'Inter,sans-serif' }}>Reasoning</span>
                  <Toggle val={showReasoning} onToggle={() => setShowReasoning(r => !r)} />
                </div>
                <button onClick={() => setShowAI(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                  <span style={{ color: C.ivoryMuted, fontSize: 20, lineHeight: 1 }}>×</span>
                </button>
              </div>
            </div>

            <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {aiSugg.map((s, i) => (
                <div key={i} style={{
                  borderRadius: 14, padding: '12px 14px',
                  background: i === 0 ? C.brassGlass : C.glass,
                  border: `1px solid ${i === 0 ? C.brassGlassBorder : C.glassBorder}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <Tile n={s.tile} size="sm" sel={i === 0} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                        <span style={{ color: i === 0 ? C.ivory : C.ivoryDim, fontSize: 13, fontWeight: 600, fontFamily: 'Inter,sans-serif' }}>
                          Discard {s.label}
                        </span>
                        <span style={{ color: i === 0 ? C.brass : C.ivoryMuted, fontSize: 15, fontWeight: 700, fontFamily: 'JetBrains Mono,monospace' }}>
                          {s.pct}%
                        </span>
                      </div>
                      <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{
                          width: `${(s.pct / 45) * 100}%`, height: '100%', borderRadius: 2,
                          background: i === 0 ? `linear-gradient(90deg,${C.brassDark},${C.brass})` : 'rgba(255,255,255,0.28)',
                        }} />
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    {s.chips.map(chip => (
                      <span key={chip} style={{
                        fontSize: 10, fontFamily: 'Inter,sans-serif', color: C.ivoryMuted,
                        background: 'rgba(255,255,255,0.05)', padding: '2px 7px', borderRadius: 6,
                        border: `0.5px solid ${C.glassBorder}`,
                      }}>{chip}</span>
                    ))}
                  </div>
                  {showReasoning && (
                    <p style={{ color: C.ivoryMuted, fontSize: 10, fontFamily: 'Inter,sans-serif', marginTop: 8, lineHeight: 1.55 }}>
                      Inferred from discard pattern and remaining tile count. Opponent hand state is estimated, not known.
                    </p>
                  )}
                </div>
              ))}
            </div>
            <div style={{ padding: '10px 16px 16px' }}>
              <p style={{ color: C.ivoryMuted, fontSize: 10, fontFamily: 'Inter,sans-serif', lineHeight: 1.55, margin: 0 }}>
                Suggestions are based on visible information and probabilistic inference. Hidden tiles cannot be known with certainty.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

/* ─── RESULT SCREEN ─── */
function ResultScreen({ onNav }: { onNav: (s: Screen) => void }) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 0' }}>
      {/* Placement header */}
      <div style={{
        borderRadius: 22, padding: '26px 20px 22px', marginBottom: 18, textAlign: 'center',
        background: `linear-gradient(135deg,${C.navyMid},${C.jade})`,
        border: `1px solid ${C.brassGlassBorder}`,
        boxShadow: '0 8px 36px rgba(0,0,0,0.55)', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'repeating-linear-gradient(45deg,rgba(184,149,90,0.025) 0px,rgba(184,149,90,0.025) 1px,transparent 1px,transparent 18px)',
        }} />
        <div style={{
          width: 76, height: 76, borderRadius: 38, margin: '0 auto 14px',
          background: `linear-gradient(135deg,${C.brass},${C.brassBright})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 28px rgba(184,149,90,0.5)`,
        }}>
          <span style={{ color: C.ink, fontSize: 34, fontWeight: 900, fontFamily: 'JetBrains Mono,monospace' }}>1</span>
        </div>
        <h2 style={{ color: C.ivory, fontSize: 26, fontWeight: 700, fontFamily: 'Noto Serif JP,serif', marginBottom: 6 }}>1st Place</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, alignItems: 'baseline', marginBottom: 6 }}>
          <span style={{ color: '#4CAF50', fontSize: 22, fontWeight: 800, fontFamily: 'JetBrains Mono,monospace' }}>+48 pts</span>
          <span style={{ color: C.ivoryMuted, fontSize: 13, fontFamily: 'Inter,sans-serif' }}>→ Gold III</span>
        </div>
        <p style={{ color: C.ivoryDim, fontSize: 12, fontFamily: 'Inter,sans-serif' }}>Final score: 42,300 · Net: +12,300</p>
      </div>

      {/* Hand summary */}
      <div style={{ marginBottom: 16 }}>
        <span style={{ color: C.ivory, fontSize: 14, fontWeight: 600, fontFamily: 'Noto Serif JP,serif', display: 'block', marginBottom: 10 }}>Hand Summary</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {[
            { h: 'E1', r: 'Tanyao Tsumo · 2,000 / 1,000', s: '+4,000', w: true },
            { h: 'E2', r: 'Deal-in to Ren · Riichi Pinfu', s: '−3,900', w: false },
            { h: 'E3', r: 'Riichi Pinfu Tsumo · Ippatsu', s: '+4,000', w: true },
            { h: 'E4', r: 'Dealer tsumo by Ren', s: '−3,000', w: false },
          ].map(h => (
            <div key={h.h} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 12,
              background: h.w ? 'rgba(76,175,80,0.06)' : C.glass,
              border: `1px solid ${h.w ? 'rgba(76,175,80,0.15)' : C.glassBorder}`,
            }}>
              <span style={{ color: C.brass, fontSize: 12, fontFamily: 'JetBrains Mono,monospace', width: 22, flexShrink: 0 }}>{h.h}</span>
              <span style={{ color: C.ivoryDim, fontSize: 12, fontFamily: 'Inter,sans-serif', flex: 1 }}>{h.r}</span>
              <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'JetBrains Mono,monospace', color: h.w ? '#4CAF50' : '#CC4444', flexShrink: 0 }}>{h.s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI analysis */}
      <div style={{ marginBottom: 16 }}>
        <span style={{ color: C.ivory, fontSize: 14, fontWeight: 600, fontFamily: 'Noto Serif JP,serif', display: 'block', marginBottom: 10 }}>AI Performance Analysis</span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { label: 'Best Decision', icon: '★', text: 'E3 riichi — optimal timing with 4-tile ukeire and dealer position', col: '#4CAF50' },
            { label: 'Missed Opportunity', icon: '◇', text: 'E2: safe discard (1p) available — deal-in was likely avoidable', col: C.vermilion },
            { label: 'Risk Profile', icon: '◎', text: '12% deal-in rate · below 16% baseline · good defensive awareness', col: C.brass },
            { label: 'Next Training Focus', icon: '→', text: 'Defensive discard order after first opponent riichi', col: C.ivoryDim },
          ].map(c => (
            <div key={c.label} style={{ borderRadius: 16, padding: '13px 12px', background: C.glass, border: `1px solid ${C.glassBorder}` }}>
              <div style={{ display: 'flex', gap: 5, alignItems: 'center', marginBottom: 6 }}>
                <span style={{ color: c.col, fontSize: 13 }}>{c.icon}</span>
                <span style={{ color: C.ivoryMuted, fontSize: 9, fontFamily: 'Inter,sans-serif', fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase' }}>{c.label}</span>
              </div>
              <p style={{ color: C.ivoryDim, fontSize: 11, fontFamily: 'Inter,sans-serif', lineHeight: 1.55, margin: 0 }}>{c.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
        <button style={{
          padding: '14px', borderRadius: 14, cursor: 'pointer',
          background: `linear-gradient(135deg,${C.brass},${C.brassBright})`,
          border: 'none', boxShadow: `0 4px 18px rgba(184,149,90,0.32)`,
        }}>
          <span style={{ color: C.ink, fontSize: 15, fontWeight: 700, fontFamily: 'Inter,sans-serif' }}>Review Key Moments</span>
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => onNav('arena')} style={{
            flex: 1, padding: '12px', borderRadius: 14, cursor: 'pointer',
            background: C.glass, border: `1px solid ${C.glassBorder}`,
          }}>
            <span style={{ color: C.ivory, fontSize: 14, fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>Rematch</span>
          </button>
          <button onClick={() => onNav('home')} style={{
            flex: 1, padding: '12px', borderRadius: 14, cursor: 'pointer',
            background: 'transparent', border: `1px solid rgba(255,255,255,0.06)`,
          }}>
            <span style={{ color: C.ivoryDim, fontSize: 14, fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>Share Result</span>
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── PROFILE SCREEN ─── */
function ProfileScreen() {
  const [st, setSt] = useState({ alwaysExplain: true, haptics: true, sound: false, colorBlind: false, logs: true })
  const tog = (k: keyof typeof st) => setSt(s => ({ ...s, [k]: !s[k] }))
  const [aiStyle, setAiStyle] = useState<'Balanced' | 'Aggressive' | 'Defensive'>('Balanced')

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 0' }}>
      {/* Profile header */}
      <div style={{
        borderRadius: 22, padding: '18px', marginBottom: 18,
        background: C.glass, border: `1px solid ${C.glassBorder}`,
        display: 'flex', gap: 16, alignItems: 'center',
      }}>
        <div style={{
          width: 66, height: 66, borderRadius: 20, flexShrink: 0,
          background: 'linear-gradient(135deg,#2A3A6A,#4A2A5A)',
          border: `2px solid ${C.brass}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 18px rgba(184,149,90,0.25)`,
        }}>
          <span style={{ color: C.ivory, fontSize: 26, fontFamily: 'Noto Serif JP,serif', fontWeight: 700 }}>雅</span>
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ color: C.ivory, fontSize: 18, fontWeight: 700, fontFamily: 'Noto Serif JP,serif', display: 'block', marginBottom: 2 }}>Miya_Hana</span>
          <span style={{ color: C.brass, fontSize: 12, fontFamily: 'Inter,sans-serif', fontWeight: 600, display: 'block', marginBottom: 8 }}>Gold III · Season 4</span>
          <div style={{ display: 'flex', gap: 14 }}>
            {[{ l: 'Win Rate', v: '24.3%' }, { l: 'Avg Place', v: '2.41' }, { l: 'Games', v: '312' }].map(s => (
              <div key={s.l}>
                <span style={{ color: C.brass, fontSize: 14, fontWeight: 700, fontFamily: 'JetBrains Mono,monospace', display: 'block' }}>{s.v}</span>
                <span style={{ color: C.ivoryMuted, fontSize: 9, fontFamily: 'Inter,sans-serif' }}>{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rank history */}
      <div style={{ marginBottom: 18 }}>
        <span style={{ color: C.ivory, fontSize: 13, fontWeight: 600, fontFamily: 'Noto Serif JP,serif', display: 'block', marginBottom: 10 }}>Rank History</span>
        <div style={{ display: 'flex', gap: 6 }}>
          {[{ m: 'May', r: 'Silver I' }, { m: 'Jun', r: 'Silver II' }, { m: 'Jul', r: 'Gold III' }, { m: 'Aug', r: 'Gold III', curr: true }].map(r => (
            <div key={r.m} style={{
              flex: 1, borderRadius: 12, padding: '10px 6px', textAlign: 'center',
              background: r.curr ? C.brassGlass : C.glass,
              border: `1px solid ${r.curr ? C.brassGlassBorder : C.glassBorder}`,
            }}>
              <span style={{ color: r.curr ? C.brass : C.ivoryMuted, fontSize: 11, fontFamily: 'Inter,sans-serif', fontWeight: 600, display: 'block' }}>{r.m}</span>
              <span style={{ color: r.curr ? C.ivory : C.ivoryDim, fontSize: 9, fontFamily: 'JetBrains Mono,monospace', display: 'block', marginTop: 4, lineHeight: 1.4 }}>{r.r}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Win-rate trend bar */}
      <div style={{ marginBottom: 18, background: C.glass, borderRadius: 16, padding: '14px 16px', border: `1px solid ${C.glassBorder}` }}>
        <span style={{ color: C.ivoryDim, fontSize: 12, fontFamily: 'Inter,sans-serif', display: 'block', marginBottom: 10 }}>Win-Rate Trend (last 20 games)</span>
        <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: 36 }}>
          {[18, 30, 22, 25, 28, 35, 20, 28, 32, 38, 25, 30, 22, 35, 28, 30, 24, 32, 38, 40].map((v, i) => (
            <div key={i} style={{
              flex: 1, borderRadius: 2,
              background: i > 14 ? C.brass : 'rgba(184,149,90,0.35)',
              height: `${v}%`,
            }} />
          ))}
        </div>
      </div>

      {/* AI preferences */}
      <div style={{ marginBottom: 18 }}>
        <span style={{ color: C.ivory, fontSize: 13, fontWeight: 600, fontFamily: 'Noto Serif JP,serif', display: 'block', marginBottom: 10 }}>AI Preferences</span>
        <div style={{
          borderRadius: 16, padding: '14px 16px', background: C.glass, border: `1px solid ${C.glassBorder}`, marginBottom: 10,
        }}>
          <span style={{ color: C.ivoryDim, fontSize: 12, fontFamily: 'Inter,sans-serif', display: 'block', marginBottom: 8 }}>Preferred AI Style</span>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['Balanced', 'Aggressive', 'Defensive'] as const).map(s => (
              <button key={s} onClick={() => setAiStyle(s)} style={{
                flex: 1, padding: '8px 4px', borderRadius: 10, cursor: 'pointer',
                background: aiStyle === s ? C.brassGlass : 'transparent',
                border: `1px solid ${aiStyle === s ? C.brassGlassBorder : C.glassBorder}`,
              }}>
                <span style={{ fontSize: 11, fontFamily: 'Inter,sans-serif', fontWeight: aiStyle === s ? 600 : 400, color: aiStyle === s ? C.ivory : C.ivoryMuted }}>{s}</span>
              </button>
            ))}
          </div>
        </div>
        <SettingRow label="Always Explain AI Suggestions" desc="Show reasoning for every recommendation" val={st.alwaysExplain} onToggle={() => tog('alwaysExplain')} />
      </div>

      {/* App settings */}
      <div style={{ marginBottom: 18 }}>
        <span style={{ color: C.ivory, fontSize: 13, fontWeight: 600, fontFamily: 'Noto Serif JP,serif', display: 'block', marginBottom: 10 }}>Settings</span>
        <SettingRow label="Haptic Feedback" val={st.haptics} onToggle={() => tog('haptics')} />
        <SettingRow label="Sound Effects" val={st.sound} onToggle={() => tog('sound')} />
        <SettingRow label="Colour-Blind Mode" desc="Adjusts suit colours for accessibility" val={st.colorBlind} onToggle={() => tog('colorBlind')} />
      </div>

      {/* Display options */}
      <div style={{ marginBottom: 18 }}>
        <span style={{ color: C.ivory, fontSize: 13, fontWeight: 600, fontFamily: 'Noto Serif JP,serif', display: 'block', marginBottom: 10 }}>Display</span>
        <div style={{ borderRadius: 14, overflow: 'hidden', border: `1px solid ${C.glassBorder}` }}>
          {[{ l: 'Tile Theme', v: 'Traditional' }, { l: 'Language', v: 'English' }, { l: 'Table Colour', v: 'Jade' }].map((item, i, arr) => (
            <div key={item.l} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '13px 16px', background: C.glass,
              borderBottom: i < arr.length - 1 ? `1px solid ${C.glassBorder}` : 'none',
            }}>
              <span style={{ color: C.ivoryDim, fontSize: 13, fontFamily: 'Inter,sans-serif' }}>{item.l}</span>
              <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                <span style={{ color: C.ivoryMuted, fontSize: 13, fontFamily: 'Inter,sans-serif' }}>{item.v}</span>
                <span style={{ color: C.ivoryMuted, fontSize: 14 }}>›</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy */}
      <div style={{
        borderRadius: 16, padding: '14px 16px', marginBottom: 20,
        background: 'rgba(184,149,90,0.06)', border: `1px solid rgba(184,149,90,0.14)`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ color: C.ivoryDim, fontSize: 13, fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>Game-Log Analysis</span>
          <Toggle val={st.logs} onToggle={() => tog('logs')} />
        </div>
        <p style={{ color: C.ivoryMuted, fontSize: 11, fontFamily: 'Inter,sans-serif', lineHeight: 1.65, margin: 0 }}>
          Game logs are processed locally to personalise AI feedback and training recommendations. No hand data is transmitted externally.
        </p>
      </div>
    </div>
  )
}

/* ─── AI SENSEI: COACHING DASHBOARD (Review tab) ─── */
function SenseiDashboard({ onNav }: { onNav: (s: Screen) => void }) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 0' }}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
          <span style={{ color: C.brass, fontSize: 10, fontFamily: 'Inter,sans-serif', fontWeight: 700, letterSpacing: 1.3, textTransform: 'uppercase' }}>AI Sensei</span>
          <div style={{ width: 4, height: 4, borderRadius: 2, background: C.brass, opacity: 0.5 }} />
          <span style={{ color: C.ivoryMuted, fontSize: 10, fontFamily: 'Inter,sans-serif' }}>Coaching</span>
        </div>
        <h1 style={{ color: C.ivory, fontSize: 23, fontWeight: 700, fontFamily: 'Noto Serif JP,serif', lineHeight: 1.2, marginBottom: 4 }}>Good evening, Miya</h1>
        <p style={{ color: C.ivoryMuted, fontSize: 12, fontFamily: 'Inter,sans-serif', lineHeight: 1.55 }}>3 unreviewed hands from yesterday's session.</p>
      </div>

      {/* Weekly score + streak */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <div style={{
          flex: 2, borderRadius: 18, padding: '16px',
          background: `linear-gradient(135deg,${C.navyMid},${C.jade})`,
          border: `1px solid ${C.brassGlassBorder}`,
        }}>
          <span style={{ color: C.ivoryMuted, fontSize: 9, fontFamily: 'Inter,sans-serif', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Weekly Score</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
            <span style={{ color: C.ivory, fontSize: 30, fontWeight: 800, fontFamily: 'JetBrains Mono,monospace' }}>73</span>
            <span style={{ color: C.ivoryMuted, fontSize: 13, fontFamily: 'JetBrains Mono,monospace' }}>/100</span>
            <span style={{ color: '#4CAF50', fontSize: 12, fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>↑ +8</span>
          </div>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }}>
            <div style={{ width: '73%', height: '100%', background: `linear-gradient(90deg,${C.brassDark},${C.brass})`, borderRadius: 2 }} />
          </div>
        </div>
        <div style={{
          flex: 1, borderRadius: 18, padding: '14px',
          background: C.glass, border: `1px solid ${C.glassBorder}`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
        }}>
          <span style={{ color: C.brass, fontSize: 26, fontWeight: 800, fontFamily: 'JetBrains Mono,monospace' }}>5</span>
          <span style={{ color: C.ivoryDim, fontSize: 10, fontFamily: 'Inter,sans-serif', textAlign: 'center', lineHeight: 1.3 }}>day streak</span>
          <span style={{ fontSize: 14, marginTop: 2 }}>🔥</span>
        </div>
      </div>

      {/* Focus card */}
      <div style={{
        borderRadius: 16, padding: '14px 16px', marginBottom: 16,
        background: C.brassGlass, border: `1px solid ${C.brassGlassBorder}`,
        display: 'flex', gap: 10, alignItems: 'flex-start',
      }}>
        <span style={{ color: C.brass, fontSize: 16, flexShrink: 0, marginTop: 1 }}>◉</span>
        <div>
          <span style={{ color: C.brass, fontSize: 9, fontFamily: 'Inter,sans-serif', fontWeight: 700, letterSpacing: 0.9, textTransform: 'uppercase', display: 'block', marginBottom: 3 }}>Current Focus</span>
          <span style={{ color: C.ivory, fontSize: 13, fontWeight: 600, fontFamily: 'Inter,sans-serif', display: 'block', marginBottom: 4 }}>Reading Dangerous Discards</span>
          <p style={{ color: C.ivoryDim, fontSize: 11, fontFamily: 'Inter,sans-serif', lineHeight: 1.65, margin: 0 }}>
            You're improving at early-hand efficiency. This week, practise recognising when an opponent's pattern signals tenpai.
          </p>
        </div>
      </div>

      {/* Primary CTA */}
      <button onClick={() => onNav('import-game')} style={{
        width: '100%', padding: '14px', borderRadius: 16, cursor: 'pointer', marginBottom: 18,
        background: `linear-gradient(135deg,${C.brass},${C.brassBright})`,
        border: 'none', boxShadow: `0 4px 18px rgba(184,149,90,0.35)`,
      }}>
        <span style={{ color: C.ink, fontSize: 15, fontWeight: 700, fontFamily: 'Inter,sans-serif' }}>Review a Game →</span>
      </button>

      {/* Progress cards */}
      <span style={{ color: C.ivory, fontSize: 13, fontWeight: 600, fontFamily: 'Noto Serif JP,serif', display: 'block', marginBottom: 10 }}>This Week</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {[
          { label: 'Tile Efficiency', sub: 'Ukeire & hand acceptance', val: 78, delta: '+12', up: true },
          { label: 'Defensive Discards', sub: 'Safe tile selection', val: 61, delta: '+4', up: true },
          { label: 'Scoring Decisions', sub: 'Han & fu optimisation', val: 44, delta: '−3', up: false },
        ].map(p => (
          <div key={p.label} style={{ borderRadius: 16, padding: '13px 16px', background: C.glass, border: `1px solid ${C.glassBorder}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div>
                <span style={{ color: C.ivory, fontSize: 13, fontWeight: 600, fontFamily: 'Inter,sans-serif', display: 'block' }}>{p.label}</span>
                <span style={{ color: C.ivoryMuted, fontSize: 10, fontFamily: 'Inter,sans-serif' }}>{p.sub}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: C.ivory, fontSize: 18, fontWeight: 700, fontFamily: 'JetBrains Mono,monospace', display: 'block' }}>{p.val}</span>
                <span style={{ color: p.up ? '#4CAF50' : C.vermilion, fontSize: 11, fontFamily: 'JetBrains Mono,monospace', fontWeight: 600 }}>{p.delta}</span>
              </div>
            </div>
            <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }}>
              <div style={{ width: `${p.val}%`, height: '100%', borderRadius: 2, background: p.up ? C.brass : `linear-gradient(90deg,${C.brassDark},${C.vermilion})` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Recent reviews */}
      <span style={{ color: C.ivory, fontSize: 13, fontWeight: 600, fontFamily: 'Noto Serif JP,serif', display: 'block', marginBottom: 10 }}>Recent Reviews</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 20 }}>
        {[
          { game: 'Phoenix Cup · E1–E4', date: 'Aug 12', hands: 12, result: '1st' },
          { game: 'Ranked vs Mika · E1–E4', date: 'Aug 11', hands: 10, result: '2nd' },
        ].map(g => (
          <div key={g.game} onClick={() => onNav('review-overview')} style={{
            padding: '12px 16px', borderRadius: 14, cursor: 'pointer',
            background: C.glass, border: `1px solid ${C.glassBorder}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <span style={{ color: C.ivory, fontSize: 13, fontWeight: 500, fontFamily: 'Inter,sans-serif', display: 'block' }}>{g.game}</span>
              <span style={{ color: C.ivoryMuted, fontSize: 10, fontFamily: 'Inter,sans-serif' }}>{g.date} · {g.hands} decision points</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: C.brass, fontSize: 13, fontFamily: 'JetBrains Mono,monospace', fontWeight: 700 }}>{g.result}</span>
              <span style={{ color: C.ivoryMuted, fontSize: 14 }}>›</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── AI SENSEI: IMPORT GAME ─── */
function ImportGameScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const [activeInput, setActiveInput] = useState<string | null>(null)
  const [wind, setWind] = useState<'E' | 'S' | 'W' | 'N'>('S')
  const [showFormats, setShowFormats] = useState(false)

  const sources = [
    { id: 'tenhou', label: 'Tenhou', placeholder: 'https://tenhou.net/0/?log=...', icon: '天' },
    { id: 'mjs', label: 'Mahjong Soul', placeholder: 'https://game.mahjongsoul.com/game/...', icon: '雀' },
    { id: 'riichi', label: 'Riichi City Log ID', placeholder: 'e.g. RC-20240812-1234', icon: 'RC' },
    { id: 'custom', label: 'Custom Game Log', placeholder: 'Paste log text or URL here…', icon: '⌨' },
  ]

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => onNav('review')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <span style={{ color: C.brass, fontSize: 22, lineHeight: 1 }}>←</span>
        </button>
        <div>
          <h1 style={{ color: C.ivory, fontSize: 19, fontWeight: 700, fontFamily: 'Noto Serif JP,serif', lineHeight: 1 }}>Import Game</h1>
          <span style={{ color: C.ivoryMuted, fontSize: 11, fontFamily: 'Inter,sans-serif' }}>Paste a game URL or log to begin review</span>
        </div>
      </div>

      {/* Source cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
        {sources.map(s => (
          <div key={s.id} onClick={() => setActiveInput(activeInput === s.id ? null : s.id)} style={{
            borderRadius: 16, padding: '13px 16px', cursor: 'pointer',
            background: activeInput === s.id ? C.brassGlass : C.glass,
            border: `1px solid ${activeInput === s.id ? C.brassGlassBorder : C.glassBorder}`,
            transition: 'background 0.15s',
          }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: activeInput === s.id ? 10 : 0 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                background: activeInput === s.id ? 'rgba(184,149,90,0.15)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${activeInput === s.id ? C.brassGlassBorder : C.glassBorder}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: activeInput === s.id ? C.brass : C.ivoryMuted, fontSize: 11, fontFamily: 'Noto Serif JP,serif', fontWeight: 700 }}>{s.icon}</span>
              </div>
              <span style={{ color: activeInput === s.id ? C.ivory : C.ivoryDim, fontSize: 14, fontWeight: 600, fontFamily: 'Inter,sans-serif', flex: 1 }}>{s.label}</span>
              <span style={{ color: C.ivoryMuted, fontSize: 14, transform: activeInput === s.id ? 'rotate(90deg)' : 'none', display: 'inline-block', transition: 'transform 0.15s' }}>›</span>
            </div>
            {activeInput === s.id && (
              <input
                placeholder={s.placeholder}
                onClick={e => e.stopPropagation()}
                style={{
                  width: '100%', background: 'rgba(0,0,0,0.3)', border: `1px solid ${C.brassGlassBorder}`,
                  borderRadius: 10, padding: '10px 12px', color: C.ivory, fontSize: 12,
                  fontFamily: 'JetBrains Mono,monospace', outline: 'none', boxSizing: 'border-box',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Target player selector */}
      <div style={{ marginBottom: 18 }}>
        <span style={{ color: C.ivory, fontSize: 13, fontWeight: 600, fontFamily: 'Noto Serif JP,serif', display: 'block', marginBottom: 10 }}>Analyse as player seated at</span>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['E', 'S', 'W', 'N'] as const).map(w => (
            <button key={w} onClick={() => setWind(w)} style={{
              flex: 1, padding: '11px 4px', borderRadius: 12, cursor: 'pointer',
              background: wind === w ? C.brassGlass : C.glass,
              border: `1px solid ${wind === w ? C.brassGlassBorder : C.glassBorder}`,
            }}>
              <span style={{ color: wind === w ? C.brass : C.ivoryMuted, fontSize: 16, fontFamily: 'Noto Serif JP,serif', fontWeight: 700, display: 'block' }}>
                {w === 'E' ? '東' : w === 'S' ? '南' : w === 'W' ? '西' : '北'}
              </span>
              <span style={{ color: wind === w ? C.ivoryDim : C.ivoryMuted, fontSize: 9, fontFamily: 'Inter,sans-serif', marginTop: 2, display: 'block' }}>
                {w === 'E' ? 'East' : w === 'S' ? 'South' : w === 'W' ? 'West' : 'North'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Log preview placeholder */}
      <div style={{
        borderRadius: 14, padding: '14px 16px', marginBottom: 14,
        background: 'rgba(255,255,255,0.02)', border: `1px dashed rgba(255,255,255,0.1)`,
      }}>
        <span style={{ color: C.ivoryMuted, fontSize: 10, fontFamily: 'Inter,sans-serif', display: 'block', marginBottom: 8 }}>Sample log preview</span>
        <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, lineHeight: 1.75 }}>
          <div style={{ color: '#5A6A8A' }}>{'<mjloggm ver="2.3">'}</div>
          <div style={{ color: '#4A8A6A' }}>{'  <INIT seed="0,0,0,2,3,134"'}</div>
          <div style={{ color: '#4A8A6A' }}>{'    ten="250,250,250,250"'}</div>
          <div style={{ color: '#8A6A3A' }}>{'    oya="0" hai0="32,44,…"/>'}</div>
          <div style={{ color: '#5A6A8A' }}>{'  …'}</div>
        </div>
      </div>

      {/* Formats disclosure */}
      <button onClick={() => setShowFormats(f => !f)} style={{
        background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 10px',
        display: 'flex', alignItems: 'center', gap: 5,
      }}>
        <span style={{ color: C.brass, fontSize: 12, fontFamily: 'Inter,sans-serif' }}>Supported formats</span>
        <span style={{ color: C.brass, fontSize: 10, transform: showFormats ? 'rotate(180deg)' : 'none', display: 'inline-block' }}>▾</span>
      </button>
      {showFormats && (
        <div style={{ borderRadius: 12, padding: '12px 14px', marginBottom: 12, background: C.glass, border: `1px solid ${C.glassBorder}` }}>
          {['Tenhou XML (.mjlog)', 'Mahjong Soul game ID or URL', 'Riichi City log ID', 'Plain-text kifu notation'].map(f => (
            <div key={f} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 5 }}>
              <div style={{ width: 4, height: 4, borderRadius: 2, background: C.brass, flexShrink: 0 }} />
              <span style={{ color: C.ivoryDim, fontSize: 11, fontFamily: 'Inter,sans-serif' }}>{f}</span>
            </div>
          ))}
        </div>
      )}

      {/* Privacy note */}
      <div style={{ borderRadius: 12, padding: '12px 14px', marginBottom: 14, background: 'rgba(184,149,90,0.06)', border: `1px solid rgba(184,149,90,0.14)` }}>
        <p style={{ color: C.ivoryMuted, fontSize: 11, fontFamily: 'Inter,sans-serif', lineHeight: 1.65, margin: 0 }}>
          Game logs are processed locally. No log data is stored on external servers. Import history is retained only while the app is active.
        </p>
      </div>

      <button onClick={() => onNav('review-overview')} style={{
        width: '100%', padding: '14px', borderRadius: 16, cursor: 'pointer', marginBottom: 20,
        background: `linear-gradient(135deg,${C.brass},${C.brassBright})`,
        border: 'none', boxShadow: `0 4px 18px rgba(184,149,90,0.35)`,
      }}>
        <span style={{ color: C.ink, fontSize: 15, fontWeight: 700, fontFamily: 'Inter,sans-serif' }}>Import and Analyse →</span>
      </button>
    </div>
  )
}

/* ─── AI SENSEI: REVIEW OVERVIEW ─── */
function ReviewOverviewScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const [filter, setFilter] = useState('All')

  const hands = [
    { k: 'E1', r: 'Tanyao Tsumo · 2,000/1,000', d: '+4,000', q: 'good', tag: 'High Impact' },
    { k: 'E2', r: 'Deal-in to Ren · Riichi Pinfu', d: '−3,900', q: 'mistake', tag: 'Learning Moments' },
    { k: 'E3', r: 'Riichi Pinfu Tsumo · Ippatsu', d: '+4,000', q: 'good', tag: 'High Impact' },
    { k: 'E4', r: 'Tenpai draw (exhaustive)', d: '+1,500', q: 'neutral', tag: 'Scoring' },
  ]

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <button onClick={() => onNav('import-game')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <span style={{ color: C.brass, fontSize: 22, lineHeight: 1 }}>←</span>
        </button>
        <div>
          <h1 style={{ color: C.ivory, fontSize: 17, fontWeight: 700, fontFamily: 'Noto Serif JP,serif', lineHeight: 1.2 }}>Phoenix Cup · E1–E4</h1>
          <span style={{ color: C.ivoryMuted, fontSize: 10, fontFamily: 'Inter,sans-serif' }}>Aug 12 · 4 hands · 12 decision points</span>
        </div>
      </div>

      {/* Summary card */}
      <div style={{
        borderRadius: 20, padding: '18px 20px', marginBottom: 16,
        background: `linear-gradient(135deg,${C.navyMid},${C.jade})`,
        border: `1px solid ${C.brassGlassBorder}`,
      }}>
        <div style={{ display: 'flex', gap: 20, marginBottom: 14 }}>
          {[
            { l: 'Placement', v: '1st', c: C.ivory },
            { l: 'Score Change', v: '+12,300', c: '#4CAF50' },
            { l: 'Hands', v: '4', c: C.ivory },
          ].map(s => (
            <div key={s.l}>
              <span style={{ color: C.ivoryMuted, fontSize: 9, fontFamily: 'Inter,sans-serif', letterSpacing: 0.8, textTransform: 'uppercase', display: 'block', marginBottom: 2 }}>{s.l}</span>
              <span style={{ color: s.c, fontSize: 16, fontWeight: 700, fontFamily: 'JetBrains Mono,monospace' }}>{s.v}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 3, height: 6, marginBottom: 6 }}>
          {[true, false, true, true].map((g, i) => (
            <div key={i} style={{ flex: 1, height: '100%', borderRadius: 3, background: g ? '#4CAF50' : C.vermilion }} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 14 }}>
          <span style={{ color: '#4CAF50', fontSize: 10, fontFamily: 'Inter,sans-serif' }}>3 strong decisions</span>
          <span style={{ color: C.vermilion, fontSize: 10, fontFamily: 'Inter,sans-serif' }}>1 avoidable deal-in</span>
        </div>
      </div>

      {/* AI notice */}
      <div style={{
        borderRadius: 12, padding: '10px 14px', marginBottom: 14,
        background: 'rgba(184,149,90,0.06)', border: `1px solid rgba(184,149,90,0.14)`,
        display: 'flex', gap: 8, alignItems: 'flex-start',
      }}>
        <span style={{ color: C.brass, fontSize: 13, flexShrink: 0, lineHeight: 1.4 }}>ℹ</span>
        <p style={{ color: C.ivoryMuted, fontSize: 11, fontFamily: 'Inter,sans-serif', lineHeight: 1.6, margin: 0 }}>
          AI decision ratings are model estimates — treat them as coaching signals, not absolute verdicts. Context and playstyle always matter.
        </p>
      </div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto', paddingBottom: 2 }}>
        {['All', 'High Impact', 'Defensive', 'Scoring', 'Learning Moments'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '6px 12px', borderRadius: 10, cursor: 'pointer', flexShrink: 0,
            background: filter === f ? C.brassGlass : C.glass,
            border: `1px solid ${filter === f ? C.brassGlassBorder : C.glassBorder}`,
          }}>
            <span style={{ fontSize: 11, fontFamily: 'Inter,sans-serif', fontWeight: filter === f ? 600 : 400, color: filter === f ? C.ivory : C.ivoryMuted, whiteSpace: 'nowrap' }}>{f}</span>
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <div style={{ position: 'absolute', left: 17, top: 14, bottom: 14, width: 1.5, background: 'rgba(255,255,255,0.07)' }} />
        {hands.map((h, i) => (
          <div key={i} onClick={() => onNav('decision-moment')} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 12, cursor: 'pointer' }}>
            <div style={{
              width: 14, height: 14, borderRadius: 7, flexShrink: 0, marginTop: 14, zIndex: 1,
              background: h.q === 'good' ? '#4CAF50' : h.q === 'mistake' ? C.vermilion : C.ivoryMuted,
              border: `2px solid ${C.ink}`,
              boxShadow: h.q === 'mistake' ? `0 0 8px rgba(204,34,0,0.45)` : h.q === 'good' ? `0 0 8px rgba(76,175,80,0.35)` : 'none',
            }} />
            <div style={{
              flex: 1, borderRadius: 14, padding: '12px 14px',
              background: h.q === 'mistake' ? 'rgba(204,34,0,0.06)' : C.glass,
              border: `1px solid ${h.q === 'mistake' ? 'rgba(204,34,0,0.18)' : C.glassBorder}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ color: C.brass, fontSize: 12, fontWeight: 700, fontFamily: 'JetBrains Mono,monospace' }}>{h.k}</span>
                  <span style={{ fontSize: 9, fontFamily: 'Inter,sans-serif', color: C.ivoryMuted, background: C.glass, padding: '1px 6px', borderRadius: 5, border: `1px solid ${C.glassBorder}` }}>{h.tag}</span>
                </div>
                <span style={{ color: h.d.startsWith('+') ? '#4CAF50' : C.vermilion, fontSize: 12, fontFamily: 'JetBrains Mono,monospace', fontWeight: 600 }}>{h.d}</span>
              </div>
              <span style={{ color: C.ivoryDim, fontSize: 12, fontFamily: 'Inter,sans-serif', display: 'block', marginBottom: 8 }}>{h.r}</span>
              <span style={{ color: C.brass, fontSize: 10, fontFamily: 'Inter,sans-serif' }}>Tap to review decisions →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── AI SENSEI: DECISION MOMENT ─── */
function DecisionMomentScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const [selIdx, setSelIdx] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [showDeep, setShowDeep] = useState(false)
  const [showWhySheet, setShowWhySheet] = useState(false)

  const hand = ['2m', '3m', '4m', '5p', '6p', '7p', '2s', '3s', '4s', 'E', 'E', '8m', '9m']
  const aiRec = 9 // index of 'E' (first East)
  const playerTile = selIdx !== null ? hand[selIdx] : null
  const isMatch = selIdx !== null && hand[selIdx] === 'E'

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
        background: 'rgba(13,21,41,0.9)', borderBottom: `0.5px solid ${C.brassGlassBorder}`,
        height: 44,
      }}>
        <button onClick={() => onNav('review-overview')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <span style={{ color: C.brass, fontSize: 22, lineHeight: 1 }}>←</span>
        </button>
        <div style={{ flex: 1 }}>
          <span style={{ color: C.ivory, fontSize: 13, fontWeight: 600, fontFamily: 'Noto Serif JP,serif' }}>E2 · Turn 7</span>
          <span style={{ color: C.ivoryMuted, fontSize: 9, fontFamily: 'Inter,sans-serif', display: 'block' }}>East 2 · Honba 0 · 55 tiles remaining</span>
        </div>
        <span style={{ color: C.ivoryMuted, fontSize: 11, fontFamily: 'JetBrains Mono,monospace' }}>7 / 12</span>
      </div>

      {/* Compact table */}
      <div style={{
        flexShrink: 0, height: 148,
        background: `radial-gradient(ellipse at 50% 50%,${C.jadeLight},${C.jade},${C.jadeDark})`,
        padding: '8px 12px',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, marginBottom: 4 }}>
          <span style={{ color: C.ivoryDim, fontSize: 8, fontFamily: 'Inter,sans-serif', background: 'rgba(0,0,0,0.35)', padding: '1px 7px', borderRadius: 4 }}>Ren · 北 · 28,400</span>
          <div style={{ display: 'flex', gap: 1 }}>{Array.from({ length: 9 }).map((_, i) => <Tile key={i} n="?" size="xs" fd />)}</div>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
            <span style={{ color: C.ivoryDim, fontSize: 8, fontFamily: 'Inter,sans-serif', background: 'rgba(0,0,0,0.3)', padding: '1px 5px', borderRadius: 3 }}>Sora</span>
            <div style={{ display: 'flex', gap: 1 }}>{Array.from({ length: 4 }).map((_, i) => <Tile key={i} n="?" size="xs" fd />)}</div>
          </div>
          <div style={{
            width: 76, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            background: 'rgba(0,0,0,0.2)', borderRadius: 10, padding: '6px',
          }}>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <span style={{ color: C.ivoryMuted, fontSize: 8 }}>Dora</span>
              <Tile n="7p" size="xs" />
            </div>
            <div style={{ width: 26, height: 26, borderRadius: 13, background: `linear-gradient(135deg,${C.navyMid},${C.navy})`, border: `1.5px solid ${C.brassGlassBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: C.brass, fontSize: 10, fontFamily: 'Noto Serif JP,serif', fontWeight: 700 }}>東</span>
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
            <span style={{ color: C.ivoryDim, fontSize: 8, fontFamily: 'Inter,sans-serif', background: 'rgba(0,0,0,0.3)', padding: '1px 5px', borderRadius: 3 }}>Mika</span>
            <div style={{ display: 'flex', gap: 1 }}>{Array.from({ length: 4 }).map((_, i) => <Tile key={i} n="?" size="xs" fd />)}</div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 4 }}>
          {[{ n: 'Ren', s: '28.4k' }, { n: 'Sora', s: '27.1k' }, { n: 'Mika', s: '31.2k' }, { n: 'You', s: '13.3k' }].map(p => (
            <span key={p.n} style={{ color: p.n === 'You' ? C.brass : C.ivoryMuted, fontSize: 8, fontFamily: 'JetBrains Mono,monospace' }}>{p.n} {p.s}</span>
          ))}
        </div>
      </div>

      {/* Hand */}
      <div style={{ flexShrink: 0, padding: '12px 8px 6px', background: '#06060C', borderTop: `0.5px solid rgba(255,255,255,0.05)` }}>
        <span style={{ color: revealed ? C.ivoryMuted : C.ivory, fontSize: 12, fontWeight: 600, fontFamily: 'Noto Serif JP,serif', display: 'block', textAlign: 'center', marginBottom: 8 }}>
          {revealed ? 'You chose to discard:' : 'What would you discard?'}
        </span>
        <div style={{ display: 'flex', gap: 2, justifyContent: 'center', overflow: 'visible', paddingTop: 10 }}>
          {hand.map((t, i) => (
            <Tile key={i} n={t} size="sm" sel={selIdx === i} onClick={() => !revealed && setSelIdx(selIdx === i ? null : i)} />
          ))}
        </div>
      </div>

      {!revealed ? (
        <div style={{ flexShrink: 0, padding: '10px 16px', background: C.ink }}>
          <button onClick={() => selIdx !== null && setRevealed(true)} style={{
            width: '100%', padding: '13px', borderRadius: 14,
            cursor: selIdx !== null ? 'pointer' : 'default',
            background: selIdx !== null ? `linear-gradient(135deg,${C.brass},${C.brassBright})` : C.glass,
            border: `1px solid ${selIdx !== null ? 'transparent' : C.glassBorder}`,
            opacity: selIdx !== null ? 1 : 0.5,
          }}>
            <span style={{ color: selIdx !== null ? C.ink : C.ivoryMuted, fontSize: 14, fontWeight: 700, fontFamily: 'Inter,sans-serif' }}>
              {selIdx !== null ? `Discard ${playerTile} — Compare with AI →` : 'Tap a tile to select'}
            </span>
          </button>
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 16px 0' }}>
          {/* Comparison */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <div style={{
              flex: 1, borderRadius: 14, padding: '12px',
              background: isMatch ? 'rgba(76,175,80,0.08)' : 'rgba(204,34,0,0.08)',
              border: `1px solid ${isMatch ? 'rgba(76,175,80,0.2)' : 'rgba(204,34,0,0.2)'}`,
            }}>
              <span style={{ color: C.ivoryMuted, fontSize: 9, fontFamily: 'Inter,sans-serif', letterSpacing: 0.8, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Your choice</span>
              <Tile n={hand[selIdx!]} size="sm" />
              <span style={{ color: isMatch ? '#4CAF50' : C.vermilion, fontSize: 11, fontFamily: 'Inter,sans-serif', fontWeight: 600, display: 'block', marginTop: 6 }}>
                {isMatch ? '✓ Matches AI estimate' : '✗ Differs from AI estimate'}
              </span>
            </div>
            <div style={{ flex: 1, borderRadius: 14, padding: '12px', background: C.brassGlass, border: `1px solid ${C.brassGlassBorder}` }}>
              <span style={{ color: C.brass, fontSize: 9, fontFamily: 'Inter,sans-serif', letterSpacing: 0.8, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>AI Estimate</span>
              <Tile n="E" size="sm" sel />
              <span style={{ color: C.brass, fontSize: 11, fontFamily: 'Inter,sans-serif', fontWeight: 600, display: 'block', marginTop: 6 }}>East Wind (東)</span>
            </div>
          </div>

          {/* Metrics grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7, marginBottom: 10 }}>
            {[
              { l: 'Shanten', v: '0 → 0', n: 'Stays tenpai', ok: true },
              { l: 'Ukeire', v: '+4 tiles', n: 'After discard E', ok: true },
              { l: 'Deal-in Risk', v: '↓ 8%', n: 'E inferred safe', ok: true },
              { l: 'Expected Value', v: '≈ +820', n: 'AI estimate', ok: true },
            ].map(m => (
              <div key={m.l} style={{ borderRadius: 12, padding: '10px 12px', background: C.glass, border: `1px solid ${C.glassBorder}` }}>
                <span style={{ color: C.ivoryMuted, fontSize: 9, fontFamily: 'Inter,sans-serif', letterSpacing: 0.6, textTransform: 'uppercase', display: 'block', marginBottom: 2 }}>{m.l}</span>
                <span style={{ color: C.ivory, fontSize: 14, fontWeight: 700, fontFamily: 'JetBrains Mono,monospace', display: 'block' }}>{m.v}</span>
                <span style={{ color: C.ivoryMuted, fontSize: 9, fontFamily: 'Inter,sans-serif' }}>{m.n}</span>
              </div>
            ))}
          </div>

          <button onClick={() => setShowDeep(d => !d)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 10px', display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ color: C.brass, fontSize: 12, fontFamily: 'Inter,sans-serif' }}>Show deeper analysis</span>
            <span style={{ color: C.brass, fontSize: 10, transform: showDeep ? 'rotate(180deg)' : 'none', display: 'inline-block' }}>▾</span>
          </button>
          {showDeep && (
            <div style={{ borderRadius: 14, padding: '12px 14px', marginBottom: 10, background: C.glass, border: `1px solid ${C.glassBorder}` }}>
              <p style={{ color: C.ivoryDim, fontSize: 12, fontFamily: 'Inter,sans-serif', lineHeight: 1.65, margin: 0 }}>
                Discarding East improves ukeire from 8 to 12. The 2m–3m–4m / 5p–6p–7p / 2s–3s–4s structure is complete. East as an isolated honour has no yaku value here and no sequence potential. The 8m–9m block waits on 7m. All values are inferred estimates based on visible tile state only.
              </p>
            </div>
          )}

          <button onClick={() => setShowWhySheet(true)} style={{
            width: '100%', padding: '12px', borderRadius: 14, cursor: 'pointer', marginBottom: 16,
            background: C.glass, border: `1px solid ${C.glassBorder}`,
          }}>
            <span style={{ color: C.ivory, fontSize: 13, fontWeight: 600, fontFamily: 'Inter,sans-serif' }}>Why this recommendation? →</span>
          </button>
        </div>
      )}

      {/* Decision detail bottom sheet */}
      {showWhySheet && (
        <>
          <div onClick={() => setShowWhySheet(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.52)', zIndex: 10 }} />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 11,
            background: `linear-gradient(180deg,${C.navyMid},${C.navy})`,
            borderTop: `1px solid ${C.brassGlassBorder}`, borderRadius: '20px 20px 0 0',
            boxShadow: '0 -8px 40px rgba(0,0,0,0.65)', paddingBottom: 20,
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 8px' }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.15)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px 14px' }}>
              <span style={{ color: C.ivory, fontSize: 15, fontWeight: 700, fontFamily: 'Noto Serif JP,serif' }}>Why this recommendation?</span>
              <button onClick={() => setShowWhySheet(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <span style={{ color: C.ivoryMuted, fontSize: 20 }}>×</span>
              </button>
            </div>
            <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { layer: 'Hand shape', icon: '⬡', text: 'Discarding East removes an isolated tile with no sequence path, improving acceptance from 8 to 12 tiles without touching the three complete blocks.' },
                { layer: 'Opponent danger', icon: '⚑', text: 'East Wind has not appeared in any discard river. The AI infers it is likely safe against current patterns — this is an estimate, not a guarantee.' },
                { layer: 'Future value', icon: '◈', text: 'The 8m–9m block waits on 7m. Preserving this path gives higher estimated value than alternatives. All figures are model estimates from visible information.' },
              ].map(l => (
                <div key={l.layer} style={{ borderRadius: 14, padding: '12px 14px', background: C.glass, border: `1px solid ${C.glassBorder}` }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ color: C.brass, fontSize: 13 }}>{l.icon}</span>
                    <span style={{ color: C.brass, fontSize: 10, fontFamily: 'Inter,sans-serif', fontWeight: 700, letterSpacing: 0.5 }}>{l.layer}</span>
                  </div>
                  <p style={{ color: C.ivoryDim, fontSize: 12, fontFamily: 'Inter,sans-serif', lineHeight: 1.65, margin: 0 }}>{l.text}</p>
                </div>
              ))}
            </div>
            <div style={{ padding: '12px 16px 0' }}>
              <span style={{ color: C.ivoryMuted, fontSize: 10, fontFamily: 'Inter,sans-serif', display: 'block', marginBottom: 8 }}>Estimated discard outcomes (model only)</span>
              {[
                { label: 'Discard East', pct: 68, color: C.brass },
                { label: 'Discard 9-Man', pct: 22, color: C.ivoryDim },
                { label: 'Other', pct: 10, color: C.ivoryMuted },
              ].map(b => (
                <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
                  <span style={{ color: C.ivoryMuted, fontSize: 10, fontFamily: 'Inter,sans-serif', width: 88, flexShrink: 0 }}>{b.label}</span>
                  <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 3 }}>
                    <div style={{ width: `${b.pct}%`, height: '100%', background: b.color, borderRadius: 3 }} />
                  </div>
                  <span style={{ color: b.color, fontSize: 10, fontFamily: 'JetBrains Mono,monospace', width: 28, textAlign: 'right', flexShrink: 0 }}>{b.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

/* ─── AI SENSEI: TRAINING PLAN (Learn tab) ─── */
function TrainingPlanScreen({ onNav }: { onNav: (s: Screen) => void }) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 0' }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
          <span style={{ color: C.brass, fontSize: 10, fontFamily: 'Inter,sans-serif', fontWeight: 700, letterSpacing: 1.3, textTransform: 'uppercase' }}>AI Sensei</span>
          <div style={{ width: 4, height: 4, borderRadius: 2, background: C.brass, opacity: 0.5 }} />
          <span style={{ color: C.ivoryMuted, fontSize: 10, fontFamily: 'Inter,sans-serif' }}>Training</span>
        </div>
        <h1 style={{ color: C.ivory, fontSize: 22, fontWeight: 700, fontFamily: 'Noto Serif JP,serif', marginBottom: 2 }}>Your Training Plan</h1>
        <p style={{ color: C.ivoryMuted, fontSize: 11, fontFamily: 'Inter,sans-serif' }}>Week of Aug 11 · 3 of 5 drills complete</p>
      </div>

      {/* Sensei card */}
      <div style={{
        borderRadius: 18, padding: '14px 16px', marginBottom: 18,
        background: C.brassGlass, border: `1px solid ${C.brassGlassBorder}`,
        display: 'flex', gap: 12, alignItems: 'flex-start',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: 'linear-gradient(135deg,#2A3A6A,#4A2A5A)',
          border: `1.5px solid ${C.brassGlassBorder}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ color: C.brass, fontSize: 14, fontFamily: 'Noto Serif JP,serif', fontWeight: 700 }}>師</span>
        </div>
        <div>
          <span style={{ color: C.brass, fontSize: 9, fontFamily: 'Inter,sans-serif', fontWeight: 700, letterSpacing: 0.9, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Sensei</span>
          <p style={{ color: C.ivoryDim, fontSize: 12, fontFamily: 'Inter,sans-serif', lineHeight: 1.65, margin: 0 }}>
            You often choose high-value lines late in the hand. This week, let's practise when speed is more important than maximum hand value.
          </p>
        </div>
      </div>

      {/* Drill cards */}
      <span style={{ color: C.ivory, fontSize: 13, fontWeight: 600, fontFamily: 'Noto Serif JP,serif', display: 'block', marginBottom: 10 }}>This Week's Drills</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
        {[
          { title: 'Choose Safe Folds', desc: 'Recognise when defending beats pressing forward.', diff: 'Intermediate', mins: '8 min', done: true },
          { title: 'Compare 1-Shanten Shapes', desc: 'Evaluate two 1-shanten hands and pick the better discard.', diff: 'Intermediate', mins: '10 min', done: true },
          { title: 'Recognise Tanyao Opportunities', desc: 'Spot early tanyao paths before committing to a hand direction.', diff: 'Beginner', mins: '6 min', done: true },
          { title: 'Calculate Han and Fu', desc: 'Estimate hand value from a winning state. Each term is explained.', diff: 'Advanced', mins: '12 min', done: false },
          { title: 'Speed vs. Value Decisions', desc: 'When should you settle for a faster, lower-value hand?', diff: 'Intermediate', mins: '10 min', done: false },
        ].map(c => (
          <div key={c.title} style={{
            borderRadius: 18, overflow: 'hidden',
            background: c.done ? C.glass : `linear-gradient(135deg,${C.navyMid},${C.ink})`,
            border: `1px solid ${c.done ? C.glassBorder : C.brassGlassBorder}`,
          }}>
            <div style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <span style={{ color: c.done ? C.ivoryMuted : C.ivory, fontSize: 13, fontWeight: 600, fontFamily: 'Inter,sans-serif', flex: 1, marginRight: 8 }}>
                  {c.done ? '✓ ' : ''}{c.title}
                </span>
                <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                  <span style={{ fontSize: 9, fontFamily: 'Inter,sans-serif', color: C.ivoryMuted, background: C.glass, padding: '2px 6px', borderRadius: 5, border: `1px solid ${C.glassBorder}` }}>{c.diff}</span>
                  <span style={{ fontSize: 9, fontFamily: 'Inter,sans-serif', color: C.ivoryMuted, background: C.glass, padding: '2px 6px', borderRadius: 5, border: `1px solid ${C.glassBorder}` }}>{c.mins}</span>
                </div>
              </div>
              <p style={{ color: C.ivoryMuted, fontSize: 11, fontFamily: 'Inter,sans-serif', lineHeight: 1.55, margin: 0 }}>{c.desc}</p>
            </div>
            {!c.done && (
              <div style={{ borderTop: `1px solid rgba(255,255,255,0.05)` }}>
                <button onClick={() => onNav('practice-drill')} style={{ width: '100%', padding: '12px', cursor: 'pointer', background: C.brassGlass, border: 'none' }}>
                  <span style={{ color: C.ivory, fontSize: 13, fontWeight: 600, fontFamily: 'Inter,sans-serif' }}>Start Drill →</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Reference library */}
      <span style={{ color: C.ivory, fontSize: 13, fontWeight: 600, fontFamily: 'Noto Serif JP,serif', display: 'block', marginBottom: 10 }}>Reference Library</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 20 }}>
        {['Yaku Reference Sheet', 'Shanten Calculator Guide', 'Deal-in Risk Tables', 'Scoring Cheatsheet (Han · Fu)'].map(l => (
          <div key={l} style={{
            padding: '12px 16px', borderRadius: 14, background: C.glass, border: `1px solid ${C.glassBorder}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ color: C.ivoryDim, fontSize: 13, fontFamily: 'Inter,sans-serif' }}>{l}</span>
            <span style={{ color: C.ivoryMuted, fontSize: 14 }}>›</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── AI SENSEI: PRACTICE DRILL ─── */
function PracticeDrillScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const [answer, setAnswer] = useState<number | null>(null)
  const [confidence, setConfidence] = useState(3)
  const [showFeedback, setShowFeedback] = useState(false)
  const [showReasoning, setShowReasoning] = useState(false)

  const hand = ['2m', '3m', '4m', '5p', '6p', '7p', '3s', '4s', '5s', 'E', 'E', '7m', '8m']
  const choices = ['東 (East Wind)', '8m (8-Man)', '7m (7-Man)', '5p (5-Pin)']
  const correctIdx = 0
  const isCorrect = answer === correctIdx

  const confLabels = ['Guessing', 'Uncertain', 'Fairly sure', 'Confident', 'Very sure']

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
        background: 'rgba(13,21,41,0.9)', borderBottom: `0.5px solid ${C.brassGlassBorder}`, height: 44,
      }}>
        <button onClick={() => onNav('learn')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <span style={{ color: C.brass, fontSize: 22, lineHeight: 1 }}>←</span>
        </button>
        <div style={{ flex: 1 }}>
          <span style={{ color: C.ivory, fontSize: 13, fontWeight: 600, fontFamily: 'Noto Serif JP,serif' }}>Speed vs. Value Decisions</span>
        </div>
        <span style={{ color: C.ivoryMuted, fontSize: 11, fontFamily: 'JetBrains Mono,monospace' }}>4 / 10</span>
      </div>
      {/* Progress bar */}
      <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', flexShrink: 0 }}>
        <div style={{ width: '40%', height: '100%', background: C.brass }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 16px 0' }}>
        {/* Question */}
        <div style={{ marginBottom: 16 }}>
          <p style={{ color: C.ivory, fontSize: 15, fontWeight: 600, fontFamily: 'Noto Serif JP,serif', lineHeight: 1.45, marginBottom: 4 }}>
            Which discard gives the fastest route to tenpai?
          </p>
          <span style={{ color: C.ivoryMuted, fontSize: 11, fontFamily: 'Inter,sans-serif' }}>
            Consider ukeire (tile acceptance) and shanten reduction.
          </span>
        </div>

        {/* Hand display */}
        <div style={{ marginBottom: 18 }}>
          <span style={{ color: C.ivoryMuted, fontSize: 10, fontFamily: 'Inter,sans-serif', display: 'block', marginBottom: 8 }}>Your hand:</span>
          <div style={{ display: 'flex', gap: 2, justifyContent: 'center', paddingTop: 10, overflow: 'visible' }}>
            {hand.map((t, i) => <Tile key={i} n={t} size="sm" />)}
          </div>
        </div>

        {/* Answer choices */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {choices.map((c, i) => {
            let bg = C.glass, border = C.glassBorder, textColor: string = C.ivoryDim
            if (showFeedback) {
              if (i === correctIdx) { bg = 'rgba(76,175,80,0.1)'; border = 'rgba(76,175,80,0.3)'; textColor = '#4CAF50' }
              else if (i === answer) { bg = 'rgba(204,34,0,0.08)'; border = 'rgba(204,34,0,0.25)'; textColor = C.vermilion }
            } else if (answer === i) {
              bg = C.brassGlass; border = C.brassGlassBorder; textColor = C.ivory
            }
            return (
              <button key={i} onClick={() => !showFeedback && setAnswer(i)} style={{
                padding: '14px 16px', borderRadius: 14, cursor: showFeedback ? 'default' : 'pointer',
                background: bg, border: `1px solid ${border}`,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 11, flexShrink: 0,
                  background: showFeedback && i === correctIdx ? 'rgba(76,175,80,0.2)' : 'rgba(255,255,255,0.06)',
                  border: `1px solid ${showFeedback && i === correctIdx ? 'rgba(76,175,80,0.4)' : C.glassBorder}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ color: textColor, fontSize: 10, fontFamily: 'JetBrains Mono,monospace', fontWeight: 700 }}>
                    {showFeedback && i === correctIdx ? '✓' : String.fromCharCode(65 + i)}
                  </span>
                </div>
                <span style={{ color: textColor, fontSize: 13, fontFamily: 'Inter,sans-serif', fontWeight: answer === i ? 600 : 400 }}>{c}</span>
              </button>
            )
          })}
        </div>

        {/* Confidence slider */}
        {!showFeedback && answer !== null && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: C.ivoryMuted, fontSize: 11, fontFamily: 'Inter,sans-serif' }}>How confident?</span>
              <span style={{ color: C.brass, fontSize: 11, fontFamily: 'JetBrains Mono,monospace', fontWeight: 600 }}>{confLabels[confidence - 1]}</span>
            </div>
            <input type="range" min="1" max="5" value={confidence} onChange={e => setConfidence(Number(e.target.value))}
              style={{ width: '100%', accentColor: C.brass }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
              <span style={{ color: C.ivoryMuted, fontSize: 9, fontFamily: 'Inter,sans-serif' }}>Guessing</span>
              <span style={{ color: C.ivoryMuted, fontSize: 9, fontFamily: 'Inter,sans-serif' }}>Very sure</span>
            </div>
          </div>
        )}

        {/* Feedback */}
        {showFeedback && (
          <div style={{ marginBottom: 14 }}>
            <div style={{
              borderRadius: 14, padding: '14px 16px', marginBottom: 10,
              background: isCorrect ? 'rgba(76,175,80,0.08)' : C.glass,
              border: `1px solid ${isCorrect ? 'rgba(76,175,80,0.2)' : C.glassBorder}`,
            }}>
              <span style={{ color: isCorrect ? '#4CAF50' : C.ivoryDim, fontSize: 14, fontWeight: 600, fontFamily: 'Inter,sans-serif', display: 'block', marginBottom: 6 }}>
                {isCorrect ? '✓ Good read' : 'A different approach works better here'}
              </span>
              <p style={{ color: C.ivoryDim, fontSize: 12, fontFamily: 'Inter,sans-serif', lineHeight: 1.65, margin: 0 }}>
                Discarding East (isolated honour tile) removes a tile with no sequence potential and improves ukeire by 4. The three complete sequences remain intact. Honour tiles without yaku contribution are typically priority discards.
              </p>
            </div>
            <button onClick={() => setShowReasoning(r => !r)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 10px', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ color: C.brass, fontSize: 12, fontFamily: 'Inter,sans-serif' }}>See expert reasoning</span>
              <span style={{ color: C.brass, fontSize: 10, transform: showReasoning ? 'rotate(180deg)' : 'none', display: 'inline-block' }}>▾</span>
            </button>
            {showReasoning && (
              <div style={{ borderRadius: 12, padding: '12px 14px', marginBottom: 10, background: C.glass, border: `1px solid ${C.glassBorder}` }}>
                <p style={{ color: C.ivoryMuted, fontSize: 11, fontFamily: 'Inter,sans-serif', lineHeight: 1.65, margin: 0 }}>
                  East has no yaku value unless you are East player (東家). The hand has three complete mentsu (234m, 567p, 345s). The working area is 7m–8m–EE. Eliminating the honour tile rather than the partial sequence preserves the 7m–8m tenpai wait on 6m or 9m, giving 6 acceptance tiles vs. 2.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        {!showFeedback ? (
          <button onClick={() => answer !== null && setShowFeedback(true)} style={{
            width: '100%', padding: '14px', borderRadius: 14, marginBottom: 20,
            cursor: answer !== null ? 'pointer' : 'default',
            background: answer !== null ? `linear-gradient(135deg,${C.brass},${C.brassBright})` : C.glass,
            border: `1px solid ${answer !== null ? 'transparent' : C.glassBorder}`,
            opacity: answer !== null ? 1 : 0.5,
          }}>
            <span style={{ color: answer !== null ? C.ink : C.ivoryMuted, fontSize: 14, fontWeight: 700, fontFamily: 'Inter,sans-serif' }}>Check Answer</span>
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            <button style={{ padding: '12px', borderRadius: 14, cursor: 'pointer', background: C.glass, border: `1px solid ${C.glassBorder}` }}>
              <span style={{ color: C.ivoryDim, fontSize: 13, fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>+ Add to Review Queue</span>
            </button>
            <button onClick={() => { setAnswer(null); setShowFeedback(false); setShowReasoning(false) }} style={{
              padding: '14px', borderRadius: 14, cursor: 'pointer',
              background: `linear-gradient(135deg,${C.brass},${C.brassBright})`,
              border: 'none', boxShadow: `0 4px 18px rgba(184,149,90,0.32)`,
            }}>
              <span style={{ color: C.ink, fontSize: 15, fontWeight: 700, fontFamily: 'Inter,sans-serif' }}>Next Drill →</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── MAHJONG JOURNEY ─── */

const J = {
  tc: '#C05A30',
  tcGlass: 'rgba(192,90,48,0.12)',
  tcBorder: 'rgba(192,90,48,0.28)',
  mei: 'linear-gradient(135deg,#2E1640,#1E1030)',
  kai: 'linear-gradient(135deg,#0E2A40,#0A1A30)',
  yuki: 'linear-gradient(135deg,#142234,#0A1622)',
}

const K = {
  gold: '#9A8A5A',
  goldGlass: 'rgba(154,138,90,0.12)',
  goldBorder: 'rgba(154,138,90,0.28)',
  coral: '#D05040',
  coralGlass: 'rgba(208,80,64,0.12)',
  coralBorder: 'rgba(208,80,64,0.28)',
  forest: '#0C2218',
  forestLight: '#163022',
  panel: '#0D1824',
}

const L = {
  indigo: '#0C0C28',
  indigoMid: '#141440',
  indigoLight: '#1E1E58',
  mint: '#3ADDA8',
  mintGlass: 'rgba(58,221,168,0.10)',
  mintBorder: 'rgba(58,221,168,0.22)',
  copper: '#B87840',
  copperGlass: 'rgba(184,120,64,0.12)',
  copperBorder: 'rgba(184,120,64,0.28)',
}

function JNavIcon({ type, active }: { type: string; active: boolean }) {
  const col = active ? J.tc : '#55524D'
  const sw = active ? '1.8' : '1.5'
  const icons: Record<string, React.ReactElement> = {
    'journey-home': <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M3 12L12 3l9 9" stroke={col} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/><path d="M5 10v10a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1V10" stroke={col} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/></svg>,
    'journey-table': <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="16" rx="2" stroke={col} strokeWidth={sw}/><path d="M9 9h6M9 13h6M9 17h4" stroke={col} strokeWidth={sw} strokeLinecap="round"/></svg>,
    'journey-friends': <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3" stroke={col} strokeWidth={sw}/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke={col} strokeWidth={sw} strokeLinecap="round"/><circle cx="17" cy="8" r="2.5" stroke={col} strokeWidth={sw}/><path d="M19 20c0-2.8-2-5.2-4.5-5.8" stroke={col} strokeWidth={sw} strokeLinecap="round"/></svg>,
    'journey-learn': <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 3L2 8l10 5 10-5-10-5z" stroke={col} strokeWidth={sw} strokeLinejoin="round"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke={col} strokeWidth={sw} strokeLinecap="round"/></svg>,
    'journey-profile': <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke={col} strokeWidth={sw}/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={col} strokeWidth={sw} strokeLinecap="round"/></svg>,
  }
  return icons[type] || <svg width="22" height="22"/>
}

const JOURNEY_TABS = [
  { id: 'journey-home', label: 'Home' },
  { id: 'journey-table', label: 'Play' },
  { id: 'journey-friends', label: 'Friends' },
  { id: 'journey-learn', label: 'Learn' },
  { id: 'journey-profile', label: 'Profile' },
]

function JourneyNav({ active, onNav }: { active: string; onNav: (t: string) => void }) {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, height: 83,
      background: 'rgba(8,8,14,0.97)', backdropFilter: 'blur(24px)',
      borderTop: `0.5px solid ${J.tcBorder}`,
      display: 'flex', alignItems: 'flex-start', paddingTop: 10,
    }}>
      {JOURNEY_TABS.map(t => (
        <button key={t.id} onClick={() => onNav(t.id)} style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        }}>
          <JNavIcon type={t.id} active={active === t.id} />
          <span style={{
            fontSize: 10, fontFamily: 'Inter,sans-serif', letterSpacing: 0.2,
            fontWeight: active === t.id ? 600 : 400,
            color: active === t.id ? J.tc : '#55524D',
          }}>{t.label}</span>
        </button>
      ))}
    </div>
  )
}

function ModeSwitcher({ mode, onSwitch }: { mode: 'arena' | 'journey' | 'copilot' | 'lab'; onSwitch: (m: 'arena' | 'journey' | 'copilot' | 'lab') => void }) {
  const opts = [
    { id: 'arena' as const, label: 'Arena', bg: C.brassGlass, border: C.brassGlassBorder, col: C.brass },
    { id: 'journey' as const, label: 'Journey', bg: J.tcGlass, border: J.tcBorder, col: J.tc },
    { id: 'copilot' as const, label: 'Copilot', bg: K.goldGlass, border: K.goldBorder, col: K.gold },
    { id: 'lab' as const, label: 'Lab', bg: L.mintGlass, border: L.mintBorder, col: L.mint },
  ]
  return (
    <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: 11, padding: 2, border: `1px solid ${C.glassBorder}`, marginBottom: 16 }}>
      {opts.map(m => (
        <button key={m.id} onClick={() => onSwitch(m.id)} style={{
          flex: 1, padding: '8px 4px', borderRadius: 9, cursor: 'pointer',
          background: mode === m.id ? m.bg : 'transparent',
          border: `1px solid ${mode === m.id ? m.border : 'transparent'}`,
        }}>
          <span style={{ fontSize: 11, fontFamily: 'Inter,sans-serif', fontWeight: mode === m.id ? 600 : 400, color: mode === m.id ? m.col : C.ivoryMuted }}>{m.label}</span>
        </button>
      ))}
    </div>
  )
}

/* ─── JOURNEY: ONBOARDING ─── */
function JourneyOnboard({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0)
  const [level, setLevel] = useState<string | null>(null)
  const [coaching, setCoaching] = useState<string | null>(null)

  const companions = [
    { kanji: '梅', grad: J.mei, name: 'Mei' },
    { kanji: '海', grad: J.kai, name: 'Kai' },
    { kanji: '雪', grad: J.yuki, name: 'Yuki' },
  ]

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 20px 24px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 24 }}>
        {companions.map(c => (
          <div key={c.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
            <div style={{
              width: 58, height: 58, borderRadius: 18, background: c.grad,
              border: `1.5px solid ${J.tcBorder}`, boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: C.ivory, fontSize: 21, fontFamily: 'Noto Serif JP,serif', fontWeight: 700 }}>{c.kanji}</span>
            </div>
            <span style={{ color: C.ivoryMuted, fontSize: 10, fontFamily: 'Inter,sans-serif' }}>{c.name}</span>
          </div>
        ))}
      </div>

      {step === 0 && <>
        <h1 style={{ color: C.ivory, fontSize: 22, fontWeight: 700, fontFamily: 'Noto Serif JP,serif', textAlign: 'center', marginBottom: 6 }}>
          Welcome to Mahjong Journey
        </h1>
        <p style={{ color: C.ivoryDim, fontSize: 13, fontFamily: 'Inter,sans-serif', textAlign: 'center', lineHeight: 1.65, marginBottom: 24 }}>
          Learn, play, and enjoy Mahjong with friendly AI companions at your own pace.
        </p>
        <span style={{ color: C.ivory, fontSize: 14, fontWeight: 600, fontFamily: 'Noto Serif JP,serif', marginBottom: 12, display: 'block' }}>
          How familiar are you with Mahjong?
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {[
            { id: 'new', label: 'New to Mahjong', sub: "Haven't played before — start from scratch" },
            { id: 'basics', label: 'I know the basics', sub: 'I understand tiles and turns, but want to improve' },
            { id: 'regular', label: 'I play regularly', sub: 'I want smarter coaching and game review' },
          ].map(opt => (
            <button key={opt.id} onClick={() => setLevel(opt.id)} style={{
              padding: '15px 18px', borderRadius: 18, cursor: 'pointer', textAlign: 'left',
              background: level === opt.id ? J.tcGlass : C.glass,
              border: `1px solid ${level === opt.id ? J.tcBorder : C.glassBorder}`,
            }}>
              <span style={{ color: level === opt.id ? C.ivory : C.ivoryDim, fontSize: 14, fontWeight: 600, fontFamily: 'Inter,sans-serif', display: 'block', marginBottom: 3 }}>{opt.label}</span>
              <span style={{ color: C.ivoryMuted, fontSize: 11, fontFamily: 'Inter,sans-serif' }}>{opt.sub}</span>
            </button>
          ))}
        </div>
        <button onClick={() => level && setStep(1)} style={{
          marginTop: 20, padding: '14px', borderRadius: 16, cursor: level ? 'pointer' : 'default',
          background: level ? `linear-gradient(135deg,${J.tc},#D4703A)` : C.glass,
          border: `1px solid ${level ? 'transparent' : C.glassBorder}`, opacity: level ? 1 : 0.5,
        }}>
          <span style={{ color: level ? C.ivory : C.ivoryMuted, fontSize: 15, fontWeight: 700, fontFamily: 'Inter,sans-serif' }}>Continue →</span>
        </button>
      </>}

      {step === 1 && <>
        <h2 style={{ color: C.ivory, fontSize: 20, fontWeight: 700, fontFamily: 'Noto Serif JP,serif', marginBottom: 6 }}>How would you like coaching?</h2>
        <p style={{ color: C.ivoryDim, fontSize: 12, fontFamily: 'Inter,sans-serif', lineHeight: 1.65, marginBottom: 20 }}>
          Your companions can offer hints, explain decisions, and review your game.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {[
            { id: 'helpful', label: 'Helpful hints', sub: 'Gentle suggestions and explanations as you play' },
            { id: 'quiet', label: 'Quiet coaching', sub: 'Only speak up at important moments' },
            { id: 'none', label: 'No coaching during the game', sub: "I'll ask when I need help" },
          ].map(opt => (
            <button key={opt.id} onClick={() => setCoaching(opt.id)} style={{
              padding: '15px 18px', borderRadius: 18, cursor: 'pointer', textAlign: 'left',
              background: coaching === opt.id ? J.tcGlass : C.glass,
              border: `1px solid ${coaching === opt.id ? J.tcBorder : C.glassBorder}`,
              display: 'flex', gap: 14, alignItems: 'center',
            }}>
              <div style={{ width: 12, height: 12, borderRadius: 6, flexShrink: 0, background: coaching === opt.id ? J.tc : 'transparent', border: `2px solid ${coaching === opt.id ? J.tc : C.glassBorder}` }} />
              <div>
                <span style={{ color: coaching === opt.id ? C.ivory : C.ivoryDim, fontSize: 14, fontWeight: 600, fontFamily: 'Inter,sans-serif', display: 'block', marginBottom: 2 }}>{opt.label}</span>
                <span style={{ color: C.ivoryMuted, fontSize: 11, fontFamily: 'Inter,sans-serif' }}>{opt.sub}</span>
              </div>
            </button>
          ))}
        </div>
        <button onClick={() => coaching && setStep(2)} style={{
          marginTop: 20, padding: '14px', borderRadius: 16, cursor: coaching ? 'pointer' : 'default',
          background: coaching ? `linear-gradient(135deg,${J.tc},#D4703A)` : C.glass,
          border: `1px solid ${coaching ? 'transparent' : C.glassBorder}`, opacity: coaching ? 1 : 0.5,
        }}>
          <span style={{ color: coaching ? C.ivory : C.ivoryMuted, fontSize: 15, fontWeight: 700, fontFamily: 'Inter,sans-serif' }}>Continue →</span>
        </button>
      </>}

      {step === 2 && <>
        <h2 style={{ color: C.ivory, fontSize: 20, fontWeight: 700, fontFamily: 'Noto Serif JP,serif', marginBottom: 14 }}>Meet your AI companions</h2>
        <div style={{ borderRadius: 18, padding: '14px 16px', marginBottom: 14, background: J.tcGlass, border: `1px solid ${J.tcBorder}` }}>
          <p style={{ color: C.ivoryDim, fontSize: 12, fontFamily: 'Inter,sans-serif', lineHeight: 1.7, margin: 0 }}>
            Your companions can <span style={{ color: C.ivory, fontWeight: 600 }}>play alongside you</span>, <span style={{ color: C.ivory, fontWeight: 600 }}>explain rules</span> in plain language, <span style={{ color: C.ivory, fontWeight: 600 }}>offer hints</span> based on visible tiles, and <span style={{ color: C.ivory, fontWeight: 600 }}>review decisions</span> after the game.
          </p>
        </div>
        {[
          { kanji: '梅', name: 'Mei', grad: J.mei, desc: 'Patient and encouraging. Explains step by step.', tag: 'Beginner-friendly' },
          { kanji: '海', name: 'Kai', grad: J.kai, desc: 'Energetic and tactical. Loves speed plays.', tag: 'Tactical' },
          { kanji: '雪', name: 'Yuki', grad: J.yuki, desc: 'Calm and defensive. Focuses on safety.', tag: 'Reserved' },
        ].map(c => (
          <div key={c.name} style={{
            display: 'flex', gap: 12, alignItems: 'center', padding: '10px 12px', borderRadius: 14,
            background: C.glass, border: `1px solid ${C.glassBorder}`, marginBottom: 8,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, flexShrink: 0,
              background: c.grad, border: `1px solid ${J.tcBorder}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: C.ivory, fontSize: 15, fontFamily: 'Noto Serif JP,serif', fontWeight: 700 }}>{c.kanji}</span>
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ color: C.ivory, fontSize: 13, fontWeight: 600, fontFamily: 'Inter,sans-serif', display: 'block' }}>{c.name}</span>
              <span style={{ color: C.ivoryMuted, fontSize: 11, fontFamily: 'Inter,sans-serif' }}>{c.desc}</span>
            </div>
            <span style={{ fontSize: 9, color: J.tc, fontFamily: 'Inter,sans-serif', fontWeight: 700, background: J.tcGlass, padding: '2px 7px', borderRadius: 6, border: `1px solid ${J.tcBorder}`, whiteSpace: 'nowrap' }}>{c.tag}</span>
          </div>
        ))}
        <button onClick={onComplete} style={{
          marginTop: 16, padding: '15px', borderRadius: 16, cursor: 'pointer',
          background: `linear-gradient(135deg,${J.tc},#D4703A)`, border: 'none',
          boxShadow: '0 4px 18px rgba(192,90,48,0.4)',
        }}>
          <span style={{ color: C.ivory, fontSize: 15, fontWeight: 700, fontFamily: 'Inter,sans-serif' }}>Start My Journey →</span>
        </button>
      </>}
    </div>
  )
}

/* ─── JOURNEY: HOME ─── */
function JourneyHome({ onNav, appMode = 'journey', onSwitchMode }: {
  onNav: (s: Screen) => void
  appMode?: 'arena' | 'journey' | 'copilot' | 'lab'
  onSwitchMode?: (m: 'arena' | 'journey' | 'copilot' | 'lab') => void
}) {
  const milestones = ['Tiles', 'Sequences', 'Pairs', 'Winning', 'Yaku', 'Riichi', 'Defence', 'Score']
  const progress = 3

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 0' }}>
      {onSwitchMode && <ModeSwitcher mode={appMode} onSwitch={onSwitchMode} />}

      <div style={{ marginBottom: 18 }}>
        <span style={{ color: J.tc, fontSize: 10, fontFamily: 'Inter,sans-serif', fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', display: 'block', marginBottom: 3 }}>Good evening</span>
        <h1 style={{ color: C.ivory, fontSize: 22, fontWeight: 700, fontFamily: 'Noto Serif JP,serif', lineHeight: 1.2 }}>Your Mahjong Journey</h1>
      </div>

      <div style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ color: C.ivoryDim, fontSize: 12, fontFamily: 'Inter,sans-serif' }}>Learning path · {progress}/{milestones.length} milestones</span>
          <span style={{ color: J.tc, fontSize: 11, fontFamily: 'Inter,sans-serif', cursor: 'pointer' }}>See all</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {milestones.map((m, i) => (
            <div key={m} style={{ display: 'flex', alignItems: 'center', flex: i < milestones.length - 1 ? 1 : 'none' }}>
              <div style={{
                width: 22, height: 22, borderRadius: 11, flexShrink: 0,
                background: i < progress ? `linear-gradient(135deg,${J.tc},#D4703A)` : i === progress ? J.tcGlass : C.glass,
                border: `2px solid ${i <= progress ? J.tc : C.glassBorder}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: i === progress ? '0 0 10px rgba(192,90,48,0.4)' : 'none',
              }}>
                {i < progress && <span style={{ color: C.ivory, fontSize: 9, fontWeight: 700 }}>✓</span>}
                {i === progress && <div style={{ width: 6, height: 6, borderRadius: 3, background: J.tc }} />}
              </div>
              {i < milestones.length - 1 && (
                <div style={{ flex: 1, height: 2, background: i < progress ? J.tc : C.glassBorder, opacity: i < progress ? 0.5 : 0.4 }} />
              )}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', marginTop: 5 }}>
          {milestones.map((m, i) => (
            <span key={m} style={{
              flex: 1, fontSize: 8, fontFamily: 'Inter,sans-serif', textAlign: 'center',
              color: i <= progress ? J.tc : C.ivoryMuted, opacity: i > progress + 1 ? 0.4 : 1,
            }}>{i <= progress + 1 ? m : '·'}</span>
          ))}
        </div>
      </div>

      <button onClick={() => onNav('journey-table')} style={{
        width: '100%', padding: '16px', borderRadius: 20, cursor: 'pointer', marginBottom: 14,
        background: `linear-gradient(135deg,${J.tc},#D4703A)`, border: 'none',
        boxShadow: '0 4px 20px rgba(192,90,48,0.38)',
      }}>
        <span style={{ color: C.ivory, fontSize: 16, fontWeight: 700, fontFamily: 'Inter,sans-serif' }}>Play a Friendly Match →</span>
      </button>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <button onClick={() => onNav('journey-learn')} style={{
          flex: 1, padding: '14px 12px', borderRadius: 18, cursor: 'pointer', textAlign: 'left',
          background: C.glass, border: `1px solid ${C.glassBorder}`,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10, background: J.tcGlass,
            border: `1px solid ${J.tcBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8,
          }}>
            <span style={{ color: J.tc, fontSize: 14, fontFamily: 'Noto Serif JP,serif', fontWeight: 700 }}>学</span>
          </div>
          <span style={{ color: C.ivory, fontSize: 13, fontWeight: 600, fontFamily: 'Inter,sans-serif', display: 'block', marginBottom: 3 }}>Learn One New Concept</span>
          <span style={{ color: C.ivoryMuted, fontSize: 10, fontFamily: 'Inter,sans-serif' }}>Next: Sequences</span>
        </button>
        <button style={{
          flex: 1, padding: '14px 12px', borderRadius: 18, cursor: 'pointer', textAlign: 'left',
          background: C.glass, border: `1px solid ${C.glassBorder}`,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10, background: J.tcGlass,
            border: `1px solid ${J.tcBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8,
          }}>
            <span style={{ color: J.tc, fontSize: 12, fontFamily: 'Noto Serif JP,serif', fontWeight: 700 }}>師</span>
          </div>
          <span style={{ color: C.ivory, fontSize: 13, fontWeight: 600, fontFamily: 'Inter,sans-serif', display: 'block', marginBottom: 3 }}>Ask Sensei</span>
          <span style={{ color: C.ivoryMuted, fontSize: 10, fontFamily: 'Inter,sans-serif' }}>Ask anything</span>
        </button>
      </div>

      <div style={{ borderRadius: 18, padding: '14px 16px', marginBottom: 16, background: C.glass, border: `1px solid ${C.glassBorder}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ color: C.ivory, fontSize: 13, fontWeight: 600, fontFamily: 'Noto Serif JP,serif' }}>Daily Practice</span>
          <span style={{ color: J.tc, fontSize: 11, fontFamily: 'Inter,sans-serif' }}>5 min</span>
        </div>
        <p style={{ color: C.ivoryDim, fontSize: 12, fontFamily: 'Inter,sans-serif', lineHeight: 1.6, margin: '0 0 10px' }}>
          Today: Spot the sequence in a mixed hand. Three quick questions.
        </p>
        <button onClick={() => onNav('journey-learn')} style={{
          width: '100%', padding: '10px', borderRadius: 12, cursor: 'pointer',
          background: J.tcGlass, border: `1px solid ${J.tcBorder}`,
        }}>
          <span style={{ color: J.tc, fontSize: 13, fontWeight: 600, fontFamily: 'Inter,sans-serif' }}>Start Practice</span>
        </button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ color: C.ivory, fontSize: 13, fontWeight: 600, fontFamily: 'Noto Serif JP,serif' }}>Friends Online</span>
          <span onClick={() => onNav('journey-friends')} style={{ color: J.tc, fontSize: 11, fontFamily: 'Inter,sans-serif', cursor: 'pointer' }}>View all</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { name: 'Hana', kanji: '花', online: true },
            { name: 'Taro', kanji: '太', online: true },
            { name: 'Suki', kanji: '好', online: false },
          ].map(f => (
            <div key={f.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 14,
                  background: 'linear-gradient(135deg,#2A3A6A,#3A2A5A)',
                  border: `1.5px solid ${f.online ? J.tcBorder : C.glassBorder}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ color: C.ivory, fontSize: 16, fontFamily: 'Noto Serif JP,serif', fontWeight: 700 }}>{f.kanji}</span>
                </div>
                <div style={{
                  position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: 5,
                  background: f.online ? '#4CAF50' : C.ivoryMuted, border: `2px solid ${C.ink}`,
                }} />
              </div>
              <span style={{ color: C.ivoryMuted, fontSize: 9, fontFamily: 'Inter,sans-serif' }}>{f.name}</span>
            </div>
          ))}
          <button onClick={() => onNav('journey-friends')} style={{
            width: 44, height: 44, borderRadius: 14, cursor: 'pointer',
            background: J.tcGlass, border: `1px dashed ${J.tcBorder}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start',
          }}>
            <span style={{ color: J.tc, fontSize: 18, lineHeight: 1 }}>+</span>
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── JOURNEY: TABLE SELECT ─── */
function JourneyTableSelect({ onNav }: { onNav: (s: Screen) => void }) {
  const [mode, setMode] = useState<string>('ai')
  const [selected, setSelected] = useState<string | null>(null)
  const [mixHumans, setMixHumans] = useState(false)

  const companions = [
    {
      name: 'Mei', kanji: '梅', grad: J.mei, title: 'Patient Guide', style: 'Encouraging', diff: 1,
      desc: 'Takes it step by step. Celebrates small wins. Best for new or nervous players.',
      traits: ['Supportive', 'Explains clearly', 'Relaxed pace'],
    },
    {
      name: 'Kai', kanji: '海', grad: J.kai, title: 'Tactical Partner', style: 'Energetic', diff: 3,
      desc: 'Loves speed and efficiency. Will push you to think faster and bolder.',
      traits: ['Speed-focused', 'Tactical', 'Challenging'],
    },
    {
      name: 'Yuki', kanji: '雪', grad: J.yuki, title: 'Quiet Strategist', style: 'Calm', diff: 2,
      desc: 'Focuses on solid fundamentals and safety. Only speaks up when it matters.',
      traits: ['Defensive', 'Safety-first', 'Minimal hints'],
    },
  ]

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 0' }}>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ color: C.ivory, fontSize: 22, fontWeight: 700, fontFamily: 'Noto Serif JP,serif', marginBottom: 4 }}>Choose a Table</h1>
        <p style={{ color: C.ivoryMuted, fontSize: 12, fontFamily: 'Inter,sans-serif' }}>Who would you like to play with today?</p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[
          { id: 'friends', label: 'Play with Friends', icon: '人' },
          { id: 'ai', label: 'AI Companions', icon: '◉' },
          { id: 'practice', label: 'Practice a Situation', icon: '⊕' },
        ].map(m => (
          <button key={m.id} onClick={() => setMode(m.id)} style={{
            flex: 1, padding: '10px 4px', borderRadius: 14, cursor: 'pointer',
            background: mode === m.id ? J.tcGlass : C.glass,
            border: `1px solid ${mode === m.id ? J.tcBorder : C.glassBorder}`,
          }}>
            <span style={{ color: mode === m.id ? J.tc : C.ivoryMuted, fontSize: 15, display: 'block', fontFamily: 'Noto Serif JP,serif', marginBottom: 3, fontWeight: 700 }}>{m.icon}</span>
            <span style={{ color: mode === m.id ? C.ivory : C.ivoryDim, fontSize: 9, fontFamily: 'Inter,sans-serif', fontWeight: mode === m.id ? 600 : 400, lineHeight: 1.4 }}>{m.label}</span>
          </button>
        ))}
      </div>

      <span style={{ color: C.ivory, fontSize: 13, fontWeight: 600, fontFamily: 'Noto Serif JP,serif', display: 'block', marginBottom: 10 }}>Select your companion</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
        {companions.map(c => (
          <div key={c.name} onClick={() => setSelected(selected === c.name ? null : c.name)} style={{
            borderRadius: 20, background: selected === c.name ? `linear-gradient(160deg,${C.navyMid},${C.ink})` : C.glass,
            border: `1px solid ${selected === c.name ? J.tcBorder : C.glassBorder}`,
            boxShadow: selected === c.name ? '0 0 16px rgba(192,90,48,0.2)' : 'none',
            cursor: 'pointer', padding: '14px 16px',
          }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 16, flexShrink: 0, background: c.grad,
                border: `1.5px solid ${selected === c.name ? J.tcBorder : 'rgba(255,255,255,0.1)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: C.ivory, fontSize: 20, fontFamily: 'Noto Serif JP,serif', fontWeight: 700 }}>{c.kanji}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <span style={{ color: C.ivory, fontSize: 16, fontWeight: 700, fontFamily: 'Noto Serif JP,serif' }}>{c.name}</span>
                  <span style={{ fontSize: 9, color: J.tc, fontFamily: 'Inter,sans-serif', fontWeight: 700, background: J.tcGlass, padding: '2px 7px', borderRadius: 6, border: `1px solid ${J.tcBorder}` }}>{c.style.toUpperCase()}</span>
                </div>
                <span style={{ color: C.ivoryDim, fontSize: 11, fontFamily: 'Inter,sans-serif', display: 'block', marginBottom: 5 }}>{c.title}</span>
                <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} style={{ width: 8, height: 8, borderRadius: 4, background: i < c.diff ? J.tc : 'rgba(255,255,255,0.12)' }} />
                  ))}
                  <span style={{ color: C.ivoryMuted, fontSize: 9, fontFamily: 'Inter,sans-serif', marginLeft: 4 }}>
                    {c.diff === 1 ? 'Gentle' : c.diff === 2 ? 'Moderate' : 'Challenging'}
                  </span>
                </div>
              </div>
            </div>
            <p style={{ color: C.ivoryMuted, fontSize: 12, fontFamily: 'Inter,sans-serif', lineHeight: 1.6, marginBottom: 8 }}>{c.desc}</p>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {c.traits.map(t => (
                <span key={t} style={{ fontSize: 10, fontFamily: 'Inter,sans-serif', color: C.ivoryMuted, background: C.glass, padding: '2px 7px', borderRadius: 6, border: `1px solid ${C.glassBorder}` }}>{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        borderRadius: 16, padding: '12px 16px', marginBottom: 14,
        background: C.glass, border: `1px solid ${C.glassBorder}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <span style={{ color: C.ivoryDim, fontSize: 13, fontFamily: 'Inter,sans-serif', fontWeight: 600, display: 'block' }}>Mix humans and AI</span>
          <span style={{ color: C.ivoryMuted, fontSize: 10, fontFamily: 'Inter,sans-serif' }}>Fill empty seats with AI companions</span>
        </div>
        <Toggle val={mixHumans} onToggle={() => setMixHumans(m => !m)} />
      </div>

      <button onClick={() => selected && onNav('journey-game')} style={{
        width: '100%', padding: '15px', borderRadius: 18, cursor: selected ? 'pointer' : 'default', marginBottom: 20,
        background: selected ? `linear-gradient(135deg,${J.tc},#D4703A)` : C.glass,
        border: `1px solid ${selected ? 'transparent' : C.glassBorder}`, opacity: selected ? 1 : 0.5,
        boxShadow: selected ? '0 4px 20px rgba(192,90,48,0.35)' : 'none',
      }}>
        <span style={{ color: selected ? C.ivory : C.ivoryMuted, fontSize: 15, fontWeight: 700, fontFamily: 'Inter,sans-serif' }}>
          {selected ? `Start Match with ${selected} →` : 'Select a companion to continue'}
        </span>
      </button>
    </div>
  )
}

/* ─── JOURNEY: GAME ─── */
function JourneyGame({ onNav }: { onNav: (s: Screen) => void }) {
  const [showCoach, setShowCoach] = useState(false)
  const [activeQ, setActiveQ] = useState<number | null>(null)
  const [beginnerMode, setBeginnerMode] = useState(true)
  const [selIdx, setSelIdx] = useState<number | null>(null)
  const [bubbleDismissed, setBubbleDismissed] = useState(false)

  const hand = ['1m', '2m', '3m', '5p', '6p', '7p', '2s', '3s', '4s', 'E', 'E', '8m', '9m']
  const drawTile = '6s'
  const companion = { name: 'Mei', kanji: '梅', grad: J.mei }

  const questions = [
    { q: "What should I look for?", a: "Look for groups forming in your hand — three tiles in a row (sequence) or three matching tiles (triplet). Tiles that share a suit and are close in number are most useful." },
    { q: "Why is this discard safer?", a: "East Wind hasn't appeared in any discard river yet, making it hard to read. Honour tiles that don't help your hand are often the safest early discards." },
    { q: "What is shanten?", a: "Shanten (向聴) is how many more tiles you need to reach tenpai — the moment when one more tile completes your hand. Shanten 0 means you're almost there." },
    { q: "How does riichi work?", a: "When your hand is ready and all tiles are closed (nothing borrowed), you can declare riichi. This commits you to one wait but adds scoring value and bonus draw tiles." },
    { q: "Explain this hand simply", a: "You have three complete groups (1m–2m–3m, 5p–6p–7p, 2s–3s–4s) and a pair (East). The 8m–9m still needs one tile to finish — you're very close to tenpai." },
  ]

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        background: 'rgba(13,21,41,0.9)', borderBottom: `0.5px solid ${J.tcBorder}`,
        padding: '0 16px', height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ color: J.tc, fontSize: 13, fontWeight: 700, fontFamily: 'JetBrains Mono,monospace' }}>東1局</span>
          <span style={{ color: C.ivoryMuted, fontSize: 10, fontFamily: 'Inter,sans-serif' }}>Friendly Match</span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ color: C.ivoryMuted, fontSize: 10 }}>72 tiles left</span>
          <button onClick={() => onNav('journey-result')} style={{
            padding: '4px 10px', borderRadius: 8, cursor: 'pointer',
            background: 'rgba(192,90,48,0.15)', border: `1px solid ${J.tcBorder}`,
          }}>
            <span style={{ color: J.tc, fontSize: 10, fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>End</span>
          </button>
        </div>
      </div>

      <div style={{
        flexShrink: 0, height: 202,
        background: `radial-gradient(ellipse at 50% 50%,${C.jadeLight},${C.jade},${C.jadeDark})`,
        padding: '8px 12px',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, marginBottom: 4 }}>
          <span style={{ color: C.ivoryDim, fontSize: 9, background: 'rgba(0,0,0,0.3)', padding: '1px 8px', borderRadius: 4, fontFamily: 'Inter,sans-serif' }}>Kai · 北家 · 28,400</span>
          <div style={{ display: 'flex', gap: 1 }}>{Array.from({ length: 10 }).map((_, i) => <Tile key={i} n="?" size="xs" fd />)}</div>
          <div style={{ display: 'flex', gap: 1 }}>{['3m', '7p', 'N', '2s'].map((t, i) => <Tile key={i} n={t} size="xs" />)}</div>
        </div>

        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
            <span style={{ color: C.ivoryDim, fontSize: 8, background: 'rgba(0,0,0,0.3)', padding: '1px 5px', borderRadius: 3, fontFamily: 'Inter,sans-serif' }}>Yuki · 西家 · 27,100</span>
            <div style={{ display: 'flex', gap: 1 }}>{Array.from({ length: 4 }).map((_, i) => <Tile key={i} n="?" size="xs" fd />)}</div>
          </div>
          <div style={{ width: 72, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.2)', borderRadius: 10, padding: '6px' }}>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <span style={{ color: C.ivoryMuted, fontSize: 8 }}>Dora</span>
              <Tile n="7p" size="xs" />
            </div>
            <div style={{ width: 26, height: 26, borderRadius: 13, background: `linear-gradient(135deg,${C.navyMid},${C.navy})`, border: `1.5px solid ${J.tcBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: J.tc, fontSize: 11, fontFamily: 'Noto Serif JP,serif', fontWeight: 700 }}>東</span>
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
            <span style={{ color: C.ivoryDim, fontSize: 8, background: 'rgba(0,0,0,0.3)', padding: '1px 5px', borderRadius: 3, fontFamily: 'Inter,sans-serif' }}>Hana · 東家 · 31,200</span>
            <div style={{ display: 'flex', gap: 1 }}>{Array.from({ length: 4 }).map((_, i) => <Tile key={i} n="?" size="xs" fd />)}</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 6 }}>
          {[{ n: 'Kai', s: '28.4k' }, { n: 'Yuki', s: '27.1k' }, { n: 'Hana', s: '31.2k' }, { n: 'You', s: '13.3k' }].map(p => (
            <span key={p.n} style={{ color: p.n === 'You' ? J.tc : C.ivoryMuted, fontSize: 8, fontFamily: 'JetBrains Mono,monospace' }}>{p.n} {p.s}</span>
          ))}
        </div>
      </div>

      {!bubbleDismissed && (
        <div style={{ flexShrink: 0, padding: '8px 12px', background: 'rgba(13,21,41,0.95)', borderTop: `0.5px solid rgba(255,255,255,0.05)` }}>
          <div style={{ borderRadius: 16, padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${J.tcBorder}` }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 9, flexShrink: 0, background: companion.grad,
                border: `1px solid ${J.tcBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: C.ivory, fontSize: 10, fontFamily: 'Noto Serif JP,serif', fontWeight: 700 }}>{companion.kanji}</span>
              </div>
              <p style={{ color: C.ivoryDim, fontSize: 12, fontFamily: 'Inter,sans-serif', lineHeight: 1.55, margin: 0, flex: 1 }}>
                <span style={{ color: J.tc, fontWeight: 600 }}>{companion.name}:</span> "You have several paths here. Focus on speed or build a higher-value hand?"
              </p>
            </div>
            <div style={{ display: 'flex', gap: 7 }}>
              {[
                { label: 'Hint', cb: () => {} },
                { label: 'Explain', primary: true, cb: () => setShowCoach(true) },
                { label: 'Dismiss', cb: () => setBubbleDismissed(true) },
              ].map(a => (
                <button key={a.label} onClick={a.cb} style={{
                  flex: 1, padding: '7px', borderRadius: 10, cursor: 'pointer',
                  background: a.primary ? J.tcGlass : C.glass,
                  border: `1px solid ${a.primary ? J.tcBorder : C.glassBorder}`,
                }}>
                  <span style={{ color: a.primary ? J.tc : C.ivoryDim, fontSize: 11, fontFamily: 'Inter,sans-serif', fontWeight: a.primary ? 600 : 400 }}>{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div style={{
        background: 'rgba(13,21,41,0.95)', padding: '5px 16px', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderTop: `0.5px solid ${J.tcBorder}`,
      }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ color: J.tc, fontSize: 11, fontFamily: 'Noto Serif JP,serif', fontWeight: 700 }}>南家</span>
          <span style={{ color: C.ivory, fontSize: 12, fontWeight: 600, fontFamily: 'Inter,sans-serif' }}>You · Miya_Hana</span>
        </div>
        <span style={{ color: C.ivory, fontSize: 14, fontWeight: 700, fontFamily: 'JetBrains Mono,monospace' }}>13,300</span>
      </div>

      <div style={{
        background: '#06060C', padding: '12px 8px 2px', flexShrink: 0,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 2, overflow: 'visible',
      }}>
        {hand.map((t, i) => <Tile key={i} n={t} size="sm" sel={selIdx === i} onClick={() => setSelIdx(selIdx === i ? null : i)} />)}
        <div style={{ width: 7 }} />
        <Tile n={drawTile} size="sm" sel={selIdx === hand.length} onClick={() => setSelIdx(selIdx === hand.length ? null : hand.length)} />
      </div>
      <div style={{ background: '#06060C', padding: '2px 0 6px', textAlign: 'center' }}>
        <span style={{ color: C.ivoryMuted, fontSize: 9, fontFamily: 'Inter,sans-serif' }}>Tap a tile to select it for discard</span>
      </div>

      <div style={{ background: 'rgba(8,8,14,0.99)', padding: '8px 12px 8px', flexShrink: 0, borderTop: `0.5px solid ${J.tcBorder}` }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
          {[
            { label: 'Discard', primary: true, active: selIdx !== null },
            { label: 'Riichi', active: true },
            { label: 'Pon', active: false },
            { label: 'Skip', active: true },
          ].map(a => (
            <button key={a.label} style={{
              flex: 1, padding: '8px', borderRadius: 10, cursor: a.active ? 'pointer' : 'default',
              background: a.primary && a.active ? `linear-gradient(135deg,${J.tc},#D4703A)` : C.glass,
              border: `1px solid ${a.primary && a.active ? 'transparent' : a.active ? C.glassBorder : 'rgba(255,255,255,0.04)'}`,
              opacity: a.active ? 1 : 0.3,
            }}>
              <span style={{ fontSize: 11, fontFamily: 'Inter,sans-serif', fontWeight: 600, color: a.primary && a.active ? C.ivory : a.active ? C.ivory : C.ivoryMuted }}>{a.label}</span>
            </button>
          ))}
        </div>
        <button onClick={() => setShowCoach(true)} style={{
          width: '100%', padding: '8px', cursor: 'pointer',
          background: J.tcGlass, border: `1px solid ${J.tcBorder}`, borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
        }}>
          <span style={{ color: J.tc, fontSize: 11, fontFamily: 'Noto Serif JP,serif', fontWeight: 700 }}>{companion.kanji}</span>
          <span style={{ color: J.tc, fontSize: 11, fontWeight: 600, fontFamily: 'Inter,sans-serif' }}>Ask {companion.name}</span>
        </button>
      </div>

      {showCoach && (
        <>
          <div onClick={() => setShowCoach(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.52)', zIndex: 10 }} />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 11,
            background: `linear-gradient(180deg,${C.navyMid},${C.navy})`,
            borderTop: `1px solid ${J.tcBorder}`, borderRadius: '20px 20px 0 0',
            boxShadow: '0 -8px 40px rgba(0,0,0,0.65)', paddingBottom: 20,
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 6px' }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.15)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px 10px' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10, background: companion.grad,
                  border: `1px solid ${J.tcBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ color: C.ivory, fontSize: 12, fontFamily: 'Noto Serif JP,serif', fontWeight: 700 }}>{companion.kanji}</span>
                </div>
                <div>
                  <span style={{ color: C.ivory, fontSize: 14, fontWeight: 600, fontFamily: 'Noto Serif JP,serif', display: 'block' }}>Ask {companion.name}</span>
                  <span style={{ color: C.ivoryMuted, fontSize: 10, fontFamily: 'Inter,sans-serif' }}>Hints based on visible tiles only</span>
                </div>
              </div>
              <button onClick={() => setShowCoach(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <span style={{ color: C.ivoryMuted, fontSize: 20, lineHeight: 1 }}>×</span>
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px 12px' }}>
              <span style={{ color: C.ivoryDim, fontSize: 12, fontFamily: 'Inter,sans-serif' }}>
                {beginnerMode ? "Explain like I'm new" : 'Use advanced terms'}
              </span>
              <Toggle val={!beginnerMode} onToggle={() => setBeginnerMode(m => !m)} />
            </div>
            <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {questions.map((q, i) => (
                <div key={i}>
                  <button onClick={() => setActiveQ(activeQ === i ? null : i)} style={{
                    width: '100%', padding: '12px 14px', borderRadius: activeQ === i ? '12px 12px 0 0' : 12, cursor: 'pointer', textAlign: 'left',
                    background: activeQ === i ? J.tcGlass : C.glass,
                    border: `1px solid ${activeQ === i ? J.tcBorder : C.glassBorder}`,
                    borderBottom: activeQ === i ? 'none' : undefined,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <span style={{ color: activeQ === i ? C.ivory : C.ivoryDim, fontSize: 12, fontFamily: 'Inter,sans-serif', fontWeight: activeQ === i ? 600 : 400 }}>{q.q}</span>
                    <span style={{ color: J.tc, fontSize: 12, display: 'inline-block', transform: activeQ === i ? 'rotate(180deg)' : 'none' }}>▾</span>
                  </button>
                  {activeQ === i && (
                    <div style={{ padding: '10px 14px', background: 'rgba(192,90,48,0.05)', borderRadius: '0 0 12px 12px', border: `1px solid ${J.tcBorder}`, borderTop: 'none' }}>
                      <p style={{ color: C.ivoryDim, fontSize: 12, fontFamily: 'Inter,sans-serif', lineHeight: 1.65, margin: 0 }}>{q.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

/* ─── JOURNEY: LEARN ─── */
function JourneyLearn({ onNav: _onNav }: { onNav: (s: Screen) => void }) {
  const [answered, setAnswered] = useState<number | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)

  const lessons = ['Tile Families', 'Sequences', 'Pairs & Triplets', 'Melds', 'Shanten', 'Yaku', 'Riichi', 'Defence', 'Scoring']
  const progress = 1
  const hand = ['2m', '3m', '4p', '5p', '6p', '2s', '3s', '4s', '9s', 'E', 'S', 'Haku', 'Chun']
  const highlightIdx = [2, 3, 4]

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 0' }}>
      <div style={{ marginBottom: 16 }}>
        <span style={{ color: J.tc, fontSize: 10, fontFamily: 'Inter,sans-serif', fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Lesson 2 of {lessons.length}</span>
        <h1 style={{ color: C.ivory, fontSize: 21, fontWeight: 700, fontFamily: 'Noto Serif JP,serif', lineHeight: 1.2, marginBottom: 4 }}>Build a Useful Shape</h1>
        <span style={{ color: J.tc, fontSize: 12, fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>Sequences (順子, juntsu)</span>
      </div>

      <div style={{ display: 'flex', gap: 5, marginBottom: 16 }}>
        {lessons.map((l, i) => (
          <div key={l} style={{ flex: 1, height: 3, borderRadius: 2, background: i < progress ? J.tc : i === progress ? J.tcGlass : C.glass }} />
        ))}
      </div>

      <div style={{ borderRadius: 18, padding: '16px', marginBottom: 16, background: C.glass, border: `1px solid ${C.glassBorder}` }}>
        <p style={{ color: C.ivoryDim, fontSize: 13, fontFamily: 'Inter,sans-serif', lineHeight: 1.7, margin: 0 }}>
          A sequence (順子) is three consecutive tiles of the same suit — like 3–4–5 circles. Tiles that sit close together in number are most useful to keep.
        </p>
      </div>

      <div style={{ marginBottom: 16 }}>
        <span style={{ color: C.ivoryMuted, fontSize: 10, fontFamily: 'Inter,sans-serif', display: 'block', marginBottom: 8 }}>
          Spot the complete sequence in this hand:
        </span>
        <div style={{
          background: `radial-gradient(ellipse,${C.jadeLight},${C.jade})`,
          borderRadius: 16, padding: '14px 8px',
          display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap',
        }}>
          {hand.map((t, i) => (
            <div key={i} style={{ position: 'relative' }}>
              <Tile n={t} size="sm" />
              {highlightIdx.includes(i) && (
                <div style={{
                  position: 'absolute', inset: -2, borderRadius: 5,
                  border: `2px solid ${J.tc}`, boxShadow: '0 0 10px rgba(192,90,48,0.5)',
                  pointerEvents: 'none',
                }} />
              )}
            </div>
          ))}
        </div>
        <p style={{ color: J.tc, fontSize: 11, fontFamily: 'Inter,sans-serif', textAlign: 'center', marginTop: 8 }}>
          4-Pin · 5-Pin · 6-Pin — a complete circle sequence
        </p>
      </div>

      <div style={{ borderRadius: 18, padding: '16px', marginBottom: 14, background: C.glass, border: `1px solid ${C.glassBorder}` }}>
        <span style={{ color: C.ivory, fontSize: 13, fontWeight: 600, fontFamily: 'Inter,sans-serif', display: 'block', marginBottom: 4 }}>Practice Question</span>
        <p style={{ color: C.ivoryDim, fontSize: 12, fontFamily: 'Inter,sans-serif', lineHeight: 1.6, marginBottom: 14 }}>
          Which tile completes a sequence with 3-Man and 5-Man?
        </p>
        <div style={{ display: 'flex', gap: 6, marginBottom: 14, justifyContent: 'center' }}>
          <Tile n="3m" size="md" />
          <div style={{
            width: 33, height: 46, borderRadius: 3, background: 'rgba(192,90,48,0.15)',
            border: `2px dashed ${J.tcBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: J.tc, fontSize: 16 }}>?</span>
          </div>
          <Tile n="5m" size="md" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {['2m', '4m', '6m', '7m'].map((t, i) => {
            const isCorrect = i === 1
            let bg = C.glass, border = C.glassBorder, textCol = C.ivoryDim
            if (showAnswer && isCorrect) { bg = 'rgba(76,175,80,0.1)'; border = 'rgba(76,175,80,0.3)'; textCol = '#4CAF50' }
            if (showAnswer && answered === i && !isCorrect) { bg = 'rgba(192,90,48,0.1)'; border = J.tcBorder; textCol = J.tc }
            if (!showAnswer && answered === i) { bg = J.tcGlass; border = J.tcBorder; textCol = C.ivory }
            return (
              <button key={t} onClick={() => !showAnswer && setAnswered(i)} style={{
                padding: '12px', borderRadius: 14, cursor: showAnswer ? 'default' : 'pointer',
                background: bg, border: `1px solid ${border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                <Tile n={t} size="sm" />
                <span style={{ color: textCol, fontSize: 13, fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>
                  {t.replace('m', '-Man')}
                </span>
              </button>
            )
          })}
        </div>
        {answered !== null && !showAnswer && (
          <button onClick={() => setShowAnswer(true)} style={{
            width: '100%', marginTop: 10, padding: '11px', borderRadius: 12, cursor: 'pointer',
            background: J.tcGlass, border: `1px solid ${J.tcBorder}`,
          }}>
            <span style={{ color: J.tc, fontSize: 13, fontWeight: 600, fontFamily: 'Inter,sans-serif' }}>Check Answer</span>
          </button>
        )}
        {showAnswer && (
          <div style={{ marginTop: 10, padding: '10px 12px', borderRadius: 12, background: 'rgba(76,175,80,0.08)', border: '1px solid rgba(76,175,80,0.2)' }}>
            <p style={{ color: C.ivoryDim, fontSize: 12, fontFamily: 'Inter,sans-serif', lineHeight: 1.6, margin: 0 }}>
              4-Man sits between 3-Man and 5-Man, completing the sequence 3–4–5. Well done!
            </p>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <button style={{ padding: '10px 16px', borderRadius: 12, cursor: 'pointer', background: C.glass, border: `1px solid ${C.glassBorder}` }}>
          <span style={{ color: C.ivoryMuted, fontSize: 13, fontFamily: 'Inter,sans-serif' }}>← Previous</span>
        </button>
        <span style={{ color: C.ivoryMuted, fontSize: 11, fontFamily: 'JetBrains Mono,monospace' }}>2 / {lessons.length}</span>
        <button style={{ padding: '10px 16px', borderRadius: 12, cursor: 'pointer', background: `linear-gradient(135deg,${J.tc},#D4703A)`, border: 'none' }}>
          <span style={{ color: C.ivory, fontSize: 13, fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>Next →</span>
        </button>
      </div>
    </div>
  )
}

/* ─── JOURNEY: RESULT ─── */
function JourneyResult({ onNav }: { onNav: (s: Screen) => void }) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 0' }}>
      <div style={{
        borderRadius: 24, padding: '26px 20px 22px', marginBottom: 18, textAlign: 'center',
        background: `linear-gradient(135deg,${C.navyMid},${C.jade})`,
        border: `1px solid ${J.tcBorder}`, boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'repeating-linear-gradient(45deg,rgba(192,90,48,0.02) 0px,rgba(192,90,48,0.02) 1px,transparent 1px,transparent 18px)' }} />
        <div style={{
          width: 72, height: 72, borderRadius: 22, margin: '0 auto 14px',
          background: `linear-gradient(135deg,${J.tc},#D4703A)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 24px rgba(192,90,48,0.45)',
        }}>
          <span style={{ color: C.ivory, fontSize: 30, fontWeight: 900, fontFamily: 'JetBrains Mono,monospace' }}>2</span>
        </div>
        <h2 style={{ color: C.ivory, fontSize: 22, fontWeight: 700, fontFamily: 'Noto Serif JP,serif', marginBottom: 4 }}>Great effort, Miya!</h2>
        <p style={{ color: C.ivoryDim, fontSize: 13, fontFamily: 'Inter,sans-serif', marginBottom: 12 }}>You finished 2nd — a solid result in a competitive match.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
          {[{ l: '+12', sub: 'score pts', col: J.tc }, { l: '4', sub: 'hands played', col: C.ivory }, { l: '2', sub: 'hands won', col: '#4CAF50' }].map(s => (
            <div key={s.sub}>
              <span style={{ color: s.col, fontSize: 18, fontWeight: 700, fontFamily: 'JetBrains Mono,monospace', display: 'block' }}>{s.l}</span>
              <span style={{ color: C.ivoryMuted, fontSize: 9, fontFamily: 'Inter,sans-serif' }}>{s.sub}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        <div style={{ borderRadius: 18, padding: '14px 12px', background: 'rgba(76,175,80,0.07)', border: '1px solid rgba(76,175,80,0.2)' }}>
          <span style={{ color: C.ivoryMuted, fontSize: 9, fontFamily: 'Inter,sans-serif', fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>Favourite Moment</span>
          <span style={{ color: '#4CAF50', fontSize: 13, fontWeight: 600, fontFamily: 'Inter,sans-serif', display: 'block', marginBottom: 4 }}>E3 Tanyao Tsumo</span>
          <p style={{ color: C.ivoryDim, fontSize: 11, fontFamily: 'Inter,sans-serif', lineHeight: 1.5, margin: 0 }}>Self-draw win — well-timed hand!</p>
        </div>
        <div style={{ borderRadius: 18, padding: '14px 12px', background: J.tcGlass, border: `1px solid ${J.tcBorder}` }}>
          <span style={{ color: C.ivoryMuted, fontSize: 9, fontFamily: 'Inter,sans-serif', fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>New Concept</span>
          <span style={{ color: J.tc, fontSize: 13, fontWeight: 600, fontFamily: 'Inter,sans-serif', display: 'block', marginBottom: 4 }}>Tanyao (断么九)</span>
          <p style={{ color: C.ivoryDim, fontSize: 11, fontFamily: 'Inter,sans-serif', lineHeight: 1.5, margin: 0 }}>All tiles 2–8, no terminals or honours.</p>
        </div>
      </div>

      <div style={{
        borderRadius: 18, padding: '14px 16px', marginBottom: 16,
        background: C.glass, border: `1px solid ${C.glassBorder}`,
        display: 'flex', gap: 12, alignItems: 'flex-start',
      }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, flexShrink: 0, background: J.mei, border: `1px solid ${J.tcBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: C.ivory, fontSize: 12, fontFamily: 'Noto Serif JP,serif', fontWeight: 700 }}>梅</span>
        </div>
        <div>
          <span style={{ color: J.tc, fontSize: 10, fontFamily: 'Inter,sans-serif', fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Mei's note</span>
          <p style={{ color: C.ivoryDim, fontSize: 12, fontFamily: 'Inter,sans-serif', lineHeight: 1.65, margin: 0 }}>
            In E2, a safer discard was available. When an opponent discards a wind tile, try matching it with something similar from your own hand.
          </p>
        </div>
      </div>

      <div style={{ borderRadius: 18, padding: '14px 16px', marginBottom: 16, background: C.glass, border: `1px solid ${C.glassBorder}` }}>
        <span style={{ color: C.ivory, fontSize: 13, fontWeight: 600, fontFamily: 'Inter,sans-serif', display: 'block', marginBottom: 10 }}>Replay a Key Moment</span>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
          <div>
            <span style={{ color: C.ivoryMuted, fontSize: 9, fontFamily: 'Inter,sans-serif', display: 'block', marginBottom: 4 }}>Your hand</span>
            <div style={{ display: 'flex', gap: 1 }}>{['E', '8m', '9m', '1p'].map((t, i) => <Tile key={i} n={t} size="xs" />)}</div>
          </div>
          <span style={{ color: J.tc, fontSize: 18 }}>→</span>
          <div>
            <span style={{ color: C.ivoryMuted, fontSize: 9, fontFamily: 'Inter,sans-serif', display: 'block', marginBottom: 4 }}>After discarding East</span>
            <div style={{ display: 'flex', gap: 1 }}>{['8m', '9m', '1p'].map((t, i) => <Tile key={i} n={t} size="xs" />)}</div>
          </div>
        </div>
        <p style={{ color: C.ivoryMuted, fontSize: 11, fontFamily: 'Inter,sans-serif', lineHeight: 1.55, margin: 0 }}>
          Discarding East improved your tile acceptance and kept your key pairs intact.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
        <button style={{ padding: '14px', borderRadius: 16, cursor: 'pointer', background: `linear-gradient(135deg,${J.tc},#D4703A)`, border: 'none', boxShadow: '0 4px 16px rgba(192,90,48,0.3)' }}>
          <span style={{ color: C.ivory, fontSize: 15, fontWeight: 700, fontFamily: 'Inter,sans-serif' }}>Play Again</span>
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => onNav('journey-friends')} style={{ flex: 1, padding: '12px', borderRadius: 14, cursor: 'pointer', background: C.glass, border: `1px solid ${C.glassBorder}` }}>
            <span style={{ color: C.ivory, fontSize: 13, fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>Share with Friends</span>
          </button>
          <button style={{ flex: 1, padding: '12px', borderRadius: 14, cursor: 'pointer', background: 'transparent', border: `1px solid rgba(255,255,255,0.06)` }}>
            <span style={{ color: C.ivoryDim, fontSize: 13, fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>Save to Learning Path</span>
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── JOURNEY: FRIENDS ─── */
function JourneyFriends({ onNav }: { onNav: (s: Screen) => void }) {
  const [aiHints, setAiHints] = useState(true)
  const [showRoom, setShowRoom] = useState(false)

  const friends = [
    { name: 'Hana', kanji: '花', online: true, status: 'In a match' },
    { name: 'Taro', kanji: '太', online: true, status: 'Available' },
    { name: 'Suki', kanji: '好', online: false, status: 'Last seen today' },
  ]

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 0' }}>
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ color: C.ivory, fontSize: 22, fontWeight: 700, fontFamily: 'Noto Serif JP,serif', marginBottom: 4 }}>Friends</h1>
        <p style={{ color: C.ivoryMuted, fontSize: 12, fontFamily: 'Inter,sans-serif' }}>Play together, spectate, or send a challenge.</p>
      </div>

      <div style={{ borderRadius: 20, padding: '16px', marginBottom: 16, background: `linear-gradient(135deg,${C.navyMid},${C.navy})`, border: `1px solid ${J.tcBorder}` }}>
        <span style={{ color: J.tc, fontSize: 11, fontFamily: 'Inter,sans-serif', fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>Private Room</span>
        {!showRoom ? (
          <button onClick={() => setShowRoom(true)} style={{ width: '100%', padding: '12px', borderRadius: 14, cursor: 'pointer', background: `linear-gradient(135deg,${J.tc},#D4703A)`, border: 'none' }}>
            <span style={{ color: C.ivory, fontSize: 14, fontWeight: 600, fontFamily: 'Inter,sans-serif' }}>Create a Room →</span>
          </button>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: '12px 16px', border: `1px solid ${J.tcBorder}` }}>
                <span style={{ color: C.ivoryMuted, fontSize: 9, fontFamily: 'Inter,sans-serif', display: 'block', marginBottom: 4 }}>Room Code</span>
                <span style={{ color: C.ivory, fontSize: 22, fontWeight: 700, fontFamily: 'JetBrains Mono,monospace', letterSpacing: 4 }}>JADE42</span>
              </div>
              <button style={{ padding: '12px 16px', borderRadius: 12, cursor: 'pointer', background: J.tcGlass, border: `1px solid ${J.tcBorder}`, alignSelf: 'stretch' }}>
                <span style={{ color: J.tc, fontSize: 12, fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>Copy</span>
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ color: C.ivoryDim, fontSize: 12, fontFamily: 'Inter,sans-serif' }}>Allow AI companion hints</span>
              <Toggle val={aiHints} onToggle={() => setAiHints(h => !h)} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ flex: 1, padding: '10px', borderRadius: 12, cursor: 'pointer', background: J.tcGlass, border: `1px solid ${J.tcBorder}` }}>
                <span style={{ color: J.tc, fontSize: 12, fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>Invite Friends</span>
              </button>
              <button style={{ flex: 1, padding: '10px', borderRadius: 12, cursor: 'pointer', background: C.glass, border: `1px solid ${C.glassBorder}` }}>
                <span style={{ color: C.ivoryDim, fontSize: 12, fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>Spectate</span>
              </button>
            </div>
          </>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ color: C.ivory, fontSize: 13, fontWeight: 600, fontFamily: 'Noto Serif JP,serif' }}>Your Friends</span>
        <button style={{ padding: '6px 12px', borderRadius: 10, cursor: 'pointer', background: J.tcGlass, border: `1px solid ${J.tcBorder}` }}>
          <span style={{ color: J.tc, fontSize: 11, fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>+ Add Friend</span>
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {friends.map(f => (
          <div key={f.name} style={{ borderRadius: 16, padding: '12px 16px', background: C.glass, border: `1px solid ${C.glassBorder}`, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 14,
                background: 'linear-gradient(135deg,#2A3A6A,#3A2A5A)',
                border: `1.5px solid ${f.online ? J.tcBorder : C.glassBorder}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: C.ivory, fontSize: 16, fontFamily: 'Noto Serif JP,serif', fontWeight: 700 }}>{f.kanji}</span>
              </div>
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: 5, background: f.online ? '#4CAF50' : C.ivoryMuted, border: `2px solid ${C.ink}` }} />
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ color: C.ivory, fontSize: 14, fontWeight: 600, fontFamily: 'Inter,sans-serif', display: 'block' }}>{f.name}</span>
              <span style={{ color: f.online ? '#4CAF50' : C.ivoryMuted, fontSize: 11, fontFamily: 'Inter,sans-serif' }}>{f.status}</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {f.status === 'Available' && (
                <button onClick={() => onNav('journey-table')} style={{ padding: '7px 12px', borderRadius: 10, cursor: 'pointer', background: J.tcGlass, border: `1px solid ${J.tcBorder}` }}>
                  <span style={{ color: J.tc, fontSize: 11, fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>Invite</span>
                </button>
              )}
              {f.status === 'In a match' && (
                <button style={{ padding: '7px 12px', borderRadius: 10, cursor: 'pointer', background: C.glass, border: `1px solid ${C.glassBorder}` }}>
                  <span style={{ color: C.ivoryMuted, fontSize: 11, fontFamily: 'Inter,sans-serif' }}>Watch</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ borderRadius: 18, padding: '14px 16px', marginBottom: 20, background: C.glass, border: `1px dashed rgba(255,255,255,0.1)`, textAlign: 'center' }}>
        <span style={{ color: C.ivoryMuted, fontSize: 13, fontFamily: 'Noto Serif JP,serif', display: 'block', marginBottom: 6 }}>Find more players</span>
        <p style={{ color: C.ivoryMuted, fontSize: 11, fontFamily: 'Inter,sans-serif', lineHeight: 1.6, marginBottom: 10 }}>
          Share your room code with friends or find players in the community.
        </p>
        <button style={{ padding: '9px 18px', borderRadius: 12, cursor: 'pointer', background: J.tcGlass, border: `1px solid ${J.tcBorder}` }}>
          <span style={{ color: J.tc, fontSize: 12, fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>Browse Community</span>
        </button>
      </div>
    </div>
  )
}

/* ─── JOURNEY: PROFILE ─── */
function JourneyProfile() {
  const [st, setSt] = useState({ largeTiles: false, highContrast: false, colorBlind: false, reducedMotion: false, leftHanded: false, sound: true, haptics: true, saveData: true })
  const [hintFreq, setHintFreq] = useState(2)
  const [lang, setLang] = useState('English')
  const tog = (k: keyof typeof st) => setSt(s => ({ ...s, [k]: !s[k] }))

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 0' }}>
      <div style={{ borderRadius: 22, padding: '18px', marginBottom: 18, background: C.glass, border: `1px solid ${C.glassBorder}`, display: 'flex', gap: 16, alignItems: 'center' }}>
        <div style={{
          width: 60, height: 60, borderRadius: 18, flexShrink: 0, background: J.mei,
          border: `2px solid ${J.tcBorder}`, boxShadow: '0 0 16px rgba(192,90,48,0.22)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ color: C.ivory, fontSize: 22, fontFamily: 'Noto Serif JP,serif', fontWeight: 700 }}>雅</span>
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ color: C.ivory, fontSize: 17, fontWeight: 700, fontFamily: 'Noto Serif JP,serif', display: 'block', marginBottom: 2 }}>Miya_Hana</span>
          <span style={{ color: J.tc, fontSize: 11, fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>Journey · Beginner Friendly</span>
          <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
            {[{ l: 'Matches', v: '18' }, { l: 'Concepts', v: '5' }, { l: 'Streak', v: '5d' }].map(s => (
              <div key={s.l}>
                <span style={{ color: J.tc, fontSize: 14, fontWeight: 700, fontFamily: 'JetBrains Mono,monospace', display: 'block' }}>{s.v}</span>
                <span style={{ color: C.ivoryMuted, fontSize: 9, fontFamily: 'Inter,sans-serif' }}>{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <span style={{ color: C.ivory, fontSize: 13, fontWeight: 600, fontFamily: 'Noto Serif JP,serif', display: 'block', marginBottom: 10 }}>Display</span>
      <SettingRow label="Large tiles" desc="Bigger tile text for easier reading" val={st.largeTiles} onToggle={() => tog('largeTiles')} />
      <SettingRow label="High contrast" desc="Stronger borders and tile visibility" val={st.highContrast} onToggle={() => tog('highContrast')} />
      <SettingRow label="Colour-blind safe indicators" desc="Shape markers alongside colour coding" val={st.colorBlind} onToggle={() => tog('colorBlind')} />
      <SettingRow label="Reduced motion" desc="Fewer animations and transitions" val={st.reducedMotion} onToggle={() => tog('reducedMotion')} />
      <SettingRow label="Left-handed controls" desc="Move action buttons to the left side" val={st.leftHanded} onToggle={() => tog('leftHanded')} />

      <span style={{ color: C.ivory, fontSize: 13, fontWeight: 600, fontFamily: 'Noto Serif JP,serif', display: 'block', margin: '18px 0 10px' }}>Audio and Feel</span>
      <SettingRow label="Sound effects" val={st.sound} onToggle={() => tog('sound')} />
      <SettingRow label="Haptic feedback" val={st.haptics} onToggle={() => tog('haptics')} />

      <span style={{ color: C.ivory, fontSize: 13, fontWeight: 600, fontFamily: 'Noto Serif JP,serif', display: 'block', margin: '18px 0 10px' }}>Language</span>
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 18 }}>
        {['English', 'Japanese', 'Chinese', 'Korean'].map(l => (
          <button key={l} onClick={() => setLang(l)} style={{ padding: '8px 14px', borderRadius: 10, cursor: 'pointer', background: lang === l ? J.tcGlass : C.glass, border: `1px solid ${lang === l ? J.tcBorder : C.glassBorder}` }}>
            <span style={{ color: lang === l ? J.tc : C.ivoryMuted, fontSize: 12, fontFamily: 'Inter,sans-serif', fontWeight: lang === l ? 600 : 400 }}>{l}</span>
          </button>
        ))}
      </div>

      <span style={{ color: C.ivory, fontSize: 13, fontWeight: 600, fontFamily: 'Noto Serif JP,serif', display: 'block', marginBottom: 10 }}>Companion Hint Frequency</span>
      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        {[{ v: 1, l: 'Rarely' }, { v: 2, l: 'Sometimes' }, { v: 3, l: 'Often' }].map(h => (
          <button key={h.v} onClick={() => setHintFreq(h.v)} style={{ flex: 1, padding: '10px 4px', borderRadius: 12, cursor: 'pointer', background: hintFreq === h.v ? J.tcGlass : C.glass, border: `1px solid ${hintFreq === h.v ? J.tcBorder : C.glassBorder}` }}>
            <span style={{ color: hintFreq === h.v ? J.tc : C.ivoryMuted, fontSize: 12, fontFamily: 'Inter,sans-serif', fontWeight: hintFreq === h.v ? 600 : 400 }}>{h.l}</span>
          </button>
        ))}
      </div>

      <div style={{ borderRadius: 18, padding: '16px', marginBottom: 20, background: J.tcGlass, border: `1px solid ${J.tcBorder}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ color: C.ivory, fontSize: 13, fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>Save coaching data</span>
          <Toggle val={st.saveData} onToggle={() => tog('saveData')} />
        </div>
        <p style={{ color: C.ivoryMuted, fontSize: 11, fontFamily: 'Inter,sans-serif', lineHeight: 1.65, marginBottom: 12 }}>
          Your game decisions are saved locally to personalise companion hints and learning suggestions. This data is never shared externally.
        </p>
        <button style={{ padding: '9px 16px', borderRadius: 10, cursor: 'pointer', background: 'rgba(204,34,0,0.1)', border: '1px solid rgba(204,34,0,0.2)' }}>
          <span style={{ color: C.vermilion, fontSize: 12, fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>Delete all coaching data</span>
        </button>
      </div>
    </div>
  )
}

/* ─── AI COPILOT TABLE ─── */

function CNavIcon({ type, active }: { type: string; active: boolean }) {
  const col = active ? K.gold : '#55524D'
  const sw = active ? '1.8' : '1.5'
  const icons: Record<string, React.ReactElement> = {
    'copilot-table': <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke={col} strokeWidth={sw}/>
      <path d="M3 9h18M9 3v18" stroke={col} strokeWidth={sw}/>
    </svg>,
    'copilot-review': <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" stroke={col} strokeWidth={sw}/>
      <path d="M12 7v5l3 3" stroke={col} strokeWidth={sw} strokeLinecap="round"/>
    </svg>,
    'copilot-settings': <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
      <path d="M4 6h16M4 12h16M4 18h16" stroke={col} strokeWidth={sw} strokeLinecap="round"/>
      <circle cx="9" cy="6" r="2" fill={col}/>
      <circle cx="15" cy="12" r="2" fill={col}/>
      <circle cx="10" cy="18" r="2" fill={col}/>
    </svg>,
  }
  return icons[type] || <svg width="22" height="22"/>
}

const COPILOT_TABS = [
  { id: 'copilot-table', label: 'Table' },
  { id: 'copilot-review', label: 'Review' },
  { id: 'copilot-settings', label: 'Settings' },
]

function CopilotNav({ active, onNav }: { active: string; onNav: (t: string) => void }) {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, height: 83,
      background: 'rgba(13,24,36,0.97)', backdropFilter: 'blur(24px)',
      borderTop: `0.5px solid ${K.goldBorder}`,
      display: 'flex', alignItems: 'flex-start', paddingTop: 10,
    }}>
      {COPILOT_TABS.map(t => (
        <button key={t.id} onClick={() => onNav(t.id)} style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        }}>
          <CNavIcon type={t.id} active={active === t.id} />
          <span style={{
            fontSize: 10, fontFamily: 'Inter,sans-serif', letterSpacing: 0.2,
            fontWeight: active === t.id ? 600 : 400,
            color: active === t.id ? K.gold : '#55524D',
          }}>{t.label}</span>
        </button>
      ))}
    </div>
  )
}

function CopilotSetup({ onComplete }: { onComplete: () => void }) {
  const [level, setLevel] = useState<string | null>(null)
  const [altLines, setAltLines] = useState(true)
  const [warnRisk, setWarnRisk] = useState(true)

  const levels = [
    { id: 'off', label: 'Off', sub: 'Play without any AI assistance' },
    { id: 'quiet', label: 'Quiet Signals', sub: 'Subtle colour cues on high-risk or high-value tiles' },
    { id: 'explain', label: 'Explain Before I Decide', sub: 'See a decision snapshot before each discard' },
    { id: 'coach', label: 'Beginner Coach', sub: 'Full explanations, tooltips, and guided learning' },
  ]

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '28px 20px 20px', background: K.panel }}>
      <div style={{ marginBottom: 26 }}>
        <div style={{
          width: 54, height: 54, borderRadius: 17, marginBottom: 16,
          background: K.goldGlass, border: `1.5px solid ${K.goldBorder}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke={K.gold} strokeWidth="1.8" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="2.5" fill={K.gold}/>
          </svg>
        </div>
        <h1 style={{ color: C.ivory, fontSize: 23, fontWeight: 700, fontFamily: 'Noto Serif JP,serif', lineHeight: 1.25, marginBottom: 10 }}>
          Play with understanding
        </h1>
        <p style={{ color: C.ivoryDim, fontSize: 12, fontFamily: 'Inter,sans-serif', lineHeight: 1.7, margin: 0 }}>
          The AI Copilot provides estimates based on visible tiles, hand structure, scoring potential, and inferred opponent behaviour. It supports your decisions — it does not play for you.
        </p>
      </div>

      <span style={{ color: C.ivory, fontSize: 13, fontWeight: 600, fontFamily: 'Noto Serif JP,serif', display: 'block', marginBottom: 10 }}>Level of assistance</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 18 }}>
        {levels.map(l => (
          <button key={l.id} onClick={() => setLevel(l.id)} style={{
            padding: '12px 14px', borderRadius: 14, cursor: 'pointer', textAlign: 'left',
            background: level === l.id ? K.goldGlass : C.glass,
            border: `1px solid ${level === l.id ? K.goldBorder : C.glassBorder}`,
            display: 'flex', gap: 12, alignItems: 'center',
          }}>
            <div style={{ width: 12, height: 12, borderRadius: 6, flexShrink: 0, background: level === l.id ? K.gold : 'transparent', border: `2px solid ${level === l.id ? K.gold : C.glassBorder}`, transition: 'all 0.15s' }} />
            <div>
              <span style={{ color: level === l.id ? C.ivory : C.ivoryDim, fontSize: 13, fontWeight: 600, fontFamily: 'Inter,sans-serif', display: 'block', marginBottom: 1 }}>{l.label}</span>
              <span style={{ color: C.ivoryMuted, fontSize: 10, fontFamily: 'Inter,sans-serif' }}>{l.sub}</span>
            </div>
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 22 }}>
        <SettingRow label="Show alternative lines" desc="See speed, value, and safety options side by side" val={altLines} onToggle={() => setAltLines(v => !v)} />
        <SettingRow label="Warn me about deal-in risk" desc="Highlight when a discard may feed an opponent in riichi" val={warnRisk} onToggle={() => setWarnRisk(v => !v)} />
      </div>

      <button onClick={() => level && onComplete()} style={{
        width: '100%', padding: '14px', borderRadius: 16, cursor: level ? 'pointer' : 'default',
        background: level ? `linear-gradient(135deg,${K.gold},#7A6A3A)` : C.glass,
        border: `1px solid ${level ? 'transparent' : C.glassBorder}`, opacity: level ? 1 : 0.5,
      }}>
        <span style={{ color: level ? C.ivory : C.ivoryMuted, fontSize: 15, fontWeight: 700, fontFamily: 'Inter,sans-serif' }}>Start Playing →</span>
      </button>
    </div>
  )
}

function CopilotTable({ onNav }: { onNav: (s: Screen) => void }) {
  const [showCopilot, setShowCopilot] = useState(false)
  const [showCompare, setShowCompare] = useState(false)
  const [showOpponent, setShowOpponent] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [selIdx, setSelIdx] = useState<number | null>(null)
  const [showExpert, setShowExpert] = useState(false)
  const [activeRec, setActiveRec] = useState(0)

  const hand = ['3m','4m','5m','3p','4p','5p','6p','7p','8p','2s','3s','4s','E']
  const drawTile = 'S'

  const recs = [
    {
      tag: 'SPEED', type: 'Fastest path', tile: 'S', col: K.gold,
      action: 'Discard South Wind',
      reason: "Keeps East Wind as your pair — tenpai immediately. One accepted tile in the wall. Clean, fast, low-commitment.",
      conf: 'Medium confidence', confLevel: 2, riskTag: 'Low', danger: 20,
    },
    {
      tag: 'VALUE', type: 'Highest value', tile: 'S', col: C.brassBright,
      action: 'Discard South, declare Riichi',
      reason: "Declaring riichi adds at least one han and opens ippatsu and ura-dora potential. Trades flexibility for higher payout.",
      conf: 'Low confidence', confLevel: 1, riskTag: 'Medium', danger: 38,
    },
    {
      tag: 'SAFE', type: 'Safest line', tile: 'E', col: '#5CB85C',
      action: 'Discard East Wind',
      reason: "Three East Wind tiles already discarded — estimated deal-in risk is very low. South Wind as your pair, same tenpai wait.",
      conf: 'High confidence', confLevel: 3, riskTag: 'Very low', danger: 7,
    },
  ]

  const activeR = recs[activeRec]

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', background: K.panel }}>
      {/* Header */}
      <div style={{
        height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', borderBottom: `0.5px solid ${K.goldBorder}`, flexShrink: 0,
      }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ color: K.gold, fontSize: 13, fontWeight: 700, fontFamily: 'JetBrains Mono,monospace' }}>東3局</span>
          <span style={{ color: C.ivoryMuted, fontSize: 10, fontFamily: 'Inter,sans-serif' }}>Turn 12 · 3 honba</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ color: C.ivoryMuted, fontSize: 10, fontFamily: 'Inter,sans-serif' }}>60 tiles left</span>
          <button onClick={() => onNav('copilot-review')} style={{ padding: '4px 10px', borderRadius: 8, cursor: 'pointer', background: K.coralGlass, border: `1px solid ${K.coralBorder}` }}>
            <span style={{ color: K.coral, fontSize: 10, fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>End hand</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{
        flexShrink: 0, height: 194,
        background: `radial-gradient(ellipse at 50% 50%,${K.forestLight},${K.forest},#060E0A)`,
        padding: '8px 10px',
      }}>
        {/* North opponent */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, marginBottom: 4 }}>
          <span style={{ color: C.ivoryDim, fontSize: 9, background: 'rgba(0,0,0,0.38)', padding: '1px 10px', borderRadius: 4, fontFamily: 'Inter,sans-serif' }}>北家 Ren · 31,400</span>
          <div style={{ display: 'flex', gap: 1 }}>{Array.from({ length: 11 }).map((_, i) => <Tile key={i} n="?" size="xs" fd />)}</div>
          <div style={{ display: 'flex', gap: 1 }}>{['6m','N','4p','W','2s'].map((t,i) => <Tile key={i} n={t} size="xs"/>)}</div>
        </div>

        {/* Middle row */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {/* West */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
            <span style={{ color: C.ivoryDim, fontSize: 8, background: 'rgba(0,0,0,0.38)', padding: '1px 6px', borderRadius: 3, fontFamily: 'Inter,sans-serif' }}>西 Sora · 22,600</span>
            <div style={{ display: 'flex', gap: 1 }}>{Array.from({ length: 5 }).map((_, i) => <Tile key={i} n="?" size="xs" fd />)}</div>
            <div style={{ display: 'flex', gap: 1 }}>{['7p','3s','N'].map((t,i) => <Tile key={i} n={t} size="xs"/>)}</div>
          </div>
          {/* Center info */}
          <div style={{ width: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.28)', borderRadius: 12, padding: '8px 4px' }}>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <span style={{ color: C.ivoryMuted, fontSize: 8, fontFamily: 'Inter,sans-serif' }}>Dora</span>
              <Tile n="4p" size="xs"/>
            </div>
            <div style={{ width: 32, height: 32, borderRadius: 16, background: `linear-gradient(135deg,${K.panel},${K.forest})`, border: `1.5px solid ${K.goldBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: K.gold, fontSize: 12, fontFamily: 'Noto Serif JP,serif', fontWeight: 700 }}>東</span>
            </div>
            <div style={{ display: 'flex', gap: 3 }}>
              {[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, background: 'rgba(255,255,255,0.18)', borderRadius: 1 }} />)}
            </div>
          </div>
          {/* East — in riichi */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
            <span style={{ color: K.coral, fontSize: 8, background: K.coralGlass, padding: '1px 6px', borderRadius: 3, fontFamily: 'Inter,sans-serif', fontWeight: 700, border: `1px solid ${K.coralBorder}` }}>RIICHI · Mika 26,800</span>
            <div style={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <div style={{ width: 3, height: 24, background: 'rgba(255,255,255,0.45)', borderRadius: 1, marginRight: 2 }} />
              {Array.from({ length: 4 }).map((_, i) => <Tile key={i} n="?" size="xs" fd />)}
            </div>
            <div style={{ display: 'flex', gap: 1 }}>{['8m','1p','5s','E'].map((t,i) => <Tile key={i} n={t} size="xs"/>)}</div>
          </div>
        </div>
      </div>

      {/* Score strip */}
      <div style={{ background: '#080E18', padding: '4px 16px', display: 'flex', justifyContent: 'space-between', flexShrink: 0, borderTop: `0.5px solid rgba(255,255,255,0.06)` }}>
        {[{n:'Ren',s:'31.4k',c:C.ivoryMuted},{n:'Sora',s:'22.6k',c:C.ivoryMuted},{n:'Mika',s:'26.8k',c:K.coral},{n:'You',s:'19.2k',c:K.gold}].map(p => (
          <div key={p.n} style={{ textAlign: 'center' }}>
            <span style={{ color: p.c, fontSize: 8, fontFamily: 'Inter,sans-serif', display: 'block', opacity: 0.75 }}>{p.n}</span>
            <span style={{ color: p.c, fontSize: 10, fontWeight: 700, fontFamily: 'JetBrains Mono,monospace' }}>{p.s}</span>
          </div>
        ))}
      </div>

      {/* Player seat label */}
      <div style={{ background: K.panel, padding: '5px 16px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `0.5px solid ${K.goldBorder}` }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ color: K.gold, fontSize: 11, fontFamily: 'Noto Serif JP,serif', fontWeight: 700 }}>南家</span>
          <span style={{ color: C.ivory, fontSize: 11, fontWeight: 600, fontFamily: 'Inter,sans-serif' }}>You</span>
        </div>
        {showConfirm && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: K.goldGlass, border: `1px solid ${K.goldBorder}`, borderRadius: 10, padding: '3px 10px' }}>
            <span style={{ color: K.gold, fontSize: 10, fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>Decision recorded</span>
            <span onClick={() => { setShowConfirm(false); onNav('copilot-review') }} style={{ color: K.gold, fontSize: 9, fontFamily: 'Inter,sans-serif', opacity: 0.7, cursor: 'pointer' }}>Review →</span>
            <button onClick={() => setShowConfirm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.ivoryMuted, fontSize: 14, padding: 0, lineHeight: 1 }}>×</button>
          </div>
        )}
      </div>

      {/* Hand */}
      <div style={{ background: '#050A0F', padding: '12px 8px 3px', flexShrink: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 2 }}>
        {hand.map((t, i) => {
          const isDot = showCopilot && !showCompare && activeR.tile === t
          return (
            <div key={i} style={{ position: 'relative' }}>
              <Tile n={t} size="sm" sel={selIdx === i} onClick={() => setSelIdx(selIdx === i ? null : i)} />
              {isDot && <div style={{ position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%)', width: 5, height: 5, borderRadius: 3, background: activeR.col }} />}
            </div>
          )
        })}
        <div style={{ width: 8 }} />
        <div style={{ position: 'relative' }}>
          <Tile n={drawTile} size="sm" sel={selIdx === hand.length} onClick={() => setSelIdx(selIdx === hand.length ? null : hand.length)} />
          {showCopilot && !showCompare && activeR.tile === drawTile && (
            <div style={{ position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%)', width: 5, height: 5, borderRadius: 3, background: activeR.col }} />
          )}
        </div>
      </div>
      <div style={{ background: '#050A0F', padding: '2px 0 6px', textAlign: 'center' }}>
        <span style={{ color: C.ivoryMuted, fontSize: 9, fontFamily: 'Inter,sans-serif' }}>Tap tile to select · Copilot active</span>
      </div>

      {/* Action tray */}
      <div style={{ background: 'rgba(6,9,16,0.99)', padding: '8px 12px', flexShrink: 0, borderTop: `0.5px solid ${K.goldBorder}` }}>
        <div style={{ display: 'flex', gap: 5, marginBottom: 7 }}>
          {[
            { label: 'Discard', primary: true, active: selIdx !== null, cb: () => { if (selIdx !== null) { setShowConfirm(true); setSelIdx(null); setShowCopilot(false) } } },
            { label: 'Riichi', active: true, cb: () => {} },
            { label: 'Chi', active: false, cb: () => {} },
            { label: 'Pon', active: false, cb: () => {} },
            { label: 'Skip', active: true, cb: () => {} },
          ].map(a => (
            <button key={a.label} onClick={a.cb} style={{
              flex: 1, padding: '7px 2px', borderRadius: 10, cursor: a.active ? 'pointer' : 'default',
              background: a.primary && a.active ? `linear-gradient(135deg,${K.gold},#7A6A3A)` : C.glass,
              border: `1px solid ${a.primary && a.active ? 'transparent' : a.active ? C.glassBorder : 'rgba(255,255,255,0.03)'}`,
              opacity: a.active ? 1 : 0.3,
            }}>
              <span style={{ fontSize: 10, fontFamily: 'Inter,sans-serif', fontWeight: 600, color: a.primary && a.active ? C.ivory : a.active ? C.ivory : C.ivoryMuted }}>{a.label}</span>
            </button>
          ))}
        </div>
        <button onClick={() => { setShowCopilot(c => !c); setShowCompare(false) }} style={{
          width: '100%', padding: '9px', cursor: 'pointer',
          background: showCopilot ? K.goldGlass : `rgba(154,138,90,0.07)`,
          border: `1px solid ${K.goldBorder}`, borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke={K.gold} strokeWidth="2" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="2.5" fill={K.gold}/>
          </svg>
          <span style={{ color: K.gold, fontSize: 12, fontWeight: 600, fontFamily: 'Inter,sans-serif' }}>
            {showCopilot ? 'Hide Copilot' : 'Copilot — Decision Snapshot'}
          </span>
        </button>
      </div>

      {/* ── Copilot recommendation sheet ── */}
      {showCopilot && !showCompare && !showOpponent && (
        <>
          <div onClick={() => setShowCopilot(false)} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 170, background: 'rgba(0,0,0,0.45)', zIndex: 10 }} />
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 170, zIndex: 11,
            background: `linear-gradient(180deg,#0C1828,#0A1420)`,
            borderTop: `1px solid ${K.goldBorder}`, borderRadius: '18px 18px 0 0',
            boxShadow: '0 -8px 40px rgba(0,0,0,0.7)', maxHeight: 390, overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 2px' }}>
              <div style={{ width: 34, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.14)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '8px 18px 10px' }}>
              <div>
                <span style={{ color: C.ivory, fontSize: 16, fontWeight: 700, fontFamily: 'Noto Serif JP,serif', display: 'block' }}>Decision snapshot</span>
                <span style={{ color: C.ivoryMuted, fontSize: 10, fontFamily: 'Inter,sans-serif' }}>Based on visible tiles · estimates only</span>
              </div>
              <button onClick={() => setShowOpponent(true)} style={{ padding: '6px 10px', borderRadius: 10, cursor: 'pointer', background: K.goldGlass, border: `1px solid ${K.goldBorder}` }}>
                <span style={{ color: K.gold, fontSize: 10, fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>Opponent reads</span>
              </button>
            </div>
            {/* Tabs */}
            <div style={{ display: 'flex', padding: '0 14px', gap: 5, marginBottom: 12 }}>
              {recs.map((r, i) => (
                <button key={i} onClick={() => setActiveRec(i)} style={{
                  flex: 1, padding: '7px 3px', borderRadius: 11, cursor: 'pointer',
                  background: activeRec === i ? K.goldGlass : C.glass,
                  border: `1px solid ${activeRec === i ? K.goldBorder : C.glassBorder}`,
                }}>
                  <span style={{ display: 'block', fontSize: 8, fontFamily: 'Inter,sans-serif', fontWeight: 700, letterSpacing: 0.7, color: activeRec === i ? r.col : C.ivoryMuted, marginBottom: 1 }}>{r.tag}</span>
                  <span style={{ fontSize: 9, fontFamily: 'Inter,sans-serif', color: activeRec === i ? C.ivory : C.ivoryMuted, fontWeight: activeRec === i ? 600 : 400 }}>{r.type}</span>
                </button>
              ))}
            </div>
            {/* Active rec */}
            <div style={{ padding: '0 14px 14px' }}>
              <div style={{ borderRadius: 14, padding: '12px 13px', background: C.glass, border: `1px solid ${C.glassBorder}`, marginBottom: 8 }}>
                <div style={{ display: 'flex', gap: 11, alignItems: 'flex-start', marginBottom: 9 }}>
                  <div>
                    <span style={{ color: C.ivoryMuted, fontSize: 8, fontFamily: 'Inter,sans-serif', display: 'block', marginBottom: 4 }}>Discard</span>
                    <Tile n={activeR.tile} size="md" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ color: activeR.col, fontSize: 12, fontWeight: 700, fontFamily: 'Inter,sans-serif', display: 'block', marginBottom: 4 }}>{activeR.action}</span>
                    <p style={{ color: C.ivoryDim, fontSize: 11, fontFamily: 'Inter,sans-serif', lineHeight: 1.6, margin: 0 }}>{activeR.reason}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                  <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${activeR.confLevel / 3 * 100}%`, height: '100%', borderRadius: 2, background: activeR.confLevel === 3 ? '#5CB85C' : activeR.confLevel === 2 ? K.gold : K.coral }} />
                  </div>
                  <span style={{ color: C.ivoryMuted, fontSize: 9, fontFamily: 'Inter,sans-serif', whiteSpace: 'nowrap' }}>{activeR.conf}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 5, marginBottom: 10 }}>
                {[
                  { label: 'Shanten', val: '0', note: 'tenpai after' },
                  { label: 'Ukeire', val: '1 tile', note: 'accepted' },
                  { label: 'Risk', val: activeR.riskTag, note: 'estimate', col: activeR.confLevel === 3 ? '#5CB85C' : activeR.confLevel === 2 ? K.gold : K.coral },
                ].map(s => (
                  <div key={s.label} style={{ flex: 1, padding: '7px 6px', borderRadius: 10, background: C.glass, border: `1px solid ${C.glassBorder}`, textAlign: 'center' }}>
                    <span style={{ color: s.col || C.ivory, fontSize: 11, fontWeight: 700, fontFamily: 'JetBrains Mono,monospace', display: 'block' }}>{s.val}</span>
                    <span style={{ color: C.ivoryMuted, fontSize: 8, fontFamily: 'Inter,sans-serif' }}>{s.label}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 7 }}>
                <button onClick={() => setShowCompare(true)} style={{ flex: 1, padding: '9px', borderRadius: 11, cursor: 'pointer', background: K.goldGlass, border: `1px solid ${K.goldBorder}` }}>
                  <span style={{ color: K.gold, fontSize: 12, fontWeight: 600, fontFamily: 'Inter,sans-serif' }}>Compare tiles →</span>
                </button>
                <button onClick={() => setShowCopilot(false)} style={{ padding: '9px 13px', borderRadius: 11, cursor: 'pointer', background: C.glass, border: `1px solid ${C.glassBorder}` }}>
                  <span style={{ color: C.ivoryMuted, fontSize: 12, fontFamily: 'Inter,sans-serif' }}>Dismiss</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Tile comparison overlay ── */}
      {showCompare && (
        <>
          <div onClick={() => setShowCompare(false)} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 170, background: 'rgba(0,0,0,0.55)', zIndex: 20 }} />
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 170, zIndex: 21,
            background: `linear-gradient(180deg,#0C1828,#0A1420)`,
            borderTop: `1px solid ${K.goldBorder}`, borderRadius: '18px 18px 0 0',
            boxShadow: '0 -8px 40px rgba(0,0,0,0.75)', padding: '14px 14px 16px', maxHeight: 420, overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ color: C.ivory, fontSize: 15, fontWeight: 700, fontFamily: 'Noto Serif JP,serif' }}>Tile comparison</span>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ color: C.ivoryMuted, fontSize: 11, fontFamily: 'Inter,sans-serif' }}>Expert</span>
                <Toggle val={showExpert} onToggle={() => setShowExpert(e => !e)} />
                <button onClick={() => setShowCompare(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.ivoryMuted, fontSize: 18, padding: 0, lineHeight: 1 }}>×</button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
              {[
                { tile: 'E', label: 'Discard East', note: 'SAFE', waitTile: 'S', wait: 'South pair', ev: '3,200–8,000', col: '#5CB85C', risk: 7, riskLabel: 'Very low' },
                { tile: 'S', label: 'Discard South', note: 'SPEED · VALUE', waitTile: 'E', wait: 'East pair', ev: '3,200–12,000+', col: K.gold, risk: 20, riskLabel: 'Low' },
              ].map(opt => (
                <div key={opt.tile} style={{ borderRadius: 14, padding: '11px 11px', background: C.glass, border: `1px solid ${C.glassBorder}` }}>
                  <div style={{ display: 'flex', gap: 7, alignItems: 'center', marginBottom: 9 }}>
                    <Tile n={opt.tile} size="sm" />
                    <div>
                      <span style={{ color: C.ivory, fontSize: 11, fontWeight: 600, fontFamily: 'Inter,sans-serif', display: 'block' }}>{opt.label}</span>
                      <span style={{ color: opt.col, fontSize: 8, fontFamily: 'Inter,sans-serif', fontWeight: 700 }}>{opt.note}</span>
                    </div>
                  </div>
                  {[
                    { k: 'Shanten', v: '0 (tenpai)', c: '#5CB85C' },
                    { k: 'Wait', v: opt.wait, c: C.ivory },
                    { k: 'Ukeire', v: '1 tile', c: C.ivory },
                    { k: 'Est. value', v: opt.ev, c: opt.col },
                  ].map(row => (
                    <div key={row.k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ color: C.ivoryMuted, fontSize: 9, fontFamily: 'Inter,sans-serif' }}>{row.k}</span>
                      <span style={{ color: row.c, fontSize: 9, fontFamily: 'JetBrains Mono,monospace', fontWeight: 600 }}>{row.v}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 2 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ color: C.ivoryMuted, fontSize: 9, fontFamily: 'Inter,sans-serif' }}>Deal-in risk</span>
                      <span style={{ color: opt.riskLabel === 'Very low' ? '#5CB85C' : K.gold, fontSize: 9, fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>{opt.riskLabel}</span>
                    </div>
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${opt.risk}%`, height: '100%', background: opt.risk < 15 ? '#5CB85C' : K.gold, borderRadius: 2 }} />
                    </div>
                  </div>
                  {showExpert && (
                    <div style={{ paddingTop: 9, marginTop: 8, borderTop: `1px solid ${C.glassBorder}` }}>
                      <span style={{ color: C.ivoryMuted, fontSize: 8, fontFamily: 'Inter,sans-serif', display: 'block', marginBottom: 5 }}>Accepted tile</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Tile n={opt.waitTile} size="xs" />
                        <span style={{ color: C.ivoryMuted, fontSize: 8, fontFamily: 'Inter,sans-serif' }}>~3 remaining in wall</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p style={{ color: C.ivoryMuted, fontSize: 10, fontFamily: 'Inter,sans-serif', lineHeight: 1.6, margin: 0, textAlign: 'center' }}>
              All values are estimates. Hidden opponent tiles are not known to the AI.
            </p>
          </div>
        </>
      )}

      {/* ── Opponent inference panel ── */}
      {showOpponent && (
        <>
          <div onClick={() => setShowOpponent(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 30 }} />
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 31,
            background: `linear-gradient(180deg,#0C1828,#0A1420)`,
            borderTop: `1px solid ${K.goldBorder}`, borderRadius: '18px 18px 0 0',
            boxShadow: '0 -8px 40px rgba(0,0,0,0.7)', paddingBottom: 24, maxHeight: '75%', overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 2px' }}>
              <div style={{ width: 34, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.14)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '6px 18px 12px' }}>
              <div>
                <span style={{ color: C.ivory, fontSize: 16, fontWeight: 700, fontFamily: 'Noto Serif JP,serif', display: 'block' }}>What the AI notices</span>
                <span style={{ color: C.ivoryMuted, fontSize: 10, fontFamily: 'Inter,sans-serif' }}>Visible tile evidence only — not hidden knowledge</span>
              </div>
              <button onClick={() => setShowOpponent(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.ivoryMuted, fontSize: 20, padding: 4, lineHeight: 1 }}>×</button>
            </div>
            <div style={{ padding: '0 14px', display: 'flex', flexDirection: 'column', gap: 9 }}>
              {[
                {
                  player: 'Mika · East', wind: '東', statusLabel: 'RIICHI', statusCol: K.coral, statusBg: K.coralGlass, statusBorder: K.coralBorder,
                  evidence: ['Declared riichi at turn 9 — fully closed hand', 'Pre-riichi discards: 6m 8p 1s N W', 'No open melds visible'],
                  inference: 'Riichi wait type unknown. Kanchan or penchan likely based on discard pattern. Treat all suits as dangerous.',
                  conf: 3, confLabel: 'High confidence (on riichi status)',
                },
                {
                  player: 'Ren · North', wind: '北', statusLabel: 'ACTIVE', statusCol: C.ivoryMuted, statusBg: C.glass, statusBorder: C.glassBorder,
                  evidence: ['Discards: 6m N W 4p — mostly terminals and honours', 'No open melds — hand appears closed'],
                  inference: 'Possibly targeting tanyao (all simples). Discarding honours early is consistent with this direction. More likely than an honour-based hand.',
                  conf: 2, confLabel: 'Medium confidence',
                },
                {
                  player: 'Sora · West', wind: '西', statusLabel: 'ACTIVE', statusCol: C.ivoryMuted, statusBg: C.glass, statusBorder: C.glassBorder,
                  evidence: ['Only 3 discards visible: 7p 3s N', 'Too few discards to infer direction'],
                  inference: 'Not enough information. Hand direction is uncertain — avoid assumptions.',
                  conf: 1, confLabel: 'Low confidence',
                },
              ].map(p => (
                <div key={p.player} style={{ borderRadius: 15, padding: '11px 13px', background: C.glass, border: `1px solid ${C.glassBorder}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ color: K.gold, fontSize: 13, fontFamily: 'Noto Serif JP,serif', fontWeight: 700 }}>{p.wind}</span>
                      <span style={{ color: C.ivory, fontSize: 12, fontWeight: 600, fontFamily: 'Inter,sans-serif' }}>{p.player}</span>
                    </div>
                    <span style={{ fontSize: 9, fontFamily: 'Inter,sans-serif', fontWeight: 700, color: p.statusCol, background: p.statusBg, padding: '2px 8px', borderRadius: 6, border: `1px solid ${p.statusBorder}` }}>{p.statusLabel}</span>
                  </div>
                  {p.evidence.map((e, i) => (
                    <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 3 }}>
                      <span style={{ color: K.gold, fontSize: 9, lineHeight: 1.5, flexShrink: 0 }}>·</span>
                      <span style={{ color: C.ivoryMuted, fontSize: 10, fontFamily: 'Inter,sans-serif', lineHeight: 1.5 }}>{e}</span>
                    </div>
                  ))}
                  <div style={{ padding: '7px 9px', borderRadius: 9, background: 'rgba(255,255,255,0.03)', border: `1px solid rgba(255,255,255,0.06)`, margin: '7px 0' }}>
                    <p style={{ color: C.ivoryDim, fontSize: 10, fontFamily: 'Inter,sans-serif', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>"{p.inference}"</p>
                  </div>
                  <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: 3 }}>
                      {[0,1,2].map(i => <div key={i} style={{ width: 20, height: 3, borderRadius: 2, background: i < p.conf ? (p.conf === 3 ? '#5CB85C' : K.gold) : 'rgba(255,255,255,0.1)' }} />)}
                    </div>
                    <span style={{ color: C.ivoryMuted, fontSize: 9, fontFamily: 'Inter,sans-serif' }}>{p.confLabel}</span>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ color: C.ivoryMuted, fontSize: 10, fontFamily: 'Inter,sans-serif', lineHeight: 1.6, margin: '10px 16px 0', textAlign: 'center' }}>
              The AI never states hidden tiles as fact. All inferences are based on visible discards and open melds only.
            </p>
          </div>
        </>
      )}
    </div>
  )
}

function CopilotReview({ onNav: _onNav }: { onNav: (s: Screen) => void }) {
  const [activeEvent, setActiveEvent] = useState<number | null>(null)

  const events = [
    { turn: 3, action: 'Discarded 6m', quality: 'good', note: 'Safe discard — kept hand shape intact and avoided Mika\'s suit.' },
    { turn: 6, action: 'Drew 3p, held it', quality: 'good', note: 'Correct call — 3p improved acceptance within the pin sequence.' },
    { turn: 9, action: 'Discarded 9m', quality: 'good', note: 'Freed up a block slot. Improved tenpai speed by one draw on average.' },
    { turn: 11, action: 'Passed on riichi', quality: 'review', note: 'Riichi was available here. Declaring it might have added 1+ han and opened ura-dora potential.' },
    { turn: 14, action: 'Reached tenpai!', quality: 'great', note: 'Hand reached tenpai with a clean two-way wait and low-risk tiles.' },
  ]

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 0', background: K.panel }}>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ color: C.ivory, fontSize: 21, fontWeight: 700, fontFamily: 'Noto Serif JP,serif', lineHeight: 1.2, marginBottom: 4 }}>Hand E3 Review</h1>
        <span style={{ color: K.gold, fontSize: 11, fontFamily: 'Inter,sans-serif' }}>2nd place · +12 points this hand</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 18 }}>
        <div style={{ borderRadius: 16, padding: '13px 15px', background: 'rgba(92,184,92,0.07)', border: '1px solid rgba(92,184,92,0.2)' }}>
          <span style={{ color: '#5CB85C', fontSize: 10, fontFamily: 'Inter,sans-serif', fontWeight: 700, letterSpacing: 0.7, textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>What went well</span>
          <p style={{ color: C.ivoryDim, fontSize: 12, fontFamily: 'Inter,sans-serif', lineHeight: 1.65, margin: 0 }}>
            Your discard sequence from turns 3–9 was efficient and low-risk. You avoided dangerous tiles from Mika's riichi pool and kept a clean hand shape throughout.
          </p>
        </div>

        <div style={{ borderRadius: 16, padding: '13px 15px', background: K.goldGlass, border: `1px solid ${K.goldBorder}` }}>
          <span style={{ color: K.gold, fontSize: 10, fontFamily: 'Inter,sans-serif', fontWeight: 700, letterSpacing: 0.7, textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>One better alternative</span>
          <p style={{ color: C.ivoryDim, fontSize: 12, fontFamily: 'Inter,sans-serif', lineHeight: 1.65, margin: 0 }}>
            At turn 11, declaring riichi was available. It would have added at least one han and opened ura-dora bonus potential — potentially +3,200 points if you had won from there.
          </p>
        </div>

        <div style={{ borderRadius: 16, padding: '13px 15px', background: K.coralGlass, border: `1px solid ${K.coralBorder}` }}>
          <span style={{ color: K.coral, fontSize: 10, fontFamily: 'Inter,sans-serif', fontWeight: 700, letterSpacing: 0.7, textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>Risk taken</span>
          <p style={{ color: C.ivoryDim, fontSize: 12, fontFamily: 'Inter,sans-serif', lineHeight: 1.65, margin: 0 }}>
            Holding South Wind after turn 12 carried ~22% estimated deal-in risk against Mika's riichi. You stayed in — aggressive but defensible. South hadn't appeared in rivers.
          </p>
        </div>

        <div style={{ borderRadius: 16, padding: '13px 15px', background: C.glass, border: `1px solid ${C.glassBorder}` }}>
          <span style={{ color: C.ivory, fontSize: 10, fontFamily: 'Inter,sans-serif', fontWeight: 700, letterSpacing: 0.7, textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>What to practice next</span>
          <p style={{ color: C.ivoryDim, fontSize: 12, fontFamily: 'Inter,sans-serif', lineHeight: 1.65, margin: '0 0 10px' }}>
            Riichi timing — recognising when declaring riichi adds more value than staying concealed. This comes up most when the hand has limited han without it.
          </p>
          <button style={{ padding: '7px 13px', borderRadius: 10, cursor: 'pointer', background: K.goldGlass, border: `1px solid ${K.goldBorder}` }}>
            <span style={{ color: K.gold, fontSize: 11, fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>Add to practice queue</span>
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <span style={{ color: C.ivory, fontSize: 13, fontWeight: 600, fontFamily: 'Noto Serif JP,serif', display: 'block', marginBottom: 10 }}>Decision timeline</span>
        <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
          <div style={{ display: 'flex', gap: 7, minWidth: 'max-content' }}>
            {events.map((e, i) => {
              const isGood = e.quality === 'good' || e.quality === 'great'
              const col = isGood ? '#5CB85C' : e.quality === 'review' ? K.gold : C.ivoryMuted
              const bg = isGood ? 'rgba(92,184,92,0.08)' : e.quality === 'review' ? K.goldGlass : C.glass
              const border = isGood ? 'rgba(92,184,92,0.2)' : e.quality === 'review' ? K.goldBorder : C.glassBorder
              return (
                <button key={i} onClick={() => setActiveEvent(activeEvent === i ? null : i)} style={{
                  minWidth: 108, padding: '9px 9px', borderRadius: 13, cursor: 'pointer', textAlign: 'left',
                  background: activeEvent === i ? K.goldGlass : bg,
                  border: `1px solid ${activeEvent === i ? K.goldBorder : border}`,
                }}>
                  <span style={{ color: C.ivoryMuted, fontSize: 8, fontFamily: 'JetBrains Mono,monospace', display: 'block', marginBottom: 3 }}>Turn {e.turn}</span>
                  <span style={{ color: col, fontSize: 10, fontWeight: 600, fontFamily: 'Inter,sans-serif', display: 'block', lineHeight: 1.4 }}>{e.action}</span>
                  {activeEvent === i && <p style={{ color: C.ivoryDim, fontSize: 10, fontFamily: 'Inter,sans-serif', lineHeight: 1.5, marginTop: 5, marginBottom: 0 }}>{e.note}</p>}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function CopilotSettings() {
  const [st, setSt] = useState({ neverWithout: true, voice: false, haptics: true, autoReview: true, uncertainty: true })
  const [intensity, setIntensity] = useState(2)
  const [vocab, setVocab] = useState<'plain' | 'standard' | 'technical'>('standard')
  const tog = (k: keyof typeof st) => setSt(s => ({ ...s, [k]: !s[k] }))

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 0', background: K.panel }}>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ color: C.ivory, fontSize: 21, fontWeight: 700, fontFamily: 'Noto Serif JP,serif', marginBottom: 6 }}>AI Controls & Trust</h1>
        <p style={{ color: C.ivoryMuted, fontSize: 12, fontFamily: 'Inter,sans-serif', lineHeight: 1.65, margin: 0 }}>
          What the assistant uses, what it cannot know, and how to configure its behaviour.
        </p>
      </div>

      <div style={{ borderRadius: 16, padding: '13px 14px', marginBottom: 11, background: C.glass, border: `1px solid ${C.glassBorder}` }}>
        <span style={{ color: K.gold, fontSize: 10, fontFamily: 'Inter,sans-serif', fontWeight: 700, letterSpacing: 0.7, textTransform: 'uppercase', display: 'block', marginBottom: 9 }}>What the AI uses</span>
        {['Visible discard rivers from all players', 'Open melds and declared riichi', 'Your hand structure and shanten count', 'Dora indicators and scoring rules', 'Statistical tile distribution (136 total tiles)'].map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 7, marginBottom: 5 }}>
            <span style={{ color: '#5CB85C', fontSize: 9, lineHeight: 1.6, flexShrink: 0 }}>●</span>
            <span style={{ color: C.ivoryDim, fontSize: 12, fontFamily: 'Inter,sans-serif', lineHeight: 1.6 }}>{item}</span>
          </div>
        ))}
      </div>

      <div style={{ borderRadius: 16, padding: '13px 14px', marginBottom: 11, background: K.coralGlass, border: `1px solid ${K.coralBorder}` }}>
        <span style={{ color: K.coral, fontSize: 10, fontFamily: 'Inter,sans-serif', fontWeight: 700, letterSpacing: 0.7, textTransform: 'uppercase', display: 'block', marginBottom: 9 }}>What the AI does not know</span>
        {["Hidden opponent hand tiles", "Which specific tiles opponents drew from the wall", "Opponent strategies or intentions", "Future wall order"].map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 7, marginBottom: 5 }}>
            <span style={{ color: K.coral, fontSize: 9, lineHeight: 1.6, flexShrink: 0 }}>○</span>
            <span style={{ color: C.ivoryDim, fontSize: 12, fontFamily: 'Inter,sans-serif', lineHeight: 1.6 }}>{item}</span>
          </div>
        ))}
      </div>

      <div style={{ borderRadius: 16, padding: '13px 14px', marginBottom: 16, background: C.glass, border: `1px solid ${C.glassBorder}` }}>
        <span style={{ color: C.ivory, fontSize: 12, fontFamily: 'Inter,sans-serif', fontWeight: 600, display: 'block', marginBottom: 5 }}>How estimates are generated</span>
        <p style={{ color: C.ivoryMuted, fontSize: 11, fontFamily: 'Inter,sans-serif', lineHeight: 1.7, margin: 0 }}>
          Shanten and ukeire are calculated precisely from your hand. Deal-in risk uses visible tile frequency and known wall statistics — not perfect information. Expected value ranges are coaching signals, not guarantees.
        </p>
      </div>

      {/* Prominent "never suggest without explanation" */}
      <div style={{ borderRadius: 16, padding: '15px', marginBottom: 16, background: K.goldGlass, border: `2px solid ${K.goldBorder}`, boxShadow: `0 0 24px rgba(154,138,90,0.1)` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: st.neverWithout ? 0 : 8 }}>
          <div style={{ flex: 1, paddingRight: 12 }}>
            <span style={{ color: C.ivory, fontSize: 13, fontFamily: 'Inter,sans-serif', fontWeight: 700, display: 'block', marginBottom: 3 }}>Never suggest without an explanation</span>
            <span style={{ color: C.ivoryMuted, fontSize: 11, fontFamily: 'Inter,sans-serif' }}>Every recommendation includes a written reason. No tile is flagged without context.</span>
          </div>
          <Toggle val={st.neverWithout} onToggle={() => tog('neverWithout')} />
        </div>
        {!st.neverWithout && (
          <div style={{ marginTop: 10, padding: '7px 10px', borderRadius: 10, background: K.coralGlass, border: `1px solid ${K.coralBorder}` }}>
            <span style={{ color: K.coral, fontSize: 11, fontFamily: 'Inter,sans-serif' }}>Suggestions without explanations are harder to evaluate and learn from.</span>
          </div>
        )}
      </div>

      <span style={{ color: C.ivory, fontSize: 12, fontWeight: 600, fontFamily: 'Noto Serif JP,serif', display: 'block', marginBottom: 9 }}>Coaching intensity</span>
      <div style={{ display: 'flex', gap: 7, marginBottom: 16 }}>
        {[{ v: 1, l: 'Subtle' }, { v: 2, l: 'Standard' }, { v: 3, l: 'Verbose' }].map(h => (
          <button key={h.v} onClick={() => setIntensity(h.v)} style={{ flex: 1, padding: '9px 4px', borderRadius: 11, cursor: 'pointer', background: intensity === h.v ? K.goldGlass : C.glass, border: `1px solid ${intensity === h.v ? K.goldBorder : C.glassBorder}` }}>
            <span style={{ color: intensity === h.v ? K.gold : C.ivoryMuted, fontSize: 12, fontFamily: 'Inter,sans-serif', fontWeight: intensity === h.v ? 600 : 400 }}>{h.l}</span>
          </button>
        ))}
      </div>

      <span style={{ color: C.ivory, fontSize: 12, fontWeight: 600, fontFamily: 'Noto Serif JP,serif', display: 'block', marginBottom: 9 }}>Vocabulary level</span>
      <div style={{ display: 'flex', gap: 7, marginBottom: 16 }}>
        {[{ v: 'plain' as const, l: 'Plain English' }, { v: 'standard' as const, l: 'Standard' }, { v: 'technical' as const, l: 'Technical' }].map(h => (
          <button key={h.v} onClick={() => setVocab(h.v)} style={{ flex: 1, padding: '9px 4px', borderRadius: 11, cursor: 'pointer', background: vocab === h.v ? K.goldGlass : C.glass, border: `1px solid ${vocab === h.v ? K.goldBorder : C.glassBorder}` }}>
            <span style={{ color: vocab === h.v ? K.gold : C.ivoryMuted, fontSize: 11, fontFamily: 'Inter,sans-serif', fontWeight: vocab === h.v ? 600 : 400 }}>{h.l}</span>
          </button>
        ))}
      </div>

      <span style={{ color: C.ivory, fontSize: 12, fontWeight: 600, fontFamily: 'Noto Serif JP,serif', display: 'block', marginBottom: 9 }}>Features</span>
      <SettingRow label="Show uncertainty labels" desc="Display Low / Medium / High confidence on all estimates" val={st.uncertainty} onToggle={() => tog('uncertainty')} />
      <SettingRow label="Voice explanations" desc="Read recommendations aloud after opening Copilot" val={st.voice} onToggle={() => tog('voice')} />
      <SettingRow label="Haptic alerts" desc="Vibrate when a high-risk tile is selected from hand" val={st.haptics} onToggle={() => tog('haptics')} />
      <SettingRow label="Auto-capture decisions" desc="Save all discards for end-of-hand review" val={st.autoReview} onToggle={() => tog('autoReview')} />

      <div style={{ borderRadius: 16, padding: '13px 14px', marginBottom: 20, background: C.glass, border: `1px solid ${C.glassBorder}` }}>
        <span style={{ color: C.ivory, fontSize: 12, fontFamily: 'Inter,sans-serif', fontWeight: 600, display: 'block', marginBottom: 5 }}>Game log storage</span>
        <p style={{ color: C.ivoryMuted, fontSize: 11, fontFamily: 'Inter,sans-serif', lineHeight: 1.7, margin: '0 0 10px' }}>
          Game logs are stored locally and used only to generate your personal review history. They are not uploaded or used to train AI models.
        </p>
        <button style={{ padding: '7px 13px', borderRadius: 10, cursor: 'pointer', background: K.coralGlass, border: `1px solid ${K.coralBorder}` }}>
          <span style={{ color: K.coral, fontSize: 12, fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>Clear all game logs</span>
        </button>
      </div>
    </div>
  )
}

/* ─── ADAPTIVE AI LAB ─── */

function RadarChart({ vals, size = 56 }: { vals: number[]; size?: number }) {
  const n = vals.length, cx = size / 2, cy = size / 2, r = size * 0.37
  const angle = (i: number) => (i / n) * Math.PI * 2 - Math.PI / 2
  const pt = (i: number, s: number): [number, number] => {
    const a = angle(i)
    return [cx + Math.cos(a) * r * s, cy + Math.sin(a) * r * s]
  }
  const ps = (pts: [number, number][]) => pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ') + 'Z'
  const grid = Array.from({ length: n }, (_, i) => pt(i, 1))
  const half = Array.from({ length: n }, (_, i) => pt(i, 0.5))
  const filled = vals.map((v, i) => pt(i, Math.max(0.08, v)))
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <path d={ps(half)} stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" fill="none" />
      <path d={ps(grid)} stroke="rgba(255,255,255,0.14)" strokeWidth="0.8" fill="none" />
      {grid.map(([x, y], i) => <line key={i} x1={cx.toFixed(1)} y1={cy.toFixed(1)} x2={x.toFixed(1)} y2={y.toFixed(1)} stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" />)}
      <path d={ps(filled)} fill="rgba(58,221,168,0.18)" stroke={L.mint} strokeWidth="1.2" />
      {filled.map(([x, y], i) => <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r="1.8" fill={L.mint} />)}
    </svg>
  )
}

function LabSlider({ val, label, note, onChange }: { val: number; label: string; note?: string; onChange: (v: number) => void }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, alignItems: 'baseline' }}>
        <div>
          <span style={{ color: C.ivoryDim, fontSize: 12, fontFamily: 'Inter,sans-serif', fontWeight: 500 }}>{label}</span>
          {note && <span style={{ color: C.ivoryMuted, fontSize: 10, fontFamily: 'Inter,sans-serif', marginLeft: 5 }}>{note}</span>}
        </div>
        <span style={{ color: L.mint, fontSize: 11, fontFamily: 'JetBrains Mono,monospace', fontWeight: 600 }}>{val}</span>
      </div>
      <div style={{ position: 'relative', height: 24, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        onClick={e => {
          const rect = e.currentTarget.getBoundingClientRect()
          onChange(Math.round(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * 100))
        }}>
        <div style={{ position: 'absolute', left: 0, right: 0, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
          <div style={{ width: `${val}%`, height: '100%', background: L.mint, borderRadius: 2 }} />
        </div>
        <div style={{ position: 'absolute', left: `${val}%`, width: 16, height: 16, borderRadius: 8, background: L.mint, transform: 'translateX(-50%)', boxShadow: '0 1px 4px rgba(0,0,0,0.5)', border: '2px solid rgba(255,255,255,0.25)', pointerEvents: 'none' }} />
      </div>
    </div>
  )
}

function LNavIcon({ type, active }: { type: string; active: boolean }) {
  const col = active ? L.mint : '#55524D'
  const sw = active ? '1.8' : '1.5'
  const icons: Record<string, React.ReactElement> = {
    'lab-home': <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
      <path d="M3 12L12 3l9 9" stroke={col} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 10v10a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1V10" stroke={col} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>,
    'lab-library': <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
      <circle cx="9" cy="8" r="3.5" stroke={col} strokeWidth={sw}/>
      <path d="M3 20c0-3.3 2.7-6 6-6" stroke={col} strokeWidth={sw} strokeLinecap="round"/>
      <circle cx="17" cy="9" r="2.5" stroke={col} strokeWidth={sw}/>
      <path d="M13 20c0-2.8 1.8-5.2 4-5.8" stroke={col} strokeWidth={sw} strokeLinecap="round"/>
      <path d="M19 20h-4" stroke={col} strokeWidth={sw} strokeLinecap="round"/>
    </svg>,
    'lab-match': <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke={col} strokeWidth={sw}/>
      <path d="M3 9h18M9 3v18" stroke={col} strokeWidth={sw}/>
    </svg>,
    'lab-results': <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
      <path d="M3 20V14l4-4 4 4 4-7 4 5" stroke={col} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>,
    'lab-ethics': <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
      <path d="M12 3l-9 4v5c0 5 3.6 9.7 9 11 5.4-1.3 9-6 9-11V7l-9-4z" stroke={col} strokeWidth={sw} strokeLinejoin="round"/>
      <path d="M9 12l2 2 4-4" stroke={col} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>,
  }
  return icons[type] || <svg width="22" height="22" />
}

const LAB_TABS = [
  { id: 'lab-home', label: 'Home' },
  { id: 'lab-library', label: 'AI Lab' },
  { id: 'lab-match', label: 'Match' },
  { id: 'lab-results', label: 'Review' },
  { id: 'lab-ethics', label: 'Profile' },
]

function LabNav({ active, onNav }: { active: string; onNav: (t: string) => void }) {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, height: 83,
      background: 'rgba(12,12,40,0.97)', backdropFilter: 'blur(24px)',
      borderTop: `0.5px solid ${L.mintBorder}`,
      display: 'flex', alignItems: 'flex-start', paddingTop: 10,
    }}>
      {LAB_TABS.map(t => (
        <button key={t.id} onClick={() => onNav(t.id)} style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        }}>
          <LNavIcon type={t.id} active={active === t.id} />
          <span style={{ fontSize: 10, fontFamily: 'Inter,sans-serif', letterSpacing: 0.2, fontWeight: active === t.id ? 600 : 400, color: active === t.id ? L.mint : '#55524D' }}>{t.label}</span>
        </button>
      ))}
    </div>
  )
}

function LabHome({ onNav, appMode, onSwitchMode }: {
  onNav: (s: Screen) => void
  appMode?: 'arena' | 'journey' | 'copilot' | 'lab'
  onSwitchMode?: (m: 'arena' | 'journey' | 'copilot' | 'lab') => void
}) {
  const modes = [
    { label: 'Read Aggression', sub: 'Identify and counter attacking play styles', icon: '⚡' },
    { label: 'Practice Defense', sub: 'Fold, guard, and survive under pressure', icon: '▣' },
    { label: 'Improve Efficiency', sub: 'Build cleaner hands with fewer wasted draws', icon: '◈' },
  ]
  const recent = [
    { opp: 'The Chaser', result: '+2.4 pts', up: true, turns: 24 },
    { opp: 'The Wall', result: '−1.1 pts', up: false, turns: 18 },
    { opp: 'The Architect', result: '+4.8 pts', up: true, turns: 31 },
  ]
  const tools: { label: string; screen: Screen }[] = [
    { label: 'Compare AI styles', screen: 'lab-compare' },
    { label: 'Experiments', screen: 'lab-experiment' },
    { label: 'AI memory', screen: 'lab-memory' },
  ]
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 0', background: L.indigo }}>
      {onSwitchMode && <ModeSwitcher mode={appMode ?? 'lab'} onSwitch={onSwitchMode} />}
      {/* Header */}
      <div style={{ marginBottom: 18, position: 'relative' }}>
        <div style={{ position: 'absolute', top: -8, right: -8, width: 180, height: 90, background: `radial-gradient(ellipse,${L.mint}18,transparent 70%)`, pointerEvents: 'none' }} />
        <span style={{ color: L.mint, fontSize: 10, fontFamily: 'JetBrains Mono,monospace', fontWeight: 600, letterSpacing: 1, display: 'block', marginBottom: 5 }}>ADAPTIVE AI LAB</span>
        <h1 style={{ color: C.ivory, fontSize: 19, fontWeight: 700, fontFamily: 'Noto Serif JP,serif', lineHeight: 1.35, maxWidth: 270 }}>
          Train against the way you want to improve.
        </h1>
      </div>

      {/* Training modes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 16 }}>
        {modes.map(m => (
          <button key={m.label} onClick={() => onNav('lab-library')} style={{
            padding: '12px 14px', borderRadius: 14, cursor: 'pointer', textAlign: 'left',
            background: L.indigoMid, border: `1px solid rgba(255,255,255,0.07)`,
            display: 'flex', gap: 12, alignItems: 'center',
          }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: L.mintGlass, border: `1px solid ${L.mintBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: L.mint, fontSize: 16 }}>{m.icon}</span>
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ color: C.ivory, fontSize: 13, fontWeight: 600, fontFamily: 'Inter,sans-serif', display: 'block', marginBottom: 2 }}>{m.label}</span>
              <span style={{ color: C.ivoryMuted, fontSize: 11, fontFamily: 'Inter,sans-serif' }}>{m.sub}</span>
            </div>
            <span style={{ color: C.ivoryMuted, fontSize: 18, lineHeight: 1 }}>›</span>
          </button>
        ))}
      </div>

      {/* Recent sessions */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 9 }}>
          <span style={{ color: C.ivory, fontSize: 13, fontWeight: 600, fontFamily: 'Noto Serif JP,serif' }}>Recent sessions</span>
          <button onClick={() => onNav('lab-results')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <span style={{ color: L.mint, fontSize: 11, fontFamily: 'Inter,sans-serif' }}>See all →</span>
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {recent.map((s, i) => (
            <div key={i} style={{ padding: '9px 13px', borderRadius: 12, background: L.indigoMid, border: `1px solid rgba(255,255,255,0.06)`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
                <div style={{ width: 26, height: 26, borderRadius: 8, background: L.mintGlass, border: `1px solid ${L.mintBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: L.mint, fontSize: 9, fontFamily: 'Noto Serif JP,serif', fontWeight: 700 }}>AI</span>
                </div>
                <div>
                  <span style={{ color: C.ivoryDim, fontSize: 12, fontFamily: 'Inter,sans-serif', fontWeight: 500, display: 'block' }}>{s.opp}</span>
                  <span style={{ color: C.ivoryMuted, fontSize: 9, fontFamily: 'Inter,sans-serif' }}>{s.turns} turns</span>
                </div>
              </div>
              <span style={{ color: s.up ? '#5CB85C' : K.coral, fontSize: 13, fontFamily: 'JetBrains Mono,monospace', fontWeight: 700 }}>{s.result}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick tools */}
      <div style={{ display: 'flex', gap: 7, marginBottom: 14 }}>
        {tools.map(t => (
          <button key={t.label} onClick={() => onNav(t.screen)} style={{ flex: 1, padding: '9px 4px', borderRadius: 11, cursor: 'pointer', background: L.indigoMid, border: `1px solid rgba(255,255,255,0.07)` }}>
            <span style={{ color: C.ivoryDim, fontSize: 9, fontFamily: 'Inter,sans-serif', fontWeight: 500, lineHeight: 1.4, display: 'block' }}>{t.label}</span>
          </button>
        ))}
      </div>

      {/* CTA */}
      <button onClick={() => onNav('lab-library')} style={{
        width: '100%', padding: '14px', borderRadius: 16, cursor: 'pointer', marginBottom: 4,
        background: `linear-gradient(135deg,${L.mint},#2AC890)`, border: 'none',
      }}>
        <span style={{ color: L.indigo, fontSize: 15, fontWeight: 700, fontFamily: 'Inter,sans-serif' }}>Create Training Match</span>
      </button>
    </div>
  )
}

function LabLibrary({ onNav }: { onNav: (s: Screen) => void }) {
  const [sel, setSel] = useState<string | null>(null)

  const OPPONENTS = [
    {
      id: 'chaser', name: 'The Chaser', kanji: '攻', diff: 'Hard', adapt: 'Low',
      tag: 'Prioritises speed and frequent attacks',
      vals: [0.95, 0.40, 0.25, 0.85, 0.20], badges: ['Aggressive', 'Fast'],
      col: '#D05040', kc: '#FF9090',
    },
    {
      id: 'architect', name: 'The Architect', kanji: '匠', diff: 'Expert', adapt: 'Medium',
      tag: 'Builds high-value hands with patience',
      vals: [0.30, 0.95, 0.70, 0.30, 0.45], badges: ['High-value', 'Patient'],
      col: L.copper, kc: '#F0C080',
    },
    {
      id: 'wall', name: 'The Wall', kanji: '壁', diff: 'Medium', adapt: 'Low',
      tag: 'Folds early and minimises deal-in risk',
      vals: [0.15, 0.50, 0.95, 0.05, 0.20], badges: ['Defensive', 'Safe'],
      col: '#3A8060', kc: '#8AF0D0',
    },
    {
      id: 'opportunist', name: 'The Opportunist', kanji: '機', diff: 'Hard', adapt: 'High',
      tag: 'Changes strategy based on score and round context',
      vals: [0.60, 0.65, 0.55, 0.60, 0.90], badges: ['Flexible', 'Context-aware'],
      col: C.brassBright, kc: '#FFD890',
    },
    {
      id: 'human', name: 'The Human-Like', kanji: '人', diff: 'Variable', adapt: 'High',
      tag: 'Reasonable decisions rather than optimal ones',
      vals: [0.55, 0.55, 0.55, 0.50, 0.75], badges: ['Balanced', 'Understandable'],
      col: L.mint, kc: '#80FFD8',
    },
  ]

  const LABELS = ['Spd', 'Val', 'Def', 'Risk', 'Adp']

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 0', background: L.indigo }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h1 style={{ color: C.ivory, fontSize: 20, fontWeight: 700, fontFamily: 'Noto Serif JP,serif' }}>Opponent Library</h1>
        <button onClick={() => onNav('lab-builder')} style={{ padding: '7px 12px', borderRadius: 10, cursor: 'pointer', background: L.mintGlass, border: `1px solid ${L.mintBorder}` }}>
          <span style={{ color: L.mint, fontSize: 11, fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>Build custom →</span>
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 16 }}>
        {OPPONENTS.map(opp => (
          <div key={opp.id}>
            <button onClick={() => setSel(sel === opp.id ? null : opp.id)} style={{
              width: '100%', padding: '12px 13px', borderRadius: sel === opp.id ? '16px 16px 0 0' : 16, cursor: 'pointer', textAlign: 'left',
              background: sel === opp.id ? L.indigoLight : L.indigoMid,
              border: `1px solid ${sel === opp.id ? opp.col : 'rgba(255,255,255,0.07)'}`,
              borderBottom: sel === opp.id ? `1px solid ${opp.col}40` : undefined,
              display: 'flex', gap: 11, alignItems: 'center',
            }}>
              {/* Portrait */}
              <div style={{
                width: 48, height: 48, borderRadius: 13, flexShrink: 0,
                background: `${opp.col}18`, border: `1.5px solid ${opp.col}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: sel === opp.id ? `0 0 14px ${opp.col}28` : 'none',
              }}>
                <span style={{ color: opp.kc, fontSize: 20, fontFamily: 'Noto Serif JP,serif', fontWeight: 700 }}>{opp.kanji}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 3 }}>
                  <span style={{ color: C.ivory, fontSize: 13, fontWeight: 700, fontFamily: 'Inter,sans-serif' }}>{opp.name}</span>
                  <span style={{ fontSize: 8, fontFamily: 'Inter,sans-serif', fontWeight: 700, color: opp.col, background: `${opp.col}20`, padding: '1px 6px', borderRadius: 5, border: `1px solid ${opp.col}38` }}>{opp.diff}</span>
                </div>
                <p style={{ color: C.ivoryMuted, fontSize: 10, fontFamily: 'Inter,sans-serif', lineHeight: 1.5, margin: '0 0 5px' }}>{opp.tag}</p>
                <div style={{ display: 'flex', gap: 4 }}>
                  {opp.badges.map(b => <span key={b} style={{ fontSize: 8, fontFamily: 'Inter,sans-serif', color: C.ivoryMuted, background: 'rgba(255,255,255,0.06)', padding: '1px 6px', borderRadius: 4 }}>{b}</span>)}
                </div>
              </div>
              <div style={{ flexShrink: 0 }}>
                <RadarChart vals={opp.vals} size={52} />
                <div style={{ display: 'flex', gap: 1, justifyContent: 'center', marginTop: 2 }}>
                  {LABELS.map(l => <span key={l} style={{ fontSize: 6, color: C.ivoryMuted, fontFamily: 'Inter,sans-serif' }}>{l}</span>)}
                </div>
              </div>
            </button>
            {sel === opp.id && (
              <div style={{
                padding: '10px 14px 12px', background: L.indigoMid,
                borderRadius: '0 0 16px 16px',
                border: `1px solid ${opp.col}`, borderTop: 'none',
              }}>
                <div style={{ display: 'flex', gap: 7, marginBottom: 10 }}>
                  {[{ k: 'Adaptation', v: opp.adapt }, { k: 'Difficulty', v: opp.diff }].map(s => (
                    <div key={s.k} style={{ flex: 1, padding: '5px 8px', borderRadius: 9, background: 'rgba(255,255,255,0.04)', border: `1px solid rgba(255,255,255,0.07)`, textAlign: 'center' }}>
                      <span style={{ color: C.ivoryMuted, fontSize: 8, fontFamily: 'Inter,sans-serif', display: 'block' }}>{s.k}</span>
                      <span style={{ color: C.ivoryDim, fontSize: 11, fontWeight: 600, fontFamily: 'Inter,sans-serif' }}>{s.v}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 7 }}>
                  <button onClick={() => onNav('lab-match')} style={{ flex: 1, padding: '9px', borderRadius: 11, cursor: 'pointer', background: `linear-gradient(135deg,${L.mint},#2AC890)`, border: 'none' }}>
                    <span style={{ color: L.indigo, fontSize: 12, fontWeight: 700, fontFamily: 'Inter,sans-serif' }}>Play against</span>
                  </button>
                  <button onClick={() => onNav('lab-experiment')} style={{ flex: 1, padding: '9px', borderRadius: 11, cursor: 'pointer', background: L.mintGlass, border: `1px solid ${L.mintBorder}` }}>
                    <span style={{ color: L.mint, fontSize: 12, fontFamily: 'Inter,sans-serif' }}>Experiment</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function LabBuilder({ onNav }: { onNav: (s: Screen) => void }) {
  const [sliders, setSliders] = useState({ aggression: 50, value: 50, defense: 50, adaptation: 50, explain: 60, tone: 40 })
  const [preset, setPreset] = useState('balanced')

  const set = (k: keyof typeof sliders, v: number) => { setSliders(s => ({ ...s, [k]: v })); setPreset('custom') }

  const applyPreset = (p: string) => {
    const cfgs: Record<string, typeof sliders> = {
      balanced: { aggression: 50, value: 50, defense: 50, adaptation: 50, explain: 60, tone: 40 },
      aggressive: { aggression: 85, value: 55, defense: 20, adaptation: 35, explain: 30, tone: 25 },
      defensive: { aggression: 20, value: 55, defense: 85, adaptation: 40, explain: 60, tone: 50 },
      experimental: { aggression: 70, value: 80, defense: 30, adaptation: 90, explain: 80, tone: 65 },
      humanlike: { aggression: 50, value: 50, defense: 55, adaptation: 60, explain: 88, tone: 78 },
    }
    setPreset(p)
    if (cfgs[p]) setSliders(cfgs[p])
  }

  const desc = () => {
    const { aggression, defense, adaptation, explain } = sliders
    if (aggression > 70 && defense < 30) return "This opponent attacks early and often. Expect frequent riichi attempts with little concern for safety — they may overvalue speed when behind."
    if (defense > 70 && aggression < 30) return "This opponent plays cautiously, folding when threatened. Deal-in risk is very low but they will rarely put direct pressure on you."
    if (adaptation > 75) return "This opponent adjusts its strategy based on score and round context. Expect shifts in aggression and direction as the game evolves."
    if (explain > 75) return "This opponent explains its reasoning often, making it easier to study what it is responding to and why."
    return "A balanced opponent that adapts its aggression to hand quality and game context. Suitable for most practice scenarios."
  }

  const PRESETS = [
    { id: 'balanced', label: 'Balanced' },
    { id: 'aggressive', label: 'Aggressive' },
    { id: 'defensive', label: 'Defensive' },
    { id: 'experimental', label: 'Experimental' },
    { id: 'humanlike', label: 'Human-Like' },
  ]

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 16px', background: L.indigo }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14 }}>
        <button onClick={() => onNav('lab-library')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.ivoryMuted, fontSize: 20, padding: '0 2px', lineHeight: 1 }}>‹</button>
        <h1 style={{ color: C.ivory, fontSize: 18, fontWeight: 700, fontFamily: 'Noto Serif JP,serif' }}>Build Your Opponent</h1>
      </div>
      {/* Presets */}
      <div style={{ overflowX: 'auto', paddingBottom: 4, marginBottom: 14 }}>
        <div style={{ display: 'flex', gap: 6, minWidth: 'max-content' }}>
          {PRESETS.map(p => (
            <button key={p.id} onClick={() => applyPreset(p.id)} style={{
              padding: '7px 13px', borderRadius: 11, cursor: 'pointer',
              background: preset === p.id ? L.mintGlass : 'rgba(255,255,255,0.04)',
              border: `1px solid ${preset === p.id ? L.mintBorder : 'rgba(255,255,255,0.07)'}`,
            }}>
              <span style={{ color: preset === p.id ? L.mint : C.ivoryMuted, fontSize: 11, fontFamily: 'Inter,sans-serif', fontWeight: preset === p.id ? 600 : 400 }}>{p.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Sliders */}
      <div style={{ padding: '14px 15px', borderRadius: 16, background: L.indigoMid, border: `1px solid rgba(255,255,255,0.07)`, marginBottom: 13 }}>
        <LabSlider val={sliders.aggression} label="Aggression" note="(0 = safe · 100 = attacks often)" onChange={v => set('aggression', v)} />
        <LabSlider val={sliders.value} label="Hand value preference" note="(0 = speed · 100 = high value)" onChange={v => set('value', v)} />
        <LabSlider val={sliders.defense} label="Defense" note="(0 = reckless · 100 = very guarded)" onChange={v => set('defense', v)} />
        <LabSlider val={sliders.adaptation} label="Adaptation speed" note="(0 = fixed · 100 = highly reactive)" onChange={v => set('adaptation', v)} />
        <LabSlider val={sliders.explain} label="Explanation frequency" note="(0 = silent · 100 = explains often)" onChange={v => set('explain', v)} />
        <LabSlider val={sliders.tone} label="Conversational tone" note="(0 = formal · 100 = casual)" onChange={v => set('tone', v)} />
      </div>
      {/* Dynamic description */}
      <div style={{ padding: '12px 14px', borderRadius: 14, background: L.mintGlass, border: `1px solid ${L.mintBorder}`, marginBottom: 16 }}>
        <span style={{ color: L.mint, fontSize: 10, fontFamily: 'Inter,sans-serif', fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>Opponent profile</span>
        <p style={{ color: C.ivoryDim, fontSize: 12, fontFamily: 'Inter,sans-serif', lineHeight: 1.65, margin: 0, fontStyle: 'italic' }}>"{desc()}"</p>
      </div>
      <button onClick={() => onNav('lab-match')} style={{ width: '100%', padding: '14px', borderRadius: 16, cursor: 'pointer', background: `linear-gradient(135deg,${L.mint},#2AC890)`, border: 'none' }}>
        <span style={{ color: L.indigo, fontSize: 15, fontWeight: 700, fontFamily: 'Inter,sans-serif' }}>Create Opponent & Play</span>
      </button>
    </div>
  )
}

function LabMemory({ onNav: _onNav }: { onNav: (s: Screen) => void }) {
  const cards = [
    {
      title: 'Your common discard pattern',
      icon: '◈', col: L.copper,
      body: "You tend to discard honour tiles before terminals in the first 5 turns. This is consistent across the last 3 matches and suggests a tanyao preference when possible.",
    },
    {
      title: 'Situations that challenge you',
      icon: '△', col: K.coral,
      body: "You fold effectively after opponent riichi, but take noticeably more risk when defending against open melds. The AI has noted this distinction.",
    },
    {
      title: 'Opponent adjustment',
      icon: '↻', col: L.mint,
      body: "The AI will increase open-hand pressure in the next match. Expect more pon and chi calls, particularly when you are actively building a hand.",
    },
    {
      title: 'Next counter-strategy',
      icon: '⟶', col: C.brassBright,
      body: "Try to recognise open-meld shapes quickly. A player calling pon on honour tiles early is often targeting yakuhai — folding or redirecting against them may be more valuable than pushing.",
    },
  ]
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 0', background: L.indigo }}>
      <div style={{ marginBottom: 14 }}>
        <span style={{ color: L.mint, fontSize: 10, fontFamily: 'JetBrains Mono,monospace', fontWeight: 600, letterSpacing: 1, display: 'block', marginBottom: 5 }}>ADAPTATION PROFILE · SESSION 3</span>
        <h1 style={{ color: C.ivory, fontSize: 20, fontWeight: 700, fontFamily: 'Noto Serif JP,serif' }}>What the AI has noticed</h1>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 14 }}>
        {cards.map(card => (
          <div key={card.title} style={{ padding: '12px 14px', borderRadius: 16, background: L.indigoMid, border: `1px solid rgba(255,255,255,0.08)` }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 7 }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, flexShrink: 0, background: `${card.col}18`, border: `1px solid ${card.col}38`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: card.col, fontSize: 13 }}>{card.icon}</span>
              </div>
              <span style={{ color: C.ivory, fontSize: 12, fontWeight: 600, fontFamily: 'Inter,sans-serif', paddingTop: 3 }}>{card.title}</span>
            </div>
            <p style={{ color: C.ivoryDim, fontSize: 12, fontFamily: 'Inter,sans-serif', lineHeight: 1.65, margin: 0 }}>{card.body}</p>
          </div>
        ))}
      </div>
      <div style={{ padding: '10px 14px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: `1px solid rgba(255,255,255,0.07)`, marginBottom: 20 }}>
        <p style={{ color: C.ivoryMuted, fontSize: 11, fontFamily: 'Inter,sans-serif', lineHeight: 1.65, margin: 0 }}>
          This is a training profile gathered only during your current session. It is not a permanent record or judgement of your play. It resets when you start a new session.
        </p>
      </div>
    </div>
  )
}

function LabMatch({ onNav }: { onNav: (s: Screen) => void }) {
  const [showWhy, setShowWhy] = useState(false)
  const [selIdx, setSelIdx] = useState<number | null>(null)
  const hand = ['2m','3m','4m','5p','6p','7p','3s','4s','5s','E','E','8m','9m']
  const drawTile = '7m'

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', background: L.indigo }}>
      {/* Header */}
      <div style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', borderBottom: `0.5px solid ${L.mintBorder}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ color: L.mint, fontSize: 13, fontWeight: 700, fontFamily: 'JetBrains Mono,monospace' }}>東2局</span>
          <span style={{ color: C.ivoryMuted, fontSize: 10, fontFamily: 'Inter,sans-serif' }}>Turn 8 · vs The Chaser</span>
        </div>
        <button onClick={() => onNav('lab-results')} style={{ padding: '4px 10px', borderRadius: 8, cursor: 'pointer', background: K.coralGlass, border: `1px solid ${K.coralBorder}` }}>
          <span style={{ color: K.coral, fontSize: 10, fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>End match</span>
        </button>
      </div>

      {/* Table */}
      <div style={{ flexShrink: 0, height: 194, background: `radial-gradient(ellipse at 50% 50%,#1A3A2F,#0F2820,#06100A)`, padding: '8px 10px', position: 'relative' }}>
        {/* AI opponent highlighted north */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, marginBottom: 4 }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 1 }}>
            <div style={{ background: L.mintGlass, border: `1px solid ${L.mintBorder}`, borderRadius: 8, padding: '2px 8px', display: 'flex', gap: 5, alignItems: 'center' }}>
              <span style={{ color: L.mint, fontSize: 12, fontFamily: 'Noto Serif JP,serif', fontWeight: 700 }}>攻</span>
              <span style={{ color: L.mint, fontSize: 9, fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>The Chaser · 28,400</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 1 }}>{Array.from({ length: 12 }).map((_, i) => <Tile key={i} n="?" size="xs" fd />)}</div>
          <div style={{ display: 'flex', gap: 1 }}>{['8m','N','3p','W'].map((t, i) => <Tile key={i} n={t} size="xs" />)}</div>
        </div>
        {/* Middle row */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
            <span style={{ color: C.ivoryDim, fontSize: 8, background: 'rgba(0,0,0,0.38)', padding: '1px 6px', borderRadius: 3, fontFamily: 'Inter,sans-serif' }}>西 Sora · 24,200</span>
            <div style={{ display: 'flex', gap: 1 }}>{Array.from({ length: 5 }).map((_, i) => <Tile key={i} n="?" size="xs" fd />)}</div>
            <div style={{ display: 'flex', gap: 1 }}>{['5s','2p','N'].map((t, i) => <Tile key={i} n={t} size="xs" />)}</div>
          </div>
          <div style={{ width: 76, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.25)', borderRadius: 10, padding: '6px 4px' }}>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <span style={{ color: C.ivoryMuted, fontSize: 8, fontFamily: 'Inter,sans-serif' }}>Dora</span>
              <Tile n="6p" size="xs" />
            </div>
            <div style={{ width: 28, height: 28, borderRadius: 14, background: `linear-gradient(135deg,${L.indigo},#0C2218)`, border: `1.5px solid ${L.mintBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: L.mint, fontSize: 12, fontFamily: 'Noto Serif JP,serif', fontWeight: 700 }}>東</span>
            </div>
            <div style={{ display: 'flex', gap: 3 }}>{[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, background: 'rgba(255,255,255,0.14)', borderRadius: 1 }} />)}</div>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
            <span style={{ color: C.ivoryDim, fontSize: 8, background: 'rgba(0,0,0,0.38)', padding: '1px 6px', borderRadius: 3, fontFamily: 'Inter,sans-serif' }}>東 Mika · 27,400</span>
            <div style={{ display: 'flex', gap: 1 }}>{Array.from({ length: 5 }).map((_, i) => <Tile key={i} n="?" size="xs" fd />)}</div>
            <div style={{ display: 'flex', gap: 1 }}>{['E','9p','2s'].map((t, i) => <Tile key={i} n={t} size="xs" />)}</div>
          </div>
        </div>
      </div>

      {/* Score strip */}
      <div style={{ background: L.indigoMid, padding: '4px 16px', display: 'flex', justifyContent: 'space-between', flexShrink: 0, borderTop: `0.5px solid rgba(255,255,255,0.06)` }}>
        {[{n:'AI',s:'28.4k',c:L.mint},{n:'Sora',s:'24.2k',c:C.ivoryMuted},{n:'Mika',s:'27.4k',c:C.ivoryMuted},{n:'You',s:'20.0k',c:L.copper}].map(p => (
          <div key={p.n} style={{ textAlign: 'center' }}>
            <span style={{ color: p.c, fontSize: 8, display: 'block', opacity: 0.75, fontFamily: 'Inter,sans-serif' }}>{p.n}</span>
            <span style={{ color: p.c, fontSize: 10, fontWeight: 700, fontFamily: 'JetBrains Mono,monospace' }}>{p.s}</span>
          </div>
        ))}
      </div>

      {/* Player seat + why button */}
      <div style={{ background: L.indigoMid, padding: '5px 16px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `0.5px solid ${L.mintBorder}` }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ color: L.mint, fontSize: 11, fontFamily: 'Noto Serif JP,serif', fontWeight: 700 }}>南家</span>
          <span style={{ color: C.ivory, fontSize: 11, fontWeight: 600, fontFamily: 'Inter,sans-serif' }}>You</span>
        </div>
        <button onClick={() => setShowWhy(true)} style={{ padding: '4px 11px', borderRadius: 9, cursor: 'pointer', background: L.copperGlass, border: `1px solid ${L.copperBorder}` }}>
          <span style={{ color: L.copper, fontSize: 10, fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>Why did they do that? →</span>
        </button>
      </div>

      {/* Hand */}
      <div style={{ background: '#06080E', padding: '12px 8px 3px', flexShrink: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 2 }}>
        {hand.map((t, i) => <Tile key={i} n={t} size="sm" sel={selIdx === i} onClick={() => setSelIdx(selIdx === i ? null : i)} />)}
        <div style={{ width: 8 }} />
        <Tile n={drawTile} size="sm" sel={selIdx === hand.length} onClick={() => setSelIdx(selIdx === hand.length ? null : hand.length)} />
      </div>
      <div style={{ background: '#06080E', padding: '2px 0 6px', textAlign: 'center' }}>
        <span style={{ color: C.ivoryMuted, fontSize: 9, fontFamily: 'Inter,sans-serif' }}>Tap to select · AI Lab match active</span>
      </div>

      {/* Actions */}
      <div style={{ background: 'rgba(5,6,14,0.99)', padding: '8px 12px', flexShrink: 0, borderTop: `0.5px solid ${L.mintBorder}` }}>
        <div style={{ display: 'flex', gap: 5 }}>
          {[
            { label: 'Discard', primary: true, active: selIdx !== null, cb: () => setSelIdx(null) },
            { label: 'Riichi', active: true, cb: () => {} },
            { label: 'Chi', active: false, cb: () => {} },
            { label: 'Pon', active: false, cb: () => {} },
            { label: 'Skip', active: true, cb: () => {} },
          ].map(a => (
            <button key={a.label} onClick={a.cb} style={{
              flex: 1, padding: '8px 2px', borderRadius: 10, cursor: a.active ? 'pointer' : 'default',
              background: a.primary && a.active ? `linear-gradient(135deg,${L.mint},#2AC890)` : C.glass,
              border: `1px solid ${a.primary && a.active ? 'transparent' : a.active ? C.glassBorder : 'rgba(255,255,255,0.03)'}`,
              opacity: a.active ? 1 : 0.3,
            }}>
              <span style={{ fontSize: 10, fontFamily: 'Inter,sans-serif', fontWeight: 600, color: a.primary && a.active ? L.indigo : a.active ? C.ivory : C.ivoryMuted }}>{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* "Why?" explanation panel */}
      {showWhy && (
        <>
          <div onClick={() => setShowWhy(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 20 }} />
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 21,
            background: `linear-gradient(180deg,${L.indigoMid},${L.indigo})`,
            borderTop: `1px solid ${L.mintBorder}`, borderRadius: '18px 18px 0 0',
            boxShadow: '0 -8px 40px rgba(0,0,0,0.7)', padding: '14px 18px 28px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: L.mintGlass, border: `1px solid ${L.mintBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: L.mint, fontSize: 13, fontFamily: 'Noto Serif JP,serif', fontWeight: 700 }}>攻</span>
                </div>
                <span style={{ color: C.ivory, fontSize: 14, fontWeight: 700, fontFamily: 'Noto Serif JP,serif' }}>The Chaser discarded North Wind</span>
              </div>
              <button onClick={() => setShowWhy(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.ivoryMuted, fontSize: 20, padding: 0, lineHeight: 1 }}>×</button>
            </div>
            <div style={{ padding: '11px 13px', borderRadius: 13, background: L.mintGlass, border: `1px solid ${L.mintBorder}`, marginBottom: 11 }}>
              <span style={{ color: L.mint, fontSize: 10, fontFamily: 'Inter,sans-serif', fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>Current objective</span>
              <p style={{ color: C.ivoryDim, fontSize: 12, fontFamily: 'Inter,sans-serif', lineHeight: 1.65, margin: 0 }}>
                The AI is prioritising speed because it is behind by 4,000 points. It discarded North Wind to remove a low-value honour tile and reach tenpai faster — estimated in 1–2 more draws.
              </p>
            </div>
            {[
              { label: 'Strategy mode', val: 'Aggressive (speed prioritised)' },
              { label: 'Points behind', val: '−4,000 from 2nd place' },
              { label: 'Est. tenpai distance', val: '1–2 draws' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
                <span style={{ color: C.ivoryMuted, fontSize: 11, fontFamily: 'Inter,sans-serif' }}>{row.label}</span>
                <span style={{ color: C.ivoryDim, fontSize: 11, fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>{row.val}</span>
              </div>
            ))}
            <p style={{ color: C.ivoryMuted, fontSize: 10, fontFamily: 'Inter,sans-serif', lineHeight: 1.6, margin: '12px 0 0' }}>
              This explains the AI's visible behaviour and known game state only. Hidden tile information is never revealed.
            </p>
          </div>
        </>
      )}
    </div>
  )
}

function LabExperiment({ onNav }: { onNav: (s: Screen) => void }) {
  const [sel, setSel] = useState<number | null>(null)
  const scenarios = [
    { title: 'Early-hand decision', obj: 'Choose the right discard in the first 4 turns', skill: 'Hand shaping', dur: '~5 min', icon: '◈', col: L.mint },
    { title: 'Late-hand pressure', obj: 'Decide whether to push or fold in turns 15–18', skill: 'Risk judgement', dur: '~7 min', icon: '⚡', col: K.coral },
    { title: 'Defending against riichi', obj: 'Safely discard tiles while an opponent is in riichi', skill: 'Defense', dur: '~6 min', icon: '▣', col: '#5CB85C' },
    { title: 'Chasing a low-value win', obj: 'Decide if a quick cheap win is worth pursuing', skill: 'Score awareness', dur: '~5 min', icon: '◎', col: L.copper },
    { title: 'Deciding whether to call', obj: 'Evaluate chi and pon options at key moments', skill: 'Meld timing', dur: '~6 min', icon: '↻', col: C.brassBright },
    { title: 'Protecting a lead', obj: 'Stay in first place during the final round', skill: 'Score management', dur: '~8 min', icon: '☆', col: '#9088D8' },
  ]
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 0', background: L.indigo }}>
      <h1 style={{ color: C.ivory, fontSize: 20, fontWeight: 700, fontFamily: 'Noto Serif JP,serif', marginBottom: 5 }}>Strategy Experiments</h1>
      <p style={{ color: C.ivoryMuted, fontSize: 12, fontFamily: 'Inter,sans-serif', lineHeight: 1.6, marginBottom: 14 }}>Each experiment focuses on one specific decision type. Choose a scenario to begin.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
        {scenarios.map((s, i) => (
          <button key={i} onClick={() => setSel(sel === i ? null : i)} style={{
            padding: '13px 11px', borderRadius: 15, cursor: 'pointer', textAlign: 'left',
            background: sel === i ? `${s.col}14` : L.indigoMid,
            border: `1px solid ${sel === i ? s.col : 'rgba(255,255,255,0.07)'}`,
          }}>
            <span style={{ fontSize: 18, display: 'block', marginBottom: 6 }}>{s.icon}</span>
            <span style={{ color: C.ivory, fontSize: 11, fontWeight: 600, fontFamily: 'Inter,sans-serif', display: 'block', marginBottom: 3, lineHeight: 1.35 }}>{s.title}</span>
            <span style={{ color: s.col, fontSize: 9, fontFamily: 'Inter,sans-serif', fontWeight: 700 }}>{s.skill}</span>
          </button>
        ))}
      </div>
      {sel !== null && (
        <div style={{ padding: '13px 15px', borderRadius: 16, background: L.indigoMid, border: `1px solid ${scenarios[sel].col}`, marginBottom: 16 }}>
          <span style={{ color: C.ivory, fontSize: 14, fontWeight: 700, fontFamily: 'Inter,sans-serif', display: 'block', marginBottom: 8 }}>{scenarios[sel].title}</span>
          {[
            { k: 'Scenario objective', v: scenarios[sel].obj },
            { k: 'Target skill', v: scenarios[sel].skill },
            { k: 'Estimated duration', v: scenarios[sel].dur },
          ].map(row => (
            <div key={row.k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: C.ivoryMuted, fontSize: 11, fontFamily: 'Inter,sans-serif' }}>{row.k}</span>
              <span style={{ color: C.ivoryDim, fontSize: 11, fontFamily: 'Inter,sans-serif', fontWeight: 600, textAlign: 'right', maxWidth: '58%' }}>{row.v}</span>
            </div>
          ))}
          <button onClick={() => onNav('lab-match')} style={{ width: '100%', marginTop: 10, padding: '11px', borderRadius: 12, cursor: 'pointer', background: `linear-gradient(135deg,${L.mint},#2AC890)`, border: 'none' }}>
            <span style={{ color: L.indigo, fontSize: 13, fontWeight: 700, fontFamily: 'Inter,sans-serif' }}>Start experiment</span>
          </button>
        </div>
      )}
    </div>
  )
}

function LabCompare({ onNav: _onNav }: { onNav: (s: Screen) => void }) {
  const profiles = [
    {
      name: 'Aggressive', tile: '9m', col: K.coral,
      reason: "9-Man is a terminal with low sequence potential. Discards it fast to reach tenpai before opponents — prioritises speed over value.",
      risk: 'Medium', obj: 'Reach tenpai within 2 draws regardless of hand value.',
    },
    {
      name: 'Balanced', tile: 'E', col: L.copper,
      reason: "East Wind has no sequence potential. Keeps the floating pair and assesses the next draw before committing.",
      risk: 'Low', obj: 'Maintain hand quality while reducing wait complexity.',
    },
    {
      name: 'Defensive', tile: 'E', col: '#5CB85C',
      reason: "East Wind rarely causes deal-ins against typical waits. Safest discard given the visible opponent discard history.",
      risk: 'Very low', obj: 'Minimise deal-in risk above all other considerations.',
    },
    {
      name: 'Human-Like', tile: '9m', col: L.mint,
      reason: "Most players discard floating terminals early. This mirrors a common, understandable heuristic rather than a numerically optimal choice.",
      risk: 'Medium', obj: 'Play moves that feel natural and are easy to explain.',
    },
  ]
  const rc = (r: string) => r === 'Very low' ? '#5CB85C' : r === 'Low' ? L.copper : K.coral
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 0', background: L.indigo }}>
      <h1 style={{ color: C.ivory, fontSize: 20, fontWeight: 700, fontFamily: 'Noto Serif JP,serif', marginBottom: 5 }}>Compare AI Styles</h1>
      <p style={{ color: C.ivoryMuted, fontSize: 12, fontFamily: 'Inter,sans-serif', lineHeight: 1.6, marginBottom: 12 }}>The same hand and decision evaluated by four different AI policies.</p>
      <div style={{ padding: '9px 13px', borderRadius: 12, background: L.mintGlass, border: `1px solid ${L.mintBorder}`, marginBottom: 12 }}>
        <span style={{ color: L.mint, fontSize: 11, fontFamily: 'Inter,sans-serif', fontWeight: 600, fontStyle: 'italic' }}>"Different policies can choose different reasonable moves — there is often no single correct answer."</span>
      </div>
      <div style={{ padding: '7px 12px', borderRadius: 11, background: L.indigoMid, border: `1px solid rgba(255,255,255,0.07)`, marginBottom: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ color: C.ivoryMuted, fontSize: 10, fontFamily: 'Inter,sans-serif', flexShrink: 0 }}>Hand:</span>
        <div style={{ display: 'flex', gap: 1 }}>{['3m','4m','5m','5p','6p','7p','2s','3s','4s','E','E','9m'].map((t, i) => <Tile key={i} n={t} size="xs" />)}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
        {profiles.map(p => (
          <div key={p.name} style={{ padding: '12px 13px', borderRadius: 15, background: L.indigoMid, border: `1px solid ${p.col}28` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 9, fontFamily: 'Inter,sans-serif', fontWeight: 700, color: p.col, background: `${p.col}18`, padding: '2px 8px', borderRadius: 6, border: `1px solid ${p.col}38` }}>{p.name.toUpperCase()}</span>
              <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                <span style={{ color: C.ivoryMuted, fontSize: 9, fontFamily: 'Inter,sans-serif' }}>Discard</span>
                <Tile n={p.tile} size="xs" />
              </div>
            </div>
            <p style={{ color: C.ivoryDim, fontSize: 11, fontFamily: 'Inter,sans-serif', lineHeight: 1.65, margin: '0 0 8px', fontStyle: 'italic' }}>"{p.reason}"</p>
            <div style={{ display: 'flex', gap: 5 }}>
              <div style={{ flex: 1, padding: '5px 7px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: `1px solid rgba(255,255,255,0.07)` }}>
                <span style={{ color: C.ivoryMuted, fontSize: 8, fontFamily: 'Inter,sans-serif', display: 'block' }}>Risk</span>
                <span style={{ color: rc(p.risk), fontSize: 10, fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>{p.risk}</span>
              </div>
              <div style={{ flex: 2, padding: '5px 7px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: `1px solid rgba(255,255,255,0.07)` }}>
                <span style={{ color: C.ivoryMuted, fontSize: 8, fontFamily: 'Inter,sans-serif', display: 'block' }}>Objective</span>
                <span style={{ color: C.ivoryDim, fontSize: 10, fontFamily: 'Inter,sans-serif', lineHeight: 1.4 }}>{p.obj}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function LabResults({ onNav }: { onNav: (s: Screen) => void }) {
  const skills = [
    { name: 'Attack Timing', pct: 68, delta: +8, col: K.coral },
    { name: 'Defense', pct: 74, delta: +3, col: '#5CB85C' },
    { name: 'Hand Efficiency', pct: 61, delta: +12, col: L.mint },
    { name: 'Score Awareness', pct: 55, delta: -2, col: L.copper },
    { name: 'Reading Opponents', pct: 48, delta: +6, col: C.brassBright },
  ]
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 0', background: L.indigo }}>
      <div style={{ marginBottom: 14 }}>
        <h1 style={{ color: C.ivory, fontSize: 20, fontWeight: 700, fontFamily: 'Noto Serif JP,serif', marginBottom: 3 }}>Training Results</h1>
        <span style={{ color: C.ivoryMuted, fontSize: 11, fontFamily: 'Inter,sans-serif' }}>Session 3 · 3 matches vs The Chaser</span>
      </div>
      <div style={{ display: 'flex', gap: 7, marginBottom: 14 }}>
        {[{l:'Matches',v:'3'},{l:'Avg score',v:'+5.8 pts'},{l:'Deal-ins',v:'1'},{l:'Win rate',v:'2/3'}].map(s => (
          <div key={s.l} style={{ flex: 1, padding: '8px 5px', borderRadius: 12, background: L.indigoMid, border: `1px solid rgba(255,255,255,0.07)`, textAlign: 'center' }}>
            <span style={{ color: C.ivory, fontSize: 12, fontWeight: 700, fontFamily: 'JetBrains Mono,monospace', display: 'block' }}>{s.v}</span>
            <span style={{ color: C.ivoryMuted, fontSize: 8, fontFamily: 'Inter,sans-serif' }}>{s.l}</span>
          </div>
        ))}
      </div>
      <span style={{ color: C.ivory, fontSize: 13, fontWeight: 600, fontFamily: 'Noto Serif JP,serif', display: 'block', marginBottom: 11 }}>Improvement by skill</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 12 }}>
        {skills.map(s => (
          <div key={s.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ color: C.ivoryDim, fontSize: 12, fontFamily: 'Inter,sans-serif', fontWeight: 500 }}>{s.name}</span>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ color: s.delta > 0 ? '#5CB85C' : K.coral, fontSize: 10, fontFamily: 'JetBrains Mono,monospace', fontWeight: 700 }}>{s.delta > 0 ? '+' : ''}{s.delta}</span>
                <span style={{ color: C.ivory, fontSize: 11, fontFamily: 'JetBrains Mono,monospace', fontWeight: 700 }}>{s.pct}%</span>
              </div>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${s.pct}%`, height: '100%', background: s.col, borderRadius: 3 }} />
            </div>
          </div>
        ))}
      </div>
      <p style={{ color: C.ivoryMuted, fontSize: 10, fontFamily: 'Inter,sans-serif', lineHeight: 1.6, marginBottom: 13 }}>
        Skill scores track improvement across sessions, not a fixed ranking. They guide practice — not compare you against other players.
      </p>
      {/* Next challenge */}
      <div style={{ padding: '12px 14px', borderRadius: 16, background: L.indigoMid, border: `1px solid ${L.mintBorder}`, marginBottom: 12 }}>
        <span style={{ color: L.mint, fontSize: 10, fontFamily: 'Inter,sans-serif', fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>Next best challenge</span>
        <span style={{ color: C.ivory, fontSize: 13, fontWeight: 600, fontFamily: 'Inter,sans-serif', display: 'block', marginBottom: 4 }}>Reading Opponents — try The Opportunist</span>
        <p style={{ color: C.ivoryDim, fontSize: 11, fontFamily: 'Inter,sans-serif', lineHeight: 1.6, margin: '0 0 10px' }}>
          Your lowest-scored area. The Opportunist changes strategy mid-game — ideal for practising how to read opponent intent.
        </p>
        <button onClick={() => onNav('lab-library')} style={{ width: '100%', padding: '10px', borderRadius: 12, cursor: 'pointer', background: `linear-gradient(135deg,${L.mint},#2AC890)`, border: 'none' }}>
          <span style={{ color: L.indigo, fontSize: 13, fontWeight: 700, fontFamily: 'Inter,sans-serif' }}>Try The Opportunist</span>
        </button>
      </div>
      <div style={{ display: 'flex', gap: 7, marginBottom: 20 }}>
        <button onClick={() => onNav('lab-match')} style={{ flex: 1, padding: '10px', borderRadius: 12, cursor: 'pointer', background: L.indigoMid, border: `1px solid rgba(255,255,255,0.08)` }}>
          <span style={{ color: C.ivoryDim, fontSize: 10, fontFamily: 'Inter,sans-serif', lineHeight: 1.35, display: 'block' }}>Rematch with adjustment</span>
        </button>
        <button onClick={() => onNav('lab-library')} style={{ flex: 1, padding: '10px', borderRadius: 12, cursor: 'pointer', background: L.indigoMid, border: `1px solid rgba(255,255,255,0.08)` }}>
          <span style={{ color: C.ivoryDim, fontSize: 10, fontFamily: 'Inter,sans-serif', lineHeight: 1.35, display: 'block' }}>Try another style</span>
        </button>
        <button onClick={() => onNav('lab-compare')} style={{ flex: 1, padding: '10px', borderRadius: 12, cursor: 'pointer', background: L.indigoMid, border: `1px solid rgba(255,255,255,0.08)` }}>
          <span style={{ color: C.ivoryDim, fontSize: 10, fontFamily: 'Inter,sans-serif', lineHeight: 1.35, display: 'block' }}>Review key decisions</span>
        </button>
      </div>
    </div>
  )
}

function LabEthics() {
  const [st, setSt] = useState({ highContrast: false, largerTiles: false, reducedMotion: false, simplified: false, haptics: true, voice: false })
  const [delay, setDelay] = useState(40)
  const [hints, setHints] = useState(50)
  const [visible, setVisible] = useState(70)
  const tog = (k: keyof typeof st) => setSt(s => ({ ...s, [k]: !s[k] }))

  const principles = [
    { title: 'The opponent is fully configurable', col: L.mint, body: "Difficulty is not hidden or automatic. You control the AI's aggression, patience, and adaptation speed. The goal is to challenge specific decisions, not to overwhelm you." },
    { title: 'Speed is never the difficulty lever', col: L.copper, body: "AI opponents do not win by reacting faster than a human can. Every difficulty setting affects strategy and hand quality, not reaction time. A harder opponent makes better decisions — not faster ones." },
    { title: 'No "perfect" or "genius" claims', col: '#5CB85C', body: "No AI in this lab is described as unbeatable or perfect. These labels are misleading — every policy makes tradeoffs. The Human-Like profile intentionally makes understandable, moderate choices." },
    { title: 'Skill progress, not a single rating', col: C.brassBright, body: "Results are broken into skill categories. There is no single hidden rating number. You are tracked across specific areas so you know exactly what to practise." },
  ]

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 0', background: L.indigo }}>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ color: C.ivory, fontSize: 20, fontWeight: 700, fontFamily: 'Noto Serif JP,serif', marginBottom: 6 }}>AI Ethics & Transparency</h1>
        <p style={{ color: C.ivoryMuted, fontSize: 12, fontFamily: 'Inter,sans-serif', lineHeight: 1.65, margin: 0 }}>How the AI Lab operates, what we aim for, and how to customise the experience.</p>
      </div>
      {principles.map(card => (
        <div key={card.title} style={{ padding: '12px 14px', borderRadius: 15, background: L.indigoMid, border: `1px solid rgba(255,255,255,0.07)`, marginBottom: 8 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: 3, background: card.col, flexShrink: 0, marginTop: 5 }} />
            <span style={{ color: C.ivory, fontSize: 12, fontWeight: 600, fontFamily: 'Inter,sans-serif', lineHeight: 1.4 }}>{card.title}</span>
          </div>
          <p style={{ color: C.ivoryDim, fontSize: 11, fontFamily: 'Inter,sans-serif', lineHeight: 1.65, margin: '0 0 0 14px' }}>{card.body}</p>
        </div>
      ))}

      <span style={{ color: C.ivory, fontSize: 13, fontWeight: 600, fontFamily: 'Noto Serif JP,serif', display: 'block', marginBottom: 10, marginTop: 8 }}>AI behaviour controls</span>
      <div style={{ padding: '14px 15px', borderRadius: 16, background: L.indigoMid, border: `1px solid rgba(255,255,255,0.07)`, marginBottom: 14 }}>
        <LabSlider val={delay} label="Reaction delay" note="(0 = instant · 100 = deliberate)" onChange={setDelay} />
        <LabSlider val={hints} label="Hint frequency" note="(0 = none · 100 = often)" onChange={setHints} />
        <LabSlider val={visible} label="Visible explanations" note="(0 = silent · 100 = explains everything)" onChange={setVisible} />
      </div>

      <span style={{ color: C.ivory, fontSize: 13, fontWeight: 600, fontFamily: 'Noto Serif JP,serif', display: 'block', marginBottom: 10 }}>Accessibility</span>
      <SettingRow label="High contrast mode" desc="Increases tile edge contrast for easier reading" val={st.highContrast} onToggle={() => tog('highContrast')} />
      <SettingRow label="Larger tiles" desc="Increases all tile sizes across the board" val={st.largerTiles} onToggle={() => tog('largerTiles')} />
      <SettingRow label="Reduced motion" desc="Disables transitions and animated elements" val={st.reducedMotion} onToggle={() => tog('reducedMotion')} />
      <SettingRow label="Simplified language" desc="Uses everyday words instead of Mahjong terminology" val={st.simplified} onToggle={() => tog('simplified')} />
      <SettingRow label="Haptic feedback" desc="Vibrates on important AI events" val={st.haptics} onToggle={() => tog('haptics')} />
      <SettingRow label="Voice explanations" desc="Reads AI explanations aloud" val={st.voice} onToggle={() => tog('voice')} />
      <div style={{ height: 20 }} />
    </div>
  )
}

/* ─── APP ─── */
export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [activeTab, setActiveTab] = useState('home')
  const [appMode, setAppMode] = useState<'arena' | 'journey' | 'copilot' | 'lab'>('arena')
  const [journeyOnboarded, setJourneyOnboarded] = useState(false)
  const [copilotOnboarded, setCopilotOnboarded] = useState(false)

  const nav = (s: Screen) => {
    setScreen(s)
    if (['home', 'arena', 'review', 'learn', 'profile'].includes(s)) setActiveTab(s)
  }

  const switchMode = (mode: 'arena' | 'journey' | 'copilot' | 'lab') => {
    setAppMode(mode)
    if (mode === 'journey') nav(journeyOnboarded ? 'journey-home' : 'journey-onboard')
    else if (mode === 'copilot') nav(copilotOnboarded ? 'copilot-table' : 'copilot-setup')
    else if (mode === 'lab') nav('lab-home')
    else nav('home')
  }

  const journeyScreens = ['journey-home', 'journey-table', 'journey-friends', 'journey-learn', 'journey-profile', 'journey-game', 'journey-result', 'journey-onboard']
  const copilotScreens = ['copilot-setup', 'copilot-table', 'copilot-review', 'copilot-settings']
  const labScreens = ['lab-home', 'lab-library', 'lab-builder', 'lab-memory', 'lab-match', 'lab-experiment', 'lab-compare', 'lab-results', 'lab-ethics']
  const hideNav = ['game', 'journey-onboard', 'journey-game', 'copilot-setup', 'copilot-table', 'lab-match'].includes(screen)
  const isJourney = journeyScreens.includes(screen)
  const isCopilot = copilotScreens.includes(screen)
  const isLab = labScreens.includes(screen)

  const renderScreen = () => {
    switch (screen) {
      case 'home': return <HomeScreen onNav={nav} appMode={appMode} onSwitchMode={switchMode} />
      case 'arena': return <ArenaScreen onNav={nav} />
      case 'game': return <GameScreen onNav={nav} />
      case 'result': return <ResultScreen onNav={nav} />
      case 'profile': return <ProfileScreen />
      case 'review': return <SenseiDashboard onNav={nav} />
      case 'import-game': return <ImportGameScreen onNav={nav} />
      case 'review-overview': return <ReviewOverviewScreen onNav={nav} />
      case 'decision-moment': return <DecisionMomentScreen onNav={nav} />
      case 'learn': return <TrainingPlanScreen onNav={nav} />
      case 'practice-drill': return <PracticeDrillScreen onNav={nav} />
      case 'journey-onboard': return <JourneyOnboard onComplete={() => { setJourneyOnboarded(true); nav('journey-home') }} />
      case 'journey-home': return <JourneyHome onNav={nav} appMode={appMode} onSwitchMode={switchMode} />
      case 'journey-table': return <JourneyTableSelect onNav={nav} />
      case 'journey-game': return <JourneyGame onNav={nav} />
      case 'journey-learn': return <JourneyLearn onNav={nav} />
      case 'journey-result': return <JourneyResult onNav={nav} />
      case 'journey-friends': return <JourneyFriends onNav={nav} />
      case 'journey-profile': return <JourneyProfile />
      case 'copilot-setup': return <CopilotSetup onComplete={() => { setCopilotOnboarded(true); nav('copilot-table') }} />
      case 'copilot-table': return <CopilotTable onNav={nav} />
      case 'copilot-review': return <CopilotReview onNav={nav} />
      case 'copilot-settings': return <CopilotSettings />
      case 'lab-home': return <LabHome onNav={nav} appMode={appMode} onSwitchMode={switchMode} />
      case 'lab-library': return <LabLibrary onNav={nav} />
      case 'lab-builder': return <LabBuilder onNav={nav} />
      case 'lab-memory': return <LabMemory onNav={nav} />
      case 'lab-match': return <LabMatch onNav={nav} />
      case 'lab-experiment': return <LabExperiment onNav={nav} />
      case 'lab-compare': return <LabCompare onNav={nav} />
      case 'lab-results': return <LabResults onNav={nav} />
      case 'lab-ethics': return <LabEthics />
      default: return <HomeScreen onNav={nav} appMode={appMode} onSwitchMode={switchMode} />
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#030508 0%,#06091A 50%,#030508 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px 0',
    }}>
      <div style={{
        width: 390, height: 844,
        background: C.ink,
        borderRadius: 50,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 50px 100px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.07), inset 0 0 0 1px rgba(255,255,255,0.02)',
      }}>
        <StatusBar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', paddingBottom: hideNav ? 0 : 83 }}>
          {renderScreen()}
        </div>
        {!hideNav && (isLab
          ? <LabNav active={screen} onNav={(t) => nav(t as Screen)} />
          : isCopilot
            ? <CopilotNav active={screen} onNav={(t) => nav(t as Screen)} />
            : isJourney
              ? <JourneyNav active={screen} onNav={(t) => nav(t as Screen)} />
              : <BottomNav active={activeTab} onNav={(t) => nav(t as Screen)} />
        )}
      </div>
    </div>
  )
}
