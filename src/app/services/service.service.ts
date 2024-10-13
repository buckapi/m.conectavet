import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private pb: PocketBase;

  constructor() {
    this.pb = new PocketBase('https://db.conectavet.cl:8080');
  }

//   async createService(data: { name: string; description?: string; idTag?: string; status?: string; images?: string }) {
//     try {
//       const record = await this.pb.collection('services').create(data);
//       return record; // Retornar el registro creado
//     } catch (error) {
//       console.error('Error al crear el servicio:', error);
//       throw error; // Lanzar el error para manejarlo en el componente
//     }
//   }

  async deleteService(serviceId: string) { // Método para eliminar un servicio
    try {
      const response = await this.pb.collection('services').delete(serviceId); // Eliminar el servicio usando PocketBase
      return response;
    } catch (error) {
      console.error('Error al eliminar el servicio:', error);
      throw error; // Lanza el error para manejarlo en el componente
    }
  }

  async updateServiceStatus(serviceId: string, newStatus: string) { // Método para actualizar el estado del servicio
    try {
      const updatedRecord = await this.pb.collection('services').update(serviceId, { status: newStatus }); // Actualizar el estado del servicio
      return updatedRecord; // Retornar el registro actualizado
    } catch (error) {
      console.error('Error al actualizar el estado del servicio:', error);
      throw error; // Lanzar el error para manejarlo en el componente
    }
  }
}