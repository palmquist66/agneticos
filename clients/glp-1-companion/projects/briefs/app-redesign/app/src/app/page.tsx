import Link from "next/link";
import Image from "next/image";
import {
  Brain,
  TrendingUp,
  FileText,
  Activity,
  Pill,
  Utensils,
  Smartphone,
  Syringe,
  ArrowRight,
} from "lucide-react";
import { WaitlistForm } from "@/components/landing/waitlist-form";

/* ─── Typography helpers (scoped to landing page) ─── */
const h = "font-[family-name:var(--font-bricolage)]"; // heading
const b = "font-[family-name:var(--font-source-sans)]"; // body

/* ─────────────────────────── LANDING PAGE ─────────────────────────── */

export default function LandingPage() {
  return (
    <div className={`${b} flex min-h-screen flex-col bg-[#FAF8F3] text-[#07302E]`}>
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-[#FAF8F3]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/logo-mark.png"
              alt=""
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className={`${h} text-lg font-semibold tracking-tight text-[#0F5F5A]`}>
              GLP-1 Companion
            </span>
          </Link>
          <Link
            href="#waitlist"
            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#FF8A6A] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#F56A48]"
          >
            Join the Beta
          </Link>
        </div>
      </header>

      <main>
        {/* ═══════════════════ HERO ═══════════════════ */}
        <section className="relative overflow-hidden px-5 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24 lg:pt-28" id="waitlist">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
            {/* Left — Copy + Form */}
            <div className="max-w-xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#0F5F5A]/8 px-3.5 py-1.5">
                <span className="flex size-2 rounded-full bg-[#FF8A6A]" />
                <span className="text-xs font-semibold tracking-wide text-[#0F5F5A] uppercase">
                  Beta
                </span>
              </div>

              <h1 className={`${h} text-[clamp(2.25rem,5vw+0.5rem,3.75rem)] font-extrabold leading-[1.08] tracking-tight text-[#07302E]`}>
                Stop tracking.
                <br />
                <span className="text-[#0F5F5A]">Start seeing.</span>
              </h1>

              <p className="mt-5 max-w-md text-lg leading-relaxed text-[#4F4B40] sm:text-xl sm:leading-relaxed">
                Your weight in one app. Your food in another. Your side effects in a note
                you&#8217;ll never find again. GLP-1 Companion connects it all and shows
                you what it means.
              </p>

              <div className="mt-8 max-w-md">
                <WaitlistForm />
                <p className="mt-3 text-[13px] text-[#6F6A5C]">
                  Free to join. No credit card. We&#8217;ll email you when beta opens.
                </p>
              </div>
            </div>

            {/* Right — Visual: scattered → unified */}
            <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none" aria-hidden="true">
              <div className="relative aspect-square max-h-[420px] w-full sm:max-h-[480px]">
                {/* Scattered app fragments */}
                <div className="absolute left-[5%] top-[8%] flex w-[42%] rotate-[-4deg] items-center gap-2.5 rounded-2xl border border-[#0F5F5A]/8 bg-white p-3.5 shadow-sm">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#0F5F5A]/8">
                    <TrendingUp className="size-4 text-[#0F5F5A]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-[#6F6A5C]">Weight app</p>
                    <p className={`${h} text-sm font-semibold text-[#07302E]`}>187.4 lbs</p>
                  </div>
                </div>

                <div className="absolute right-[2%] top-[4%] flex w-[38%] rotate-[3deg] items-center gap-2.5 rounded-2xl border border-[#0F5F5A]/8 bg-white p-3.5 shadow-sm">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#FF8A6A]/10">
                    <Utensils className="size-4 text-[#FF8A6A]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-[#6F6A5C]">Food tracker</p>
                    <p className={`${h} text-sm font-semibold text-[#07302E]`}>1,340 cal</p>
                  </div>
                </div>

                <div className="absolute left-[0%] top-[32%] flex w-[36%] rotate-[-2deg] items-center gap-2.5 rounded-2xl border border-[#0F5F5A]/8 bg-white p-3.5 shadow-sm">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#FFC66D]/15">
                    <FileText className="size-4 text-[#D9892C]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-[#6F6A5C]">Notes app</p>
                    <p className="text-[11px] text-[#9A9484]">nausea today...</p>
                  </div>
                </div>

                <div className="absolute right-[6%] top-[28%] flex w-[34%] rotate-[5deg] items-center gap-2.5 rounded-2xl border border-[#0F5F5A]/8 bg-white p-3.5 shadow-sm">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#2C7BB2]/10">
                    <Pill className="size-4 text-[#2C7BB2]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-[#6F6A5C]">Calendar</p>
                    <p className="text-[11px] text-[#9A9484]">Dose day</p>
                  </div>
                </div>

                {/* Convergence arrow */}
                <svg className="absolute left-1/2 top-[52%] -translate-x-1/2" width="40" height="48" viewBox="0 0 40 48" fill="none">
                  <path d="M20 0 L20 36 M10 28 L20 38 L30 28" stroke="#0F5F5A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" />
                </svg>

                {/* Unified card */}
                <div className="absolute bottom-0 left-1/2 w-[85%] -translate-x-1/2 overflow-hidden rounded-3xl border-2 border-[#0F5F5A]/15 bg-white shadow-lg">
                  <div className="bg-[#0F5F5A] px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <Image src="/logo-mark.png" alt="" width={18} height={18} className="rounded" />
                      <span className={`${h} text-xs font-semibold text-white`}>GLP-1 Companion</span>
                      <span className="ml-auto text-[10px] text-white/60">Today</span>
                    </div>
                  </div>
                  <div className="space-y-2.5 px-4 py-3.5">
                    {/* Mini timeline entries */}
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-1.5 rounded-full bg-[#0F5F5A]" />
                      <span className="text-xs text-[#07302E]">
                        <span className="font-medium">187.4 lbs</span>
                        <span className="ml-1.5 text-[#2E8B6F]">&#8595; 2.1</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-1.5 rounded-full bg-[#FF8A6A]" />
                      <span className="text-xs text-[#07302E]">
                        <span className="font-medium">Lunch logged</span>
                        <span className="ml-1.5 text-[#6F6A5C]">42g protein</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-1.5 rounded-full bg-[#FFC66D]" />
                      <span className="text-xs text-[#07302E]">
                        <span className="font-medium">Mild nausea</span>
                        <span className="ml-1.5 text-[#6F6A5C]">day 2 post-dose</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-1.5 rounded-full bg-[#2C7BB2]" />
                      <span className="text-xs text-[#07302E]">
                        <span className="font-medium">Glucose 112</span>
                        <span className="ml-1.5 text-[#6F6A5C]">mg/dL</span>
                      </span>
                    </div>
                    {/* Pattern callout */}
                    <div className="mt-1 rounded-xl bg-[#EAF5F3] px-3 py-2">
                      <p className="flex items-start gap-1.5 text-[11px] leading-snug text-[#0F5F5A]">
                        <Brain className="mt-0.5 size-3 shrink-0" />
                        <span>
                          <span className="font-semibold">Pattern:</span> Nausea resolves by day 5 after
                          dose increases. This is your 3rd cycle showing the same trend.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════ PROBLEM ═══════════════════ */}
        <section className="bg-[#0F5F5A] px-5 py-20 text-white sm:px-8 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <h2 className={`${h} text-[clamp(1.5rem,3vw+0.5rem,2.5rem)] font-bold leading-tight tracking-tight`}>
                You&#8217;re doing everything right.
                <br />
                <span className="text-white/60">So why does it feel like guesswork?</span>
              </h2>

              <div className="mt-8 space-y-5 text-[17px] leading-relaxed text-white/80 sm:text-lg">
                <p>
                  You started your GLP-1. You&#8217;re tracking your weight. Logging meals.
                  Writing down side effects when you remember to. Maybe you sync your Dexcom.
                </p>
                <p>
                  But it&#8217;s all in different places. None of it talks to each other.
                </p>
                <p>
                  When your weight stalls for two weeks, you can&#8217;t tell if it&#8217;s the
                  dose change, the food, or something else entirely. When you sit down with your
                  doctor, you&#8217;re piecing it together from memory.
                </p>
              </div>

              <p className={`${h} mt-10 text-xl font-bold text-[#FFC66D] sm:text-2xl`}>
                Data everywhere. Insight nowhere.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════ SOLUTION ═══════════════════ */}
        <section className="px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className={`${h} text-[clamp(1.5rem,3vw+0.5rem,2.5rem)] font-bold leading-tight tracking-tight text-[#07302E]`}>
                One app. One timeline.
                <br />
                <span className="text-[#0F5F5A]">The whole picture.</span>
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-[#4F4B40]">
                GLP-1 Companion puts your weight, food, medication, side effects, and glucose
                on a single timeline. Not as a pile of numbers. As connected patterns you can read.
              </p>
            </div>

            {/* Timeline visualization */}
            <div className="mx-auto mt-14 max-w-3xl" aria-hidden="true">
              <div className="overflow-hidden rounded-3xl border border-[#0F5F5A]/10 bg-white shadow-md">
                {/* Header bar */}
                <div className="flex items-center justify-between border-b border-[#0F5F5A]/8 px-5 py-3 sm:px-6">
                  <span className={`${h} text-sm font-semibold text-[#07302E]`}>Your week at a glance</span>
                  <span className="text-xs text-[#6F6A5C]">May 5 &#8211; May 11</span>
                </div>

                <div className="px-5 py-5 sm:px-6 sm:py-6">
                  {/* Weight trend line (SVG) */}
                  <div className="mb-5">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-[#6F6A5C]">Weight trend</span>
                      <span className={`${h} text-sm font-semibold text-[#2E8B6F]`}>&#8595; 2.1 lbs</span>
                    </div>
                    <svg className="h-16 w-full" viewBox="0 0 600 64" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0F5F5A" stopOpacity="0.12" />
                          <stop offset="100%" stopColor="#0F5F5A" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M0 20 Q75 18 150 24 T300 16 T450 10 T600 6" fill="none" stroke="#0F5F5A" strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M0 20 Q75 18 150 24 T300 16 T450 10 T600 6 L600 64 L0 64 Z" fill="url(#wg)" />
                    </svg>
                  </div>

                  {/* Timeline events */}
                  <div className="relative space-y-0">
                    {/* Vertical line */}
                    <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[#0F5F5A]/10" />

                    {[
                      { color: "#9A78D6", label: "Dose: Ozempic 1.0mg", sub: "Monday 8am", highlight: false },
                      { color: "#FFC66D", label: "Mild nausea", sub: "Tuesday (day 2)", highlight: false },
                      { color: "#FF8A6A", label: "Protein target hit: 98g", sub: "Wednesday", highlight: false },
                      { color: "#FFC66D", label: "Nausea resolved", sub: "Friday (day 5)", highlight: false },
                      { color: "#0F5F5A", label: "Weight: 187.4 lbs", sub: "Sunday weigh-in", highlight: false },
                    ].map((event, i) => (
                      <div key={i} className="relative flex items-start gap-4 py-2.5">
                        <span
                          className="relative z-10 mt-1 flex size-[15px] shrink-0 items-center justify-center rounded-full"
                          style={{ backgroundColor: `${event.color}20` }}
                        >
                          <span className="size-[7px] rounded-full" style={{ backgroundColor: event.color }} />
                        </span>
                        <div>
                          <p className="text-sm font-medium text-[#07302E]">{event.label}</p>
                          <p className="text-xs text-[#6F6A5C]">{event.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pattern insight */}
                  <div className="mt-4 rounded-2xl bg-[#EAF5F3] px-4 py-3.5">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#0F5F5A]/10">
                        <Brain className="size-3.5 text-[#0F5F5A]" />
                      </div>
                      <div>
                        <p className={`${h} text-sm font-semibold text-[#0F5F5A]`}>Pattern detected</p>
                        <p className="mt-0.5 text-sm leading-snug text-[#0F5F5A]/80">
                          Your nausea peaked on day 2 and resolved by day 5. This is consistent
                          with your last 3 dose increases. Weight loss resumed after nausea subsided.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════ FEATURES ═══════════════════ */}
        <section className="border-t border-[#0F5F5A]/8 bg-[#F2EEE5]/50 px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <h2 className={`${h} text-center text-[clamp(1.5rem,3vw+0.5rem,2.5rem)] font-bold leading-tight tracking-tight text-[#07302E]`}>
              Everything your GLP-1 journey needs.
              <br className="hidden sm:block" />
              <span className="text-[#0F5F5A]"> Nothing it doesn&#8217;t.</span>
            </h2>

            {/* Feature 1 — AI Pattern Detection */}
            <div className="mt-16 grid items-center gap-8 sm:mt-20 lg:grid-cols-2 lg:gap-16">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#0F5F5A]/8 px-3 py-1">
                  <Brain className="size-3.5 text-[#0F5F5A]" />
                  <span className="text-xs font-semibold text-[#0F5F5A]">AI Pattern Detection</span>
                </div>
                <h3 className={`${h} text-2xl font-bold leading-snug tracking-tight text-[#07302E] sm:text-3xl`}>
                  Ask your data a question
                </h3>
                <p className="mt-4 max-w-md text-[17px] leading-relaxed text-[#4F4B40]">
                  &#8220;Why did my weight stall last week?&#8221; &#8220;Is this side
                  effect normal at this dose?&#8221; The AI reads your full history, not
                  one data point. Patterns surface automatically, across every metric you track.
                </p>
              </div>
              {/* Visual: pattern example */}
              <div className="rounded-2xl border border-[#0F5F5A]/8 bg-white p-5 shadow-sm sm:p-6">
                <div className="space-y-4">
                  <div className="rounded-xl bg-[#F2EEE5]/80 px-4 py-3">
                    <p className="text-sm text-[#4F4B40]">&#8220;Why did my weight plateau last week?&#8221;</p>
                  </div>
                  <div className="rounded-xl bg-[#EAF5F3] px-4 py-3.5">
                    <p className="text-sm leading-relaxed text-[#0F5F5A]">
                      Your weight held steady at 189 lbs from May 3&#8211;9. During this period,
                      your average protein intake dropped to 62g/day (vs. your 100g target), and
                      you increased your dose on May 2. In your previous 3 cycles, weight loss
                      resumed 5&#8211;7 days after a dose increase once protein returned to target.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 — All-in-one + Sync */}
            <div className="mt-20 grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
              <div className="order-2 lg:order-1">
                {/* Visual: sync sources */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Smartphone, name: "Fitbit", detail: "Weight sync", color: "#0F5F5A" },
                    { icon: Activity, name: "Dexcom", detail: "Glucose sync", color: "#2C7BB2" },
                    { icon: Utensils, name: "Meal Photo", detail: "AI nutrition", color: "#FF8A6A" },
                    { icon: Pill, name: "Medications", detail: "Dose tracking", color: "#9A78D6" },
                  ].map((source) => (
                    <div key={source.name} className="flex items-center gap-3 rounded-2xl border border-[#0F5F5A]/8 bg-white p-4 shadow-sm">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${source.color}12` }}>
                        <source.icon className="size-4" style={{ color: source.color }} />
                      </div>
                      <div>
                        <p className={`${h} text-sm font-semibold text-[#07302E]`}>{source.name}</p>
                        <p className="text-xs text-[#6F6A5C]">{source.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#0F5F5A]/8 px-3 py-1">
                  <Activity className="size-3.5 text-[#0F5F5A]" />
                  <span className="text-xs font-semibold text-[#0F5F5A]">Track + Sync</span>
                </div>
                <h3 className={`${h} text-2xl font-bold leading-snug tracking-tight text-[#07302E] sm:text-3xl`}>
                  Bring your data. All of it.
                </h3>
                <p className="mt-4 max-w-md text-[17px] leading-relaxed text-[#4F4B40]">
                  Fitbit syncs your weight. Dexcom streams your glucose. Snap a photo for
                  instant meal logging. Log doses, side effects, and injection sites. One place.
                  No more toggling between apps or forgetting where you logged what.
                </p>
              </div>
            </div>

            {/* Feature 3 — Doctor Export */}
            <div className="mt-20 grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#0F5F5A]/8 px-3 py-1">
                  <FileText className="size-3.5 text-[#0F5F5A]" />
                  <span className="text-xs font-semibold text-[#0F5F5A]">Doctor Export</span>
                </div>
                <h3 className={`${h} text-2xl font-bold leading-snug tracking-tight text-[#07302E] sm:text-3xl`}>
                  Walk in prepared. Not guessing.
                </h3>
                <p className="mt-4 max-w-md text-[17px] leading-relaxed text-[#4F4B40]">
                  Export a clean PDF with your weight trends, medication adherence, and side
                  effect patterns. Your doctor sees what happened between visits instead of
                  relying on what you remember. Two taps, done.
                </p>
              </div>
              {/* Visual: export preview */}
              <div className="rounded-2xl border border-[#0F5F5A]/8 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-3 flex items-center gap-2.5">
                  <FileText className="size-4 text-[#0F5F5A]" />
                  <span className={`${h} text-sm font-semibold text-[#07302E]`}>Doctor Report Preview</span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between border-b border-[#0F5F5A]/6 pb-2.5">
                    <span className="text-[#6F6A5C]">Weight change (30d)</span>
                    <span className="font-medium text-[#2E8B6F]">&#8722;8.2 lbs</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#0F5F5A]/6 pb-2.5">
                    <span className="text-[#6F6A5C]">Medication adherence</span>
                    <span className="font-medium text-[#07302E]">96%</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#0F5F5A]/6 pb-2.5">
                    <span className="text-[#6F6A5C]">Avg. daily protein</span>
                    <span className="font-medium text-[#07302E]">87g</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#0F5F5A]/6 pb-2.5">
                    <span className="text-[#6F6A5C]">Side effects logged</span>
                    <span className="font-medium text-[#07302E]">4 events</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6F6A5C]">Patterns identified</span>
                    <span className="font-medium text-[#0F5F5A]">3 insights</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════ SOCIAL PROOF ═══════════════════ */}
        <section className="px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <h2 className={`${h} text-center text-[clamp(1.5rem,3vw+0.5rem,2.25rem)] font-bold tracking-tight text-[#07302E]`}>
              What early users are saying
            </h2>

            <div className="mx-auto mt-12 max-w-4xl">
              {/* Lead testimonial */}
              <blockquote className="rounded-3xl bg-[#0F5F5A] px-6 py-8 text-white sm:px-10 sm:py-10">
                <p className="text-lg leading-relaxed sm:text-xl sm:leading-relaxed">
                  &#8220;I finally stopped guessing. I can see that my energy dip every
                  Tuesday is two days after my injection. It all makes sense now.&#8221;
                </p>
                <footer className="mt-5 flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-white/15 text-sm font-semibold">
                    S
                  </div>
                  <div>
                    <p className={`${h} text-sm font-semibold`}>Sarah M.</p>
                    <p className="text-xs text-white/60">Semaglutide, 6 months</p>
                  </div>
                </footer>
              </blockquote>

              {/* Secondary testimonials */}
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <blockquote className="rounded-2xl border border-[#0F5F5A]/8 bg-white px-5 py-5">
                  <p className="text-[15px] leading-relaxed text-[#07302E]">
                    &#8220;I walked into my endo appointment with the PDF report and she was
                    blown away. She said &#8216;I wish all my patients brought data like this.&#8217;&#8221;
                  </p>
                  <footer className="mt-4 flex items-center gap-2.5">
                    <div className="flex size-8 items-center justify-center rounded-full bg-[#0F5F5A]/8 text-xs font-semibold text-[#0F5F5A]">
                      J
                    </div>
                    <div>
                      <p className={`${h} text-sm font-medium text-[#07302E]`}>James K.</p>
                      <p className="text-xs text-[#6F6A5C]">Tirzepatide, 4 months</p>
                    </div>
                  </footer>
                </blockquote>
                <blockquote className="rounded-2xl border border-[#0F5F5A]/8 bg-white px-5 py-5">
                  <p className="text-[15px] leading-relaxed text-[#07302E]">
                    &#8220;I was using 4 different apps before this. Now it&#8217;s all in one
                    place and the patterns feature caught a food sensitivity I&#8217;d been
                    missing for weeks.&#8221;
                  </p>
                  <footer className="mt-4 flex items-center gap-2.5">
                    <div className="flex size-8 items-center justify-center rounded-full bg-[#0F5F5A]/8 text-xs font-semibold text-[#0F5F5A]">
                      L
                    </div>
                    <div>
                      <p className={`${h} text-sm font-medium text-[#07302E]`}>Lisa R.</p>
                      <p className="text-xs text-[#6F6A5C]">Semaglutide, 3 months</p>
                    </div>
                  </footer>
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════ NOT A DIET APP ═══════════════════ */}
        <section className="bg-[#0F5F5A] px-5 py-20 text-white sm:px-8 sm:py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
            <div>
              <h2 className={`${h} text-[clamp(1.5rem,3vw+0.5rem,2.5rem)] font-bold leading-tight tracking-tight`}>
                Not a diet app.
                <br />
                <span className="text-[#FFC66D]">A GLP-1 app.</span>
              </h2>
              <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-white/75 sm:text-lg">
                Most health apps treat GLP-1 medications as an afterthought. A checkbox in a
                generic tracker. We built every feature around the reality of what
                it&#8217;s actually like to manage a GLP-1 journey.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Pill, label: "Titration tracking", desc: "Dose schedule mapped" },
                { icon: Activity, label: "Side effect timeline", desc: "Severity over time" },
                { icon: Syringe, label: "Injection site rotation", desc: "Never repeat twice" },
                { icon: Brain, label: "AI pattern engine", desc: "Your data, connected" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl bg-white/8 px-4 py-4">
                  <item.icon className="mb-2.5 size-5 text-[#FFC66D]" />
                  <p className={`${h} text-sm font-semibold leading-snug`}>{item.label}</p>
                  <p className="mt-1 text-xs text-white/50">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ PRIVACY ═══════════════════ */}
        <section className="px-5 py-14 sm:px-8 sm:py-16">
          <div className="mx-auto flex max-w-3xl items-start gap-4 rounded-2xl bg-[#EAF5F3] px-5 py-5 sm:px-6 sm:py-6">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#0F5F5A]/10">
              <svg className="size-4 text-[#0F5F5A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <h3 className={`${h} text-base font-semibold text-[#07302E]`}>Your health data stays yours</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#4F4B40]">
                We don&#8217;t sell your data. We don&#8217;t share it with advertisers.
                Your health information is encrypted and used only to power your personal
                insights. That&#8217;s it.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════ FINAL CTA ═══════════════════ */}
        <section className="px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto max-w-xl text-center">
            <h2 className={`${h} text-[clamp(1.75rem,3.5vw+0.5rem,2.75rem)] font-bold leading-tight tracking-tight text-[#07302E]`}>
              Your data already has the answers.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-[#4F4B40]">
              See the patterns your body is telling you. Walk into your next appointment
              with answers, not questions.
            </p>

            <div className="mx-auto mt-8 max-w-md">
              <WaitlistForm />
              <p className="mt-3 text-[13px] text-[#6F6A5C]">
                Free to join. No credit card required.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-[#0F5F5A]/8 bg-[#F2EEE5] px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2.5">
            <Image src="/logo-mark.png" alt="" width={22} height={22} className="rounded-md" />
            <span className={`${h} text-sm font-semibold text-[#0F5F5A]`}>GLP-1 Companion</span>
          </div>
          <div className="text-center text-xs text-[#6F6A5C] sm:text-right">
            <p>Not medical advice. Always consult your healthcare provider.</p>
            <p className="mt-1">&copy; {new Date().getFullYear()} GLP-1 Companion</p>
          </div>
        </div>
      </footer>

      {/* ── Footer tagline ── */}
      <div className="bg-[#0F5F5A] py-3 text-center">
        <p className={`${h} text-xs font-medium tracking-wide text-white/60`}>
          See the pattern. Make the call.
        </p>
      </div>
    </div>
  );
}
