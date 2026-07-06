import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  showPassword = signal(false);
  isSubmitted = signal(false);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  togglePassword() {
    this.showPassword.update(s => !s);
  }

  onSubmit() {
    this.isSubmitted.set(true);
    this.errorMessage.set(null);

    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.getRawValue();
    this.isLoading.set(true);

    this.authService.login({ email, password }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg = err?.error?.error || 'Error al iniciar sesión. Inténtalo de nuevo.';
        this.errorMessage.set(msg);
      }
    });
  }

  async onGoogleLogin() {
    this.errorMessage.set(null);
    this.isLoading.set(true);
    try {
      await this.authService.signInWithGoogle();
      // Notamos que Supabase redireccionará toda la página al proveedor OAuth.
    } catch (err: any) {
      this.isLoading.set(false);
      this.errorMessage.set(err.message || 'Error al conectar con Google.');
    }
  }
}
