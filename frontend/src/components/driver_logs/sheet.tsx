import DailyDriverLogTab from "../../components/driver_logs/dailyLogTab";
import {
  HourRecapSection,
  LogHeaderSection,
  ShippingSection,
} from "../../components/driver_logs/dailyRecord"; 
import { LogDay } from "../../types/logs";
import { useParams } from "react-router-dom";
const DriverSheet = ({logsData}:{logsData:LogDay|null}) => {
 
 
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
