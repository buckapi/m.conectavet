import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthPocketbaseService } from '@app/services/auth-pocketbase.service';
import { GlobalService } from '@app/services/global.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
constructor(
  public global:GlobalService,
  public auth:AuthPocketbaseService
){}
isMobile() {
  return window.innerWidth <= 768; // Ajusta el tamaño según tus necesidades
}
}