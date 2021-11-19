export enum Stream {
  TECH = 'emmerge_tech',
  DATA = 'data_analysis',
  SECURITY = 'security',
}

export interface IStream {
  name: Stream;
  totalCredit: number;
  completedCredit: number;
}
