import dayjs from "dayjs";

export function format_seconds_timestamp(timestamp: number, format: string){
    return dayjs.unix(timestamp).format(format);
}

export function isStringifiedArray(str: string, re: number = 0) {
  try {
    const parsed = JSON.parse(str);
    const parserdIf =Array.isArray(parsed);
    if(!parserdIf){
      throw "Parse error"
    }
    return re ? parsed : parserdIf
  } catch (e) {
    return false;
  }
}