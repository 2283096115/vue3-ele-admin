import dayjs from "dayjs";

/**
 * 默认时间格式
 */
export const DATE_FORMAT_DATETIME = "YYYY-MM-DD HH:mm:ss";
export const DATE_FORMAT_DATE = "YYYY-MM-DD";
/**
 * 获取格式化后的时间
 * @param oriDate 被格式化的时间
 * @param formatStr 格式化规则
 * @returns
 */
export function formatDate(
  oriDate: number | string | Date = "",
  formatStr = "YYYY-MM-DD HH:mm:ss"
): string {
  return dayjs(oriDate).format(formatStr);
}

export function formatDateDayOne(
  oriDate: number | string | Date = "",
  formatStr = "YYYY/MM/DD"
): string {
  return dayjs(oriDate).format(formatStr);
}

export function formatDateDayTwo(
  oriDate: number | string | Date = "",
  formatStr = "YYYY-MM-DD"
): string {
  return dayjs(oriDate).format(formatStr);
}
/**
 * 获取日期区间，返回动态表头
 * @param start
 * @param end
 * @returns
 */
export function getDateInterval(start, end) {
  const res = [];
  let curDate = dayjs(start);
  let i = 0;
  while (curDate <= dayjs(end) && i < 30) {
    res.push({
      label: curDate.format(DATE_FORMAT_DATE),
      prop: curDate.format(DATE_FORMAT_DATE)
    });
    curDate = curDate.add(1, "d");
    i++;
  }
  return res;
}
