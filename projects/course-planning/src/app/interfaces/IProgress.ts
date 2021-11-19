import { IStream, StreamEnum } from './IStream';

export interface IProgressPoint {
  stream: StreamEnum;
  total: number;
  completed: number;
}

export interface IProgress {
  [keys: string]: IStream;
}
