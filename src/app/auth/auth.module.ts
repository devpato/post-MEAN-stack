import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AngulartMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth.routing.module';

@NgModule({
  declarations: [LoginComponent, SignupComponent],
  imports: [
    CommonModule,
    AngulartMaterialModule,
    FormsModule,
    AuthRoutingModule
  ]
})
export class AuthModule {}
