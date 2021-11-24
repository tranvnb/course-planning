import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { map, reduce, tap, merge, mergeMap } from 'rxjs/operators';
import { ICourse } from '../interfaces/ICourse';
import { ISemester } from '../interfaces/ISemester';
import { CoursePrerequisite } from '../interfaces/CoursePrerequisites';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { COURSE_PREREQUISITES, PROGRAM } from './program-courses';
import { IProgram } from '../interfaces/IProgram';
import { StreamEnum } from '../interfaces/IStream';
import { IProgress, IProgressPoint } from '../interfaces/IProgress';

// type FinishPoint = { point: number; completed: number };

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private semesterCount: number = 1;

  private semesterList = new BehaviorSubject<ISemester[]>([]);

  private progress = new BehaviorSubject<IProgress>({});
  private progressPoint = new BehaviorSubject<IProgressPoint>({
    stream: StreamEnum.TECH,
    total: 0,
    completed: 0,
  });

  private program: IProgram = PROGRAM;

  private availableCourses = new BehaviorSubject<ICourse[]>([]);
  private setOfCourses = new BehaviorSubject<ICourse[]>([]);

  private coursePrerequisite: CoursePrerequisite[] = COURSE_PREREQUISITES;

  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {
    this.semesterList.subscribe(() => {
      this.computeAvailableCourses();
      this.computeRoadMapPercentage();
    });
  }

  fetchAllData(): Observable<any> {
    return this.http
      .get<any>(environment.API_URL + '/programs?code=PBDCIS')
      .pipe(map((json) => (this.program = json.data)));
  }

  private resetAvailableCoursesList(): void {
    this.setOfCourses = new BehaviorSubject<ICourse[]>([]);
    this.setOfCourses
      .pipe(
        reduce(
          (acc: ICourse[], val: ICourse[]) =>
            this.aggregateAndMergeCourse(acc, val),
          []
        )
      )
      .subscribe((c) => this.availableCourses.next(c));
  }

  private aggregateAndMergeCourse(acc: ICourse[], val: ICourse[]): ICourse[] {
    // beauty of stream and events
    const tempArr: ICourse[] = [];

    from(val)
      .pipe(
        map((v) => {
          // const foundCourse = acc.find((a) => a.course_code === v.course_code);
          const foundIndex = acc.findIndex(
            (a) => a.course_code === v.course_code
          );

          // only merge streams if duplicated course and has new stream
          if (foundIndex !== -1) {
            // check the stream in order to merge
            const newStreams = v.streams?.filter(
              (mstr) => !acc[foundIndex].streams?.includes(mstr)
            );

            if (newStreams === undefined || newStreams?.length <= 0) {
              return undefined;
            } else {
              acc[foundIndex].streams?.push(...newStreams);
              return undefined;
            }
          } else {
            return v;
          }
        })
      )
      .subscribe((v) => {
        if (v !== undefined) {
          tempArr.push(v);
        }
      });

    acc.push(...tempArr);

    return acc;
  }

  private resetRoadMapPercentage(): void {
    this.progressPoint = new BehaviorSubject<IProgressPoint>({
      stream: StreamEnum.TECH,
      total: 0,
      completed: 0,
    });

    this.progressPoint
      .pipe(
        // accumulate the progress
        reduce((acc: IProgress, val: IProgressPoint) => {
          if (acc[val.stream] === undefined) {
            acc[val.stream] = {
              name: val.stream,
              totalCredit: 0,
              completedCredit: 0,
            };
          }
          acc[val.stream].totalCredit += val.total;
          acc[val.stream].completedCredit += val.completed;
          return acc;
        }, {}),
        tap((c: IProgress) => console.table(c))
      )
      .subscribe((p) => this.progress.next(p));
  }

  getAvailableCourses(): Observable<ICourse[]> {
    return this.availableCourses.asObservable();
  }

  getProgramProgress(): Observable<IProgress> {
    return this.progress.asObservable();
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

  private computeAvailableCourses(): void {
    // this.setOfCourses.next([]);
    this.resetAvailableCoursesList();

    const values: ISemester[] = this.semesterList.getValue();
    // values[length] is the current working semester
    const tookCourses = values
      .slice(0, values.length - 1)
      .flatMap((sem) => sem.courses);

    // compute the available courses and create progress value for each program
    this.program.first_year.forEach((roadUnit) =>
      this.processRoadMapUnit(tookCourses, roadUnit, [
        StreamEnum.TECH,
        StreamEnum.DATA,
        StreamEnum.SECURITY,
      ])
    );

    this.program.second_year[StreamEnum.TECH].forEach((roadUnit) =>
      this.processRoadMapUnit(tookCourses, roadUnit, [StreamEnum.TECH])
    );

    this.program.second_year[StreamEnum.DATA].forEach((roadUnit) =>
      this.processRoadMapUnit(tookCourses, roadUnit, [StreamEnum.DATA])
    );

    this.program.second_year[StreamEnum.SECURITY].forEach((roadUnit) =>
      this.processRoadMapUnit(tookCourses, roadUnit, [StreamEnum.SECURITY])
    );

    this.setOfCourses.complete();

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

  private processRoadMapUnit(
    tookCourses: ICourse[],
    roadUnit: ICourse | ICourse[] | ICourse[][],
    streams: StreamEnum[]
  ): void {
    // road unit is an option
    if (roadUnit instanceof Array) {
      // let roadUnitCompletedCourses: number = 0;
      // let roadUnitTotalCourses: number = 0;
      // let roadUnitCompletedPercent: number = 0;
      roadUnit.forEach((path) => {
        // path includes a number of courses
        if (path instanceof Array) {
          const doneCourses: ICourse[] = this.findSastifiedPrerequisitesCourses(
            tookCourses,
            path,
            streams
          );
          if (doneCourses.length > 0) {
            this.setOfCourses.next(doneCourses);
            // compare and get the highest percentage of complete courses on path
            // if (roadUnitCompletedPercent < doneCourses.length / path.length) {
            //   roadUnitCompletedPercent = doneCourses.length / path.length;
            //   roadUnitCompletedCourses = doneCourses.length;
            //   roadUnitTotalCourses = path.length;
            // }
          }
        }
        // path is just 1 course
        else {
          const doneCourses: ICourse[] = this.findSastifiedPrerequisitesCourses(
            tookCourses,
            path,
            streams
          );
          if (doneCourses.length > 0) {
            this.setOfCourses.next(doneCourses);
          }
        }
      });

    }
    // road unit is a course
    else {
      const doneCourses: ICourse[] = this.findSastifiedPrerequisitesCourses(
        tookCourses,
        roadUnit,
        streams
      );
      if (doneCourses.length > 0) {
        this.setOfCourses.next(doneCourses);
      }
    }
  }

  private computeRoadMapPercentage(): void {
    this.resetRoadMapPercentage();

    const values: ISemester[] = this.semesterList.getValue();
    // values[length] is the current working semester
    const tookCourses = values
      .slice(0, values.length - 1)
      .flatMap((sem) => sem.courses);

    // compute the available courses and create progress value for each program
    this.program.first_year.forEach((roadUnit) =>
      this.processRoadMapPercentage(StreamEnum.TECH, tookCourses, roadUnit)
    );

    this.program.first_year.forEach((roadUnit) =>
      this.processRoadMapPercentage(StreamEnum.DATA, tookCourses, roadUnit)
    );

    this.program.first_year.forEach((roadUnit) =>
      this.processRoadMapPercentage(StreamEnum.SECURITY, tookCourses, roadUnit)
    );

    this.program.second_year[StreamEnum.TECH].forEach((roadUnit) =>
      this.processRoadMapPercentage(StreamEnum.TECH, tookCourses, roadUnit)
    );

    this.program.second_year[StreamEnum.DATA].forEach((roadUnit) =>
      this.processRoadMapPercentage(StreamEnum.DATA, tookCourses, roadUnit)
    );

    this.program.second_year[StreamEnum.SECURITY].forEach((roadUnit) =>
      this.processRoadMapPercentage(StreamEnum.SECURITY, tookCourses, roadUnit)
    );

    this.progressPoint.complete();
  }

  private processRoadMapPercentage(
    stream: StreamEnum,
    tookCourses: ICourse[],
    roadUnit: ICourse | ICourse[] | ICourse[][]
  ) {
    // road unit is an option
    if (roadUnit instanceof Array) {
      let roadUnitCompletedCourses: number = 0;
      let roadUnitTotalCourses: number = 0;
      let roadUnitCompletedPercent: number = 0;
      roadUnit.forEach((path) => {
        // path includes a number of courses
        if (path instanceof Array) {
          const doneCourses = path.filter((p) =>
            tookCourses.some((t) => t.course_code === p.course_code)
          );
          if (doneCourses.length > 0) {
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
          roadUnitTotalCourses = 1;
          // this.findPointOfRoadUnit(stream, tookCourses, path);
          if (tookCourses.some((c) => c.course_code === path.course_code)) {
            //never use else case because I want to take the biggest percentage. so 1 is the one
            roadUnitCompletedCourses = 1;
          }
        }
      });
      // after calculate the percentage and the number of completed courses on each road unit
      this.progressPoint.next({
        stream: stream,
        total: roadUnitTotalCourses,
        completed: roadUnitCompletedCourses,
      });
    }
    // road unit is a course
    else {
      this.findPointOfRoadUnit(stream, tookCourses, roadUnit);
    }
  }

  private findPointOfRoadUnit(
    stream: StreamEnum,
    tookCourses: ICourse[],
    unit: ICourse
  ) {
    const point = {
      stream: stream,
      total: 1,
      completed: 1,
    };
    if (tookCourses.some((c) => c.course_code === unit.course_code)) {
      point.completed = 1;
    } else {
      point.completed = 0;
    }
    this.progressPoint.next(point);
  }

  private findSastifiedPrerequisitesCourses(
    tookCourses: ICourse[],
    unit: ICourse | ICourse[],
    streams: StreamEnum[]
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
          val.streams = streams;
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
        unit.streams = streams;
        return [unit];
      }
    }
    return [];
  }
}
