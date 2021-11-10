import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { scan, tap } from 'rxjs/operators';
import { ICourse } from '../interfaces/ICourse';
import { ISemester } from '../interfaces/ISemester';
import { CoursePrerequisite } from '../interfaces/CoursePrerequisites';
import {
  DEFAULT_COURSES,
  COURSE_PREREQUISITES,
  PROGRAM,
} from './program-courses';
import { IProgram } from '../interfaces/IProgram';
import { Stream, IStream } from '../interfaces/IStream';

// type FinishPoint = { point: number; completed: number };
type ProgressPoint = {
  stream: string;
  total: number;
  completed: number;
};

type Progress = {
  [keys: string]: IStream;
};

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private semesterCount: number = 1;

  // private semesterList1: ISemester[] = [
  //   {title: "Semester 1", courses: [{ title: 'CSIS 1175' },]}
  // ]

  private semesterList = new BehaviorSubject<ISemester[]>([
    // {id: 0, title: "Semester 1", courses: [{ title: 'CSIS 1175' }]}
  ]);

  // private progresses = {
  //   security: { name: Stream.SECURITY, totalCredit: 80, completedCredit: 0 },
  //   database: { name: Stream.DATA, totalCredit: 80, completedCredit: 0 },
  //   tech: {
  //     name: Stream.TECH,
  //     totalCredit: 80,
  //     completedCredit: 0,
  //   },
  // };

  // private progess: Progress = {
  //   security: { name: Stream.SECURITY, totalCredit: 80, completedCredit: 0 },
  //   database: { name: Stream.DATA, totalCredit: 80, completedCredit: 0 },
  //   tech: {
  //     name: Stream.TECH,
  //     totalCredit: 80,
  //     completedCredit: 0,
  //   },
  // };

  // private progress?: BehaviorSubject<Progress>;
  private progressPoint = new BehaviorSubject<ProgressPoint>({
    stream: Stream.TECH,
    total: 100,
    completed: 0,
  });

  // =
  //   new BehaviorSubject<ProgressPoint>({
  //     stream: Stream.TECH,
  //     total: 100,
  //     completed: 0,
  //   }).pipe(
  //     // accumulate the progress
  //     scan((acc: Progress, val: ProgressPoint) => {
  //       acc[val.stream].totalCredit += val.total;
  //       acc[val.stream].completedCredit += val.completed;
  //       return acc;
  //     })
  //   );

  private program: IProgram = PROGRAM;

  private availableCourses = new BehaviorSubject<ICourse[]>([]);
  private setOfCourses = new BehaviorSubject<ICourse[]>([]);
  // .pipe(
  //   scan((acc: ICourse[], val: ICourse[]) => {
  //     acc.push(
  //       ...val.filter((v) => acc.every((a) => a.course_code !== v.course_code))
  //     );
  //     return acc;
  //   })
  // );

  private coursePrerequisite: CoursePrerequisite[] = COURSE_PREREQUISITES;

  constructor() {
    this.setOfCourses
      .pipe(
        scan((acc: ICourse[], val: ICourse[]) => {
          if (val.length > 0) {
            acc.push(
              ...val.filter((v) =>
                acc.every((a) => a.course_code !== v.course_code)
              )
            );
          } else {
            acc = [];
          }
          return acc;
        })
      )
      .subscribe((c) => this.availableCourses.next(c));
    this.semesterList.subscribe(() => this.computeAvailableCourses());
  }

  getAvailableCourses(): Observable<ICourse[]> {
    return this.availableCourses.asObservable();
  }

  getProgramProgress(): Observable<Progress> {
    return this.progressPoint.pipe(
      // accumulate the progress
      scan((acc: Progress, val: ProgressPoint) => {
        acc[val.stream].totalCredit += val.total;
        acc[val.stream].completedCredit += val.completed;
        return acc;
      })
      // tap((c) => console.log(c))
    );
  }

  getTodoCourses(): Observable<ICourse[]> {
    const todoCourses = of([]);
    return todoCourses;
  }

  getDoneCourses(): Observable<ICourse[]> {
    const doneCourses = of([]);
    return doneCourses;
  }

  getSemesters(): Observable<ISemester[]> {
    return this.semesterList;
  }

  deleteSemester(semester: ISemester): void {
    this.semesterList.next(
      this.semesterList.value.filter((s) => s.id !== semester.id)
    );
  }

  addSemester(): void {
    this.semesterCount++;
    this.semesterList.next([
      ...this.semesterList.getValue(),
      {
        id: this.semesterCount,
        title: 'Semester ' + (this.semesterList.getValue().length + 1),
        courses: [],
      },
    ]);
  }

  addCourseToSemester(course: ICourse, semester: ISemester): void {
    console.log('Added course ', course, 'to semester ', semester);
  }

  removeCourseFromSemester(course: ICourse, semester: ISemester): void {
    // if (semester.courses.length === 0 && )
    console.log('Remove course ', course, 'to semester ', semester);
  }

  private updateAvailableCourses() {
    const values: ISemester[] = this.semesterList.getValue();
    const tookCourse = values
      .slice(0, values.length - 1)
      .flatMap((sem) => sem.courses);

    // get all available courses base on took courses
    const allAvailableCourse = this.coursePrerequisite
      .filter(
        (reqCourse) =>
          reqCourse.prerequisites?.length === 0 ||
          reqCourse.prerequisites?.some((set) =>
            set.every((courseId) =>
              tookCourse.find((took) => took.courseId === courseId)
            )
          )
      )
      .map(
        (result) =>
          <ICourse>{
            courseId: result.courseId,
            title: result.title,
            credit: result.credit,
          }
      );
    // then filter with current took course and current working semester
    const workingSemester = values[values.length - 1]?.courses;
    this.availableCourses.next(
      allAvailableCourse.filter(
        (c) =>
          !tookCourse.find((t) => t.courseId === c.courseId) &&
          !workingSemester?.find((w) => w.courseId === c.courseId)
      )
    );
  }

  private computeAvailableCourses(): void {
    this.setOfCourses.next([]);

    const values: ISemester[] = this.semesterList.getValue();
    // values[length] is the current working semester
    const tookCourses = values
      .slice(0, values.length - 1)
      .flatMap((sem) => sem.courses);

    // compute the available courses and create progress value for each program
    this.program.first_year.forEach((roadUnit) => {
      // road unit is an option
      if (roadUnit instanceof Array) {
        let roadUnitCompletedCourses: number = 0;
        let roadUnitTotalCourses: number = 0;
        let roadUnitCompletedPercent: number = 0;
        roadUnit.forEach((path) => {
          // path includes a number of courses
          if (path instanceof Array) {
            const doneCourses: ICourse[] = this.sastifiedPrerequisites(
              tookCourses,
              path
            );
            if (doneCourses.length > 0) {
              this.setOfCourses.next(doneCourses);
              // compare and get the highest percentage of complete courses on path
              if (roadUnitCompletedPercent < doneCourses.length / path.length) {
                roadUnitCompletedPercent = doneCourses.length / path.length;
                roadUnitCompletedCourses = doneCourses.length;
                roadUnitTotalCourses = path.length;
              }
            }
          }
          // path is just 1 course
          else {
            const doneCourses: ICourse[] = this.sastifiedPrerequisites(
              tookCourses,
              path
            );
            if (doneCourses.length > 0) {
              this.setOfCourses.next(doneCourses);
              this.progressPoint.next({
                stream: Stream.TECH,
                total: 1,
                completed: 1,
              });
            }
          }
        });

        // after calculate the percentage and the number of completed courses on each road unit
        if (roadUnitCompletedCourses > 0) {
          this.progressPoint.next({
            stream: Stream.TECH,
            total: roadUnitTotalCourses,
            completed: roadUnitCompletedCourses,
          });
        }
      }
      // road unit is a course
      else {
        const doneCourses: ICourse[] = this.sastifiedPrerequisites(
          tookCourses,
          roadUnit
        );
        if (doneCourses.length > 0) {
          this.setOfCourses.next(doneCourses);
          this.progressPoint.next({
            stream: Stream.TECH,
            total: 1,
            completed: 1,
          });
        }
      }
    });

    // then filter with current took course and current working semester
    const workingSemester = values[values.length - 1]?.courses;
    this.availableCourses.next(
      this.availableCourses.value.filter(
        (c) =>
          !tookCourses.find((t) => t.course_code === c.course_code) &&
          !workingSemester?.find((w) => w.course_code === c.course_code)
      )
    );
  }

  private sastifiedPrerequisites(
    tookCourses: ICourse[],
    unit: ICourse | ICourse[]
  ): ICourse[] {
    if (unit instanceof Array) {
      return unit.reduce((acc: ICourse[], val): ICourse[] => {
        const sastified =
          val.prerequisites.some(
            (reqSet) =>
              reqSet.length === 0 ||
              reqSet.every((code) =>
                tookCourses.find((took) => took.course_code === code)
              )
          ) || val.prerequisites.some((e) => e.includes('PBDCIS'));
        if (sastified) {
          acc.push(val);
        }
        return acc;
      }, []);
    } else {
      const sastified =
        unit.prerequisites.some(
          (reqSet) =>
            reqSet.length === 0 ||
            reqSet.every((code) =>
              tookCourses.find((took) => took.course_code === code)
            )
        ) || unit.prerequisites.some((e) => e.includes('PBDCIS'));
      if (sastified) {
        return [unit];
      }
    }
    return [];
  }
}
