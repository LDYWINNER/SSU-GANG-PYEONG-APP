import { Alert } from "react-native";
import { IColor, ICourse, IIcon } from "../types";
import { nanoid } from "nanoid/non-secure";

const palette = {
  red500: "#ef4444",
  red600: "#dc2626",
  orange300: "#fdba74",
  orange400: "#fb923c",
  yellow300: "#fcd34d",
  yellow500: "#f59e0b",
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
  ams: "📐",
  acc: "📈",
  bus: "💰",
  cse: "💻",
  ese: "💡",
  estoremp: "👥",
  mec: "🔋",
  wrtorwae: "📝",
  others: "🎧",
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
  try {
    const formattedCourses = [];

    for (let i = 0; i < courses.length; i++) {
      let recOrLabOrSemExist = false;
      let targetCmp = "";
      let recOrLabOrSem = "";
      if (courses[i].cmp.includes(", ")) {
        targetCmp = courses[i].cmp.split(", ").at(-1) as string;
      } else {
        targetCmp = courses[i].cmp;
      }

      console.log(targetCmp, "targetCmp");

      if (targetCmp.includes("(REC")) {
        recOrLabOrSemExist = true;
        recOrLabOrSem = "REC";
      } else if (targetCmp.includes("(LAB")) {
        recOrLabOrSemExist = true;
        recOrLabOrSem = "LAB";
      } else if (targetCmp.includes("(SEM")) {
        recOrLabOrSemExist = true;
        recOrLabOrSem = "SEM";
      } else if (courses[i].day.split(", ").at(-1)?.includes("(")) {
        recOrLabOrSemExist = true;
        recOrLabOrSem = "LEC";
      }

      console.log(recOrLabOrSemExist, "recOrLabOrSemExist");

      if (recOrLabOrSemExist) {
        const targetDay = courses[i].day.split(", ").at(-1) as string;
        const targetStartTime = courses[i].startTime
          .split(", ")
          .at(-1) as string;
        const targetEndTime = courses[i].endTime.split(", ").at(-1) as string;
        let targetLocation = courses[i].room.split(", ").at(-1);
        let recOrLabLocation = "";

        if (targetLocation?.includes("(")) {
          const temp = targetLocation.slice(0, -1).split("(");
          targetLocation = temp[0];
          recOrLabLocation = temp[1];

          console.log(recOrLabLocation, "recOrLabLocation");
        }

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
            [recOrLabOrSem]: {
              days: formattedDays[1],
              startTimes: formattedST[1],
              endTimes: formattedET[1],
              locations:
                recOrLabLocation === ""
                  ? courses[i].day === "F"
                    ? [targetLocation]
                    : [targetLocation, targetLocation]
                  : formattedDays[1].length === 1
                  ? [recOrLabLocation]
                  : [recOrLabLocation, recOrLabLocation],
            },
          },
        });
      } else if (courses[i].classNbr.includes(",")) {
        formattedCourses.push({
          courseId: `${courses[i].subj} ${courses[i].crs}`,
          title: `${courses[i].courseTitle}`,
          sections: {
            "": {
              days: formatDays(courses[i].day.split(", ").at(-1) as string),
              startTimes:
                courses[i].day === "F"
                  ? formatTimes(
                      courses[i].startTime.split(", ").at(-1) as string
                    )
                  : formatTimes(
                      courses[i].startTime.split(", ").at(-1) as string
                    ).concat(
                      formatTimes(
                        courses[i].startTime.split(", ").at(-1) as string
                      )
                    ),
              endTimes:
                courses[i].day === "F"
                  ? formatTimes(courses[i].endTime.split(", ").at(-1) as string)
                  : formatTimes(
                      courses[i].endTime.split(", ").at(-1) as string
                    ).concat(
                      formatTimes(
                        courses[i].endTime.split(", ").at(-1) as string
                      )
                    ),
              locations:
                courses[i].day === "F"
                  ? [courses[i].room.split(", ").at(-1) as string]
                  : [courses[i].room.split(", ").at(-1) as string].concat([
                      courses[i].room.split(", ").at(-1) as string,
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
    console.log(formattedCourses[0].sections);
    return formattedCourses;
  } catch (error) {
    Alert.alert(
      "해당 수업을 등록하는데에 에러가 났습니다. My Page에 가셔서 문의해주시면 감사하겠습니다.",
      error as string,
      [{ text: "확인" }]
    );
  }
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
    case "MF":
      result.push(1);
      result.push(5);
      break;
    case "TUF":
      result.push(2);
      result.push(5);
      break;
    case "M":
      result.push(1);
      break;
    case "TU":
      result.push(2);
      break;
    case "W":
      result.push(3);
      break;
    case "TH":
      result.push(4);
      break;
    case "F":
      result.push(5);
      break;
    case "SAT":
      result.push(6);
      break;
    default:
      console.log(target);
  }

  return result;
};

//makes 3:30 PM into ["15:30"]
const formatTimes = (target: string) => {
  const result: string[] = [];
  //["3:30 PM"]
  if (target.includes("PM") && Number(target.split(":")[0]) < 12) {
    const hour = Number(target.split(":")[0]) + 12;
    result.push(String(hour) + ":" + target.split(":")[1].slice(0, 2));
  } else {
    const hour = Number(target.split(":")[0]);
    result.push(String(hour) + ":" + target.split(":")[1].slice(0, 2));
  }
  return result;
};

let recOrLabDay = "";

//MW(RECW) becomes [[1, 3], [3]]
const formatRecDays = (target: string) => {
  const result: [number[], number[]] = [[], []];
  //[MW, RECW]
  const temp = target.slice(0, -1).split("(");
  recOrLabDay = temp[1];
  switch (temp[0]) {
    case "MW":
      result[0].push(1);
      result[0].push(3);
      break;
    case "TUTH":
      result[0].push(2);
      result[0].push(4);
      break;
    case "MF":
      result[0].push(1);
      result[0].push(5);
      break;
    case "TUF":
      result[0].push(2);
      result[0].push(5);
      break;
    case "M":
      result[0].push(1);
      break;
    case "TU":
      result[0].push(2);
      break;
    case "W":
      result[0].push(3);
      break;
    case "TH":
      result[0].push(4);
      break;
    case "F":
      result[0].push(5);
      break;
    case "SAT":
      result[0].push(6);
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
    case "RECTU":
      result[1].push(2);
      break;
    case "RECTH":
      result[1].push(4);
      break;
    case "REM":
      result[1].push(1);
      break;
    case "REW":
      result[1].push(3);
      break;
    case "REF":
      result[1].push(5);
      break;
    case "RETU":
      result[1].push(2);
      break;
    case "RETH":
      result[1].push(4);
      break;
    case "RETUTH":
      result[1].push(2);
      result[1].push(4);
      break;
    case "MW":
      result[1].push(1);
      result[1].push(3);
      break;
    case "TUTH":
      result[1].push(2);
      result[1].push(4);
      break;
    case "M":
      result[1].push(1);
      break;
    case "TU":
      result[1].push(2);
      break;
    case "W":
      result[1].push(3);
      break;
    case "TH":
      result[1].push(4);
      break;
    case "F":
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
  console.log("temp", temp);
  if (temp[0].includes("PM") && Number(temp[0].split(":")[0]) < 12) {
    const hour = Number(temp[0].split(":")[0]) + 12;
    result[0].push(String(hour) + ":" + temp[0].split(":")[1].slice(0, 2));
  } else {
    const hour = Number(temp[0].split(":")[0]);
    result[0].push(String(hour) + ":" + temp[0].split(":")[1].slice(0, 2));
  }

  if (temp[1].includes("PM") && Number(temp[1].split(":")[0]) < 12) {
    const hour = Number(temp[1].split(":")[0]) + 12;
    result[1].push(String(hour) + ":" + temp[1].split(":")[1].slice(0, 2));
  } else {
    const hour = Number(temp[1].split(":")[0]);
    result[1].push(String(hour) + ":" + temp[1].split(":")[1].slice(0, 2));
  }

  if (
    recOrLabDay === "MW" ||
    recOrLabDay === "TUTH" ||
    recOrLabDay === "RETUTH"
  ) {
    result[0].push(result[0][0]);
    result[1].push(result[1][0]);
  }
  return result;
};
