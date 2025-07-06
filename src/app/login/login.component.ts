import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  errorMessage: string | null = null;

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      this.authService.signIn(this.loginForm.value.username!, this.loginForm.value.password!).subscribe({
        next: () => {
          this.router.navigate(['/settings']);
        },
        error: () => {
          this.errorMessage = 'Login fehlgeschlagen. Bitte überprüfe deine Anmeldedaten und versuche es erneut.';
          this.loginForm.reset({
            username: this.loginForm.value.username, // Keep the username for convenience
            password: '', // Reset password field for security
          });
        },
      });
    }
  }
}
