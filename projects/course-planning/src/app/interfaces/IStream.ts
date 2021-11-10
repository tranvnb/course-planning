export enum Stream {
  TECH = 'emmerge technologies',
  DATA = 'database',
  SECURITY = 'security',
}

export interface IStream {
  name: Stream;
  totalCredit: 80;
  completedCredit: 0;
}
