import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private fb = inject(FormBuilder);

  showPassword = signal(false);
  showConfirmPassword = signal(false);
  
  registerForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  isSubmitted = signal(false);

  constructor() {}

  get passwordStrength(): number {
    const pw = this.registerForm.get('password')?.value || '';
    if (!pw) return 0;
    let strength = 0;
    if (pw.length >= 8) strength += 25;
    if (/[A-Z]/.test(pw)) strength += 25;
    if (/[0-9]/.test(pw)) strength += 25;
    if (/[^A-Za-z0-9]/.test(pw)) strength += 25;
    return strength;
  }

  get strengthColor(): string {
    const s = this.passwordStrength;
    if (s <= 25) return 'bg-red-500';
    if (s <= 50) return 'bg-orange-500';
    if (s <= 75) return 'bg-yellow-400';
    return 'bg-emerald-500';
  }

  get strengthLabel(): string {
    const s = this.passwordStrength;
    if (s === 0) return '';
    if (s <= 25) return 'Débil';
    if (s <= 50) return 'Regular';
    if (s <= 75) return 'Buena';
    return 'Fuerte';
  }

  togglePassword() {
    this.showPassword.update(s => !s);
  }

  toggleConfirmPassword() {
    this.showConfirmPassword.update(s => !s);
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (password !== confirmPassword && confirmPassword) {
      control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit() {
    this.isSubmitted.set(true);
    if (this.registerForm.valid) {
      console.log('Register attempt', this.registerForm.value);
    }
  }

  get username() { return this.registerForm.get('username'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
}
