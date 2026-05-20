// Component artboards — buttons, inputs, cards, nav, badges, charts.

const Btn = ({ variant = 'primary', size = 'md', children, icon, iconRight, dark, disabled, full }) => {
  const heights = { sm: 36, md: 44, lg: 52 };
  const pads    = { sm: '0 14px', md: '0 20px', lg: '0 26px' };
  const fontSz  = { sm: 14, md: 15, lg: 16 };
  const styles = {
    primary:     { bg: '#0F5F5A', color: '#fff', border: 'transparent' },
    secondary:   { bg: dark ? '#16302C' : '#FFFFFF', color: dark ? '#EAF5F3' : '#0F5F5A', border: dark ? 'rgba(77,182,172,.22)' : 'rgba(15,95,90,.18)' },
    ghost:       { bg: 'transparent', color: dark ? '#4DB6AC' : '#1B736C', border: 'transparent' },
    accent:      { bg: '#FF8A6A', color: '#82291A', border: 'transparent' },
    destructive: { bg: '#C0392B', color: '#fff', border: 'transparent' },
  }[variant];
  return (
    <button disabled={disabled} style={{
      height: heights[size], padding: pads[size], fontSize: fontSz[size],
      fontFamily: 'Inter', fontWeight: 600,
      borderRadius: 14, border: `1px solid ${styles.border}`, background: styles.bg, color: styles.color,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1,
      boxShadow: variant === 'primary' || variant === 'accent' || variant === 'destructive' ? '0 1px 2px rgba(15,31,30,.10)' : 'none',
      width: full ? '100%' : 'auto',
      transition: 'all 160ms cubic-bezier(.22,1,.36,1)',
    }}>
      {icon && <Icon name={icon} size={16} />}
      {children}
      {iconRight && <Icon name={iconRight} size={16} />}
    </button>
  );
};

const Input = ({ label, value, placeholder, helper, error, focused, dark }) => (
  <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: dark ? '#EAF5F3' : '#36332B' }}>{label}</span>
    <div style={{
      height: 44, padding: '0 14px', borderRadius: 12,
      background: dark ? '#0A1816' : '#FFFFFF',
      border: `1.5px solid ${error ? '#C0392B' : focused ? '#0F5F5A' : dark ? 'rgba(77,182,172,.22)' : 'rgba(15,95,90,.18)'}`,
      boxShadow: focused ? '0 0 0 3px rgba(15,95,90,.18)' : 'none',
      display: 'flex', alignItems: 'center',
      fontFamily: 'Inter', fontSize: 15,
      color: value ? (dark ? '#EAF5F3' : '#15140C') : (dark ? '#6FB8AE' : '#9A9484'),
    }}>{value || placeholder}</div>
    {(helper || error) && <span style={{ fontFamily: 'Inter', fontSize: 12, color: error ? '#C0392B' : (dark ? '#A3D2CB' : '#6F6A5C') }}>{error || helper}</span>}
  </label>
);

const Pill = ({ children, variant = 'neutral', icon, dark }) => {
  const v = {
    neutral: { bg: dark ? 'rgba(77,182,172,.12)' : '#F2EEE5', fg: dark ? '#A3D2CB' : '#36332B' },
    teal:    { bg: dark ? 'rgba(77,182,172,.18)' : '#CFE8E4', fg: dark ? '#A3D2CB' : '#0F5F5A' },
    coral:   { bg: dark ? 'rgba(255,138,106,.18)' : '#FFDDD1', fg: dark ? '#FFA386' : '#82291A' },
    amber:   { bg: dark ? 'rgba(255,198,109,.18)' : '#FFEFC4', fg: dark ? '#FFC66D' : '#7a4f0a' },
    success: { bg: dark ? 'rgba(46,139,111,.20)' : '#DFF1E9', fg: dark ? '#5DC9A4' : '#1f6b54' },
    warning: { bg: dark ? 'rgba(217,137,44,.20)' : '#FFEFC4', fg: dark ? '#FFC66D' : '#8a5a18' },
    error:   { bg: dark ? 'rgba(192,57,43,.20)' : '#FBE3DD', fg: dark ? '#F08374' : '#8a2419' },
  }[variant];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '5px 10px', borderRadius: 999,
      background: v.bg, color: v.fg,
      fontFamily: 'Inter', fontSize: 12, fontWeight: 600, letterSpacing: '.01em',
    }}>
      {icon && <Icon name={icon} size={12} />}
      {children}
    </span>
  );
};

// Progress ring
const Ring = ({ value = 72, size = 120, stroke = 10, color = '#0F5F5A', track = '#CFE8E4', label, sublabel }) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} stroke={track} strokeWidth={stroke} fill="none"/>
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - value/100)}/>
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: size * 0.28, color: 'inherit', lineHeight: 1 }}>{label ?? `${value}%`}</div>
        {sublabel && <div style={{ fontFamily: 'Inter', fontSize: 11, color: '#6F6A5C', marginTop: 4 }}>{sublabel}</div>}
      </div>
    </div>
  );
};

// Sparkline / area for chart preview
const TrendChart = ({ dark }) => {
  const pts = [218, 215, 213, 210, 209, 206, 204, 201, 199, 196, 195, 192];
  const w = 360, h = 140, pad = 8;
  const min = 188, max = 222;
  const x = i => pad + (i * (w - pad*2)) / (pts.length - 1);
  const y = v => pad + ((max - v) / (max - min)) * (h - pad*2);
  const path = pts.map((v, i) => `${i===0?'M':'L'} ${x(i)} ${y(v)}`).join(' ');
  const area = `${path} L ${x(pts.length-1)} ${h-pad} L ${pad} ${h-pad} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 140 }}>
      <defs>
        <linearGradient id="ta" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0F5F5A" stopOpacity={dark ? 0.45 : 0.22}/>
          <stop offset="1" stopColor="#0F5F5A" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {[0, 0.33, 0.66, 1].map(t => (
        <line key={t} x1={pad} x2={w-pad} y1={pad + t*(h-pad*2)} y2={pad + t*(h-pad*2)}
          stroke={dark ? 'rgba(77,182,172,.10)' : 'rgba(15,95,90,.08)'} strokeDasharray="2 4"/>
      ))}
      <path d={area} fill="url(#ta)"/>
      <path d={path} stroke={dark ? '#4DB6AC' : '#0F5F5A'} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((v, i) => (i === pts.length - 1) && (
        <g key={i}>
          <circle cx={x(i)} cy={y(v)} r="6" fill={dark ? '#102220' : '#fff'} stroke={dark ? '#4DB6AC' : '#0F5F5A'} strokeWidth="2.5"/>
        </g>
      ))}
    </svg>
  );
};

// Metric card (large stat number)
const MetricCard = ({ label, value, unit, delta, deltaDir, icon, dark, accent = 'teal' }) => {
  const accents = {
    teal:  { bg: dark ? 'rgba(77,182,172,.12)' : '#CFE8E4', fg: '#0F5F5A' },
    coral: { bg: dark ? 'rgba(255,138,106,.18)' : '#FFDDD1', fg: '#B23D22' },
    amber: { bg: dark ? 'rgba(255,198,109,.18)' : '#FFEFC4', fg: '#8a5a18' },
  }[accent];
  return (
    <div style={{
      background: dark ? '#16302C' : '#FFFFFF', borderRadius: 20, padding: 20,
      border: `1px solid ${dark ? 'rgba(77,182,172,.12)' : 'rgba(15,95,90,.08)'}`,
      display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: dark ? '#A3D2CB' : '#6F6A5C' }}>{label}</div>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: accents.bg, color: accents.fg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={icon} size={16} />
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 38, color: dark ? '#EAF5F3' : '#0F5F5A', letterSpacing: '-0.02em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
        {unit && <div style={{ fontFamily: 'Inter', fontSize: 14, color: dark ? '#A3D2CB' : '#6F6A5C', fontWeight: 500 }}>{unit}</div>}
      </div>
      {delta && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: deltaDir === 'down' ? '#2E8B6F' : deltaDir === 'up' ? '#C0392B' : (dark ? '#A3D2CB' : '#6F6A5C') }}>
          <Icon name={deltaDir === 'down' ? 'arrowDown' : 'arrowUp'} size={12} />
          {delta}
        </div>
      )}
    </div>
  );
};

Object.assign(window, { Btn, Input, Pill, Ring, TrendChart, MetricCard });
