import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { EmployeeComponent } from './employee/employee.component';
import { CitizenRegisterComponent } from './register/register.component';
import { CountryResolver } from './shared/resolvers/country.resolver';
import { WorkLocationResolver } from './shared/resolvers/work-location.resolver';
import { AdminComponent } from './admin/admin.component';
import { AuthGuardService } from './shared/services/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
  {
    path: 'admin',
    component: AdminComponent,
    resolve: {
      countries: CountryResolver,
      workLocations: WorkLocationResolver,
    },
    // canActivate:[AuthGuardService]
  },
  {
    path: 'employee',
    component: EmployeeComponent,
    resolve: {
      countries: CountryResolver,
      workLocations: WorkLocationResolver,
    },
    // canActivate:[AuthGuardService]
  },
  { path: 'citizen-register', component: CitizenRegisterComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: '**', redirectTo: '/sign-in' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
