export enum Stream {
  TECH = 'tech',
  DATA = 'database',
  SECURITY = 'security',
}

export interface IStream {
  name: Stream;
  totalCredit: number;
  completedCredit: number;
}
