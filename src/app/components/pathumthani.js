// ─── โครงการชลประทานปทุมธานี ────────────────────────────────────────────────

export const PROJECT_META = {
  id: "pathumthani",
  name: "โครงการชลประทานปทุมธานี",
  nameEn: "Pathumthani Irrigation Project",
  office: "สำนักงานชลประทานที่ 11",
  color: "#0e7490",
};

export const STATIONS = [
  {
    id: "PTR_BAAN_TON_PHO",
    code: "สถานีบ้านต้นโพธิ์",
    name: "สถานีบ้านต้นโพธิ์",
    shortName: "บ้านต้นโพธิ์",
    type: "gauging",
    status: "ok",
    desc: "สถานีวัดระดับน้ำบ้านต้นโพธิ์ บนแม่น้ำเจ้าพระยา",
    readings: { U: 2.45, D: null, O: null, P: null },
    info: {
      province: "ปทุมธานี", district: "สามโคก", subdistrict: "บ้านต้นโพธิ์",
      region: "ภาคกลาง", basin: "เจ้าพระยา", office: "โครงการชลประทานปทุมธานี",
      lat: 14.076735, lng: 100.568503, buildYear: "2545", completeYear: "2546",
      gateCount: null, gateType: null, gateWidth: null, gateHeight: null,
      maxDischarge: null, spillLevel: 0, floodLevel: 4.5, normalLevel: 2.0,
      pumps: [], additionalCanal: "แม่น้ำเจ้าพระยา", remark: "N/A"
    },
    series: {
      level: [2.38,2.39,2.40,2.41,2.42,2.43,2.44,2.45,2.45,2.44,2.43,2.42,2.42,2.43,2.44,2.45,2.45,2.46,2.46,2.45,2.45,2.44,2.44,2.45],
      flow:  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      rain:  [0,0,2,4,6,3,1,0,0,0,3,5,2,0,0,0,1,3,5,3,1,0,0,0],
    }
  },
  {
    id: "PTR_BAAN_THA_KACHA",
    code: "สถานีบ้านท่ากะชะ",
    name: "สถานีบ้านท่ากะชะ",
    shortName: "บ้านท่ากะชะ",
    type: "gauging",
    status: "ok",
    desc: "สถานีวัดระดับน้ำบ้านท่ากะชะ บนแม่น้ำเจ้าพระยา",
    readings: { U: 2.38, D: null, O: null, P: null },
    info: {
      province: "ปทุมธานี", district: "สามโคก", subdistrict: "บ้านท่ากะชะ",
      region: "ภาคกลาง", basin: "เจ้าพระยา", office: "โครงการชลประทานปทุมธานี",
      lat: 14.04286, lng: 100.583688, buildYear: "2545", completeYear: "2546",
      gateCount: null, gateType: null, gateWidth: null, gateHeight: null,
      maxDischarge: null, spillLevel: 0, floodLevel: 4.5, normalLevel: 2.0,
      pumps: [], additionalCanal: "แม่น้ำเจ้าพระยา", remark: "N/A"
    },
    series: {
      level: [2.31,2.32,2.33,2.34,2.35,2.36,2.37,2.38,2.38,2.37,2.36,2.35,2.35,2.36,2.37,2.38,2.38,2.39,2.39,2.38,2.38,2.37,2.37,2.38],
      flow:  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      rain:  [0,0,2,4,6,3,1,0,0,0,3,5,2,0,0,0,1,3,5,3,1,0,0,0],
    }
  },
  {
    id: "PTR_BAAN_TAO_IT",
    code: "สถานีบ้านเต่าอิฐ",
    name: "สถานีบ้านเต่าอิฐ (สน.น้ำมันดิบสำแล)",
    shortName: "บ้านเต่าอิฐ",
    type: "gauging",
    status: "warn",
    desc: "สถานีวัดระดับน้ำบ้านเต่าอิฐ (สน.น้ำมันดิบสำแล) บนแม่น้ำเจ้าพระยา",
    readings: { U: 2.52, D: null, O: null, P: null },
    info: {
      province: "ปทุมธานี", district: "เมืองปทุมธานี", subdistrict: "บางปรอก",
      region: "ภาคกลาง", basin: "เจ้าพระยา", office: "โครงการชลประทานปทุมธานี",
      lat: 14.040789, lng: 100.555166, buildYear: "2546", completeYear: "2547",
      gateCount: null, gateType: null, gateWidth: null, gateHeight: null,
      maxDischarge: null, spillLevel: 0, floodLevel: 4.5, normalLevel: 2.0,
      pumps: [], additionalCanal: "แม่น้ำเจ้าพระยา", remark: "ระดับน้ำสูงกว่าปกติ"
    },
    series: {
      level: [2.44,2.45,2.47,2.48,2.49,2.50,2.51,2.52,2.52,2.51,2.50,2.49,2.49,2.50,2.51,2.52,2.52,2.53,2.53,2.52,2.52,2.51,2.51,2.52],
      flow:  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      rain:  [0,0,2,4,7,4,2,0,0,0,3,5,3,1,0,0,1,3,6,4,2,0,0,0],
    }
  },
  {
    id: "PTR_BAAN_BANG_LIAB",
    code: "สถานีบ้านบางเลียบ",
    name: "สถานีบ้านบางเลียบ",
    shortName: "บ้านบางเลียบ",
    type: "gauging",
    status: "ok",
    desc: "สถานีวัดระดับน้ำบ้านบางเลียบ บนแม่น้ำเจ้าพระยา",
    readings: { U: 2.35, D: null, O: null, P: null },
    info: {
      province: "ปทุมธานี", district: "เมืองปทุมธานี", subdistrict: "บางเลียบ",
      region: "ภาคกลาง", basin: "เจ้าพระยา", office: "โครงการชลประทานปทุมธานี",
      lat: 14.034196, lng: 100.563666, buildYear: "2546", completeYear: "2547",
      gateCount: null, gateType: null, gateWidth: null, gateHeight: null,
      maxDischarge: null, spillLevel: 0, floodLevel: 4.5, normalLevel: 2.0,
      pumps: [], additionalCanal: "แม่น้ำเจ้าพระยา", remark: "N/A"
    },
    series: {
      level: [2.28,2.29,2.30,2.31,2.32,2.33,2.34,2.35,2.35,2.34,2.33,2.32,2.32,2.33,2.34,2.35,2.35,2.36,2.36,2.35,2.35,2.34,2.34,2.35],
      flow:  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      rain:  [0,0,1,3,5,2,0,0,0,0,2,4,2,0,0,0,0,2,4,2,1,0,0,0],
    }
  },
  {
    id: "PTR_BAAN_BANG_LUANG",
    code: "สถานีบ้านบางหลวง",
    name: "สถานีบ้านบางหลวง",
    shortName: "บ้านบางหลวง",
    type: "gauging",
    status: "ok",
    desc: "สถานีวัดระดับน้ำบ้านบางหลวง บนแม่น้ำเจ้าพระยา",
    readings: { U: 2.28, D: null, O: null, P: null },
    info: {
      province: "ปทุมธานี", district: "ลาดหลุมแก้ว", subdistrict: "บางหลวง",
      region: "ภาคกลาง", basin: "เจ้าพระยา", office: "โครงการชลประทานปทุมธานี",
      lat: 14.005612, lng: 100.58043, buildYear: "2547", completeYear: "2548",
      gateCount: null, gateType: null, gateWidth: null, gateHeight: null,
      maxDischarge: null, spillLevel: 0, floodLevel: 4.0, normalLevel: 1.9,
      pumps: [], additionalCanal: "แม่น้ำเจ้าพระยา", remark: "N/A"
    },
    series: {
      level: [2.21,2.22,2.23,2.24,2.25,2.26,2.27,2.28,2.28,2.27,2.26,2.25,2.25,2.26,2.27,2.28,2.28,2.29,2.29,2.28,2.28,2.27,2.27,2.28],
      flow:  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      rain:  [0,0,1,3,5,2,0,0,0,0,2,4,2,0,0,0,0,2,4,2,1,0,0,0],
    }
  },
  {
    id: "PTR_BANG_PHUN",
    code: "สถานีบางพูน",
    name: "สถานีบางพูน",
    shortName: "บางพูน",
    type: "gauging",
    status: "ok",
    desc: "สถานีวัดระดับน้ำบางพูน บนแม่น้ำเจ้าพระยา",
    readings: { U: 2.20, D: null, O: null, P: null },
    info: {
      province: "ปทุมธานี", district: "เมืองปทุมธานี", subdistrict: "บางพูน",
      region: "ภาคกลาง", basin: "เจ้าพระยา", office: "โครงการชลประทานปทุมธานี",
      lat: 13.990746, lng: 100.572594, buildYear: "2548", completeYear: "2549",
      gateCount: null, gateType: null, gateWidth: null, gateHeight: null,
      maxDischarge: null, spillLevel: 0, floodLevel: 4.0, normalLevel: 1.9,
      pumps: [], additionalCanal: "แม่น้ำเจ้าพระยา", remark: "N/A"
    },
    series: {
      level: [2.13,2.14,2.15,2.16,2.17,2.18,2.19,2.20,2.20,2.19,2.18,2.17,2.17,2.18,2.19,2.20,2.20,2.21,2.21,2.20,2.20,2.19,2.19,2.20],
      flow:  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      rain:  [0,0,1,2,4,2,0,0,0,0,1,3,1,0,0,0,0,1,3,2,1,0,0,0],
    }
  },
  {
    id: "PTR_BAAN_KRACHANG",
    code: "สถานีบ้านกระแชง",
    name: "สถานีบ้านกระแชง",
    shortName: "บ้านกระแชง",
    type: "gauging",
    status: "danger",
    desc: "สถานีวัดระดับน้ำบ้านกระแชง บนแม่น้ำเจ้าพระยา",
    readings: { U: 2.68, D: null, O: null, P: null },
    info: {
      province: "ปทุมธานี", district: "สามโคก", subdistrict: "กระแชง",
      region: "ภาคกลาง", basin: "เจ้าพระยา", office: "โครงการชลประทานปทุมธานี",
      lat: 14.035862, lng: 100.549476, buildYear: "2545", completeYear: "2546",
      gateCount: null, gateType: null, gateWidth: null, gateHeight: null,
      maxDischarge: null, spillLevel: 0, floodLevel: 4.5, normalLevel: 2.0,
      pumps: [], additionalCanal: "แม่น้ำเจ้าพระยา", remark: "ระดับน้ำสูงวิกฤต"
    },
    series: {
      level: [2.55,2.57,2.58,2.59,2.60,2.62,2.63,2.65,2.66,2.67,2.68,2.68,2.67,2.67,2.68,2.68,2.68,2.69,2.69,2.68,2.68,2.67,2.67,2.68],
      flow:  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      rain:  [0,0,4,8,12,7,3,1,0,0,5,9,5,2,0,0,2,5,10,7,4,1,0,0],
    }
  },
];

export const CAMERAS = [
  { id: 1, name: "บ้านต้นโพธิ์ (CAM-01)",      level: 245, status: "ok",      waterPct: 30, stationId: "PTR_BAAN_TON_PHO" },
  { id: 2, name: "บ้านกระแชง (CAM-02)",        level: 268, status: "danger",  waterPct: 75, stationId: "PTR_BAAN_KRACHANG" },
  { id: 3, name: "บ้านเต่าอิฐ (CAM-03)",       level: 252, status: "warning", waterPct: 50, stationId: "PTR_BAAN_TAO_IT" },
  { id: 4, name: "บ้านท่ากะชะ (CAM-04)",       level: 238, status: "ok",      waterPct: 32, stationId: "PTR_BAAN_THA_KACHA" },
  { id: 5, name: "บ้านบางเลียบ (CAM-05)",       level: 235, status: "ok",      waterPct: 28, stationId: "PTR_BAAN_BANG_LIAB" },
  { id: 6, name: "บ้านบางหลวง (CAM-06)",        level: 228, status: "ok",      waterPct: 25, stationId: "PTR_BAAN_BANG_LUANG" },
  { id: 7, name: "บางพูน (CAM-07)",             level: 220, status: "ok",      waterPct: 22, stationId: "PTR_BANG_PHUN" },
];

export const STATION_LIST_FOR_COMPARE = [
  "PTR_BAAN_TON_PHO",
  "PTR_BAAN_THA_KACHA",
  "PTR_BAAN_TAO_IT",
  "PTR_BAAN_BANG_LIAB",
  "PTR_BAAN_BANG_LUANG",
  "PTR_BANG_PHUN",
  "PTR_BAAN_KRACHANG",
];

// ─── MAP STATIONS (พิกัด SVG สำหรับผัง) ─────────────────────────────────────
// วางสถานีตามแนวแม่น้ำเจ้าพระยา (ไหลจากเหนือ→ใต้ ในแนวตั้ง)
// ลำดับตาม lat จากมากไปน้อย (เหนือ→ใต้)
export const MAP_STATIONS = [
  // lat 14.076735 – เหนือสุด
  { id: "PTR_BAAN_TON_PHO",      x: 310, y: 80  },
  // lat 14.040789
  { id: "PTR_BAAN_TAO_IT",       x: 310, y: 200 },
  // lat 14.04286 (ใกล้กัน วางเยื้องออกไปด้านขวาเล็กน้อย)
  { id: "PTR_BAAN_THA_KACHA",    x: 400, y: 240 },
  // lat 14.035862
  { id: "PTR_BAAN_KRACHANG",     x: 220, y: 270 },
  // lat 14.034196
  { id: "PTR_BAAN_BANG_LIAB",    x: 370, y: 310 },
  // lat 14.005612
  { id: "PTR_BAAN_BANG_LUANG",   x: 310, y: 430 },
  // lat 13.990746 – ใต้สุด
  { id: "PTR_BANG_PHUN",         x: 310, y: 520 },
];

// ─── renderCanals – เส้นทางน้ำ ──────────────────────────────────────────────
export function renderCanals(H) {
  return (
    <>
      {/* แม่น้ำเจ้าพระยา – แนวตั้งหลัก */}
      <path
        d={`M310 30 C315 120, 305 200, 315 300 C322 380, 308 460, 310 ${H - 20}`}
        stroke="rgba(14,116,144,0.40)"
        strokeWidth={18}
        fill="none"
        strokeLinecap="round"
      />
      {/* ป้ายชื่อแม่น้ำ */}
      <text x={340} y={H / 2} fontSize={10} fill="#0e7490" fontWeight={700}
        transform={`rotate(90,340,${H / 2})`} textAnchor="middle">
        แม่น้ำเจ้าพระยา
      </text>

      {/* แนวชายฝั่งซ้าย */}
      <path
        d={`M280 30 C275 150, 270 280, 265 ${H - 20}`}
        stroke="rgba(148,163,184,0.25)"
        strokeWidth={2}
        fill="none"
        strokeDasharray="6 4"
      />
      {/* แนวชายฝั่งขวา */}
      <path
        d={`M345 30 C352 150, 348 280, 358 ${H - 20}`}
        stroke="rgba(148,163,184,0.25)"
        strokeWidth={2}
        fill="none"
        strokeDasharray="6 4"
      />

      {/* ป้ายทิศทางน้ำ */}
      <text x={180} y={55} fontSize={9} fill="#64748b" textAnchor="middle">▼ ไหลลงใต้</text>
      <text x={180} y={H - 15} fontSize={9} fill="#64748b" textAnchor="middle">▼ สู่กรุงเทพฯ</text>
    </>
  );
}