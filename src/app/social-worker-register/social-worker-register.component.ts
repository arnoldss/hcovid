import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormValidators } from '../shared/form-validators';
import { SocialWorker } from '../shared/models/social-worker.model';

@Component({
  selector: 'app-social-worker-register',
  templateUrl: 'social-worker-register.component.html',
  styleUrls: ['social-worker-register.component.scss'],
})
export class SocialWorkerRegisterComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group(
      {
        firstname: [null, Validators.required],
        lastname: [null, Validators.required],
        password: [null, Validators.required],
        pwdConfirm: [null, Validators.required],
      },
      { validators: [FormValidators.confirmPassword] }
    );
  }

  onSubmit() {
    const value = this.form.value;
    const socialWorker: SocialWorker = {
      firstname: value.firstname,
      lastname: value.lastname,
    };
    const password = value.password;
    console.log(socialWorker, password);
  }
}
