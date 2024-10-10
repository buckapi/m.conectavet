import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GlobalService } from '@app/services/global.service';

@Component({
  selector: 'app-servicesadministrator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './servicesadministrator.component.html',
  styleUrl: './servicesadministrator.component.css'
})
export class ServicesadministratorComponent {
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
  constructor(
    public global:GlobalService
  ){}
  isMobile() {
    return window.innerWidth <= 768; // Ajusta el tamaño según tus necesidades
  }
}
