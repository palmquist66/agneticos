// Main showcase: composes the design system across multiple sections on a design canvas.

const { useState } = React;

// ─── BRAND / IDENTITY ────────────────────────────────────────────
const BrandArtboard = () => (
  <div style={{ padding: 56, height: '100%', display: 'flex', flexDirection: 'column', gap: 40, background: '#FAF8F3' }}>
    <SectionHead
      eyebrow="01 — Brand"
      title="A supportive coach, not a clinic."
      blurb="GLP-1 Companion is for people doing one of the hardest things you can do for your body. The brand has to feel like a friend who's rooting for you — warm, honest, never sterile or stigmatizing."
    />

    <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 32 }}>
      {/* Lockup */}
      <Frame title="Logo lockup" subtitle="Mark + wordmark. Use mark alone at small sizes (≤32px).">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <Lockup/>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <Mark size={64}/>
            <Mark size={40}/>
            <Mark size={28}/>
            <Mark size={20}/>
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ width: 88, height: 88, borderRadius: 22, background: '#FFFFFF', boxShadow: '0 4px 12px rgba(15,31,30,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mark size={56}/>
            </div>
            <div style={{ width: 88, height: 88, borderRadius: 22, background: '#0D1F1E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mark size={56}/>
            </div>
            <div style={{ width: 88, height: 88, borderRadius: 22, background: 'var(--gradient-warm, linear-gradient(135deg,#FFC66D,#FF8A6A))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mark size={56}/>
            </div>
            <div style={{ fontSize: 12, color: '#6F6A5C', fontFamily: 'Inter', maxWidth: 140 }}>
              App icon variants — light, dark, warm. Always show the mark on a solid surface; never on imagery.
            </div>
          </div>
        </div>
      </Frame>

      {/* Voice & values */}
      <Frame title="Voice" subtitle="How we sound.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {[
            { w: 'Supportive', s: 'We celebrate small wins. We never shame setbacks.' },
            { w: 'Honest',     s: 'Plain language. We never hide what GLP-1 is or how it works.' },
            { w: 'Curious',    s: 'Your data tells a story. We help you read it.' },
            { w: 'Calm',       s: 'Health is anxious enough. We bring the temperature down.' },
          ].map(v => (
            <div key={v.w} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 8, height: 8, borderRadius: 999, background: '#FF8A6A', marginTop: 8, flex: '0 0 auto' }}/>
              <div>
                <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 15, color: '#0F5F5A' }}>{v.w}</div>
                <div style={{ fontFamily: 'Inter', fontSize: 14, color: '#4F4B40', marginTop: 2 }}>{v.s}</div>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 8, padding: 16, borderRadius: 14, background: '#FFF1EC', border: '1px solid rgba(255,138,106,.25)' }}>
            <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 13, color: '#B23D22' }}>Say this</div>
            <div style={{ fontFamily: 'Inter', fontSize: 14, color: '#82291A', marginTop: 4 }}>"You're 12 weeks in. That's farther than most people get."</div>
            <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 13, color: '#6F6A5C', marginTop: 12 }}>Not this</div>
            <div style={{ fontFamily: 'Inter', fontSize: 14, color: '#6F6A5C', marginTop: 4 }}>"You've achieved 23% of your weight loss target."</div>
          </div>
        </div>
      </Frame>
    </div>

    {/* Brand attributes strip */}
    <div style={{
      borderRadius: 24, padding: 32, color: '#fff',
      background: 'linear-gradient(120deg, #0F5F5A 0%, #1B736C 50%, #2C8C84 100%)',
      display: 'flex', flexDirection: 'column', gap: 24,
    }}>
      <div>
        <div style={{ fontFamily: 'Poppins', fontSize: 12, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#A3D2CB' }}>The promise</div>
        <div style={{ fontFamily: 'Poppins', fontSize: 32, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 10, lineHeight: 1.15, maxWidth: 760 }}>
          Every step forward counts. We're with you for all of them.
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {['Track', 'Nourish', 'See progress', 'Feel supported', 'Keep going'].map(t => (
          <div key={t} style={{ fontFamily: 'Poppins', fontSize: 14, fontWeight: 500, padding: '10px 18px', borderRadius: 999, background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.20)' }}>{t}</div>
        ))}
      </div>
    </div>
  </div>
);

// ─── COLOR ───────────────────────────────────────────────────────
const ColorArtboard = () => {
  const teal = ['50','100','200','300','400','500','600','700','800','900','950'];
  const tealVals = ['#EAF5F3','#CFE8E4','#A3D2CB','#6FB8AE','#4DB6AC','#2C8C84','#1B736C','#0F5F5A','#0B4744','#07302E','#041917'];
  const coral = ['50','100','200','300','400','500','600','700','800'];
  const coralVals = ['#FFF1EC','#FFDDD1','#FFC0AB','#FFA386','#FF8A6A','#F56A48','#DB4F2D','#B23D22','#82291A'];
  const amber = ['50','100','200','300','400','500','600'];
  const amberVals = ['#FFF8E6','#FFEFC4','#FFE19B','#FFD17F','#FFC66D','#F2A93D','#C8851F'];
  const neutral = ['0','50','100','200','300','400','500','600','700','800','900','950'];
  const neutralVals = ['#FFFFFF','#FAF8F3','#F2EEE5','#E5DFD2','#C9C3B5','#9A9484','#6F6A5C','#4F4B40','#36332B','#232117','#15140C','#0D1F1E'];

  const Row = ({ name, scale, vals, accent }) => (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 10 }}>
        <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 15, color: '#0F5F5A' }}>{name}</div>
        <div style={{ fontFamily: 'Inter', fontSize: 12, color: '#6F6A5C' }}>{accent}</div>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {scale.map((s, i) => (
          <ScaleSwatch key={s} name={s} value={vals[i]}/>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ padding: 56, height: '100%', display: 'flex', flexDirection: 'column', gap: 32, background: '#FAF8F3' }}>
      <SectionHead
        eyebrow="02 — Color"
        title="A palette pulled from the mark."
        blurb="Deep teal carries trust and steadiness. Coral and amber are reserved for celebration and forward motion — they appear on streaks, milestones, and moments of progress, never as ambient chrome."
      />

      {/* Brand swatches */}
      <Frame title="Brand colors" subtitle="The four colors from the logo. These are the only colors that should feel 'branded.'">
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <SwatchCard name="Primary"      value="#0F5F5A" big/>
          <SwatchCard name="Secondary"    value="#4DB6AC" big/>
          <SwatchCard name="Accent"       value="#FF8A6A" big/>
          <SwatchCard name="Warm Accent"  value="#FFC66D" big/>
          <SwatchCard name="Surface Light" value="#FAF8F3" big light/>
          <SwatchCard name="Surface Dark"  value="#0D1F1E" big/>
        </div>
        <div style={{ marginTop: 28, height: 56, borderRadius: 999, background: 'linear-gradient(90deg, #0F5F5A 0%, #4DB6AC 38%, #FFC66D 70%, #FF8A6A 100%)' }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 11, color: '#6F6A5C' }}>
          <span>#0F5F5A</span><span>#4DB6AC</span><span>#FFC66D</span><span>#FF8A6A</span>
        </div>
      </Frame>

      {/* Scales */}
      <Frame title="Scales" subtitle="Full ladders for tints, hovers, and surface variations.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Row name="Teal"    scale={teal}    vals={tealVals}    accent="primary · 700"/>
          <Row name="Coral"   scale={coral}   vals={coralVals}   accent="accent · 400"/>
          <Row name="Amber"   scale={amber}   vals={amberVals}   accent="warm · 400"/>
          <Row name="Neutral" scale={neutral} vals={neutralVals} accent="text & surface"/>
        </div>
      </Frame>

      {/* Semantic + chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <Frame title="Semantic" subtitle="Status colors — desaturated to coexist with the brand palette.">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Success', fg: '#2E8B6F', bg: '#DFF1E9', use: 'Logged · on track · streak unbroken' },
              { label: 'Warning', fg: '#D9892C', bg: '#FFEFC4', use: 'Missed dose · low data · reminder due' },
              { label: 'Error',   fg: '#C0392B', bg: '#FBE3DD', use: 'Failed sync · invalid value · skipped dose' },
              { label: 'Info',    fg: '#2C7BB2', bg: '#DDEAF5', use: 'Glucose · neutral context · learn more' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 12, borderRadius: 12, background: s.bg }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: s.fg }}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 13, color: s.fg }}>{s.label}</div>
                  <div style={{ fontFamily: 'Inter', fontSize: 12, color: '#36332B' }}>{s.use}</div>
                </div>
                <div style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 11, color: '#36332B' }}>{s.fg}</div>
              </div>
            ))}
          </div>
        </Frame>
        <Frame title="Chart palette" subtitle="Ordered for accessibility. Use 1–2 series in apps; up to 6 in dashboards.">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { n: 'Series 1', v: '#0F5F5A', u: 'Weight · primary' },
              { n: 'Series 2', v: '#4DB6AC', u: 'Goal line · trend avg' },
              { n: 'Series 3', v: '#FF8A6A', u: 'Spikes · alerts' },
              { n: 'Series 4', v: '#FFC66D', u: 'Milestones · doses' },
              { n: 'Series 5', v: '#2C7BB2', u: 'Glucose' },
              { n: 'Series 6', v: '#9A78D6', u: 'Mood · sleep' },
            ].map(c => (
              <div key={c.n} style={{ padding: 12, borderRadius: 12, background: '#FAF8F3', display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: c.v }}/>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: 'Poppins', fontSize: 12, fontWeight: 600, color: '#0F5F5A' }}>{c.n}</div>
                  <div style={{ fontFamily: 'Inter', fontSize: 11, color: '#6F6A5C' }}>{c.u}</div>
                </div>
              </div>
            ))}
          </div>
        </Frame>
      </div>
    </div>
  );
};

// ─── TYPE ────────────────────────────────────────────────────────
const TypeArtboard = () => (
  <div style={{ padding: 56, height: '100%', display: 'flex', flexDirection: 'column', gap: 32, background: '#FAF8F3' }}>
    <SectionHead
      eyebrow="03 — Typography"
      title="Poppins for moments. Inter for everything else."
      blurb="Poppins SemiBold gives headings and stat numbers a friendly, geometric warmth — never clinical. Inter handles long-form reading, labels, and dense data. Tabular figures lock numerics into clean columns."
    />

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <Frame title="Heading · Poppins" subtitle="500 / 600 / 700 — used for headlines, card titles, eyebrows.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 56, lineHeight: 1.05, letterSpacing: '-0.025em', color: '#0F5F5A' }}>Steady wins.</div>
          <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 36, lineHeight: 1.1, letterSpacing: '-0.02em', color: '#0F5F5A' }}>You're farther than you think.</div>
          <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 24, letterSpacing: '-0.015em', color: '#0F5F5A' }}>This week's progress</div>
          <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 18, letterSpacing: '-0.01em', color: '#0F5F5A' }}>Next dose · Thursday</div>
          <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 12, letterSpacing: '0.16em', color: '#1B736C', textTransform: 'uppercase' }}>Eyebrow · category</div>
        </div>
      </Frame>
      <Frame title="Body · Inter" subtitle="400 / 500 / 600 — used for paragraphs, labels, ui text.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ fontFamily: 'Inter', fontSize: 18, lineHeight: 1.55, color: '#36332B', margin: 0, fontWeight: 400 }}>
            Logging your dose takes ten seconds. Over a year it's the most honest record of what's actually working for your body.
          </p>
          <p style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: 1.6, color: '#4F4B40', margin: 0 }}>
            Body 16 — the default for paragraphs. Sits at exactly the right weight against Poppins headings without competing.
          </p>
          <div style={{ fontFamily: 'Inter', fontSize: 14, color: '#4F4B40', fontWeight: 500 }}>Small 14 — labels, helper text, table rows.</div>
          <div style={{ fontFamily: 'Inter', fontSize: 12, color: '#6F6A5C' }}>XS 12 — meta, captions, disabled hints.</div>
        </div>
      </Frame>
    </div>

    {/* Stat display */}
    <Frame title="Stat numbers" subtitle="The most important typography in the app. Tabular figures, generous tracking, weight-loss-friendly proportions.">
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr', gap: 32, alignItems: 'end' }}>
        <div>
          <div style={{ fontFamily: 'Poppins', fontSize: 11, fontWeight: 600, color: '#1B736C', letterSpacing: '0.16em', textTransform: 'uppercase' }}>Hero stat · 80px</div>
          <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 80, lineHeight: 1, letterSpacing: '-0.035em', color: '#0F5F5A', fontVariantNumeric: 'tabular-nums', marginTop: 8 }}>
            192.4<span style={{ fontSize: 24, fontWeight: 500, color: '#6F6A5C', marginLeft: 8 }}>lbs</span>
          </div>
        </div>
        <div>
          <div style={{ fontFamily: 'Poppins', fontSize: 11, fontWeight: 600, color: '#1B736C', letterSpacing: '0.16em', textTransform: 'uppercase' }}>Card stat · 56px</div>
          <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 56, lineHeight: 1, letterSpacing: '-0.03em', color: '#0F5F5A', fontVariantNumeric: 'tabular-nums', marginTop: 8 }}>
            2.5<span style={{ fontSize: 18, fontWeight: 500, color: '#6F6A5C', marginLeft: 6 }}>mg</span>
          </div>
        </div>
        <div>
          <div style={{ fontFamily: 'Poppins', fontSize: 11, fontWeight: 600, color: '#1B736C', letterSpacing: '0.16em', textTransform: 'uppercase' }}>Inline · 38px</div>
          <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 38, lineHeight: 1, letterSpacing: '-0.025em', color: '#0F5F5A', fontVariantNumeric: 'tabular-nums', marginTop: 8 }}>98 <span style={{ fontSize: 14, fontWeight: 500, color: '#6F6A5C' }}>mg/dL</span></div>
        </div>
      </div>
    </Frame>

    {/* Type scale table */}
    <Frame title="Type scale" subtitle="Token · size / line-height · usage.">
      <div style={{ display: 'grid', gridTemplateColumns: '120px 120px 1fr', gap: 0, fontFamily: 'Inter' }}>
        {[
          ['xs',   '12 / 16',  'Meta, captions, disabled hints'],
          ['sm',   '14 / 20',  'Labels, table cells, helper text'],
          ['base', '16 / 24',  'Body — default'],
          ['lg',   '18 / 28',  'Lead paragraphs'],
          ['xl',   '20 / 28',  'Card titles'],
          ['2xl',  '24 / 32',  'Section heads'],
          ['3xl',  '30 / 36',  'h2 mobile'],
          ['4xl',  '36 / 40',  'h1 mobile / hero card'],
          ['5xl',  '48 / 52',  'Display'],
          ['stat', '56 / 56',  'Card stats — tabular nums'],
          ['stat-lg','80 / 80','Hero stats — tabular nums'],
        ].map(([k, sz, u], i) => (
          <React.Fragment key={k}>
            <div style={{ padding: '10px 0', borderTop: i ? '1px solid rgba(15,95,90,.08)' : 'none', fontWeight: 600, color: '#0F5F5A', fontSize: 13 }}>{k}</div>
            <div style={{ padding: '10px 0', borderTop: i ? '1px solid rgba(15,95,90,.08)' : 'none', color: '#6F6A5C', fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 12 }}>{sz}</div>
            <div style={{ padding: '10px 0', borderTop: i ? '1px solid rgba(15,95,90,.08)' : 'none', color: '#36332B', fontSize: 13 }}>{u}</div>
          </React.Fragment>
        ))}
      </div>
    </Frame>
  </div>
);

// ─── SPACING / RADIUS / SHADOW ───────────────────────────────────
const FoundationsArtboard = () => (
  <div style={{ padding: 56, height: '100%', display: 'flex', flexDirection: 'column', gap: 32, background: '#FAF8F3' }}>
    <SectionHead
      eyebrow="04 — Foundations"
      title="The boring scaffolding that makes everything feel right."
      blurb="A 4px spacing grid, a clear ladder of radii from chip to sheet, and shadows that feel like soft daylight, not photoshop. These tokens flow straight into Tailwind 4."
    />

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <Frame title="Spacing scale" subtitle="4px base. Most layouts breathe at 16 / 24 / 40.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[[1,4],[2,8],[3,12],[4,16],[5,20],[6,24],[8,32],[10,40],[12,48],[16,64]].map(([t, px]) => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 48, fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 12, color: '#0F5F5A', fontWeight: 600 }}>space-{t}</div>
              <div style={{ height: 14, borderRadius: 4, width: px * 2, background: 'linear-gradient(90deg,#4DB6AC,#0F5F5A)' }}/>
              <div style={{ fontFamily: 'Inter', fontSize: 12, color: '#6F6A5C', fontVariantNumeric: 'tabular-nums' }}>{px}px</div>
            </div>
          ))}
        </div>
      </Frame>

      <Frame title="Radii" subtitle="Soft, rounded, never sharp. Large radii on hero surfaces communicate care.">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            ['xs · 4',   4,  'tags'],
            ['sm · 8',   8,  'chips'],
            ['md · 12',  12, 'inputs'],
            ['lg · 16',  16, 'buttons'],
            ['xl · 20',  20, 'cards'],
            ['2xl · 28', 28, 'sheets'],
            ['3xl · 36', 36, 'hero'],
            ['pill',     999,'pills, avatars'],
          ].map(([n, r, u]) => (
            <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 56, height: 56, borderRadius: r, background: 'linear-gradient(135deg, #CFE8E4, #4DB6AC)', boxShadow: 'inset 0 0 0 1px rgba(15,95,90,.10)' }}/>
              <div>
                <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 13, color: '#0F5F5A' }}>{n}</div>
                <div style={{ fontFamily: 'Inter', fontSize: 11, color: '#6F6A5C' }}>{u}</div>
              </div>
            </div>
          ))}
        </div>
      </Frame>
    </div>

    <Frame title="Elevation" subtitle="Five levels. Shadows are warm and low-opacity — never grey-blue.">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
        {[
          ['xs',  '0 1px 2px rgba(15,31,30,0.04)',                             'tags, chips'],
          ['sm',  '0 2px 4px rgba(15,31,30,0.05), 0 1px 2px rgba(15,31,30,0.04)','buttons'],
          ['md',  '0 4px 12px rgba(15,31,30,0.06), 0 2px 4px rgba(15,31,30,0.04)','cards'],
          ['lg',  '0 12px 28px rgba(15,31,30,0.08), 0 4px 8px rgba(15,31,30,0.04)','sheets'],
          ['xl',  '0 24px 56px rgba(15,31,30,0.12), 0 8px 16px rgba(15,31,30,0.06)','modals, popovers'],
        ].map(([n, sh, u]) => (
          <div key={n} style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', padding: 16 }}>
            <div style={{ width: 100, height: 80, borderRadius: 16, background: '#fff', boxShadow: sh }}/>
            <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 13, color: '#0F5F5A' }}>shadow-{n}</div>
            <div style={{ fontFamily: 'Inter', fontSize: 11, color: '#6F6A5C' }}>{u}</div>
          </div>
        ))}
      </div>
    </Frame>

    <Frame title="Motion" subtitle="Gentle — no overshoot on UI; spring only on celebratory moments.">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        {[
          { n: 'ease-out', d: '240ms', u: 'Default — pages, panels, fades' },
          { n: 'ease-in-out', d: '360ms', u: 'Layout, sheets opening' },
          { n: 'ease-spring', d: '600ms', u: 'Streak earned, milestone hit' },
        ].map(m => (
          <div key={m.n} style={{ padding: 16, borderRadius: 14, background: '#F2EEE5' }}>
            <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 13, color: '#0F5F5A' }}>{m.n}</div>
            <div style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 12, color: '#6F6A5C', marginTop: 4 }}>{m.d}</div>
            <div style={{ fontFamily: 'Inter', fontSize: 12, color: '#36332B', marginTop: 8 }}>{m.u}</div>
          </div>
        ))}
      </div>
    </Frame>

    <Frame title="Iconography" subtitle="Feather / Lucide — 1.75px stroke, rounded caps, 24×24 grid. Icons inherit text color.">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 14, color: '#0F5F5A' }}>
        {['home','scale','pill','utensils','droplet','heart','sparkles','trending','plus','check','bell','user','calendar','settings','arrowUp','arrowDown','arrowRight','flame','moon','sun','syringe','bookmark','message','camera'].map(n => (
          <div key={n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FAF8F3', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(15,95,90,.08)' }}>
              <Icon name={n} size={22}/>
            </div>
            <div style={{ fontFamily: 'Inter', fontSize: 10, color: '#6F6A5C' }}>{n}</div>
          </div>
        ))}
      </div>
    </Frame>
  </div>
);

// ─── COMPONENTS ──────────────────────────────────────────────────
const ComponentsArtboard = () => (
  <div style={{ padding: 56, height: '100%', display: 'flex', flexDirection: 'column', gap: 32, background: '#FAF8F3' }}>
    <SectionHead
      eyebrow="05 — Components"
      title="The kit, in one place."
      blurb="Every piece is built from the tokens above — no off-system colors, no hand-tuned shadows. Components map cleanly to shadcn/ui primitives."
    />

    {/* Buttons */}
    <Frame title="Buttons" subtitle="Five variants × three sizes. 44px is the default; never go below 36 on touch surfaces.">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <Btn variant="primary" icon="check">Log my dose</Btn>
          <Btn variant="secondary">Skip for now</Btn>
          <Btn variant="ghost" iconRight="arrowRight">View trends</Btn>
          <Btn variant="accent" icon="sparkles">Celebrate</Btn>
          <Btn variant="destructive" icon="x">Delete entry</Btn>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <Btn variant="primary" size="sm">Small</Btn>
          <Btn variant="primary" size="md">Medium</Btn>
          <Btn variant="primary" size="lg" icon="plus">Large CTA</Btn>
          <Btn variant="primary" disabled>Disabled</Btn>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <button style={{ width: 44, height: 44, borderRadius: 14, background: '#0F5F5A', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Icon name="plus"/></button>
          <button style={{ width: 44, height: 44, borderRadius: 999, background: '#FF8A6A', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(255,138,106,.40)', cursor: 'pointer' }}><Icon name="plus" strokeWidth={2.25}/></button>
          <button style={{ width: 44, height: 44, borderRadius: 14, background: '#fff', border: '1px solid rgba(15,95,90,.18)', color: '#0F5F5A', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Icon name="bell"/></button>
          <div style={{ fontFamily: 'Inter', fontSize: 12, color: '#6F6A5C' }}>Icon-only · 44×44 hit targets · default · FAB · ghost</div>
        </div>
      </div>
    </Frame>

    {/* Inputs */}
    <Frame title="Inputs & forms" subtitle="44px height, 12px radius. Focus ring is teal at 18% alpha.">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input label="Today's weight" placeholder="e.g. 192.4" helper="lbs · auto-converts to kg in settings"/>
          <Input label="Email" value="sam@example.com" focused/>
          <Input label="Confirm dose" value="2.5mg" helper="Mounjaro · Tuesday"/>
          <Input label="Glucose" placeholder="—" error="Please enter a number between 40 and 400"/>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: '#36332B', marginBottom: 8 }}>Dose</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['0.25mg','0.5mg','1.0mg','2.5mg','5.0mg'].map((d, i) => (
                <div key={d} style={{
                  flex: 1, textAlign: 'center', padding: '10px 0', borderRadius: 12,
                  background: i === 3 ? '#0F5F5A' : '#FFFFFF',
                  color: i === 3 ? '#fff' : '#36332B',
                  border: i === 3 ? 'none' : '1px solid rgba(15,95,90,.18)',
                  fontFamily: 'Inter', fontWeight: 600, fontSize: 13,
                }}>{d}</div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: '#36332B', marginBottom: 8 }}>Mood today</div>
            <div style={{ display: 'flex', gap: 12 }}>
              {[
                ['Tough', '#F08374'],
                ['Meh',   '#FFC66D'],
                ['Okay',  '#4DB6AC'],
                ['Good',  '#0F5F5A'],
              ].map(([l, c]) => (
                <div key={l} style={{ flex: 1, padding: '12px 0', textAlign: 'center', borderRadius: 14, background: '#fff', border: '1px solid rgba(15,95,90,.10)' }}>
                  <div style={{ width: 24, height: 24, borderRadius: 999, background: c, margin: '0 auto' }}/>
                  <div style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: '#36332B', marginTop: 8 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: '#36332B', marginBottom: 8 }}>Reminders</div>
            <div style={{ padding: 14, borderRadius: 12, background: '#fff', border: '1px solid rgba(15,95,90,.10)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 500 }}>Dose reminder</div>
                <div style={{ fontFamily: 'Inter', fontSize: 12, color: '#6F6A5C' }}>Tuesdays at 8:00 am</div>
              </div>
              <div style={{ width: 44, height: 26, borderRadius: 999, background: '#0F5F5A', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 3, right: 3, width: 20, height: 20, borderRadius: 999, background: '#fff' }}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Frame>

    {/* Cards */}
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <Frame title="Metric cards" subtitle="The atomic data unit. Stat number is the hero.">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <MetricCard label="Weight" value="192.4" unit="lbs" delta="−1.2 this week" deltaDir="down" icon="scale"/>
          <MetricCard label="Streak" value="14" unit="days" delta="Personal best" deltaDir="up" icon="flame" accent="amber"/>
          <MetricCard label="Glucose" value="98" unit="mg/dL" delta="−4 today" deltaDir="down" icon="droplet"/>
          <MetricCard label="Next dose" value="Thu" unit="2.5mg" delta="In 2 days" icon="syringe" accent="coral"/>
        </div>
      </Frame>
      <Frame title="Insight card" subtitle="AI-surfaced patterns. Coral accent reserved for these moments.">
        <div style={{ padding: 20, borderRadius: 18, background: '#FFF1EC', border: '1px solid rgba(255,138,106,.30)' }}>
          <div style={{ display: 'flex', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: '#FFC0AB', color: '#82291A', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
              <Icon name="sparkles" size={22}/>
            </div>
            <div>
              <div style={{ fontFamily: 'Poppins', fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', color: '#B23D22', textTransform: 'uppercase' }}>Weekly insight</div>
              <div style={{ fontFamily: 'Poppins', fontSize: 17, fontWeight: 600, color: '#82291A', marginTop: 6, lineHeight: 1.3 }}>Your nausea fades 2 days after each dose.</div>
              <div style={{ fontFamily: 'Inter', fontSize: 13, color: '#82291A', marginTop: 8, lineHeight: 1.5 }}>Light meals on Thursdays helped — you logged "feeling better" by Friday in 3 of the last 4 weeks.</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                <Btn variant="accent" size="sm">Save tip</Btn>
                <Btn variant="ghost" size="sm">Dismiss</Btn>
              </div>
            </div>
          </div>
        </div>
      </Frame>
    </div>

    {/* Pills + ring */}
    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
      <Frame title="Badges & pills" subtitle="Status only — never decoration. 12px / 600 type, 999px radius.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <Pill variant="teal" icon="check">On track</Pill>
            <Pill variant="success" icon="check">Logged</Pill>
            <Pill variant="warning" icon="bell">Dose due</Pill>
            <Pill variant="error" icon="x">Skipped</Pill>
            <Pill variant="coral" icon="flame">14 day streak</Pill>
            <Pill variant="amber" icon="sparkles">Milestone · 20 lbs</Pill>
            <Pill variant="neutral">Mounjaro · 2.5mg</Pill>
          </div>
          <div style={{ paddingTop: 16, borderTop: '1px solid rgba(15,95,90,.08)', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: '#6F6A5C' }}>Progress bars</div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Inter', fontSize: 12, marginBottom: 6 }}>
                <span style={{ fontWeight: 600 }}>Weight goal</span>
                <span style={{ color: '#6F6A5C', fontVariantNumeric: 'tabular-nums' }}>22 / 35 lbs</span>
              </div>
              <div style={{ height: 8, borderRadius: 999, background: '#E5DFD2', overflow: 'hidden' }}>
                <div style={{ width: '63%', height: '100%', background: 'linear-gradient(90deg,#0F5F5A,#4DB6AC)', borderRadius: 999 }}/>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Inter', fontSize: 12, marginBottom: 6 }}>
                <span style={{ fontWeight: 600 }}>Hydration today</span>
                <span style={{ color: '#6F6A5C', fontVariantNumeric: 'tabular-nums' }}>5 / 8</span>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {Array.from({length:8}).map((_, i) => (
                  <div key={i} style={{ flex: 1, height: 8, borderRadius: 4, background: i < 5 ? '#4DB6AC' : '#E5DFD2' }}/>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Frame>
      <Frame title="Progress rings" subtitle="For dashboard hero stats. Track at 18% of fill color.">
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Ring value={68} size={120} stroke={11} color="#0F5F5A" track="#CFE8E4" sublabel="of goal"/>
            <div style={{ fontFamily: 'Inter', fontSize: 12, color: '#6F6A5C', marginTop: 8, fontWeight: 600 }}>Weight</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Ring value={86} size={96} stroke={9} color="#FF8A6A" track="#FFDDD1" sublabel="streak"/>
            <div style={{ fontFamily: 'Inter', fontSize: 12, color: '#6F6A5C', marginTop: 8, fontWeight: 600 }}>Logging</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Ring value={42} size={80} stroke={8} color="#FFC66D" track="#FFEFC4" label="42%"/>
            <div style={{ fontFamily: 'Inter', fontSize: 12, color: '#6F6A5C', marginTop: 8, fontWeight: 600 }}>Protein</div>
          </div>
        </div>
      </Frame>
    </div>

    {/* Bottom nav variants */}
    <Frame title="Bottom navigation" subtitle="Floating, rounded, 64px. Center is a coral plus — the primary log action.">
      <div style={{ display: 'flex', gap: 24, padding: '24px 32px 12px', justifyContent: 'center', background: 'linear-gradient(180deg, #F2EEE5 0%, #E5DFD2 100%)', borderRadius: 16 }}>
        <div style={{ width: 320, position: 'relative', height: 88 }}>
          <BottomNav active="home"/>
        </div>
      </div>
    </Frame>
  </div>
);

// ─── DARK MODE & SCREENS ─────────────────────────────────────────
const DarkModeArtboard = () => (
  <div style={{ padding: 56, height: '100%', display: 'flex', flexDirection: 'column', gap: 32, background: '#FAF8F3' }}>
    <SectionHead
      eyebrow="06 — Dark mode"
      title="A bedtime version of the same system."
      blurb="Surfaces flatten to deep teal-black. Brand teal lifts to its 400 weight; coral and amber stay roughly the same. Charts get extra grid contrast. Status colors desaturate by ~10%."
    />

    <Frame title="Side-by-side surfaces" subtitle="Same components, light vs dark. Notice what changes (text, surface, borders) and what doesn't (accent, status semantics).">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {[false, true].map(dark => (
          <div key={String(dark)} style={{
            padding: 24, borderRadius: 20,
            background: dark ? '#0D1F1E' : '#FAF8F3',
            border: dark ? '1px solid rgba(77,182,172,.18)' : '1px solid rgba(15,95,90,.08)',
            display: 'flex', flexDirection: 'column', gap: 16, color: dark ? '#EAF5F3' : '#15140C',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Poppins', fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: dark ? '#4DB6AC' : '#1B736C' }}>
              <Icon name={dark ? 'moon' : 'sun'} size={14}/> {dark ? 'Dark' : 'Light'}
            </div>
            <MetricCard label="Weight" value="192.4" unit="lbs" delta="−1.2 this week" deltaDir="down" icon="scale" dark={dark}/>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <Pill variant="teal" icon="check" dark={dark}>On track</Pill>
              <Pill variant="coral" icon="flame" dark={dark}>14 day streak</Pill>
              <Pill variant="success" icon="check" dark={dark}>Logged</Pill>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Btn variant="primary" size="sm" dark={dark}>Log dose</Btn>
              <Btn variant="secondary" size="sm" dark={dark}>Skip</Btn>
            </div>
            <div style={{ padding: 12, borderRadius: 14, background: dark ? '#16302C' : '#fff', border: dark ? '1px solid rgba(77,182,172,.12)' : '1px solid rgba(15,95,90,.08)' }}>
              <TrendChart dark={dark}/>
            </div>
          </div>
        ))}
      </div>
    </Frame>

    {/* Dark mode rules */}
    <Frame title="What inverts, what stays fixed">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, fontFamily: 'Inter' }}>
        <div>
          <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 14, color: '#0F5F5A', marginBottom: 10 }}>Inverts</div>
          <ul style={{ margin: 0, paddingLeft: 18, color: '#36332B', fontSize: 14, lineHeight: 1.8 }}>
            <li>Backgrounds, surfaces, borders, dividers</li>
            <li>Text colors (primary → off-white, secondary → sage)</li>
            <li>Action color (teal-700 → teal-400 for contrast)</li>
            <li>Chart grid lifts to teal/10 for visibility</li>
            <li>Shadow opacity climbs from 6% → 35%</li>
          </ul>
        </div>
        <div>
          <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 14, color: '#B23D22', marginBottom: 10 }}>Stays fixed</div>
          <ul style={{ margin: 0, paddingLeft: 18, color: '#36332B', fontSize: 14, lineHeight: 1.8 }}>
            <li>Coral & amber accents (slight saturation drop only)</li>
            <li>Logo mark — same gradient, both modes</li>
            <li>Status semantics (success = green family always)</li>
            <li>Iconography stroke weight (1.75px)</li>
            <li>Spacing, radii, motion durations</li>
          </ul>
        </div>
      </div>
    </Frame>
  </div>
);

const ScreensArtboard = () => (
  <div style={{ padding: 56, height: '100%', display: 'flex', flexDirection: 'column', gap: 32, background: '#FAF8F3' }}>
    <SectionHead
      eyebrow="07 — In context"
      title="The system, breathing."
      blurb="A handful of screens that show how the tokens, components, and motion philosophy come together. Light and dark, side by side."
    />
    <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <HomeScreen/>
        <div style={{ fontFamily: 'Poppins', fontSize: 12, fontWeight: 600, color: '#1B736C', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Home · Light</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <TrendScreen/>
        <div style={{ fontFamily: 'Poppins', fontSize: 12, fontWeight: 600, color: '#1B736C', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Weight Trend · Light</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <LogScreen/>
        <div style={{ fontFamily: 'Poppins', fontSize: 12, fontWeight: 600, color: '#1B736C', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Log · Light</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <HomeScreen dark/>
        <div style={{ fontFamily: 'Poppins', fontSize: 12, fontWeight: 600, color: '#1B736C', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Home · Dark</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <TrendScreen dark/>
        <div style={{ fontFamily: 'Poppins', fontSize: 12, fontWeight: 600, color: '#1B736C', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Weight Trend · Dark</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <LogScreen dark/>
        <div style={{ fontFamily: 'Poppins', fontSize: 12, fontWeight: 600, color: '#1B736C', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Log · Dark</div>
      </div>
    </div>
  </div>
);

// ─── COVER ───────────────────────────────────────────────────────
const CoverArtboard = () => (
  <div style={{
    padding: 64, height: '100%',
    background: 'radial-gradient(ellipse at top right, #FFC0AB 0%, transparent 50%), radial-gradient(ellipse at bottom left, #CFE8E4 0%, transparent 50%), #FAF8F3',
    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    position: 'relative', overflow: 'hidden',
  }}>
    {/* watermark mark */}
    <div style={{ position: 'absolute', right: -80, bottom: -80, opacity: 0.07 }}>
      <Mark size={620}/>
    </div>

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
      <Lockup/>
      <div style={{ fontFamily: 'Poppins', fontSize: 12, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#1B736C' }}>v1.0 · May 2026</div>
    </div>

    <div style={{ position: 'relative', maxWidth: 820 }}>
      <div style={{ fontFamily: 'Poppins', fontSize: 13, fontWeight: 600, letterSpacing: '0.20em', textTransform: 'uppercase', color: '#FF8A6A' }}>Design system</div>
      <h1 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 88, lineHeight: 1.02, letterSpacing: '-0.035em', color: '#0F5F5A', marginTop: 16 }}>
        Every step<br/>forward counts.
      </h1>
      <p style={{ fontFamily: 'Inter', fontSize: 20, lineHeight: 1.5, color: '#4F4B40', marginTop: 24, maxWidth: 640 }}>
        The complete brand system for GLP-1 Companion — color, type, components, motion. Built so a teammate could ship a new screen on Friday afternoon and have it feel right.
      </p>
    </div>

    <div style={{ position: 'relative', display: 'flex', gap: 32, alignItems: 'flex-end', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', gap: 12 }}>
        {[
          ['Brand',         '01'],
          ['Color',         '02'],
          ['Type',          '03'],
          ['Foundations',   '04'],
          ['Components',    '05'],
          ['Dark mode',     '06'],
          ['In context',    '07'],
        ].map(([t, n]) => (
          <div key={n} style={{ padding: '12px 16px', borderRadius: 14, background: 'rgba(255,255,255,.6)', border: '1px solid rgba(15,95,90,.08)', backdropFilter: 'blur(8px)' }}>
            <div style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 10, color: '#6F6A5C' }}>§ {n}</div>
            <div style={{ fontFamily: 'Poppins', fontSize: 14, fontWeight: 600, color: '#0F5F5A', marginTop: 2 }}>{t}</div>
          </div>
        ))}
      </div>
      <div style={{ fontFamily: 'Inter', fontSize: 12, color: '#6F6A5C', textAlign: 'right' }}>
        Tailwind 4 · shadcn/ui<br/>Recharts · Next.js
      </div>
    </div>
  </div>
);

// ─── ROOT ────────────────────────────────────────────────────────
function Root() {
  return (
    <DesignCanvas title="GLP-1 Companion · Design System" subtitle="Tokens, components, and screens — May 2026">
      <DCSection id="cover" title="00 — Overview">
        <DCArtboard id="cover" label="Cover" width={1280} height={900}><CoverArtboard/></DCArtboard>
      </DCSection>
      <DCSection id="brand" title="01 — Brand">
        <DCArtboard id="brand" label="Identity & voice" width={1280} height={1400}><BrandArtboard/></DCArtboard>
      </DCSection>
      <DCSection id="color" title="02 — Color">
        <DCArtboard id="color" label="Palette · scales · semantic" width={1280} height={1700}><ColorArtboard/></DCArtboard>
      </DCSection>
      <DCSection id="type" title="03 — Typography">
        <DCArtboard id="type" label="Heading + body + stat" width={1280} height={1700}><TypeArtboard/></DCArtboard>
      </DCSection>
      <DCSection id="foundations" title="04 — Foundations">
        <DCArtboard id="foundations" label="Spacing · radius · elevation · motion · icons" width={1280} height={2000}><FoundationsArtboard/></DCArtboard>
      </DCSection>
      <DCSection id="components" title="05 — Components">
        <DCArtboard id="components" label="Buttons · inputs · cards · pills · nav" width={1280} height={2200}><ComponentsArtboard/></DCArtboard>
      </DCSection>
      <DCSection id="dark" title="06 — Dark mode">
        <DCArtboard id="dark" label="Side by side" width={1280} height={1400}><DarkModeArtboard/></DCArtboard>
      </DCSection>
      <DCSection id="screens" title="07 — In context">
        <DCArtboard id="screens" label="Six screens · light & dark" width={1280} height={2100}><ScreensArtboard/></DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<Root/>);
