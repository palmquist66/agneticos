// Mobile screen mockups demonstrating the system in use.
// Wrapped in an iPhone-ish frame inline (lightweight, no external dep).

const Phone = ({ children, dark }) => (
  <div style={{
    width: 320, height: 660, borderRadius: 44,
    background: dark ? '#0D1F1E' : '#FAF8F3',
    boxShadow: dark
      ? '0 0 0 8px #0a1816, 0 0 0 9px rgba(77,182,172,.12), 0 30px 60px rgba(0,0,0,.45)'
      : '0 0 0 8px #1d2424, 0 0 0 9px rgba(0,0,0,.05), 0 30px 60px rgba(15,31,30,.18)',
    overflow: 'hidden', position: 'relative',
    fontFamily: 'Inter',
    color: dark ? '#EAF5F3' : '#15140C',
  }}>
    {/* status bar */}
    <div style={{
      height: 44, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: dark ? '#EAF5F3' : '#15140C',
    }}>
      <span>9:41</span>
      <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <span style={{ width: 16, height: 10, borderRadius: 2, border: `1.5px solid ${dark ? '#EAF5F3' : '#15140C'}`, position: 'relative' }}>
          <span style={{ position: 'absolute', inset: 1, borderRadius: 1, background: dark ? '#EAF5F3' : '#15140C', width: 9 }}/>
        </span>
      </span>
    </div>
    {/* notch */}
    <div style={{ position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', width: 100, height: 28, borderRadius: 14, background: '#0a0a0a', zIndex: 5 }}/>
    <div style={{ flex: 1, height: 'calc(100% - 44px)', overflow: 'hidden' }}>{children}</div>
  </div>
);

// HOME / DASHBOARD
const HomeScreen = ({ dark }) => (
  <Phone dark={dark}>
    <div style={{ padding: '8px 20px 100px', height: '100%', overflow: 'hidden' }}>
      {/* greeting */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <div>
          <div style={{ fontSize: 13, color: dark ? '#A3D2CB' : '#6F6A5C', fontWeight: 500 }}>Tuesday, May 5</div>
          <div style={{ fontFamily: 'Poppins', fontSize: 22, fontWeight: 600, marginTop: 2, letterSpacing: '-0.02em' }}>Good morning, Sam</div>
        </div>
        <div style={{ width: 40, height: 40, borderRadius: 999, background: dark ? '#16302C' : '#FFE19B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: dark ? '#FFC66D' : '#8a5a18', fontWeight: 700, fontSize: 14 }}>S</div>
      </div>

      {/* hero progress card */}
      <div style={{
        marginTop: 16, padding: 20, borderRadius: 24,
        background: dark ? '#16302C' : '#FFFFFF',
        border: `1px solid ${dark ? 'rgba(77,182,172,.12)' : 'rgba(15,95,90,.08)'}`,
        boxShadow: dark ? 'none' : '0 4px 12px rgba(15,31,30,.05)',
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <Ring value={68} size={92} stroke={9} color={dark ? '#4DB6AC' : '#0F5F5A'} track={dark ? 'rgba(77,182,172,.18)' : '#CFE8E4'} sublabel="of goal"/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: dark ? '#4DB6AC' : '#1B736C' }}>Week 12</div>
          <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 17, marginTop: 4, lineHeight: 1.25 }}>You're on track for 22 lbs lost.</div>
          <div style={{ fontSize: 12, color: dark ? '#A3D2CB' : '#6F6A5C', marginTop: 6 }}>Steady wins — keep going.</div>
        </div>
      </div>

      {/* metric grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
        <MiniMetric dark={dark} label="Weight" value="192.4" unit="lbs" delta="−1.2 wk" dir="down" icon="scale"/>
        <MiniMetric dark={dark} label="Next dose" value="Thu" unit="2.5mg" delta="In 2 days" dir="flat" icon="syringe" accent="coral"/>
        <MiniMetric dark={dark} label="Glucose" value="98" unit="mg/dL" delta="−4 today" dir="down" icon="droplet"/>
        <MiniMetric dark={dark} label="Streak" value="14" unit="days" delta="Keep going" dir="up" icon="flame" accent="amber"/>
      </div>

      {/* AI insight */}
      <div style={{
        marginTop: 14, padding: 16, borderRadius: 18,
        background: dark ? 'rgba(255,138,106,.10)' : '#FFF1EC',
        border: `1px solid ${dark ? 'rgba(255,138,106,.20)' : 'rgba(255,138,106,.30)'}`,
        display: 'flex', gap: 12,
      }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: dark ? 'rgba(255,138,106,.20)' : '#FFC0AB', flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#82291A' }}>
          <Icon name="sparkles" size={16}/>
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#B23D22' }}>Insight</div>
          <div style={{ fontSize: 13, marginTop: 4, lineHeight: 1.45, color: dark ? '#FFC0AB' : '#82291A', fontWeight: 500 }}>
            Your nausea fades 2 days after each dose. Light meals on Thursdays help.
          </div>
        </div>
      </div>
    </div>
    <BottomNav dark={dark} active="home"/>
  </Phone>
);

const MiniMetric = ({ label, value, unit, delta, dir, icon, dark, accent = 'teal' }) => {
  const a = {
    teal:  { bg: dark ? 'rgba(77,182,172,.14)' : '#CFE8E4', fg: '#0F5F5A' },
    coral: { bg: dark ? 'rgba(255,138,106,.18)' : '#FFDDD1', fg: '#B23D22' },
    amber: { bg: dark ? 'rgba(255,198,109,.20)' : '#FFEFC4', fg: '#8a5a18' },
  }[accent];
  const dirColor = dir === 'down' ? '#2E8B6F' : dir === 'up' ? (accent === 'coral' ? '#B23D22' : '#2E8B6F') : (dark ? '#A3D2CB' : '#6F6A5C');
  return (
    <div style={{
      padding: 14, borderRadius: 18,
      background: dark ? '#16302C' : '#FFFFFF',
      border: `1px solid ${dark ? 'rgba(77,182,172,.12)' : 'rgba(15,95,90,.06)'}`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 11, color: dark ? '#A3D2CB' : '#6F6A5C', fontWeight: 500 }}>{label}</div>
        <div style={{ width: 24, height: 24, borderRadius: 7, background: a.bg, color: a.fg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={icon} size={13}/>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 8 }}>
        <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 22, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
        {unit && <div style={{ fontSize: 11, color: dark ? '#A3D2CB' : '#6F6A5C' }}>{unit}</div>}
      </div>
      <div style={{ fontSize: 11, fontWeight: 600, color: dirColor, marginTop: 4 }}>{delta}</div>
    </div>
  );
};

const BottomNav = ({ dark, active = 'home' }) => {
  const items = [
    { k: 'home', label: 'Home', icon: 'home' },
    { k: 'log', label: 'Log', icon: 'plus' },
    { k: 'trends', label: 'Trends', icon: 'trending' },
    { k: 'me', label: 'Me', icon: 'user' },
  ];
  return (
    <div style={{
      position: 'absolute', left: 12, right: 12, bottom: 14,
      height: 64, borderRadius: 22,
      background: dark ? 'rgba(22,48,44,.92)' : 'rgba(255,255,255,.92)',
      backdropFilter: 'blur(12px)',
      border: `1px solid ${dark ? 'rgba(77,182,172,.18)' : 'rgba(15,95,90,.08)'}`,
      boxShadow: dark ? '0 12px 28px rgba(0,0,0,.5)' : '0 12px 28px rgba(15,31,30,.10)',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '0 8px',
    }}>
      {items.map(it => {
        const isActive = it.k === active;
        const isLog = it.k === 'log';
        if (isLog) return (
          <div key={it.k} style={{
            width: 48, height: 48, borderRadius: 16,
            background: '#FF8A6A', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(255,138,106,.40)',
          }}>
            <Icon name="plus" size={22} strokeWidth={2.25}/>
          </div>
        );
        return (
          <div key={it.k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, color: isActive ? (dark ? '#4DB6AC' : '#0F5F5A') : (dark ? '#6FB8AE' : '#9A9484') }}>
            <Icon name={it.icon} size={22} strokeWidth={isActive ? 2.25 : 1.75}/>
            <div style={{ fontSize: 10, fontWeight: 600 }}>{it.label}</div>
          </div>
        );
      })}
    </div>
  );
};

// WEIGHT TRENDS SCREEN
const TrendScreen = ({ dark }) => (
  <Phone dark={dark}>
    <div style={{ padding: '8px 20px 100px', height: '100%', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ width: 40, height: 40, borderRadius: 999, background: dark ? '#16302C' : '#fff', border: `1px solid ${dark ? 'rgba(77,182,172,.18)' : 'rgba(15,95,90,.10)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="chevron" size={18} style={{ transform: 'rotate(180deg)' }}/>
        </div>
        <div style={{ fontFamily: 'Poppins', fontSize: 16, fontWeight: 600 }}>Weight</div>
        <div style={{ width: 40, height: 40, borderRadius: 999, background: dark ? '#16302C' : '#fff', border: `1px solid ${dark ? 'rgba(77,182,172,.18)' : 'rgba(15,95,90,.10)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="calendar" size={16}/>
        </div>
      </div>

      <div style={{ marginTop: 20, textAlign: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: dark ? '#4DB6AC' : '#1B736C' }}>Today</div>
        <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 56, lineHeight: 1, marginTop: 8, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>
          192.4 <span style={{ fontSize: 20, fontWeight: 500, color: dark ? '#A3D2CB' : '#6F6A5C' }}>lbs</span>
        </div>
        <div style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 999, background: dark ? 'rgba(46,139,111,.20)' : '#DFF1E9', color: '#1f6b54', fontSize: 12, fontWeight: 600 }}>
          <Icon name="arrowDown" size={12}/> 21.6 lbs since start
        </div>
      </div>

      <div style={{ marginTop: 14, padding: 16, borderRadius: 18, background: dark ? '#16302C' : '#FFFFFF', border: `1px solid ${dark ? 'rgba(77,182,172,.12)' : 'rgba(15,95,90,.08)'}` }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          {['1W','1M','3M','6M','1Y'].map(t => (
            <div key={t} style={{
              flex: 1, textAlign: 'center', padding: '6px 0', borderRadius: 8,
              background: t === '3M' ? (dark ? 'rgba(77,182,172,.18)' : '#CFE8E4') : 'transparent',
              color: t === '3M' ? (dark ? '#4DB6AC' : '#0F5F5A') : (dark ? '#A3D2CB' : '#6F6A5C'),
              fontSize: 12, fontWeight: 600,
            }}>{t}</div>
          ))}
        </div>
        <TrendChart dark={dark}/>
      </div>

      {/* dose markers */}
      <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
        <Pill variant="coral" icon="syringe" dark={dark}>Dose · 2.5mg</Pill>
        <Pill variant="amber" icon="flame" dark={dark}>14 day streak</Pill>
      </div>
    </div>
    <BottomNav dark={dark} active="trends"/>
  </Phone>
);

// LOG SCREEN
const LogScreen = ({ dark }) => (
  <Phone dark={dark}>
    <div style={{ padding: '8px 20px 100px', height: '100%', overflow: 'hidden' }}>
      <div style={{ fontFamily: 'Poppins', fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>What to log?</div>
      <div style={{ fontSize: 13, color: dark ? '#A3D2CB' : '#6F6A5C', marginTop: 4 }}>Pick anything — small entries add up.</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 18 }}>
        {[
          { label: 'Weight', icon: 'scale', tint: '#CFE8E4', fg: '#0F5F5A' },
          { label: 'Dose',   icon: 'syringe', tint: '#FFDDD1', fg: '#B23D22' },
          { label: 'Meal',   icon: 'utensils', tint: '#FFEFC4', fg: '#8a5a18' },
          { label: 'Glucose',icon: 'droplet', tint: '#DDEAF5', fg: '#2C7BB2' },
          { label: 'Mood',   icon: 'heart', tint: '#E8DEF8', fg: '#5b3aa3' },
          { label: 'Symptom',icon: 'message', tint: '#CFE8E4', fg: '#0F5F5A' },
        ].map(c => (
          <div key={c.label} style={{
            padding: 18, borderRadius: 18,
            background: dark ? '#16302C' : '#FFFFFF',
            border: `1px solid ${dark ? 'rgba(77,182,172,.12)' : 'rgba(15,95,90,.06)'}`,
            display: 'flex', flexDirection: 'column', gap: 14,
          }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: dark ? 'rgba(77,182,172,.14)' : c.tint, color: c.fg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={c.icon} size={20}/>
            </div>
            <div style={{ fontFamily: 'Poppins', fontSize: 15, fontWeight: 600 }}>{c.label}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 18, fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: dark ? '#4DB6AC' : '#1B736C' }}>Recent</div>
      <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { icon: 'utensils', tint: '#FFEFC4', fg: '#8a5a18', t: 'Greek yogurt + berries', s: '7:42 am · 220 cal' },
          { icon: 'droplet', tint: '#DDEAF5', fg: '#2C7BB2', t: 'Glucose 102', s: '7:48 am · fasting' },
        ].map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 14, background: dark ? '#16302C' : '#FFFFFF', border: `1px solid ${dark ? 'rgba(77,182,172,.10)' : 'rgba(15,95,90,.06)'}` }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: dark ? 'rgba(77,182,172,.14)' : r.tint, color: r.fg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={r.icon} size={15}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{r.t}</div>
              <div style={{ fontSize: 11, color: dark ? '#A3D2CB' : '#6F6A5C' }}>{r.s}</div>
            </div>
            <Icon name="chevron" size={14} color={dark ? '#6FB8AE' : '#9A9484'}/>
          </div>
        ))}
      </div>
    </div>
    <BottomNav dark={dark} active="log"/>
  </Phone>
);

Object.assign(window, { Phone, HomeScreen, TrendScreen, LogScreen, BottomNav });
