import React from "react";

export default function LegendItem({
  classColor,
  text,
}: {
  classColor: string;
  text: string;
}) {
  return (
    <div className={`flex gap-4 items-center whitespace-nowrap ${classColor}`}>
      <div className={`border-2 p-3.5 rounded-lg ${classColor}`}></div>
      <p className="font-medium">{text}</p>
    </div>
  );
}
