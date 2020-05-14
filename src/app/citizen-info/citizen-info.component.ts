import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatRadioChange } from '@angular/material/radio';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Citizen } from '../shared/models/citizen.model';
import { GovernmentSupport } from '../shared/models/gov-support.model';
import { State } from '../shared/models/state.model';
import { CitizenInfoService } from './citizen-info.service';

@Component({
  selector: 'citizen-info',
  templateUrl: './citizen-info.component.html',
  styleUrls: ['./citizen-info.component.scss'],
})
export class CitizenInfoComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  curpFilter = new FormControl();
  nameFilter = new FormControl();
  globalFilter = '';
  selected: number;

  displayedColumns: string[] = ['nombre', 'apellido', 'curp', 'estatus', 'accept'];
  dataSource;
  citizens: Array<Citizen> = [
    {
      firstname: 'Arnoldo',
      paternalLastname: 'Bazaldua',
      maternalLastname: 'Cerda',
      birthDate: new Date('01-07-1991'),
      dependantQty: 3,

      curp: 'BAXA432536',
      accepted: 1,
      hasJob: true,
      lastPaycheckQty: 4000,
      birthStateId: 3,
      isSingle: true,
      hasOtherSupport: true,
      govSupport: [
        {
          supportId: 'jvn-futuro',
          otherSupportName: 'cool',
        },
        {
          supportId: 'other',
          otherSupportName: 'ayuda diaria',
        },
      ],
    },
    {
      firstname: 'Bruno',
      maternalLastname: 'Hiram',
      curp: 'BR1N7327849',
      accepted: 1,
    },
    {
      firstname: 'Bruno',
      maternalLastname: 'Hiram',
      curp: 'BR1N7327849',
      accepted: 1,
    },
    {
      firstname: 'Jose Luis',
      maternalLastname: 'Apellido1',
      curp: 'JASO432536',
      accepted: 1,
    },
  ];

  filterCitizen: Citizen = {
    firstname: '',
    curp: '',
  };

  editEmployee: any;
  formSocialWorker: FormGroup;

  //edit stuff variables

  states: State[] = [];

  govSupportOptions = [
    { value: 'jvn-futuro', label: 'Jóvenes por un Futuro' },
    { value: 'adt-mayores', label: 'Adultos Mayores' },
  ];
  formEdit: FormGroup;
  editCitizen: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private citizenInfoService: CitizenInfoService
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => (this.states = data.states));
    this.initFormGroups();

    //REQUEST TO RECEIVE CITIZENES!!!

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
      password: [null, Validators.required],
      isAdmin: [null, Validators.required],
    });

    this.formEdit = this.fb.group(
      {
        birthDate: [null, Validators.required],
        birthStateId: [null, Validators.required],
        dependantQty: [null, Validators.required],
        firstname: [null, Validators.required],
        govSupport: this.fb.array([]),
        hasJob: [null, Validators.required],
        hasOtherSupport: [null, Validators.required],
        isSingle: [null, Validators.required],
        maternalLastname: [null, Validators.required],
        lastPaycheckQty: [null],
        paternalLastname: [null, Validators.required],
      },
      { validators: [this.requiredPaycheckQty] }
    );
  }

  //// stuff for filtering

  customFilterPredicate() {
    const myFilterPredicate = (data: any, filter: string): boolean => {
      var globalMatch = !this.globalFilter;

      if (this.globalFilter) {
        // search all text fields
        globalMatch =
          data.firstname
            .toString()
            .trim()
            .toLowerCase()
            .indexOf(this.globalFilter.toLowerCase()) !== -1;
      }

      if (!globalMatch) {
        return;
      }

      let searchString = JSON.parse(filter);
      return (
        data.curp.toString().trim().indexOf(searchString.curp) !== -1 &&
        data.firstname
          .toString()
          .trim()
          .toLowerCase()
          .indexOf(searchString.firstname.toLowerCase()) !== -1
      );
    };
    return myFilterPredicate;
  }

  applyFilter(filter) {
    this.globalFilter = filter;
    console.log(this.filterCitizen);
    this.dataSource.filter = JSON.stringify(this.filterCitizen);
  }

  /////// stuff for adding

  registerSocialWorker() {
    const email = this.formSocialWorker.get('username').value;
    const password = this.formSocialWorker.get('password').value;
    let admin = this.formSocialWorker.get('isAdmin').value;
    if (admin === null) {
      admin = '';
    }

    this.citizenInfoService.registerServiceWorker(email, password, admin).subscribe(
      (data) => {
        this.formSocialWorker.reset();
        alert('Usuario agregado');
      },
      (error) => {
        alert('A ocurrido un error');
      }
    );
  }

  /////// stuff for edit

  selectCitizen(citizen) {
    console.log(citizen);
    this.formEdit.reset();
    this.editCitizen = citizen;
    this.formEdit.get('firstname').setValue(citizen.firstname);
    this.formEdit.get('paternalLastname').setValue(citizen.paternalLastname);
    this.formEdit.get('maternalLastname').setValue(citizen.maternalLastname);
    this.formEdit.get('birthDate').setValue(citizen.birthDate);
    this.formEdit.get('birthStateId').setValue(citizen.birthStateId);
    this.formEdit.get('hasJob').setValue(citizen.hasJob + '');
    if (citizen.hasJob)
      this.formEdit.get('lastPaycheckQty').setValue(citizen.lastPaycheckQty);
    this.formEdit.get('dependantQty').setValue(citizen.dependantQty);
    this.formEdit.get('isSingle').setValue(citizen.isSingle + '');
    this.formEdit.get('hasOtherSupport').setValue(citizen.hasOtherSupport + '');
    if (citizen.hasOtherSupport) {
      citizen.govSupport.forEach((v: GovernmentSupport) => {
        const form = this.fb.group(
          {
            supportType: v.supportId,
            otherSupportName: v.otherSupportName,
          },
          { validators: [this.requiredOtherSupportName] }
        );
        this.getGovSupportArray().push(form);
      });
    }
    //this.formEdit.get('supportType').setValue(citizen.supportType);
    //this.formEdit.get('birthStateId').setValue(citizen.birthStateId);

    //this.formEdit.get('firstname').setValue(citizen.firstname);
  }

  requiredPaycheckQty(form: FormGroup): ValidationErrors {
    const hasJob = form.get('hasJob').value === 'true';
    const lastPaycheckQty = form.get('lastPaycheckQty').value;
    if (hasJob) {
      const isNullOrEmpty = lastPaycheckQty == null || lastPaycheckQty === '';
      return isNullOrEmpty ? { requiredPaycheckQty: true } : null;
    } else {
      return null;
    }
  }

  onSubmitEdit() {
    const value = this.formEdit.value;
    const citizen: Citizen = {
      birthDate: value.birthDate,
      birthStateId: value.birthStateId,
      dependantQty: value.dependantQty,
      firstname: value.firstname,
      govSupport: value.govSupport,
      hasJob: value.hasJob === 'true',
      hasOtherSupport: value.hasOtherSupport === 'true',
      isSingle: value.isSingle === 'true',
      maternalLastname: value.maternalLastname,
      lastPaycheckQty: value.lastPaycheckQty,
      paternalLastname: value.paternalLastname,
    };
    console.log(citizen);

    //REQUEST TO SET CITIZEN
  }

  private _updateCiudadano() {
    // this.admin.updateCiudadano(this.editEmployee.docId, this.editEmployee)
    //   .then(success => { }, error => console.error(error));
  }

  pushGovSupportForm() {
    const form = this.fb.group(
      {
        supportType: [null, Validators.required],
        otherSupportName: [null],
      },
      { validators: [this.requiredOtherSupportName] }
    );
    this.getGovSupportArray().push(form);
  }

  getGovSupportArray(): FormArray {
    return this.formEdit.get('govSupport') as FormArray;
  }

  requiredOtherSupportName(form: FormGroup): ValidationErrors {
    const isOtherSupport = form.get('supportType').value === 'other';
    const otherSupportName = form.get('otherSupportName').value;
    if (isOtherSupport) {
      const isNullOrEmpty = otherSupportName == null || otherSupportName === '';
      return isNullOrEmpty ? { requiredOtherSupportName: true } : null;
    } else {
      return null;
    }
  }

  onHasOtherSupportChange(event: MatRadioChange) {
    const hasOtherSupport = event.value === 'true';
    if (hasOtherSupport) {
      this.pushGovSupportForm();
    } else {
      this._emptyGovSupportArray();
    }
  }

  private _emptyGovSupportArray() {
    this.getGovSupportArray().controls.forEach((control) =>
      this.getGovSupportArray().removeAt(0)
    );
  }

  deleteSupport(index: number) {
    this.getGovSupportArray().removeAt(index);
    if (this.getGovSupportArray().length <= 0) {
      this.formEdit.get('hasOtherSupport').setValue('false');
    }
  }

  onCitizenAccept(element) {
    // REQUEST TO ACCEPT SUPPORT TO CITIZEN
  }
}
