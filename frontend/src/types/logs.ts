export type LogEntry = {
  type: 'off' | 'sb' | 'driving' | 'on';
  start: number;
  end: number;
  remark?: string;
}


 
export type LogDay = {
  id: number;
  trip: number;
  date: string;
  entries: LogEntry[];
};
