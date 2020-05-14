import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { State } from 'src/app/shared/models/state.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormValidators } from 'src/app/shared/form-validators';
import { Citizen } from 'src/app/shared/models/citizen.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-citizen-profile',
  templateUrl: 'citizen-profile.component.html',
  styleUrls: ['citizen-profile.component.scss'],
})
export class CitizenProfileComponent implements OnInit {
  approved: boolean = true;
  curp: string;
  form: FormGroup;
  states: State[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      citizenData: this.fb.group({
        firstname: [null, Validators.required],
        paternalLastname: [null, Validators.required],
        maternalLastname: [null, Validators.required],
        email: [null, [Validators.email]],
        phoneNumber: [
          null,
          [
            Validators.required,
            FormValidators.maxDigitLength(10),
            FormValidators.minDigitLength(10),
          ],
        ],
      }),
      addressData: this.fb.group({
        streetName: [null, Validators.required],
        streetExtNumber: [null, Validators.required],
        colony: [null, Validators.required],
        municipality: [null, Validators.required],
        stateId: [null, Validators.required],
        postalCode: [null, Validators.required],
        betweenStreet1: [null],
        betweenStreet2: [null],
        streetReference: [null],
      }),
    });
    this.route.params.subscribe((params) => (this.curp = params.curp));
    this.route.data.subscribe((data) => (this.states = data.states));
  }

  onRecommendedSubmit() {
    const value = this.form.value;
    const citizen: Citizen = {
      firstname: value.citizenData.firstname,
      paternalLastname: value.citizenData.paternalLastname,
      maternalLastname: value.citizenData.maternalLastname,
      email: value.citizenData.email,
      phoneNumber: value.citizenData.phoneNumber,
      address: {
        colony: value.addressData.colony,
        municipality: value.addressData.municipality,
        postalCode: value.addressData.postalCode,
        stateId: value.addressData.stateId,
        streetName: value.addressData.streetName,
        streetExtNumber: value.addressData.streetExtNumber,
        betweenStreet1: value.addressData.betweenStreet1,
        betweenStreet2: value.addressData.betweenStreet2,
        streetReference: value.addressData.streetReference,
      },
    };
    console.log(citizen);
    this.snackbar.open(
      'Gracias por recomendar a tu conocido. Nos pondremos en contacto con él/ella pronto',
      'Cerrar',
      { duration: 5000 }
    );
    this.form.reset();
  }
}
