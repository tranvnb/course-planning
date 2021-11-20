export enum StreamEnum {
  TECH = 'emmerge_tech',
  DATA = 'data_analysis',
  SECURITY = 'security',
}

export interface IStream {
  name: StreamEnum;
  totalCredit: number;
  completedCredit: number;
}
