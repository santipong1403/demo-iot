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
    id: "PTR_BAAN_KRACHANG",
    code: "สถานีบ้านกระแชง",
    name: "สถานีบ้านกระแชง (วัดโพธิ์เลื่อน)",
    shortName: "บ้านกระแชง",
    type: "gauging",
    status: "danger",
    desc: "สถานีวัดระดับน้ำบ้านกระแชง (วัดโพธิ์เลื่อน) บนแม่น้ำเจ้าพระยา",
    readings: { U: 2.68, D: null, O: null, P: null },
    info: {
      province: "ปทุมธานี", district: "สามโคก", subdistrict: "กระแชง",
      region: "ภาคกลาง", basin: "เจ้าพระยา", office: "โครงการชลประทานปทุมธานี",
      lat: 14.032115885861279, lng: 100.54660208298553, buildYear: "2545", completeYear: "2546",
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
  {
    id: "PTR_BANG_LUANG",
    code: "สถานีบางหลวง",
    name: "สถานีบางหลวง (ชุมชนบางหลวง) เจดีย์เก่าวัดบางหลวงนอก",
    shortName: "บางหลวง",
    type: "gauging",
    status: "ok",
    desc: "สถานีวัดระดับน้ำบางหลวง (ชุมชนบางหลวง) บริเวณเจดีย์เก่าวัดบางหลวงนอก บนแม่น้ำเจ้าพระยา",
    readings: { U: 2.28, D: null, O: null, P: null },
    info: {
      province: "ปทุมธานี", district: "ลาดหลุมแก้ว", subdistrict: "บางหลวง",
      region: "ภาคกลาง", basin: "เจ้าพระยา", office: "โครงการชลประทานปทุมธานี",
      lat: 13.9923546081473, lng: 100.52846559274599, buildYear: "2547", completeYear: "2548",
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
    id: "PTR_BAAN_NAM_WON",
    code: "สถานีบ้านน้ำวน",
    name: "สถานีบ้านน้ำวน (วัดน้ำวน)",
    shortName: "บ้านน้ำวน",
    type: "gauging",
    status: "ok",
    desc: "สถานีวัดระดับน้ำบ้านน้ำวน (วัดน้ำวน) บนแม่น้ำเจ้าพระยา",
    readings: { U: 2.20, D: null, O: null, P: null },
    info: {
      province: "ปทุมธานี", district: "เมืองปทุมธานี", subdistrict: "บางพูน",
      region: "ภาคกลาง", basin: "เจ้าพระยา", office: "โครงการชลประทานปทุมธานี",
      lat: 13.974853346792697, lng: 100.52608212910467, buildYear: "2548", completeYear: "2549",
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
];

export const CAMERAS = [
  { id: 1, name: "บ้านกระแชง (CAM-01)",  level: 268, status: "danger", waterPct: 75, stationId: "PTR_BAAN_KRACHANG" },
  { id: 2, name: "บางหลวง (CAM-02)",      level: 228, status: "ok",     waterPct: 25, stationId: "PTR_BANG_LUANG" },
  { id: 3, name: "บ้านน้ำวน (CAM-03)",   level: 220, status: "ok",     waterPct: 22, stationId: "PTR_BAAN_NAM_WON" },
];

export const STATION_LIST_FOR_COMPARE = [
  "PTR_BAAN_KRACHANG",
  "PTR_BANG_LUANG",
  "PTR_BAAN_NAM_WON",
];

// ─── MAP STATIONS (พิกัด SVG สำหรับผัง) ─────────────────────────────────────
// วางสถานีตามแนวแม่น้ำเจ้าพระยา (ไหลจากเหนือ→ใต้ ในแนวตั้ง)
// ลำดับตาม lat จากมากไปน้อย (เหนือ→ใต้)
export const MAP_STATIONS = [
  // lat 14.032116 – เหนือสุด
  { id: "PTR_BAAN_KRACHANG",  x: 310, y: 150 },
  // lat 13.992355
  { id: "PTR_BANG_LUANG",     x: 310, y: 330 },
  // lat 13.974853 – ใต้สุด
  { id: "PTR_BAAN_NAM_WON",   x: 310, y: 480 },
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