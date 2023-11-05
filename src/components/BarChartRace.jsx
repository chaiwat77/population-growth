import React, { useState } from "react";
import useInterval from "@use-it/interval";
import { svgCanvas } from "../common.js";
import Bars from "./Bars.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "@mui/material";

const BarChartRace = ({ frames, colorMap }) => {
  const delay = 1000; // กำหนดค่า delay ในการเล่นแบบ Bar Chart Race
  const [isRunning, setIsRunning] = useState(false); // ตัวแปร state สำหรับเก็บสถานะการทำงานของการเล่น
  const [currentFrame, setCurrentFrame] = useState(frames[0]); // ตัวแปร state ที่เก็บข้อมูลของ frame ปัจจุบัน
  const [currentFrameNumber, setCurrentFrameNumber] = useState(0); // ตัวแปร state ที่เก็บเลขลำดับของ frame ปัจจุบัน
  const initialYear = frames[0][Object.keys(frames[0])[0]].Year; // นำปีเริ่มต้นของ frame มาใส่ในตัวแปร initialYear
  const [currentYear, setCurrentYear] = useState(initialYear); // ตัวแปร state ที่เก็บปีปัจจุบัน
  const initialMax = Math.max(
    ...Object.values(frames[0]).map((country) => country.Population)
  ); // หาค่าประชากรสูงสุดใน frame แรก
  const [domainMax, setDomainMax] = useState(initialMax); // ตัวแปร state ที่เก็บค่าประชากรสูงสุด

  // Hook ที่ใช้ในการเรียกใช้งาน function ทุกๆ interval ที่กำหนด
  useInterval(
    () => {
      if (currentFrameNumber >= frames.length - 1) {
        setIsRunning(false);
      } else {
        setCurrentYear(currentYear + 1); // เพิ่มปีขึ้นทีละ 1
        setCurrentFrame(frames[currentFrameNumber + 1]); // อัพเดตข้อมูลของ frame ปัจจุบัน
        setCurrentFrameNumber(currentFrameNumber + 1); // อัพเดตลำดับของ frame ปัจจุบัน
        const max = Math.max(
          ...Object.values(frames[currentFrameNumber + 1]).map(
            (country) => country.Population
          )
        ); // หาค่าประชากรสูงสุดใน frame ถัดไป
        setDomainMax(max || 0); // อัพเดตค่าประชากรสูงสุด
      }
    },
    isRunning ? delay : null // กำหนดเวลาในการทำงานของ interval ถ้ากำลังทำงาน
  );

  // Function ที่ใช้กด play
  const toggleAnimation = () => {
    setIsRunning(!isRunning);
  };

  // Function ที่ใช้ในการเริ่มเล่นใหม่
  const restartAnimation = () => {
    setCurrentFrame(frames[0]); // กลับไปยัง frame แรก
    setCurrentFrameNumber(0); // กลับไปยังลำดับ frame แรก
    setCurrentYear(initialYear); // กลับไปยังปีเริ่มต้น
    setDomainMax(initialMax); // กลับไปยังค่าประชากรสูงสุดเริ่มต้น
    setIsRunning(false); // หยุดการทำงาน
  };

  return (
    <>
      <div className="buttons">
        <IconButton color="secondary" onClick={() => toggleAnimation()}>
          {isRunning ? (
            <FontAwesomeIcon icon="pause"></FontAwesomeIcon> // แสดงไอคอน Pause ถ้ากำลังทำงาน
          ) : (
            <FontAwesomeIcon icon="play"></FontAwesomeIcon> // แสดงไอคอน Play ถ้าหยุดทำงาน
          )}
        </IconButton>
        <IconButton color="secondary" onClick={() => restartAnimation()}>
          <FontAwesomeIcon icon="undo-alt"></FontAwesomeIcon>
        </IconButton>
      </div>
      <h2>{currentYear}</h2>
      <svg
        width={svgCanvas.width}
        height={svgCanvas.height}
        style={{ backgroundColor: "white" }}
      >
        <Bars
          currentFrame={currentFrame}
          domainMax={domainMax}
          colorMap={colorMap}
        />
      </svg>
    </>
  );
};

export default BarChartRace;
