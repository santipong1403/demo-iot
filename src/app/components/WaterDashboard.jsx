import { useState, useEffect, useRef, useCallback } from "react";

const STATIONS = [
  {
    id: "T1", code: "T.1", name: "สถานีวัดน้ำ T.1", shortName: "T.1 ภาษีเจริญ",
    x: 78, y: 75, type: "gauging", status: "warn",
    desc: "สถานีวัดระดับน้ำคลองภาษีเจริญ บริเวณมหาวิทยาลัยภาษีเจริญ",
    level: 0.88, flow: 12.5, gate: null, width: null,
    info: {
      province: "กรุงเทพมหานคร", district: "ภาษีเจริญ", subdistrict: "บางจาก",
      region: "ภาคกลาง", basin: "ท่าจีน", office: "โครงการส่งน้ำฯ ภาษีเจริญ",
      lat: 13.7201, lng: 100.4320, buildYear: "2508", completeYear: "2509",
      gateCount: null, gateType: null, gateWidth: null, gateHeight: null,
      maxDischarge: null, spillLevel: null, floodLevel: 7.2, normalLevel: 2.4,
      pumps: [], additionalCanal: "คลองภาษีเจริญ", remark: "สถานีวัดระดับน้ำอัตโนมัติ SCADA"
    },
    series: {
      level: [0.72,0.75,0.78,0.80,0.83,0.85,0.86,0.88,0.87,0.86,0.85,0.84,0.83,0.82,0.81,0.80,0.82,0.84,0.86,0.87,0.88,0.87,0.86,0.88],
      flow:  [10.1,10.5,11.0,11.5,11.8,12.0,12.2,12.5,12.3,12.1,11.9,11.7,11.5,11.3,11.0,10.8,11.0,11.4,11.8,12.0,12.5,12.3,12.0,12.5],
      rain:  [0,0,2,5,8,3,1,0,0,0,4,6,2,0,0,0,0,3,7,4,2,0,0,0],
    }
  },
  {
    id: "T14", code: "T.14", name: "สถานีวัดน้ำ T.14", shortName: "T.14 ท่าจีน",
    x: 78, y: 395, type: "gauging", status: "ok",
    desc: "สถานีวัดระดับน้ำแม่น้ำท่าจีน บริเวณอำเภอสามพราน",
    level: 0.12, flow: 3.8, gate: null, width: null,
    info: {
      province: "นครปฐม", district: "สามพราน", subdistrict: "ท่าตลาด",
      region: "ภาคกลาง", basin: "ท่าจีน", office: "โครงการส่งน้ำฯ ภาษีเจริญ",
      lat: 13.7105, lng: 100.2310, buildYear: "2520", completeYear: "2521",
      gateCount: null, gateType: null, gateWidth: null, gateHeight: null,
      maxDischarge: null, spillLevel: null, floodLevel: 6.5, normalLevel: 1.8,
      pumps: [], additionalCanal: "แม่น้ำท่าจีน", remark: "N/A"
    },
    series: {
      level: [0.10,0.11,0.11,0.12,0.12,0.13,0.13,0.12,0.12,0.11,0.11,0.10,0.10,0.11,0.12,0.12,0.13,0.13,0.12,0.12,0.11,0.11,0.12,0.12],
      flow:  [3.2,3.3,3.4,3.5,3.6,3.8,3.9,3.8,3.7,3.6,3.5,3.4,3.3,3.4,3.5,3.6,3.7,3.8,3.8,3.7,3.6,3.5,3.7,3.8],
      rain:  [0,0,0,1,2,1,0,0,0,0,1,2,1,0,0,0,0,1,3,2,1,0,0,0],
    }
  },
  {
    id: "PTR_DUD", code: "ปตร.ดุด", name: "ปตร.ดุด", shortName: "ปตร.ดุด",
    x: 235, y: 118, type: "gate", status: "ok",
    desc: "ประตูระบายน้ำคลองดุด ควบคุมน้ำเข้าคลองภาษีเจริญ",
    level: 0.0, flow: 8.2, gate: "เปิด 100%", width: "4.0 ม.",
    info: {
      province: "กรุงเทพมหานคร", district: "ภาษีเจริญ", subdistrict: "คลองขวาง",
      region: "ภาคกลาง", basin: "ท่าจีน", office: "สำนักงานชลประทานที่ 11",
      lat: 13.7280, lng: 100.3980, buildYear: "2500", completeYear: "2502",
      gateCount: 4, gateType: "บานตรง", gateWidth: 4.0, gateHeight: 3.56,
      maxDischarge: 80, spillLevel: 0, floodLevel: 3.5, normalLevel: 1.2,
      pumps: [], additionalCanal: "คลองดุด", remark: "N/A"
    },
    series: {
      level: [0,0,0.05,0.1,0.08,0.05,0,0,0,0,0.02,0.05,0.03,0,0,0,0,0.04,0.08,0.06,0.02,0,0,0],
      flow:  [7.0,7.2,7.5,7.8,8.0,8.2,8.3,8.2,8.1,7.9,7.7,7.5,7.3,7.2,7.4,7.6,7.8,8.0,8.2,8.3,8.2,8.1,7.9,8.2],
      rain:  [0,0,1,3,5,2,0,0,0,0,2,4,2,0,0,0,0,2,5,3,1,0,0,0],
    }
  },
  {
    id: "PTR_BANGKAE", code: "ปตร.บางแค", name: "ปตร.บางแค", shortName: "ปตร.บางแค",
    x: 235, y: 168, type: "gate", status: "warn",
    desc: "ประตูระบายน้ำคลองบางแค ช่วยระบายน้ำจากคลองภาษีเจริญ",
    level: 0.12, flow: 5.1, gate: "เปิด 60%", width: "3.5 ม.",
    info: {
      province: "กรุงเทพมหานคร", district: "บางแค", subdistrict: "บางแค",
      region: "ภาคกลาง", basin: "ท่าจีน", office: "สำนักงานชลประทานที่ 11",
      lat: 13.7150, lng: 100.4010, buildYear: "2515", completeYear: "2517",
      gateCount: 6, gateType: "บานตรง", gateWidth: 3.5, gateHeight: 3.0,
      maxDischarge: 60, spillLevel: 0, floodLevel: 3.2, normalLevel: 1.0,
      pumps: [], additionalCanal: "คลองบางแค", remark: "ระดับน้ำสูงกว่าปกติ ต้องเฝ้าระวัง"
    },
    series: {
      level: [0.05,0.07,0.08,0.10,0.11,0.12,0.13,0.12,0.12,0.11,0.10,0.10,0.09,0.10,0.11,0.12,0.12,0.13,0.14,0.13,0.12,0.11,0.12,0.12],
      flow:  [4.2,4.4,4.6,4.8,5.0,5.1,5.2,5.1,5.0,4.9,4.8,4.7,4.6,4.7,4.8,5.0,5.1,5.2,5.3,5.2,5.1,5.0,4.9,5.1],
      rain:  [0,0,2,4,6,3,1,0,0,0,3,5,2,0,0,0,1,3,6,4,2,0,0,0],
    }
  },
  {
    id: "PTR_SAMPAT", code: "สน.สามบาท", name: "สน.ปตร.สามบาท", shortName: "สามบาท",
    x: 235, y: 218, type: "gate", status: "ok",
    desc: "สถานีสูบน้ำ-ประตูระบาย สามบาท ช่วยระบายน้ำออกสู่แม่น้ำท่าจีน",
    level: 0.3, flow: 3.8, gate: "เดินเครื่อง", width: "2.5 ม.",
    info: {
      province: "นครปฐม", district: "สามพราน", subdistrict: "บ้านใหม่",
      region: "ภาคกลาง", basin: "ท่าจีน", office: "โครงการส่งน้ำฯ ภาษีเจริญ",
      lat: 13.7020, lng: 100.3550, buildYear: "2528", completeYear: "2530",
      gateCount: 3, gateType: "บานตรง", gateWidth: 2.5, gateHeight: 2.5,
      maxDischarge: 30, spillLevel: 0, floodLevel: 3.0, normalLevel: 0.8,
      pumps: [{ label: "ถาวร", count: 2, size: "1.5 ม³/วิ", maxRate: 3.0 }],
      additionalCanal: "คลองสามบาท", remark: "N/A"
    },
    series: {
      level: [0.25,0.27,0.28,0.29,0.30,0.31,0.31,0.30,0.30,0.29,0.28,0.28,0.27,0.28,0.29,0.30,0.31,0.31,0.32,0.31,0.30,0.30,0.30,0.30],
      flow:  [3.2,3.3,3.5,3.6,3.7,3.8,3.9,3.8,3.7,3.6,3.5,3.4,3.3,3.4,3.6,3.7,3.8,3.9,4.0,3.9,3.8,3.7,3.8,3.8],
      rain:  [0,0,1,2,3,1,0,0,0,0,1,3,1,0,0,0,0,1,4,2,1,0,0,0],
    }
  },
  {
    id: "SN_BANGPRA", code: "สน.บางพระ", name: "สน.ปตม.บางพระ", shortName: "บางพระ",
    x: 335, y: 415, type: "gate", status: "danger",
    desc: "สถานีสูบน้ำบางพระ ขนาด 3 ม³/วินาที × 3 เครื่อง",
    level: 0.58, flow: 15.2, gate: "เดินเครื่อง 3 เครื่อง", width: "5.0 ม.",
    info: {
      province: "สมุทรสาคร", district: "กระทุ่มแบน", subdistrict: "บางพระ",
      region: "ภาคกลาง", basin: "ท่าจีน", office: "โครงการส่งน้ำฯ ภาษีเจริญ",
      lat: 13.6580, lng: 100.2780, buildYear: "2535", completeYear: "2537",
      gateCount: 8, gateType: "บานตรง", gateWidth: 5.0, gateHeight: 3.56,
      maxDischarge: 150, spillLevel: 0, floodLevel: 7.8, normalLevel: 4.2,
      pumps: [
        { label: "ถาวร", count: 3, size: "3.0 ม³/วิ", maxRate: 9.0 },
        { label: "กึ่งถาวร", count: 0, size: "0", maxRate: 0 },
        { label: "เพิ่มเติม", count: 0, size: "0", maxRate: 0 },
      ],
      additionalCanal: "คลองระพีพัฒน์", remark: "N/A"
    },
    series: {
      level: [0.40,0.43,0.46,0.49,0.52,0.54,0.56,0.58,0.57,0.56,0.55,0.54,0.53,0.52,0.53,0.54,0.55,0.56,0.57,0.58,0.59,0.58,0.58,0.58],
      flow:  [12.0,12.4,12.8,13.2,13.6,14.0,14.5,15.2,15.0,14.8,14.5,14.2,14.0,13.8,14.0,14.2,14.5,14.8,15.0,15.2,15.3,15.2,15.0,15.2],
      rain:  [0,0,3,6,10,5,2,0,0,0,5,8,4,1,0,0,1,4,9,6,3,0,0,0],
    }
  },
  {
    id: "SN_MAHACHAI", code: "ปตร.มหาชัย", name: "สน.ปตร.มหาชัย", shortName: "มหาชัย",
    x: 235, y: 575, type: "gate", status: "ok",
    desc: "ประตูระบายน้ำมหาชัย ทางออกสู่อ่าวไทยฝั่งตะวันตก",
    level: 0.15, flow: 4.2, gate: "เปิด 30%", width: "6.0 ม.",
    info: {
      province: "สมุทรสาคร", district: "เมือง", subdistrict: "มหาชัย",
      region: "ภาคกลาง", basin: "ท่าจีน", office: "สำนักงานชลประทานที่ 13",
      lat: 13.5360, lng: 100.2750, buildYear: "2490", completeYear: "2495",
      gateCount: 12, gateType: "บานตรง", gateWidth: 6.0, gateHeight: 4.0,
      maxDischarge: 200, spillLevel: 0, floodLevel: 4.5, normalLevel: 1.5,
      pumps: [], additionalCanal: "คลองมหาชัย", remark: "N/A"
    },
    series: {
      level: [0.10,0.11,0.12,0.13,0.14,0.15,0.16,0.15,0.15,0.14,0.13,0.13,0.12,0.13,0.14,0.15,0.15,0.16,0.17,0.16,0.15,0.14,0.15,0.15],
      flow:  [3.5,3.6,3.8,3.9,4.0,4.2,4.3,4.2,4.1,4.0,3.9,3.8,3.7,3.8,3.9,4.0,4.1,4.2,4.3,4.2,4.1,4.0,4.1,4.2],
      rain:  [0,0,1,2,3,1,0,0,0,0,1,3,1,0,0,0,0,1,3,2,1,0,0,0],
    }
  },
  {
    id: "SN_SAMUTSAKHON", code: "ปตร.สาขาภาค", name: "ปตร.สาขาภาค", shortName: "สาขาภาค",
    x: 415, y: 515, type: "gate", status: "warn",
    desc: "ประตูระบายน้ำสาขาภาค ทางน้ำออกสู่อ่าวไทย",
    level: 0.45, flow: 11.0, gate: "เปิด 70%", width: "8.0 ม.",
    info: {
      province: "สมุทรสาคร", district: "เมือง", subdistrict: "ท่าฉลอม",
      region: "ภาคกลาง", basin: "ท่าจีน", office: "สำนักงานชลประทานที่ 13",
      lat: 13.5310, lng: 100.2640, buildYear: "2510", completeYear: "2513",
      gateCount: 10, gateType: "บานตรง", gateWidth: 8.0, gateHeight: 4.5,
      maxDischarge: 250, spillLevel: 0, floodLevel: 5.0, normalLevel: 2.0,
      pumps: [], additionalCanal: "ปากแม่น้ำท่าจีน", remark: "ระดับน้ำขึ้นลงตามน้ำทะเล"
    },
    series: {
      level: [0.30,0.33,0.36,0.39,0.41,0.43,0.45,0.45,0.44,0.43,0.42,0.41,0.40,0.41,0.42,0.43,0.44,0.45,0.46,0.45,0.45,0.44,0.45,0.45],
      flow:  [8.5,8.9,9.2,9.6,10.0,10.4,10.8,11.0,10.8,10.6,10.4,10.2,10.0,10.2,10.4,10.6,10.8,11.0,11.2,11.0,10.9,10.8,10.9,11.0],
      rain:  [0,0,2,5,8,4,1,0,0,0,3,6,3,1,0,0,1,3,7,5,2,0,0,0],
    }
  },
];

const CAMERAS = [
  { id: 1, name: "สถานีภาษีเจริญ (CAM-01)", level: 47, status: "warning", waterPct: 47, stationId: "T1" },
  { id: 2, name: "ปตร.คลองดุด (CAM-02)",    level: 22, status: "ok",      waterPct: 25, stationId: "PTR_DUD" },
  { id: 3, name: "ปตร.บางแค (CAM-03)",      level: 32, status: "warning", waterPct: 35, stationId: "PTR_BANGKAE" },
  { id: 4, name: "สน.บางพระ (CAM-04)",      level: 58, status: "danger",  waterPct: 62, stationId: "SN_BANGPRA" },
  { id: 5, name: "ปตร.มหาชัย (CAM-05)",     level: 15, status: "ok",      waterPct: 18, stationId: "SN_MAHACHAI" },
  { id: 6, name: "สน.สามบาท (CAM-06)",      level: 30, status: "ok",      waterPct: 30, stationId: "PTR_SAMPAT" },
  { id: 7, name: "ปตร.สาขาภาค (CAM-07)",   level: 45, status: "warning", waterPct: 45, stationId: "SN_SAMUTSAKHON" },
  { id: 8, name: "สถานีท่าจีน (CAM-08)",    level: 12, status: "ok",      waterPct: 12, stationId: "T14" },
  { id: 9, name: "ปตร.ดุด สาขา (CAM-09)",  level: 20, status: "ok",      waterPct: 22, stationId: "PTR_DUD" },
];

const STATION_LIST_FOR_COMPARE = ["T1","T14","PTR_DUD","PTR_BANGKAE","SN_BANGPRA","SN_MAHACHAI"];
const HOURS = Array.from({length:24},(_,i)=>i);
const CHART_COLORS = ["#1d4ed8","#047857","#b45309","#b91c1c","#6d28d9","#0e7490"];

const STATUS_CONFIG = {
  ok:     { color:"#047857", bg:"#ecfdf5", border:"#6ee7b7", label:"ปกติ" },
  warn:   { color:"#b45309", bg:"#fffbeb", border:"#fcd34d", label:"เฝ้าระวัง" },
  danger: { color:"#b91c1c", bg:"#fef2f2", border:"#fca5a5", label:"วิกฤต" },
};
function stCfg(s) { return STATUS_CONFIG[s] || STATUS_CONFIG.ok; }

// ─── SVG ICONS (no emojis) ────────────────────────────────────────────────────

function IconDashboard({ size=16, color="currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  );
}
function IconChart({ size=16, color="currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  );
}
function IconForecast({ size=16, color="currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
    </svg>
  );
}
function IconMap({ size=16, color="currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
      <line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
    </svg>
  );
}
function IconCheckCircle({ size=14, color="#047857" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );
}
function IconWarn({ size=14, color="#b45309" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  );
}
function IconAlert({ size=14, color="#b91c1c" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}
function IconStation({ size=14, color="#1d4ed8" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
    </svg>
  );
}
function IconDroplet({ size=14, color="#0e7490" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
    </svg>
  );
}
function IconRain({ size=14, color="#6d28d9" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="16" y1="13" x2="16" y2="21"/><line x1="8" y1="13" x2="8" y2="21"/>
      <line x1="12" y1="15" x2="12" y2="23"/>
      <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/>
    </svg>
  );
}
function IconLocation({ size=14, color="#374151" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
function IconBuild({ size=14, color="#374151" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="1"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}
function IconGate({ size=14, color="#374151" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="14" rx="1"/>
      <path d="M7 6V4M17 6V4M2 12h20M7 12v8M17 12v8"/>
    </svg>
  );
}
function IconExtra({ size=14, color="#374151" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
    </svg>
  );
}

// ─── STATION TYPE ICONS ───────────────────────────────────────────────────────

/** ประตูระบายน้ำ – deep blue building */
function GateIcon({ size = 24 }) {
  const h = Math.round(size * 56 / 32);
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={h} viewBox="0 0 32 56" fill="none">
      <rect width="32" height="56" rx="2" fill="#1153ED"/>
      <path
        d="M8.35294 30.4815V22.1852C8.35294 21.5306 8.87967 21 9.52941 21H22.4706C23.1203 21 23.6471 21.5306 23.6471 22.1852V30.4815M10.7059 30.4815V25.1481C10.7059 24.4936 11.2326 23.963 11.8824 23.963H13.6471C14.2968 23.963 14.8235 24.4936 14.8235 25.1481V30.4815M17.1765 30.4815V25.1481C17.1765 24.4936 17.7032 23.963 18.3529 23.963H20.1176C20.7674 23.963 21.2941 24.4936 21.2941 25.1481V30.4815M7.7026 30.1539L8.97959 30.7971C9.32404 30.9706 9.73099 30.9633 10.0691 30.7775L12.2014 29.6059C12.5525 29.4129 12.9769 29.4129 13.3281 29.6059L15.4366 30.7645C15.7878 30.9575 16.2122 30.9575 16.5634 30.7645L18.6719 29.6059C19.0231 29.4129 19.4475 29.4129 19.7987 29.6059L21.9309 30.7775C22.269 30.9633 22.676 30.9706 23.0204 30.7971L24.2974 30.1539C25.0796 29.7599 26 30.3329 26 31.214V35.8148C26 36.4694 25.4733 37 24.8235 37H7.17647C6.52672 37 6 36.4694 6 35.8148V31.214C6 30.3329 6.92037 29.7599 7.7026 30.1539Z"
        stroke="white" strokeWidth="2"
      />
    </svg>
  );
}

/** สถานีวัดน้ำ – hexagonal hydrological gauge icon */
function GaugingIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <path d="M18.125 0.938194L32.7135 9.36084C32.7908 9.4055 32.8385 9.48803 32.8385 9.57735V26.4226C32.8385 26.512 32.7908 26.5945 32.7135 26.6392L18.125 35.0618C18.0476 35.1065 17.9524 35.1065 17.875 35.0618L3.28654 26.6392C3.20919 26.5945 3.16154 26.512 3.16154 26.4226V9.57735C3.16154 9.48803 3.20919 9.4055 3.28654 9.36084L17.875 0.938194C17.9524 0.893536 18.0476 0.893536 18.125 0.938194Z" fill="#0369a1" stroke="white" strokeWidth="2"/>
      <path d="M8 23.9457C9.02756 24.6571 10.0952 25 11.2703 25C13.2835 25 14.8429 23.9731 16.3696 22.9676C16.8832 22.6293 17.3932 22.2935 17.9155 22M8 19.1709C8.94418 19.7234 9.93195 20 11.0049 20C12.8579 20 14.2931 19.191 15.7018 18.3969C16.7332 17.8154 17.7505 17.242 18.907 17M8 14.2275C8.96823 14.7476 9.97421 15 11.0815 15C13.0422 15 14.5327 14.2176 15.9914 13.452C17.3891 12.7183 18.7576 12 20.4825 12C21.3049 12 22.0245 12.1722 22.8732 12.6266M27.9357 21.0674C27.908 19.4803 24.8562 14.9302 24.3605 14.9389C23.3691 14.9564 20.9689 19.6025 20.9959 21.1896C21.0202 22.6201 22.4868 24.9734 24.5306 24.9374C27.0041 24.8939 27.9694 23.0512 27.9357 21.0674Z" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function StationTypeIconBox({ type, size = 24 }) {
  if (type === "gauging") return <GaugingIcon size={size} />;
  return <GateIcon size={size} />;
}

// ─── CHARTS ───────────────────────────────────────────────────────────────────
function MiniSparkline({ data, color, h=28 }) {
  const W=120, H=h, pad=3;
  const max=Math.max(...data,0.001), min=Math.min(...data);
  const pts = data.map((v,i)=>{
    const x = pad + i*(W-2*pad)/(data.length-1);
    const y = H-pad-(v-min)/(max-min||1)*(H-2*pad);
    return `${x},${y}`;
  }).join(" ");
  const area = `${pad},${H-pad} ${pts} ${pad+(data.length-1)*(W-2*pad)/(data.length-1)},${H-pad}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:h}}>
      <polygon points={area} fill={color} opacity={0.12}/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  );
}

function LineChart({ datasets, labels, height=160 }) {
  const W=560, H=height, padL=40, padR=16, padT=10, padB=24;
  const allVals = datasets.flatMap(d=>d.data);
  const max=Math.max(...allVals,0.001), min=Math.min(...allVals);
  const range=max-min||1;
  const pts = (data) => data.map((v,i)=>{
    const x=padL+i*(W-padL-padR)/(data.length-1);
    const y=H-padB-(v-min)/range*(H-padT-padB);
    return `${x},${y}`;
  }).join(" ");
  const yTicks = [0,0.25,0.5,0.75,1].map(t=>min+t*range);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height}}>
      {yTicks.map((v,i)=>{
        const y=H-padB-(v-min)/range*(H-padT-padB);
        return <g key={i}>
          <line x1={padL} y1={y} x2={W-padR} y2={y} stroke="#f3f4f6" strokeWidth={1}/>
          <text x={padL-4} y={y+4} fontSize={8} fill="#9ca3af" textAnchor="end">{v.toFixed(2)}</text>
        </g>;
      })}
      {datasets.map((ds,di)=>{
        const p=pts(ds.data);
        const xN=padL+(ds.data.length-1)*(W-padL-padR)/(ds.data.length-1);
        const areaStr=`${padL},${H-padB} ${p} ${xN},${H-padB}`;
        return <g key={di}>
          <polygon points={areaStr} fill={ds.color} opacity={0.07}/>
          <polyline points={p} fill="none" stroke={ds.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={ds.dashed?"5 3":"none"}/>
        </g>;
      })}
      {labels.filter((_,i)=>i%4===0).map((l,i)=>{
        const idx=i*4;
        const x=padL+idx*(W-padL-padR)/(labels.length-1);
        return <text key={i} x={x} y={H-4} fontSize={8} fill="#9ca3af" textAnchor="middle">{l}</text>;
      })}
    </svg>
  );
}

function BarChart({ data, color="#3b82f6", height=120 }) {
  const W=560, H=height, padL=40, padR=16, padT=8, padB=24;
  const max=Math.max(...data,0.001);
  const bw=(W-padL-padR)/data.length*0.6;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height}}>
      {[0,0.5,1].map((t,i)=>{
        const v=t*max, y=H-padB-(v/max)*(H-padT-padB);
        return <g key={i}>
          <line x1={padL} y1={y} x2={W-padR} y2={y} stroke="#f3f4f6" strokeWidth={1}/>
          <text x={padL-4} y={y+4} fontSize={8} fill="#9ca3af" textAnchor="end">{v.toFixed(0)}</text>
        </g>;
      })}
      {data.map((v,i)=>{
        const bh=(v/max)*(H-padT-padB);
        const x=padL+i*(W-padL-padR)/data.length+(W-padL-padR)/data.length*0.2;
        return <rect key={i} x={x} y={H-padB-bh} width={bw} height={bh} fill={color} rx={2} opacity={0.7}/>;
      })}
      {HOURS.filter(h=>h%4===0).map(h=>{
        const x=padL+h*(W-padL-padR)/data.length+(W-padL-padR)/data.length*0.5;
        return <text key={h} x={x} y={H-4} fontSize={8} fill="#9ca3af" textAnchor="middle">{String(h).padStart(2,"0")}:00</text>;
      })}
    </svg>
  );
}

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
function StatusBadge({ status, small = false }) {
  const cfg = stCfg(status);
  const Icon = status === "ok" ? IconCheckCircle : status === "warn" ? IconWarn : IconAlert;
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:4,
      padding: small ? "2px 6px" : "3px 9px",
      borderRadius:4, fontSize: small ? 10 : 11, fontWeight:600,
      background:cfg.bg, color:cfg.color,
      border:`1px solid ${cfg.border}`, whiteSpace:"nowrap",
      letterSpacing:"0.01em"
    }}>
      <Icon size={small?10:12} color={cfg.color}/>{cfg.label}
    </span>
  );
}

// ─── STATS POPUP ──────────────────────────────────────────────────────────────
function StatsPopup({ filterKey, label, color, bg, onStationClick, onClose }) {
  const filtered = filterKey === "all"
    ? STATIONS
    : STATIONS.filter(s => s.status === filterKey);
  const typeLabel = t => t === "gate" ? "ปตร./สน.ปตร." : "สถานีวัดน้ำ";
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.5)",zIndex:1002,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"}}
      onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:"#fff",borderRadius:16,width:560,maxHeight:"78vh",display:"flex",flexDirection:"column",boxShadow:"0 32px 80px rgba(0,0,0,0.25)",overflow:"hidden",animation:"popIn .18s ease"}}>
        <div style={{padding:"18px 22px 14px",borderBottom:`1px solid #f3f4f6`,display:"flex",alignItems:"center",justifyContent:"space-between",background:"#fafafa"}}>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:"#0f172a"}}>{label}</div>
            <div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>{filtered.length} สถานี · คลิกเพื่อดูรายละเอียด</div>
          </div>
          <button onClick={onClose} style={{width:30,height:30,borderRadius:6,border:"1px solid #e5e7eb",background:"#fff",cursor:"pointer",fontSize:16,color:"#94a3b8",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>
        <div style={{overflowY:"auto",flex:1,padding:"12px 16px",display:"flex",flexDirection:"column",gap:6}}>
          {filtered.length === 0 && (
            <div style={{textAlign:"center",padding:"40px 20px",color:"#9ca3af",fontSize:13}}>ไม่มีสถานีในสถานะนี้</div>
          )}
          {filtered.map(st => {
            const cfg = stCfg(st.status);
            return (
              <div key={st.id} onClick={() => { onStationClick(st); onClose(); }}
                style={{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",borderRadius:8,border:"1px solid #f1f5f9",background:"#fff",cursor:"pointer",transition:"all .12s",borderLeft:`3px solid ${cfg.color}`}}
                onMouseEnter={e=>{e.currentTarget.style.background="#f8fafc";}}
                onMouseLeave={e=>{e.currentTarget.style.background="#fff";}}>
                <div style={{flexShrink:0}}><StationTypeIconBox type={st.type} size={20}/></div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:600,color:"#0f172a",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{st.name}</div>
                  <div style={{fontSize:11,color:"#94a3b8",marginTop:1}}>{typeLabel(st.type)} · {st.info.province}</div>
                </div>
                <div style={{display:"flex",gap:14,alignItems:"center",flexShrink:0}}>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:10,color:"#94a3b8"}}>ระดับน้ำ</div>
                    <div style={{fontSize:14,fontWeight:700,color:"#1d4ed8",fontFamily:"'IBM Plex Mono',monospace"}}>{st.level.toFixed(2)} ม.</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:10,color:"#94a3b8"}}>อัตราไหล</div>
                    <div style={{fontSize:12,fontWeight:600,color:"#047857",fontFamily:"'IBM Plex Mono',monospace"}}>{st.flow.toFixed(1)} ม³/วิ</div>
                  </div>
                  <div style={{width:52,height:22}}><MiniSparkline data={st.series.level} color={cfg.color} h={22}/></div>
                  <StatusBadge status={st.status} small/>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{padding:"8px 16px",borderTop:"1px solid #f3f4f6",background:"#fafafa",fontSize:10,color:"#94a3b8",textAlign:"center"}}>
          ข้อมูล ณ วันที่ 23/04/2569 เวลา 08:51 น. · กรมชลประทาน
        </div>
      </div>
    </div>
  );
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
function StationModal({ station, onClose }) {
  const [tab, setTab] = useState("water");
  const { info } = station;
  const cfg = stCfg(station.status);
  const typeLabel = station.type==="gauging" ? "สถานีวัดน้ำอัตโนมัติ" : "ประตูระบายน้ำ / สถานีสูบน้ำ";
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.45)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(3px)"}}
      onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div style={{background:"#fff",borderRadius:14,width:700,maxHeight:"90vh",display:"flex",flexDirection:"column",boxShadow:"0 24px 64px rgba(0,0,0,0.2)",overflow:"hidden"}}>
        {/* Header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 22px",borderBottom:"1px solid #f1f5f9",background:"#fafafa"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{flexShrink:0}}><StationTypeIconBox type={station.type} size={34}/></div>
            <div>
              <div style={{fontSize:15,fontWeight:700,color:"#0f172a"}}>{station.name}</div>
              <div style={{fontSize:11,color:"#94a3b8",marginTop:1}}>{typeLabel} · {info.province}</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <StatusBadge status={station.status}/>
            <button onClick={onClose} style={{width:28,height:28,borderRadius:6,border:"1px solid #e5e7eb",background:"#fff",cursor:"pointer",fontSize:16,color:"#94a3b8",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
          </div>
        </div>
        {/* Tabs */}
        <div style={{display:"flex",padding:"0 22px",background:"#fff",borderBottom:"1px solid #f1f5f9"}}>
          {[["water","ข้อมูลน้ำ"],["building","ข้อมูลอาคาร"]].map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)}
              style={{padding:"10px 18px",fontSize:13,fontWeight:tab===id?700:500,color:tab===id?"#1d4ed8":"#6b7280",border:"none",borderBottom:tab===id?"2px solid #1d4ed8":"2px solid transparent",background:"none",cursor:"pointer"}}>
              {label}
            </button>
          ))}
        </div>
        <div style={{overflowY:"auto",flex:1,padding:"18px 22px"}}>
          {/* Info banner */}
          <div style={{background:"#f8fafc",borderRadius:10,padding:14,marginBottom:14,display:"flex",alignItems:"flex-start",gap:14,border:"1px solid #e2e8f0"}}>
            <div style={{flexShrink:0}}><StationTypeIconBox type={station.type} size={40}/></div>
            <div style={{flex:1}}>
              <div style={{fontSize:16,fontWeight:700,color:"#0f172a"}}>{station.name}</div>
              <div style={{fontSize:12,color:"#64748b",marginTop:3,lineHeight:1.6}}>{station.desc}</div>
              <div style={{marginTop:8,display:"flex",alignItems:"center",gap:6}}>
                <span style={{padding:"2px 10px",borderRadius:4,fontSize:11,fontWeight:600,background:"#eff6ff",color:"#1d4ed8",border:"1px solid #bfdbfe"}}>{typeLabel}</span>
                <StatusBadge status={station.status} small/>
              </div>
            </div>
            <div style={{width:150,height:88,borderRadius:8,border:"1px solid #e2e8f0",background:"linear-gradient(135deg,#f1f5f9,#e2e8f0)",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:4}}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
              <div style={{fontSize:9,color:"#94a3b8",letterSpacing:"0.05em"}}>ภาพจากระบบ SCADA</div>
            </div>
          </div>

          {tab==="water" && (
            <>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
                {[
                  {label:"ระดับน้ำปัจจุบัน",value:`${station.level.toFixed(2)} ม.รทก.`,color:"#1d4ed8",ser:"level"},
                  {label:"อัตราการไหล",value:`${station.flow.toFixed(1)} ม³/วิ`,color:"#047857",ser:"flow"},
                  {label:"สถานะล่าสุด",value:null,badge:true},
                ].map((item,i)=>(
                  <div key={i} style={{background:"#f8fafc",borderRadius:8,padding:"12px 14px",border:"1px solid #e2e8f0"}}>
                    <div style={{fontSize:10,color:"#94a3b8",marginBottom:4,letterSpacing:"0.03em",textTransform:"uppercase"}}>{item.label}</div>
                    {item.badge
                      ? <div style={{marginTop:6}}><StatusBadge status={station.status}/></div>
                      : <div style={{fontSize:20,fontWeight:700,color:item.color,fontFamily:"'IBM Plex Mono',monospace"}}>{item.value}</div>
                    }
                    {item.ser && <div style={{marginTop:6,height:26}}><MiniSparkline data={station.series[item.ser]} color={item.color}/></div>}
                  </div>
                ))}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                <div style={{background:"#f8fafc",borderRadius:8,padding:12,border:"1px solid #e2e8f0"}}>
                  <div style={{fontSize:11,fontWeight:600,color:"#374151",marginBottom:6,display:"flex",alignItems:"center",gap:5}}>
                    <IconDroplet size={12} color="#1d4ed8"/> ระดับน้ำ 24 ชม. (ม.รทก.)
                  </div>
                  <LineChart datasets={[{data:station.series.level,color:"#1d4ed8"}]} labels={HOURS.map(h=>`${String(h).padStart(2,"0")}:00`)} height={110}/>
                </div>
                <div style={{background:"#f8fafc",borderRadius:8,padding:12,border:"1px solid #e2e8f0"}}>
                  <div style={{fontSize:11,fontWeight:600,color:"#374151",marginBottom:6,display:"flex",alignItems:"center",gap:5}}>
                    <IconRain size={12} color="#6d28d9"/> ปริมาณฝน 24 ชม. (มม.)
                  </div>
                  <BarChart data={station.series.rain} color="#6d28d9" height={110}/>
                </div>
              </div>
              {station.gate && (
                <div style={{background:"#eff6ff",borderRadius:8,padding:14,border:"1px solid #bfdbfe"}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#1d4ed8",marginBottom:8,display:"flex",alignItems:"center",gap:5}}>
                    <IconGate size={12} color="#1d4ed8"/> สถานะการเปิด-ปิดประตู
                  </div>
                  <div style={{display:"flex",gap:24}}>
                    {[["สถานะประตู",station.gate],["ความกว้างช่องน้ำ",station.width||"-"]].map(([k,v])=>(
                      <div key={k}><div style={{fontSize:10,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.04em"}}>{k}</div><div style={{fontSize:14,fontWeight:700,color:"#1d4ed8",marginTop:3}}>{v}</div></div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {tab==="building" && (
            <>
              <div style={{background:"#f8fafc",borderRadius:8,padding:14,marginBottom:10,border:"1px solid #e2e8f0"}}>
                <div style={{fontWeight:700,fontSize:12,color:"#374151",marginBottom:10,textTransform:"uppercase",letterSpacing:"0.06em",display:"flex",alignItems:"center",gap:5}}>
                  <IconLocation size={12} color="#374151"/> ที่ตั้ง
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px 24px"}}>
                  {[["จังหวัด",info.province],["อำเภอ",info.district],["ตำบล",info.subdistrict],["ภูมิภาค",info.region],["ลุ่มน้ำ",info.basin],["สำนักงานชลประทาน",info.office]].map(([k,v])=>(
                    <div key={k} style={{display:"flex",justifyContent:"space-between",paddingBottom:6,borderBottom:"1px solid #f1f5f9"}}>
                      <span style={{fontSize:12,color:"#64748b"}}>{k}</span>
                      <span style={{fontSize:12,fontWeight:600,color:"#0f172a"}}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                <div style={{background:"#f0fdf4",borderRadius:8,padding:"10px 14px",border:"1px solid #bbf7d0"}}>
                  <div style={{fontSize:10,color:"#047857",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em"}}>ละติจูด</div>
                  <div style={{fontSize:17,fontWeight:700,color:"#14532d",marginTop:4,fontFamily:"'IBM Plex Mono',monospace"}}>{info.lat}°N</div>
                </div>
                <div style={{background:"#fdf4ff",borderRadius:8,padding:"10px 14px",border:"1px solid #e9d5ff"}}>
                  <div style={{fontSize:10,color:"#7e22ce",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em"}}>ลองจิจูด</div>
                  <div style={{fontSize:17,fontWeight:700,color:"#581c87",marginTop:4,fontFamily:"'IBM Plex Mono',monospace"}}>{info.lng}°E</div>
                </div>
              </div>
              <div style={{background:"#f8fafc",borderRadius:8,padding:14,marginBottom:10,border:"1px solid #e2e8f0"}}>
                <div style={{fontWeight:700,fontSize:12,color:"#374151",marginBottom:10,textTransform:"uppercase",letterSpacing:"0.06em",display:"flex",alignItems:"center",gap:5}}>
                  <IconBuild size={12} color="#374151"/> ข้อมูลการก่อสร้าง
                </div>
                <div style={{display:"flex",gap:24}}>
                  {[["ปีที่สร้าง",info.buildYear||"N/A"],["ปีที่เสร็จ",info.completeYear||"N/A"]].map(([k,v])=>(
                    <div key={k} style={{flex:1,display:"flex",justifyContent:"space-between",paddingBottom:6,borderBottom:"1px solid #f1f5f9"}}>
                      <span style={{fontSize:12,color:"#64748b"}}>{k}</span>
                      <span style={{fontSize:12,fontWeight:600,color:"#0f172a"}}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              {info.gateCount && (
                <div style={{background:"#f8fafc",borderRadius:8,padding:14,marginBottom:10,border:"1px solid #e2e8f0"}}>
                  <div style={{fontWeight:700,fontSize:12,color:"#374151",marginBottom:10,textTransform:"uppercase",letterSpacing:"0.06em",display:"flex",alignItems:"center",gap:5}}>
                    <IconGate size={12} color="#374151"/> ข้อมูลประตูระบายน้ำ
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px 24px"}}>
                    {[["จำนวนบานประตู",info.gateCount],["ประเภท",info.gateType],["ความกว้าง",`${info.gateWidth} ม.`],["ความสูง",`${info.gateHeight} ม.`],["อัตราระบายสูงสุด",`${info.maxDischarge} ม³/วิ`],["ระดับน้ำล้น",`${info.floodLevel} ม.`],["ระดับธรณีประตู",`${info.normalLevel} ม.`],["ระยะยกสูงสุด",info.spillLevel??0]].map(([k,v])=>(
                      <div key={k} style={{display:"flex",justifyContent:"space-between",paddingBottom:6,borderBottom:"1px solid #f1f5f9"}}>
                        <span style={{fontSize:12,color:"#64748b"}}>{k}</span>
                        <span style={{fontSize:12,fontWeight:600,color:"#0f172a"}}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {info.pumps && info.pumps.length > 0 && (
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:10}}>
                  {[{label:"เครื่องสูบถาวร",key:"ถาวร",bg:"#fef2f2",accent:"#b91c1c"},{label:"กึ่งถาวร",key:"กึ่งถาวร",bg:"#eff6ff",accent:"#1d4ed8"},{label:"เพิ่มเติม",key:"เพิ่มเติม",bg:"#f0fdf4",accent:"#047857"}].map(({label,key,bg,accent})=>{
                    const data=info.pumps.find(p=>p.label===key);
                    return (
                      <div key={label} style={{background:bg,borderRadius:8,padding:12,border:"1px solid #e2e8f0"}}>
                        <div style={{fontSize:11,fontWeight:700,color:accent,marginBottom:8}}>{label}</div>
                        {[["จำนวน",data?.count??0],["ขนาด",data?.size||"—"],["สูงสุด",`${data?.maxRate??0} ม³/วิ`]].map(([k,v])=>(
                          <div key={k} style={{display:"flex",justifyContent:"space-between",paddingBottom:4}}>
                            <span style={{fontSize:11,color:"#64748b"}}>{k}</span>
                            <span style={{fontSize:11,fontWeight:600,color:"#0f172a"}}>{v}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
              <div style={{background:"#fffbeb",borderRadius:8,padding:14,border:"1px solid #fde68a"}}>
                <div style={{fontWeight:700,fontSize:12,color:"#92400e",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.06em",display:"flex",alignItems:"center",gap:5}}>
                  <IconExtra size={12} color="#92400e"/> ข้อมูลเพิ่มเติม
                </div>
                <div style={{marginBottom:8}}><div style={{fontSize:11,color:"#64748b"}}>เส้นทางการระบายน้ำ</div><div style={{fontSize:13,fontWeight:600,color:"#0f172a"}}>{info.additionalCanal}</div></div>
                <div><div style={{fontSize:11,color:"#64748b"}}>หมายเหตุ</div><div style={{fontSize:13,fontWeight:600,color:"#0f172a"}}>{info.remark}</div></div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── CAMERA SCENES ────────────────────────────────────────────────────────────
const CAM_SCENES = [
  (wPct, col) => (
    <svg viewBox="0 0 200 110" style={{width:"100%",height:"100%",display:"block"}}>
      <rect width={200} height={110} fill="#c8dff0"/><rect width={200} height={58} fill="#b8d0e8"/>
      {[20,45,70,95,120,145,168].map(x=><ellipse key={x} cx={x} cy={52} rx={12} ry={8} fill="#6a9b5a" opacity={0.7}/>)}
      <rect x={80} y={20} width={40} height={55} fill="#c0c8d0"/><rect x={85} y={25} width={30} height={45} fill="#aab2ba"/>
      <rect x={90} y={48} width={20} height={22} fill="#3b82f6" opacity={0.6}/>
      <rect x={84} y={44} width={4} height={30} fill="#8896a0"/><rect x={112} y={44} width={4} height={30} fill="#8896a0"/>
      <line x1={100} y1={20} x2={100} y2={10} stroke="#6b7280" strokeWidth={2}/><rect x={92} y={6} width={16} height={6} fill="#6b7280" rx={2}/>
      <polygon points={`0,${110-wPct*0.55} 80,${110-wPct*0.55} 80,110 0,110`} fill="#8a7060"/>
      <polygon points={`120,${110-wPct*0.55} 200,${110-wPct*0.55} 200,110 120,110`} fill="#8a7060"/>
      <rect x={0} y={110-wPct*0.55} width={80} height={wPct*0.55} fill={col} opacity={0.75}/>
      <rect x={90} y={48} width={20} height={62} fill={col} opacity={0.7}/>
      <rect x={120} y={110-wPct*0.55} width={80} height={wPct*0.55} fill={col} opacity={0.75}/>
      {[10,30,50,140,160,180].map(x=><line key={x} x1={x} y1={110-wPct*0.55+4} x2={x+8} y2={110-wPct*0.55+4} stroke="rgba(255,255,255,0.3)" strokeWidth={1} strokeLinecap="round"/>)}
      <rect x={12} y={50} width={3} height={55} fill="#e5e7eb"/>
      <line x1={8} y1={110-wPct*0.55} x2={20} y2={110-wPct*0.55} stroke="#ef4444" strokeWidth={1.5}/>
    </svg>
  ),
  (wPct, col) => (
    <svg viewBox="0 0 200 110" style={{width:"100%",height:"100%",display:"block"}}>
      <rect width={200} height={110} fill="#d4e8c2"/><rect width={200} height={55} fill="#c2d8b0"/>
      <rect x={0} y={72} width={40} height={38} fill="#b0a898"/>
      <polygon points={`40,110 60,${110-wPct*0.5} 140,${110-wPct*0.5} 160,110`} fill="#9a8870"/>
      <rect x={60} y={110-wPct*0.5} width={80} height={wPct*0.5} fill={col} opacity={0.8}/>
      <polygon points={`160,110 160,${110-wPct*0.5} 200,${110-wPct*0.5+10} 200,110`} fill="#9a8870"/>
      <rect x={125} y={55} width={3} height={55} fill="#e5e7eb"/>
      <line x1={121} y1={110-wPct*0.5} x2={131} y2={110-wPct*0.5} stroke="#ef4444" strokeWidth={1.5}/>
    </svg>
  ),
  (wPct, col) => (
    <svg viewBox="0 0 200 110" style={{width:"100%",height:"100%",display:"block"}}>
      <rect width={200} height={110} fill="#bccfdc"/>
      <rect x={0} y={40} width={60} height={70} fill="#c8cdd2"/><rect x={140} y={40} width={60} height={70} fill="#c8cdd2"/>
      <rect x={0} y={38} width={200} height={8} fill="#aab0b8"/>
      <rect x={58} y={40} width={6} height={70} fill="#909aa0"/><rect x={136} y={40} width={6} height={70} fill="#909aa0"/>
      <rect x={0} y={110-(wPct*0.65+8)} width={64} height={wPct*0.65+8} fill={col} opacity={0.82}/>
      <rect x={64} y={40+(100-wPct)*0.35} width={72} height={wPct*0.55} fill="#78828c"/>
      <rect x={136} y={110-wPct*0.35} width={64} height={wPct*0.35} fill={col} opacity={0.7}/>
      <rect x={88} y={0} width={24} height={44+(100-wPct)*0.35} fill="#6b7280"/>
    </svg>
  ),
  (wPct, col) => (
    <svg viewBox="0 0 200 110" style={{width:"100%",height:"100%",display:"block"}}>
      <rect width={200} height={110} fill="#dce8d8"/>
      <rect x={40} y={25} width={120} height={75} fill="#e8e0d8"/>
      <polygon points="30,25 100,5 170,25" fill="#d0c8c0"/>
      <rect x={55} y={35} width={25} height={30} fill="#b8c8d8"/>
      <rect x={88} y={50} width={24} height={50} fill="#6b7280"/>
      <rect x={120} y={35} width={25} height={30} fill="#b8c8d8"/>
      <rect x={0} y={90} width={200} height={20} fill="#9a8870"/>
      <rect x={0} y={110-wPct*0.18} width={200} height={wPct*0.18} fill={col} opacity={0.8}/>
    </svg>
  ),
  (wPct, col) => (
    <svg viewBox="0 0 200 110" style={{width:"100%",height:"100%",display:"block"}}>
      <rect width={200} height={110} fill="#c8dce8"/>
      <path d={`M0,${110-wPct*0.3} Q25,${106-wPct*0.3} 50,${110-wPct*0.3} Q75,${114-wPct*0.3} 100,${110-wPct*0.3} Q125,${106-wPct*0.3} 150,${110-wPct*0.3} Q175,${114-wPct*0.3} 200,${110-wPct*0.3} L200,110 L0,110 Z`} fill={col} opacity={0.75}/>
      <rect x={0} y={44} width={200} height={14} fill="#8a9870"/>
      <rect x={70} y={44} width={60} height={66} fill="#b8bec4"/>
      <rect x={76} y={110-wPct*0.45} width={48} height={wPct*0.45} fill={col} opacity={0.8}/>
      <polygon points={`0,58 70,58 70,110 0,110`} fill="#7a8868"/>
      <polygon points={`130,58 200,58 200,110 130,110`} fill="#7a8868"/>
    </svg>
  ),
  (wPct, col) => (
    <svg viewBox="0 0 200 110" style={{width:"100%",height:"100%",display:"block"}}>
      <rect width={200} height={110} fill="#e8d8c8"/>
      <rect x={20} y={30} width={160} height={60} fill="#d8cec4"/>
      <rect x={30} y={20} width={140} height={12} fill="#c8beb4"/>
      {[40,80,120,160].map(x=><rect key={x} x={x-8} y={38} width={16} height={40} fill="#c0b8b0"/>)}
      {[40,80,120,160].map(x=><rect key={x} x={x-6} y={110-wPct*0.5} width={12} height={wPct*0.5} fill={col} opacity={0.75}/>)}
      <rect x={20} y={110-wPct*0.4} width={160} height={wPct*0.4} fill={col} opacity={0.6}/>
    </svg>
  ),
  (wPct, col) => (
    <svg viewBox="0 0 200 110" style={{width:"100%",height:"100%",display:"block"}}>
      <rect width={200} height={110} fill="#ccd8e4"/>
      <ellipse cx={100} cy={55} rx={80} ry={45} fill="#b8c8d8" opacity={0.5}/>
      <circle cx={100} cy={55} r={22} fill="#8090a0" opacity={0.8}/>
      <circle cx={100} cy={55} r={14} fill="#6070a0" opacity={0.9}/>
      {[0,60,120,180,240,300].map(a=>{
        const r=22,rad=a*Math.PI/180;
        return <line key={a} x1={100} y1={55} x2={100+r*Math.cos(rad)} y2={55+r*Math.sin(rad)} stroke="white" strokeWidth={1.5} opacity={0.6}/>;
      })}
      <rect x={0} y={110-wPct*0.6} width={200} height={wPct*0.6} fill={col} opacity={0.55}/>
    </svg>
  ),
  (wPct, col) => (
    <svg viewBox="0 0 200 110" style={{width:"100%",height:"100%",display:"block"}}>
      <rect width={200} height={110} fill="#d8e8d0"/>
      {[0,40,80,120,160].map(x=>(
        <g key={x}>
          <rect x={x+10} y={50} width={20} height={55} fill="#b8bab0"/>
          <rect x={x+10} y={110-wPct*0.6} width={20} height={wPct*0.6} fill={col} opacity={0.8}/>
        </g>
      ))}
      <rect x={0} y={48} width={200} height={5} fill="#9aaa90"/>
      <rect x={0} y={110-wPct*0.35} width={200} height={wPct*0.35} fill={col} opacity={0.4}/>
    </svg>
  ),
  (wPct, col) => (
    <svg viewBox="0 0 200 110" style={{width:"100%",height:"100%",display:"block"}}>
      <rect width={200} height={110} fill="#c0d4e4"/>
      <rect x={0} y={60} width={80} height={50} fill="#b0c0cc"/>
      <rect x={120} y={60} width={80} height={50} fill="#b0c0cc"/>
      <rect x={75} y={55} width={50} height={8} fill="#8898a8"/>
      <rect x={75} y={55} width={50} height={wPct*0.5} fill={col} opacity={0.85}/>
      <rect x={0} y={110-wPct*0.4} width={80} height={wPct*0.4} fill={col} opacity={0.65}/>
      <rect x={120} y={110-wPct*0.45} width={80} height={wPct*0.45} fill={col} opacity={0.7}/>
      <rect x={90} y={10} width={20} height={48} fill="#7080a0"/>
    </svg>
  ),
];

function CameraFeed({ cam, onClick }) {
  const st = STATIONS.find(s => s.id === cam.stationId);
  const scfg = cam.status==="ok"
    ? {color:"#047857",bg:"#ecfdf5",label:"ปกติ"}
    : cam.status==="warning"
    ? {color:"#b45309",bg:"#fffbeb",label:"เฝ้าระวัง"}
    : {color:"#b91c1c",bg:"#fef2f2",label:"วิกฤต"};
  const wCol = cam.status==="danger" ? "rgba(239,68,68,0.55)" : cam.status==="warning" ? "rgba(245,158,11,0.45)" : "rgba(59,130,246,0.55)";
  const SceneRenderer = CAM_SCENES[(cam.id-1) % CAM_SCENES.length];
  return (
    <div onClick={onClick} style={{borderRadius:8,overflow:"hidden",border:"1px solid #e2e8f0",cursor:"pointer",background:"#fff",boxShadow:"0 1px 2px rgba(0,0,0,0.04)"}}>
      <div style={{position:"relative",height:72,background:"#0f1a2e",overflow:"hidden"}}>
        <SceneRenderer wPct={cam.waterPct} col={wCol}/>
        <div style={{position:"absolute",inset:0,background:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.03) 3px,rgba(0,0,0,0.03) 4px)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",top:0,left:0,right:0,background:"rgba(0,0,0,0.4)",padding:"2px 5px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:3}}>
            <div style={{width:5,height:5,borderRadius:"50%",background:scfg.color,animation:"pulse 1.5s infinite"}}/>
            <span style={{fontSize:7,color:"#fff",fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.05em"}}>REC · CAM-0{cam.id}</span>
          </div>
          <span style={{fontSize:7,color:"rgba(255,255,255,0.75)",fontFamily:"'IBM Plex Mono',monospace"}}>23-04-69 08:51:{String(cam.id).padStart(2,"0")}</span>
        </div>
        {st && (
          <div style={{position:"absolute",top:16,right:3,width:14,height:14,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <StationTypeIconBox type={st.type} size={12}/>
          </div>
        )}
        <div style={{position:"absolute",bottom:0,left:0,right:0,background:"rgba(0,0,0,0.35)",padding:"2px 5px",display:"flex",justifyContent:"space-between"}}>
          <span style={{fontSize:7,color:"rgba(255,255,255,0.75)",fontFamily:"'IBM Plex Mono',monospace"}}>WL: {cam.level} cm</span>
          <span style={{fontSize:7,color:scfg.color,fontFamily:"'IBM Plex Mono',monospace",fontWeight:600}}>{scfg.label}</span>
        </div>
      </div>
      <div style={{padding:"4px 6px"}}>
        <div style={{fontSize:8,fontWeight:600,color:"#0f172a",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{cam.name}</div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:2,alignItems:"center"}}>
          <span style={{fontSize:8,color:"#64748b",fontFamily:"'IBM Plex Mono',monospace"}}>{cam.level} ซม.</span>
          <span style={{fontSize:7,fontWeight:700,background:scfg.bg,color:scfg.color,padding:"1px 4px",borderRadius:3,border:`1px solid ${scfg.color}30`}}>{scfg.label}</span>
        </div>
      </div>
    </div>
  );
}

// ─── FLOW MAP ─────────────────────────────────────────────────────────────────
const GATE_PATH = "M8.35294 30.4815V22.1852C8.35294 21.5306 8.87967 21 9.52941 21H22.4706C23.1203 21 23.6471 21.5306 23.6471 22.1852V30.4815M10.7059 30.4815V25.1481C10.7059 24.4936 11.2326 23.963 11.8824 23.963H13.6471C14.2968 23.963 14.8235 24.4936 14.8235 25.1481V30.4815M17.1765 30.4815V25.1481C17.1765 24.4936 17.7032 23.963 18.3529 23.963H20.1176C20.7674 23.963 21.2941 24.4936 21.2941 25.1481V30.4815M7.7026 30.1539L8.97959 30.7971C9.32404 30.9706 9.73099 30.9633 10.0691 30.7775L12.2014 29.6059C12.5525 29.4129 12.9769 29.4129 13.3281 29.6059L15.4366 30.7645C15.7878 30.9575 16.2122 30.9575 16.5634 30.7645L18.6719 29.6059C19.0231 29.4129 19.4475 29.4129 19.7987 29.6059L21.9309 30.7775C22.269 30.9633 22.676 30.9706 23.0204 30.7971L24.2974 30.1539C25.0796 29.7599 26 30.3329 26 31.214V35.8148C26 36.4694 25.4733 37 24.8235 37H7.17647C6.52672 37 6 36.4694 6 35.8148V31.214C6 30.3329 6.92037 29.7599 7.7026 30.1539Z";

function FlowMap({ onStationClick }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({x:0,y:0});
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef({start:{x:0,y:0},panStart:{x:0,y:0}});
  const W=560, H=640;
  const canals = [
    {x1:155,y1:50,x2:155,y2:610,w:10,color:"rgba(59,130,246,0.22)"},
    {x1:78,y1:75,x2:155,y2:75,w:5,color:"rgba(59,130,246,0.18)"},
    {x1:78,y1:395,x2:155,y2:395,w:4,color:"rgba(59,130,246,0.16)"},
    {x1:155,y1:118,x2:275,y2:118,w:5,color:"rgba(59,130,246,0.2)"},
    {x1:155,y1:168,x2:275,y2:168,w:4,color:"rgba(59,130,246,0.18)"},
    {x1:155,y1:218,x2:275,y2:218,w:4,color:"rgba(59,130,246,0.16)"},
    {x1:155,y1:268,x2:275,y2:268,w:3,color:"rgba(59,130,246,0.14)"},
    {x1:155,y1:318,x2:275,y2:318,w:3,color:"rgba(59,130,246,0.13)"},
    {x1:275,y1:415,x2:460,y2:415,w:7,color:"rgba(59,130,246,0.22)"},
    {x1:390,y1:415,x2:390,y2:545,w:5,color:"rgba(59,130,246,0.2)"},
    {x1:155,y1:575,x2:490,y2:575,w:6,color:"rgba(59,130,246,0.2)"},
    {x1:415,y1:545,x2:415,y2:575,w:4,color:"rgba(59,130,246,0.16)"},
  ];
  const MIN_ZOOM=0.5, MAX_ZOOM=4;
  const handleWheel = useCallback((e)=>{e.preventDefault();const d=e.deltaY>0?-0.15:0.15;setZoom(z=>Math.min(MAX_ZOOM,Math.max(MIN_ZOOM,parseFloat((z+d).toFixed(2)))));},[]);
  const handleMouseDown = useCallback((e)=>{if(e.button!==0)return;dragRef.current={start:{x:e.clientX,y:e.clientY},panStart:{...pan}};setDragging(true);},[pan]);
  const handleMouseMove = useCallback((e)=>{if(!dragging)return;const{start,panStart}=dragRef.current;setPan({x:panStart.x+(e.clientX-start.x),y:panStart.y+(e.clientY-start.y)});},[dragging]);
  const handleMouseUp = useCallback(()=>setDragging(false),[]);
  const zoomIn=()=>setZoom(z=>Math.min(MAX_ZOOM,parseFloat((z+0.3).toFixed(2))));
  const zoomOut=()=>setZoom(z=>Math.max(MIN_ZOOM,parseFloat((z-0.3).toFixed(2))));
  const resetView=()=>{setZoom(1);setPan({x:0,y:0});};

  return (
    <div style={{cursor:dragging?"grabbing":"grab",position:"relative",width:"100%",height:"100%",overflow:"hidden",background:"#f8fafc",borderRadius:10,border:"1px solid #e2e8f0",userSelect:"none"}}
      onWheel={handleWheel} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      {/* Controls */}
      <div style={{position:"absolute",top:10,right:10,zIndex:10,display:"flex",flexDirection:"column",gap:3}}>
        {[{label:"+",fn:zoomIn},{label:"−",fn:zoomOut},{label:"⌂",fn:resetView}].map(({label,fn})=>(
          <button key={label} onClick={fn} style={{width:26,height:26,borderRadius:5,border:"1px solid #e2e8f0",background:"#fff",cursor:"pointer",fontSize:label==="⌂"?10:15,fontWeight:700,color:"#475569",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 1px 2px rgba(0,0,0,0.08)"}}>{label}</button>
        ))}
      </div>
      <div style={{position:"absolute",bottom:8,right:10,zIndex:10,background:"rgba(255,255,255,0.92)",border:"1px solid #e2e8f0",borderRadius:4,padding:"2px 7px",fontSize:9,color:"#64748b",fontFamily:"'IBM Plex Mono',monospace"}}>{Math.round(zoom*100)}%</div>
      <div style={{position:"absolute",bottom:8,left:10,zIndex:10,background:"rgba(255,255,255,0.85)",border:"1px solid #e2e8f0",borderRadius:4,padding:"2px 7px",fontSize:9,color:"#94a3b8"}}>เลื่อนล้อซูม · ลากเพื่อเลื่อน</div>
      <div style={{transform:`translate(${pan.x}px,${pan.y}px) scale(${zoom})`,transformOrigin:"center center",width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",transition:dragging?"none":"transform 0.1s ease"}}>
        <svg viewBox={`0 0 ${W} ${H}`} width={W*0.76} height={H*0.76} style={{fontFamily:"'Sarabun',sans-serif",display:"block",borderRadius:10}}>
          <rect width={W} height={H} fill="#f8fafc"/>
          {Array.from({length:Math.ceil(W/40)}).map((_,i)=><line key={`v${i}`} x1={i*40} y1={0} x2={i*40} y2={H} stroke="rgba(226,232,240,0.8)" strokeWidth={0.5}/>)}
          {Array.from({length:Math.ceil(H/40)}).map((_,i)=><line key={`h${i}`} x1={0} y1={i*40} x2={W} y2={i*40} stroke="rgba(226,232,240,0.8)" strokeWidth={0.5}/>)}
          {canals.map((c,i)=><line key={i} x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2} stroke={c.color} strokeWidth={c.w} strokeLinecap="round"/>)}
          <text x={460} y={600} fontSize={10} fill="#94a3b8" textAnchor="middle" fontStyle="italic">▼ อ่าวไทย</text>
          {STATIONS.map(st=>{
            const cfg=stCfg(st.status);
            const isGauging=st.type==="gauging";
            return (
              <g key={st.id} style={{cursor:"pointer"}} onClick={e=>{e.stopPropagation();if(!dragging)onStationClick?.(st);}}>
                {/* Outer ring */}
                <circle cx={st.x} cy={st.y} r={22} fill={cfg.bg} stroke={cfg.border} strokeWidth={1.8} opacity={0.95}/>
                {/* Icon fill */}
                {isGauging ? (
                  // Hexagon gauging icon in map
                  <g transform={`translate(${st.x-10},${st.y-11}) scale(0.575)`}>
                    <path d="M18.125 0.938194L32.7135 9.36084C32.7908 9.4055 32.8385 9.48803 32.8385 9.57735V26.4226C32.8385 26.512 32.7908 26.5945 32.7135 26.6392L18.125 35.0618C18.0476 35.1065 17.9524 35.1065 17.875 35.0618L3.28654 26.6392C3.20919 26.5945 3.16154 26.512 3.16154 26.4226V9.57735C3.16154 9.48803 3.20919 9.4055 3.28654 9.36084L17.875 0.938194C17.9524 0.893536 18.0476 0.893536 18.125 0.938194Z" fill="#0369a1" stroke="white" strokeWidth="2.5"/>
                    <path d="M8 23.9457C9.02756 24.6571 10.0952 25 11.2703 25C13.2835 25 14.8429 23.9731 16.3696 22.9676C16.8832 22.6293 17.3932 22.2935 17.9155 22M8 19.1709C8.94418 19.7234 9.93195 20 11.0049 20C12.8579 20 14.2931 19.191 15.7018 18.3969C16.7332 17.8154 17.7505 17.242 18.907 17M8 14.2275C8.96823 14.7476 9.97421 15 11.0815 15C13.0422 15 14.5327 14.2176 15.9914 13.452C17.3891 12.7183 18.7576 12 20.4825 12C21.3049 12 22.0245 12.1722 22.8732 12.6266M27.9357 21.0674C27.908 19.4803 24.8562 14.9302 24.3605 14.9389C23.3691 14.9564 20.9689 19.6025 20.9959 21.1896C21.0202 22.6201 22.4868 24.9734 24.5306 24.9374C27.0041 24.8939 27.9694 23.0512 27.9357 21.0674Z" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
                  </g>
                ) : (
                  // Gate icon in map
                  <g>
                    <circle cx={st.x} cy={st.y} r={14} fill="#1153ED"/>
                    <g transform={`translate(${st.x-9.5},${st.y-10}) scale(0.595)`}>
                      <path d={GATE_PATH} stroke="white" strokeWidth="2.2" fill="none"/>
                    </g>
                  </g>
                )}
                {/* Label */}
                <rect x={st.x+16} y={st.y-12} width={st.shortName.length*5.6+10} height={14} fill="rgba(255,255,255,0.97)" rx={3} stroke={cfg.border} strokeWidth={0.5}/>
                <text x={st.x+21} y={st.y+0.5} fontSize={8.5} fill={cfg.color} fontWeight="700">{st.shortName}</text>
                <rect x={st.x+16} y={st.y+4} width={64} height={12} fill="rgba(255,255,255,0.94)" rx={3} stroke="#e2e8f0" strokeWidth={0.5}/>
                <text x={st.x+18} y={st.y+12.5} fontSize={7.5} fill="#475569" fontFamily="'IBM Plex Mono',monospace">{`${st.level.toFixed(2)}m ${st.flow.toFixed(1)}m³/s`}</text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ station, onClick }) {
  const cfg = stCfg(station.status);
  return (
    <div onClick={()=>onClick(station)} style={{borderRadius:7,padding:"9px 11px",border:"1px solid #f1f5f9",background:"#fff",cursor:"pointer",boxShadow:"0 1px 2px rgba(0,0,0,0.03)",borderLeft:`2.5px solid ${cfg.color}`,transition:"all .12s"}}
      onMouseEnter={e=>{e.currentTarget.style.background="#f8fafc";e.currentTarget.style.boxShadow="0 2px 6px rgba(0,0,0,0.07)";}}
      onMouseLeave={e=>{e.currentTarget.style.background="#fff";e.currentTarget.style.boxShadow="0 1px 2px rgba(0,0,0,0.03)";}}>
      <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:3}}>
        <div style={{flexShrink:0}}><StationTypeIconBox type={station.type} size={13}/></div>
        <span style={{fontSize:9,color:"#64748b",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontWeight:500}}>{station.shortName}</span>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
        <span style={{fontSize:15,fontWeight:700,color:"#0f172a",fontFamily:"'IBM Plex Mono',monospace"}}>{station.level.toFixed(2)} <span style={{fontSize:9,color:"#94a3b8",fontFamily:"inherit"}}>ม.</span></span>
        <StatusBadge status={station.status} small/>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:5,alignItems:"center"}}>
        <span style={{fontSize:9,color:"#64748b",fontFamily:"'IBM Plex Mono',monospace"}}>{station.flow.toFixed(1)} ม³/วิ</span>
        <div style={{width:56,height:18}}><MiniSparkline data={station.series.level} color={cfg.color} h={18}/></div>
      </div>
    </div>
  );
}

function Chip({children,active,onClick,color="#1d4ed8"}){
  return (
    <button onClick={onClick} style={{padding:"4px 12px",borderRadius:4,border:`1px solid ${active?color:"#e2e8f0"}`,fontSize:11,cursor:"pointer",background:active?`${color}12`:"#fff",color:active?color:"#64748b",fontWeight:active?600:400,whiteSpace:"nowrap",transition:"all .1s"}}>
      {children}
    </button>
  );
}

// ─── FORECAST TAB ─────────────────────────────────────────────────────────────
function ForecastTab() {
  const [forecastStation, setForecastStation] = useState("T1");
  const [forecastRange, setForecastRange] = useState("48");
  const st = STATIONS.find(s=>s.id===forecastStation) || STATIONS[0];
  const hrs = parseInt(forecastRange) || 48;
  const base = st.series.level[st.series.level.length-1];
  const trend = st.status==="danger" ? 0.008 : st.status==="warn" ? 0.003 : -0.002;
  const forecastData = Array.from({length:hrs},(_,i)=>Math.max(0,parseFloat((base+trend*i+Math.sin(i*0.5)*0.015).toFixed(3))));
  const bestCase  = forecastData.map(v=>Math.max(0,parseFloat((v-0.018).toFixed(3))));
  const worstCase = forecastData.map((v,i)=>parseFloat((v+0.025*i/hrs).toFixed(3)));
  const rainForecast = Array.from({length:hrs},(_,i)=>parseFloat((i<6?0:i<12?Math.random()*7:i<24?Math.random()*3:Math.random()*1.5).toFixed(1)));
  const maxForecast = Math.max(...forecastData);
  const riskColor = st.status==="danger"?"#b91c1c":st.status==="warn"?"#b45309":"#047857";
  const riskBg    = st.status==="danger"?"#fef2f2":st.status==="warn"?"#fffbeb":"#ecfdf5";
  const riskLabel = st.status==="danger"?"วิกฤต – ต้องเฝ้าระวังเข้ม":st.status==="warn"?"เฝ้าระวัง – แนวโน้มสูงขึ้น":"ปกติ – สถานการณ์อยู่ในเกณฑ์ดี";
  const W=560,H=180,padL=42,padR=16,padT=16,padB=24;
  const allVals=[...forecastData,...bestCase,...worstCase];
  const maxV=Math.max(...allVals)+0.05,minV=Math.max(0,Math.min(...allVals)-0.02),range=maxV-minV||1;
  const toX=(i)=>padL+i*(W-padL-padR)/(forecastData.length-1);
  const toY=(v)=>H-padB-(v-minV)/range*(H-padT-padB);
  const ptsMain=forecastData.map((v,i)=>`${toX(i)},${toY(v)}`).join(" ");
  const ptsBest=bestCase.map((v,i)=>`${toX(i)},${toY(v)}`).join(" ");
  const ptsWorst=worstCase.map((v,i)=>`${toX(i)},${toY(v)}`).join(" ");
  const areaMain=`${toX(0)},${H-padB} ${ptsMain} ${toX(forecastData.length-1)},${H-padB}`;
  const normY=toY(st.info.normalLevel);
  const step=Math.ceil(hrs/6);
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
      <div style={{padding:"10px 20px",background:"#fff",borderBottom:"1px solid #f1f5f9",display:"flex",flexWrap:"wrap",gap:12,alignItems:"center",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:10,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em"}}>สถานี</span>
          <select value={forecastStation} onChange={e=>setForecastStation(e.target.value)}
            style={{padding:"4px 10px",border:"1px solid #e2e8f0",borderRadius:5,fontSize:12,fontFamily:"'Sarabun',sans-serif",background:"#fff",color:"#0f172a"}}>
            {STATIONS.map(s=><option key={s.id} value={s.id}>{s.shortName}</option>)}
          </select>
        </div>
        <div style={{display:"flex",gap:5,alignItems:"center"}}>
          <span style={{fontSize:10,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em"}}>ช่วงเวลา</span>
          {["24","48","72"].map(v=>(
            <Chip key={v} active={forecastRange===v} onClick={()=>setForecastRange(v)}>{v} ชม.</Chip>
          ))}
        </div>
        <div style={{marginLeft:"auto",padding:"4px 12px",borderRadius:4,background:riskBg,color:riskColor,fontSize:11,fontWeight:600,border:`1px solid ${riskColor}30`}}>
          {riskLabel}
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:16,display:"flex",flexDirection:"column",gap:12}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
          {[
            {Icon:IconDroplet,label:"ระดับปัจจุบัน",value:`${base.toFixed(2)} ม.`,color:"#1d4ed8",bg:"#eff6ff"},
            {Icon:IconWarn,label:"คาดสูงสุด",value:`${maxForecast.toFixed(2)} ม.`,color:"#b45309",bg:"#fffbeb"},
            {Icon:IconRain,label:"ฝนสะสม (คาด)",value:`${rainForecast.slice(0,24).reduce((a,b)=>a+b,0).toFixed(1)} มม.`,color:"#6d28d9",bg:"#faf5ff"},
            {Icon:IconChart,label:"แนวโน้ม",value:st.status==="danger"?"↑ สูงขึ้น":st.status==="warn"?"→ ทรงตัว":"↓ ลดลง",color:riskColor,bg:riskBg},
          ].map((s,i)=>(
            <div key={i} style={{background:s.bg,borderRadius:8,padding:12,border:"1px solid #e2e8f0"}}>
              <s.Icon size={14} color={s.color}/>
              <div style={{fontSize:10,color:"#94a3b8",margin:"4px 0 2px",textTransform:"uppercase",letterSpacing:"0.04em"}}>{s.label}</div>
              <div style={{fontSize:16,fontWeight:700,color:s.color,fontFamily:"'IBM Plex Mono',monospace"}}>{s.value}</div>
            </div>
          ))}
        </div>
        <div style={{background:"#fff",borderRadius:10,padding:16,border:"1px solid #e2e8f0"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:"#0f172a"}}>คาดการณ์ระดับน้ำ – {st.shortName}</div>
              <div style={{fontSize:10,color:"#94a3b8",marginTop:2}}>{hrs} ชั่วโมงถัดไป · อัพเดท 23/04/2569 08:51 น.</div>
            </div>
            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              {[["#1d4ed8","คาดการณ์หลัก"],["#047857","กรณีดีที่สุด"],["#b45309","กรณีเลวร้าย"]].map(([c,l])=>(
                <div key={l} style={{display:"flex",alignItems:"center",gap:5,fontSize:10,color:"#64748b"}}>
                  <div style={{width:14,height:2,background:c}}/>{l}
                </div>
              ))}
            </div>
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:H}}>
            <rect x={padL} y={padT} width={W-padL-padR} height={normY-padT} fill="rgba(254,226,226,0.25)"/>
            <line x1={padL} y1={normY} x2={W-padR} y2={normY} stroke="#b91c1c" strokeWidth={1} strokeDasharray="4 2"/>
            <text x={W-padR-2} y={normY-3} fontSize={8} fill="#b91c1c" textAnchor="end">ระดับปกติ {st.info.normalLevel} ม.</text>
            {[0,0.25,0.5,0.75,1].map((t,i)=>{const v=minV+t*range,y=toY(v);return <g key={i}><line x1={padL} y1={y} x2={W-padR} y2={y} stroke="#f1f5f9" strokeWidth={1}/><text x={padL-4} y={y+4} fontSize={8} fill="#94a3b8" textAnchor="end">{v.toFixed(2)}</text></g>;})}
            <polygon points={areaMain} fill="#1d4ed8" opacity={0.07}/>
            <polyline points={ptsWorst} fill="none" stroke="#b45309" strokeWidth={1.5} strokeDasharray="4 3" opacity={0.7}/>
            <polyline points={ptsBest}  fill="none" stroke="#047857" strokeWidth={1.5} strokeDasharray="4 3" opacity={0.7}/>
            <polyline points={ptsMain}  fill="none" stroke="#1d4ed8" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round"/>
            {Array.from({length:forecastData.length},(_,i)=>i).filter(i=>i%step===0).map(i=>(
              <text key={i} x={toX(i)} y={H-4} fontSize={8} fill="#94a3b8" textAnchor="middle">+{i}ชม.</text>
            ))}
          </svg>
        </div>
        <div style={{background:"#fff",borderRadius:10,padding:16,border:"1px solid #e2e8f0"}}>
          <div style={{fontSize:12,fontWeight:700,color:"#0f172a",marginBottom:4,display:"flex",alignItems:"center",gap:5}}>
            <IconRain size={12} color="#6d28d9"/> คาดการณ์ปริมาณน้ำฝน ({hrs} ชม.)
          </div>
          <BarChart data={rainForecast} color="#6d28d9" height={100}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div style={{background:"#fff",borderRadius:10,padding:16,border:"1px solid #e2e8f0"}}>
            <div style={{fontSize:12,fontWeight:700,color:"#0f172a",marginBottom:10}}>การประเมินความเสี่ยง</div>
            <div style={{display:"flex",flexDirection:"column",gap:7}}>
              {[
                ["ความน่าจะเป็นน้ำท่วม",st.status==="danger"?"สูง (80%)":st.status==="warn"?"ปานกลาง (40%)":"ต่ำ (10%)",riskColor],
                ["ช่วงเวลาเสี่ยง",st.status==="danger"?"6–12 ชม.":st.status==="warn"?"18–24 ชม.":"ไม่มีในช่วงนี้","#0f172a"],
                ["คำแนะนำ",st.status==="danger"?"เปิดประตูฉุกเฉิน":st.status==="warn"?"เฝ้าระวังต่อเนื่อง":"ปฏิบัติงานปกติ","#0f172a"],
                ["แบบจำลอง","HEC-RAS + SCADA","#64748b"],
              ].map(([k,v,col])=>(
                <div key={k} style={{background:"#f8fafc",borderRadius:6,padding:"9px 11px",border:"1px solid #f1f5f9"}}>
                  <div style={{fontSize:9,color:"#94a3b8",marginBottom:2,textTransform:"uppercase",letterSpacing:"0.05em"}}>{k}</div>
                  <div style={{fontSize:12,fontWeight:600,color:col}}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{background:"#fff",borderRadius:10,padding:16,border:"1px solid #e2e8f0"}}>
            <div style={{fontSize:12,fontWeight:700,color:"#0f172a",marginBottom:10}}>ไทม์ไลน์การแจ้งเตือน</div>
            <div style={{position:"relative",paddingLeft:20}}>
              <div style={{position:"absolute",left:4,top:6,bottom:6,width:1,background:"#e2e8f0"}}/>
              {[
                ["08:51","ตรวจสอบระดับน้ำ",st.status,`ระดับน้ำ ${base.toFixed(2)} ม.`],
                ["09:00","คาดการณ์ 1 ชม.",st.status,`${forecastData[1]?.toFixed(2)||base.toFixed(2)} ม.`],
                ["14:00","คาดการณ์ 6 ชม.",st.status==="danger"?"danger":"ok",`${forecastData[6]?.toFixed(2)||base.toFixed(2)} ม.`],
                ["+18ชม.","คาดการณ์ระยะกลาง","ok",`${forecastData[18]?.toFixed(2)||base.toFixed(2)} ม.`],
              ].map(([time,label,sts,desc])=>{
                const c=stCfg(sts);
                return (
                  <div key={time} style={{display:"flex",gap:10,marginBottom:11,position:"relative"}}>
                    <div style={{position:"absolute",left:-16,top:4,width:9,height:9,borderRadius:"50%",background:"#fff",border:`2px solid ${c.color}`}}/>
                    <div style={{width:48,flexShrink:0,fontSize:9,color:"#94a3b8",fontFamily:"'IBM Plex Mono',monospace",paddingTop:2}}>{time}</div>
                    <div>
                      <div style={{fontSize:11,fontWeight:600,color:"#0f172a"}}>{label}</div>
                      <div style={{fontSize:10,color:"#64748b"}}>{desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function WaterDashboard() {
  const [activeTab, setActiveTab]   = useState("dashboard");
  const [time, setTime]             = useState("");
  const [selectedStation, setSelectedStation] = useState(null);
  const [statsPopup, setStatsPopup] = useState(null);
  const [selectedForChart, setSelectedForChart] = useState(new Set(["T1","T14"]));
  const [activeMetric, setActiveMetric] = useState("level");
  const [activeTimeRange, setActiveTimeRange] = useState("24 ชม.");
  useEffect(()=>{
    const tick=()=>setTime(new Date().toLocaleTimeString("th-TH",{hour12:false}));
    tick();const t=setInterval(tick,1000);return()=>clearInterval(t);
  },[]);
  const toggleChart=(id)=>{
    setSelectedForChart(prev=>{const next=new Set(prev);next.has(id)?next.delete(id):next.add(id);return next;});
  };
  const compareStations = STATION_LIST_FOR_COMPARE.map(id=>STATIONS.find(s=>s.id===id)).filter(Boolean);
  const chartDatasets = compareStations.filter(s=>selectedForChart.has(s.id)).map((s,i)=>({
    data:s.series[activeMetric]||s.series.level,
    color:CHART_COLORS[STATION_LIST_FOR_COMPARE.indexOf(s.id)%CHART_COLORS.length],
    label:s.shortName, dashed:i%2===1
  }));

  const summaryStats = [
    {label:"สถานีทั้งหมด", value:STATIONS.length,                                  Icon:IconStation,color:"#1d4ed8",bg:"#eff6ff", filterKey:"all"},
    {label:"สถานีปกติ",   value:STATIONS.filter(s=>s.status==="ok").length,       Icon:IconCheckCircle,color:"#047857",bg:"#ecfdf5", filterKey:"ok"},
    {label:"เฝ้าระวัง",  value:STATIONS.filter(s=>s.status==="warn").length,     Icon:IconWarn,color:"#b45309",bg:"#fffbeb", filterKey:"warn"},
    {label:"วิกฤต",       value:STATIONS.filter(s=>s.status==="danger").length,   Icon:IconAlert,color:"#b91c1c",bg:"#fef2f2", filterKey:"danger"},
    {label:"น้ำเฉลี่ย",  value:"7.4 ม³/วิ",Icon:IconDroplet,color:"#0e7490",bg:"#f0f9ff", filterKey:"all"},
    {label:"ฝน 24 ชม.",  value:"2.1 มม.",Icon:IconRain,color:"#6d28d9",bg:"#faf5ff", filterKey:"all"},
  ];

  const tabs = [
    {id:"dashboard",label:"Dashboard",Icon:IconDashboard},
    {id:"compare",  label:"เปรียบเทียบ",Icon:IconChart},
    {id:"forecast", label:"คาดการณ์",  Icon:IconForecast},
    {id:"flowmap",  label:"ผังน้ำ",     Icon:IconMap},
  ];

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",overflow:"hidden",background:"#f1f5f9",color:"#0f172a",fontFamily:"'Sarabun',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        * { box-sizing:border-box; }
        button { font-family:inherit; }
        ::-webkit-scrollbar { width:5px; height:5px; }
        ::-webkit-scrollbar-track { background:#f1f5f9; }
        ::-webkit-scrollbar-thumb { background:#cbd5e1; border-radius:4px; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
        @keyframes popIn { from{opacity:0;transform:scale(0.96) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
      `}</style>

      {/* HEADER */}
      <header style={{height:54,background:"#fff",borderBottom:"1px solid #e2e8f0",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px",flexShrink:0,boxShadow:"0 1px 3px rgba(0,0,0,0.05)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          {/* Logo */}
          <div style={{width:36,height:36,borderRadius:8,background:"#1d4ed8",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="20" height="20" viewBox="0 0 36 36" fill="none">
              <path d="M18.125 0.938194L32.7135 9.36084C32.7908 9.4055 32.8385 9.48803 32.8385 9.57735V26.4226C32.8385 26.512 32.7908 26.5945 32.7135 26.6392L18.125 35.0618C18.0476 35.1065 17.9524 35.1065 17.875 35.0618L3.28654 26.6392C3.20919 26.5945 3.16154 26.512 3.16154 26.4226V9.57735C3.16154 9.48803 3.20919 9.4055 3.28654 9.36084L17.875 0.938194C17.9524 0.893536 18.0476 0.893536 18.125 0.938194Z" fill="white" opacity="0.25" stroke="white" strokeWidth="2"/>
              <path d="M8 23.9457C9.02756 24.6571 10.0952 25 11.2703 25C13.2835 25 14.8429 23.9731 16.3696 22.9676C16.8832 22.6293 17.3932 22.2935 17.9155 22M8 19.1709C8.94418 19.7234 9.93195 20 11.0049 20C12.8579 20 14.2931 19.191 15.7018 18.3969C16.7332 17.8154 17.7505 17.242 18.907 17M8 14.2275C8.96823 14.7476 9.97421 15 11.0815 15C13.0422 15 14.5327 14.2176 15.9914 13.452C17.3891 12.7183 18.7576 12 20.4825 12C21.3049 12 22.0245 12.1722 22.8732 12.6266M27.9357 21.0674C27.908 19.4803 24.8562 14.9302 24.3605 14.9389C23.3691 14.9564 20.9689 19.6025 20.9959 21.1896C21.0202 22.6201 22.4868 24.9734 24.5306 24.9374C27.0041 24.8939 27.9694 23.0512 27.9357 21.0674Z" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:"#0f172a",letterSpacing:"0.01em"}}>โครงการส่งน้ำและบำรุงรักษาภาษีเจริญ</div>
            <div style={{fontSize:10,color:"#94a3b8",letterSpacing:"0.03em"}}>Phasee Charoen Irrigation Project · Real-time Monitoring System</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:10,color:"#94a3b8"}}>วันพฤหัสบดีที่ 23 เมษายน 2569</div>
            <div style={{fontSize:10,color:"#047857",fontWeight:600}}>ข้อมูล ณ เวลา 08:51 น.</div>
          </div>
          <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:14,color:"#1d4ed8",fontWeight:600,letterSpacing:"0.05em"}}>{time}</div>
          <div style={{display:"flex",alignItems:"center",gap:6,background:"#ecfdf5",border:"1px solid #6ee7b7",padding:"4px 10px",borderRadius:4}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:"#047857",animation:"pulse 2s infinite"}}/>
            <span style={{fontSize:10,color:"#047857",fontWeight:700,letterSpacing:"0.06em"}}>ONLINE</span>
          </div>
        </div>
      </header>

      {/* TABS */}
      <nav style={{background:"#fff",borderBottom:"1px solid #e2e8f0",display:"flex",gap:0,padding:"0 24px",flexShrink:0}}>
        {tabs.map(({id,label,Icon})=>(
          <button key={id} onClick={()=>setActiveTab(id)}
            style={{display:"flex",alignItems:"center",gap:6,padding:"10px 18px",fontSize:12,fontWeight:activeTab===id?700:500,
              color:activeTab===id?"#1d4ed8":"#64748b",border:"none",
              borderBottom:activeTab===id?"2px solid #1d4ed8":"2px solid transparent",
              background:"none",cursor:"pointer",transition:"all .12s",letterSpacing:"0.01em"}}>
            <Icon size={13} color={activeTab===id?"#1d4ed8":"#94a3b8"}/>{label}
          </button>
        ))}
      </nav>

      {/* CONTENT */}
      <div style={{flex:1,overflow:"hidden"}}>

        {/* DASHBOARD */}
        {activeTab==="dashboard" && (
          <div style={{display:"grid",gridTemplateColumns:"198px 1fr 228px",height:"100%",overflow:"hidden"}}>
            {/* LEFT */}
            <aside style={{overflowY:"auto",padding:10,display:"flex",flexDirection:"column",gap:7,background:"#f8fafc",borderRight:"1px solid #e2e8f0"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
                {summaryStats.map((s,i)=>(
                  <div key={i} onClick={()=>setStatsPopup(s)}
                    style={{background:"#fff",borderRadius:7,padding:"8px 10px",cursor:"pointer",border:"1px solid #f1f5f9",transition:"all .12s",boxShadow:"0 1px 2px rgba(0,0,0,0.03)"}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=`${s.color}40`;e.currentTarget.style.background=s.bg;e.currentTarget.style.boxShadow=`0 2px 8px ${s.color}18`;}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor="#f1f5f9";e.currentTarget.style.background="#fff";e.currentTarget.style.boxShadow="0 1px 2px rgba(0,0,0,0.03)";}}>
                    <s.Icon size={13} color={s.color}/>
                    <div style={{fontSize:16,fontWeight:700,color:s.color,marginTop:3,fontFamily:"'IBM Plex Mono',monospace",lineHeight:1}}>{s.value}</div>
                    <div style={{fontSize:9,color:"#94a3b8",marginTop:2,letterSpacing:"0.02em"}}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6,padding:"6px 4px 2px",borderTop:"1px solid #f1f5f9",marginTop:2}}>
                <div style={{width:2,height:12,background:"#1d4ed8",borderRadius:1}}/>
                <span style={{fontSize:9,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.08em"}}>สถานีทั้งหมด</span>
              </div>
              {STATIONS.map(st=><StatCard key={st.id} station={st} onClick={setSelectedStation}/>)}
            </aside>

            {/* CENTER */}
            <main style={{display:"flex",flexDirection:"column",overflow:"hidden"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"7px 14px",background:"#fff",borderBottom:"1px solid #e2e8f0",flexShrink:0}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <IconMap size={13} color="#1d4ed8"/>
                  <span style={{fontSize:11,fontWeight:700,color:"#1d4ed8",letterSpacing:"0.02em"}}>ผังโครงการส่งน้ำภาษีเจริญ</span>
                </div>
                <span style={{fontSize:9,color:"#94a3b8"}}>คลิกที่สถานีเพื่อดูรายละเอียด</span>
              </div>
              <div style={{flex:1,overflow:"auto",display:"flex",alignItems:"flex-start",justifyContent:"center",padding:12}}>
                <FlowMap onStationClick={setSelectedStation}/>
              </div>
              <div style={{padding:"6px 14px",background:"#fff",borderTop:"1px solid #e2e8f0",display:"flex",gap:14,alignItems:"center",flexShrink:0,flexWrap:"wrap"}}>
                {[["#0369a1","สถานีวัดน้ำ (T.1, T.14)"],["#1153ED","ปตร. / สน.ปตร."]].map(([c,l])=>(
                  <div key={l} style={{display:"flex",alignItems:"center",gap:5,fontSize:10,color:"#64748b"}}>
                    <div style={{width:11,height:11,borderRadius:2,background:c}}/>{l}
                  </div>
                ))}
                <div style={{width:1,height:14,background:"#e2e8f0"}}/>
                {[["#047857","ปกติ"],["#b45309","เฝ้าระวัง"],["#b91c1c","วิกฤต"]].map(([c,l])=>(
                  <div key={l} style={{display:"flex",alignItems:"center",gap:5,fontSize:10,color:"#64748b"}}>
                    <div style={{width:7,height:7,borderRadius:"50%",background:c}}/>{l}
                  </div>
                ))}
              </div>
            </main>

            {/* RIGHT */}
            <aside style={{overflowY:"auto",padding:10,display:"flex",flexDirection:"column",gap:7,background:"#f8fafc",borderLeft:"1px solid #e2e8f0"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"2px 0"}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{width:2,height:12,background:"#7c3aed",borderRadius:1}}/>
                  <span style={{fontSize:9,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.08em"}}>กล้องวงจรปิด ({CAMERAS.length})</span>
                </div>
                <span style={{fontSize:8,color:"#94a3b8"}}>คลิกเพื่อดูสถานี</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                {CAMERAS.map(cam=>(
                  <CameraFeed key={cam.id} cam={cam} onClick={()=>{
                    const st=STATIONS.find(s=>s.id===cam.stationId);
                    if(st)setSelectedStation(st);
                  }}/>
                ))}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6,padding:"6px 0 2px",borderTop:"1px solid #f1f5f9"}}>
                <div style={{width:2,height:12,background:"#0e7490",borderRadius:1}}/>
                <span style={{fontSize:9,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.08em"}}>คาดการณ์ 24 ชม.</span>
              </div>
              <div style={{background:"#fff",borderRadius:7,padding:10,border:"1px solid #e2e8f0"}}>
                <div style={{fontSize:10,color:"#64748b",marginBottom:5,fontWeight:600}}>แนวโน้มระดับน้ำ T.1 ภาษีเจริญ</div>
                <svg viewBox="0 0 160 50" style={{width:"100%"}}>
                  <polyline points="0,40 20,38 40,35 60,30 80,28 100,25 120,22 140,20 160,18" fill="none" stroke="#047857" strokeWidth={1.5} strokeDasharray="3 2"/>
                  <polyline points="0,40 20,39 40,38 60,37 80,36 100,38 120,40 140,42 160,44" fill="none" stroke="#b45309" strokeWidth={1} strokeDasharray="2 3"/>
                  <line x1={0} y1={49} x2={160} y2={49} stroke="#f1f5f9" strokeWidth={0.5}/>
                  <text x={2} y={49} fontSize={7} fill="#94a3b8" fontFamily="'IBM Plex Mono',monospace">00:00</text>
                  <text x={118} y={49} fontSize={7} fill="#94a3b8" fontFamily="'IBM Plex Mono',monospace">24:00</text>
                </svg>
                <div style={{display:"flex",gap:10,marginTop:4}}>
                  {[["#047857","กรณีดี"],["#b45309","ปกติ"]].map(([c,l])=>(
                    <div key={l} style={{display:"flex",alignItems:"center",gap:4,fontSize:9,color:"#94a3b8"}}>
                      <div style={{width:12,height:2,background:c}}/>{l}
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* COMPARE */}
        {activeTab==="compare" && (
          <div style={{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
            <div style={{padding:"9px 20px",background:"#fff",borderBottom:"1px solid #f1f5f9",display:"flex",flexWrap:"wrap",gap:10,alignItems:"center",flexShrink:0}}>
              <div style={{display:"flex",gap:5,alignItems:"center"}}>
                <span style={{fontSize:10,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em"}}>ประเภท</span>
                {[["level","ระดับน้ำ"],["flow","น้ำท่า"],["rain","ปริมาณฝน"]].map(([id,l])=>(
                  <Chip key={id} active={activeMetric===id} onClick={()=>setActiveMetric(id)}>{l}</Chip>
                ))}
              </div>
              <div style={{width:1,height:18,background:"#e2e8f0"}}/>
              <div style={{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap"}}>
                <span style={{fontSize:10,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em"}}>สถานี</span>
                {compareStations.map((s,i)=>(
                  <Chip key={s.id} active={selectedForChart.has(s.id)} onClick={()=>toggleChart(s.id)} color={CHART_COLORS[i%CHART_COLORS.length]}>{s.shortName}</Chip>
                ))}
              </div>
              <div style={{width:1,height:18,background:"#e2e8f0"}}/>
              <div style={{display:"flex",gap:5,alignItems:"center"}}>
                <span style={{fontSize:10,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em"}}>ช่วงเวลา</span>
                {["24 ชม.","7 วัน","30 วัน"].map(t=>(
                  <Chip key={t} active={activeTimeRange===t} onClick={()=>setActiveTimeRange(t)}>{t}</Chip>
                ))}
              </div>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:16,display:"flex",flexDirection:"column",gap:12}}>
              <div style={{background:"#fff",borderRadius:10,padding:16,border:"1px solid #e2e8f0"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                  <div>
                    <div style={{fontSize:13,fontWeight:700,color:"#0f172a"}}>
                      {activeMetric==="level"?"ระดับน้ำ (ม.รทก.)":activeMetric==="flow"?"อัตราน้ำท่า (ม³/วิ)":"ปริมาณน้ำฝน (มม.)"} – เปรียบเทียบสถานี
                    </div>
                    <div style={{fontSize:10,color:"#94a3b8",marginTop:2}}>{activeTimeRange} · ข้อมูลล่าสุด 23/04/2569</div>
                  </div>
                  <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                    {chartDatasets.map((ds,i)=>(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:5,fontSize:10,color:"#64748b"}}>
                        <div style={{width:14,height:2,background:ds.color}}/>{ds.label}
                      </div>
                    ))}
                  </div>
                </div>
                {chartDatasets.length>0
                  ? <LineChart datasets={chartDatasets} labels={HOURS.map(h=>`${String(h).padStart(2,"0")}:00`)} height={200}/>
                  : <div style={{height:200,display:"flex",alignItems:"center",justifyContent:"center",color:"#94a3b8",fontSize:13}}>เลือกสถานีเพื่อแสดงกราฟ</div>
                }
              </div>
              <div style={{background:"#fff",borderRadius:10,padding:16,border:"1px solid #e2e8f0"}}>
                <div style={{fontSize:12,fontWeight:700,color:"#0f172a",marginBottom:4,display:"flex",alignItems:"center",gap:5}}>
                  <IconRain size={12} color="#6d28d9"/> ปริมาณน้ำฝนรวม (มม.) · 24 ชั่วโมงล่าสุด
                </div>
                <BarChart data={STATIONS[0].series.rain} color="#6d28d9" height={110}/>
              </div>
              {/* Table */}
              <div style={{background:"#fff",borderRadius:10,border:"1px solid #e2e8f0",overflow:"hidden"}}>
                <div style={{padding:"10px 16px",borderBottom:"1px solid #f1f5f9",display:"flex",alignItems:"center",gap:6}}>
                  <IconStation size={12} color="#1d4ed8"/>
                  <span style={{fontSize:12,fontWeight:700,color:"#0f172a"}}>ตารางสรุปสถานีทั้งหมด</span>
                </div>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                  <thead>
                    <tr style={{background:"#f8fafc"}}>
                      {["","สถานี","ประเภท","ระดับน้ำ (ม.)","อัตราไหล (ม³/วิ)","สถานะ",""].map((h,i)=>(
                        <th key={i} style={{padding:"8px 12px",textAlign:"left",fontSize:9,color:"#94a3b8",fontWeight:700,borderBottom:"1px solid #e2e8f0",textTransform:"uppercase",letterSpacing:"0.06em"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {STATIONS.map((st,i)=>{
                      const cfg=stCfg(st.status);
                      const typeLabel=st.type==="gauging"?"สถานีวัดน้ำ":"ปตร./สน.ปตร.";
                      return (
                        <tr key={st.id} style={{borderBottom:"1px solid #f8fafc",background:i%2?"#fafafa":"#fff",transition:"background .1s"}}
                          onMouseEnter={e=>{e.currentTarget.style.background="#eff6ff";}}
                          onMouseLeave={e=>{e.currentTarget.style.background=i%2?"#fafafa":"#fff";}}>
                          <td style={{padding:"8px 10px 8px 12px"}}><StationTypeIconBox type={st.type} size={16}/></td>
                          <td style={{padding:"8px 12px",fontWeight:600,color:"#0f172a"}}>{st.shortName}</td>
                          <td style={{padding:"8px 12px",color:"#64748b",fontSize:11}}>{typeLabel}</td>
                          <td style={{padding:"8px 12px",fontFamily:"'IBM Plex Mono',monospace",fontWeight:600,color:"#1d4ed8"}}>{st.level.toFixed(2)}</td>
                          <td style={{padding:"8px 12px",fontFamily:"'IBM Plex Mono',monospace",fontWeight:600,color:"#047857"}}>{st.flow.toFixed(1)}</td>
                          <td style={{padding:"8px 12px"}}><StatusBadge status={st.status} small/></td>
                          <td style={{padding:"8px 12px"}}>
                            <button onClick={()=>setSelectedStation(st)} style={{padding:"3px 9px",border:"1px solid #bfdbfe",borderRadius:4,fontSize:10,cursor:"pointer",color:"#1d4ed8",background:"#eff6ff",fontFamily:"inherit",fontWeight:600}}>
                              รายละเอียด
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* FORECAST */}
        {activeTab==="forecast" && <ForecastTab/>}

        {/* FLOW MAP */}
        {activeTab==="flowmap" && (
          <div style={{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 20px",background:"#fff",borderBottom:"1px solid #e2e8f0",flexShrink:0}}>
              <div style={{display:"flex",alignItems:"center",gap:7}}>
                <IconMap size={14} color="#1d4ed8"/>
                <span style={{fontSize:13,fontWeight:700,color:"#0f172a"}}>ผังน้ำโครงการส่งน้ำและบำรุงรักษาภาษีเจริญ</span>
              </div>
              <div style={{display:"flex",gap:14,alignItems:"center"}}>
                {[["#047857","ปกติ"],["#b45309","เฝ้าระวัง"],["#b91c1c","วิกฤต"]].map(([c,l])=>(
                  <div key={l} style={{display:"flex",alignItems:"center",gap:5,fontSize:10,color:"#64748b"}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:c}}/>{l}
                  </div>
                ))}
                <span style={{fontSize:10,color:"#94a3b8"}}>คลิกที่สถานีเพื่อดูรายละเอียด</span>
              </div>
            </div>
            <div style={{flex:1,overflow:"auto",display:"flex",alignItems:"flex-start",justifyContent:"center",padding:20}}>
              <FlowMap onStationClick={setSelectedStation}/>
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      {selectedStation && <StationModal station={selectedStation} onClose={()=>setSelectedStation(null)}/>}
      {statsPopup && (
        <StatsPopup
          filterKey={statsPopup.filterKey}
          label={statsPopup.label}
          color={statsPopup.color}
          bg={statsPopup.bg}
          onStationClick={st=>{setSelectedStation(st);}}
          onClose={()=>setStatsPopup(null)}
        />
      )}
    </div>
  );
}