import { IColor, ICourse, IIcon } from "../types";
import { nanoid } from "nanoid/non-secure";

const palette = {
  red500: "#ef4444",
  red600: "#dc2626",
  orange300: "#fdba74",
  orange400: "#fb923c",
  green500: "#22c55e",
  green600: "#16a34a",
  sky400: "#38bdf8",
  sky500: "#0ea5e9",
  purple500: "#a855f7",
  purple600: "#9333ea",
};

export const getColors = () => {
  const colors: IColor[] = Object.keys(palette).map((_paletteItem) => {
    return {
      id: `color_${nanoid()}`,
      code: palette[_paletteItem as keyof typeof palette],
      name: _paletteItem,
    };
  });
  return colors;
};

const ICON_SET = {
  seed: "🌱",
  fries: "🍟",
  pizza: "🍕",
  rocket: "🚀",
  grinning: "😀",
  partying_face: "🥳",
  beach_umbrella: "🏖️",
};

export const getIcons = () => {
  const icons: IIcon[] = Object.keys(ICON_SET).map((_icon) => {
    return {
      id: `icon_${nanoid()}`,
      name: _icon,
      symbol: ICON_SET[_icon as keyof typeof ICON_SET],
    };
  });
  return icons;
};

export const getGreeting = ({ hour }: { hour: number }) => {
  if (hour < 12) {
    return "morning";
  }
  if (hour < 18) {
    return "evening";
  } else {
    return "night";
  }
};

const tvPalette = [
  "#ef4444",
  "#dc2626",
  "#fdba74",
  "#fb923c",
  "#22c55e",
  "#16a34a",
  "#38bdf8",
  "#0ea5e9",
  "#a855f7",
  "#9333ea",
];

//for table view - using eventGroups
export const formatCourses = (courses: ICourse[]) => {
  const formattedCourses = [];
  const sl = courses[0].instructor.length;

  for (let i = 0; i < courses.length; i++) {
    let recExist = false;
    if (courses[i].cmp.includes(", ")) {
      const targetCmp = courses[i].cmp.split(", ")[sl - 1];
      if (targetCmp.includes("(")) {
        recExist = true;
      }
    }

    if (recExist) {
      const targetDay = courses[i].day.split(", ")[sl - 1];
      const targetLocation = courses[i].room.split(", ")[sl - 1];
      const targetStartTime = courses[i].startTime.split(", ")[sl - 1];
      const targetEndTime = courses[i].endTime.split(", ")[sl - 1];

      //console.log(targetDay, targetStartTime, targetEndTime);
      //MW(RECM) 3:30 PM(12:30 PM) 4:50 PM(1:25 PM)

      const formattedDays: any = formatRecDays(targetDay);
      const formattedST: any = formatRecTimes(targetStartTime);
      const formattedET: any = formatRecTimes(targetEndTime);
      //console.log(formattedST, formattedET);

      formattedCourses.push({
        courseId: `${courses[i].subj} ${courses[i].crs}`,
        title: `${courses[i].courseTitle}`,
        sections: {
          LEC: {
            days: formattedDays[0],
            startTimes:
              courses[i].day === "F"
                ? formattedST[0]
                : formattedST[0].concat(formattedST[0]),
            endTimes:
              courses[i].day === "F"
                ? formattedET[0]
                : formattedET[0].concat(formattedET[0]),
            locations:
              courses[i].day === "F"
                ? [targetLocation]
                : [targetLocation, targetLocation],
          },
          REC: {
            days: formattedDays[1],
            startTimes: formattedST[1],
            endTimes: formattedET[1],
            locations:
              courses[i].day === "F"
                ? [targetLocation]
                : [targetLocation, targetLocation],
          },
        },
      });
    } else if (courses[i].classNbr.includes(",")) {
      formattedCourses.push({
        courseId: `${courses[i].subj} ${courses[i].crs}`,
        title: `${courses[i].courseTitle}`,
        sections: {
          "": {
            days: formatDays(courses[i].day.split(", ")[sl - 1]),
            startTimes:
              courses[i].day === "F"
                ? formatTimes(courses[i].startTime.split(", ")[sl - 1])
                : formatTimes(courses[i].startTime.split(", ")[sl - 1]).concat(
                    formatTimes(courses[i].startTime.split(", ")[sl - 1])
                  ),
            endTimes:
              courses[i].day === "F"
                ? formatTimes(courses[i].endTime.split(", ")[sl - 1])
                : formatTimes(courses[i].endTime.split(", ")[sl - 1]).concat(
                    formatTimes(courses[i].endTime.split(", ")[sl - 1])
                  ),
            locations:
              courses[i].day === "F"
                ? [courses[i].room.split(", ")[sl - 1]]
                : [courses[i].room.split(", ")[sl - 1]].concat([
                    courses[i].room.split(", ")[sl - 1],
                  ]),
          },
        },
      });
    } else {
      formattedCourses.push({
        courseId: `${courses[i].subj} ${courses[i].crs}`,
        title: `${courses[i].courseTitle}`,
        sections: {
          "": {
            days: formatDays(courses[i].day),
            startTimes:
              courses[i].day === "F"
                ? formatTimes(courses[i].startTime)
                : formatTimes(courses[i].startTime).concat(
                    formatTimes(courses[i].startTime)
                  ),
            endTimes:
              courses[i].day === "F"
                ? formatTimes(courses[i].endTime)
                : formatTimes(courses[i].endTime).concat(
                    formatTimes(courses[i].endTime)
                  ),
            locations:
              courses[i].day === "F"
                ? [courses[i].room]
                : [courses[i].room].concat([courses[i].room]),
          },
        },
      });
    }
  }

  return formattedCourses;
};

//makes MW into [1, 3]
const formatDays = (target: string) => {
  const result: number[] = [];
  switch (target) {
    case "MW":
      result.push(1);
      result.push(3);
      break;
    case "TUTH":
      result.push(2);
      result.push(4);
      break;
    case "F":
      result.push(5);
    default:
      console.log(target);
  }

  return result;
};

//makes 3:30 PM into ["15:30"]
const formatTimes = (target: string) => {
  const result: string[] = [];
  //["3:30 PM"]
  if (Number(target.split(":")[0]) < 8) {
    const hour = Number(target.split(":")[0]) + 12;
    result.push(String(hour) + ":" + target.split(":")[1].slice(0, 2));
  } else {
    const hour = Number(target.split(":")[0]);
    result.push(String(hour) + ":" + target.split(":")[1].slice(0, 2));
  }
  return result;
};

//MW(RECW) becomes [[1, 3], [3]]
const formatRecDays = (target: string) => {
  const result: [number[], number[]] = [[], []];
  //[MW, RECW]
  const temp = target.slice(0, -1).split("(");
  switch (temp[0]) {
    case "MW":
      result[0].push(1);
      result[0].push(3);
      break;
    case "TUTH":
      result[0].push(2);
      result[0].push(4);
      break;
    default:
      console.log(temp[0]);
  }

  switch (temp[1]) {
    case "RECM":
      result[1].push(1);
      break;
    case "RECW":
      result[1].push(3);
      break;
    case "RECF":
      result[1].push(5);
      break;
    default:
      console.log(temp[1]);
  }

  return result;
};

//makes 3:30 PM(12:30 PM) into ["15:30", "12:30"]
const formatRecTimes = (target: string) => {
  const result: [string[], string[]] = [[], []];
  //["3:30 PM", "12:30 PM"]
  const temp = target.slice(0, -1).split("(");
  //console.log("temp", temp);
  if (temp[0].includes("PM") && Number(temp[0].split(":")[0]) < 8) {
    const hour = Number(temp[0].split(":")[0]) + 12;
    result[0].push(String(hour) + ":" + temp[0].split(":")[1].slice(0, 2));
  } else {
    const hour = Number(temp[0].split(":")[0]);
    result[0].push(String(hour) + ":" + temp[0].split(":")[1].slice(0, 2));
  }

  if (temp[1].includes("PM") && Number(temp[1].split(":")[0]) < 8) {
    const hour = Number(temp[1].split(":")[0]) + 12;
    result[1].push(String(hour) + ":" + temp[1].split(":")[1].slice(0, 2));
  } else {
    const hour = Number(temp[1].split(":")[0]);
    result[1].push(String(hour) + ":" + temp[1].split(":")[1].slice(0, 2));
  }

  return result;
};
