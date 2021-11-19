import { StreamEnum } from './IStream';

export interface ICourse {
  url?: string;
  streams?: StreamEnum[];
  course_code: string;
  title: string;
  credit: number | string;
  prerequisitesStr?: string;
  prerequisites: string[][];
}
