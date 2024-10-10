import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';
import { Category } from '@app/interfaces/category.interface'; // Importar la interfaz
export interface Clinic {
  id: number;
  name: string;
  full_name: string;
  address: string;
  phoneNumber: string;
  images: string[]; // O el tipo adecuado para las imágenes
  services: string[]; // O el tipo adecuado para los servicios
  // Otros campos que sean necesarios
}


@Injectable({
  providedIn: 'root',
})


export class GlobalService {
  categoryFiltersAplcated=false;
  adminOptionn:string='';
  formOption:string='';
  option: string = '';
  isScrollingDown = false;
  lastScrollTop = 0;
  scrollThreshold = 380;
  specialists: any[] = [];
  categories: any[] = [];
  categorySelected: any = { // Cambiar 'category' a 'Category'
   
  }; 
  clinicSelected: Clinic = {
    id: 0,
    name: '',
    full_name: '',
    address: '',
    phoneNumber: '',
    images: [], // Inicializa con un array vacío
    services: [],
  };
  activeRoute = 'home';
  modalType = 'filter';
  constructor() {}
  async acept(clinica: any) {
    if (clinica && clinica.id) {
      try {
        const pb = new PocketBase('https://db.conectavet.cl:8080');
        
        const data = {
          status: 'approved'
        };

        const record = await pb.collection('members').update(clinica.id, data);
        
        console.log('Estado de la clínica actualizado a: approved', record);
        return record;
      } catch (error) {
        console.error('Error al actualizar el estado de la clínica', error);
        throw error;
      }
    } else {
      console.error('Clínica no válida');
      throw new Error('Clínica no válida');
    }
  }
  resetAdminOption(){
    this.adminOptionn='';

  }
  setFormOption(option:string){
this.formOption=option;
  }
  setRoute(route: string) {
    this.activeRoute = route;
  }
  setAdminOption(option:string){
    this.adminOptionn=option;
  }
  setModalType(modalType: string) {
    this.modalType = modalType;
  }
  viewClinic(clinic: any) {
    this.clinicSelected = clinic;
    this.activeRoute = 'clinicdetail';
  }

  async toggleSpecialistStatus(specialist: any) {
    if (specialist && specialist.id) {
      try {
        const pb = new PocketBase('https://db.conectavet.cl:8080');
        
        const newStatus = specialist.status === 'approved' ? 'pending' : 'approved';
        const data = {
          status: newStatus
        };

        const record = await pb.collection('members').update(specialist.id, data);
        
        console.log(`Estado del especialista actualizado a: ${newStatus}`, record);
        
        // Actualiza el estado del especialista en la lista local
        const index = this.specialists.findIndex(s => s.id === specialist.id);
        if (index !== -1) {
          this.specialists[index].status = newStatus;
        }

        return record;
      } catch (error) {
        console.error('Error al actualizar el estado del especialista', error);
        throw error;
      }
    } else {
      console.error('Especialista no válido');
      throw new Error('Especialista no válido');
    }
  }
}
