import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthPocketbaseService } from '@app/services/auth-pocketbase.service';
import { UserInterface } from '@app/interfaces/user-interface';
import { GlobalService } from '@app/services/global.service';
@Component({
  selector: 'app-memberaccount',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './memberaccount.component.html',
  styleUrl: './memberaccount.component.css'
})
export class MemberaccountComponent {
  optionSelected=false;
  currentUser: UserInterface = {} as UserInterface;
  services: any[] = [
    { name: 'Medicina Preventiva', categoryKey: 'salud_general' },
    { name: 'Vacunación', categoryKey: 'salud_general' },
    { name: 'Desparasitación', categoryKey: 'salud_general' },
    { name: 'Emergencia', categoryKey: 'urgencias' },
    { name: 'Cirugía Veterinaria', categoryKey: 'cirugias' },
    { name: 'Tipo de Procedimientos', categoryKey: 'presupuesto' },
    { name: 'Endocrinología', categoryKey: 'especialidades_veterinaria' },
    { name: 'Oftalmología', categoryKey: 'especialidades_veterinaria' },
    { name: 'Cardiología', categoryKey: 'especialidades_veterinaria' },
    { name: 'Neurología', categoryKey: 'especialidades_veterinaria' },
    { name: 'Nefrología', categoryKey: 'especialidades_veterinaria' },
    { name: 'Odontología', categoryKey: 'especialidades_veterinaria' },
    { name: 'Nutricionista', categoryKey: 'especialidades_veterinaria' },
    { name: 'Etología', categoryKey: 'especialidades_veterinaria' },
    { name: 'Oncología', categoryKey: 'especialidades_veterinaria' },
    { name: 'Hospitalización', categoryKey: 'hospitalizacion' },
    { name: 'Radiología', categoryKey: 'diagnostico_imagen' },
    { name: 'Ecografía', categoryKey: 'diagnostico_imagen' },
    { name: 'Listado de Exámenes', categoryKey: 'laboratorio_clinico' },
    { name: 'Terapia Física y Rehabilitación', categoryKey: 'rehabilitacion' },
    { name: 'Hotel y Guardería', categoryKey: 'hotel_guarderia' },
    { name: 'Peluquería y Spa', categoryKey: 'estetica' },
    { name: 'Eutanasia', categoryKey: 'asistencia_final_vida' },
    { name: 'Servicios de Cremación', categoryKey: 'asistencia_final_vida' }
  ];
   // Definir la propiedad 'services' como un arreglo
  constructor(public auth: AuthPocketbaseService,public global:GlobalService) {

    this.currentUser= this.auth.getCurrentUser();
  }
}
