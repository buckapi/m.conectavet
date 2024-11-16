import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { AuthPocketbaseService } from '@app/services/auth-pocketbase.service';
import { GlobalService } from '@app/services/global.service';
import { ImageService } from '@app/services/image.service';
import Swal from 'sweetalert2';
import PocketBase from 'pocketbase';
import { FormsModule } from '@angular/forms';

interface ImageRecord {
  collectionId: string;
  id: string;
  image: string;
}
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  fields = {
    full_name: '',
    rut: '',
    phone: '',
    address: ''
  };
  private debounceTimers: { [key: string]: any } = {};
  @ViewChild('imageUpload', { static: false }) imageUpload!: ElementRef;
  selectedImagePreview: string | null = null; // URL para la previsualización de la imagen
currentUser = {
  images: ['assets/images/default.png'], // Imagen predeterminada
};



selectedImagePrev: string | null = null;


selectedImage: File | null = null;
formData = {
  images: [] as string[],
};
idTutor: string = 'user-id'; // Reemplaza con el ID real del tutor
apiUrl = 'https://db.conectavet.cl:8080/api/files/';
private pb: PocketBase;
  constructor(
    private imageService: ImageService,
    public global: GlobalService,
    public auth: AuthPocketbaseService
  ) {

    this.pb = new PocketBase('https://db.conectavet.cl:8080');

  }
  onInputChange(fieldName: string, value: string): void {
    // Cancela el temporizador anterior para el campo actual
    if (this.debounceTimers[fieldName]) {
      clearTimeout(this.debounceTimers[fieldName]);
    }

    // Inicia un nuevo temporizador de 3 segundos
    this.debounceTimers[fieldName] = setTimeout(() => {
      this.updateFields(fieldName, value);
    }, 1000);
  }

  async updateFields(fieldName: string, value: string): Promise<void> {
    const userId = this.auth.getUserId();
  
    try {
      // Actualiza el campo en la colección `users`
      await this.auth.updateUserField(userId, { [fieldName]: value });
  
      // Busca el tutor relacionado y actualiza el campo
      const tutorRecord = await this.auth.findTutorByUserId(userId);
      if (tutorRecord) {
        await this.auth.updateTutorField(tutorRecord.id, {
          [fieldName]: value
        });
      }
  
      Swal.fire({
        icon: 'success',
        title: 'Actualización exitosa',
        text: `${fieldName} se ha actualizado correctamente.`,
      });
  
      console.log(`${fieldName} actualizado a "${value}" en ambas entidades.`);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar',
        text: `Hubo un problema al actualizar ${fieldName}.`,
      });
      console.error(`Error al actualizar ${fieldName}:`, error);
    }
  }
  
  NonImageChange(event: Event): void {
    console.log('Evento recibido:', event);
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      console.log('Archivo seleccionado:', file);
    } else {
      console.log('No se seleccionó ningún archivo.');
    }
  }
  
  
  async onImageChange(event: any): Promise<void> {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
  
      // Mostrar previsualización de la imagen seleccionada
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImagePrev = reader.result as string; // Previsualización
      };
      reader.readAsDataURL(file);
  
      // Crear FormData para enviar al servidor
      const formData = new FormData();
      formData.append('type', 'avatar');
      formData.append('userId', this.auth.getUserId());
  
      if (this.selectedImage) {
        formData.append('image', this.selectedImage);
      }
  
      try {
        const newImageRecord: ImageRecord | null = await this.pb
          .collection('images')
          .create(formData);
  
        if (newImageRecord) {
          const uploadedImageUrl = `${this.apiUrl}${newImageRecord.collectionId}/${newImageRecord.id}/${newImageRecord.image}`;
  
          const userId = this.auth.getUserId();
  
          // Actualizar el registro de `users`
          const userRecord = await this.pb.collection('users').getOne(userId);
          if (userRecord) {
            const updatedUser = {
              ...userRecord,
              images: [uploadedImageUrl],
            };
  
            await this.pb.collection('users').update(userRecord.id, updatedUser);
            console.log('Imagen actualizada en users:', updatedUser);
          }
  
          // Actualizar el registro de `tutors`
          const tutorRecord = await this.pb
            .collection('tutors')
            .getFirstListItem(`userId="${userId}"`);
  
          if (tutorRecord) {
            const updatedTutor = {
              ...tutorRecord,
              images: [uploadedImageUrl],
            };
  
            await this.pb.collection('tutors').update(tutorRecord.id, updatedTutor);
            console.log('Ficha en tutors actualizada:', updatedTutor);
          }
  
          // Actualizar previsualización y localStorage
          this.selectedImagePrev = uploadedImageUrl;
          this.currentUser.images[0] = uploadedImageUrl;
          localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
  
          // Notificación de éxito
          Swal.fire({
            icon: 'success',
            title: 'Imagen actualizada',
            text: 'La imagen se ha subido correctamente.',
          });
        }
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Error al subir imagen',
          text: 'No se pudo actualizar la imagen. Inténtelo de nuevo.',
        });
        console.error('Error al subir la imagen o actualizar registros:', error.response?.data || error);
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'No se seleccionó archivo',
        text: 'Por favor selecciona un archivo para subir.',
      });
      console.warn('No se seleccionó ningún archivo.');
    }
  }
  
  
  
  
  async uploadImage(file: File): Promise<void> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('userId', this.auth.getUserId());
  
    try {
      // Lógica para subir la imagen al servidor
      const response = await fetch('https://db.conectavet.cl:8080/api/files/', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('No se pudo cargar la imagen');
      }
  
      const data = await response.json();
  
      // Actualiza la URL de la imagen en `currentUser`
      this.currentUser.images[0] = `https://db.conectavet.cl:8080/api/files/${data.collectionId}/${data.id}/${data.image}`;
  
      // Guarda el usuario actualizado en el `localStorage`
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
  
      Swal.fire('Éxito', 'La imagen se ha cargado correctamente.', 'success');
    } catch (error) {
      Swal.fire('Error', 'No se pudo cargar la imagen. Inténtelo de nuevo.', 'error');
      console.error('Error al subir la imagen:', error);
    }
  }
  
  isMobile(): boolean {
    return window.innerWidth <= 768; // Ajusta el ancho según tus necesidades
  }
  
}
