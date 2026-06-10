// pathumthani/FlowMapOverlay.jsx
import React, { useState } from "react";

// ─── INITIAL DATA (% ของขนาดรูปภาพ) ─────────────────────────────────────────
const initialArrows = [
  {
    id: 1,
    x: 53.1,
    y: 14.7,
    rotation: 0,
    scale: 1,
    type: "pier",
    stationCode: "PT.1",
    size: "medium",
    label: "บ้านกระแชง (วัดโพธิ์เลื่อน)",
  },
];

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_PIER = [
  {
    station_code: "PT.1",
    station_detail: "บ้านกระแชง (วัดโพธิ์เลื่อน)",
    brae_level: 2.80,
    wl_values: 1.12,
    wl_down: 0.85,
    open_gate: 2,
    wl_percent: 45,
    amphoe: "สามโคก",
    subdistrict: "กระแชง",
    province_t: "ปทุมธานี",
    basin: "เจ้าพระยา",
    region: "ภาคกลาง",
    office: "โครงการชลประทานปทุมธานี",
    lat: 14.032115885861279,
    lng: 100.54660208298553,
    build_year: "2540",
    complete_year: "2542",
    gate_count: 6,
    gate_type: "บานตรง (Slide Gate)",
    gate_width: 4.0,
    gate_height: 3.0,
    max_discharge: 240,
    spill_level: 1.20,
    flood_level: 3.50,
    normal_level: 1.80,
    pumps: [
      { label: "ถาวร", count: 3, size: "3.0 ม³/วิ", maxRate: 9.0 },
      { label: "กึ่งถาวร", count: 2, size: "1.5 ม³/วิ", maxRate: 3.0 },
      { label: "เพิ่มเติม", count: 1, size: "1.0 ม³/วิ", maxRate: 1.0 },
    ],
    additional_canal: "แม่น้ำเจ้าพระยา",
    remark:
      "ควบคุมการระบายน้ำพื้นที่ลุ่มน้ำปทุมธานี ระดับน้ำสูงวิกฤต",
    series: {
      level: [
        1.10, 1.11, 1.12, 1.14, 1.15, 1.16, 1.15, 1.14, 1.13, 1.12,
        1.11, 1.10, 1.10, 1.11, 1.12, 1.13, 1.14, 1.15, 1.14, 1.13,
        1.12, 1.12, 1.11, 1.12,
      ],
      rain: [0, 0, 0, 1, 3, 6, 4, 1, 0, 0, 0, 2, 5, 3, 1, 0, 0, 0, 0, 2, 4, 2, 0, 0],
    },
  },
];

// ─── COLOR HELPERS ────────────────────────────────────────────────────────────
function getPierColor(pct) {
  return "#0425A4";
}

// ─── SVG MINI ICONS ───────────────────────────────────────────────────────────
function IconPin() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function IconBuild() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <rect x="3" y="11" width="18" height="10" rx="1" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
function IconDroplet({ size = 13, color = "#0e7490" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  );
}
function IconWave({ size = 12, color = "#6366f1" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
      <path d="M2 12s3-4 6-4 6 4 6 4 3-4 6-4" />
    </svg>
  );
}
function IconBell({ size = 12, color = "#374151" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

// ─── MINI SPARKLINE ───────────────────────────────────────────────────────────
function MiniSparkline({ data, color, h = 28 }) {
  const W = 120, H = h, pad = 2;
  const max = Math.max(...data, 0.001), min = Math.min(...data);
  const pts = data
    .map((v, i) => {
      const x = pad + (i * (W - 2 * pad)) / (data.length - 1);
      const y = H - pad - ((v - min) / (max - min || 1)) * (H - 2 * pad);
      return `${x},${y}`;
    })
    .join(" ");
  const lastIdx = data.length - 1;
  const areaStr = `${pad},${H - pad} ${pts} ${pad + (lastIdx * (W - 2 * pad)) / lastIdx},${H - pad}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: h }}>
      <defs>
        <linearGradient id="spk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaStr} fill="url(#spk)" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// ─── LINE CHART (wider) ───────────────────────────────────────────────────────
function LineChart({ datasets, labels, height = 100 }) {
  const W = 520, H = height, padL = 36, padR = 8, padT = 8, padB = 20;
  const allVals = datasets.flatMap((d) => d.data);
  const max = Math.max(...allVals, 0.001), min = Math.min(...allVals);
  const range = max - min || 1;
  const pts = (data) =>
    data
      .map((v, i) => {
        const x = padL + (i * (W - padL - padR)) / (data.length - 1);
        const y = H - padB - ((v - min) / range) * (H - padT - padB);
        return `${x},${y}`;
      })
      .join(" ");
  const yTicks = [0, 0.33, 0.66, 1].map((t) => min + t * range);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height }}>
      <defs>
        {datasets.map((ds, di) => (
          <linearGradient key={di} id={`lg${di}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ds.color} stopOpacity="0.15" />
            <stop offset="100%" stopColor={ds.color} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>
      {yTicks.map((v, i) => {
        const y = H - padB - ((v - min) / range) * (H - padT - padB);
        return (
          <g key={i}>
            <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#f1f5f9" strokeWidth={1} />
            <text x={padL - 4} y={y + 3.5} fontSize={7.5} fill="#94a3b8" textAnchor="end">
              {v.toFixed(2)}
            </text>
          </g>
        );
      })}
      {datasets.map((ds, di) => {
        const p = pts(ds.data);
        const xN = padL + ((ds.data.length - 1) * (W - padL - padR)) / (ds.data.length - 1);
        const areaStr = `${padL},${H - padB} ${p} ${xN},${H - padB}`;
        return (
          <g key={di}>
            <polygon points={areaStr} fill={`url(#lg${di})`} />
            <polyline points={p} fill="none" stroke={ds.color} strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round" />
          </g>
        );
      })}
      {labels
        .filter((_, i) => i % 6 === 0)
        .map((l, i) => {
          const idx = i * 6;
          const x = padL + (idx * (W - padL - padR)) / (labels.length - 1);
          return (
            <text key={i} x={x} y={H - 4} fontSize={7.5} fill="#94a3b8" textAnchor="middle">
              {l}
            </text>
          );
        })}
    </svg>
  );
}

// ─── LABEL ───────────────────────────────────────────────────────────────────
function Label({ children, color = "#64748b" }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>
      {children}
    </div>
  );
}

// ─── STAT CARD ───────────────────────────────────────────────────────────────
function StatCard({ label, value, unit, color, bg, border, spark, sparkColor }) {
  return (
    <div style={{ background: bg, borderRadius: 10, padding: "12px 14px", border: `1px solid ${border}`, flex: "1 1 0", minWidth: 0 }}>
      <div style={{ fontSize: 9.5, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color, fontFamily: "'IBM Plex Mono',monospace", lineHeight: 1, letterSpacing: "-0.5px" }}>
        {value}
      </div>
      {unit && <div style={{ fontSize: 9, color, opacity: 0.7, marginTop: 4 }}>{unit}</div>}
      {spark && (
        <div style={{ marginTop: 8 }}>
          <MiniSparkline data={spark} color={sparkColor || color} h={28} />
        </div>
      )}
    </div>
  );
}

// ─── INFO ROW ─────────────────────────────────────────────────────────────────
function InfoRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "7px 0", borderBottom: "1px solid #f1f5f9" }}>
      <span style={{ fontSize: 11, color: "#64748b" }}>{label}</span>
      <span style={{ fontSize: 11, fontWeight: 600, color: "#0f172a", textAlign: "right", marginLeft: 12 }}>{value}</span>
    </div>
  );
}

// ─── POPUP ────────────────────────────────────────────────────────────────────
function Popup({ data, onClose }) {
  const [tab, setTab] = useState("water");
  if (!data) return null;

  const HOURS = Array.from({ length: 24 }, (_, i) => i);
  const seriesLevel = data.series?.level || Array(24).fill(data.wl_values || 0);
  const U = data.wl_values ?? null;

  const statusLabel =
    data.wl_percent > 80 ? "วิกฤต" : data.wl_percent > 50 ? "เฝ้าระวัง" : "ปกติ";
  const statusConfig = {
    วิกฤต:    { bg: "#fef2f2", color: "#b91c1c", border: "#fca5a5", dot: "#ef4444", icon: "●" },
    เฝ้าระวัง: { bg: "#fffbeb", color: "#b45309", border: "#fcd34d", dot: "#f59e0b", icon: "▲" },
    ปกติ:     { bg: "#ecfdf5", color: "#047857", border: "#6ee7b7", dot: "#22c55e", icon: "✓" },
  }[statusLabel];

  const accentBlue = "#1d4ed8";
  const tabs = [["water", "ข้อมูลน้ำ"], ["location", "ข้อมูลพื้นที่"]];

  return (
    <div
      onClick={onClose}
      style={{
        background:"rgba(15,23,42,0.5)",
        position: "fixed", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 18,
          width: 820,
          maxWidth: "96vw",
          maxHeight: "88vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 32px 80px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.06)",
          overflow: "hidden",
          fontFamily: "'Sarabun',sans-serif",
        }}
      >
        {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
        <div style={{
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          borderBottom: "1px solid #f1f5f9",
          flexShrink: 0,
          background: "linear-gradient(135deg, #122c68 0%, #3f6be6 100%)",
        }}>
          {/* icon — Station SVG (scaled down) */}
          <div style={{ width: 44, height: 44, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
            dangerouslySetInnerHTML={{ __html: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="44" height="44" viewBox="0 0 74 74" fill="none">
<g filter="url(#filter0_d_418_662)">
<circle cx="36.6992" cy="36.7002" r="29.5" fill="#0009FF"/>
</g>
<g filter="url(#filter1_d_418_662)">
<rect x="21.3594" y="21.3604" width="31.27" height="31.27" fill="url(#pattern0_418_662)" shape-rendering="crispEdges"/>
</g>
<defs>
<filter id="filter0_d_418_662" x="-0.000781059" y="0.000195503" width="73.4" height="73.4" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset/><feGaussianBlur stdDeviation="3.6"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.58 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_418_662"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_418_662" result="shape"/>
</filter>
<filter id="filter1_d_418_662" x="20.3594" y="21.3604" width="33.2695" height="36.2695" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feMorphology radius="3" operator="erode" in="SourceAlpha" result="effect1_dropShadow_418_662"/>
<feOffset dy="4"/><feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.17 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_418_662"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_418_662" result="shape"/>
</filter>
<pattern id="pattern0_418_662" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_418_662" transform="scale(0.00195312)"/>
</pattern>
<image id="image0_418_662" width="512" height="512" preserveAspectRatio="none" xlink:href="data:image/png;base64,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"/>
</defs>
</svg>` }}
          />

          {/* title block */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
              <span style={{ fontSize: 9.5, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {data.station_code}
              </span>
              <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.3)", display: "inline-block" }} />
              <span style={{ fontSize: 9.5, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>สถานีวัดน้ำ · จ.{data.province_t}</span>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {data.station_detail}
            </div>
          </div>

          {/* status badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 20, background: statusConfig.bg, border: `1px solid ${statusConfig.border}`, flexShrink: 0 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: statusConfig.dot }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: statusConfig.color }}>{statusLabel}</span>
          </div>

          {/* close */}
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.08)", cursor: "pointer", fontSize: 18, color: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, lineHeight: 1 }}>
            ×
          </button>
        </div>

        {/* ══ TABS ════════════════════════════════════════════════════════════ */}
        <div style={{ display: "flex", borderBottom: "1px solid #f1f5f9", flexShrink: 0, background: "#fafafa", padding: "0 20px" }}>
          {tabs.map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{
              padding: "10px 16px",
              fontSize: 12,
              fontWeight: tab === id ? 700 : 500,
              color: tab === id ? accentBlue : "#6b7280",
              border: "none",
              borderBottom: tab === id ? `2px solid ${accentBlue}` : "2px solid transparent",
              background: "none",
              cursor: "pointer",
              fontFamily: "'Sarabun',sans-serif",
              marginBottom: -1,
            }}>
              {label}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", alignItems: "center", fontSize: 10, color: "#94a3b8", fontFamily: "'IBM Plex Mono',monospace" }}>
            อัปเดต 10/04/2569 · 06:00 น.
          </div>
        </div>

        {/* ══ BODY ════════════════════════════════════════════════════════════ */}
        <div style={{ overflowY: "auto", flex: 1, padding: "18px 20px" }}>

          {/* ─── TAB: ข้อมูลน้ำ ──────────────────────────────────────────── */}
          {tab === "water" && (
            <div style={{ display: "flex", gap: 18 }}>

              {/* LEFT COLUMN — stat cards + เกณฑ์ + แจ้งเตือน */}
              <div style={{ flex: "0 0 300px", display: "flex", flexDirection: "column", gap: 14 }}>

                {/* description */}
                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#64748b", lineHeight: 1.7 }}>
                  ประตูระบายน้ำ {data.station_detail} ควบคุมการระบายน้ำ ตำบล{data.subdistrict} อำเภอ{data.amphoe}
                </div>

                {/* stat cards row */}
                <div style={{ display: "flex", gap: 10 }}>
                  <StatCard
                    label="ระดับน้ำ"
                    value={U !== null ? `+${U.toFixed(2)}` : "—"}
                    unit="ม.รทก."
                    color={accentBlue}
                    bg="#eff6ff"
                    border="#bfdbfe"
                    spark={seriesLevel}
                    sparkColor={accentBlue}
                  />
                  <StatCard
                    label="ระดับตลิ่ง"
                    value={data.brae_level != null ? `+${data.brae_level.toFixed(2)}` : "—"}
                    unit="ม.รทก."
                    color="#7c3aed"
                    bg="#faf5ff"
                    border="#ddd6fe"
                  />
                </div>

                {/* level band bar */}
                <div style={{ background: "#fff", borderRadius: 10, padding: "12px 14px", border: "1px solid #e2e8f0" }}>
                  <Label>เกณฑ์ระดับน้ำ</Label>
                  <div style={{ height: 8, borderRadius: 4, overflow: "hidden", display: "flex", marginBottom: 10 }}>
                    <div style={{ flex: 1, background: "#22c55e" }} />
                    <div style={{ flex: 1, background: "#f59e0b" }} />
                    <div style={{ flex: 1, background: "#ef4444" }} />
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[
                      { label: "ปกติ",     dot: "#22c55e", color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" },
                      { label: "เฝ้าระวัง", dot: "#f59e0b", color: "#b45309", bg: "#fffbeb", border: "#fde68a" },
                      { label: "วิกฤต",    dot: "#ef4444", color: "#b91c1c", bg: "#fef2f2", border: "#fca5a5" },
                    ].map(({ label, dot, color, bg, border }) => (
                      <div key={label} style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, padding: "6px 8px", borderRadius: 7, background: bg, border: `1px solid ${border}` }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: dot, flexShrink: 0 }} />
                        <span style={{ fontSize: 11, color, fontWeight: 700 }}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* notification */}
                <div style={{ background: "#fff", borderRadius: 10, padding: "12px 14px", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}>
                    <IconBell size={11} color="#374151" /> การแจ้งเตือน
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 10px", borderRadius: 7, background: "#ecfdf5", border: "1px solid #6ee7b7" }}>
                    <span style={{ fontSize: 12, color: "#047857", fontWeight: 700, flexShrink: 0 }}>✓</span>
                    <div>
                      <div style={{ fontSize: 11, color: "#047857", fontWeight: 600 }}>ระดับน้ำเหนืออยู่ในเกณฑ์ปกติ</div>
                      <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2, fontFamily: "'IBM Plex Mono',monospace" }}>05:30 น.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN — กล้อง + chart */}
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 14 }}>

                {/* camera image */}
                <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #e2e8f0", position: "relative", flexShrink: 0 }}>
                  <img
                    src="/pathumthanicam.jpg"
                    alt="กล้องสถานี"
                    style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }}
                  />
                  <div style={{ position: "absolute", top: 8, left: 8, display: "flex", alignItems: "center", gap: 5, background: "rgba(0,0,0,0.55)", borderRadius: 6, padding: "3px 8px" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444" }} />
                    <span style={{ fontSize: 9, color: "#fff", fontFamily: "'IBM Plex Mono',monospace", fontWeight: 600 }}>LIVE · CAM-01</span>
                  </div>
                  <div style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.55)", borderRadius: 6, padding: "3px 8px" }}>
                    <span style={{ fontSize: 9, color: "rgba(255,255,255,0.85)", fontFamily: "'IBM Plex Mono',monospace" }}>10-04-69 · 06:00</span>
                  </div>
                </div>

                {/* chart */}
                <div style={{ background: "#f8fafc", borderRadius: 12, padding: "14px 16px", border: "1px solid #e2e8f0", flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#374151", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                    <IconDroplet size={12} color={accentBlue} />
                    ระดับน้ำ 24 ชั่วโมงที่ผ่านมา
                    <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
                      <div style={{ width: 18, height: 2, background: accentBlue, borderRadius: 1 }} />
                      <span style={{ fontSize: 10, color: "#94a3b8" }}>ระดับน้ำ (ม.รทก.)</span>
                    </div>
                  </div>
                  <LineChart
                    datasets={[{ data: seriesLevel, color: accentBlue }]}
                    labels={HOURS.map((h) => `${String(h).padStart(2, "0")}:00`)}
                    height={140}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB: ที่ตั้ง & โครงสร้าง ────────────────────────────────── */}
          {tab === "location" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, alignItems: "start" }}>

              {/* COL 1 — ที่ตั้ง */}
              <div style={{ background: "#f8fafc", borderRadius: 10, padding: 14, border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10, display: "flex", alignItems: "center", gap: 5 }}>
                  <IconPin /> ที่ตั้ง
                </div>
                <InfoRow label="จังหวัด" value={data.province_t || "—"} />
                <InfoRow label="อำเภอ" value={data.amphoe || "—"} />
                <InfoRow label="ตำบล" value={data.subdistrict || "—"} />
                <InfoRow label="ลุ่มน้ำ" value={data.basin || "—"} />
                <InfoRow label="ภูมิภาค" value={data.region || "—"} />
                <InfoRow label="หน่วยงาน" value={data.office || "—"} />
              </div>

              {/* COL 2 — พิกัด + การก่อสร้าง */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ background: "#f0fdf4", borderRadius: 10, padding: "12px 14px", border: "1px solid #bbf7d0" }}>
                  <div style={{ fontSize: 9.5, fontWeight: 700, color: "#047857", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>ละติจูด</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#14532d", fontFamily: "'IBM Plex Mono',monospace" }}>{data.lat?.toFixed(5)}°N</div>
                </div>
                <div style={{ background: "#fdf4ff", borderRadius: 10, padding: "12px 14px", border: "1px solid #e9d5ff" }}>
                  <div style={{ fontSize: 9.5, fontWeight: 700, color: "#7e22ce", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>ลองจิจูด</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#581c87", fontFamily: "'IBM Plex Mono',monospace" }}>{data.lng?.toFixed(5)}°E</div>
                </div>
                <div style={{ background: "#f8fafc", borderRadius: 10, padding: "12px 14px", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10, display: "flex", alignItems: "center", gap: 5 }}>
                    <IconBuild /> การก่อสร้าง
                  </div>
                  <InfoRow label="ปีที่ก่อสร้าง (พ.ศ.)" value={data.build_year || "—"} />
                  <InfoRow label="ปีที่แล้วเสร็จ (พ.ศ.)" value={data.complete_year || "—"} />
                </div>
              </div>

              {/* COL 3 — เส้นทาง + หมายเหตุ */}
              <div style={{ background: "#fffbeb", borderRadius: 10, padding: 14, border: "1px solid #fde68a", display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#92400e", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 7 }}>เส้นทางระบายน้ำ</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#0f172a", lineHeight: 1.75 }}>{data.additional_canal}</div>
                </div>
                <div style={{ borderTop: "1px solid #fde68a", paddingTop: 12 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#92400e", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 7 }}>หมายเหตุ</div>
                  <div style={{ fontSize: 12, color: "#0f172a", lineHeight: 1.75 }}>{data.remark}</div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── STATION ICON ─────────────────────────────────────────────────────────────
function StationIcon({ arrow, onClick }) {
  const size = 78;
  const half = size / 2;

  const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${size}" height="${size}" viewBox="0 0 74 74" fill="none">
<g filter="url(#filter0_d_418_662)">
<circle cx="36.6992" cy="36.7002" r="29.5" fill="#0009FF"/>
</g>
<g filter="url(#filter1_d_418_662)">
<rect x="21.3594" y="21.3604" width="31.27" height="31.27" fill="url(#pattern0_418_662)" shape-rendering="crispEdges"/>
</g>
<defs>
<filter id="filter0_d_418_662" x="-0.000781059" y="0.000195503" width="73.4" height="73.4" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset/><feGaussianBlur stdDeviation="3.6"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.58 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_418_662"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_418_662" result="shape"/>
</filter>
<filter id="filter1_d_418_662" x="20.3594" y="21.3604" width="33.2695" height="36.2695" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feMorphology radius="3" operator="erode" in="SourceAlpha" result="effect1_dropShadow_418_662"/>
<feOffset dy="4"/><feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.17 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_418_662"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_418_662" result="shape"/>
</filter>
<pattern id="pattern0_418_662" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_418_662" transform="scale(0.00195312)"/>
</pattern>
<image id="image0_418_662" width="512" height="512" preserveAspectRatio="none" xlink:href="data:image/png;base64,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"/>
</defs>
</svg>`;

  return (
    <foreignObject
      x={-half}
      y={-half}
      width={size}
      height={size}
      style={{ overflow: "visible", cursor: "pointer" }}
      onClick={onClick}
    >
      <div dangerouslySetInnerHTML={{ __html: svgStr }} />
    </foreignObject>
  );
}

// ─── MAIN OVERLAY ─────────────────────────────────────────────────────────────
export default function PathumthaniFlowMapOverlay({ pierData = MOCK_PIER }) {
  const [popup, setPopup] = useState(null);

  const arrows = initialArrows.map((a) => ({
    ...a,
    x: (a.x / 100) * 1920,
    y: (a.y / 100) * 1080,
  }));

  const handleClick = (arrow) => {
    const data = pierData.find((d) => d.station_code === arrow.stationCode);
    if (data) setPopup(data);
  };

  return (
    <>
      <svg
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid meet"
      >
        {arrows.map((arrow) => (
          <g
            key={arrow.id}
            transform={`translate(${arrow.x},${arrow.y}) rotate(${arrow.rotation}) scale(${arrow.scale})`}
            style={{ pointerEvents: "all" }}
          >
            <StationIcon arrow={arrow} onClick={() => handleClick(arrow)} />
          </g>
        ))}
      </svg>

      {popup && <Popup data={popup} onClose={() => setPopup(null)} />}
    </>
  );
}