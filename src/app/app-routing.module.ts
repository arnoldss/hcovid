import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { RegisterComponent } from './register/register.component';
import { AdminComponent } from './admin/admin.component';
import { AuthGuardService } from './shared/services/auth-guard.service';



const routes: Routes = [
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
  {
    path: 'admin',
    component: AdminComponent, 
    // canActivate:[AuthGuardService]
  },
  {
    path: 'register',
    component: RegisterComponent},
  { path: 'register', component: RegisterComponent },  // canActivate:[AuthGuardService]},
  { path: 'sign-in', component: SignInComponent },
  { path: '**', redirectTo: '/sign-in' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
