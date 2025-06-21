import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface AddUserRequest {
  userId: number;
  userName: string;
  emailId: string;
  fullName: string;
  role: string;
  createdDate: string;
  password: string;
  projectName: string;
  refreshToken: string;
  refreshTokenExpiryTime: string;
}

interface ApiResponse {
  message: string;
  result: boolean;
  data: any;
}

@Component({
  selector: 'app-add-user',
  imports:[ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  addUserForm: FormGroup;
  isLoading = false;
  isSuccess = false;
  errorMessage = '';
  
  roles = [
    { value: 'Admin', label: 'Administrator' },
    { value: 'User', label: 'User' },
    { value: 'Manager', label: 'Manager' },
    { value: 'Operator', label: 'Operator' }
  ];

  private apiUrl = 'https://api.freeprojectapi.com/api/BusBooking/AddNewUser';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.addUserForm = this.createForm();
  }

  ngOnInit(): void {
    this.resetForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      emailId: ['', [Validators.required, Validators.email]],
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      role: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      confirmPassword: ['', Validators.required],
      projectName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    if (confirmPassword && confirmPassword.hasError('passwordMismatch')) {
      const errors = confirmPassword.errors;
      if (errors) {
        delete errors['passwordMismatch'];
        if (Object.keys(errors).length === 0) {
          confirmPassword.setErrors(null);
        }
      }
    }
    
    return null;
  }

  onSubmit(): void {
    if (this.addUserForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.isSuccess = false;
      

      const formValue = this.addUserForm.value;
      const currentDate = new Date().toISOString();
      const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days from now

      const requestBody: AddUserRequest = {
        userId: 0,
        userName: formValue.userName,
        emailId: formValue.emailId,
        fullName: formValue.fullName,
        role: formValue.role,
        createdDate: currentDate,
        password: formValue.password,
        projectName: formValue.projectName,
        refreshToken: this.generateRefreshToken(),
        refreshTokenExpiryTime: expiryDate
      };

      this.addUser(requestBody).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.result) {
            this.isSuccess = true;
            this.resetForm();
            setTimeout(() => this.isSuccess = false, 5000);
          } else {
            this.errorMessage = response.message || 'Failed to add user. Please try again.';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'An error occurred while adding the user.';
          console.error('Add user error:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private addUser(userData: AddUserRequest): Observable<ApiResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<ApiResponse>(this.apiUrl, userData, { headers });
  }

  private generateRefreshToken(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15) +
           Date.now().toString(36);
  }

  private resetForm(): void {
    this.addUserForm.reset();
    this.addUserForm.patchValue({
      role: '',
      projectName: 'BusBooking'
    });
  }

  public resetFormPublic(): void {
    this.resetForm();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.addUserForm.controls).forEach(key => {
      const control = this.addUserForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.addUserForm.get(fieldName);
    if (field && field.touched && field.errors) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} is required`;
      if (field.errors['email']) return 'Please enter a valid email address';
      if (field.errors['minlength']) return `${this.getFieldLabel(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors['maxlength']) return `${this.getFieldLabel(fieldName)} must not exceed ${field.errors['maxlength'].requiredLength} characters`;
      if (field.errors['passwordMismatch']) return 'Passwords do not match';
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      userName: 'Username',
      emailId: 'Email',
      fullName: 'Full Name',
      role: 'Role',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      projectName: 'Project Name'
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.addUserForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }
}