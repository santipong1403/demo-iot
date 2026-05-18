// phaseecharoen/FlowMapOverlay.jsx
import React, { useState } from "react";

// ─── INITIAL DATA (% ของ 1920x1080) ──────────────────────────────────────────
const initialArrows = [
  { id: 1, x: 51.5, y: 82, rotation: 0, scale: 1, type: "pier", stationCode: "PC.1", size: "medium", label: "PC.1" },
];

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_PIER = [
  {
    station_code:   "PC.1",
    station_detail: "สน.ปตร.ทุ่มกระแบน",
    brae_level:     2.50,
    wl_values:      0.58,
    wl_down:        0.40,
    open_gate:      0,
    wl_percent:     20,
    amphoe:     "กระทุ่มแบน",
    subdistrict:"ตลาดกระทุ่มแบน",
    province_t: "สมุทรสาคร",
    basin:      "ท่าจีน",
    region:     "ภาคกลาง",
    office:     "โครงการส่งน้ำและบำรุงรักษาภาษีเจริญ",
    lat:        13.7234,
    lng:        100.4521,
    build_year:    "2535",
    complete_year: "2537",
    gate_count:    4,
    gate_type:     "บานตรง (Slide Gate)",
    gate_width:    3.0,
    gate_height:   2.5,
    max_discharge: 120,
    spill_level:   0.80,
    flood_level:   3.20,
    normal_level:  1.50,
    pumps: [
      { label: "ถาวร",      count: 2, size: "2.0 ม³/วิ", maxRate: 4.0 },
      { label: "กึ่งถาวร",  count: 1, size: "1.0 ม³/วิ", maxRate: 1.0 },
      { label: "เพิ่มเติม", count: 0, size: "—",          maxRate: 0   },
    ],
    additional_canal: "คลองพระยาบรรลือ → แม่น้ำเจ้าพระยา",
    remark: "ควบคุมการระบายน้ำระหว่างพื้นที่ชลประทานและแม่น้ำ ระดับน้ำเหนือ-ท้ายอยู่ในเกณฑ์เฝ้าระวัง ปิดบาน 0 ม.พน. รอประเมินสถานการณ์",
    // Series data (24 ชม.) — เพิ่มเข้ามาให้ครบ
    series: {
      level: [0.72,0.75,0.78,0.80,0.83,0.85,0.86,0.80,0.79,0.78,0.77,0.76,0.75,0.76,0.77,0.78,0.80,0.81,0.82,0.81,0.80,0.79,0.80,0.80],
      rain:  [0,0,2,5,8,3,1,0,0,0,4,6,2,0,0,0,0,3,7,4,2,0,0,0],
    },
  },
];

const MOCK_DAM = [
  {
    dam_id:               "DAM1",
    dam_name:             "เขื่อนภาษีเจริญ",
    dam_volume:           125.4,
    dam_capacity:         200.0,
    dam_percent_storage:  62,
    dam_inflow:           8.2,
    dam_outflow:          5.5,
    dam_spill:            0.0,
    amphoe:      "ภาษีเจริญ",
    subdistrict: "บางจาก",
    province:    "กรุงเทพมหานคร",
    basin:       "เจ้าพระยา",
    region:      "ภาคกลาง",
    office:      "สำนักงานชลประทานที่ 11",
    lat:         13.8012,
    lng:         100.5123,
    build_year:    "2528",
    complete_year: "2532",
    dam_type:      "เขื่อนดิน (Earth Fill Dam)",
    dam_height:    18.5,
    dam_length:    240.0,
    spillway_type: "อาคารระบายน้ำล้น (Ogee Weir)",
    spillway_cap:  350,
    remark: "เขื่อนหลักควบคุมระดับน้ำในพื้นที่ชลประทาน ปริมาณน้ำปัจจุบัน 62% ของความจุ อยู่ในเกณฑ์ปกติ",
  },
];

// ─── COLOR HELPERS ────────────────────────────────────────────────────────────
function getPierColor(pct) { return "#0425A4"; }
function getDamColor(pct)  { return "#0425A4"; }

// ─── SVG MINI ICONS ───────────────────────────────────────────────────────────
function IconPin() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.8" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
}
function IconBuild() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="11" width="18" height="10" rx="1"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
}
function IconGate() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="6" width="20" height="14" rx="1"/><path d="M7 6V4M17 6V4M2 12h20M7 12v8M17 12v8"/></svg>;
}
function IconPump() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>;
}
function IconDroplet({ size=13, color="#0e7490" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>;
}
function IconRain({ size=13, color="#6d28d9" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><line x1="16" y1="13" x2="16" y2="21"/><line x1="8" y1="13" x2="8" y2="21"/><line x1="12" y1="15" x2="12" y2="23"/><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/></svg>;
}

// ─── MINI SPARKLINE (เหมือน WaterDashboard) ──────────────────────────────────
function MiniSparkline({ data, color, h = 24 }) {
  const W = 120, H = h, pad = 3;
  const max = Math.max(...data, 0.001), min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = pad + i * (W - 2 * pad) / (data.length - 1);
    const y = H - pad - (v - min) / (max - min || 1) * (H - 2 * pad);
    return `${x},${y}`;
  }).join(" ");
  const lastIdx = data.length - 1;
  const areaStr = `${pad},${H - pad} ${pts} ${pad + lastIdx * (W - 2 * pad) / lastIdx},${H - pad}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: h }}>
      <polygon points={areaStr} fill={color} opacity={0.12} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// ─── LINE CHART (เหมือน WaterDashboard) ──────────────────────────────────────
function LineChart({ datasets, labels, height = 130 }) {
  const W = 380, H = height, padL = 38, padR = 12, padT = 10, padB = 22;
  const allVals = datasets.flatMap(d => d.data);
  const max = Math.max(...allVals, 0.001), min = Math.min(...allVals);
  const range = max - min || 1;
  const pts = (data) => data.map((v, i) => {
    const x = padL + i * (W - padL - padR) / (data.length - 1);
    const y = H - padB - (v - min) / range * (H - padT - padB);
    return `${x},${y}`;
  }).join(" ");
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => min + t * range);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height }}>
      {yTicks.map((v, i) => {
        const y = H - padB - (v - min) / range * (H - padT - padB);
        return (
          <g key={i}>
            <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#f3f4f6" strokeWidth={1} />
            <text x={padL - 4} y={y + 4} fontSize={8} fill="#9ca3af" textAnchor="end">{v.toFixed(2)}</text>
          </g>
        );
      })}
      {datasets.map((ds, di) => {
        const p = pts(ds.data);
        const xN = padL + (ds.data.length - 1) * (W - padL - padR) / (ds.data.length - 1);
        const areaStr = `${padL},${H - padB} ${p} ${xN},${H - padB}`;
        return (
          <g key={di}>
            <polygon points={areaStr} fill={ds.color} opacity={0.07} />
            <polyline points={p} fill="none" stroke={ds.color} strokeWidth={2}
              strokeLinejoin="round" strokeLinecap="round"
              strokeDasharray={ds.dashed ? "5 3" : "none"} />
          </g>
        );
      })}
      {labels.filter((_, i) => i % 4 === 0).map((l, i) => {
        const idx = i * 4;
        const x = padL + idx * (W - padL - padR) / (labels.length - 1);
        return <text key={i} x={x} y={H - 4} fontSize={8} fill="#9ca3af" textAnchor="middle">{l}</text>;
      })}
    </svg>
  );
}

// ─── BAR CHART (ฝน) ───────────────────────────────────────────────────────────
function BarChart({ data, color = "#6d28d9", height = 100 }) {
  const W = 380, H = height, padL = 38, padR = 12, padT = 8, padB = 22;
  const max = Math.max(...data, 0.001);
  const bw = (W - padL - padR) / data.length * 0.6;
  const HOURS = Array.from({ length: 24 }, (_, i) => i);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height }}>
      {[0, 0.5, 1].map((t, i) => {
        const v = t * max, y = H - padB - (v / max) * (H - padT - padB);
        return (
          <g key={i}>
            <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#f3f4f6" strokeWidth={1} />
            <text x={padL - 4} y={y + 4} fontSize={8} fill="#9ca3af" textAnchor="end">{v.toFixed(0)}</text>
          </g>
        );
      })}
      {data.map((v, i) => {
        const bh = (v / max) * (H - padT - padB);
        const x = padL + i * (W - padL - padR) / data.length + (W - padL - padR) / data.length * 0.2;
        return <rect key={i} x={x} y={H - padB - bh} width={bw} height={bh} fill={color} rx={2} opacity={0.7} />;
      })}
      {HOURS.filter(h => h % 4 === 0).map(h => {
        const x = padL + h * (W - padL - padR) / data.length + (W - padL - padR) / data.length * 0.5;
        return <text key={h} x={x} y={H - 4} fontSize={8} fill="#9ca3af" textAnchor="middle">{String(h).padStart(2, "0")}:00</text>;
      })}
    </svg>
  );
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────
function SectionBox({ icon, title, children }) {
  return (
    <div style={{ background: "#f8fafc", borderRadius: 8, padding: 14, border: "1px solid #e2e8f0" }}>
      <div style={{ fontWeight: 700, fontSize: 11, color: "#374151", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 6 }}>
        {icon}{title}
      </div>
      {children}
    </div>
  );
}

function InfoGrid({ rows }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px 20px" }}>
      {rows.map(([k, v], i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 6, borderBottom: "1px solid #f1f5f9" }}>
          <span style={{ fontSize: 11, color: "#64748b", flexShrink: 0 }}>{k}</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#0f172a", textAlign: "right", marginLeft: 6 }}>{v}</span>
        </div>
      ))}
    </div>
  );
}

function CoordCard({ label, value, bg, border, color, dark }) {
  return (
    <div style={{ background: bg, borderRadius: 8, padding: "10px 14px", border: `1px solid ${border}` }}>
      <div style={{ fontSize: 10, color, fontWeight: 600, textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: dark, marginTop: 4, fontFamily: "'IBM Plex Mono',monospace" }}>{value}</div>
    </div>
  );
}

// ─── POPUP ────────────────────────────────────────────────────────────────────
function Popup({ data, type, onClose }) {
  const [tab, setTab] = useState("water");
  if (!data) return null;
  const isPier = type === "pier";

  const title = isPier
    ? `${data.station_code} ${data.station_detail || ""}`
    : data.dam_name || data.reservoir_name || "ไม่มีข้อมูล";

  const subtitle = isPier
    ? `ประตูระบายน้ำ · จ.${data.province_t || data.province || ""}`
    : `เขื่อน / อ่างเก็บน้ำ · จ.${data.province || ""}`;

  const statusLabel = isPier
    ? data.wl_percent > 80 ? "วิกฤต" : data.wl_percent > 50 ? "เฝ้าระวัง" : "ปกติ"
    : data.dam_percent_storage > 90 ? "วิกฤต" : data.dam_percent_storage > 70 ? "เฝ้าระวัง" : "ปกติ";

  const statusStyle = statusLabel === "วิกฤต"
    ? { background: "#fef2f2", color: "#b91c1c", border: "0.5px solid #fca5a5" }
    : statusLabel === "เฝ้าระวัง"
    ? { background: "#fffbeb", color: "#b45309", border: "0.5px solid #fcd34d" }
    : { background: "#ecfdf5", color: "#047857", border: "0.5px solid #6ee7b7" };

  const statusIcon = statusLabel === "วิกฤต" ? "🔴" : statusLabel === "เฝ้าระวัง" ? "⚠" : "✓";
  const accentColor = isPier ? "#1d4ed8" : "#059669";

  // Series data (fallback 24-point flat if not present)
  const seriesLevel = data.series?.level || Array(24).fill(data.wl_values || 0);
  const seriesRain  = data.series?.rain  || Array(24).fill(0);
  const HOURS = Array.from({ length: 24 }, (_, i) => i);

  // readings เหมือน WaterDashboard
  const U = data.wl_values ?? null;
  const D = data.wl_down   ?? null;
  const O = data.open_gate ?? null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(15,23,42,0.45)", zIndex: 2000,
        display: "flex", alignItems: "center", justifyContent: "center",
        backdropFilter: "blur(3px)",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 16, width: 460,
          maxHeight: "90vh", display: "flex", flexDirection: "column",
          boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
          overflow: "hidden", fontFamily: "'Sarabun',sans-serif",
        }}
      >
        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <div style={{
          padding: "14px 18px", display: "flex", alignItems: "center",
          gap: 12, borderBottom: "1px solid #f1f5f9", flexShrink: 0,
          background: "#fafafa",
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, background: accentColor,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            {isPier ? (
              <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
                <path d="M8.35 18.5V10.2C8.35 9.54 8.88 9 9.53 9H22.47C23.12 9 23.65 9.54 23.65 10.2V18.5M10.71 18.5V13.15C10.71 12.49 11.23 11.96 11.88 11.96H13.65C14.3 11.96 14.82 12.49 14.82 13.15V18.5M17.18 18.5V13.15C17.18 12.49 17.7 11.96 18.35 11.96H20.12C20.77 11.96 21.29 12.49 21.29 13.15V18.5M7.7 18.15L8.98 18.8C9.32 18.97 9.73 18.96 10.07 18.78L12.2 17.61C12.55 17.41 12.98 17.41 13.33 17.61L15.44 18.76C15.79 18.96 16.21 18.96 16.56 18.76L18.67 17.61C19.02 17.41 19.45 17.41 19.8 17.61L21.93 18.78C22.27 18.96 22.68 18.97 23.02 18.8L24.3 18.15C25.08 17.76 26 18.33 26 19.21V23.81C26 24.47 25.47 25 24.82 25H7.18C6.53 25 6 24.47 6 23.81V19.21C6 18.33 6.92 17.76 7.7 18.15Z"
                  stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M3 17H7M7 17H17M7 17V9C7 7.9 7.9 7 9 7H15C16.1 7 17 7.9 17 9V17M17 17H21M5 21H19M9 12H15"
                  stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{subtitle}</div>
            <div style={{ marginTop: 5, display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, ...statusStyle }}>
                {statusIcon} {statusLabel}
              </span>
              <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 500, background: "#f1f5f9", color: "#475569", border: "0.5px solid #e2e8f0" }}>
                {isPier ? "ประตูระบายน้ำ" : "เขื่อน / อ่างเก็บน้ำ"}
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: 7,
            border: "1px solid #e5e7eb", background: "#fff",
            cursor: "pointer", fontSize: 16, color: "#94a3b8",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>×</button>
        </div>

        {/* ── TABS ────────────────────────────────────────────────────────── */}
        <div style={{ display: "flex", borderBottom: "1px solid #f1f5f9", flexShrink: 0, background: "#fff", padding: "0 4px" }}>
          {[["water", "ข้อมูลน้ำ"], ["building", "ข้อมูลอาคาร"]].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{
              padding: "10px 20px", fontSize: 13,
              fontWeight: tab === id ? 700 : 500,
              color: tab === id ? accentColor : "#6b7280",
              border: "none", borderBottom: tab === id ? `2px solid ${accentColor}` : "2px solid transparent",
              background: "none", cursor: "pointer", fontFamily: "'Sarabun',sans-serif",
            }}>{label}</button>
          ))}
        </div>

        {/* ── BODY ────────────────────────────────────────────────────────── */}
        <div style={{ overflowY: "auto", flex: 1, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }}>

          {/* DESC BANNER */}
          <div style={{
            background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10,
            padding: "10px 14px", fontSize: 12, color: "#64748b", lineHeight: 1.7,
          }}>
            {isPier
              ? `ประตูระบายน้ำ ${title} ทำหน้าที่ควบคุมและระบายน้ำ ตำบล${data.subdistrict || ""} อำเภอ${data.amphoe || ""} จังหวัด${data.province_t || data.province || ""}`
              : `${title} ทำหน้าที่กักเก็บและระบายน้ำในพื้นที่ ตำบล${data.subdistrict || ""} อำเภอ${data.amphoe || ""} จังหวัด${data.province || ""}`
            }
          </div>

          {/* ══════════════════════════════════════════════════════════════
              TAB: ข้อมูลน้ำ  ← รูปแบบเดียวกับ WaterDashboard StationModal
          ══════════════════════════════════════════════════════════════ */}
          {tab === "water" && (
            <>
              {/* ── U D O P CARDS (เหมือน WaterDashboard) ─────────────── */}
              <div style={{ background: "#fff", borderRadius: 10, padding: 14, border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#374151", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 5 }}>
                  <IconDroplet size={12} color="#0e7490" /> ค่าวัดปัจจุบัน
                </div>

                {isPier ? (
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {/* U */}
                    <div style={{ flex: "1 1 110px", background: "#eff6ff", borderRadius: 8, padding: "10px 14px", border: "1px solid #bfdbfe" }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: "#1d4ed8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>U · ระดับน้ำเหนือ</div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: "#1d4ed8", fontFamily: "'IBM Plex Mono',monospace", lineHeight: 1 }}>
                        {U !== null ? `+${U.toFixed(2)}` : "—"}
                      </div>
                      {U !== null && <div style={{ fontSize: 9, color: "#1d4ed8", marginTop: 3 }}>ม.รทก.</div>}
                      {U !== null && (
                        <div style={{ marginTop: 6, height: 24 }}>
                          <MiniSparkline data={seriesLevel} color="#1d4ed8" h={24} />
                        </div>
                      )}
                    </div>
                    {/* D */}
                    <div style={{ flex: "1 1 110px", background: "#ecfdf5", borderRadius: 8, padding: "10px 14px", border: "1px solid #6ee7b7" }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: "#047857", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>D · ระดับน้ำท้าย</div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: "#047857", fontFamily: "'IBM Plex Mono',monospace", lineHeight: 1 }}>
                        {D !== null ? `+${D.toFixed(2)}` : "—"}
                      </div>
                      {D !== null && <div style={{ fontSize: 9, color: "#047857", marginTop: 3 }}>ม.รทก.</div>}
                    </div>
                    {/* O */}
                    <div style={{ flex: "1 1 110px", background: "#faf5ff", borderRadius: 8, padding: "10px 14px", border: "1px solid #ddd6fe" }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>O · เปิดบาน/จำนวน</div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: "#7c3aed", fontFamily: "'IBM Plex Mono',monospace", lineHeight: 1 }}>
                        {O !== null ? O : "—"}
                      </div>
                      {O !== null && <div style={{ fontSize: 9, color: "#7c3aed", marginTop: 3 }}>ม.พน.</div>}
                    </div>
                  </div>
                ) : (
                  /* DAM CARDS */
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {[
                      { key: "vol", label: "ปริมาณน้ำ",  val: data.dam_volume,          unit: "ล้าน ลบ.ม.", bg: "#eff6ff", border: "#bfdbfe", color: "#1d4ed8" },
                      { key: "pct", label: "% กักเก็บ",  val: Math.round(data.dam_percent_storage ?? 0), unit: "%", bg: "#f0fdf4", border: "#bbf7d0", color: "#059669" },
                      { key: "in",  label: "น้ำไหลเข้า", val: data.dam_inflow,           unit: "ล้าน ลบ.ม.", bg: "#faf5ff", border: "#e9d5ff", color: "#7c3aed" },
                      { key: "out", label: "น้ำไหลออก",  val: data.dam_outflow,          unit: "ล้าน ลบ.ม.", bg: "#fff7ed", border: "#fed7aa", color: "#c2410c" },
                    ].map(({ key, label, val, unit, bg, border, color }) => (
                      <div key={key} style={{ flex: "1 1 90px", background: bg, borderRadius: 8, padding: "10px 14px", border: `1px solid ${border}` }}>
                        <div style={{ fontSize: 9, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>{label}</div>
                        <div style={{ fontSize: 22, fontWeight: 700, color, fontFamily: "'IBM Plex Mono',monospace", lineHeight: 1 }}>{val ?? "—"}</div>
                        <div style={{ fontSize: 9, color, marginTop: 3, opacity: 0.7 }}>{unit}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── CHARTS 2 คอลัมน์ (เหมือน WaterDashboard) ─────────── */}
              {isPier && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {/* ระดับน้ำ 24 ชม. */}
                  <div style={{ background: "#f8fafc", borderRadius: 8, padding: 12, border: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}>
                      <IconDroplet size={12} color="#1d4ed8" /> ระดับน้ำ 24 ชม.
                    </div>
                    <LineChart
                      datasets={[{ data: seriesLevel, color: "#1d4ed8" }]}
                      labels={HOURS.map(h => `${String(h).padStart(2, "0")}:00`)}
                      height={110}
                    />
                  </div>
                  {/* ปริมาณฝน 24 ชม. */}
                  <div style={{ background: "#f8fafc", borderRadius: 8, padding: 12, border: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}>
                      <IconRain size={12} color="#6d28d9" /> ปริมาณฝน 24 ชม. (มม.)
                    </div>
                    <BarChart data={seriesRain} color="#6d28d9" height={110} />
                  </div>
                </div>
              )}

              {/* ── ข้อมูลเพิ่มเติม (rows) ────────────────────────────── */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8", marginBottom: 6 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                  ข้อมูลเพิ่มเติม
                </div>
                <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, overflow: "hidden" }}>
                  {(isPier ? [
                    ["ระดับตลิ่ง",      data.brae_level != null ? `${data.brae_level} ม.รทก.` : "—", false],
                    ["อำเภอ / จังหวัด", `${data.amphoe || "—"} / ${data.province_t || data.province || "—"}`, false],
                  ] : [
                    ["อำเภอ",   data.amphoe   || "—", false],
                    ["จังหวัด", data.province || "—", false],
                  ]).map(([label, val, red], i, arr) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 14px", borderBottom: i < arr.length - 1 ? "1px solid #f8fafc" : "none", fontSize: 12 }}>
                      <span style={{ color: "#64748b" }}>{label}</span>
                      <span style={{ fontWeight: 600, fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, color: red ? "#b91c1c" : "#0f172a" }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ══════════════════════════════════════════════════════════════
              TAB: ข้อมูลอาคาร  (ไม่เปลี่ยน)
          ══════════════════════════════════════════════════════════════ */}
          {tab === "building" && (
            <>
              <SectionBox icon={<IconPin />} title="ที่ตั้ง">
                <InfoGrid rows={[
                  ["จังหวัด",           data.province_t || data.province || "—"],
                  ["อำเภอ",             data.amphoe     || "—"],
                  ["ตำบล",              data.subdistrict || "—"],
                  ["ลุ่มน้ำ",           data.basin      || "—"],
                  ["ภูมิภาค",           data.region     || "—"],
                  ["หน่วยงานรับผิดชอบ", data.office     || "—"],
                ]} />
              </SectionBox>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <CoordCard label="ละติจูด"  value={`${data.lat ?? "—"}°N`} bg="#f0fdf4" border="#bbf7d0" color="#047857" dark="#14532d" />
                <CoordCard label="ลองจิจูด" value={`${data.lng ?? "—"}°E`} bg="#fdf4ff" border="#e9d5ff" color="#7e22ce" dark="#581c87" />
              </div>

              <SectionBox icon={<IconBuild />} title="ข้อมูลการก่อสร้าง">
                <InfoGrid rows={isPier ? [
                  ["ปีที่ก่อสร้าง (พ.ศ.)",  data.build_year    || "—"],
                  ["ปีที่แล้วเสร็จ (พ.ศ.)", data.complete_year || "—"],
                ] : [
                  ["ปีที่ก่อสร้าง (พ.ศ.)",  data.build_year    || "—"],
                  ["ปีที่แล้วเสร็จ (พ.ศ.)", data.complete_year || "—"],
                  ["ประเภทเขื่อน",           data.dam_type      || "—"],
                  ["ความสูงเขื่อน",          data.dam_height    != null ? `${data.dam_height} ม.` : "—"],
                  ["ความยาวสันเขื่อน",       data.dam_length    != null ? `${data.dam_length} ม.` : "—"],
                ]} />
              </SectionBox>

              {isPier && (
                <SectionBox icon={<IconGate />} title="ข้อมูลประตูระบายน้ำ">
                  <InfoGrid rows={[
                    ["จำนวนบานประตู",    data.gate_count    != null ? `${data.gate_count} บาน`     : "—"],
                    ["ประเภทบาน",        data.gate_type     || "—"],
                    ["ความกว้าง/บาน",    data.gate_width    != null ? `${data.gate_width} ม.`       : "—"],
                    ["ความสูง/บาน",      data.gate_height   != null ? `${data.gate_height} ม.`      : "—"],
                    ["อัตราระบายสูงสุด", data.max_discharge != null ? `${data.max_discharge} ม³/วิ` : "—"],
                    ["ระดับน้ำล้นตลิ่ง", data.flood_level  != null ? `${data.flood_level} ม.รทก.`  : "—"],
                    ["ระดับน้ำปกติ",     data.normal_level  != null ? `${data.normal_level} ม.รทก.`: "—"],
                    ["ระดับน้ำล้นฝาย",  data.spill_level   != null ? `${data.spill_level} ม.รทก.`  : "—"],
                  ]} />
                </SectionBox>
              )}

              {!isPier && (
                <SectionBox icon={<IconGate />} title="อาคารระบายน้ำล้น (Spillway)">
                  <InfoGrid rows={[
                    ["ประเภท",          data.spillway_type || "—"],
                    ["ความสามารถระบาย", data.spillway_cap  != null ? `${data.spillway_cap} ม³/วิ` : "—"],
                  ]} />
                </SectionBox>
              )}

              {isPier && data.pumps && data.pumps.length > 0 && (
                <SectionBox icon={<IconPump />} title="เครื่องสูบน้ำ">
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                    {[
                      { label: "ถาวร",      bg: "#fef2f2", accent: "#b91c1c" },
                      { label: "กึ่งถาวร",  bg: "#eff6ff", accent: "#1d4ed8" },
                      { label: "เพิ่มเติม", bg: "#f0fdf4", accent: "#047857" },
                    ].map(({ label, bg, accent }) => {
                      const p = data.pumps.find(x => x.label === label) || { count: 0, size: "—", maxRate: 0 };
                      return (
                        <div key={label} style={{ background: bg, borderRadius: 8, padding: "10px 12px", border: "1px solid #e2e8f0" }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: accent, marginBottom: 7 }}>{label}</div>
                          {[["จำนวน", p.count ?? 0], ["ขนาด", p.size || "—"], ["รวม", `${p.maxRate ?? 0} ม³/วิ`]].map(([k, v]) => (
                            <div key={k} style={{ display: "flex", justifyContent: "space-between", paddingBottom: 4 }}>
                              <span style={{ fontSize: 10, color: "#64748b" }}>{k}</span>
                              <span style={{ fontSize: 10, fontWeight: 600, color: "#0f172a" }}>{v}</span>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </SectionBox>
              )}

              <div style={{ background: "#fffbeb", borderRadius: 8, padding: 14, border: "1px solid #fde68a" }}>
                <div style={{ fontWeight: 700, fontSize: 11, color: "#92400e", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 5 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="1.8" strokeLinecap="round">
                    <circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
                  </svg>
                  ข้อมูลเพิ่มเติม
                </div>
                {isPier && data.additional_canal && (
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 10, color: "#92400e", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>เส้นทางการระบายน้ำ</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", lineHeight: 1.5 }}>{data.additional_canal}</div>
                  </div>
                )}
                <div>
                  <div style={{ fontSize: 10, color: "#92400e", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>หมายเหตุ</div>
                  <div style={{ fontSize: 12, color: "#0f172a", lineHeight: 1.6 }}>{data.remark || "—"}</div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── FOOTER ──────────────────────────────────────────────────────── */}
        <div style={{ padding: "8px 16px", borderTop: "1px solid #f1f5f9", background: "#fafafa", fontSize: 10, color: "#94a3b8", textAlign: "center", flexShrink: 0 }}>
          ข้อมูล ณ วันที่ 10/04/2569 เวลา 06:00 น. · กรมชลประทาน
        </div>
      </div>
    </div>
  );
}

// ─── STATION ICON ─────────────────────────────────────────────────────────────
function StationIcon({ arrow, color, onClick }) {
  const size = arrow.size === "small" ? 40 : arrow.size === "large" ? 64 : 52;
  const half = size / 2;

  const html = `
    <div style="display:inline-flex;flex-direction:column;align-items:center;">
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32" fill="none"
           style="filter:drop-shadow(0 2px 5px rgba(0,0,0,0.4));display:block;">
        <circle cx="16" cy="16" r="15.25" fill="${color}" stroke="white" stroke-width="1.5"/>
        <path d="M8.35294 18.4815V10.1852C8.35294 9.53063 8.87967 9 9.52941 9H22.4706C23.1203 9 23.6471 9.53063 23.6471 10.1852V18.4815M10.7059 18.4815V13.1481C10.7059 12.4936 11.2326 11.963 11.8824 11.963H13.6471C14.2968 11.963 14.8235 12.4936 14.8235 13.1481V18.4815M17.1765 18.4815V13.1481C17.1765 12.4936 17.7032 11.963 18.3529 11.963H20.1176C20.7674 11.963 21.2941 12.4936 21.2941 13.1481V18.4815M7.7026 18.1539L8.97959 18.7971C9.32404 18.9706 9.73099 18.9633 10.0691 18.7775L12.2014 17.6059C12.5525 17.4129 12.9769 17.4129 13.3281 17.6059L15.4366 18.7645C15.7878 18.9575 16.2122 18.9575 16.5634 18.7645L18.6719 17.6059C19.0231 17.4129 19.4475 17.4129 19.7987 17.6059L21.9309 18.7775C22.269 18.9633 22.676 18.9706 23.0204 18.7971L24.2974 18.1539C25.0796 17.7599 26 18.3329 26 19.214V23.8148C26 24.4694 25.4733 25 24.8235 25H7.17647C6.52672 25 6 24.4694 6 23.8148V19.214C6 18.3329 6.92037 17.7599 7.7026 18.1539Z"
              stroke="white" stroke-width="2"/>
      </svg>
    </div>`;

  return (
    <foreignObject
      x={-half}
      y={-half}
      width={size + 80}
      height={size + 28}
      style={{ overflow: "visible", cursor: "pointer" }}
      onClick={onClick}
    >
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </foreignObject>
  );
}

// ─── MAIN OVERLAY ─────────────────────────────────────────────────────────────
export default function FlowMapOverlay({ pierData = MOCK_PIER, damData = MOCK_DAM, rsvData = [] }) {
  const [popup, setPopup] = useState(null);

  const arrows = initialArrows.map(a => ({
    ...a,
    x: (a.x / 100) * 1920,
    y: (a.y / 100) * 1080,
  }));

  const getIconColor = (arrow) => {
    if (arrow.type === "pier") {
      const d = pierData.find(d => d.station_code === arrow.stationCode);
      return d?.wl_percent != null ? getPierColor(d.wl_percent) : "#374151";
    }
    if (arrow.type === "dam") {
      const d = damData.find(d => d.dam_id === arrow.stationCode);
      return d?.dam_percent_storage != null ? getDamColor(d.dam_percent_storage) : "#374151";
    }
    if (arrow.type === "rsv") {
      const d = rsvData.find(d => d.reservoir_id === arrow.stationCode);
      return d?.reservoir_percent_storage != null ? getDamColor(d.reservoir_percent_storage) : "#374151";
    }
    return "#374151";
  };

  const handleClick = (arrow) => {
    if (arrow.type === "pier") {
      const data = pierData.find(d => d.station_code === arrow.stationCode);
      if (data) setPopup({ data, type: "pier" });
    } else if (arrow.type === "dam") {
      const data = damData.find(d => d.dam_id === arrow.stationCode);
      if (data) setPopup({ data, type: "dam" });
    } else if (arrow.type === "rsv") {
      const data = rsvData.find(d => d.reservoir_id === arrow.stationCode);
      if (data) setPopup({ data, type: "rsv" });
    }
  };

  return (
    <>
      <svg
        style={{
          position: "absolute", top: 0, left: 0,
          width: "100%", height: "100%",
          pointerEvents: "none",
        }}
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid meet"
      >
        {arrows.map(arrow => (
          <g
            key={arrow.id}
            transform={`translate(${arrow.x},${arrow.y}) rotate(${arrow.rotation}) scale(${arrow.scale})`}
            style={{ pointerEvents: "all" }}
          >
            <StationIcon
              arrow={arrow}
              color={getIconColor(arrow)}
              onClick={() => handleClick(arrow)}
            />
          </g>
        ))}
      </svg>

      {popup && (
        <Popup
          data={popup.data}
          type={popup.type}
          onClose={() => setPopup(null)}
        />
      )}
    </>
  );
}