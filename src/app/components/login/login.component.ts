import { Component } from '@angular/core';
import { GlobalService } from '@app/services/global.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
constructor(
  public global:GlobalService
){}
}
