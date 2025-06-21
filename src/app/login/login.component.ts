import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

interface LoginRequest {
  userName: string;
  password: string;
}

interface LoginResponse {
  message: string;
  result: boolean;
  data: {
    userId: number;
    userName: string;
    emailId: string;
    fullName: string;
    role: string;
    token: string;
    refreshToken: string;
    tokenExpiryTime: string;
  } | null;
}

@Component({
  selector: 'app-login',
  imports:[ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  private apiUrl = 'https://api.freeprojectapi.com/api/BusBooking/login';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.createForm();
  }

  ngOnInit(): void {
    // Check if user is already logged in
    if (this.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
    this.initializeForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  private initializeForm(): void {
    // Load saved credentials if remember me was checked
    const savedUserName = localStorage.getItem('savedUserName');
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    
    if (savedUserName && rememberMe) {
      this.loginForm.patchValue({
        userName: savedUserName,
        rememberMe: true
      });
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const formValue = this.loginForm.value;
      const loginData: LoginRequest = {
        userName: formValue.userName,
        password: formValue.password
      };

      this.login(loginData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.result && response.data) {
            this.handleLoginSuccess(response.data, formValue.rememberMe);
          } else {
            this.errorMessage = response.message || 'Invalid username or password. Please try again.';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.handleLoginError(error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private login(loginData: LoginRequest): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<LoginResponse>(this.apiUrl, loginData, { headers });
  }

  private handleLoginSuccess(userData: any, rememberMe: boolean): void {
    // Store user data in session/local storage
    sessionStorage.setItem('currentUser', JSON.stringify(userData));
    sessionStorage.setItem('authToken', userData.token);
    sessionStorage.setItem('refreshToken', userData.refreshToken);

    // Handle remember me functionality
    if (rememberMe) {
      localStorage.setItem('savedUserName', userData.userName);
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('savedUserName');
      localStorage.removeItem('rememberMe');
    }

    // Navigate to dashboard or intended route
    const returnUrl = sessionStorage.getItem('returnUrl') || 'home';
    sessionStorage.removeItem('returnUrl');
    this.router.navigate([returnUrl]);
  }

  private handleLoginError(error: any): void {
    console.error('Login error:', error);
    
    if (error.status === 401) {
      this.errorMessage = 'Invalid username or password. Please try again.';
    } else if (error.status === 400) {
      this.errorMessage = 'Please check your username and password and try again.';
    } else if (error.status === 0) {
      this.errorMessage = 'Unable to connect to server. Please check your internet connection.';
    } else {
      this.errorMessage = error.error?.message || 'Login failed. Please try again later.';
    }
  }

  private isLoggedIn(): boolean {
    const token = sessionStorage.getItem('authToken');
    const user = sessionStorage.getItem('currentUser');
    return !!(token && user);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field && field.touched && field.errors) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} is required`;
      if (field.errors['minlength']) return `${this.getFieldLabel(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      userName: 'Username',
      password: 'Password'
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  onForgotPassword(): void {
    // Navigate to forgot password page
    this.router.navigate(['/forgot-password']);
  }

  onRegister(): void {
    // Navigate to registration page
    this.router.navigate(['/Addusers']);
  }
}
