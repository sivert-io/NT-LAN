import React from "react";

export function ConnecitonError({
  connectionError,
}: {
  connectionError: string;
}) {
  return (
    <div className="fixed z-50 top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,.65)] flex items-center justify-center">
      <div className="flex-col text-center p-4 flex gap-6 rounded-lg bg-[#FFC4DD] text-[#82052F] font-medium">
        <p>Seating systemet er nede! 🥺⚰️</p>
        <b className="text-xs font-bold">Error Message: {connectionError}</b>
        <p>Vennligst vent mens vi kobler deg opp igjen</p>
      </div>
    </div>
  );
}
