import React from "react";

export default function LegendItem({
  boxClass,
  textClass,
  text,
}: {
  boxClass: string;
  textClass: string;
  text: string;
}) {
  return (
    <div className={`flex gap-4 items-center whitespace-nowrap`}>
      <div className={`border-2 p-3.5 rounded-lg ${boxClass}`}></div>
      <p className={`font-medium ${textClass}`}>{text}</p>
    </div>
  );
}
