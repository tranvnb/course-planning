import { ICourse } from './ICourse';

export interface IProgram {
  first_year: (ICourse | ICourse[] | ICourse[][])[];
  second_year: {
    [keys: string]: (ICourse | ICourse[] | ICourse[][])[];
  };
}
