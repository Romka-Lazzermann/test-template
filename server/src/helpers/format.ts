import dayjs from "dayjs";

export function format_seconds_timestamp(timestamp: number, format: string){
    return dayjs.unix(timestamp).format(format);
}