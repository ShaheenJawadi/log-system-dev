import React, { useEffect, useRef } from "react";
import { LogEntry } from "../../types/logs";

const DailyDriverLogTab = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const logData: LogEntry[] = [
    { type: "off", start: 0, end: 2.75, remark: "Resting in Little Rock, AR" },
    { type: "sb", start: 2.75, end: 5, remark: "Sleep break before driving" },
    { type: "on", start: 5, end: 6, remark: "Loading cargo at the dock" },
    {
      type: "driving",
      start: 6,
      end: 8.25,
      remark: "Heading towards Corsicana, TX",
    },
    { type: "on", start: 8.25, end: 9, remark: "Quick paperwork & refuel" },
    {
      type: "driving",
      start: 9,
      end: 11.25,
      remark: "On the road to Houston, TX",
    },
    {
      type: "on",
      start: 11.25,
      end: 12,
      remark: "Dinner break at a truck stop",
    },
    {
      type: "driving",
      start: 12,
      end: 14.75,
      remark: "Pushing towards Orange, TX",
    },
    {
      type: "off",
      start: 14.75,
      end: 24,
      remark: "Done for the day, off-duty",
    },
  ];

  const MARGIN = {
    LEFT: 160,
    RIGHT: 80,
    TOP: 40,
    BOTTOM: 150,
  };

  const ROW_HEIGHT = 35;
  const statusRows = [
    { id: "off", label: "1. OFF DUTY" },
    { id: "sb", label: "2. SLEEPER BERTH" },
    { id: "driving", label: "3. DRIVING" },
    { id: "on", label: "4. ON DUTY (NOT DRIVING)" },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const gridWidth = width - MARGIN.LEFT - MARGIN.RIGHT;
    const gridHeight = ROW_HEIGHT * statusRows.length;
    const gridTop = MARGIN.TOP;
    const gridLeft = MARGIN.LEFT;

    const statusPositions: Record<string, number> = {};
    statusRows.forEach((row, index) => {
      statusPositions[row.id] = gridTop + index * ROW_HEIGHT + ROW_HEIGHT / 2;
    });

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    ctx.strokeRect(gridLeft, gridTop, gridWidth, gridHeight);

    ctx.fillStyle = "#000";
    ctx.font = "bold  12px Arial";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    statusRows.forEach((row, index) => {
      const y = gridTop + index * ROW_HEIGHT + ROW_HEIGHT / 2;
      if (row.id === "on") {
        ctx.fillText("4. ON DUTY", gridLeft - 10, y - 5);
        ctx.fillText("(NOT DRIVING)", gridLeft - 10, y + 10);
      } else if (row.id === "sb") {
        ctx.fillText("2. SLEEPER", gridLeft - 10, y - 5);
        ctx.fillText("BERTH", gridLeft - 10, y + 10);
      } else {
        ctx.fillText(row.label, gridLeft - 10, y);
      }
    });

    const drawTimeGrid = (
      left: number,
      top: number,
      width: number,
      height: number,
      label: string = ""
    ) => {
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 1;
      ctx.strokeRect(left, top, width, height);

      ctx.fillStyle = "#000";
      ctx.font = "bold 10px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      if (label) {
        ctx.textAlign = "right";
        ctx.fillText(label, left - 10, top + height / 2);
        ctx.textAlign = "center";
      }

      ctx.fillText("MID", left, top - 15);
      ctx.fillText("NIGHT", left, top - 5);

      for (let hour = 0; hour <= 24; hour++) {
        const x = left + (hour / 24) * width;

        ctx.beginPath();
        ctx.moveTo(x, top);
        ctx.lineTo(x, top + height);
        ctx.stroke();

        //  hour labels
        if (hour > 0 && hour <= 24) {
          let label;
          if (hour === 12) {
            ctx.fillText("NOON", x, top - 15);
          } else if (hour === 24) {
            ctx.fillText("MID", x, top - 15);
            ctx.fillText("NIGHT", x, top - 5);
          } else {
            label = (hour > 12 ? hour - 12 : hour).toString();
            ctx.fillText(label, x, top - 10);
          }
        }

        //  quarter marks
        if (hour < 24) {
          for (let i = 1; i <= 3; i++) {
            const quarterX = x + (i * (width / 24)) / 4;
            const tickLength = i === 2 ? 8 : 5;
            ctx.beginPath();
            ctx.moveTo(quarterX, top);
            ctx.lineTo(quarterX, top + tickLength);
            ctx.stroke();
            if (label == "") {
              for (let j = 1; j <= 3; j++) {
                ctx.beginPath();
                ctx.moveTo(quarterX, top + ROW_HEIGHT * j);
                ctx.lineTo(quarterX, top + ROW_HEIGHT * j + tickLength);
                ctx.stroke();
              }
            }
          }
        }
      }
    };

    drawTimeGrid(gridLeft, gridTop, gridWidth, gridHeight);

    for (let i = 1; i < statusRows.length; i++) {
      const y = gridTop + i * ROW_HEIGHT;
      ctx.beginPath();
      ctx.moveTo(gridLeft, y);
      ctx.lineTo(gridLeft + gridWidth, y);
      ctx.stroke();
    }

    const totals: Record<string, number> = {
      off: 0,
      sb: 0,
      driving: 0,
      on: 0,
    };

    logData.forEach((entry) => {
      totals[entry.type] += entry.end - entry.start;
    });

    ctx.textAlign = "left";
    ctx.font = "bold 12px Arial";
    statusRows.forEach((row, index) => {
      const y = gridTop + index * ROW_HEIGHT + ROW_HEIGHT / 2;
      ctx.fillText(totals[row.id].toFixed(1), gridLeft + gridWidth + 35, y);
    });

    const totalHours = Object.values(totals).reduce((sum, val) => sum + val, 0);
    ctx.fillText(
      totalHours.toFixed(1),
      gridLeft + gridWidth + 35,
      gridTop + gridHeight + 20
    );
    ctx.font = "bold 10px Arial";
    ctx.fillText("TOTAL", gridLeft + gridWidth + 30, gridTop - 15);
    ctx.fillText("HOURS", gridLeft + gridWidth + 30, gridTop - 5);

    const remarksHeight = 30;
    const remarksTop = gridTop + gridHeight + 60;
    drawTimeGrid(gridLeft, remarksTop, gridWidth, remarksHeight, "REMARKS");

    const sortedLogData = [...logData].sort((a, b) => a.start - b.start);

    ctx.beginPath();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;

    if (sortedLogData.length > 0) {
      const firstEntry = sortedLogData[0];
      const startX = gridLeft + (firstEntry.start / 24) * gridWidth;
      const startY = statusPositions[firstEntry.type];

      ctx.moveTo(startX, startY);

      const changePoints: { x: number; hour: number; remark?: string }[] = [];

      for (let i = 0; i < sortedLogData.length; i++) {
        const entry = sortedLogData[i];
        const endX = gridLeft + (entry.end / 24) * gridWidth;
        const currentY = statusPositions[entry.type];

        ctx.lineTo(endX, currentY);

        if (entry.remark) {
          changePoints.push({
            x: gridLeft + (entry.start / 24) * gridWidth,
            hour: entry.start,
            remark: entry.remark,
          });
        }

        if (i < sortedLogData.length - 1) {
          const nextEntry = sortedLogData[i + 1];
          const nextY = statusPositions[nextEntry.type];

          if (entry.end === nextEntry.start) {
            ctx.lineTo(endX, nextY);
          } else {
            const nextX = gridLeft + (nextEntry.start / 24) * gridWidth;
            ctx.moveTo(nextX, nextY);
          }
        }
      }

      ctx.stroke();

      // remarks
      ctx.save();
      ctx.font = "10px Arial";

      changePoints.forEach((point) => {
        if (point.remark) {
          ctx.beginPath();
          ctx.moveTo(point.x, remarksTop);
          ctx.lineTo(point.x, remarksTop + remarksHeight + 25);
          ctx.stroke();

          ctx.save();
          ctx.translate(point.x, remarksTop + remarksHeight + 30);
          ctx.rotate(-Math.PI / 4);
          ctx.textAlign = "left";
          ctx.fillText(point.remark, 0, 0);
          ctx.restore();
        }
      });

      ctx.restore();
    }
  }, [logData]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={900}
        height={300}
        style={{
          height: "auto",
        }}
      />
    </div>
  );
};

export default DailyDriverLogTab;
