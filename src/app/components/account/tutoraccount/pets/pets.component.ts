import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthPocketbaseService } from '@app/services/auth-pocketbase.service';
import { UserInterface } from '@app/interfaces/user-interface';
import { GlobalService } from '@app/services/global.service';
import { HistoryComponent } from '../history/history.component';
import { Pet, RealtimePetsService } from '@app/services/realtime-pet.service';
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
  imports: [CommonModule,HistoryComponent],
  templateUrl: './pets.component.html',
  styleUrl: './pets.component.css'
})
export class PetsComponent {
  

pets: any[] = [];
filteredPets: any[] = [];
  currentUser: UserInterface = {} as UserInterface;

  constructor(
    public global:GlobalService,
    public auth: AuthPocketbaseService,
    public realtimePets:RealtimePetsService
  
  ) {
    this.realtimePets.pets$;

    this.currentUser = this.auth.getCurrentUser();
  }
  filterPets() {
    this.filteredPets = this.pets.filter(pet => pet.idTutor === this.auth.getUserId());
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
  showHistoryF(pet:Pet){
    this.global.showHistory=true;
    this.global.petSelected=pet;
  }
}
