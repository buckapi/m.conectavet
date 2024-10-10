import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GlobalService } from '@app/services/global.service';
import { CategoryService } from '@app/services/category.service'; // Importar el servicio

@Component({
  selector: 'app-categoriesadministrator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categoriesadministrator.component.html',
  styleUrl: './categoriesadministrator.component.css'
})
export class CategoriesadministratorComponent {
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
  categories:any= {
    salud_general: 'Consultas Generales',
    urgencias: 'Urgencias Veterinarias',
    cirugias: 'Cirugía Veterinaria',
    presupuesto: 'Agenda Presupuesto',
    especialidades_veterinaria: 'Especialidades Veterinarias',
    hospitalizacion: 'Hospitalización',
    diagnostico_imagen: 'Diagnóstico por Imagen',
    laboratorio_clinico: 'Laboratorio Clínico',
    rehabilitacion: 'Terapia Física y Rehabilitación',
    hotel_guarderia: 'Hotel y Guardería',
    estetica: 'Peluquería y Estética',
    asistencia_final_vida: 'Servicios y Asistencia en la Etapa Final de la Vida'
  }
  constructor(
    public global: GlobalService,
    private categoryService: CategoryService // Inyectar el servicio
  ) {}

  async addCategory() { // Método para agregar una nueva categoría
    const newCategory = {
      name: 'Nueva Categoría', // Cambia esto según sea necesario
      description: 'Descripción de la nueva categoría',
      idTag: 'tag123',
      status: 'activo',
      images: JSON.stringify([]) // Si no hay imágenes, puedes dejarlo vacío
    };

    try {
      const createdCategory = await this.categoryService.createCategory(newCategory);
      console.log('Categoría creada:', createdCategory);
      // Aquí puedes actualizar la lista de categorías si es necesario
    } catch (error) {
      console.error('Error al agregar la categoría:', error);
    }
  }
  isMobile() {
    return window.innerWidth <= 768; // Ajusta el tamaño según tus necesidades
  }
}
