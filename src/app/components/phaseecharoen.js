// ─── โครงการส่งน้ำและบำรุงรักษาภาษีเจริญ ───────────────────────────────────

export const PROJECT_META = {
  id: "phaseecharoen",
  name: "โครงการส่งน้ำและบำรุงรักษาภาษีเจริญ",
  nameEn: "Phasee Charoen Irrigation Project",
  office: "สำนักงานชลประทานที่ 11",
  color: "#1d4ed8",
};

export const STATIONS = [
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
    x: 390, y: 128, type: "gate", status: "ok",
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
    id: "SN_PTONN_KRATHUMBAN", code: "สน.ปตร.กระทุ่มแบน", name: "สน.ปตร.กระทุ่มแบน", shortName: "ปตร.กระทุ่มแบน",
    x: 340, y: 793, type: "gate", status: "ok",
    desc: "สถานีปตน.กระทุ่มแบน ระบายน้ำในคลองภาษีเจริญตอนปลาย",
    readings: { U: 0.54, D: 0.40, O: 0, P: 0 },
    info: {
      province: "สมุทรสาคร", district: "ตลาดกระทุ่มแบน", subdistrict: "กระทุ่มแบน",
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
    x: 430, y: 1082, type: "gate", status: "ok",
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
    x: 510, y: 1082, type: "gate", status: "ok",
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

export const CAMERAS = [
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

export const STATION_LIST_FOR_COMPARE = ["T1","T14","SN_SUT","PTR_PAEKONG","SN_BANGPRA","SN_MAHACHAI"];

export const MAP_STATIONS = [
  { id: "T1",    x: 62,  y: 80   },
  { id: "T14",   x: 62,  y: 390  },
  { id: "PTR_LADNGWLAI",    x: 230, y: 128 },
  { id: "PTR_SUT",           x: 310, y: 128 },
  { id: "PTR_BANGDOEY",      x: 390, y: 128 },
  { id: "PTR_SAMBAT",        x: 470, y: 128 },
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
  { id: "SN_KLONGKRU",       x: 155, y:1082 },
  { id: "SN_KOKKARABUO",     x: 430, y:1082 },
  { id: "SN_BANGNUMJIT",     x: 510, y:1082 },
  { id: "SN_MAHACHAI",       x: 310, y:1135 },
];
export function renderCanals(H) {
  return (
    <>
      <line x1={62} y1={0} x2={62} y2={H} stroke="rgba(59,130,246,0.28)" strokeWidth={12}/>
      <text x={30} y={250} fontSize={9} fill="#64748b" writingMode="tb" transform="rotate(-90,30,250)">แม่น้ำท่าจีน</text>
      <line x1={62} y1={128} x2={520} y2={128} stroke="rgba(59,130,246,0.22)" strokeWidth={8}/>
      <text x={300} y={118} fontSize={8} fill="#64748b" textAnchor="middle">คลองมหาสวัสดิ์</text>
      <line x1={155} y1={128} x2={155} y2={H-40} stroke="rgba(59,130,246,0.22)" strokeWidth={9}/>
      <text x={175} y={600} fontSize={9} fill="#1d4ed8" writingMode="tb" fontWeight={600} transform="rotate(90,175,600)">คลองภาษีเจริญ</text>
      <line x1={62} y1={185} x2={155} y2={185} stroke="rgba(59,130,246,0.18)" strokeWidth={5}/>
      {[738,793,843,893,940,988,1036].map(y=>(
        <line key={y} x1={155} y1={y} x2={320} y2={y} stroke="rgba(59,130,246,0.18)" strokeWidth={y===738?5:4}/>
      ))}
      <line x1={62} y1={1135} x2={560} y2={1135} stroke="rgba(59,130,246,0.22)" strokeWidth={8}/>
      <text x={350} y={1150} fontSize={8} fill="#64748b" textAnchor="middle">คลองมหาชัย – สนามชัย</text>
      <line x1={155} y1={1082} x2={155} y2={1135} stroke="rgba(59,130,246,0.15)" strokeWidth={5}/>
      <line x1={430} y1={1082} x2={430} y2={1135} stroke="rgba(59,130,246,0.15)" strokeWidth={4}/>
      <line x1={510} y1={1082} x2={510} y2={1135} stroke="rgba(59,130,246,0.15)" strokeWidth={4}/>
      <text x={310} y={H-12} fontSize={10} fill="#94a3b8" textAnchor="middle" fontStyle="italic">▼ อ่าวไทย</text>
    </>
  );
}