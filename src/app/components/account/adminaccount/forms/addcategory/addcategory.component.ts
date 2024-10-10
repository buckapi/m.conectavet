import { Component, EventEmitter, Output } from '@angular/core'; // Agregar EventEmitter y Output
import { FormsModule } from '@angular/forms';
import { CategoryService } from '@app/services/category.service';import { GlobalService } from '@app/services/global.service';
 
@Component({
  selector: 'app-addcategory',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './addcategory.component.html',
  styleUrl: './addcategory.component.css'
})
export class AddcategoryComponent {
  @Output() categoryAdded = new EventEmitter<void>(); // Emitir evento al agregar categoría
  categoryName: string = '';
  categoryDescription: string = '';
  constructor(
    public global: GlobalService,
    private categoryService: CategoryService // Inyectar el servicio
  ) {}
  async addCategory() { // Método para agregar una nueva categoría
    const newCategory = {
      name: this.categoryName, // Usar el nombre de la categoría del formulario
      description: '', // Usar la descripción de la categoría del formulario
      status: 'activo',
      images: JSON.stringify([]) // Si no hay imágenes, puedes dejarlo vacío
    };

    try {
      const createdCategory = await this.categoryService.createCategory(newCategory);
      console.log('Categoría creada:', createdCategory);
      this.categoryAdded.emit(); // Emitir evento para cerrar el modal
    } catch (error) {
      console.error('Error al agregar la categoría:', error);
    }
  }

}
