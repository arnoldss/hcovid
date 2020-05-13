import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SignInService } from './sign-in.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: 'sign-in.component.html',
  styleUrls: ['sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder,
              private router: Router,
              private snackbar: MatSnackBar,
              private signInService: SignInService,) { }

  ngOnInit() {
    this.form = this.fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required]
    });
  }

  signIn() {
    const username = this.form.get('username').value;
    const password = this.form.get('password').value;
    const snackbarConfig: MatSnackBarConfig = { duration: 10000 };
   this.signInService.authenticate(username, password).subscribe(
    data => {
      this.router.navigate(['/admin'])

    },
    error => {

    }
  )


  }
}
