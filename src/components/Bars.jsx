import React from "react";
import TransitionableBar from "./TransitionableBar.jsx";
import TransitionableLabel from "./TransitionableLabel.jsx";
import {
  x,
  y,
  barSize,
  textSize,
  labelPadding,
  barsShowing,
  colorScale,
} from "../common.js";
import _ from "lodash";
import * as d3 from "d3";

const Bars = ({ currentFrame, colorMap, domainMax }) => {
  const formatWithCommas = d3.format(",d"); // กำหนด format ตัวเลขที่แสดงใน charf

  let localDomainMax = domainMax; // กำหนดค่า localDomainMax เท่ากับ domainMax ที่รับเข้ามา

  return (
    <>
      {_.map(currentFrame, (country) => {
        const { rank, Group, Country } = country; // นำข้อมูล rank, Group, และ Country จาก object country
        let Population = _.get(country, "Population"); // นำข้อมูล Population จาก object country โดยใช้ lodash

        // ป้องกันไม่ให้ chart ที่ไม่เกี่ยวข้องทำการ render ใหม่
        if (rank === barsShowing) {
          Population = 0; // กำหนดค่า Population เป็น 0 เมื่อ rank เท่ากับ barsShowing
          localDomainMax = 0; // กำหนดค่า localDomainMax เป็น 0 เมื่อ rank เท่ากับ barsShowing
        }

        return (
          <React.Fragment key={Country}>
            <TransitionableBar
              width={x(Population, localDomainMax)}
              y={y(rank)}
              opacity={rank < barsShowing ? 1 : 0} // กำหนดค่าความโปร่งใส chart
              key={Country}
              x={x(0, localDomainMax)}
              height={barSize}
              style={{ fill: colorScale(Group) }} // กำหนดสีของ chart
            />
            <TransitionableLabel
              x={x(Population, localDomainMax) - labelPadding}
              y={y(rank) + 0.5 * barSize}
              opacity={rank < barsShowing ? 1 : 0} // กำหนดความโปร่งใสของข้อความ
              labelText={Country} // ข้อความที่แสดง
              style={{
                fontSize: textSize,
                textAnchor: "end",
                fontWeight: "bold",
              }} // กำหนดสไตล์ของข้อความ
            />
            <TransitionableLabel
              x={x(Population, localDomainMax) - labelPadding}
              y={y(rank) + 0.5 * barSize + textSize}
              opacity={rank < barsShowing ? 1 : 0}
              labelText={formatWithCommas(Population)} // แปลงและแสดงข้อมูล Population
              style={{
                fontSize: textSize,
                textAnchor: "end",
              }}
            />
          </React.Fragment>
        );
      })}
    </>
  );
};

export default Bars;
