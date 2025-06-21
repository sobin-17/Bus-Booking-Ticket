import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Define interfaces for better type safety
interface FormData {
  userName: string;
  password: string;
  emailId: string;
  fullName: string;
  projectName: string;
}

interface UserData {
  userName: string;
  fullName: string;
  emailId: string;
  role: string;
  refreshToken?: string;
  refreshTokenExpiryTime?: string;
}

interface ApiResponse {
  userName: string;
  fullName: string;
  emailId: string;
  role: string;
  refreshToken: string;
  refreshTokenExpiryTime: string;
}

@Component({
  selector: 'app-user-auth-system',
  imports: [FormsModule, CommonModule],
  templateUrl: './user-auth-system.component.html',
  styleUrls: ['./user-auth-system.component.css']
})
export class UserAuthSystemComponent {
  isLogin: boolean = true;
  showPassword: boolean = false;
  loading: boolean = false;
  message: string = '';
  userData: UserData | null = null;

  formData: FormData = {
    userName: '',
    password: '',
    emailId: '',
    fullName: '',
    projectName: ''
  };

  private readonly apiUrl = 'https://api.freeprojectapi.com/api/BusBooking';

  constructor(private http: HttpClient) {
    // Check for existing session on component init
    this.checkExistingSession();
  }

  private checkExistingSession(): void {
    const token = localStorage.getItem('refreshToken');
    const expiry = localStorage.getItem('refreshTokenExpiry');
    
    if (token && expiry) {
      const expiryDate = new Date(expiry);
      if (expiryDate > new Date()) {
        // Token is still valid, you might want to validate it with the server
        console.log('Found valid session token');
      } else {
        // Token expired, clean up
        this.clearSession();
      }
    }
  }

  private clearSession(): void {
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('refreshTokenExpiry');
  }

  handleInputChange(field: keyof FormData, event: Event): void {
    const target = event.target as HTMLInputElement;
    this.formData = {
      ...this.formData,
      [field]: target.value
    };
    this.message = ''; // Clear messages when user types
  }

  validateForm(): boolean {
    if (!this.formData.userName.trim() || !this.formData.password.trim()) {
      this.message = 'Username and password are required';
      return false;
    }
    
    if (!this.isLogin) {
      if (!this.formData.emailId.trim() || !this.formData.fullName.trim()) {
        this.message = 'All fields are required for registration';
        return false;
      }
      
      if (this.formData.password.length < 6) {
        this.message = 'Password must be at least 6 characters long';
        return false;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.formData.emailId)) {
        this.message = 'Please enter a valid email address';
        return false;
      }
    }
    
    return true;
  }

  private getHttpHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  async registerUser(): Promise<void> {
    try {
      const body = {
        userName: this.formData.userName.trim(),
        password: this.formData.password,
        emailId: this.formData.emailId.trim(),
        fullName: this.formData.fullName.trim(),
        projectName: this.formData.projectName.trim() || 'Default Project',
        role: 'User'
      };

      const response = await this.http.post<any>(
        `${this.apiUrl}/AddNewUser`, 
        body, 
        { headers: this.getHttpHeaders() }
      ).toPromise();
      
      this.message = 'Registration successful! You can now login.';
      this.isLogin = true;
      this.formData.password = ''; // Clear password for security
      
    } catch (error: any) {
      console.error('Registration error:', error);
      this.message = error?.error?.message || 'Registration failed. Please try again.';
    }
  }

  async loginUser(): Promise<void> {
    try {
      const body = {
        userName: this.formData.userName.trim(),
        password: this.formData.password
      };

      const response = await this.http.post<ApiResponse>(
        `${this.apiUrl}/Login`, 
        body, 
        { headers: this.getHttpHeaders() }
      ).toPromise();
      
      if (response) {
        this.userData = {
          userName: response.userName,
          fullName: response.fullName,
          emailId: response.emailId,
          role: response.role
        };
        
        this.message = `Welcome back, ${response.fullName}!`;
        
        // Store token if provided
        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
          localStorage.setItem('refreshTokenExpiry', response.refreshTokenExpiryTime);
        }
        
        // Clear form data for security
        this.resetForm();
      }
      
    } catch (error: any) {
      console.error('Login error:', error);
      this.message = error?.error?.message || 'Invalid username or password';
    }
  }

  async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    
    if (!this.validateForm()) return;
    
    this.loading = true;
    this.message = '';
    
    try {
      if (this.isLogin) {
        await this.loginUser();
      } else {
        await this.registerUser();
      }
    } catch (error) {
      console.error('Form submission error:', error);
      this.message = 'An unexpected error occurred. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  resetForm(): void {
    this.formData = {
      userName: '',
      password: '',
      emailId: '',
      fullName: '',
      projectName: ''
    };
    this.message = '';
  }

  switchMode(): void {
    this.isLogin = !this.isLogin;
    this.resetForm();
  }

  logout(): void {
    this.userData = null;
    this.resetForm();
    this.clearSession();
    this.message = 'Logged out successfully';
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  getMessageClass(): string {
    if (this.message.includes('successful') || this.message.includes('Welcome')) {
      return 'success-message';
    }
    return 'error-message';
  }
}