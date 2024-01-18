import type { Plugin } from "vite";
import dayjs, { Dayjs } from "dayjs";
import duration from "dayjs/plugin/duration";
import { green, bold } from "picocolors";
dayjs.extend(duration);

export function viteBuildInfo(): Plugin {
  let config: { command: string };
  let startTime: Dayjs;
  let endTime: Dayjs;
  return {
    name: "vite:buildInfo",
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    buildStart() {
      console.log(bold(green(`开始打包`)));
      if (config.command === "build") {
        startTime = dayjs(new Date());
      }
    },
    closeBundle() {
      endTime = dayjs(new Date());
      if (config.command === "build") {
        console.log(
          bold(
            green(
              `🎉恭喜打包完成（总用时${dayjs
                .duration(endTime.diff(startTime))
                .format("mm分ss秒")}）`
            )
          )
        );
      }
    }
  };
}
