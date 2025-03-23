import DailyDriverLogTab from "../../components/driver_logs/dailyLogTab";
import {
  HourRecapSection,
  LogHeaderSection,
  ShippingSection,
} from "../../components/driver_logs/dailyRecord";
import { LogEntry, LogSheet } from "../../types/logs";
import * as logService from "../../services/logServices";
import { useEffect, useState } from "react";
import { LogDay } from "../../types/logs";
import { useParams } from "react-router-dom";
const DriverSheet = () => {
  const { id } = useParams<{ id: string }>();
  const [logsData, setLogsData] = useState<LogDay>();
  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState<boolean>(false);

  const fetchSingleLog = async (id: number) => {
    try {
      const response = await logService.singleLog(id);

      setLogsData(response);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchSingleLog(parseInt(id));
  }, [id]);


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
 

  return (
    <>
      <LogHeaderSection logSheet={logsData?.log_sheet || {}} />
      <DailyDriverLogTab logData={logsData?.entries||[]} />
      <ShippingSection logSheet={logsData?.log_sheet || {}} />
      <HourRecapSection logSheet={logsData?.log_sheet || {}} />
    </>
  );
};

export default DriverSheet;
