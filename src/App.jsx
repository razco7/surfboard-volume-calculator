import React, { useState, useRef, useEffect } from "react";
import logo from "./logo.png";

// ─── Data (numeric values only — labels come from translations) ───────────────
const SURFER_LEVELS = [
  { id: "super-fit-pro", factor: 0.35 },
  { id: "fit-advanced",  factor: 0.37 },
  { id: "intermediate",  factor: 0.40 },
  { id: "casual",        factor: 0.46 },
  { id: "novice",        factor: 0.55 },
];
const WAVE_SIZES = [
  { id: "small",  modifier: +2 },
  { id: "medium", modifier:  0 },
  { id: "large",  modifier: -2 },
];
const CONSTRUCTION = [
  { id: "pu",  modifier:    0 },
  { id: "eps", modifier: -2.5 },
];
const BOARD_TYPES = [
  { id: "shortboard",    modifier:    0 },
  { id: "perf-groveler", modifier: +1.5 },
  { id: "groveler",      modifier:   +3 },
  { id: "fish",          modifier:   +4 },
  { id: "step-up",       modifier: -1.5 },
];

// ─── Translations ─────────────────────────────────────────────────────────────
const TR = {
  en: {
    appLabel:          "Surfboard Tool",
    appTitle:          "Surfboard Volume Calculator",
    liters:            "LITERS",
    paddle:            "paddle",
    perform:           "perform",
    boardTypeLabel:    "Board Type",
    skillLevelLabel:   "Surfer Level",
    weightLabel:       "Weight",
    waveSizeLabel:     "Typical Wave Size",
    constructionLabel: "Board Construction",
    breakdownLabel:    "Volume Breakdown",
    recommended:       "Recommended",
    baseRow:           "Base (weight × surfer factor)",
    waveRow:           "Wave size",
    constructionRow:   "Construction",
    baseline:          "baseline",
    close:             "Close",
    langEn:            "English",
    langHe:            "Hebrew",
    footer:            "Based on the Guild Factor formula & industry guidelines.\nVolume is a starting point — conditions and personal preference always win.",
    credit:            "Created by",
    creditClaude:      "Claude",
    creditAnd:         " & ",
    creditRaz:         "Raz Cohen",
    skills: {
      "super-fit-pro": { label: "Super Fit / Pro",    description: "Competing or high-performance surf" },
      "fit-advanced":  { label: "Fit & Advanced",     description: "Strong turns, excellent paddle fitness" },
      intermediate:    { label: "Intermediate",        description: "Catching waves, basic turns" },
      casual:          { label: "Casual",              description: "Regular surfer, average fitness" },
      novice:          { label: "Novice",              description: "Learning to paddle and pop up" },
    },
    waves: {
      small:  { label: "Small",  description: "Knee – waist" },
      medium: { label: "Medium", description: "Chest – head" },
      large:  { label: "Large",  description: "Overhead+" },
    },
    build: {
      pu:  { label: "PU / PE",     description: "Traditional polyurethane" },
      eps: { label: "EPS / Epoxy", description: "Lighter, more buoyant" },
    },
    boards: {
      shortboard:      { label: "Shortboard",     description: "High-performance, steeper rocker, narrow tail" },
      "perf-groveler": { label: "Perf. Groveler", description: "Groveler outline with more performance rocker" },
      groveler:        { label: "Groveler",        description: "Short, wide, flat rocker for weak/small surf" },
      fish:            { label: "Fish",            description: "Wide, twin-fin, swallow tail, flat rocker" },
      "step-up":       { label: "Step-Up",         description: "Longer, narrower, for powerful overhead surf" },
    },
  },
  he: {
    appLabel:          "כלים לגולשים",
    appTitle:          "מחשבון נפח גלשן",
    liters:            "ליטר",
    paddle:            "חתירה",
    perform:           "ביצועים",
    boardTypeLabel:    "סוג גלשן",
    skillLevelLabel:   "רמת גלישה",
    weightLabel:       "משקל",
    waveSizeLabel:     "גודל גל אופייני",
    constructionLabel: "חומר הגלשן",
    breakdownLabel:    "פירוט נפח",
    recommended:       "מומלץ",
    baseRow:           "בסיס (משקל × גורם גולש)",
    waveRow:           "גודל גל",
    constructionRow:   "חומר",
    baseline:          "בסיס",
    close:             "סגור",
    langEn:            "אנגלית",
    langHe:            "עברית",
    footer:            "מבוסס על נוסחת גורם הגילד והנחיות התעשייה.\nהנפח הוא נקודת התחלה — תנאים והעדפות אישיות תמיד ינצחו.",
    credit:            "נוצר על ידי",
    creditClaude:      "Claude",
    creditAnd:         " ו-",
    creditRaz:         "רז כהן",
    skills: {
      "super-fit-pro": { label: "מקצועיים / כושר גבוה", description: "גולש מתחרה, ביצועים גבוהים" },
      "fit-advanced":  { label: "מתקדמים וכשירים",      description: "פניות חזקות, כושר חתירה מעולה" },
      intermediate:    { label: "בינוניים",               description: "תפיסת פינה, פניות בסיביות" },
      casual:          { label: "מזדמנים",                description: "גולש סדיר, כושר ממוצע" },
      novice:          { label: "מתחילים",                description: "למידת חתירה ועמידה על הגלשן" },
    },
    waves: {
      small:  { label: "קטן",    description: "ברך – מותן" },
      medium: { label: "בינוני", description: "חזה – ראש" },
      large:  { label: "גדול",   description: "מעל ראש+" },
    },
    build: {
      pu:  { label: "PU / PE",      description: "פוליאוריתן מסורתי" },
      eps: { label: "EPS / אפוקסי", description: "קל וצף יותר" },
    },
    boards: {
      shortboard:      { label: "שורטבורד",      description: "ביצועים גבוהים, רוקר תלול, זנב צר" },
      "perf-groveler": { label: "גרובלר ביצועי", description: "גרובלר עם רוקר ביצועי" },
      groveler:        { label: "גרובלר",         description: "קצר, רחב, רוקר שטוח לגלים חלשים" },
      fish:            { label: "פיש",            description: "רחב, טווין פין, זנב משוחרר, רוקר שטוח" },
      "step-up":       { label: "סטפ-אפ",         description: "ארוך וצר יותר, לגלים עוצמתיים" },
    },
  },
};

// ─── Components ───────────────────────────────────────────────────────────────
function Slider({ label, value, min, max, step, unit, secondaryValue, secondaryUnit, onChange, labelFontSize = "12px" }) {
  const trackRef = useRef(null);

  const getValueFromPointer = (e) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const raw = min + pct * (max - min);
    const stepped = Math.round(raw / step) * step;
    onChange(Math.min(max, Math.max(min, stepped)));
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      onChange(Math.min(max, value + step));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      onChange(Math.max(min, value - step));
    } else if (e.key === "Home") {
      e.preventDefault();
      onChange(min);
    } else if (e.key === "End") {
      e.preventDefault();
      onChange(max);
    }
  };

  const pct = ((value - min) / (max - min)) * 100;
  const valueText = secondaryValue != null
    ? `${value} ${unit} / ${secondaryValue} ${secondaryUnit}`
    : `${value} ${unit}`;

  return (
    <div style={{ marginBottom: "8px", userSelect: "none", touchAction: "none" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "14px" }}>
        <span style={{ fontSize: labelFontSize, color: "#595959", textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "'IBM Plex Mono', monospace" }}>{label}</span>
        <span aria-hidden="true" style={{ fontSize: "22px", fontWeight: "700", color: "#111", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "-1px" }}>
          {value}<span style={{ fontSize: "13px", color: "#595959", marginLeft: "3px", fontWeight: "400" }}>{unit}</span>
          {secondaryValue != null && <>
            <span style={{ fontSize: "13px", color: "#595959", marginLeft: "6px", fontWeight: "400" }}>/ </span>
            {secondaryValue}<span style={{ fontSize: "13px", color: "#595959", marginLeft: "3px", fontWeight: "400" }}>{secondaryUnit}</span>
          </>}
        </span>
      </div>
      <div
        ref={trackRef}
        role="slider"
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={valueText}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); getValueFromPointer(e); }}
        onPointerMove={e => { if (e.buttons > 0) getValueFromPointer(e); }}
        style={{ position: "relative", height: "44px", display: "flex", alignItems: "center", cursor: "pointer" }}
      >
        <div style={{ position: "absolute", left: 0, right: 0, height: "1px", background: "#ddd" }} />
        <div style={{ position: "absolute", left: 0, width: `${pct}%`, height: "1px", background: "#111" }} />
        <div style={{
          position: "absolute", left: `${pct}%`, transform: "translateX(-50%)",
          width: "22px", height: "22px", borderRadius: "50%", background: "#111", pointerEvents: "none",
        }} />
      </div>
    </div>
  );
}

function PillSelect({ options, value, onChange, labelSize = "12px", groupLabel }) {
  return (
    <div role="radiogroup" aria-label={groupLabel} style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      {options.map(opt => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.id)}
            style={{
              flex: "1", minWidth: "70px", padding: "10px 8px", borderRadius: "12px",
              border: active ? "1.5px solid #111" : "1.5px solid #ddd",
              background: active ? "#111" : "#fff", color: active ? "#fff" : "#595959",
              cursor: "pointer", transition: "all 0.12s", textAlign: "center",
            }}
          >
            <div style={{ fontSize: labelSize, fontWeight: "600", letterSpacing: "0.04em", fontFamily: "'IBM Plex Mono', monospace" }}>{opt.label}</div>
            {opt.description && <div style={{ fontSize: "12px", marginTop: "2px", color: active ? "#bbb" : "#595959" }}>{opt.description}</div>}
          </button>
        );
      })}
    </div>
  );
}

function OptionSheet({ open, title, options, current, onSelect, onClose, closeLabel, renderMeta, dir, titleSize = "12px" }) {
  const closeButtonRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      previousFocusRef.current = document.activeElement;
      setTimeout(() => closeButtonRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
      previousFocusRef.current?.focus();
      previousFocusRef.current = null;
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
          opacity: open ? 1 : 0, pointerEvents: open ? "all" : "none",
          transition: "opacity 0.25s ease", zIndex: 100,
        }}
      />
      <div
        dir={dir}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{
          position: "fixed", left: 0, right: 0, bottom: 0,
          background: "#fff", borderRadius: "16px 16px 0 0", zIndex: 101,
          transform: open ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
          maxHeight: "75vh", display: "flex", flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px", flexShrink: 0 }}>
          <div aria-hidden="true" style={{ width: "36px", height: "4px", borderRadius: "2px", background: "#e0e0e0" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 20px 16px", flexShrink: 0 }}>
          <div style={{ fontSize: titleSize, color: "#595959", textTransform: "uppercase", letterSpacing: "0.14em", fontFamily: "'IBM Plex Mono', monospace" }}>{title}</div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label={closeLabel}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: "#595959", lineHeight: 1, padding: "8px" }}
          >×</button>
        </div>
        <div
          role="listbox"
          aria-label={title}
          style={{ overflowY: "auto", padding: "0 16px 48px", maxWidth: "640px", width: "100%", margin: "0 auto", boxSizing: "border-box" }}
        >
          {options.map((opt, i) => {
            const active = current === opt.id;
            return (
              <button
                key={opt.id}
                role="option"
                aria-selected={active}
                onClick={() => { onSelect(opt.id); onClose(); }}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  width: "100%", padding: "14px 12px",
                  marginBottom: i < options.length - 1 ? "6px" : 0,
                  borderRadius: "12px",
                  border: active ? "1.5px solid #111" : "1.5px solid #eee",
                  background: active ? "#111" : "#fafafa",
                  color: active ? "#fff" : "#333",
                  cursor: "pointer", textAlign: "start", transition: "all 0.12s",
                }}
              >
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "600", marginBottom: "3px" }}>{opt.label}</div>
                  {opt.description && <div style={{ fontSize: "12px", color: active ? "#aaa" : "#595959" }}>{opt.description}</div>}
                </div>
                {renderMeta && (
                  <div style={{ fontSize: "12px", fontFamily: "'IBM Plex Mono', monospace", color: active ? "#aaa" : "#595959", whiteSpace: "nowrap", marginInlineStart: "12px", flexShrink: 0 }}>
                    {renderMeta(opt)}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

function Divider() {
  return <div style={{ borderTop: "1px solid #eee", margin: "4px 0" }} />;
}

function SectionLabel({ children, fontSize = "12px" }) {
  return (
    <div style={{ fontSize, color: "#595959", textTransform: "uppercase", letterSpacing: "0.14em", fontFamily: "'IBM Plex Mono', monospace", marginBottom: "12px" }}>
      {children}
    </div>
  );
}

function SheetTrigger({ label, description, onClick, expanded }) {
  return (
    <button
      onClick={onClick}
      aria-haspopup="dialog"
      aria-expanded={expanded}
      style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 16px", borderRadius: "12px",
        border: "1.5px solid #111", background: "#fff",
        cursor: "pointer", textAlign: "start",
      }}
    >
      <div>
        <div style={{ fontSize: "14px", fontWeight: "600", color: "#111" }}>{label}</div>
        <div style={{ fontSize: "14px", color: "#595959", marginTop: "2px" }}>{description}</div>
      </div>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0, marginInlineStart: "12px" }}>
        <path d="M4 6l4 4 4-4" stroke="#595959" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function ShortboardVolumeCalc() {
  const [weight, setWeight]                 = useState(75);
  const [skill, setSkill]                   = useState("intermediate");
  const [waveSize, setWaveSize]             = useState("medium");
  const [construction, setConstruction]     = useState("pu");
  const [boardType, setBoardType]           = useState("shortboard");
  const [sheetOpen, setSheetOpen]           = useState(false);
  const [skillSheetOpen, setSkillSheetOpen] = useState(false);
  const [lang, setLang]                     = useState("en");

  const t      = TR[lang];
  const isRTL  = lang === "he";
  const dirVal = isRTL ? "rtl" : "ltr";

  // Merge numeric data with translated labels
  const surferLevels  = SURFER_LEVELS.map(s  => ({ ...s, ...t.skills[s.id]  }));
  const waveSizes     = WAVE_SIZES.map(w     => ({ ...w, ...t.waves[w.id]   }));
  const constructions = CONSTRUCTION.map(c   => ({ ...c, ...t.build[c.id]   }));
  const boardTypes    = BOARD_TYPES.map(b    => ({ ...b, ...t.boards[b.id]  }));

  const skillData        = surferLevels.find(s => s.id === skill);
  const waveData         = waveSizes.find(w    => w.id === waveSize);
  const constructionData = constructions.find(c => c.id === construction);
  const boardData        = boardTypes.find(b   => b.id === boardType);

  const baseVolume     = weight * skillData.factor;
  const adjustedVolume = baseVolume + waveData.modifier + constructionData.modifier + boardData.modifier;
  const paddleVol      = (adjustedVolume + 2).toFixed(1);
  const perfVol        = (adjustedVolume - 2).toFixed(1);

  const breakdownRows = [
    { label: t.baseRow,                                    value: `${baseVolume.toFixed(1)} L` },
    { label: `${t.boardTypeLabel} (${boardData.label})`,   value: `${boardData.modifier >= 0 ? "+" : ""}${boardData.modifier} L` },
    { label: t.waveRow,                                    value: `${waveData.modifier >= 0 ? "+" : ""}${waveData.modifier} L` },
    { label: t.constructionRow,                            value: `${constructionData.modifier >= 0 ? "+" : ""}${constructionData.modifier} L` },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "'IBM Plex Sans', sans-serif", color: "#111" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button { font-family: inherit; }
      `}</style>

      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "clamp(24px, 5vw, 60px) clamp(20px, 5vw, 48px) 80px" }}>

        {/* Language toggle — always top-right regardless of direction */}
        <div dir="ltr" style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
          <div role="group" aria-label="Language" style={{ display: "flex", alignItems: "center", gap: "6px", fontFamily: "'IBM Plex Mono', monospace", fontSize: "14px" }}>
            {["en", "he"].map((l, i) => (
              <React.Fragment key={l}>
                {i > 0 && <span aria-hidden="true" style={{ color: "#ccc", fontWeight: "300" }}>/</span>}
                <button
                  lang={l}
                  aria-label={l === "en" ? "English" : "עברית — Hebrew"}
                  aria-pressed={lang === l}
                  onClick={() => setLang(l)}
                  style={{
                    border: "none", background: "none", cursor: "pointer", padding: "4px 6px",
                    color: lang === l ? "#111" : "#595959",
                    fontWeight: lang === l ? "700" : "400",
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "14px", transition: "all 0.15s",
                  }}
                >
                  {l === "en" ? "En" : "עב"}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* All content — flips to RTL for Hebrew */}
        <div dir={dirVal}>

          {/* Header */}
          <div style={{ marginBottom: "28px" }}>
            <img src={logo} alt="" style={{ width: "120px", height: "120px", display: "block", marginBottom: "12px" }} />
            <div style={{ fontSize: isRTL ? "14px" : "12px", color: "#595959", letterSpacing: "0.16em", textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace", marginBottom: "10px" }}>{t.appLabel}</div>
            <h1 style={{ fontSize: "clamp(26px, 5vw, 36px)", fontWeight: "700", letterSpacing: "-0.5px", lineHeight: 1.15, color: "#111" }}>
              {t.appTitle}
            </h1>
          </div>

          {/* Result */}
          <div style={{ borderTop: "2px solid #111", borderBottom: "1px solid #eee", paddingTop: "28px", paddingBottom: "28px", marginBottom: "44px", position: "sticky", top: -2, background: "#fff", zIndex: 10 }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <div>
                <div
                  aria-live="polite"
                  aria-label={`${adjustedVolume.toFixed(1)} liters recommended`}
                  style={{ fontSize: "clamp(56px, 12vw, 88px)", fontWeight: "700", lineHeight: 1, letterSpacing: "-3px", fontFamily: "'IBM Plex Mono', monospace", color: "#111" }}
                >
                  {adjustedVolume.toFixed(1)}
                </div>
                <div style={{ fontSize: isRTL ? "14px" : "12px", color: "#595959", letterSpacing: "0.12em", fontFamily: "'IBM Plex Mono', monospace", marginTop: "6px" }}>{t.liters}</div>
              </div>
              <div style={{ textAlign: "end" }}>
                <div style={{ fontSize: "13px", fontWeight: "600", fontFamily: "'IBM Plex Mono', monospace", color: "#111", marginBottom: "6px" }}>{boardData.label}</div>
                <div style={{ fontSize: isRTL ? "14px" : "12px", color: "#595959", fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1.8 }}>
                  ↑ {paddleVol} L {t.paddle}<br />
                  ↓ {perfVol} L {t.perform}
                </div>
              </div>
            </div>
          </div>

          {/* Inputs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>

            <div>
              <Slider label={t.weightLabel} value={weight} min={45} max={120} step={1} unit="kg" secondaryValue={Math.round(weight * 2.205)} secondaryUnit="lbs" onChange={setWeight} labelFontSize={isRTL ? "14px" : "12px"} />
            </div>

            <div>
              <SectionLabel fontSize={isRTL ? "14px" : "12px"}>{t.skillLevelLabel}</SectionLabel>
              <SheetTrigger label={skillData.label} description={skillData.description} onClick={() => setSkillSheetOpen(true)} expanded={skillSheetOpen} />
            </div>

            <div>
              <SectionLabel fontSize={isRTL ? "14px" : "12px"}>{t.waveSizeLabel}</SectionLabel>
              <PillSelect options={waveSizes} value={waveSize} onChange={setWaveSize} labelSize={isRTL ? "14px" : "12px"} groupLabel={t.waveSizeLabel} />
            </div>

            <div>
              <SectionLabel fontSize={isRTL ? "14px" : "12px"}>{t.boardTypeLabel}</SectionLabel>
              <SheetTrigger label={boardData.label} description={boardData.description} onClick={() => setSheetOpen(true)} expanded={sheetOpen} />
            </div>

            <div>
              <SectionLabel fontSize={isRTL ? "14px" : "12px"}>{t.constructionLabel}</SectionLabel>
              <PillSelect options={constructions} value={construction} onChange={setConstruction} labelSize={isRTL ? "14px" : "12px"} groupLabel={t.constructionLabel} />
            </div>

            <Divider />

            {/* Breakdown */}
            <div>
              <SectionLabel fontSize={isRTL ? "14px" : "12px"}>{t.breakdownLabel}</SectionLabel>
              {breakdownRows.map((row, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f0f0f0" }}>
                  <span style={{ fontSize: "13px", color: "#595959" }}>{row.label}</span>
                  <span style={{ fontSize: "13px", fontFamily: "'IBM Plex Mono', monospace", color: "#333", fontWeight: "600" }}>{row.value}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: "14px" }}>
                <span style={{ fontSize: "14px", fontWeight: "600" }}>{t.recommended}</span>
                <span style={{ fontSize: "18px", fontWeight: "700", fontFamily: "'IBM Plex Mono', monospace" }}>{adjustedVolume.toFixed(1)} L</span>
              </div>
            </div>

          </div>

          <p style={{ fontSize: "12px", color: "#595959", marginTop: "48px", lineHeight: 1.8, borderTop: "1px solid #eee", paddingTop: "24px", whiteSpace: "pre-line", textAlign: "center" }}>
            {t.footer}
          </p>

          <p style={{ fontSize: "12px", color: "#595959", marginTop: "24px", paddingBottom: "8px", textAlign: "center" }}>
            {t.credit}{" "}
            <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" style={{ color: "#595959", textDecoration: "underline" }}>{t.creditClaude}</a>
            {t.creditAnd}
            <a href="https://www.razcohen.com/" target="_blank" rel="noopener noreferrer" style={{ color: "#595959", textDecoration: "underline" }}>{t.creditRaz}</a>
          </p>

        </div>
      </div>

      {/* Bottom sheets */}
      <OptionSheet
        open={sheetOpen}
        title={t.boardTypeLabel}
        options={boardTypes}
        current={boardType}
        onSelect={setBoardType}
        onClose={() => setSheetOpen(false)}
        closeLabel={t.close}
        dir={dirVal}
        titleSize={isRTL ? "14px" : "12px"}
        renderMeta={b => b.modifier === 0 ? t.baseline : b.modifier > 0 ? `+${b.modifier} L` : `${b.modifier} L`}
      />
      <OptionSheet
        open={skillSheetOpen}
        title={t.skillLevelLabel}
        options={surferLevels}
        current={skill}
        onSelect={setSkill}
        onClose={() => setSkillSheetOpen(false)}
        closeLabel={t.close}
        dir={dirVal}
        titleSize={isRTL ? "14px" : "12px"}
        renderMeta={s => `×${s.factor}`}
      />
    </div>
  );
}
