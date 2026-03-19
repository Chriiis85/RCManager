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
  
  registerForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  // Automatically track password control changes via signals to update the UI reactively
  passwordValue = toSignal(this.registerForm.get('password')!.valueChanges, { initialValue: '' });

  isSubmitted = signal(false);

  constructor() {}

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
    if (this.registerForm.valid) {
      const email = this.registerForm.get('email')?.value;
      if (email) {
        this.authService.login(email);
        this.router.navigate(['/viajes']);
      }
    }
  }
}
