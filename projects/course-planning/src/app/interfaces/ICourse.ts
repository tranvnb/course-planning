export interface ICourse {
  url: string;
  courseId?: string;
  course_code: string;
  title: string;
  credit: number | string;
  prerequisitesStr?: string;
  prerequisites: string[][];
  // instructor: String;
  // course_id: String;  // Course CRN
}
