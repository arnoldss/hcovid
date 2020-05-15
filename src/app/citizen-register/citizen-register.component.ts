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

@Component({
  selector: 'app-citizen-register',
  templateUrl: 'citizen-register.component.html',
  styleUrls: ['citizen-register.component.scss'],
})
export class CitizenRegisterComponent implements OnInit {
  editMode: boolean = false;
  form: FormGroup;
  govSupportOptions = [
    { value: 'jvn-futuro', label: 'Jóvenes por un Futuro' },
    { value: 'adt-mayores', label: 'Adultos Mayores' },
  ];
  states: State[] = [];

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {}

  private _initForm() {
    this.form = this.fb.group(
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

  private _emptyGovSupportArray() {
    this.getGovSupportArray().controls.forEach((control) =>
      this.getGovSupportArray().removeAt(0)
    );
  }

  ngOnInit() {
    this._initForm();
    this.route.params.subscribe((params) => {
      const citizenId = params.citizenId;
      if (!isNullOrUndefined(citizenId)) {
        this.editMode = true;
        console.log('Im editing!');
        // GET request to retrieve citizen data
        // patch forms value with citizen data once retrieved
      }
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
    if (this.editMode) {
      // PUT to update citizen
    } else {
      // POST to create new citizen
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
