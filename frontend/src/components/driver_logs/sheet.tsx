import { Box, Container, Stack } from "@mui/material";
import DailyDriverLogTab from "../../components/driver_logs/dailyLogTab";
import {
  HourRecapSection,
  LogHeaderSection,
  ShippingSection,
} from "../../components/driver_logs/dailyRecord";
import { LogEntry, LogSheet } from "../../types/logs";

const DriverSheet = () => {
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

  const mockLogSheet: LogSheet = {};

  return (
    <>
      <LogHeaderSection logSheet={mockLogSheet} />

      <DailyDriverLogTab logData={logData} />
      <ShippingSection logSheet={mockLogSheet} />
      <HourRecapSection logSheet={mockLogSheet} />
    </>
  );
};

export default DriverSheet;
