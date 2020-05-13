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

  curpFilter = new FormControl();
  nameFilter = new FormControl();
  globalFilter = '';
  selected :number;

  displayedColumns: string[] = [ 'nombre', 'apellido', 'curp', 'estatus'];
  dataSource;
  citizens:Array<Citizen> = [{
    firstname: 'Arnoldo',
    maternalLastName: 'Bazaldua',
    curp: 'BAXA432536',
    accepted: 1
  },
  {
    firstname: 'Bruno',
    maternalLastName: 'Hiram',
    curp: 'BR1N7327849',
    accepted: 1
  },
  {
    firstname: 'Oscar',
    maternalLastName: 'Apellido1',
    curp: 'OSXA432536',
    accepted: 1
  }
,{
  firstname: 'Jose Luis',
  maternalLastName: 'Apellido1',
  curp: 'JASO432536',
  accepted: 1
}]

  filterCitizen: Citizen = { };

  editEmployee: any;
  formSocialWorker: FormGroup;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.initFormGroups();


  this.dataSource = new MatTableDataSource<Citizen>(this.citizens);
  this.dataSource.paginator = this.paginator;
  this.dataSource.filterPredicate = this.customFilterPredicate();




this.nameFilter.valueChanges.subscribe((nameFilterValue) => {
  this.filterCitizen['firstname'] = nameFilterValue;
  this.dataSource.filter = JSON.stringify(this.filterCitizen);
});

this.curpFilter.valueChanges.subscribe((curpFilterValue) => {
  this.filterCitizen['curp'] = curpFilterValue;
  this.dataSource.filter = JSON.stringify(this.filterCitizen);
});


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
        globalMatch = data.firstname.toString().trim().toLowerCase().indexOf(this.globalFilter.toLowerCase()) !== -1;
      }

      if (!globalMatch) {
        return;
      }

      let searchString = JSON.parse(filter);
      return data.curp.toString().trim().indexOf(searchString.curp) !== -1 &&
        data.firstname.toString().trim().toLowerCase().indexOf(searchString.firstname.toLowerCase()) !== -1;
    }
    return myFilterPredicate;
  }

  applyFilter(filter) {
    this.globalFilter = filter;
    this.dataSource.filter = JSON.stringify(this.filterCitizen);
  }



/////// stuff for adding 

  registerSocialWorker() {
    const email = this.formSocialWorker.get('email').value;
    const password = this.formSocialWorker.get('pwdData').get('password').value;
  }

/////// stuff for edit

selectEmployee(employee) {
  this.editEmployee = employee;
//  this.skillForm.reset();
//  this.projectForm.reset();
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
