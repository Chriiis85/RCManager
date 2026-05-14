import { Component, ChangeDetectionStrategy, signal, inject, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  showPassword = signal(false);
  showConfirmPassword = signal(false);
  isSubmitted = signal(false);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  registerForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  // Track password value reactively for strength indicator
  passwordValue = toSignal(this.registerForm.get('password')!.valueChanges, { initialValue: '' });

  get username() { return this.registerForm.get('username'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }

  passwordStrength = computed(() => {
    const pw = this.passwordValue() || '';
    if (!pw) return 0;
    let strength = 0;
    if (pw.length >= 8) strength += 25;
    if (/[A-Z]/.test(pw)) strength += 25;
    if (/[0-9]/.test(pw)) strength += 25;
    if (/[^A-Za-z0-9]/.test(pw)) strength += 25;
    return strength;
  });

  strengthColor = computed(() => {
    const s = this.passwordStrength();
    if (s <= 25) return 'bg-red-500';
    if (s <= 50) return 'bg-orange-500';
    if (s <= 75) return 'bg-yellow-400';
    return 'bg-emerald-500';
  });

  strengthLabel = computed(() => {
    const s = this.passwordStrength();
    if (s === 0) return '';
    if (s <= 25) return 'Débil';
    if (s <= 50) return 'Regular';
    if (s <= 75) return 'Buena';
    return 'Fuerte';
  });

  togglePassword() {
    this.showPassword.update(s => !s);
  }

  toggleConfirmPassword() {
    this.showConfirmPassword.update(s => !s);
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit() {
    this.isSubmitted.set(true);
    this.errorMessage.set(null);

    if (this.registerForm.invalid) return;

    const { username, email, password } = this.registerForm.value;
    if (!username || !email || !password) return;

    this.isLoading.set(true);

    this.authService.register({ username, email, password }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg = err?.error?.error || 'Error al registrarse. Inténtalo de nuevo.';
        this.errorMessage.set(msg);
      }
    });
  }
}
