import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@auth/auth.service';

@Component({
  selector: 'app-register',
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  errorMessage: string | null = null;

  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern(/^[a-zA-Z0-9_]+$/)]),
    password: new FormControl('', [Validators.required, Validators.minLength(12), Validators.maxLength(256), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{12,256}$/)]),
  });

  onSubmit() {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value.username!, this.registerForm.value.password!).subscribe({
        next: () => {
          this.authService.signIn(this.registerForm.value.username!, this.registerForm.value.password!).subscribe({
            next: () => {
              this.router.navigate(['/settings']);
            },
            error: (err) => {
              console.error('Login after registration failed', err);
              this.errorMessage = 'Registrierung erfolgreich, aber Login fehlgeschlagen. Bitte versuche es später erneut.';
            },
          });
        },
        error: (err) => {
          console.error('Registration failed', err);
          this.errorMessage = 'Registrierung fehlgeschlagen. Bitte versuche es später erneut.';
        },
      });
    }
  }
}
