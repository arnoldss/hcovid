import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormValidators } from '../shared/form-validators';
import { ActivatedRoute, Router } from '@angular/router';
import { take, map } from 'rxjs/operators';
import { ThrowStmt } from '@angular/compiler';
import { Citizen } from '../shared/models/citizen.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  cityFilter = new FormControl();
  nameFilter = new FormControl();
  globalFilter = '';
  selected :number;

  displayedColumns: string[] = [ 'nombre', 'curp', 'estatus'];
  dataSource;
  citizens:Array<Citizen> = [{
    firstname: '',
    maternalLastName: '',
    curp: '',
    accepted: 1
  }]

  filterEmployee: Citizen = { };

  editEmployee: any;
  form: FormGroup;
  employeeFormGroup: FormGroup;
  skillForm: FormGroup;
  projectForm: FormGroup;
  countries: any;
  workLocations: any;
  formSocialWorker: FormGroup;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.initFormGroups();
  }

  private initFormGroups() {
     this.formSocialWorker = this.fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required]
    });


 
  }

  //// stuff for filtering

  customFilterPredicate() {
    const myFilterPredicate = (data: any, filter: string): boolean => {
      var globalMatch = !this.globalFilter;

      if (this.globalFilter) {
        // search all text fields
        globalMatch = data.name.toString().trim().toLowerCase().indexOf(this.globalFilter.toLowerCase()) !== -1;
      }

      if (!globalMatch) {
        return;
      }

      let searchString = JSON.parse(filter);
      return data.livingCity.toString().trim().indexOf(searchString.livingCity) !== -1 &&
        data.name.toString().trim().toLowerCase().indexOf(searchString.name.toLowerCase()) !== -1;
    }
    return myFilterPredicate;
  }

  applyFilter(filter) {
    this.globalFilter = filter;
    console.log(this.filterEmployee);
    this.dataSource.filter = JSON.stringify(this.filterEmployee);
  }



/////// stuff for adding 

  registerSocialWorker() {
    const email = this.employeeFormGroup.get('email').value;
    const password = this.form.get('pwdData').get('password').value;
    const employee: any = this.employeeFormGroup.value;
  }

/////// stuff for edit

selectEmployee(employee) {
  this.editEmployee = employee;
  this.skillForm.reset();
  this.projectForm.reset();
}




onEmployeeDelete(employee: any) {

}

onProjectDelete(index: number) {
  const projects = [...this.editEmployee.projects];
  projects.splice(index, 1);
  this.editEmployee.projects = projects;
  this._updateCiudadano();
}

onProjectSubmit() {
  // const newProject: Project = this.projectForm.value;
  // const projects = [...this.editEmployee.projects];
  // projects.push(newProject);
  // this.editEmployee.projects = projects;
  // this._updateEmployee();
}

onSkillDelete(index: number) {
  const skills = [...this.editEmployee.skills];
  skills.splice(index, 1);
  this.editEmployee.skills = skills;
  this._updateCiudadano();
}

private _updateCiudadano() {
  // this.admin.updateCiudadano(this.editEmployee.docId, this.editEmployee)
  //   .then(success => { }, error => console.error(error));
}

}
