import data_file from "./data/population-and-demography.csv";
import * as d3 from "d3";
import _ from "lodash";

// Constants
export const barsShowing = 12; // จำนวนบาร์ที่แสดง
export const barSize = 48; // ขนาดของบาร์
export const textSize = 12; // ขนาดของตัวอักษร
export const labelPadding = 8; // ระยะห่างของป้ายชื่อ

// Canvas layout
const margin = { top: 16, right: 6, bottom: 6, left: 0 }; // ขอบของแผนภาพ
export const svgCanvas = {
  width: window.innerWidth * 0.8, // ความกว้างของแผนภาพ
  height: margin.top + barSize * barSize + margin.bottom, // ความสูงของแผนภาพ
};

// Scales
export const x = (Population, domainMax) => {
  const scale = d3.scaleLinear(
    // เส้นแกน x
    [0, domainMax], // ช่วงของข้อมูลเชิงปริมาณ
    [margin.left, svgCanvas.width - margin.right] // ช่วงของพื้นที่ที่แสดงแผนภาพ
  );
  return scale(Population); // คำนวณและคืนค่าตำแหน่งของข้อมูลบนแผนภาพ
};
export const y = d3
  .scaleBand() // สร้าง y
  .domain(d3.range(barsShowing + 1)) // กำหนดช่วงของข้อมูล (ในที่นี้คือ 0 ถึง barsShowing)
  .rangeRound([margin.top, margin.top + barSize * (barsShowing + 1 + 0.9)]) // ช่วงของพื้นที่ที่แสดงแผนภาพ
  .padding(0.1); // ระยะห่าง chart

export const createColorMap = async (customColors = {}) => {
  const data = await readData(); // อ่านข้อมูลจากไฟล์ CSV
  const scale = d3.scaleOrdinal(d3.schemeTableau10); // default color โดย schemeTableau10

  // ตรวจสอบว่ามีการกำหนดสีเฉพาะมาหรือไม่
  if (Object.keys(customColors).length > 0) {
    scale.range(Object.values(customColors)); // กำหนดสีเฉพาะ สีอยู่ใน array customcolor ด้านล่าง
  } else {
    scale.range(d3.schemeTableau10); // ใช้ schemeTableau10 หากไม่ได้กำหนดสี
  }

  const DataPopulation = Array.from(new Set(data.map((d) => d.Group))); // ดึงข้อมูลจำนวนประชากร
  scale.domain(DataPopulation); // กำหนดมาตราส่วนของข้อมูล

  const colorMap = new Map(); // สร้างเพื่อเก็บข้อมูลการจับคู่กลุ่มกับสี
  DataPopulation.forEach((values) => {
    colorMap.set(values, scale(values)); // จับคู่และเก็บข้อมูล
  });

  return colorMap;
};

export const maxPopulation = (data) => {
  return d3.max(data, (d) => d.Population);
};

export const customColors = {
  Asia: "#5F48EA",
  Europe: "#A56DE9",
  Americas: "#FFCD27",
  Oceania: "#FF9926",
  Africa: "#FF7995",
};

export const colorScale = d3
  .scaleOrdinal()
  .domain(Object.keys(customColors)) // กำหนดส่วนของข้อมูล
  .range(Object.values(customColors)); // กำหนดสี

// console.log(customColors);

export const readData = async () => {
  return d3.csv(data_file, d3.autoType); // อ่านข้อมูลจากไฟล์ CSV
};

export const rank = (frames) => {
  const rankedData = [];
  // วนลูปผ่าน frames
  for (var frame of frames) {
    const namesAndValues = _.map(frame, (country) => ({
      // แปลงข้อมูลเป็นรูปแบบที่ต้องการ แปลงเหมือนข้อมูลใน cv
      Country: country[0].Country,
      Year: country[0].Year,
      Population: country[0].Population,
      Group: country[0].Group,
    }));
    const sorted = _.orderBy(namesAndValues, ["Population"], ["desc"]); // เรียงลำดับข้อมูลตามประชากร

    for (let i = 0; i < sorted.length; ++i) {
      sorted[i].rank = _.min([barsShowing, i]); // กำหนด Rank
    }

    const makeItAnObject = _.keyBy(sorted, (obj) => obj.Country); // แปลงข้อมูลเป็นรูปแบบที่ต้องการ
    rankedData.push(makeItAnObject); // เพิ่มข้อมูลที่ได้ลงในอาร์เรย์
  }
  return rankedData;
};
