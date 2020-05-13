import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { Citizen } from '../shared/models/citizen.model';

@Component({
  selector: 'app-citizen-register',
  templateUrl: 'citizen-register.component.html',
  styleUrls: ['citizen-register.component.scss'],
})
export class CitizenRegisterComponent implements OnInit, OnDestroy {
  form: FormGroup;
  govSupportOptions = [
    { value: 'jvn-futuro', label: 'Jóvenes por un Futuro' },
    { value: 'adt-mayores', label: 'Adultos Mayores' },
  ];
  states = [
    {
      id: 1,
      name: 'Aguascalientes',
    },
    {
      id: 2,
      name: 'Baja California',
    },
    {
      id: 3,
      name: 'Baja California Sur',
    },
    {
      id: 4,
      name: 'Campeche',
    },
    {
      id: 5,
      name: 'Coahuila',
    },
    {
      id: 6,
      name: 'Colima',
    },
    {
      id: 7,
      name: 'Chiapas',
    },
    {
      id: 8,
      name: 'Chihuahua',
    },
    {
      id: 9,
      name: 'Distrito Federal',
    },
    {
      id: 10,
      name: 'Durango',
    },
    {
      id: 11,
      name: 'Guanajuato',
    },
    {
      id: 12,
      name: 'Guerrero',
    },
    {
      id: 13,
      name: 'Hidalgo',
    },
    {
      id: 14,
      name: 'Jalisco',
    },
    {
      id: 15,
      name: 'México',
    },
    {
      id: 16,
      name: 'Michoacán',
    },
    {
      id: 17,
      name: 'Morelos',
    },
    {
      id: 18,
      name: 'Nayarit',
    },
    {
      id: 19,
      name: 'Nuevo León',
    },
    {
      id: 20,
      name: 'Oaxaca',
    },
    {
      id: 21,
      name: 'Puebla',
    },
    {
      id: 22,
      name: 'Querétaro',
    },
    {
      id: 23,
      name: 'Quintana Roo',
    },
    {
      id: 24,
      name: 'San Luis Potosí',
    },
    {
      id: 25,
      name: 'Sinaloa',
    },
    {
      id: 26,
      name: 'Sonora',
    },
    {
      id: 27,
      name: 'Tabasco',
    },
    {
      id: 28,
      name: 'Tamaulipas',
    },
    {
      id: 29,
      name: 'Tlaxcala',
    },
    {
      id: 30,
      name: 'Veracruz',
    },
    {
      id: 31,
      name: 'Yucatán',
    },
    {
      id: 32,
      name: 'Zacatecas',
    },
  ];

  constructor(private fb: FormBuilder) {}

  private _emptyGovSupportArray() {
    this.getGovSupportArray().controls.forEach((control) =>
      this.getGovSupportArray().removeAt(0)
    );
  }

  ngOnInit() {
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
        maternalLastName: [null, Validators.required],
        lastPaycheckQty: [null],
        paternalLastName: [null, Validators.required],
      },
      { validators: [this.requiredPaycheckQty] }
    );
  }

  ngOnDestroy() {
    this.form.reset();
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
      maternalLastName: value.maternalLastName,
      lastPaycheckQty: value.lastPaycheckQty,
      paternalLastName: value.paternalLastName,
    };
    console.log(citizen);
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
