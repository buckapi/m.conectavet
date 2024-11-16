import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthPocketbaseService } from '@app/services/auth-pocketbase.service';
import { GlobalService } from '@app/services/global.service';
import { ImageService } from '@app/services/image.service';
import Swal from 'sweetalert2';
import PocketBase from 'pocketbase';

interface ImageRecord {
  collectionId: string;
  id: string;
  image: string;
}
interface MemberRecord {
  id: string;
  full_name: string;
  bio: string;
  email: string;
  rut: string;
  address: string;
  region: string;
  comuna: string;
  phone: string;
  days: string;
  hours: string;
  manager_name: string;
  manager_phone: string;
  manager_email: string;
  manager_position: string;
  images: string[];
  [key: string]: any; // Agregado para permitir índices dinámicos
}

// interface MemberRecord {
//   id: string;
//   full_name: string;
//   bio: string;
//   email: string;
//   rut: string;
//   address: string;
//   region: string;
//   comuna: string;
//   phone: string;
//   days: string;
//   hours: string;
//   manager_name: string;
//   manager_phone: string;
//   manager_email: string;
//   manager_position: string;
//   images: string[];
// }

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  canEditRut: boolean = false;
  fields: MemberRecord = {
    id: '',
    full_name: '',
    bio: '',
    email: '',
    rut: '',
    address: '',
    region: '',
    comuna: '',
    phone: '',
    days: '',
    hours: '',
    manager_name: '',
    manager_phone: '',
    manager_email: '',
    manager_position: '',
    images: [],
  };
  visibleFields: { [key: string]: boolean } = {
    full_name: false,
    bio: false,
    email: false,
    rut: false,
    address: false,
    region: false,
    comuna: false,
    phone: false,
    days: false,
    hours: false,
    manager_name: false,
    manager_phone: false,
    manager_email: false,
    manager_position: false,
  };


  private debounceTimers: { [key: string]: any } = {};
  @ViewChild('imageUpload', { static: false }) imageUpload!: ElementRef;
  selectedImagePreview: string | null = null; // URL para la previsualización de la imagen
currentUser = {
  images: ['assets/images/default.png'], // Imagen predeterminada
}; selectedImage: File | null = null;
  selectedImagePrev: string | null = null;
  apiUrl = 'https://db.conectavet.cl:8080/api/files/';

  private pb: PocketBase;

  constructor(
    private imageService: ImageService,
    public global: GlobalService,
    public auth: AuthPocketbaseService,
    private cdr: ChangeDetectorRef
  ) {
    this.pb = new PocketBase('https://db.conectavet.cl:8080');
  }

  ngOnInit(): void {
    this.fetchMemberData();
  }

  toggleField(field: keyof typeof this.visibleFields): void {
    this.visibleFields[field] = !this.visibleFields[field];
  }

  onInputChange(fieldName: string, value: string): void {
    if (this.debounceTimers[fieldName]) {
      clearTimeout(this.debounceTimers[fieldName]);
    }
    this.debounceTimers[fieldName] = setTimeout(() => {
      this.updateFields(fieldName, value);
    }, 1000);
  }

  async updateFields(fieldName: string, value: string): Promise<void> {
    try {
      const memberId = this.fields.id;
      await this.pb.collection('members').update(memberId, { [fieldName]: value });

      if (fieldName === 'full_name') {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        currentUser.full_name = value;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
      }

      Swal.fire('Éxito', `${fieldName} se ha actualizado correctamente.`, 'success');
      console.log(`${fieldName} actualizado a "${value}".`);
    } catch (error) {
      Swal.fire('Error', `Hubo un problema al actualizar ${fieldName}.`, 'error');
      console.error(`Error al actualizar ${fieldName}:`, error);
    }
  }

  async fetchMemberData(): Promise<void> {
    try {
      const userId = this.auth.getUserId();
      const memberRecord = await this.pb.collection('members').getFirstListItem<MemberRecord>(`userId="${userId}"`);
      if (memberRecord) {
        if (!this.fields.rut) {
          this.canEditRut = true;
        }
        this.fields = memberRecord;
        this.cdr.detectChanges();
        console.log('Datos cargados:', this.fields);
      } else {
        console.warn('No se encontraron datos para este miembro.');
      }
    } catch (error) {
      console.error('Error al cargar los datos del miembro:', error);
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
  
          // Actualizar el registro de `members`
          const tutorRecord = await this.pb
            .collection('members')
            .getFirstListItem(`userId="${userId}"`);
  
          if (tutorRecord) {
            const updatedTutor = {
              ...tutorRecord,
              images: [uploadedImageUrl],
            };
  
            await this.pb.collection('members').update(tutorRecord.id, updatedTutor);
            console.log('Ficha en members actualizada:', updatedTutor);
          }
  this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
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

  isMobile(): boolean {
    return window.innerWidth <= 768;
  }

  async confirmSaveRut() {
    this.canEditRut = false;
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'El RUT solo podrá ser ingresado una vez. Después de guardar, no podrás modificarlo.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      this.updateFields('rut', this.fields.rut);
    }
  }
}
