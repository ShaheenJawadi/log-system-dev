export type LogEntry = {
  type: 'off' | 'sb' | 'driving' | 'on';
  start: number;
  end: number;
  remark?: string;
}