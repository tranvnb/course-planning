import { ICourse } from './ICourse';

export interface ISemester {
  id: number;
  title: string;
  courses: ICourse[];
}
