import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormValidators } from '../shared/form-validators';
import { ActivatedRoute, Router } from '@angular/router';
import { take, map } from 'rxjs/operators';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  cityFilter = new FormControl();
  nameFilter = new FormControl();
  globalFilter = '';
  selected :number;

  displayedColumns: string[] = [ 'name', 'city', 'country'];
  dataSource;
  employees:Array<any> = [{
    docId: '',
    email: '',
    idEmployee: '',
    livingCity: '',
    livingCountry: '',
    mainRole: '',
    name: '',
    projects: [],
    lastStudy: {
      countryCode: '',
      institutionName: '',
      studyName: '',
      completionDate: ''
    },
    skills: [],
    employeeUid: '',
    workLocation: '',
    authorUid: ''
  }]
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  filterEmployee: any = {
    email: '',
    docId: '',
    idEmployee: '',
    livingCity: '',
    livingCountry: '',
    mainRole: '',
    name: '',
    projects: [],
    lastStudy: {
      countryCode: '',
      institutionName: '',
      studyName: '',
      completionDate: ''
    },
    skills: [],
    employeeUid: '',
    workLocation: '',
    authorUid: ''
  };

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
    this.countries = this.route.snapshot.data.countries;
    this.workLocations = this.route.snapshot.data.workLocations;


    this.cityFilter.valueChanges.subscribe((positionFilterValue) => {
      this.filterEmployee['livingCity'] = positionFilterValue;
      this.dataSource.filter = JSON.stringify(this.filterEmployee);
    });

    this.nameFilter.valueChanges.subscribe((nameFilterValue) => {
      this.filterEmployee['name'] = nameFilterValue;
      this.dataSource.filter = JSON.stringify(this.filterEmployee);
    });
  }

  change(tab) {
    console.log(tab);
  }

  private initFormGroups() {
    this.form = this.fb.group({
      employee: this.fb.group({
        idEmployee: [null, [Validators.required]],
        email: [null, [Validators.required, Validators.email]],
        livingCity: [null, [Validators.required]],
        livingCountry: [null, [Validators.required]],
        mainRole: [null, [Validators.required]],
        name: [null, [Validators.required]],
        workLocation: [null, [Validators.required]],
      }),
      pwdData: this.fb.group({
        password: [null, [Validators.required, Validators.minLength(6)]],
        pwdConfirm: [null, [Validators.required]]
      }, { validators: [FormValidators.confirmPassword] })
    });

    this.formSocialWorker = this.fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required]
    });


    this.employeeFormGroup = this.form.get('employee') as FormGroup;
    this.employeeFormGroup.get('livingCountry').valueChanges.subscribe(
      (value: string) => this.employeeFormGroup.get('workLocation').reset()
    );
    this.skillForm = this.fb.group({
      name: [null, Validators.required],
      area: [null, Validators.required]
    });
    this.projectForm = this.fb.group({
      customer: [null, Validators.required],
      initialDate: [null, Validators.required],
      completionDate: [null, Validators.required],
      role: [null, Validators.required]
    });
  }

  onAddSkill() {
  //  // const newSkill: Skill = this.skillForm.value;
  //   const skills = [...this.editEmployee.skills];
  //   skills.push(newSkill);
  //   this.editEmployee.skills = skills;
  //   this._updateEmployee();
  }

  onEmployeeDelete(employee: any) {

  }

  onProjectDelete(index: number) {
    const projects = [...this.editEmployee.projects];
    projects.splice(index, 1);
    this.editEmployee.projects = projects;
    this._updateEmployee();
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
    this._updateEmployee();
  }

  private _updateEmployee() {

  }

   getWorkLocations(countryCode: string): any[] {
      return [];
   }

  onSubmit() {
    const email = this.employeeFormGroup.get('email').value;
    const password = this.form.get('pwdData').get('password').value;
    const employee: any = this.employeeFormGroup.value;
  }

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

  selectEmployee(employee) {
    this.editEmployee = employee;
    this.skillForm.reset();
    this.projectForm.reset();
  }


  registerSocialWorker() {

  }
}
