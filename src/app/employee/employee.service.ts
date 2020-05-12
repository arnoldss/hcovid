
import { Injectable } from '@angular/core';
import { Employee } from './employee.model';
import { take, switchMap, map } from 'rxjs/operators';
import { isNullOrUndefined } from '../shared/helper-functions';
import { Project } from '../shared/models/project.model';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private _initEmployee(employeeDoc) {

  }

  constructor() { }

  getSchools() {

  }

  getSkills() {

  }

  getEmployeeByUid(employeeUid: string) {

  }

  getEmployees() {

  }

  createEmployee(employeeUid: string, employee: Employee) {

  }

  updateEmployeeByUid(uid: string, newEmployeeInfo: Employee) {

  }

  updateEmployeeByDocId(docId: string, newEmployeeInfo: Employee) {

  }

  deleteEmployee(docId: string) {

  }

  getLoggedUserEmployeeData() {

  }
}
