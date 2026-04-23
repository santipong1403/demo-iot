import { useState, useEffect, useRef, useCallback } from "react";

// ─── STATION DATA (ตรงกับผังน้ำจริง) ────────────────────────────────────────
// แต่ละสถานีมีค่า U=ระดับน้ำด้านใน, D=ระดับน้ำด้านนอก, O=เปิดบาน, P=ปริมาณการระบาย
// null = ไม่มีค่านั้น (เช่น สถานีวัดน้ำไม่มี O, P)

const STATIONS = [
  // ── สถานีวัดน้ำ ──────────────────────────────────────────────────────────
  {
    id: "T1", code: "T.1", name: "สถานีวัดน้ำ T.1", shortName: "T.1 ภาษีเจริญ",
    x: 62, y: 80, type: "gauging", status: "warn",
    desc: "สถานีวัดระดับน้ำคลองภาษีเจริญ บริเวณมหาวิทยาลัยภาษีเจริญ",
    readings: { U: null, D: null, O: null, P: null, level: 0.88, flow: 12.5 },
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
    x: 62, y: 390, type: "gauging", status: "ok",
    desc: "สถานีวัดระดับน้ำแม่น้ำท่าจีน บริเวณอำเภอสามพราน",
    readings: { U: null, D: null, O: null, P: null, level: 0.00, flow: null },
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

  // ── ประตูระบายน้ำ / สน.ปตร. (มีครบ U D O P) ──────────────────────────────
  {
    id: "PTR_LADNGWLAI", code: "ปตร.ลัดงิ้วลาย", name: "ปตร.ลัดงิ้วลาย", shortName: "ลัดงิ้วลาย",
    x: 230, y: 128, type: "gate", status: "ok",
    desc: "ประตูระบายน้ำลัดงิ้วลาย ควบคุมน้ำเข้าคลองมหาสวัสดิ์",
    readings: { U: null, D: null, O: 0, P: null },
    info: {
      province: "กรุงเทพมหานคร", district: "ทวีวัฒนา", subdistrict: "ทวีวัฒนา",
      region: "ภาคกลาง", basin: "ท่าจีน", office: "สำนักงานชลประทานที่ 11",
      lat: 13.7810, lng: 100.3620, buildYear: "2530", completeYear: "2532",
      gateCount: 3, gateType: "บานตรง", gateWidth: 3.5, gateHeight: 3.0,
      maxDischarge: 45, spillLevel: 0, floodLevel: 3.5, normalLevel: 1.2,
      pumps: [], additionalCanal: "คลองลัดงิ้วลาย", remark: "N/A"
    },
    series: {
      level: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      flow:  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      rain:  [0,0,1,2,3,1,0,0,0,0,1,2,1,0,0,0,0,1,2,1,0,0,0,0],
    }
  },
  {
    id: "PTR_SUT", code: "ปตร.สุคต", name: "ปตร.สุคต", shortName: "สุคต",
    x: 310, y: 128, type: "gate", status: "ok",
    desc: "ประตูระบายน้ำสุคต บนคลองมหาสวัสดิ์",
    readings: { U: null, D: null, O: 0, P: null },
    info: {
      province: "นนทบุรี", district: "บางกรวย", subdistrict: "บางกรวย",
      region: "ภาคกลาง", basin: "ท่าจีน", office: "โครงการส่งน้ำฯ ภาษีเจริญ",
      lat: 13.8010, lng: 100.3890, buildYear: "2525", completeYear: "2527",
      gateCount: 4, gateType: "บานตรง", gateWidth: 4.0, gateHeight: 3.56,
      maxDischarge: 80, spillLevel: 0, floodLevel: 3.5, normalLevel: 1.2,
      pumps: [], additionalCanal: "คลองมหาสวัสดิ์", remark: "N/A"
    },
    series: {
      level: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      flow:  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      rain:  [0,0,1,2,3,1,0,0,0,0,1,2,1,0,0,0,0,1,2,1,0,0,0,0],
    }
  },
  {
    id: "PTR_BANGDOEY", code: "ปตร.บางโดย", name: "ปตร.บางโดย", shortName: "บางโดย",
    x: 380, y: 128, type: "gate", status: "ok",
    desc: "ประตูระบายน้ำบางโดย บนคลองมหาสวัสดิ์",
    readings: { U: null, D: null, O: 0, P: null },
    info: {
      province: "นนทบุรี", district: "บางกรวย", subdistrict: "บางขุนกอง",
      region: "ภาคกลาง", basin: "ท่าจีน", office: "โครงการส่งน้ำฯ ภาษีเจริญ",
      lat: 13.8020, lng: 100.4010, buildYear: "2526", completeYear: "2528",
      gateCount: 4, gateType: "บานตรง", gateWidth: 4.0, gateHeight: 3.56,
      maxDischarge: 80, spillLevel: 0, floodLevel: 3.5, normalLevel: 1.2,
      pumps: [], additionalCanal: "คลองมหาสวัสดิ์", remark: "N/A"
    },
    series: {
      level: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      flow:  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      rain:  [0,0,1,2,3,1,0,0,0,0,1,2,1,0,0,0,0,1,2,1,0,0,0,0],
    }
  },
  {
    id: "PTR_SAMBAT", code: "ปตร.สามบาท", name: "ปตร.สามบาท", shortName: "สามบาท",
    x: 450, y: 128, type: "gate", status: "ok",
    desc: "ประตูระบายน้ำสามบาท บนคลองมหาสวัสดิ์",
    readings: { U: null, D: null, O: 0, P: null },
    info: {
      province: "นครปฐม", district: "นครชัยศรี", subdistrict: "นครชัยศรี",
      region: "ภาคกลาง", basin: "ท่าจีน", office: "โครงการส่งน้ำฯ ภาษีเจริญ",
      lat: 13.7980, lng: 100.4200, buildYear: "2527", completeYear: "2529",
      gateCount: 4, gateType: "บานตรง", gateWidth: 4.0, gateHeight: 3.56,
      maxDischarge: 80, spillLevel: 0, floodLevel: 3.5, normalLevel: 1.2,
      pumps: [], additionalCanal: "คลองมหาสวัสดิ์", remark: "N/A"
    },
    series: {
      level: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      flow:  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      rain:  [0,0,1,2,3,1,0,0,0,0,1,2,1,0,0,0,0,1,2,1,0,0,0,0],
    }
  },
  {
    id: "SN_SUT", code: "สน.ปตร.สุคต", name: "สน.ปตร.สุคต", shortName: "สน.สุคต",
    x: 230, y: 185, type: "gate", status: "ok",
    desc: "สถานีสูบน้ำ-ประตูระบาย สุคต ช่วยส่งน้ำเข้าคลองภาษีเจริญ",
    readings: { U: 0.80, D: 0.86, O: 0, P: 0 },
    info: {
      province: "กรุงเทพมหานคร", district: "ภาษีเจริญ", subdistrict: "คลองขวาง",
      region: "ภาคกลาง", basin: "ท่าจีน", office: "สำนักงานชลประทานที่ 11",
      lat: 13.7580, lng: 100.3780, buildYear: "2535", completeYear: "2537",
      gateCount: 4, gateType: "บานตรง", gateWidth: 4.0, gateHeight: 3.56,
      maxDischarge: 80, spillLevel: 0, floodLevel: 3.5, normalLevel: 1.2,
      pumps: [{ label: "ถาวร", count: 2, size: "2.0 ม³/วิ", maxRate: 4.0 }],
      additionalCanal: "คลองภาษีเจริญ", remark: "N/A"
    },
    series: {
      level: [0.75,0.76,0.77,0.78,0.79,0.80,0.81,0.80,0.80,0.79,0.78,0.78,0.77,0.78,0.79,0.80,0.81,0.81,0.82,0.81,0.80,0.79,0.80,0.80],
      flow:  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      rain:  [0,0,2,4,6,3,1,0,0,0,3,5,2,0,0,0,1,3,5,3,1,0,0,0],
    }
  },
  {
    id: "SN_THRB_BANGDOEY", code: "สน.ทรบ.บางโดย", name: "สน.ทรบ.บางโดย", shortName: "ทรบ.บางโดย",
    x: 230, y: 242, type: "gate", status: "ok",
    desc: "สถานีทรบ.บางโดย ช่วยระบายน้ำออกจากคลองภาษีเจริญ",
    readings: { U: null, D: null, O: 0, P: 0 },
    info: {
      province: "กรุงเทพมหานคร", district: "ภาษีเจริญ", subdistrict: "คลองขวาง",
      region: "ภาคกลาง", basin: "ท่าจีน", office: "สำนักงานชลประทานที่ 11",
      lat: 13.7420, lng: 100.3750, buildYear: "2532", completeYear: "2534",
      gateCount: 3, gateType: "บานตรง", gateWidth: 3.5, gateHeight: 3.0,
      maxDischarge: 50, spillLevel: 0, floodLevel: 3.2, normalLevel: 1.0,
      pumps: [], additionalCanal: "คลองบางโดย", remark: "N/A"
    },
    series: {
      level: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      flow:  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      rain:  [0,0,1,2,3,1,0,0,0,0,1,2,1,0,0,0,0,1,2,1,0,0,0,0],
    }
  },
  {
    id: "SN_SAMBAT", code: "สน.ปตร.สามบาท", name: "สน.ปตร.สามบาท", shortName: "สน.สามบาท",
    x: 230, y: 297, type: "gate", status: "ok",
    desc: "สถานีสูบน้ำ-ประตูระบาย สามบาท ช่วยระบายน้ำออกสู่แม่น้ำท่าจีน",
    readings: { U: null, D: null, O: 0, P: 0 },
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
      level: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      flow:  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      rain:  [0,0,1,2,3,1,0,0,0,0,1,2,1,0,0,0,0,1,2,1,0,0,0,0],
    }
  },
  {
    id: "SN_CHANG", code: "สน.ปตร.ฉาง", name: "สน.ปตร.ฉาง", shortName: "สน.ฉาง",
    x: 230, y: 350, type: "gate", status: "ok",
    desc: "สถานีปตร.ฉาง ควบคุมน้ำในคลองภาษีเจริญ",
    readings: { U: 0.82, D: 0.87, O: 0, P: 0 },
    info: {
      province: "นครปฐม", district: "สามพราน", subdistrict: "บางช้าง",
      region: "ภาคกลาง", basin: "ท่าจีน", office: "โครงการส่งน้ำฯ ภาษีเจริญ",
      lat: 13.6950, lng: 100.3410, buildYear: "2530", completeYear: "2532",
      gateCount: 4, gateType: "บานตรง", gateWidth: 4.0, gateHeight: 3.56,
      maxDischarge: 80, spillLevel: 0, floodLevel: 3.5, normalLevel: 1.2,
      pumps: [], additionalCanal: "คลองฉาง", remark: "N/A"
    },
    series: {
      level: [0.78,0.79,0.80,0.81,0.82,0.83,0.83,0.82,0.82,0.81,0.80,0.80,0.79,0.80,0.81,0.82,0.83,0.83,0.84,0.83,0.82,0.81,0.82,0.82],
      flow:  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      rain:  [0,0,1,3,5,2,0,0,0,0,2,4,2,0,0,0,0,2,4,2,1,0,0,0],
    }
  },
  {
    id: "SN_BANGSUE", code: "สน.ปตร.บางซื่อ", name: "สน.ปตร.บางซื่อ", shortName: "สน.บางซื่อ",
    x: 230, y: 405, type: "gate", status: "ok",
    desc: "สถานีปตร.บางซื่อ ควบคุมน้ำในคลองภาษีเจริญ",
    readings: { U: 0.82, D: 0.89, O: 0, P: 0 },
    info: {
      province: "นครปฐม", district: "สามพราน", subdistrict: "บางช้าง",
      region: "ภาคกลาง", basin: "ท่าจีน", office: "โครงการส่งน้ำฯ ภาษีเจริญ",
      lat: 13.6880, lng: 100.3320, buildYear: "2532", completeYear: "2534",
      gateCount: 4, gateType: "บานตรง", gateWidth: 4.0, gateHeight: 3.56,
      maxDischarge: 80, spillLevel: 0, floodLevel: 3.5, normalLevel: 1.2,
      pumps: [], additionalCanal: "คลองบางซื่อ", remark: "N/A"
    },
    series: {
      level: [0.79,0.80,0.81,0.82,0.83,0.84,0.84,0.83,0.83,0.82,0.81,0.81,0.80,0.81,0.82,0.83,0.84,0.84,0.85,0.84,0.83,0.82,0.83,0.83],
      flow:  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      rain:  [0,0,1,3,5,2,0,0,0,0,2,4,2,0,0,0,0,2,4,2,1,0,0,0],
    }
  },
  {
    id: "SN_KLONGTHAPUD", code: "สน.ปตร.คลองท่าพุด", name: "สน.ปตร.คลองท่าพุด", shortName: "คลองท่าพุด",
    x: 230, y: 462, type: "gate", status: "ok",
    desc: "สถานีปตร.คลองท่าพุด ควบคุมน้ำในคลองภาษีเจริญ",
    readings: { U: 0.84, D: 0.90, O: 0, P: 0 },
    info: {
      province: "นครปฐม", district: "สามพราน", subdistrict: "บ้านใหม่",
      region: "ภาคกลาง", basin: "ท่าจีน", office: "โครงการส่งน้ำฯ ภาษีเจริญ",
      lat: 13.6820, lng: 100.3250, buildYear: "2534", completeYear: "2536",
      gateCount: 4, gateType: "บานตรง", gateWidth: 4.0, gateHeight: 3.56,
      maxDischarge: 80, spillLevel: 0, floodLevel: 3.5, normalLevel: 1.2,
      pumps: [], additionalCanal: "คลองท่าพุด", remark: "N/A"
    },
    series: {
      level: [0.80,0.81,0.82,0.83,0.84,0.85,0.85,0.84,0.84,0.83,0.82,0.82,0.81,0.82,0.83,0.84,0.85,0.85,0.86,0.85,0.84,0.83,0.84,0.84],
      flow:  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      rain:  [0,0,1,3,5,2,0,0,0,0,2,4,2,0,0,0,0,2,4,2,1,0,0,0],
    }
  },
  {
    id: "SN_PHAKDUN", code: "สน.ผลักดันน้ำ", name: "สน.ผลักดันน้ำ ปตร.ลัดท่าคา", shortName: "ผลักดัน-ลัดท่าคา",
    x: 230, y: 518, type: "gate", status: "ok",
    desc: "สถานีผลักดันน้ำ-ประตูระบาย ลัดท่าคา ผลักดันน้ำในคลองภาษีเจริญ",
    readings: { U: null, D: null, O: 0, P: null },
    info: {
      province: "สมุทรสาคร", district: "กระทุ่มแบน", subdistrict: "ลัดท่าคา",
      region: "ภาคกลาง", basin: "ท่าจีน", office: "โครงการส่งน้ำฯ ภาษีเจริญ",
      lat: 13.6680, lng: 100.3150, buildYear: "2540", completeYear: "2542",
      gateCount: 2, gateType: "บานตรง", gateWidth: 3.0, gateHeight: 2.5,
      maxDischarge: 20, spillLevel: 0, floodLevel: 3.0, normalLevel: 0.8,
      pumps: [{ label: "ถาวร", count: 2, size: "0.5 ม³/วิ", maxRate: 1.0 }],
      additionalCanal: "คลองลัดท่าคา", remark: "N/A"
    },
    series: {
      level: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      flow:  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      rain:  [0,0,0,1,2,1,0,0,0,0,1,2,1,0,0,0,0,1,2,1,0,0,0,0],
    }
  },
  {
    id: "SN_OMYAI", code: "สน.ปตร.อ้อมใหญ่", name: "สน.ปตร.อ้อมใหญ่", shortName: "สน.อ้อมใหญ่",
    x: 230, y: 574, type: "gate", status: "ok",
    desc: "สถานีปตร.อ้อมใหญ่ ควบคุมน้ำเข้าคลองอ้อมน้อย",
    readings: { U: 1.00, D: 1.65, O: 0, P: 0 },
    info: {
      province: "สมุทรสาคร", district: "กระทุ่มแบน", subdistrict: "อ้อมน้อย",
      region: "ภาคกลาง", basin: "ท่าจีน", office: "โครงการส่งน้ำฯ ภาษีเจริญ",
      lat: 13.6560, lng: 100.3080, buildYear: "2535", completeYear: "2537",
      gateCount: 6, gateType: "บานตรง", gateWidth: 5.0, gateHeight: 4.0,
      maxDischarge: 120, spillLevel: 0, floodLevel: 4.0, normalLevel: 1.5,
      pumps: [{ label: "ถาวร", count: 2, size: "2.0 ม³/วิ", maxRate: 4.0 }],
      additionalCanal: "คลองอ้อมน้อย", remark: "N/A"
    },
    series: {
      level: [0.95,0.97,0.98,1.00,1.01,1.02,1.02,1.00,1.00,0.99,0.98,0.98,0.97,0.98,0.99,1.00,1.01,1.02,1.03,1.02,1.01,1.00,1.00,1.00],
      flow:  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      rain:  [0,0,2,4,6,3,1,0,0,0,2,4,2,0,0,0,1,3,5,3,1,0,0,0],
    }
  },
  {
    id: "SN_OMNOEY", code: "สน.ปตร.อ้อมน้อย", name: "สน.ปตร.อ้อมน้อย", shortName: "สน.อ้อมน้อย",
    x: 230, y: 626, type: "gate", status: "ok",
    desc: "สถานีปตร.อ้อมน้อย ควบคุมน้ำในคลองอ้อมน้อย",
    readings: { U: null, D: null, O: 0, P: 0 },
    info: {
      province: "สมุทรสาคร", district: "กระทุ่มแบน", subdistrict: "อ้อมน้อย",
      region: "ภาคกลาง", basin: "ท่าจีน", office: "โครงการส่งน้ำฯ ภาษีเจริญ",
      lat: 13.6520, lng: 100.3020, buildYear: "2536", completeYear: "2538",
      gateCount: 4, gateType: "บานตรง", gateWidth: 4.0, gateHeight: 3.56,
      maxDischarge: 80, spillLevel: 0, floodLevel: 3.8, normalLevel: 1.3,
      pumps: [], additionalCanal: "คลองอ้อมน้อย", remark: "N/A"
    },
    series: {
      level: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      flow:  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      rain:  [0,0,1,2,3,1,0,0,0,0,1,2,1,0,0,0,0,1,2,1,0,0,0,0],
    }
  },
  {
    id: "PTR_PAEKONG", code: "ปตร.แป๊ะก๊ง", name: "ปตร.แป๊ะก๊ง", shortName: "แป๊ะก๊ง",
    x: 230, y: 682, type: "gate", status: "warn",
    desc: "ประตูระบายน้ำแป๊ะก๊ง ควบคุมน้ำในคลองภาษีเจริญส่วนล่าง",
    readings: { U: 0.54, D: 1.52, O: 0, P: 0 },
    info: {
      province: "สมุทรสาคร", district: "กระทุ่มแบน", subdistrict: "ท่าไม้",
      region: "ภาคกลาง", basin: "ท่าจีน", office: "โครงการส่งน้ำฯ ภาษีเจริญ",
      lat: 13.6420, lng: 100.2980, buildYear: "2500", completeYear: "2502",
      gateCount: 6, gateType: "บานตรง", gateWidth: 5.0, gateHeight: 4.0,
      maxDischarge: 120, spillLevel: 0, floodLevel: 4.0, normalLevel: 1.5,
      pumps: [], additionalCanal: "คลองภาษีเจริญตอนล่าง", remark: "ระดับน้ำด้านนอกสูงกว่าปกติ"
    },
    series: {
      level: [0.48,0.50,0.51,0.52,0.53,0.54,0.55,0.54,0.54,0.53,0.52,0.52,0.51,0.52,0.53,0.54,0.55,0.55,0.56,0.55,0.54,0.53,0.54,0.54],
      flow:  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      rain:  [0,0,2,4,6,3,1,0,0,0,2,4,2,0,0,0,1,3,5,3,1,0,0,0],
    }
  },
  {
    id: "SN_BANGPRA", code: "สน.ปตร.บางพระ", name: "สน.ปตร.บางพระ", shortName: "สน.บางพระ",
    x: 340, y: 738, type: "gate", status: "danger",
    desc: "สถานีสูบน้ำ-ประตูระบาย บางพระ ขนาด 3 ม³/วินาที × 3 เครื่อง",
    readings: { U: 0.63, D: 1.54, O: 0, P: 0 },
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
      additionalCanal: "คลองระพีพัฒน์", remark: "ระดับน้ำด้านนอกสูงวิกฤต"
    },
    series: {
      level: [0.55,0.57,0.59,0.60,0.61,0.62,0.63,0.63,0.63,0.62,0.61,0.61,0.60,0.61,0.62,0.63,0.64,0.64,0.65,0.64,0.63,0.62,0.63,0.63],
      flow:  [12.0,12.4,12.8,13.2,13.6,14.0,14.5,15.2,15.0,14.8,14.5,14.2,14.0,13.8,14.0,14.2,14.5,14.8,15.0,15.2,15.3,15.2,15.0,15.2],
      rain:  [0,0,3,6,10,5,2,0,0,0,5,8,4,1,0,0,1,4,9,6,3,0,0,0],
    }
  },
  {
    id: "SN_PTONN_KRATHUMBAN", code: "สน.ปตน.กระทุ่มแบน", name: "สน.ปตน.กระทุ่มแบน", shortName: "ปตน.กระทุ่มแบน",
    x: 340, y: 793, type: "gate", status: "ok",
    desc: "สถานีปตน.กระทุ่มแบน ระบายน้ำในคลองภาษีเจริญตอนปลาย",
    readings: { U: 0.54, D: 1.52, O: 0, P: 0 },
    info: {
      province: "สมุทรสาคร", district: "กระทุ่มแบน", subdistrict: "กระทุ่มแบน",
      region: "ภาคกลาง", basin: "ท่าจีน", office: "โครงการส่งน้ำฯ ภาษีเจริญ",
      lat: 13.6520, lng: 100.2650, buildYear: "2538", completeYear: "2540",
      gateCount: 4, gateType: "บานตรง", gateWidth: 4.0, gateHeight: 3.56,
      maxDischarge: 80, spillLevel: 0, floodLevel: 3.8, normalLevel: 1.3,
      pumps: [{ label: "ถาวร", count: 2, size: "2.0 ม³/วิ", maxRate: 4.0 }],
      additionalCanal: "คลองกระทุ่มแบน", remark: "N/A"
    },
    series: {
      level: [0.50,0.51,0.52,0.53,0.54,0.55,0.55,0.54,0.54,0.53,0.52,0.52,0.51,0.52,0.53,0.54,0.55,0.55,0.56,0.55,0.54,0.53,0.54,0.54],
      flow:  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      rain:  [0,0,1,3,5,2,0,0,0,0,2,4,2,0,0,0,1,3,4,2,1,0,0,0],
    }
  },
  {
    id: "SN_THASAO", code: "สน.ปตร.ท่าเสา", name: "สน.ปตร.ท่าเสา", shortName: "สน.ท่าเสา",
    x: 340, y: 843, type: "gate", status: "ok",
    desc: "สถานีปตร.ท่าเสา ควบคุมน้ำในคลองภาษีเจริญ",
    readings: { U: 0.00, D: 0.00, O: 0, P: 0 },
    info: {
      province: "สมุทรสาคร", district: "กระทุ่มแบน", subdistrict: "ท่าเสา",
      region: "ภาคกลาง", basin: "ท่าจีน", office: "โครงการส่งน้ำฯ ภาษีเจริญ",
      lat: 13.6480, lng: 100.2580, buildYear: "2540", completeYear: "2542",
      gateCount: 4, gateType: "บานตรง", gateWidth: 4.0, gateHeight: 3.56,
      maxDischarge: 80, spillLevel: 0, floodLevel: 3.8, normalLevel: 1.3,
      pumps: [], additionalCanal: "คลองท่าเสา", remark: "N/A"
    },
    series: {
      level: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      flow:  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      rain:  [0,0,0,1,2,1,0,0,0,0,1,1,0,0,0,0,0,1,2,1,0,0,0,0],
    }
  },
  {
    id: "SN_HAILHA", code: "สน.ปตร.ไหหล้า", name: "สน.ปตร.ไหหล้า", shortName: "สน.ไหหล้า",
    x: 340, y: 893, type: "gate", status: "ok",
    desc: "สถานีปตร.ไหหล้า ช่วยระบายน้ำในคลองภาษีเจริญ",
    readings: { U: 0.80, D: 2.03, O: 0, P: 0 },
    info: {
      province: "สมุทรสาคร", district: "กระทุ่มแบน", subdistrict: "ไหหล้า",
      region: "ภาคกลาง", basin: "ท่าจีน", office: "โครงการส่งน้ำฯ ภาษีเจริญ",
      lat: 13.6420, lng: 100.2520, buildYear: "2542", completeYear: "2544",
      gateCount: 4, gateType: "บานตรง", gateWidth: 4.0, gateHeight: 3.56,
      maxDischarge: 80, spillLevel: 0, floodLevel: 4.0, normalLevel: 1.5,
      pumps: [], additionalCanal: "คลองไหหล้า", remark: "N/A"
    },
    series: {
      level: [0.76,0.77,0.78,0.79,0.80,0.81,0.81,0.80,0.80,0.79,0.78,0.78,0.77,0.78,0.79,0.80,0.81,0.81,0.82,0.81,0.80,0.79,0.80,0.80],
      flow:  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      rain:  [0,0,1,3,5,2,0,0,0,0,2,4,2,0,0,0,1,3,4,2,1,0,0,0],
    }
  },
  {
    id: "SN_BANGKRUD", code: "สน.ปตร.บางกรูด", name: "สน.ปตร.บางกรูด", shortName: "สน.บางกรูด",
    x: 340, y: 940, type: "gate", status: "warn",
    desc: "สถานีปตร.บางกรูด ช่วยระบายน้ำในคลองภาษีเจริญ",
    readings: { U: 0.56, D: 2.10, O: 0, P: 0 },
    info: {
      province: "สมุทรสาคร", district: "กระทุ่มแบน", subdistrict: "บางกรูด",
      region: "ภาคกลาง", basin: "ท่าจีน", office: "โครงการส่งน้ำฯ ภาษีเจริญ",
      lat: 13.6360, lng: 100.2460, buildYear: "2544", completeYear: "2546",
      gateCount: 4, gateType: "บานตรง", gateWidth: 4.0, gateHeight: 3.56,
      maxDischarge: 80, spillLevel: 0, floodLevel: 4.0, normalLevel: 1.5,
      pumps: [], additionalCanal: "คลองบางกรูด", remark: "ระดับน้ำด้านนอกสูงเฝ้าระวัง"
    },
    series: {
      level: [0.52,0.53,0.54,0.55,0.56,0.57,0.57,0.56,0.56,0.55,0.54,0.54,0.53,0.54,0.55,0.56,0.57,0.57,0.58,0.57,0.56,0.55,0.56,0.56],
      flow:  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      rain:  [0,0,2,4,6,3,1,0,0,0,2,4,2,0,0,0,1,3,5,3,1,0,0,0],
    }
  },
  {
    id: "SN_TAPHET", code: "สน.ปตร.ตาเพชร", name: "สน.ปตร.ตาเพชร", shortName: "สน.ตาเพชร",
    x: 340, y: 988, type: "gate", status: "warn",
    desc: "สถานีปตร.ตาเพชร ช่วยระบายน้ำในคลองภาษีเจริญ",
    readings: { U: 0.65, D: 1.90, O: 0, P: 0 },
    info: {
      province: "สมุทรสาคร", district: "กระทุ่มแบน", subdistrict: "ตาเพชร",
      region: "ภาคกลาง", basin: "ท่าจีน", office: "โครงการส่งน้ำฯ ภาษีเจริญ",
      lat: 13.6300, lng: 100.2400, buildYear: "2546", completeYear: "2548",
      gateCount: 4, gateType: "บานตรง", gateWidth: 4.0, gateHeight: 3.56,
      maxDischarge: 80, spillLevel: 0, floodLevel: 4.0, normalLevel: 1.5,
      pumps: [], additionalCanal: "คลองตาเพชร", remark: "ระดับน้ำด้านนอกสูงเฝ้าระวัง"
    },
    series: {
      level: [0.61,0.62,0.63,0.64,0.65,0.66,0.66,0.65,0.65,0.64,0.63,0.63,0.62,0.63,0.64,0.65,0.66,0.66,0.67,0.66,0.65,0.64,0.65,0.65],
      flow:  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      rain:  [0,0,2,4,6,3,1,0,0,0,2,4,2,0,0,0,1,3,5,3,1,0,0,0],
    }
  },
  {
    id: "SN_SIWAPHAWASAT", code: "สน.ปตร.สีวาพาสวัสดิ์", name: "สน.ปตร.สีวาพาสวัสดิ์", shortName: "สีวาพาสวัสดิ์",
    x: 340, y: 1036, type: "gate", status: "ok",
    desc: "สถานีปตร.สีวาพาสวัสดิ์ ควบคุมน้ำท้ายโครงการ",
    readings: { U: 0.55, D: 1.95, O: 0, P: 0 },
    info: {
      province: "สมุทรสาคร", district: "กระทุ่มแบน", subdistrict: "สีวาพาสวัสดิ์",
      region: "ภาคกลาง", basin: "ท่าจีน", office: "โครงการส่งน้ำฯ ภาษีเจริญ",
      lat: 13.6240, lng: 100.2340, buildYear: "2548", completeYear: "2550",
      gateCount: 4, gateType: "บานตรง", gateWidth: 4.0, gateHeight: 3.56,
      maxDischarge: 80, spillLevel: 0, floodLevel: 4.0, normalLevel: 1.5,
      pumps: [], additionalCanal: "คลองสีวาพาสวัสดิ์", remark: "N/A"
    },
    series: {
      level: [0.51,0.52,0.53,0.54,0.55,0.56,0.56,0.55,0.55,0.54,0.53,0.53,0.52,0.53,0.54,0.55,0.56,0.56,0.57,0.56,0.55,0.54,0.55,0.55],
      flow:  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      rain:  [0,0,1,3,5,2,0,0,0,0,2,4,2,0,0,0,1,3,4,2,1,0,0,0],
    }
  },
  {
    id: "SN_KLONGKRU", code: "สน.ปตร.คลองครุ", name: "สน.ปตร.คลองครุ", shortName: "สน.คลองครุ",
    x: 230, y: 1082, type: "gate", status: "ok",
    desc: "สถานีปตร.คลองครุ ทางน้ำออกสู่คลองมหาชัย-สนามชัย",
    readings: { U: null, D: null, O: 0, P: 0 },
    info: {
      province: "สมุทรสาคร", district: "เมือง", subdistrict: "คลองครุ",
      region: "ภาคกลาง", basin: "ท่าจีน", office: "สำนักงานชลประทานที่ 13",
      lat: 13.6180, lng: 100.2280, buildYear: "2550", completeYear: "2552",
      gateCount: 4, gateType: "บานตรง", gateWidth: 4.0, gateHeight: 3.56,
      maxDischarge: 80, spillLevel: 0, floodLevel: 4.0, normalLevel: 1.5,
      pumps: [], additionalCanal: "คลองครุ", remark: "N/A"
    },
    series: {
      level: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      flow:  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      rain:  [0,0,0,1,2,1,0,0,0,0,1,1,0,0,0,0,0,1,2,1,0,0,0,0],
    }
  },
  {
    id: "SN_KOKKARABUO", code: "สน.ปตร.คอกกระบือ", name: "สน.ปตร.คอกกระบือ", shortName: "คอกกระบือ",
    x: 530, y: 1082, type: "gate", status: "ok",
    desc: "สถานีปตร.คอกกระบือ ทางน้ำออกสู่คลองมหาชัย-สนามชัย",
    readings: { U: 0.35, D: 1.15, O: 0, P: 0 },
    info: {
      province: "สมุทรสาคร", district: "เมือง", subdistrict: "คอกกระบือ",
      region: "ภาคกลาง", basin: "ท่าจีน", office: "สำนักงานชลประทานที่ 13",
      lat: 13.5960, lng: 100.2380, buildYear: "2540", completeYear: "2542",
      gateCount: 6, gateType: "บานตรง", gateWidth: 5.0, gateHeight: 4.0,
      maxDischarge: 120, spillLevel: 0, floodLevel: 4.5, normalLevel: 1.5,
      pumps: [], additionalCanal: "คลองคอกกระบือ", remark: "N/A"
    },
    series: {
      level: [0.31,0.32,0.33,0.34,0.35,0.36,0.36,0.35,0.35,0.34,0.33,0.33,0.32,0.33,0.34,0.35,0.36,0.36,0.37,0.36,0.35,0.34,0.35,0.35],
      flow:  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      rain:  [0,0,1,2,4,2,0,0,0,0,1,3,1,0,0,0,0,1,3,2,1,0,0,0],
    }
  },
  {
    id: "SN_BANGNUMJIT", code: "สน.ปตร.บางน้ำจืด", name: "สน.ปตร.บางน้ำจืด", shortName: "บางน้ำจืด",
    x: 610, y: 1082, type: "gate", status: "ok",
    desc: "สถานีปตร.บางน้ำจืด ทางน้ำออกสู่คลองมหาชัย-สนามชัย",
    readings: { U: 0.52, D: 1.30, O: 0, P: 0 },
    info: {
      province: "สมุทรสาคร", district: "เมือง", subdistrict: "บางน้ำจืด",
      region: "ภาคกลาง", basin: "ท่าจีน", office: "สำนักงานชลประทานที่ 13",
      lat: 13.5920, lng: 100.2450, buildYear: "2542", completeYear: "2544",
      gateCount: 6, gateType: "บานตรง", gateWidth: 5.0, gateHeight: 4.0,
      maxDischarge: 120, spillLevel: 0, floodLevel: 4.5, normalLevel: 1.5,
      pumps: [], additionalCanal: "คลองบางน้ำจืด", remark: "N/A"
    },
    series: {
      level: [0.48,0.49,0.50,0.51,0.52,0.53,0.53,0.52,0.52,0.51,0.50,0.50,0.49,0.50,0.51,0.52,0.53,0.53,0.54,0.53,0.52,0.51,0.52,0.52],
      flow:  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      rain:  [0,0,1,2,4,2,0,0,0,0,1,3,1,0,0,0,0,1,3,2,1,0,0,0],
    }
  },
  {
    id: "SN_MAHACHAI", code: "สน.ปตร.มหาชัย", name: "สน.ปตร.มหาชัย", shortName: "สน.มหาชัย",
    x: 420, y: 1135, type: "gate", status: "ok",
    desc: "ประตูระบายน้ำมหาชัย ทางออกสู่อ่าวไทยฝั่งตะวันตก",
    readings: { U: 0.15, D: null, O: 0, P: 0 },
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
];

const CAMERAS = [
  { id: 1, name: "สถานีภาษีเจริญ (CAM-01)", level: 47, status: "warning", waterPct: 47, stationId: "T1" },
  { id: 2, name: "สน.ปตร.สุคต (CAM-02)",    level: 22, status: "ok",      waterPct: 25, stationId: "SN_SUT" },
  { id: 3, name: "ปตร.แป๊ะก๊ง (CAM-03)",    level: 54, status: "warning", waterPct: 54, stationId: "PTR_PAEKONG" },
  { id: 4, name: "สน.บางพระ (CAM-04)",      level: 63, status: "danger",  waterPct: 63, stationId: "SN_BANGPRA" },
  { id: 5, name: "สน.มหาชัย (CAM-05)",      level: 15, status: "ok",      waterPct: 18, stationId: "SN_MAHACHAI" },
  { id: 6, name: "สน.อ้อมใหญ่ (CAM-06)",   level: 30, status: "ok",      waterPct: 30, stationId: "SN_OMYAI" },
  { id: 7, name: "สน.บางกรูด (CAM-07)",     level: 56, status: "warning", waterPct: 56, stationId: "SN_BANGKRUD" },
  { id: 8, name: "สถานีท่าจีน (CAM-08)",    level: 0,  status: "ok",      waterPct: 5,  stationId: "T14" },
  { id: 9, name: "สน.ฉาง (CAM-09)",         level: 20, status: "ok",      waterPct: 22, stationId: "SN_CHANG" },
];

const STATION_LIST_FOR_COMPARE = ["T1","T14","SN_SUT","PTR_PAEKONG","SN_BANGPRA","SN_MAHACHAI"];
const HOURS = Array.from({length:24},(_,i)=>i);
const CHART_COLORS = ["#1d4ed8","#047857","#b45309","#b91c1c","#6d28d9","#0e7490"];

const STATUS_CONFIG = {
  ok:     { color:"#047857", bg:"#ecfdf5", border:"#6ee7b7", label:"ปกติ" },
  warn:   { color:"#b45309", bg:"#fffbeb", border:"#fcd34d", label:"เฝ้าระวัง" },
  danger: { color:"#b91c1c", bg:"#fef2f2", border:"#fca5a5", label:"วิกฤต" },
};
function stCfg(s) { return STATUS_CONFIG[s] || STATUS_CONFIG.ok; }

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
function IconDashboard({ size=16, color="currentColor" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
}
function IconChart({ size=16, color="currentColor" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
}
function IconForecast({ size=16, color="currentColor" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>;
}
function IconMap({ size=16, color="currentColor" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>;
}
function IconCheckCircle({ size=14, color="#047857" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
}
function IconWarn({ size=14, color="#b45309" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
}
function IconAlert({ size=14, color="#b91c1c" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
}
function IconStation({ size=14, color="#1d4ed8" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>;
}
function IconDroplet({ size=14, color="#0e7490" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>;
}
function IconRain({ size=14, color="#6d28d9" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="16" y1="13" x2="16" y2="21"/><line x1="8" y1="13" x2="8" y2="21"/><line x1="12" y1="15" x2="12" y2="23"/><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/></svg>;
}
function IconLocation({ size=14, color="#374151" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
}
function IconBuild({ size=14, color="#374151" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="1"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
}
function IconGate({ size=14, color="#374151" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="14" rx="1"/><path d="M7 6V4M17 6V4M2 12h20M7 12v8M17 12v8"/></svg>;
}
function IconExtra({ size=14, color="#374151" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>;
}

// ─── STATION TYPE ICONS ───────────────────────────────────────────────────────
const GATE_PATH = "M8.35294 30.4815V22.1852C8.35294 21.5306 8.87967 21 9.52941 21H22.4706C23.1203 21 23.6471 21.5306 23.6471 22.1852V30.4815M10.7059 30.4815V25.1481C10.7059 24.4936 11.2326 23.963 11.8824 23.963H13.6471C14.2968 23.963 14.8235 24.4936 14.8235 25.1481V30.4815M17.1765 30.4815V25.1481C17.1765 24.4936 17.7032 23.963 18.3529 23.963H20.1176C20.7674 23.963 21.2941 24.4936 21.2941 25.1481V30.4815M7.7026 30.1539L8.97959 30.7971C9.32404 30.9706 9.73099 30.9633 10.0691 30.7775L12.2014 29.6059C12.5525 29.4129 12.9769 29.4129 13.3281 29.6059L15.4366 30.7645C15.7878 30.9575 16.2122 30.9575 16.5634 30.7645L18.6719 29.6059C19.0231 29.4129 19.4475 29.4129 19.7987 29.6059L21.9309 30.7775C22.269 30.9633 22.676 30.9706 23.0204 30.7971L24.2974 30.1539C25.0796 29.7599 26 30.3329 26 31.214V35.8148C26 36.4694 25.4733 37 24.8235 37H7.17647C6.52672 37 6 36.4694 6 35.8148V31.214C6 30.3329 6.92037 29.7599 7.7026 30.1539Z";

function GateIcon({ size = 24 }) {
  const h = Math.round(size * 56 / 32);
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={h} viewBox="0 0 32 56" fill="none">
      <rect width="32" height="56" rx="2" fill="#1153ED"/>
      <path d={GATE_PATH} stroke="white" strokeWidth="2"/>
    </svg>
  );
}

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

// ─── READING BADGE (U D O P) ──────────────────────────────────────────────────
function ReadingBadge({ label, value, unit = "ม.รทก." }) {
  const colors = {
    U: { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
    D: { bg: "#ecfdf5", color: "#047857", border: "#6ee7b7" },
    O: { bg: "#faf5ff", color: "#7c3aed", border: "#ddd6fe" },
    P: { bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" },
  };
  const c = colors[label] || { bg: "#f8fafc", color: "#64748b", border: "#e2e8f0" };
  const isNull = value === null || value === undefined;
  return (
    <div style={{
      display: "inline-flex", flexDirection: "column", alignItems: "center",
      padding: "3px 6px", borderRadius: 5, border: `1px solid ${isNull ? "#e2e8f0" : c.border}`,
      background: isNull ? "#f8fafc" : c.bg, minWidth: 46
    }}>
      <span style={{ fontSize: 9, fontWeight: 700, color: isNull ? "#cbd5e1" : c.color, letterSpacing: "0.05em" }}>{label}</span>
      <span style={{ fontSize: 11, fontWeight: 700, color: isNull ? "#cbd5e1" : c.color, fontFamily: "'IBM Plex Mono',monospace", lineHeight: 1.2 }}>
        {isNull ? "—" : typeof value === "number" ? (value === 0 ? "0" : `+${value.toFixed(2)}`) : value}
      </span>
      {!isNull && <span style={{ fontSize: 7, color: c.color, opacity: 0.7 }}>{unit}</span>}
    </div>
  );
}

// ─── MINI READINGS ROW ────────────────────────────────────────────────────────
function ReadingsRow({ readings, compact = false }) {
  const { U, D, O, P } = readings;
  const badges = [
    { label: "U", value: U, unit: "ม.รทก." },
    { label: "D", value: D, unit: "ม.รทก." },
    { label: "O", value: O, unit: "ม.พน." },
    { label: "P", value: P, unit: "ซม.มล." },
  ];
  // Hide P if null and compact
  const shown = compact ? badges.filter(b => b.value !== null) : badges;
  if (shown.length === 0) return null;
  return (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
      {shown.map(b => <ReadingBadge key={b.label} label={b.label} value={b.value} unit={b.unit} />)}
    </div>
  );
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
        return <g key={i}><line x1={padL} y1={y} x2={W-padR} y2={y} stroke="#f3f4f6" strokeWidth={1}/><text x={padL-4} y={y+4} fontSize={8} fill="#9ca3af" textAnchor="end">{v.toFixed(2)}</text></g>;
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
        return <g key={i}><line x1={padL} y1={y} x2={W-padR} y2={y} stroke="#f3f4f6" strokeWidth={1}/><text x={padL-4} y={y+4} fontSize={8} fill="#9ca3af" textAnchor="end">{v.toFixed(0)}</text></g>;
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
    }}>
      <Icon size={small?10:12} color={cfg.color}/>{cfg.label}
    </span>
  );
}

// ─── STATS POPUP ──────────────────────────────────────────────────────────────
function StatsPopup({ filterKey, label, color, bg, onStationClick, onClose }) {
  const filtered = filterKey === "all" ? STATIONS : STATIONS.filter(s => s.status === filterKey);
  const typeLabel = t => t === "gate" ? "ปตร./สน.ปตร." : "สถานีวัดน้ำ";
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.5)",zIndex:1002,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"}}
      onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:"#fff",borderRadius:16,width:600,maxHeight:"80vh",display:"flex",flexDirection:"column",boxShadow:"0 32px 80px rgba(0,0,0,0.25)",overflow:"hidden"}}>
        <div style={{padding:"18px 22px 14px",borderBottom:"1px solid #f3f4f6",display:"flex",alignItems:"center",justifyContent:"space-between",background:"#fafafa"}}>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:"#0f172a"}}>{label}</div>
            <div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>{filtered.length} สถานี · คลิกเพื่อดูรายละเอียด</div>
          </div>
          <button onClick={onClose} style={{width:30,height:30,borderRadius:6,border:"1px solid #e5e7eb",background:"#fff",cursor:"pointer",fontSize:16,color:"#94a3b8",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>
        <div style={{overflowY:"auto",flex:1,padding:"12px 16px",display:"flex",flexDirection:"column",gap:6}}>
          {filtered.map(st => {
            const cfg = stCfg(st.status);
            return (
              <div key={st.id} onClick={() => { onStationClick(st); onClose(); }}
                style={{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",borderRadius:8,border:"1px solid #f1f5f9",background:"#fff",cursor:"pointer",borderLeft:`3px solid ${cfg.color}`}}
                onMouseEnter={e=>{e.currentTarget.style.background="#f8fafc";}}
                onMouseLeave={e=>{e.currentTarget.style.background="#fff";}}>
                <div style={{flexShrink:0}}><StationTypeIconBox type={st.type} size={20}/></div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:600,color:"#0f172a",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{st.name}</div>
                  <div style={{fontSize:11,color:"#94a3b8",marginTop:1}}>{typeLabel(st.type)} · {st.info.province}</div>
                </div>
                <div style={{flexShrink:0}}>
                  <ReadingsRow readings={st.readings} compact />
                </div>
                <StatusBadge status={st.status} small/>
              </div>
            );
          })}
        </div>
        <div style={{padding:"8px 16px",borderTop:"1px solid #f3f4f6",background:"#fafafa",fontSize:10,color:"#94a3b8",textAlign:"center"}}>
          ข้อมูล ณ วันที่ 10/04/2569 เวลา 06:00 น. · กรมชลประทาน
        </div>
      </div>
    </div>
  );
}

// ─── STATION MODAL ────────────────────────────────────────────────────────────
function StationModal({ station, onClose }) {
  const [tab, setTab] = useState("water");
  const { info, readings } = station;
  const cfg = stCfg(station.status);
  const typeLabel = station.type==="gauging" ? "สถานีวัดน้ำอัตโนมัติ" : "ประตูระบายน้ำ / สถานีสูบน้ำ";

  // Compute display level from readings or fallback
  const displayLevel = readings.U ?? readings.level ?? 0;
  const displayFlow = readings.P ?? readings.flow ?? 0;

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
          </div>

          {tab==="water" && (
            <>
              {/* U D O P readings panel */}
              <div style={{background:"#fff",borderRadius:10,padding:14,marginBottom:14,border:"1px solid #e2e8f0"}}>
                <div style={{fontSize:11,fontWeight:700,color:"#374151",marginBottom:10,textTransform:"uppercase",letterSpacing:"0.06em",display:"flex",alignItems:"center",gap:5}}>
                  <IconDroplet size={12} color="#0e7490"/> ค่าวัดปัจจุบัน
                </div>
                <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"flex-end"}}>
                  {/* U */}
                  <div style={{flex:1,minWidth:120,background:"#eff6ff",borderRadius:8,padding:"10px 14px",border:"1px solid #bfdbfe"}}>
                    <div style={{fontSize:9,fontWeight:700,color:"#1d4ed8",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>U · ระดับน้ำเหนือ</div>
                    <div style={{fontSize:22,fontWeight:700,color:"#1d4ed8",fontFamily:"'IBM Plex Mono',monospace",lineHeight:1}}>
                      {readings.U !== null ? `+${readings.U.toFixed(2)}` : "—"}
                    </div>
                    {readings.U !== null && <div style={{fontSize:9,color:"#1d4ed8",marginTop:3}}>ม.รทก.</div>}
                    {readings.U !== null && <div style={{marginTop:6,height:24}}><MiniSparkline data={station.series.level} color="#1d4ed8" h={24}/></div>}
                  </div>
                  {/* D */}
                  <div style={{flex:1,minWidth:120,background:"#ecfdf5",borderRadius:8,padding:"10px 14px",border:"1px solid #6ee7b7"}}>
                    <div style={{fontSize:9,fontWeight:700,color:"#047857",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>D · ระดับน้ำท้าย</div>
                    <div style={{fontSize:22,fontWeight:700,color:"#047857",fontFamily:"'IBM Plex Mono',monospace",lineHeight:1}}>
                      {readings.D !== null ? `+${readings.D.toFixed(2)}` : "—"}
                    </div>
                    {readings.D !== null && <div style={{fontSize:9,color:"#047857",marginTop:3}}>ม.รทก.</div>}
                  </div>
                  {/* O */}
                  <div style={{flex:1,minWidth:120,background:"#faf5ff",borderRadius:8,padding:"10px 14px",border:"1px solid #ddd6fe"}}>
                    <div style={{fontSize:9,fontWeight:700,color:"#7c3aed",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>O · เปิดบาน/จำนวน</div>
                    <div style={{fontSize:22,fontWeight:700,color:"#7c3aed",fontFamily:"'IBM Plex Mono',monospace",lineHeight:1}}>
                      {readings.O !== null ? readings.O : "—"}
                    </div>
                    {readings.O !== null && <div style={{fontSize:9,color:"#7c3aed",marginTop:3}}>ม.พน.</div>}
                  </div>
                  {/* P */}
                  {readings.P !== null && (
                    <div style={{flex:1,minWidth:120,background:"#fff7ed",borderRadius:8,padding:"10px 14px",border:"1px solid #fed7aa"}}>
                      <div style={{fontSize:9,fontWeight:700,color:"#c2410c",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>P · ปริมาณการระบาย</div>
                      <div style={{fontSize:22,fontWeight:700,color:"#c2410c",fontFamily:"'IBM Plex Mono',monospace",lineHeight:1}}>
                        {readings.P}
                      </div>
                      <div style={{fontSize:9,color:"#c2410c",marginTop:3}}>ซม.มล.</div>
                    </div>
                  )}
                </div>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                <div style={{background:"#f8fafc",borderRadius:8,padding:12,border:"1px solid #e2e8f0"}}>
                  <div style={{fontSize:11,fontWeight:600,color:"#374151",marginBottom:6,display:"flex",alignItems:"center",gap:5}}>
                    <IconDroplet size={12} color="#1d4ed8"/> ระดับน้ำ 24 ชม.
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
                  <div style={{fontSize:10,color:"#047857",fontWeight:600,textTransform:"uppercase"}}>ละติจูด</div>
                  <div style={{fontSize:17,fontWeight:700,color:"#14532d",marginTop:4,fontFamily:"'IBM Plex Mono',monospace"}}>{info.lat}°N</div>
                </div>
                <div style={{background:"#fdf4ff",borderRadius:8,padding:"10px 14px",border:"1px solid #e9d5ff"}}>
                  <div style={{fontSize:10,color:"#7e22ce",fontWeight:600,textTransform:"uppercase"}}>ลองจิจูด</div>
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
                    {[["จำนวนบานประตู",info.gateCount],["ประเภท",info.gateType],["ความกว้าง",`${info.gateWidth} ม.`],["ความสูง",`${info.gateHeight} ม.`],["อัตราระบายสูงสุด",`${info.maxDischarge} ม³/วิ`],["ระดับน้ำล้น",`${info.floodLevel} ม.`]].map(([k,v])=>(
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
      <polygon points={`0,${110-wPct*0.55} 80,${110-wPct*0.55} 80,110 0,110`} fill="#8a7060"/>
      <polygon points={`120,${110-wPct*0.55} 200,${110-wPct*0.55} 200,110 120,110`} fill="#8a7060"/>
      <rect x={0} y={110-wPct*0.55} width={80} height={wPct*0.55} fill={col} opacity={0.75}/>
      <rect x={90} y={48} width={20} height={62} fill={col} opacity={0.7}/>
      <rect x={120} y={110-wPct*0.55} width={80} height={wPct*0.55} fill={col} opacity={0.75}/>
    </svg>
  ),
  (wPct, col) => (
    <svg viewBox="0 0 200 110" style={{width:"100%",height:"100%",display:"block"}}>
      <rect width={200} height={110} fill="#d4e8c2"/>
      <polygon points={`40,110 60,${110-wPct*0.5} 140,${110-wPct*0.5} 160,110`} fill="#9a8870"/>
      <rect x={60} y={110-wPct*0.5} width={80} height={wPct*0.5} fill={col} opacity={0.8}/>
    </svg>
  ),
  (wPct, col) => (
    <svg viewBox="0 0 200 110" style={{width:"100%",height:"100%",display:"block"}}>
      <rect width={200} height={110} fill="#bccfdc"/>
      <rect x={0} y={40} width={60} height={70} fill="#c8cdd2"/><rect x={140} y={40} width={60} height={70} fill="#c8cdd2"/>
      <rect x={0} y={38} width={200} height={8} fill="#aab0b8"/>
      <rect x={0} y={110-(wPct*0.65+8)} width={64} height={wPct*0.65+8} fill={col} opacity={0.82}/>
      <rect x={136} y={110-wPct*0.35} width={64} height={wPct*0.35} fill={col} opacity={0.7}/>
    </svg>
  ),
  (wPct, col) => (
    <svg viewBox="0 0 200 110" style={{width:"100%",height:"100%",display:"block"}}>
      <rect width={200} height={110} fill="#dce8d8"/>
      <rect x={40} y={25} width={120} height={75} fill="#e8e0d8"/>
      <rect x={0} y={90} width={200} height={20} fill="#9a8870"/>
      <rect x={0} y={110-wPct*0.18} width={200} height={wPct*0.18} fill={col} opacity={0.8}/>
    </svg>
  ),
  (wPct, col) => (
    <svg viewBox="0 0 200 110" style={{width:"100%",height:"100%",display:"block"}}>
      <rect width={200} height={110} fill="#c8dce8"/>
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
      {[40,80,120,160].map(x=><rect key={x} x={x-6} y={110-wPct*0.5} width={12} height={wPct*0.5} fill={col} opacity={0.75}/>)}
      <rect x={20} y={110-wPct*0.4} width={160} height={wPct*0.4} fill={col} opacity={0.6}/>
    </svg>
  ),
  (wPct, col) => (
    <svg viewBox="0 0 200 110" style={{width:"100%",height:"100%",display:"block"}}>
      <rect width={200} height={110} fill="#ccd8e4"/>
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
      <rect x={0} y={110-wPct*0.35} width={200} height={wPct*0.35} fill={col} opacity={0.4}/>
    </svg>
  ),
  (wPct, col) => (
    <svg viewBox="0 0 200 110" style={{width:"100%",height:"100%",display:"block"}}>
      <rect width={200} height={110} fill="#c0d4e4"/>
      <rect x={75} y={55} width={50} height={wPct*0.5} fill={col} opacity={0.85}/>
      <rect x={0} y={110-wPct*0.4} width={80} height={wPct*0.4} fill={col} opacity={0.65}/>
    </svg>
  ),
];

function CameraFeed({ cam, onClick }) {
  const st = STATIONS.find(s => s.id === cam.stationId);
  const scfg = cam.status==="ok" ? {color:"#047857",bg:"#ecfdf5",label:"ปกติ"} : cam.status==="warning" ? {color:"#b45309",bg:"#fffbeb",label:"เฝ้าระวัง"} : {color:"#b91c1c",bg:"#fef2f2",label:"วิกฤต"};
  const wCol = cam.status==="danger" ? "rgba(239,68,68,0.55)" : cam.status==="warning" ? "rgba(245,158,11,0.45)" : "rgba(59,130,246,0.55)";
  const SceneRenderer = CAM_SCENES[(cam.id-1) % CAM_SCENES.length];
  return (
    <div onClick={onClick} style={{borderRadius:8,overflow:"hidden",border:"1px solid #e2e8f0",cursor:"pointer",background:"#fff"}}>
      <div style={{position:"relative",height:72,background:"#0f1a2e",overflow:"hidden"}}>
        <SceneRenderer wPct={cam.waterPct} col={wCol}/>
        <div style={{position:"absolute",top:0,left:0,right:0,background:"rgba(0,0,0,0.4)",padding:"2px 5px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:3}}>
            <div style={{width:5,height:5,borderRadius:"50%",background:scfg.color,animation:"pulse 1.5s infinite"}}/>
            <span style={{fontSize:7,color:"#fff",fontFamily:"'IBM Plex Mono',monospace"}}>REC · CAM-0{cam.id}</span>
          </div>
          <span style={{fontSize:7,color:"rgba(255,255,255,0.75)",fontFamily:"'IBM Plex Mono',monospace"}}>10-04-69 06:00</span>
        </div>
        {st && <div style={{position:"absolute",top:16,right:3,width:14,height:14,display:"flex",alignItems:"center",justifyContent:"center"}}><StationTypeIconBox type={st.type} size={12}/></div>}
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
// คาดเดาตำแหน่งสถานีในแผนที่ SVG ตามผังน้ำจริง (สเกล 700×1200)
const MAP_STATIONS = [
  // แม่น้ำท่าจีน (แนวตั้งซ้าย)
  { id: "T1",    x: 62,  y: 80   },
  { id: "T14",   x: 62,  y: 390  },
  // คลองมหาสวัสดิ์ (แถวบน)
  { id: "PTR_LADNGWLAI",    x: 230, y: 128 },
  { id: "PTR_SUT",           x: 310, y: 128 },
  { id: "PTR_BANGDOEY",      x: 390, y: 128 },
  { id: "PTR_SAMBAT",        x: 470, y: 128 },
  // คลองภาษีเจริญ (แนวตั้งกลาง)
  { id: "SN_SUT",            x: 155, y: 185 },
  { id: "SN_THRB_BANGDOEY",  x: 155, y: 242 },
  { id: "SN_SAMBAT",         x: 155, y: 297 },
  { id: "SN_CHANG",          x: 155, y: 350 },
  { id: "SN_BANGSUE",        x: 155, y: 405 },
  { id: "SN_KLONGTHAPUD",    x: 155, y: 462 },
  { id: "SN_PHAKDUN",        x: 155, y: 518 },
  { id: "SN_OMYAI",          x: 155, y: 574 },
  { id: "SN_OMNOEY",         x: 155, y: 626 },
  { id: "PTR_PAEKONG",       x: 155, y: 682 },
  { id: "SN_BANGPRA",        x: 270, y: 738 },
  { id: "SN_PTONN_KRATHUMBAN",x:270, y: 793 },
  { id: "SN_THASAO",         x: 270, y: 843 },
  { id: "SN_HAILHA",         x: 270, y: 893 },
  { id: "SN_BANGKRUD",       x: 270, y: 940 },
  { id: "SN_TAPHET",         x: 270, y: 988 },
  { id: "SN_SIWAPHAWASAT",   x: 270, y:1036 },
  // ท้ายโครงการ
  { id: "SN_KLONGKRU",       x: 155, y:1082 },
  { id: "SN_KOKKARABUO",     x: 430, y:1082 },
  { id: "SN_BANGNUMJIT",     x: 510, y:1082 },
  { id: "SN_MAHACHAI",       x: 310, y:1135 },
];

function FlowMap({ onStationClick }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({x:0,y:0});
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef({start:{x:0,y:0},panStart:{x:0,y:0}});
  const W=620, H=1200;
  const MIN_ZOOM=0.35, MAX_ZOOM=4;
  const handleWheel = useCallback((e)=>{e.preventDefault();const d=e.deltaY>0?-0.1:0.1;setZoom(z=>Math.min(MAX_ZOOM,Math.max(MIN_ZOOM,parseFloat((z+d).toFixed(2)))));},[]);
  const handleMouseDown = useCallback((e)=>{if(e.button!==0)return;dragRef.current={start:{x:e.clientX,y:e.clientY},panStart:{...pan}};setDragging(true);},[pan]);
  const handleMouseMove = useCallback((e)=>{if(!dragging)return;const{start,panStart}=dragRef.current;setPan({x:panStart.x+(e.clientX-start.x),y:panStart.y+(e.clientY-start.y)});},[dragging]);
  const handleMouseUp = useCallback(()=>setDragging(false),[]);
  const zoomIn=()=>setZoom(z=>Math.min(MAX_ZOOM,parseFloat((z+0.2).toFixed(2))));
  const zoomOut=()=>setZoom(z=>Math.max(MIN_ZOOM,parseFloat((z-0.2).toFixed(2))));
  const resetView=()=>{setZoom(1);setPan({x:0,y:0});};

  // Build map from id -> station
  const stMap = Object.fromEntries(STATIONS.map(s=>[s.id,s]));

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
      <div style={{transform:`translate(${pan.x}px,${pan.y}px) scale(${zoom})`,transformOrigin:"center top",width:"100%",height:"100%",display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:12}}>
        <svg viewBox={`0 0 ${W} ${H}`} width={W*0.65} height={H*0.65} style={{fontFamily:"'Sarabun',sans-serif",display:"block"}}>
          <rect width={W} height={H} fill="#f8fafc"/>
          {/* Grid */}
          {Array.from({length:Math.ceil(W/40)}).map((_,i)=><line key={`v${i}`} x1={i*40} y1={0} x2={i*40} y2={H} stroke="rgba(226,232,240,0.6)" strokeWidth={0.5}/>)}
          {Array.from({length:Math.ceil(H/40)}).map((_,i)=><line key={`h${i}`} x1={0} y1={i*40} x2={W} y2={i*40} stroke="rgba(226,232,240,0.6)" strokeWidth={0.5}/>)}
          
          {/* ── แม่น้ำท่าจีน (แนวตั้ง ซ้าย) */}
          <line x1={62} y1={0} x2={62} y2={H} stroke="rgba(59,130,246,0.28)" strokeWidth={12}/>
          <text x={30} y={250} fontSize={9} fill="#64748b" writingMode="tb" transform="rotate(-90,30,250)">แม่น้ำท่าจีน</text>
          
          {/* ── คลองมหาสวัสดิ์ (แถวบน แนวนอน) */}
          <line x1={62} y1={128} x2={520} y2={128} stroke="rgba(59,130,246,0.22)" strokeWidth={8}/>
          <text x={300} y={118} fontSize={8} fill="#64748b" textAnchor="middle">คลองมหาสวัสดิ์</text>
          
          {/* ── คลองภาษีเจริญ (แนวตั้ง กลาง) */}
          <line x1={155} y1={128} x2={155} y2={H-40} stroke="rgba(59,130,246,0.22)" strokeWidth={9}/>
          <text x={175} y={600} fontSize={9} fill="#1d4ed8" writingMode="tb" fontWeight={600} transform="rotate(90,175,600)">คลองภาษีเจริญ</text>

          {/* ── เส้นต่อจากแม่น้ำเข้าคลองภาษีเจริญ */}
          <line x1={62} y1={185} x2={155} y2={185} stroke="rgba(59,130,246,0.18)" strokeWidth={5}/>
          
          {/* ── สาขาขวาออกไป (สน.บางพระ, กระทุ่มแบน ฯลฯ) */}
          <line x1={155} y1={738} x2={320} y2={738} stroke="rgba(59,130,246,0.18)" strokeWidth={5}/>
          <line x1={155} y1={793} x2={320} y2={793} stroke="rgba(59,130,246,0.18)" strokeWidth={4}/>
          <line x1={155} y1={843} x2={320} y2={843} stroke="rgba(59,130,246,0.18)" strokeWidth={4}/>
          <line x1={155} y1={893} x2={320} y2={893} stroke="rgba(59,130,246,0.18)" strokeWidth={4}/>
          <line x1={155} y1={940} x2={320} y2={940} stroke="rgba(59,130,246,0.18)" strokeWidth={4}/>
          <line x1={155} y1={988} x2={320} y2={988} stroke="rgba(59,130,246,0.18)" strokeWidth={4}/>
          <line x1={155} y1={1036} x2={320} y2={1036} stroke="rgba(59,130,246,0.18)" strokeWidth={4}/>
          
          {/* ── คลองมหาชัย-สนามชัย (แถวล่าง แนวนอน) */}
          <line x1={62} y1={1135} x2={560} y2={1135} stroke="rgba(59,130,246,0.22)" strokeWidth={8}/>
          <text x={350} y={1150} fontSize={8} fill="#64748b" textAnchor="middle">คลองมหาชัย – สนามชัย</text>
          
          {/* ── เส้นต่อเข้าคลองมหาชัย */}
          <line x1={155} y1={1082} x2={155} y2={1135} stroke="rgba(59,130,246,0.15)" strokeWidth={5}/>
          <line x1={430} y1={1082} x2={430} y2={1135} stroke="rgba(59,130,246,0.15)" strokeWidth={4}/>
          <line x1={510} y1={1082} x2={510} y2={1135} stroke="rgba(59,130,246,0.15)" strokeWidth={4}/>
          
          {/* อ่าวไทย */}
          <text x={310} y={H-12} fontSize={10} fill="#94a3b8" textAnchor="middle" fontStyle="italic">▼ อ่าวไทย</text>

          {/* ── STATIONS ── */}
          {MAP_STATIONS.map(({ id, x, y }) => {
            const st = stMap[id];
            if (!st) return null;
            const cfg = stCfg(st.status);
            const isGauging = st.type === "gauging";
            const r = 18;
            const { U, D, O, P } = st.readings;
            return (
              <g key={id} style={{cursor:"pointer"}} onClick={e=>{e.stopPropagation();if(!dragging)onStationClick?.(st);}}>
                {/* Outer ring */}
                <circle cx={x} cy={y} r={r} fill={cfg.bg} stroke={cfg.border} strokeWidth={1.5} opacity={0.97}/>
                {/* Icon */}
                {isGauging ? (
                  <g transform={`translate(${x-8},${y-9}) scale(0.47)`}>
                    <path d="M18.125 0.938194L32.7135 9.36084C32.7908 9.4055 32.8385 9.48803 32.8385 9.57735V26.4226C32.8385 26.512 32.7908 26.5945 32.7135 26.6392L18.125 35.0618C18.0476 35.1065 17.9524 35.1065 17.875 35.0618L3.28654 26.6392C3.20919 26.5945 3.16154 26.512 3.16154 26.4226V9.57735C3.16154 9.48803 3.20919 9.4055 3.28654 9.36084L17.875 0.938194Z" fill="#0369a1" stroke="white" strokeWidth="2.5"/>
                    <path d="M8 23C9 24 10 25 11.5 25C13.5 25 15 24 16.5 23M8 19C9 20 10 20 11 20C13 20 14 19 15.5 18C17 17 18 17 19 17M8 14C9 15 10 15 11 15C13 15 14 14 16 13.5C17.5 12.7 18.5 12 20.5 12" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
                  </g>
                ) : (
                  <g>
                    <circle cx={x} cy={y} r={12} fill="#1153ED"/>
                    <g transform={`translate(${x-7.5},${y-8}) scale(0.48)`}>
                      <path d={GATE_PATH} stroke="white" strokeWidth="2.2" fill="none"/>
                    </g>
                  </g>
                )}
                {/* Label box */}
                <rect x={x+r+2} y={y-12} width={st.shortName.length*5.2+8} height={13} fill="rgba(255,255,255,0.97)" rx={3} stroke={cfg.border} strokeWidth={0.5}/>
                <text x={x+r+6} y={y-2} fontSize={8} fill={cfg.color} fontWeight="700">{st.shortName}</text>
                {/* U D values */}
                {(U !== null || D !== null) && (
                  <g>
                    <rect x={x+r+2} y={y+3} width={72} height={22} fill="rgba(255,255,255,0.94)" rx={3} stroke="#e2e8f0" strokeWidth={0.5}/>
                    {U !== null && (
                      <>
                        <text x={x+r+5} y={y+11} fontSize={6.5} fill="#1d4ed8" fontWeight="700">U</text>
                        <text x={x+r+13} y={y+11} fontSize={7} fill="#1d4ed8" fontFamily="'IBM Plex Mono',monospace">{`+${U.toFixed(2)}`}</text>
                      </>
                    )}
                    {D !== null && (
                      <>
                        <text x={x+r+5} y={y+21} fontSize={6.5} fill="#047857" fontWeight="700">D</text>
                        <text x={x+r+13} y={y+21} fontSize={7} fill="#047857" fontFamily="'IBM Plex Mono',monospace">{`+${D.toFixed(2)}`}</text>
                      </>
                    )}
                    {O !== null && (
                      <>
                        <text x={x+r+42} y={y+11} fontSize={6.5} fill="#7c3aed" fontWeight="700">O</text>
                        <text x={x+r+50} y={y+11} fontSize={7} fill="#7c3aed" fontFamily="'IBM Plex Mono',monospace">{O}</text>
                      </>
                    )}
                    {P !== null && (
                      <>
                        <text x={x+r+42} y={y+21} fontSize={6.5} fill="#c2410c" fontWeight="700">P</text>
                        <text x={x+r+50} y={y+21} fontSize={7} fill="#c2410c" fontFamily="'IBM Plex Mono',monospace">{P}</text>
                      </>
                    )}
                  </g>
                )}
                {/* Status dot */}
                <circle cx={x+r-4} cy={y-r+4} r={4} fill={cfg.color} stroke="white" strokeWidth={1}/>
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
    <div onClick={()=>onClick(station)} style={{borderRadius:7,padding:"8px 10px",border:"1px solid #f1f5f9",background:"#fff",cursor:"pointer",borderLeft:`2.5px solid ${cfg.color}`}}
      onMouseEnter={e=>{e.currentTarget.style.background="#f8fafc";}}
      onMouseLeave={e=>{e.currentTarget.style.background="#fff";}}>
      <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:4}}>
        <div style={{flexShrink:0}}><StationTypeIconBox type={station.type} size={13}/></div>
        <span style={{fontSize:9,color:"#64748b",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontWeight:500,flex:1}}>{station.shortName}</span>
        <StatusBadge status={station.status} small/>
      </div>
      {/* U D O P badges */}
      <ReadingsRow readings={station.readings} compact />
      {station.series && (
        <div style={{marginTop:4,height:16}}><MiniSparkline data={station.series.level} color={cfg.color} h={16}/></div>
      )}
    </div>
  );
}

function Chip({children,active,onClick,color="#1d4ed8"}){
  return (
    <button onClick={onClick} style={{padding:"4px 12px",borderRadius:4,border:`1px solid ${active?color:"#e2e8f0"}`,fontSize:11,cursor:"pointer",background:active?`${color}12`:"#fff",color:active?color:"#64748b",fontWeight:active?600:400,whiteSpace:"nowrap"}}>
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
          <span style={{fontSize:10,color:"#94a3b8",fontWeight:700,textTransform:"uppercase"}}>สถานี</span>
          <select value={forecastStation} onChange={e=>setForecastStation(e.target.value)}
            style={{padding:"4px 10px",border:"1px solid #e2e8f0",borderRadius:5,fontSize:12,fontFamily:"'Sarabun',sans-serif",background:"#fff",color:"#0f172a"}}>
            {STATIONS.map(s=><option key={s.id} value={s.id}>{s.shortName}</option>)}
          </select>
        </div>
        <div style={{display:"flex",gap:5,alignItems:"center"}}>
          <span style={{fontSize:10,color:"#94a3b8",fontWeight:700,textTransform:"uppercase"}}>ช่วงเวลา</span>
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
            {Icon:IconDroplet,label:"ระดับปัจจุบัน (U)",value:`+${base.toFixed(2)} ม.`,color:"#1d4ed8",bg:"#eff6ff"},
            {Icon:IconWarn,label:"คาดสูงสุด",value:`+${maxForecast.toFixed(2)} ม.`,color:"#b45309",bg:"#fffbeb"},
            {Icon:IconRain,label:"ฝนสะสม (คาด)",value:`${rainForecast.slice(0,24).reduce((a,b)=>a+b,0).toFixed(1)} มม.`,color:"#6d28d9",bg:"#faf5ff"},
            {Icon:IconChart,label:"แนวโน้ม",value:st.status==="danger"?"↑ สูงขึ้น":st.status==="warn"?"→ ทรงตัว":"↓ ลดลง",color:riskColor,bg:riskBg},
          ].map((s,i)=>(
            <div key={i} style={{background:s.bg,borderRadius:8,padding:12,border:"1px solid #e2e8f0"}}>
              <s.Icon size={14} color={s.color}/>
              <div style={{fontSize:10,color:"#94a3b8",margin:"4px 0 2px",textTransform:"uppercase"}}>{s.label}</div>
              <div style={{fontSize:16,fontWeight:700,color:s.color,fontFamily:"'IBM Plex Mono',monospace"}}>{s.value}</div>
            </div>
          ))}
        </div>
        <div style={{background:"#fff",borderRadius:10,padding:16,border:"1px solid #e2e8f0"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:"#0f172a"}}>คาดการณ์ระดับน้ำ – {st.shortName}</div>
              <div style={{fontSize:10,color:"#94a3b8",marginTop:2}}>{hrs} ชั่วโมงถัดไป · ข้อมูล 10/04/2569</div>
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
  const [selectedForChart, setSelectedForChart] = useState(new Set(["T1","SN_CHANG"]));
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
    {label:"สถานีทั้งหมด", value:STATIONS.length, Icon:IconStation,color:"#1d4ed8",bg:"#eff6ff", filterKey:"all"},
    {label:"สถานีปกติ",   value:STATIONS.filter(s=>s.status==="ok").length, Icon:IconCheckCircle,color:"#047857",bg:"#ecfdf5", filterKey:"ok"},
    {label:"เฝ้าระวัง",  value:STATIONS.filter(s=>s.status==="warn").length, Icon:IconWarn,color:"#b45309",bg:"#fffbeb", filterKey:"warn"},
    {label:"วิกฤต",       value:STATIONS.filter(s=>s.status==="danger").length, Icon:IconAlert,color:"#b91c1c",bg:"#fef2f2", filterKey:"danger"},
    {label:"ปตร./สน.ปตร.",value:STATIONS.filter(s=>s.type==="gate").length, Icon:IconGate,color:"#0e7490",bg:"#f0f9ff", filterKey:"all"},
    {label:"สถานีวัดน้ำ", value:STATIONS.filter(s=>s.type==="gauging").length, Icon:IconDroplet,color:"#6d28d9",bg:"#faf5ff", filterKey:"all"},
  ];

  const tabs = [
    {id:"dashboard",label:"Dashboard",Icon:IconDashboard},
    {id:"compare",  label:"เปรียบเทียบ",Icon:IconChart},
    {id:"forecast", label:"คาดการณ์",Icon:IconForecast},
    {id:"flowmap",  label:"ผังน้ำ",Icon:IconMap},
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
          <div style={{width:36,height:36,borderRadius:8,background:"#1d4ed8",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="20" height="20" viewBox="0 0 36 36" fill="none">
              <path d="M18.125 0.938194L32.7135 9.36084V26.4226L18.125 35.0618L3.28654 26.4226V9.57735L18.125 0.938194Z" fill="white" opacity="0.25" stroke="white" strokeWidth="2"/>
              <path d="M8 23C9 24 10 25 11.5 25C13.5 25 15 24 16.5 23M8 19C9 20 10 20 11 20C13 20 15 18.5 16.5 18C18 17 19 17 20 17M8 14C9 15 10 15 11 15C13 15 15.5 13.5 17 12.7C18.5 12 19.5 12 20.5 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:"#0f172a"}}>โครงการส่งน้ำและบำรุงรักษาภาษีเจริญ</div>
            <div style={{fontSize:10,color:"#94a3b8"}}>Phasee Charoen Irrigation Project · Real-time Monitoring System</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:10,color:"#94a3b8"}}>วันพฤหัสบดีที่ 10 เมษายน 2569</div>
            <div style={{fontSize:10,color:"#047857",fontWeight:600}}>ข้อมูล ณ เวลา 06:00 น.</div>
          </div>
          <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:14,color:"#1d4ed8",fontWeight:600}}>{time}</div>
          <div style={{display:"flex",alignItems:"center",gap:6,background:"#ecfdf5",border:"1px solid #6ee7b7",padding:"4px 10px",borderRadius:4}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:"#047857",animation:"pulse 2s infinite"}}/>
            <span style={{fontSize:10,color:"#047857",fontWeight:700}}>ONLINE</span>
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
              background:"none",cursor:"pointer"}}>
            <Icon size={13} color={activeTab===id?"#1d4ed8":"#94a3b8"}/>{label}
          </button>
        ))}
      </nav>

      {/* CONTENT */}
      <div style={{flex:1,overflow:"hidden"}}>

        {/* DASHBOARD */}
        {activeTab==="dashboard" && (
          <div style={{display:"grid",gridTemplateColumns:"210px 1fr 220px",height:"100%",overflow:"hidden"}}>
            {/* LEFT */}
            <aside style={{overflowY:"auto",padding:10,display:"flex",flexDirection:"column",gap:6,background:"#f8fafc",borderRight:"1px solid #e2e8f0"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
                {summaryStats.map((s,i)=>(
                  <div key={i} onClick={()=>setStatsPopup(s)}
                    style={{background:"#fff",borderRadius:7,padding:"8px 10px",cursor:"pointer",border:"1px solid #f1f5f9"}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=`${s.color}40`;e.currentTarget.style.background=s.bg;}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor="#f1f5f9";e.currentTarget.style.background="#fff";}}>
                    <s.Icon size={13} color={s.color}/>
                    <div style={{fontSize:16,fontWeight:700,color:s.color,marginTop:3,fontFamily:"'IBM Plex Mono',monospace",lineHeight:1}}>{s.value}</div>
                    <div style={{fontSize:9,color:"#94a3b8",marginTop:2}}>{s.label}</div>
                  </div>
                ))}
              </div>
              {/* Legend for U D O P */}
              <div style={{background:"#fff",borderRadius:7,padding:"8px 10px",border:"1px solid #f1f5f9"}}>
                <div style={{fontSize:8,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>สัญลักษณ์ค่าวัด</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4px 8px"}}>
                  {[["U","#1d4ed8","#eff6ff","ระดับน้ำเหนือ"],["D","#047857","#ecfdf5","ระดับน้ำท้าย"],["O","#7c3aed","#faf5ff","เปิดบาน (ม.พน.)"],["P","#c2410c","#fff7ed","ปริมาณระบาย"]].map(([l,c,bg,desc])=>(
                    <div key={l} style={{display:"flex",alignItems:"center",gap:5}}>
                      <span style={{width:16,height:16,borderRadius:3,background:bg,border:`1px solid ${c}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:700,color:c,flexShrink:0}}>{l}</span>
                      <span style={{fontSize:8,color:"#64748b",lineHeight:1.2}}>{desc}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6,padding:"4px 4px 0"}}>
                <div style={{width:2,height:12,background:"#1d4ed8",borderRadius:1}}/>
                <span style={{fontSize:9,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.08em"}}>สถานีทั้งหมด ({STATIONS.length})</span>
              </div>
              {STATIONS.map(st=><StatCard key={st.id} station={st} onClick={setSelectedStation}/>)}
            </aside>

            {/* CENTER */}
            <main style={{display:"flex",flexDirection:"column",overflow:"hidden"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"7px 14px",background:"#fff",borderBottom:"1px solid #e2e8f0",flexShrink:0}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <IconMap size={13} color="#1d4ed8"/>
                  <span style={{fontSize:11,fontWeight:700,color:"#1d4ed8"}}>ผังโครงการส่งน้ำภาษีเจริญ</span>
                </div>
                <span style={{fontSize:9,color:"#94a3b8"}}>คลิกที่สถานีเพื่อดูรายละเอียด</span>
              </div>
              <div style={{flex:1,overflow:"auto",display:"flex",alignItems:"flex-start",justifyContent:"center",padding:12}}>
                <FlowMap onStationClick={setSelectedStation}/>
              </div>
              <div style={{padding:"6px 14px",background:"#fff",borderTop:"1px solid #e2e8f0",display:"flex",gap:14,alignItems:"center",flexShrink:0,flexWrap:"wrap"}}>
                {[["#0369a1","สถานีวัดน้ำ"],["#1153ED","ปตร./สน.ปตร."]].map(([c,l])=>(
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
                  <span style={{fontSize:9,fontWeight:700,color:"#94a3b8",textTransform:"uppercase"}}>กล้องวงจรปิด ({CAMERAS.length})</span>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                {CAMERAS.map(cam=>(
                  <CameraFeed key={cam.id} cam={cam} onClick={()=>{
                    const st=STATIONS.find(s=>s.id===cam.stationId);
                    if(st)setSelectedStation(st);
                  }}/>
                ))}
              </div>
            </aside>
          </div>
        )}

        {/* COMPARE */}
        {activeTab==="compare" && (
          <div style={{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
            <div style={{padding:"9px 20px",background:"#fff",borderBottom:"1px solid #f1f5f9",display:"flex",flexWrap:"wrap",gap:10,alignItems:"center",flexShrink:0}}>
              <div style={{display:"flex",gap:5,alignItems:"center"}}>
                <span style={{fontSize:10,color:"#94a3b8",fontWeight:700,textTransform:"uppercase"}}>ประเภท</span>
                {[["level","ระดับน้ำ"],["flow","น้ำท่า"],["rain","ปริมาณฝน"]].map(([id,l])=>(
                  <Chip key={id} active={activeMetric===id} onClick={()=>setActiveMetric(id)}>{l}</Chip>
                ))}
              </div>
              <div style={{width:1,height:18,background:"#e2e8f0"}}/>
              <div style={{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap"}}>
                <span style={{fontSize:10,color:"#94a3b8",fontWeight:700,textTransform:"uppercase"}}>สถานี</span>
                {compareStations.map((s,i)=>(
                  <Chip key={s.id} active={selectedForChart.has(s.id)} onClick={()=>toggleChart(s.id)} color={CHART_COLORS[i%CHART_COLORS.length]}>{s.shortName}</Chip>
                ))}
              </div>
              <div style={{width:1,height:18,background:"#e2e8f0"}}/>
              <div style={{display:"flex",gap:5,alignItems:"center"}}>
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
                    <div style={{fontSize:10,color:"#94a3b8",marginTop:2}}>{activeTimeRange} · ข้อมูลล่าสุด 10/04/2569</div>
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
              {/* Table */}
              <div style={{background:"#fff",borderRadius:10,border:"1px solid #e2e8f0",}}>
                <div style={{padding:"10px 16px",borderBottom:"1px solid #f1f5f9",display:"flex",alignItems:"center",gap:6}}>
                  <IconStation size={12} color="#1d4ed8"/>
                  <span style={{fontSize:12,fontWeight:700,color:"#0f172a"}}>ตารางสรุปสถานีทั้งหมด ({STATIONS.length} สถานี)</span>
                </div>
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                    <thead>
                      <tr style={{background:"#f8fafc"}}>
                        {["","สถานี","ประเภท","U (ม.รทก.)","D (ม.รทก.)","O (ม.พน.)","P (ซม.มล.)","สถานะ",""].map((h,i)=>(
                          <th key={i} style={{padding:"8px 10px",textAlign:"left",fontSize:9,color:"#94a3b8",fontWeight:700,borderBottom:"1px solid #e2e8f0",textTransform:"uppercase",letterSpacing:"0.05em",whiteSpace:"nowrap"}}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {STATIONS.map((st,i)=>{
                        const cfg=stCfg(st.status);
                        const typeLabel=st.type==="gauging"?"สถานีวัดน้ำ":"ปตร./สน.ปตร.";
                        const r=st.readings;
                        const fmt = v => v === null ? <span style={{color:"#cbd5e1"}}>—</span> : <span style={{fontFamily:"'IBM Plex Mono',monospace",fontWeight:600}}>{typeof v==="number"?`+${v.toFixed(2)}`:v}</span>;
                        return (
                          <tr key={st.id} style={{borderBottom:"1px solid #f8fafc",background:i%2?"#fafafa":"#fff"}}
                            onMouseEnter={e=>{e.currentTarget.style.background="#eff6ff";}}
                            onMouseLeave={e=>{e.currentTarget.style.background=i%2?"#fafafa":"#fff";}}>
                            <td style={{padding:"7px 8px 7px 12px"}}><StationTypeIconBox type={st.type} size={14}/></td>
                            <td style={{padding:"7px 10px",fontWeight:600,color:"#0f172a",whiteSpace:"nowrap"}}>{st.shortName}</td>
                            <td style={{padding:"7px 10px",color:"#64748b",fontSize:11}}>{typeLabel}</td>
                            <td style={{padding:"7px 10px",color:"#1d4ed8"}}>{fmt(r.U)}</td>
                            <td style={{padding:"7px 10px",color:"#047857"}}>{fmt(r.D)}</td>
                            <td style={{padding:"7px 10px",color:"#7c3aed"}}>{fmt(r.O)}</td>
                            <td style={{padding:"7px 10px",color:"#c2410c"}}>{fmt(r.P)}</td>
                            <td style={{padding:"7px 10px"}}><StatusBadge status={st.status} small/></td>
                            <td style={{padding:"7px 10px"}}>
                              <button onClick={()=>setSelectedStation(st)} style={{padding:"3px 9px",border:"1px solid #bfdbfe",borderRadius:4,fontSize:10,cursor:"pointer",color:"#1d4ed8",background:"#eff6ff",fontFamily:"inherit",fontWeight:600}}>
                                ดูรายละเอียด
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
                {[["U","#1d4ed8"],["D","#047857"],["O","#7c3aed"],["P","#c2410c"]].map(([l,c])=>(
                  <div key={l} style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:"#64748b"}}>
                    <span style={{width:14,height:14,borderRadius:3,background:c+"18",border:`1px solid ${c}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:700,color:c}}>{l}</span>{l==="U"?"ด้านใน":l==="D"?"ด้านนอก":l==="O"?"เปิดบาน":"ระบาย"}
                  </div>
                ))}
                <div style={{width:1,height:14,background:"#e2e8f0"}}/>
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