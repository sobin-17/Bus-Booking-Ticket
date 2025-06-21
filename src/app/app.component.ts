import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AddUserComponent } from "./add-user/add-user.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, CommonModule,RouterLink ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'BusBookingTicket';
alertMessage: any;
alertType: any;
registerForm: any;
}
