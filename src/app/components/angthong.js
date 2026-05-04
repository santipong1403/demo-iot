// ─── โครงการส่งน้ำและบำรุงรักษาจังหวัดอ่างทอง ──────────────────────────────
// ข้อมูลสถานีอ้างอิงจากแผนผังคลองส่งและคลองระบาย จ.อ่างทอง

export const PROJECT_META = {
  id: "angthong",
  name: "โครงการส่งน้ำและบำรุงรักษาจังหวัดอ่างทอง",
  nameEn: "Ang Thong Irrigation Project",
  office: "สำนักงานชลประทานที่ 12",
  color: "#047857",
};

// ─── Helper ──────────────────────────────────────────────────────────────────
function mkSeries(baseLevel, variance = 0.08, rainBase = 2) {
  const level = Array.from({ length: 24 }, (_, i) => {
    const v = baseLevel + (Math.sin(i * 0.5) * variance) + (Math.random() * 0.02 - 0.01);
    return parseFloat(Math.max(0, v).toFixed(2));
  });
  const flow = level.map(v => parseFloat((v * 8.5 + Math.random() * 0.5).toFixed(1)));
  const rain = Array.from({ length: 24 }, (_, i) =>
    parseFloat((i >= 6 && i <= 14 ? rainBase + Math.random() * 4 : Math.random() * 0.8).toFixed(1))
  );
  return { level, flow, rain };
}

export const STATIONS = [
  // ─── แม่น้ำเจ้าพระยา / เขื่อนเจ้าพระยา ─────────────────────────────────
  {
    id: "AT_CPRAYA_WEIR", code: "เขื่อนเจ้าพระยา", name: "เขื่อนเจ้าพระยา", shortName: "เขื่อนเจ้าพระยา",
    x: 320, y: 55, type: "gate", status: "ok",
    desc: "เขื่อนเจ้าพระยา ต้นน้ำหลักส่งเข้าโครงการอ่างทอง",
    readings: { U: 16.45, D: 8.32, O: 6, P: null },
    info: {
      province: "ชัยนาท", district: "สรรพยา", subdistrict: "สรรพยา",
      region: "ภาคกลาง", basin: "เจ้าพระยา", office: "โครงการส่งน้ำฯ อ่างทอง",
      lat: 15.1820, lng: 100.1340, buildYear: "2496", completeYear: "2500",
      gateCount: 16, gateType: "บานโค้ง", gateWidth: 12.5, gateHeight: 8.0,
      maxDischarge: 2700, spillLevel: 16.5, floodLevel: 18.0, normalLevel: 16.5,
      pumps: [], additionalCanal: "แม่น้ำเจ้าพระยา", remark: "เขื่อนหลักควบคุมน้ำเข้าคลองชัยนาท-ป่าสัก"
    },
    series: mkSeries(16.45, 0.25, 5),
  },
  // ─── ปตร. หลัก ───────────────────────────────────────────────────────────
  {
    id: "AT_PTR_SRAJAENG", code: "ปตร.สระแจง", name: "ปตร.สระแจง", shortName: "ปตร.สระแจง",
    x: 250, y: 95, type: "gate", status: "ok",
    desc: "ประตูระบายน้ำสระแจง ควบคุมน้ำส่งเข้าคลองส่งใหญ่สายที่ 1",
    readings: { U: 3.12, D: 2.85, O: 3, P: null },
    info: {
      province: "อ่างทอง", district: "เมือง", subdistrict: "บ้านอิฐ",
      region: "ภาคกลาง", basin: "เจ้าพระยา", office: "โครงการส่งน้ำฯ อ่างทอง",
      lat: 14.5920, lng: 100.4550, buildYear: "2510", completeYear: "2512",
      gateCount: 4, gateType: "บานตรง", gateWidth: 4.0, gateHeight: 3.5,
      maxDischarge: 60, spillLevel: 3.5, floodLevel: 4.2, normalLevel: 2.5,
      pumps: [], additionalCanal: "คลองส่งน้ำสายใหญ่ 1", remark: "N/A"
    },
    series: mkSeries(3.12, 0.12, 3),
  },
  {
    id: "AT_PTR_BANGKRASEI", code: "ปตร.บ้านกระเสียว", name: "ปตร.บ้านกระเสียว", shortName: "ปตร.กระเสียว",
    x: 390, y: 95, type: "gate", status: "ok",
    desc: "ประตูระบายน้ำบ้านกระเสียว ควบคุมน้ำเข้าพื้นที่ฝั่งขวา",
    readings: { U: 3.05, D: 2.78, O: 2, P: null },
    info: {
      province: "อ่างทอง", district: "แสวงหา", subdistrict: "แสวงหา",
      region: "ภาคกลาง", basin: "เจ้าพระยา", office: "โครงการส่งน้ำฯ อ่างทอง",
      lat: 14.5680, lng: 100.5120, buildYear: "2512", completeYear: "2514",
      gateCount: 4, gateType: "บานตรง", gateWidth: 3.5, gateHeight: 3.0,
      maxDischarge: 45, spillLevel: 3.5, floodLevel: 4.0, normalLevel: 2.2,
      pumps: [], additionalCanal: "คลองส่งน้ำสายใหญ่ 2", remark: "N/A"
    },
    series: mkSeries(3.05, 0.10, 2),
  },
  // ─── สถานีวัดน้ำ (Gauging) ───────────────────────────────────────────────
  {
    id: "AT_T_YAAMNIL", code: "ส.ยาม", name: "สถานีวัดน้ำ ยาม", shortName: "ส.ยาม",
    x: 310, y: 145, type: "gauging", status: "ok",
    desc: "สถานีวัดระดับน้ำยาม บนแม่น้ำน้อย",
    readings: { U: null, D: null, O: null, P: null, level: 2.45, flow: 18.2 },
    info: {
      province: "อ่างทอง", district: "วิเศษชัยชาญ", subdistrict: "ยี่ล้น",
      region: "ภาคกลาง", basin: "เจ้าพระยา", office: "โครงการส่งน้ำฯ อ่างทอง",
      lat: 14.5340, lng: 100.4820, buildYear: "2515", completeYear: "2516",
      gateCount: null, gateType: null, gateWidth: null, gateHeight: null,
      maxDischarge: null, spillLevel: null, floodLevel: 6.0, normalLevel: 2.0,
      pumps: [], additionalCanal: "แม่น้ำน้อย", remark: "วัดน้ำอัตโนมัติ"
    },
    series: mkSeries(2.45, 0.15, 4),
  },
  {
    id: "AT_T_ANGTHONG", code: "ส.อ่างทอง", name: "สถานีวัดน้ำ อ่างทอง", shortName: "ส.อ่างทอง",
    x: 310, y: 230, type: "gauging", status: "warn",
    desc: "สถานีวัดระดับน้ำเจ้าพระยา บริเวณ จ.อ่างทอง",
    readings: { U: null, D: null, O: null, P: null, level: 4.28, flow: 42.5 },
    info: {
      province: "อ่างทอง", district: "เมือง", subdistrict: "บ้านอิฐ",
      region: "ภาคกลาง", basin: "เจ้าพระยา", office: "โครงการส่งน้ำฯ อ่างทอง",
      lat: 14.5886, lng: 100.4552, buildYear: "2508", completeYear: "2510",
      gateCount: null, gateType: null, gateWidth: null, gateHeight: null,
      maxDischarge: null, spillLevel: null, floodLevel: 7.5, normalLevel: 3.0,
      pumps: [], additionalCanal: "แม่น้ำเจ้าพระยา", remark: "ระดับสูงกว่าปกติเล็กน้อย"
    },
    series: mkSeries(4.28, 0.18, 6),
  },
  // ─── ปตร. คลองส่งน้ำสายใหญ่ 1 ────────────────────────────────────────────
  {
    id: "AT_PTR_KSN1_KM27", code: "ปตร.คลองส่ง1 กม.27", name: "ปตร.บ้านท่าตะโก กม.27+200", shortName: "ปตร.กม.27+200",
    x: 130, y: 195, type: "gate", status: "ok",
    desc: "ประตูระบายน้ำบนคลองส่งน้ำสายใหญ่ 1 กม.27+200",
    readings: { U: 2.65, D: 2.42, O: 2, P: null },
    info: {
      province: "อ่างทอง", district: "เมือง", subdistrict: "บ้านอิฐ",
      region: "ภาคกลาง", basin: "เจ้าพระยา", office: "โครงการส่งน้ำฯ อ่างทอง",
      lat: 14.5620, lng: 100.3890, buildYear: "2511", completeYear: "2513",
      gateCount: 3, gateType: "บานตรง", gateWidth: 3.0, gateHeight: 2.5,
      maxDischarge: 30, spillLevel: 3.0, floodLevel: 3.8, normalLevel: 2.0,
      pumps: [], additionalCanal: "คลองส่งน้ำสายใหญ่ 1", remark: "N/A"
    },
    series: mkSeries(2.65, 0.10, 2),
  },
  {
    id: "AT_PTR_KSN1_KM40", code: "ปตร.คลองส่ง1 กม.40", name: "ปตร.ท่าตะโก กม.40+400", shortName: "ปตร.กม.40+400",
    x: 130, y: 270, type: "gate", status: "ok",
    desc: "ประตูระบายน้ำบนคลองส่งน้ำสายใหญ่ 1 กม.40+400",
    readings: { U: 2.55, D: 2.30, O: 2, P: null },
    info: {
      province: "อ่างทอง", district: "วิเศษชัยชาญ", subdistrict: "ม่วงเตี้ย",
      region: "ภาคกลาง", basin: "เจ้าพระยา", office: "โครงการส่งน้ำฯ อ่างทอง",
      lat: 14.5280, lng: 100.3750, buildYear: "2511", completeYear: "2514",
      gateCount: 3, gateType: "บานตรง", gateWidth: 3.0, gateHeight: 2.5,
      maxDischarge: 28, spillLevel: 3.0, floodLevel: 3.8, normalLevel: 2.0,
      pumps: [], additionalCanal: "คลองส่งน้ำสายใหญ่ 1", remark: "N/A"
    },
    series: mkSeries(2.55, 0.10, 2),
  },
  {
    id: "AT_PTR_KSN1_KM56", code: "ปตร.คลองส่ง1 กม.56", name: "ปตร.คลองส่ง1 กม.56+000", shortName: "ปตร.กม.56+000",
    x: 130, y: 355, type: "gate", status: "ok",
    desc: "ประตูระบายน้ำบนคลองส่งน้ำสายใหญ่ 1 กม.56+000",
    readings: { U: 2.48, D: 2.22, O: 2, P: null },
    info: {
      province: "อ่างทอง", district: "วิเศษชัยชาญ", subdistrict: "สาวร้องไห้",
      region: "ภาคกลาง", basin: "เจ้าพระยา", office: "โครงการส่งน้ำฯ อ่างทอง",
      lat: 14.5020, lng: 100.3620, buildYear: "2514", completeYear: "2516",
      gateCount: 3, gateType: "บานตรง", gateWidth: 3.0, gateHeight: 2.5,
      maxDischarge: 25, spillLevel: 3.0, floodLevel: 3.5, normalLevel: 2.0,
      pumps: [], additionalCanal: "คลองส่งน้ำสายใหญ่ 1", remark: "N/A"
    },
    series: mkSeries(2.48, 0.08, 1),
  },
  {
    id: "AT_PTR_KSN1_KM62", code: "ปตร.คลองส่ง1 กม.62", name: "ปตร.บ้านปลาเน่า กม.62+640", shortName: "ปตร.กม.62+640",
    x: 130, y: 430, type: "gate", status: "warn",
    desc: "ประตูระบายน้ำบนคลองส่งน้ำสายใหญ่ 1 กม.62+640",
    readings: { U: 2.95, D: 2.15, O: 1, P: null },
    info: {
      province: "อ่างทอง", district: "วิเศษชัยชาญ", subdistrict: "คลองขนาก",
      region: "ภาคกลาง", basin: "เจ้าพระยา", office: "โครงการส่งน้ำฯ อ่างทอง",
      lat: 14.4850, lng: 100.3580, buildYear: "2515", completeYear: "2517",
      gateCount: 3, gateType: "บานตรง", gateWidth: 3.0, gateHeight: 2.5,
      maxDischarge: 25, spillLevel: 3.0, floodLevel: 3.5, normalLevel: 2.0,
      pumps: [], additionalCanal: "คลองส่งน้ำสายใหญ่ 1", remark: "ระดับน้ำด้านหน้าสูง"
    },
    series: mkSeries(2.95, 0.15, 3),
  },
  {
    id: "AT_PTR_KSN1_KM76", code: "ปตร.คลองส่ง1 กม.76", name: "ปตร.บ้านทอง กม.76+700", shortName: "ปตร.กม.76+700",
    x: 130, y: 510, type: "gate", status: "ok",
    desc: "ประตูระบายน้ำบนคลองส่งน้ำสายใหญ่ 1 กม.76+700",
    readings: { U: 2.42, D: 2.18, O: 2, P: null },
    info: {
      province: "อ่างทอง", district: "วิเศษชัยชาญ", subdistrict: "ยี่ล้น",
      region: "ภาคกลาง", basin: "เจ้าพระยา", office: "โครงการส่งน้ำฯ อ่างทอง",
      lat: 14.4620, lng: 100.3520, buildYear: "2516", completeYear: "2518",
      gateCount: 3, gateType: "บานตรง", gateWidth: 3.0, gateHeight: 2.5,
      maxDischarge: 22, spillLevel: 2.8, floodLevel: 3.5, normalLevel: 1.8,
      pumps: [], additionalCanal: "คลองส่งน้ำสายใหญ่ 1", remark: "N/A"
    },
    series: mkSeries(2.42, 0.08, 1),
  },
  // ─── ปตร. / ทรบ. สาขา ───────────────────────────────────────────────────
  {
    id: "AT_PTR_MUENGTED", code: "ปตร.ม่วงเตี้ย", name: "ปตร.ม่วงเตี้ย", shortName: "ม่วงเตี้ย",
    x: 220, y: 290, type: "gate", status: "ok",
    desc: "ประตูระบายน้ำม่วงเตี้ย ควบคุมน้ำเข้าคลองสาขา",
    readings: { U: 2.40, D: 2.20, O: 2, P: null },
    info: {
      province: "อ่างทอง", district: "วิเศษชัยชาญ", subdistrict: "ม่วงเตี้ย",
      region: "ภาคกลาง", basin: "เจ้าพระยา", office: "โครงการส่งน้ำฯ อ่างทอง",
      lat: 14.5240, lng: 100.4120, buildYear: "2515", completeYear: "2517",
      gateCount: 2, gateType: "บานตรง", gateWidth: 2.5, gateHeight: 2.0,
      maxDischarge: 18, spillLevel: 2.8, floodLevel: 3.5, normalLevel: 1.8,
      pumps: [], additionalCanal: "คลองม่วงเตี้ย", remark: "N/A"
    },
    series: mkSeries(2.40, 0.08, 1),
  },
  {
    id: "AT_PTR_SAHARAI", code: "ปตร.สาหร่าย", name: "ปตร.สาหร่าย", shortName: "สาหร่าย",
    x: 400, y: 200, type: "gate", status: "ok",
    desc: "ประตูระบายน้ำสาหร่าย ควบคุมน้ำในพื้นที่คณะยามณี",
    readings: { U: 2.88, D: 2.62, O: 2, P: null },
    info: {
      province: "อ่างทอง", district: "วิเศษชัยชาญ", subdistrict: "สาวร้องไห้",
      region: "ภาคกลาง", basin: "เจ้าพระยา", office: "โครงการส่งน้ำฯ อ่างทอง",
      lat: 14.5420, lng: 100.5250, buildYear: "2516", completeYear: "2518",
      gateCount: 2, gateType: "บานตรง", gateWidth: 2.5, gateHeight: 2.0,
      maxDischarge: 15, spillLevel: 2.8, floodLevel: 3.5, normalLevel: 1.8,
      pumps: [], additionalCanal: "คลองสาหร่าย", remark: "N/A"
    },
    series: mkSeries(2.88, 0.10, 2),
  },
  {
    id: "AT_PTR_PHAILOM", code: "ปตร.ไผ่ล้อม", name: "ปตร.ไผ่ล้อม", shortName: "ไผ่ล้อม",
    x: 480, y: 230, type: "gate", status: "ok",
    desc: "ประตูระบายน้ำไผ่ล้อม ควบคุมน้ำในพื้นที่คณะยามณี",
    readings: { U: 2.75, D: 2.55, O: 2, P: null },
    info: {
      province: "อ่างทอง", district: "ป่าโมก", subdistrict: "บางปลากด",
      region: "ภาคกลาง", basin: "เจ้าพระยา", office: "โครงการส่งน้ำฯ อ่างทอง",
      lat: 14.5180, lng: 100.5420, buildYear: "2518", completeYear: "2520",
      gateCount: 2, gateType: "บานตรง", gateWidth: 2.5, gateHeight: 2.0,
      maxDischarge: 14, spillLevel: 2.8, floodLevel: 3.5, normalLevel: 1.8,
      pumps: [], additionalCanal: "คลองไผ่ล้อม", remark: "N/A"
    },
    series: mkSeries(2.75, 0.08, 1),
  },
  // ─── ทรบ. คอนกรีตโล่ง ──────────────────────────────────────────────────
  {
    id: "AT_TRB_KONKRETELENG", code: "ทรบ.คอนกรีตโล่ง", name: "ทรบ.คอนกรีตโล่ง", shortName: "ทรบ.คอนกรีตโล่ง",
    x: 170, y: 440, type: "gate", status: "ok",
    desc: "ท่อระบายคอนกรีตโล่ง บริเวณ กม.56+000 ควบคุมน้ำเข้าแปลงนา",
    readings: { U: 2.30, D: 2.05, O: 1, P: null },
    info: {
      province: "อ่างทอง", district: "วิเศษชัยชาญ", subdistrict: "สาวร้องไห้",
      region: "ภาคกลาง", basin: "เจ้าพระยา", office: "โครงการส่งน้ำฯ อ่างทอง",
      lat: 14.4890, lng: 100.3910, buildYear: "2520", completeYear: "2522",
      gateCount: 2, gateType: "บานตรง", gateWidth: 2.0, gateHeight: 1.8,
      maxDischarge: 10, spillLevel: 2.5, floodLevel: 3.2, normalLevel: 1.5,
      pumps: [], additionalCanal: "คลองส่งนาแปลง", remark: "N/A"
    },
    series: mkSeries(2.30, 0.07, 1),
  },
  // ─── ปตร. / ทรบ. ฝั่งขวา (คณะ ยามณี) ────────────────────────────────────
  {
    id: "AT_PTR_YAAMNIL", code: "ปตร.ยาม", name: "ปตร.ยาม(คณะยามณี)", shortName: "ปตร.ยาม",
    x: 390, y: 290, type: "gate", status: "ok",
    desc: "ประตูระบายน้ำยาม ควบคุมน้ำในพื้นที่คณะยามณี",
    readings: { U: 2.68, D: 2.45, O: 2, P: null },
    info: {
      province: "อ่างทอง", district: "ป่าโมก", subdistrict: "บางปลากด",
      region: "ภาคกลาง", basin: "เจ้าพระยา", office: "โครงการส่งน้ำฯ อ่างทอง",
      lat: 14.5050, lng: 100.5180, buildYear: "2518", completeYear: "2520",
      gateCount: 3, gateType: "บานตรง", gateWidth: 3.0, gateHeight: 2.5,
      maxDischarge: 22, spillLevel: 3.0, floodLevel: 3.8, normalLevel: 2.0,
      pumps: [], additionalCanal: "คลองส่งน้ำยาม", remark: "N/A"
    },
    series: mkSeries(2.68, 0.10, 2),
  },
  {
    id: "AT_PTR_POHKLONG", code: "ปตร.โพ-คลอง", name: "ปตร.โพ-คลองสนาม", shortName: "ปตร.โพ-คลอง",
    x: 390, y: 370, type: "gate", status: "ok",
    desc: "ประตูระบายน้ำโพ-คลองสนาม ควบคุมน้ำฝั่งขวา",
    readings: { U: 2.55, D: 2.32, O: 2, P: null },
    info: {
      province: "อ่างทอง", district: "ป่าโมก", subdistrict: "ป่าโมก",
      region: "ภาคกลาง", basin: "เจ้าพระยา", office: "โครงการส่งน้ำฯ อ่างทอง",
      lat: 14.4860, lng: 100.5220, buildYear: "2520", completeYear: "2522",
      gateCount: 3, gateType: "บานตรง", gateWidth: 3.0, gateHeight: 2.5,
      maxDischarge: 20, spillLevel: 3.0, floodLevel: 3.8, normalLevel: 2.0,
      pumps: [], additionalCanal: "คลองโพ-สนาม", remark: "N/A"
    },
    series: mkSeries(2.55, 0.08, 1),
  },
  // ─── ปตร. ปลาย สาขาหลักที่ลงแม่น้ำน้อย ──────────────────────────────────
  {
    id: "AT_PTR_LAADIN", code: "ปตร.ลาดิน", name: "ปตร.ลาดิน", shortName: "ปตร.ลาดิน",
    x: 310, y: 480, type: "gate", status: "ok",
    desc: "ประตูระบายน้ำลาดิน ปลายคลองส่งน้ำลงแม่น้ำน้อย",
    readings: { U: 2.12, D: 1.92, O: 2, P: null },
    info: {
      province: "อ่างทอง", district: "วิเศษชัยชาญ", subdistrict: "ยี่ล้น",
      region: "ภาคกลาง", basin: "เจ้าพระยา", office: "โครงการส่งน้ำฯ อ่างทอง",
      lat: 14.4680, lng: 100.4530, buildYear: "2520", completeYear: "2522",
      gateCount: 4, gateType: "บานตรง", gateWidth: 4.0, gateHeight: 3.0,
      maxDischarge: 35, spillLevel: 2.8, floodLevel: 4.0, normalLevel: 1.8,
      pumps: [], additionalCanal: "แม่น้ำน้อย", remark: "N/A"
    },
    series: mkSeries(2.12, 0.08, 1),
  },
  {
    id: "AT_PTR_KOKCHANG", code: "ปตร.โคกช้าง", name: "ปตร.โคกช้าง", shortName: "ปตร.โคกช้าง",
    x: 490, y: 450, type: "gate", status: "ok",
    desc: "ประตูระบายน้ำโคกช้าง ควบคุมน้ำปลายโครงการ",
    readings: { U: 2.05, D: 1.85, O: 2, P: null },
    info: {
      province: "อ่างทอง", district: "ป่าโมก", subdistrict: "สายทอง",
      region: "ภาคกลาง", basin: "เจ้าพระยา", office: "โครงการส่งน้ำฯ อ่างทอง",
      lat: 14.4520, lng: 100.5380, buildYear: "2521", completeYear: "2523",
      gateCount: 3, gateType: "บานตรง", gateWidth: 3.0, gateHeight: 2.5,
      maxDischarge: 20, spillLevel: 2.8, floodLevel: 3.5, normalLevel: 1.8,
      pumps: [], additionalCanal: "คลองโคกช้าง", remark: "N/A"
    },
    series: mkSeries(2.05, 0.07, 0.8),
  },
  // ─── สน. สูบน้ำ ──────────────────────────────────────────────────────────
  {
    id: "AT_SN_BAANNTONG", code: "สน.บ้านทอง", name: "สน.บ้านทอง", shortName: "สน.บ้านทอง",
    x: 220, y: 510, type: "gate", status: "ok",
    desc: "สถานีสูบน้ำบ้านทอง ส่งน้ำเข้านาข้าวพื้นที่ต่ำ",
    readings: { U: 2.38, D: 1.98, O: 0, P: 0 },
    info: {
      province: "อ่างทอง", district: "วิเศษชัยชาญ", subdistrict: "ยี่ล้น",
      region: "ภาคกลาง", basin: "เจ้าพระยา", office: "โครงการส่งน้ำฯ อ่างทอง",
      lat: 14.4610, lng: 100.3940, buildYear: "2525", completeYear: "2527",
      gateCount: 2, gateType: "บานตรง", gateWidth: 2.0, gateHeight: 1.8,
      maxDischarge: 8, spillLevel: 2.5, floodLevel: 3.2, normalLevel: 1.5,
      pumps: [{ label: "ถาวร", count: 2, size: "0.8 ม³/วิ", maxRate: 1.6 }],
      additionalCanal: "คลองส่งนาบ้านทอง", remark: "N/A"
    },
    series: mkSeries(2.38, 0.08, 1),
  },
  // ─── ปตร. ชายแดนตะวันตก (จ.วัดชัยนาท / จ.สุพรรณบุรี) ────────────────────
  {
    id: "AT_PTR_CHAINAT_BOUND", code: "ปตร.ชายแดนชัยนาท", name: "ปตร.บ้านป้อมชัย (ชายแดน)", shortName: "ชายแดน-ชัยนาท",
    x: 540, y: 155, type: "gate", status: "ok",
    desc: "ประตูระบายน้ำชายแดนชัยนาท-อ่างทอง ควบคุมน้ำส่งจากโครงการใกล้เคียง",
    readings: { U: 3.20, D: 2.95, O: 3, P: null },
    info: {
      province: "ชัยนาท", district: "สรรพยา", subdistrict: "โพนางดำออก",
      region: "ภาคกลาง", basin: "เจ้าพระยา", office: "โครงการส่งน้ำฯ อ่างทอง",
      lat: 14.6180, lng: 100.5820, buildYear: "2515", completeYear: "2517",
      gateCount: 3, gateType: "บานตรง", gateWidth: 3.0, gateHeight: 2.5,
      maxDischarge: 25, spillLevel: 3.2, floodLevel: 4.0, normalLevel: 2.2,
      pumps: [], additionalCanal: "คลองชัยนาท-อ่างทอง", remark: "N/A"
    },
    series: mkSeries(3.20, 0.12, 2),
  },
  // ─── ปตร. ระบาย (ท้ายโครงการ) ─────────────────────────────────────────────
  {
    id: "AT_PTR_LAATCHADAI", code: "ปตร.ลาดชะไดฯ", name: "ปตร.ลาดชะได (ผักไห่)", shortName: "ลาดชะได",
    x: 310, y: 570, type: "gate", status: "danger",
    desc: "ประตูระบายน้ำปลายโครงการ ลาดชะได ระบายน้ำลงแม่น้ำน้อย",
    readings: { U: 3.85, D: 4.20, O: 0, P: null },
    info: {
      province: "พระนครศรีอยุธยา", district: "ผักไห่", subdistrict: "ลาดชะไดฯ",
      region: "ภาคกลาง", basin: "เจ้าพระยา", office: "โครงการส่งน้ำฯ อ่างทอง",
      lat: 14.4180, lng: 100.4420, buildYear: "2518", completeYear: "2520",
      gateCount: 6, gateType: "บานตรง", gateWidth: 5.0, gateHeight: 4.0,
      maxDischarge: 90, spillLevel: 4.0, floodLevel: 5.0, normalLevel: 2.5,
      pumps: [], additionalCanal: "แม่น้ำน้อย", remark: "ระดับน้ำด้านนอกสูงวิกฤต – ประตูปิด"
    },
    series: mkSeries(3.85, 0.18, 8),
  },
];

export const CAMERAS = [
  { id: 1, name: "เขื่อนเจ้าพระยา (CAM-01)", level: 1645, status: "ok",      waterPct: 35, stationId: "AT_CPRAYA_WEIR" },
  { id: 2, name: "ปตร.สระแจง (CAM-02)",       level: 312,  status: "ok",      waterPct: 28, stationId: "AT_PTR_SRAJAENG" },
  { id: 3, name: "ส.อ่างทอง (CAM-03)",        level: 428,  status: "warning", waterPct: 52, stationId: "AT_T_ANGTHONG" },
  { id: 4, name: "ปตร.กม.62+640 (CAM-04)",    level: 295,  status: "warning", waterPct: 48, stationId: "AT_PTR_KSN1_KM62" },
  { id: 5, name: "ปตร.ลาดชะได (CAM-05)",      level: 385,  status: "danger",  waterPct: 75, stationId: "AT_PTR_LAATCHADAI" },
  { id: 6, name: "ปตร.ยาม (CAM-06)",          level: 268,  status: "ok",      waterPct: 30, stationId: "AT_PTR_YAAMNIL" },
  { id: 7, name: "ปตร.ม่วงเตี้ย (CAM-07)",    level: 240,  status: "ok",      waterPct: 22, stationId: "AT_PTR_MUENGTED" },
  { id: 8, name: "ปตร.ลาดิน (CAM-08)",        level: 212,  status: "ok",      waterPct: 18, stationId: "AT_PTR_LAADIN" },
  { id: 9, name: "สน.บ้านทอง (CAM-09)",       level: 238,  status: "ok",      waterPct: 20, stationId: "AT_SN_BAANNTONG" },
];

export const STATION_LIST_FOR_COMPARE = [
  "AT_CPRAYA_WEIR", "AT_T_ANGTHONG", "AT_PTR_SRAJAENG",
  "AT_PTR_KSN1_KM62", "AT_PTR_LAATCHADAI", "AT_PTR_LAADIN",
];

export const MAP_STATIONS = [
  { id: "AT_CPRAYA_WEIR",       x: 320, y: 55  },
  { id: "AT_PTR_SRAJAENG",      x: 250, y: 95  },
  { id: "AT_PTR_BANGKRASEI",    x: 390, y: 95  },
  { id: "AT_PTR_CHAINAT_BOUND", x: 540, y: 155 },
  { id: "AT_T_YAAMNIL",         x: 310, y: 145 },
  { id: "AT_T_ANGTHONG",        x: 310, y: 230 },
  { id: "AT_PTR_KSN1_KM27",     x: 130, y: 195 },
  { id: "AT_PTR_KSN1_KM40",     x: 130, y: 270 },
  { id: "AT_PTR_MUENGTED",      x: 220, y: 290 },
  { id: "AT_PTR_SAHARAI",       x: 400, y: 200 },
  { id: "AT_PTR_PHAILOM",       x: 480, y: 230 },
  { id: "AT_PTR_KSN1_KM56",     x: 130, y: 355 },
  { id: "AT_PTR_KSN1_KM62",     x: 130, y: 430 },
  { id: "AT_TRB_KONKRETELENG",  x: 170, y: 440 },
  { id: "AT_PTR_YAAMNIL",       x: 390, y: 290 },
  { id: "AT_PTR_POHKLONG",      x: 390, y: 370 },
  { id: "AT_PTR_KSN1_KM76",     x: 130, y: 510 },
  { id: "AT_SN_BAANNTONG",      x: 220, y: 510 },
  { id: "AT_PTR_LAADIN",        x: 310, y: 480 },
  { id: "AT_PTR_KOKCHANG",      x: 490, y: 450 },
  { id: "AT_PTR_LAATCHADAI",    x: 310, y: 570 },
];
export function renderCanals(H) {
  return (
    <>
      {/* ══ แม่น้ำเจ้าพระยา (น้ำเงิน) – ไหลจากเขื่อนเจ้าพระยา x=320 ลงตลอด */}
      <line x1={320} y1={0} x2={320} y2={H} stroke="#3b82f6" strokeWidth={12} opacity={0.35}/>
      <text x={335} y={400} fontSize={9} fill="#1d4ed8" fontWeight={700}
        transform="rotate(90,335,400)">แม่น้ำเจ้าพระยา</text>

      {/* ══ แม่น้ำน้อย (น้ำเงิน) – ด้านล่าง x=130 ~ 310 ลงสู่ปลาย */}
      <line x1={80} y1={H-40} x2={320} y2={H-40} stroke="#3b82f6" strokeWidth={8} opacity={0.35}/>
      <text x={160} y={H-48} fontSize={9} fill="#1d4ed8" fontWeight={600}>แม่น้ำน้อย</text>

      {/* ══ คลองส่งน้ำสายใหญ่ 1 (แดง) 
            จาก ปตร.สระแจง (250,95) → ꜝลงซ้าย (130,145) → ลงใต้ถึง (130,H-80) */}
      <polyline
        points={`250,95 130,95 130,${H-80}`}
        fill="none" stroke="#ef4444" strokeWidth={5} opacity={0.7}/>
      <text x={148} y={380} fontSize={9} fill="#b91c1c" fontWeight={700}
        transform="rotate(90,148,380)">คลองส่งน้ำสายใหญ่ 1</text>

      {/* ══ คลองส่งน้ำสายใหญ่ 2 (เขียว)
            จาก ปตร.บางกระเสียว (390,95) → ขวา → (540,95) → ลงเล็กน้อย */}
      <polyline
        points={`390,95 550,95 550,180`}
        fill="none" stroke="#22c55e" strokeWidth={5} opacity={0.65}/>
      <text x={460} y={84} fontSize={8} fill="#047857" textAnchor="middle" fontWeight={600}>คลองส่งน้ำสายใหญ่ 2</text>

      {/* ══ คลองสาขาจาก คลองส่ง1 ไปขวา (ม่วงเตี้ย / สาหร่าย / โพ-คลอง)
            กม.27+200 (130,195) → ขวา → แม่น้ำ (310,195) */}
      <line x1={130} y1={195} x2={310} y2={195} stroke="#f97316" strokeWidth={3} opacity={0.6}/>
      {/* กม.40+400 (130,270) → ขวา (220,270) */}
      <line x1={130} y1={270} x2={220} y2={270} stroke="#f97316" strokeWidth={3} opacity={0.6}/>
      {/* ม่วงเตี้ย (220,290) → สาหร่าย (400,290) */}
      <line x1={220} y1={290} x2={400} y2={290} stroke="#f97316" strokeWidth={3} opacity={0.55}/>
      {/* สาหร่าย → ไผ่ล้อม (480,230) → ชายแดนชัยนาท */}
      <polyline
        points={`400,200 400,290 480,290 480,230`}
        fill="none" stroke="#f97316" strokeWidth={3} opacity={0.55}/>
      {/* โพ-คลอง (390,370) → โคกช้าง (490,450) */}
      <polyline
        points={`390,290 390,370 490,370 490,450`}
        fill="none" stroke="#f97316" strokeWidth={3} opacity={0.5}/>

      {/* ══ คลองระบาย (เขียวเข้ม) – ลาดิน (310,480) → ลาดชะได (310,570) */}
      <line x1={310} y1={480} x2={310} y2={570} stroke="#16a34a" strokeWidth={4} opacity={0.5}/>
      {/* คลองระบายขวา: โคกช้าง (490,450) → แม่น้ำ */}
      <line x1={490} y1={450} x2={490} y2={H-40} stroke="#16a34a" strokeWidth={3} opacity={0.45}/>

      {/* ══ คลองส่งจากเขื่อนเจ้าพระยาลงสระแจงและบางกระเสียว */}
      <line x1={320} y1={55} x2={250} y2={95} stroke="#3b82f6" strokeWidth={5} opacity={0.5}/>
      <line x1={320} y1={55} x2={390} y2={95} stroke="#3b82f6" strokeWidth={5} opacity={0.5}/>

      {/* ══ ป้ายพื้นที่ชลประทาน */}
      <rect x={40} y={160} width={115} height={16} rx={3} fill="rgba(251,191,36,0.12)"/>
      <text x={98} y={172} fontSize={8} fill="#92400e" textAnchor="middle">พื้นที่ คบ.ชัณสูตร</text>
      <rect x={350} y={220} width={120} height={16} rx={3} fill="rgba(16,185,129,0.12)"/>
      <text x={410} y={232} fontSize={8} fill="#047857" textAnchor="middle">พื้นที่ คบ.ยามณี</text>
      <rect x={200} y={490} width={110} height={16} rx={3} fill="rgba(96,165,250,0.12)"/>
      <text x={255} y={502} fontSize={8} fill="#1d4ed8" textAnchor="middle">พื้นที่ทั้งหมด 425,171 ไร่</text>

      {/* ══ ป้ายปลายทาง */}
      <text x={310} y={H-10} fontSize={9} fill="#6b7280" textAnchor="middle" fontStyle="italic">▼ แม่น้ำน้อย / อยุธยา</text>
    </>
  );
}