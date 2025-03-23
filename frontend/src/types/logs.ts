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
  date: string;
  entries: LogEntry[];
};
