import dayjs from "dayjs";

export function format_seconds_timestamp(timestamp: number, format: string){
    return dayjs.unix(timestamp).format(format);
}

export function isStringifiedArray(str: string) {
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed);
  } catch (e) {
    return false;
  }
}