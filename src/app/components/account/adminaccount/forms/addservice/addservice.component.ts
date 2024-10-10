import { Component } from '@angular/core';

@Component({
  selector: 'app-addservice',
  standalone: true,
  imports: [],
  templateUrl: './addservice.component.html',
  styleUrl: './addservice.component.css'
})
export class AddserviceComponent {
  isMobile() {
    return window.innerWidth <= 768; // Ajusta el tamaño según tus necesidades
  }
}
