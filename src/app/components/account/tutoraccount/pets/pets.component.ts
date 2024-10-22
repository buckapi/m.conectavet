import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthPocketbaseService } from '@app/services/auth-pocketbase.service';
import { UserInterface } from '@app/interfaces/user-interface';
import { GlobalService } from '@app/services/global.service';
interface PetInterface {
  // Define las propiedades de PetInterface aquí
  name: string;
  images: string[];
  age: number;
  // ... otras propiedades ...
}
@Component({
  selector: 'app-pets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pets.component.html',
  styleUrl: './pets.component.css'
})
export class PetsComponent {

  pets: PetInterface[] = [
    { name: 'Firulais', age: 5, images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMMPbYDdEN_MKg-CsvMaImLwx1cItO6IH7Vw&s'] },
    { name: 'Rex', age: 3, images: [ 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReJo3Jf0aKnF1vc6GQVeT4iKIMITIorQdBbQ&s' ] }
  ];
  currentUser: UserInterface = {} as UserInterface;

  constructor(
    public global:GlobalService,
    public auth: AuthPocketbaseService) {
    this.currentUser = this.auth.getCurrentUser();
  }

  onMouseOver(event: MouseEvent) {
    // Cambiar el estilo del elemento al pasar el mouse
    const target = event.currentTarget as HTMLElement;
    target.style.backgroundColor = '#f0f0f0'; // Cambia el color de fondo
  }

  onMouseOut(event: MouseEvent) {
    // Restaurar el estilo del elemento al salir el mouse
    const target = event.currentTarget as HTMLElement;
    target.style.backgroundColor = ''; // Restaura el color de fondo original
  }
  isMobile() {
    return window.innerWidth <= 768; // Ajusta el tamaño según tus necesidades
  }
}