import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthPocketbaseService } from '@app/services/auth-pocketbase.service';

@Component({
  selector: 'app-memberaccount',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './memberaccount.component.html',
  styleUrl: './memberaccount.component.css'
})
export class MemberaccountComponent {
  constructor(public auth: AuthPocketbaseService) {}
}
