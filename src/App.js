import React, { useState, useEffect } from "react";
import "./App.css";
import { readData, rank, createColorMap } from "./common.js";
import BarChartRace from "./components/BarChartRace.jsx";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import {
  faPause,
  faPlay,
  faUndoAlt,
  faSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box } from "@mui/material";

function App() {
  const [frames, setFrames] = useState([]);
  const [colorMap, setColorMap] = useState({});
  const [loading, setLoading] = useState(true);

  library.add(fab, faPause, faPlay, faUndoAlt);

  useEffect(() => {
    const setDataState = async () => {
      // อ่านข้อมูลจากไฟล์ CSV ที่เรียกมาจาก common.js
      const rawData = await readData();
      console.log("data read", rawData);

      // จัดกลุ่มข้อมูลตามปี
      const groupedByDate = rawData.reduce((acc, d) => {
        const year = d.Year; // ดึงข้อมูลปีจากแต่ละแถวของ rawData
        if (!acc[year]) {
          acc[year] = []; // ถ้ายังไม่มีกลุ่มข้อมูลสำหรับปีนี้ ให้สร้างกลุ่มใหม่
        }
        acc[year].push(d); // เพิ่มข้อมูลในกลุ่มปีนี้
        return acc;
      }, {});

      // จัดกลุ่มข้อมูลตามประเทศ
      const thenByCountry = Object.values(groupedByDate).map((d) =>
        d.reduce((acc, c) => {
          const country = c.Country; // ดึงข้อมูลประเทศจากแต่ละแถวของ groupedByDate
          if (!acc[country]) {
            acc[country] = []; // ถ้ายังไม่มีกลุ่มข้อมูลสำหรับประเทศนี้ ให้สร้างกลุ่มใหม่
          }
          acc[country].push(c); // เพิ่มข้อมูลในกลุ่มประเทศนี้
          return acc;
        }, {})
      );

      // กำหนดลำดับของข้อมูล
      const rankedData = rank(thenByCountry);
      setFrames(rankedData);

      const createdColorMap = await createColorMap();
      setColorMap(createdColorMap);
      setLoading(false);
    };

    setDataState();
  }, []);

  return (
    <div className="App">
      <h1>Population growth per country 1950 to 2021</h1>
      <Box>
        Region <FontAwesomeIcon icon={faSquare} style={{ color: "#5F48EA" }} />{" "}
        Asia <FontAwesomeIcon icon={faSquare} style={{ color: "#A56DE9" }} />{" "}
        Europe <FontAwesomeIcon icon={faSquare} style={{ color: "#FF7995" }} />{" "}
        Africa <FontAwesomeIcon icon={faSquare} style={{ color: "#FF9926" }} />{" "}
        Oceania <FontAwesomeIcon icon={faSquare} style={{ color: "#FFCD27" }} />{" "}
        Americas
      </Box>

      {!loading ? <BarChartRace frames={frames} colorMap={colorMap} /> : <></>}
    </div>
  );
}

export default App;
