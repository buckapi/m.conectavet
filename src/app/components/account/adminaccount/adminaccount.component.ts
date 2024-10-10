import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserInterface } from '@app/interfaces/user-interface';
import { AuthPocketbaseService } from '@app/services/auth-pocketbase.service';
import { ServicesadministratorComponent } from "./servicesadministrator/servicesadministrator.component";
import { GlobalService } from '@app/services/global.service';
import { AddserviceComponent } from './forms/addservice/addservice.component';
import { AddcategoryComponent } from './forms/addcategory/addcategory.component';
import { CategoriesadministratorComponent } from "./categoriesadministrator/categoriesadministrator.component";

@Component({
  selector: 'app-adminaccount',
  standalone: true,
  imports: [
    CommonModule, 
    ServicesadministratorComponent, 
    AddserviceComponent, 
    AddcategoryComponent, 
    CategoriesadministratorComponent
  ],
  templateUrl: './adminaccount.component.html',
  styleUrl: './adminaccount.component.css'
})
export class AdminaccountComponent {
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
  constructor(public auth: AuthPocketbaseService,public global:GlobalService) {
    this.currentUser= this.auth.getCurrentUser();
  }

  isMobile() {
    return window.innerWidth <= 768; // Ajusta el tamaño según tus necesidades
  }
}
