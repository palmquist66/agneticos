// Shared primitives for the GLP-1 Companion design system canvas.
// Exported to window so other Babel scripts can use them.

const Mark = ({ size = 56 }) => (
  <img src={`assets/logo-mark.png`} alt="GLP-1 Companion mark"
    style={{ width: size, height: size, objectFit: 'contain', display: 'block' }}/>
);

const Lockup = ({ dark = false }) => (
  <img src={`assets/logo-lockup.png`} alt="GLP-1 Companion"
    style={{ height: 88, width: 'auto', objectFit: 'contain', display: 'block',
      filter: dark ? 'brightness(0) invert(1)' : 'none' }}/>
);

// Feather-style stroke icons, 24×24 grid, 1.75 stroke
const Icon = ({ name, size = 24, color = 'currentColor', strokeWidth = 1.75, ...rest }) => {
  const props = {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round',
    ...rest,
  };
  switch (name) {
    case 'home':       return <svg {...props}><path d="M3 11l9-8 9 8M5 10v10h14V10"/></svg>;
    case 'scale':      return <svg {...props}><rect x="3" y="6" width="18" height="14" rx="3"/><path d="M9 11l3-3 3 3M12 8v6"/></svg>;
    case 'pill':       return <svg {...props}><rect x="3" y="9" width="18" height="6" rx="3" transform="rotate(-30 12 12)"/><path d="M8.5 6.5l3 3" transform="rotate(-30 12 12)"/></svg>;
    case 'utensils':   return <svg {...props}><path d="M7 2v9a2 2 0 002 2v8M11 2v6M5 2v6M17 12a3 3 0 003-3V5a3 3 0 00-6 0v4a3 3 0 003 3zM17 12v9"/></svg>;
    case 'droplet':    return <svg {...props}><path d="M12 3l5 7a5 5 0 11-10 0z"/></svg>;
    case 'heart':      return <svg {...props}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>;
    case 'sparkles':   return <svg {...props}><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3zM18 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z"/></svg>;
    case 'trending':   return <svg {...props}><path d="M3 17l6-6 4 4 8-8M14 7h7v7"/></svg>;
    case 'plus':       return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
    case 'check':      return <svg {...props}><path d="M5 12l5 5L20 7"/></svg>;
    case 'x':          return <svg {...props}><path d="M6 6l12 12M18 6L6 18"/></svg>;
    case 'chevron':    return <svg {...props}><path d="M9 6l6 6-6 6"/></svg>;
    case 'bell':       return <svg {...props}><path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 004 0"/></svg>;
    case 'user':       return <svg {...props}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/></svg>;
    case 'calendar':   return <svg {...props}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>;
    case 'settings':   return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33h.01a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.01a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>;
    case 'arrowUp':    return <svg {...props}><path d="M12 19V5M5 12l7-7 7 7"/></svg>;
    case 'arrowDown':  return <svg {...props}><path d="M12 5v14M5 12l7 7 7-7"/></svg>;
    case 'arrowRight': return <svg {...props}><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
    case 'flame':      return <svg {...props}><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"/></svg>;
    case 'moon':       return <svg {...props}><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>;
    case 'sun':        return <svg {...props}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>;
    case 'syringe':    return <svg {...props}><path d="M18 2l4 4M15 5l4 4M11 9l4 4M2 22l5-5M7 17l3-3 4 4-3 3-4-4z"/></svg>;
    case 'bookmark':   return <svg {...props}><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>;
    case 'message':    return <svg {...props}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>;
    case 'mic':        return <svg {...props}><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0014 0M12 17v4"/></svg>;
    case 'camera':     return <svg {...props}><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>;
    default: return null;
  }
};

// Token cards
const SwatchCard = ({ name, value, light, big = false }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', gap: 8,
    width: big ? 160 : 120,
  }}>
    <div style={{
      width: '100%', aspectRatio: '1 / 1', borderRadius: 16,
      background: value, boxShadow: light ? 'inset 0 0 0 1px rgba(15,31,30,.06)' : 'none',
    }}/>
    <div>
      <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 13, color: '#0F5F5A', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{name}</div>
      <div style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 11, color: '#6F6A5C', marginTop: 2 }}>{value}</div>
    </div>
  </div>
);

const ScaleSwatch = ({ name, value, dark }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: '1 1 0', minWidth: 0 }}>
    <div style={{ width: '100%', height: 64, borderRadius: 10, background: value, boxShadow: 'inset 0 0 0 1px rgba(15,31,30,.04)' }}/>
    <div style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 600, color: dark ? '#EAF5F3' : '#36332B' }}>{name}</div>
    <div style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 10, color: dark ? '#A3D2CB' : '#6F6A5C' }}>{value}</div>
  </div>
);

// Section heading
const SectionHead = ({ eyebrow, title, blurb }) => (
  <div style={{ marginBottom: 32, maxWidth: 720 }}>
    <div style={{ fontFamily: 'Poppins', fontSize: 12, fontWeight: 600, color: '#1B736C', letterSpacing: '0.16em', textTransform: 'uppercase' }}>{eyebrow}</div>
    <h2 style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 36, color: '#0F5F5A', marginTop: 8, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{title}</h2>
    {blurb && <p style={{ fontFamily: 'Inter', fontSize: 16, color: '#4F4B40', marginTop: 12, lineHeight: 1.6, maxWidth: 580 }}>{blurb}</p>}
  </div>
);

// Card frame inside an artboard
const Frame = ({ title, subtitle, children, dark = false, padded = true }) => (
  <div style={{
    background: dark ? '#102220' : '#FFFFFF',
    borderRadius: 20,
    border: dark ? '1px solid rgba(77,182,172,.12)' : '1px solid rgba(15,95,90,.08)',
    boxShadow: dark ? '0 4px 12px rgba(0,0,0,.40)' : '0 4px 12px rgba(15,31,30,.06)',
    padding: padded ? 28 : 0,
    height: '100%',
    display: 'flex', flexDirection: 'column',
  }}>
    {title && (
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: 'Poppins', fontSize: 11, fontWeight: 600, color: dark ? '#4DB6AC' : '#1B736C', letterSpacing: '0.16em', textTransform: 'uppercase' }}>{title}</div>
        {subtitle && <div style={{ fontFamily: 'Inter', fontSize: 13, color: dark ? '#A3D2CB' : '#6F6A5C', marginTop: 6 }}>{subtitle}</div>}
      </div>
    )}
    <div style={{ flex: 1 }}>{children}</div>
  </div>
);

Object.assign(window, { Mark, Lockup, Icon, SwatchCard, ScaleSwatch, SectionHead, Frame });
