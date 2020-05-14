import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CitizenInfoComponent } from './citizen-info/citizen-info.component';
import { CitizenRegisterComponent } from './citizen-register/citizen-register.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SocialWorkerRegisterComponent } from './social-worker-register/social-worker-register.component';
import { AuthGuardService } from './shared/services/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
  {
    path: 'citizen-info',
    component: CitizenInfoComponent,
    //canActivate:[AuthGuardService]
  },
  { path: 'citizen-register', component: CitizenRegisterComponent,  },
  { path: 'social-worker-register', component: SocialWorkerRegisterComponent },
  { path: 'sign-in', component: SignInComponent,  },
  { path: '**', redirectTo: '/sign-in' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
