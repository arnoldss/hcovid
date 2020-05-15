import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { Citizen } from '../shared/models/citizen.model';
import { State } from '../shared/models/state.model';
import { ActivatedRoute } from '@angular/router';
import { isNullOrUndefined } from '../shared/helper-functions';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { switchMap, tap, filter } from 'rxjs/operators';

@Component({
  selector: 'app-citizen-register',
  templateUrl: 'citizen-register.component.html',
  styleUrls: ['citizen-register.component.scss'],
})
export class CitizenRegisterComponent implements OnInit {
  editMode: boolean = false;
  editCitizenId: number;
  form: FormGroup;
  govSupportOptions = [
    { value: 'jvn-futuro', label: 'Jóvenes por un Futuro' },
    { value: 'adt-mayores', label: 'Adultos Mayores' },
  ];
  states: State[] = [];

  constructor(private fb: FormBuilder, private route: ActivatedRoute,
    private httpClientService: HttpClient,
    
    private http: HttpClient
    ) {}

  private _initForm() {
    this.form = this.fb.group(
      {
        curp: [null, Validators.required],
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

  private _emptyGovSupportArray() {
    this.getGovSupportArray().controls.forEach((control) =>
      this.getGovSupportArray().removeAt(0)
    );
  }

  ngOnInit() {
    this._initForm();
    this.route.params
      .pipe(
        filter((params) => !isNullOrUndefined(params.citizenId)),
        switchMap((params) => {
          const citizenId = params.citizenId;
          const url = environment.API_URL + '/personByCurp';
          return this.http.get(url, { params: { curp: citizenId } });
        })
      )
      .subscribe((response: any) => {
        const value = {
          birthDate: null,
          birthStateId: null,
          dependantQty: null,
          firstname: response.name,
          govSupport: [],
          hasJob: response.formalJob ? 'true' : 'false',
          hasOtherSupport: response.anotherGovernmentProgram ? 'true' : 'false',
          isSingle: response.single ? 'true' : 'false',
          maternalLastname: null,
          lastPaycheckQty: null,
          paternalLastname: null,
        };
        this.editMode = true;
        this.editCitizenId = response.id;
        this.form.setValue(value);
      });
    this.route.data.subscribe((data) => (this.states = data.states));
  }

  deleteSupport(index: number) {
    this.getGovSupportArray().removeAt(index);
    if (this.getGovSupportArray().length <= 0) {
      this.form.get('hasOtherSupport').setValue('false');
    }
  }

  getGovSupportArray(): FormArray {
    return this.form.get('govSupport') as FormArray;
  }

  onHasJobChange(event: MatRadioChange) {
    const hasJob = event.value === 'true';
    if (!hasJob) {
      this.form.get('lastPaycheckQty').reset();
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

  onSubmit() {
    const value = this.form.value;
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
    const url = environment.API_URL + '/person';
    if (this.editMode) {
      const day =
        citizen.birthDate.getDate() < 10
          ? `0${citizen.birthDate.getDate()}`
          : citizen.birthDate.getDate();
      const month =
        citizen.birthDate.getMonth() + 1 < 10
          ? `0${citizen.birthDate.getMonth() + 1}`
          : citizen.birthDate.getMonth() + 1;
      const year = citizen.birthDate.getFullYear();
      const dob = `${year}-${month}-${day}`;
      console.log(dob);
      const body = {
        id: this.editCitizenId,
        curp: 'hardcodedCURP',
        name: citizen.firstname,
        celularPhone: '0000000000',
        dob,
        formalJob: citizen.hasJob ? 'true' : 'false',
        lastPayCheckIncome: citizen.lastPaycheckQty,
        anotherGovernmentProgram: citizen.hasOtherSupport ? 'true' : 'false',
        single: citizen.isSingle ? 'true' : 'false',
        pension: 'false',
        pensionAmount: '0',
        accountNumber: '12',
        clabe: '12',
        tarjeta: '12',
        bank: 'test',
        userId: '1',
      };
      this.http.patch(url, body).subscribe(
        (response) => {
          console.log(response);
          this.editCitizenId = null;
          this.editMode = false;
        },
        (error) => console.error(error)
      );
    } else {
      

     let str =  new Date(value.birthDate) + ''.substring(0, 10);
    let urlPerson = environment.API_URL + '/person';
    this.httpClientService.post(urlPerson, 
    {
      //"id": "86",
      "curp": value.curp + '',
      "name": value.firstname + ' ' + value.maternalLastname + ' ',
       "celularPhone": "POC",   
      "dob": '01-01-1993',
      "formalJob": value.hasJob + '',
      "lastPayCheckIncome": value.lastPaycheckQty === null ? "0" : value.lastPaycheckQty + '',
      "anotherGovernmentProgram": value.hasOtherSupport + '',
      "single": value.isSingle + '',
      "pension": "true",
      "pensionAmount": "0",
      "accountNumber": "0",
      "clabe": "0",
      "tarjeta": "0",
      "bank": "test",
      "userId": sessionStorage.getItem('userID')
      }
      ).subscribe(
      (response) => {
        console.log(response)

      },
      (error) => {
        console.error(error);
      }
    );
      }
    



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
}
