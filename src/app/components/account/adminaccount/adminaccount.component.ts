import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthPocketbaseService } from '@app/services/auth-pocketbase.service';

@Component({
  selector: 'app-adminaccount',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './adminaccount.component.html',
  styleUrl: './adminaccount.component.css'
})
export class AdminaccountComponent {
  constructor(public auth: AuthPocketbaseService) {}
}
