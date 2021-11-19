import { Stream } from './IStream';

export interface ICourse {
  url?: string;
  streams?: Stream[];
  course_code: string;
  title: string;
  credit: number | string;
  prerequisitesStr?: string;
  prerequisites: string[][];
}
