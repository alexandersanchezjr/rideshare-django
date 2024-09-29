import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styles: ``,
})
export class LoginComponent {
  form: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router, private auth: AuthService) {}

  onSubmit(): void {
    console.log('Login form submitted');
    console.log;
    if (this.form.invalid) return;

    this.auth.login(this.form.value).subscribe({
      next: () => {
        console.log('Login successful');
        this.router.navigate(['']);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
