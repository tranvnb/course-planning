export type CoursePrerequisite = {
  courseId: string;
  course_code: string;
  title: string;
  credit: number;
  prerequisites: String[][];
};
