import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styles: ``,
})
export class SignUpComponent {
  form: FormGroup = new FormGroup(
    {
      username: new FormControl('', [Validators.required]),
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
      group: new FormControl('rider', [Validators.required]),
      photo: new FormControl('', [Validators.required]),
    },
    { validators: PasswordMatchValidator('password', 'confirmPassword') }
  );

  constructor(private router: Router, private auth: AuthService) {}

  onChange(event: any): void {
    console.log(this.form)
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const photoControl = this.form.get('photo');
      if (photoControl) {
        photoControl.setValue(file);
      }
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.auth.signup(this.form.value).subscribe(
      () => {
        this.router.navigate(['/log-in']);
      },
      (error) => {
        console.error(error);
      }
    );
  }
}

const PasswordMatchValidator = (
  controlName: string,
  matchingControlName: string
): ValidatorFn => {
  return (form: AbstractControl): ValidationErrors | null => {
    const control = form.get(controlName);
    const matchingControl = form.get(matchingControlName);

    if (!control || !matchingControl) {
      return null; // return null when controls are not found
    }

    if (matchingControl.value !== control.value) {
      matchingControl.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      const errors = matchingControl.errors;
      if (errors) {
        delete errors['passwordMismatch'];
        if (Object.keys(errors).length === 0) {
          matchingControl.setErrors(null);
        } else {
          matchingControl.setErrors(errors);
        }
      }
      return null;
    }
  };
};
