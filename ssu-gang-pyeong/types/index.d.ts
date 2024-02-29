//user interface for register
interface IUser {
  username: string;
  email: string;
  school: string;
  major: string;
}

// literally authenticated user
interface IAuthenticatedUser {
  _id: string;
  username: string;
  email: string;
  school: string;
  major: string;
  courseReviewNum: number;
  adminAccount: boolean;
  classHistory: {
    [index: string]: [string] | [];
  };
  personalSchedule: IPersonalSchedule[];
}

export interface IPersonalSchedule {
  table: string;
  courseId: string;
  sections: {
    [string]: {
      days: number[];
      locations: string[];
      startTimes: string[];
      endTimes: string[];
    };
  };
}

export interface IColor {
  name: string;
  id: string;
  code: string;
}

export interface IIcon {
  name: string;
  id: string;
  symbol: string;
}

interface ITable {
  name: string;
}

interface ITableRequest {
  name: string;
}

interface IUpdateTableRequest {
  name: string;
  oldName: string;
}

interface IPSRequest {
  table: string;
  courseId: string;
  sections: {
    [string]: {
      days: number[];
      locations: string[];
      startTimes: string[];
      endTimes: string[];
    };
  };
}

interface IPSDeleteRequest {
  courseId: string;
}

interface ICategory {
  _id: string;
  name: string;
  user: IUser | string;
  isEditable: boolean;
  color: IColor;
  icon: IIcon;
}

interface ICategoryRequest {
  name: string;
  color: IColor;
  icon: IIcon;
}

interface ITask {
  _id: string;
  name: string;
  isCompleted: boolean;
  categoryId: string;
  categoryTitle: string;
  categoryName: string;
  categoryColor: string;
  createdAt: string;
  date: string;
}

interface ITaskRequest {
  name: string;
  isCompleted: boolean;
  categoryId: string;
  date: string;
}

interface ICourseRequest {
  searchSubj: string;
  keyword: string;
}

interface IUpdateUserNameRequest {
  user: string;
  username: string;
}

interface ICourse {
  _id: string;
  classNbr: string;
  subj: string;
  crs: string;
  courseTitle: string;
  sbc: string;
  cmp: string;
  sctn: string;
  credits: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  instructor: [string]; //instructor 학기별(순서별)로 써둔거
  instructor_names: string; //sunytime땜에 냅둠
  unique_instructor: string; //unique instructor
  likes: [string];
  reviews: Schema.Types.ObjectId[];
  semesters: [string];
  avgGrade: number;
}

interface IGlobalToggle {
  currentTableView: string;
}

interface IDarkMode {
  mode: string; // "dark" | "light" | "system"
}

interface IBulletinPost {
  _id: string;
  title: string;
  content: string;
  board: string;
  anonymity: boolean;
  likes: string[];
  comments: IBulletinPostComment[];
  createdBy: Schema.Types.ObjectId;
  createdByUsername: string;
  createdAt: string;
}

interface ILikePostRequest {
  id: string;
  like: boolean;
}

interface IBulletinPostComment {
  _id: string;
  text: string;
  anonymity: boolean;
  likes: string[];
  bulletin: string;
  createdBy: Schema.Types.ObjectId;
  createdByUsername: string;
  createdAt: string;
}

interface IBulletinPostRequest {
  title: string;
  content: string;
  board: string;
  anonymity: boolean;
}

interface IComment {
  text: string;
  anonymity: boolean;
}

interface IBulletinCommentRequest {
  text: string;
  anonymity: boolean;
}

interface ICourseEvalPostRequest {
  overallGrade: number;
  overallEvaluation: string;
  anonymity: boolean;
  semester: string;
  instructor: string;
  myLetterGrade: string;
  difficulty: string;
  homeworkQuantity: string;
  testQuantity: string;
  testType: string;
  teamProjectPresence: string;
  quizPresence: string;
  //new - 1. 성적은 어떻게 주시나요 2. 출석은 어떻게 확인하나요
  generosity: string;
  attendance: string;
}
