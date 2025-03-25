export type LogEntry = {
  type: LogEntryType;
  start: number;
  end: number;
  remark?: string;
}


export type LogEntryType = "off" | "sb" | "driving" | "on";

 
export type LogDay = {
  id: number;
  trip: number;
  date?: string;
  entries?: LogEntry[];
  log_sheet:LogSheet;
  related_log_days?: number[];
};


export type LogSheet = {
  log_days?: LogDay[];  

  totalMilesToday?: number | null;
  totalMileageToday?: number | null;
  truckInfo?: string | null;
  carrierName?: string | null;
  officeAddress?: string | null;
  terminalAddress?: string | null;
  manifestNumber?: string | null;
  shipperCommodity?: string | null;
  date?: string | null; // ISO date string
  fromLocation?: string | null;
  toLocation?: string | null;
  OnDutyHoursToday?: number | null;
  totalOnDutyLast7Days?: number | null;
  totalAvailableTomorrow70?: number | null;
  totalOnDutyLast5Days?: number | null;
  totalOnDutyLast8Days?: number | null;
  totalAvailableTomorrow60?: number | null;
  totalOnDutyLast7Days60?: number | null;
};
