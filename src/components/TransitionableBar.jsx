import React from "react";
import useD3Transition from "use-d3-transition";

// Functional Component ชื่อ TransitionableBar ที่รับค่า width, y, opacity และ staticAttributes
const TransitionableBar = ({ width, y, opacity, ...staticAttributes }) => {
  // ใช้ Hook useD3Transition เพื่อทำการจัดการ transition ของ D3
  const { ref, attrState } = useD3Transition({
    attrsToTransitionTo: { width, y, opacity }, // กำหนดค่าที่ต้องการให้มีการ transition
    deps: [width, y, opacity], // ระบุ dependencies ที่ให้ในการ trigger transition
  });

  // Return ตัวแท่งกราฟเป็น element ของ SVG
  return (
    <rect
      {...staticAttributes} // นำ staticAttributes ทั้งหมดไปใช้
      ref={ref} // นำ ref ที่ได้จาก useD3Transition ไปใช้
      width={attrState.width} // กำหนดค่า width ที่ได้จากการ transition
      y={attrState.y} // กำหนดค่า y ที่ได้จากการ transition
      opacity={attrState.opacity} // กำหนดค่า opacity ที่ได้จากการ transition
    />
  );
};

export default TransitionableBar;
