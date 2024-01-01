//user interface for register
interface IUser {
  username: string;
  email: string;
  school: string;
  major: string;
}

// literally authenticated user
interface IAuthenticatedUser {
  username: string;
  email: string;
  school: string;
  major: string;
  courseReviewNum: number;
  adminAccount: boolean;
  classHistory: {
    [index: string]: [string];
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

interface ITVCourse {
  courseId: string;
  title: string;
  sections: {
    [string]: ITVItem;
  };
}

interface ITVItem {
  day: number;
  startTime: string;
  endTime: string;
  location: string;
  color: string;
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
