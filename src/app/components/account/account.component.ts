import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthPocketbaseService } from '@app/services/auth-pocketbase.service';
import { AdminaccountComponent } from './adminaccount/adminaccount.component';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule,AdminaccountComponent],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {
  constructor(public auth: AuthPocketbaseService) {}
}
