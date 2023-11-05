import React from "react";
import useD3Transition from "use-d3-transition";

// Functional Component ชื่อ TransitionableLabel ที่รับค่า x, y, opacity, labelText และ staticAttributes
const TransitionableLabel = ({
  x,
  y,
  opacity,
  labelText,
  ...staticAttributes
}) => {
  // ใช้ Hook useD3Transition เพื่อทำการจัดการ transition ของ D3
  const { ref, attrState } = useD3Transition({
    attrsToTransitionTo: { x, y, opacity }, // กำหนดค่าที่ต้องการให้มีการ transition
    deps: [x, y, opacity], // ระบุ dependencies ที่ให้ในการ trigger transition
  });

  // Return ตัวข้อความเป็น element ของ SVG
  return (
    <text
      {...staticAttributes} // นำ staticAttributes ทั้งหมดไปใช้
      ref={ref} // นำ ref ที่ได้จาก useD3Transition ไปใช้
      x={attrState.x} // กำหนดค่า x ที่ได้จากการ transition
      y={attrState.y} // กำหนดค่า y ที่ได้จากการ transition
      opacity={attrState.opacity} // กำหนดค่า opacity ที่ได้จากการ transition
    >
      {labelText} {/* แสดงข้อความ */}
    </text>
  );
};

export default TransitionableLabel;
