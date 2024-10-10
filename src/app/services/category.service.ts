import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private pb: PocketBase;

  constructor() {
    this.pb = new PocketBase('https://db.conectavet.cl:8080');
  }

  async createCategory(data: { name: string; description?: string; idTag?: string; status?: string; images?: string }) {
    try {
      const record = await this.pb.collection('categories').create(data);
      return record; // Retornar el registro creado
    } catch (error) {
      console.error('Error al crear la categoría:', error);
      throw error; // Lanzar el error para manejarlo en el componente
    }
  }
}