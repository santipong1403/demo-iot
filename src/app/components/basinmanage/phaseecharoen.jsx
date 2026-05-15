// phaseecharoen/FlowMapOverlay.jsx
import React, { useState } from "react";

// ─── INITIAL DATA (% ของ 1920x1080) ──────────────────────────────────────────
const initialArrows = [
  { id: 1, x: 51.5, y: 82, rotation: 0, scale: 1, type: "pier", stationCode: "PC.1", size: "medium", label: "PC.1" },
];

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_PIER = [
  { station_code: "PC.1", station_detail: "สน.ปตร.ทุ่มกระแบน", brae_level: 2.50, wl_values: 2.10, wl_percent: 84, q_max: 120, q_values: 95,  qpercent: 79, amphoe: "ภาษีเจริญ", province_t: "สมุทรสาคร" },
];
const MOCK_DAM = [
  { dam_id: "DAM1", dam_name: "เขื่อนพระษีเจริญ", dam_volume: 125.4, dam_percent_storage: 62, dam_inflow: 8.2, dam_outflow: 5.5, amphoe: "ภาษีเจริญ", province: "กรุงเทพฯ" },
];

// ─── COLOR HELPERS ────────────────────────────────────────────────────────────
function getPierColor(pct) {
  if (pct > 100) return "#0425A4";
  if (pct > 70)  return "#0425A4";
  if (pct > 30)  return "#0425A4";
  if (pct > 10)  return "#0425A4";
  return "#0ea5e9";
}
function getDamColor(pct) {
  if (pct <= 30)  return "#0425A4";
  if (pct <= 50)  return "#0425A4";
  if (pct <= 80)  return "#0425A4";
  if (pct <= 100) return "#0425A4";
  return "#0425A4";
}

// ─── POPUP ────────────────────────────────────────────────────────────────────
function Popup({ data, type, onClose }) {
  if (!data) return null;
  const isPier = type === "pier";

  const title = isPier
    ? `${data.station_code} ${data.station_detail || ""}`
    : data.dam_name || data.reservoir_name || "ไม่มีข้อมูล";

  const pct = isPier
    ? data.wl_percent
    : (data.dam_percent_storage ?? data.reservoir_percent_storage);

  const pctColor = isPier ? getPierColor(pct) : getDamColor(pct);

  const PctBadge = pct != null ? (
    <span style={{
      display: "inline-block", padding: "2px 10px", borderRadius: 4,
      background: pctColor, color: "#fff", fontWeight: 700,
    }}>
      {Math.round(pct)}%
    </span>
  ) : "-";

  const rows = isPier ? [
    ["ระดับตลิ่ง",      data.brae_level  != null ? `${data.brae_level} ม.รทก.`   : "-"],
    ["ระดับน้ำ",         data.wl_values   != null ? `${data.wl_values} ม.รทก.`    : "-"],
    ["ระดับน้ำ %",       PctBadge],
    ["อัตราไหลสูงสุด",  data.q_max       != null ? `${data.q_max} ม³/วิ`         : "-"],
    ["อัตราไหล",         data.q_values    != null ? `${data.q_values} ม³/วิ`       : "-"],
    ["อัตราไหล %",       data.qpercent    != null ? `${Math.round(data.qpercent)}%`: "-"],
    ["อำเภอ",            data.amphoe || "-"],
    ["จังหวัด",          data.province_t || data.province || "-"],
  ] : [
    ["ปริมาณน้ำ",   (data.dam_volume ?? data.reservoir_volume) != null
                      ? `${data.dam_volume ?? data.reservoir_volume} ล้าน ลบ.ม.` : "-"],
    ["ปริมาณน้ำ %",  PctBadge],
    ["น้ำไหลเข้า",  (data.dam_inflow  ?? data.reservoir_inflow)  != null
                      ? `${data.dam_inflow  ?? data.reservoir_inflow} ล้าน ลบ.ม.`  : "-"],
    ["น้ำไหลออก",   (data.dam_outflow ?? data.reservoir_outflow) != null
                      ? `${data.dam_outflow ?? data.reservoir_outflow} ล้าน ลบ.ม.` : "-"],
    ["อำเภอ",        data.amphoe || "-"],
    ["จังหวัด",      data.province || "-"],
  ];

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
          background: "#fff", borderRadius: 14, width: 380,
          boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
          overflow: "hidden", fontFamily: "sans-serif",
        }}
      >
        <div style={{
          padding: "14px 18px",
          background: isPier ? "#eff6ff" : "#f0fdf4",
          borderBottom: "1px solid #e2e8f0",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{title}</div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
              {isPier ? "สถานีวัดน้ำท่า" : "เขื่อน / อ่างเก็บน้ำ"}
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: 6,
            border: "1px solid #e5e7eb", background: "#fff",
            cursor: "pointer", fontSize: 16, color: "#94a3b8",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>×</button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <tbody>
            {rows.map(([label, value], i) => (
              <tr key={i} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 ? "#fafafa" : "#fff" }}>
                <td style={{ padding: "9px 16px", color: "#64748b", fontWeight: 500 }}>{label}</td>
                <td style={{ padding: "9px 16px", color: "#0f172a", fontWeight: 600, textAlign: "right" }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── STATION ICON ─────────────────────────────────────────────────────────────
// small=40, medium=52, large=64
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