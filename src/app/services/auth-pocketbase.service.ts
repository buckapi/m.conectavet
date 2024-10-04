import PocketBase from 'pocketbase';
import { Injectable, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { GlobalService } from './global.service';
import { Observable, from, tap, map } from 'rxjs';
import { UserInterface } from '@app/interfaces/user-interface';
import { RecordModel } from 'pocketbase';

@Injectable({
  providedIn: 'root',
})
export class AuthPocketbaseService {
  private pb: PocketBase;

  constructor(public global: GlobalService) {
    this.pb = new PocketBase('https://db.conectavet.cl:8080');
  }

  async saveCategor(categoryData: any): Promise<any> {
    try {
      const record = await this.pb
        .collection('categories')
        .create(categoryData);
      console.log('Categoría guardada exitosamente:', record);

      return record; // Si necesitas devolver el registro creado
    } catch (error) {
      console.error('Error al guardar la categoría:', error);
      throw error; // Puedes lanzar el error para manejarlo en otro lugar
    }
  }

  async saveSpecialty(specialtyData: any): Promise<any> {
    try {
      const record = await this.pb
        .collection('specialties')
        .create(specialtyData);
      console.log('Especialidad guardada exitosamente:', record);
      // this.global.getSpecialties();
      return record; // Si necesitas devolver el registro creado
    } catch (error) {
      console.error('Error al guardar la especialidad:', error);
      throw error; // Puedes lanzar el error para manejarlo en otro lugar
    }
  }
  isLogin() {
    return localStorage.getItem('isLoggedin');
  }

    isAdmin(){
      const userType = localStorage.getItem('type');
  return userType === '"admin"';
    }
  registerUser(
    email: string,
    password: string,
    type: string,
    name: string,
    address: string // Añadimos el parámetro address
  ): Observable<any> {
    const userData = {
      email: email,
      password: password,
      passwordConfirm: password,
      type: type,
      username: name,
      name: name,
    };

    // Crear usuario y luego crear el registro en clinics
    return from(
      this.pb
        .collection('users')
        .create(userData)
        .then((user) => {
          const data = {
            full_name: name,
            address: address, // Usamos el parámetro address aquí
            phone: '', // Agrega los campos correspondientes aquí
            userId: user.id, // Utiliza el ID del usuario recién creado
            status: 'pending', // Opcional, establece el estado del cliente
            images: {}, // Agrega los campos correspondientes aquí
          };
          return this.pb.collection('members').create(data);
        })
    );
  }

  onlyRegisterUser(
    email: string,
    password: string,
    type: string,
    name: string
  ): Observable<any> {
    const userData = {
      email: email,
      password: password,
      passwordConfirm: password,
      type: type,
      username: name,
      name: name,
    };

    // Crear usuario y devolver el observable con el usuario creado
    return from(
      this.pb
        .collection('users')
        .create(userData)
        .then((user) => {
          // No se necesita crear ningún registro adicional en clinics aquí
          return user; // Devolver los datos del usuario creado
        })
    );
  }

  loginUser(email: string, password: string): Observable<any> {
    return from(this.pb.collection('users').authWithPassword(email, password))
      .pipe(
        map((authData) => {
          const pbUser = authData.record;
          const user: UserInterface = {
            id: pbUser.id,
            email: pbUser['email'],
            password: '', // No almacenamos la contraseña por seguridad
            full_name: pbUser['name'],
            images: pbUser['images'] || {},
            type: pbUser['type'],
            username: pbUser['username'],
            created: pbUser['created'],
            updated: pbUser['updated'],
            avatar: pbUser['avatar'] || '',
            status: pbUser['status'] || 'active',
            // Añade aquí cualquier otro campo necesario
          };
          return { ...authData, user };
        }),
        tap((authData) => {
          this.setUser(authData.user);
          this.setToken(authData.token);
          localStorage.setItem('isLoggedin', 'true');
          localStorage.setItem('userId', authData.user.id);
        })
      );
  }

  logoutUser(): Observable<any> {
    // Limpiar la autenticación almacenada
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedin');
    localStorage.removeItem('dist');
    localStorage.removeItem('userId');
    localStorage.removeItem('type');
    localStorage.removeItem('clientCard');
    localStorage.removeItem('clientFicha');
    this.pb.authStore.clear();
    this.global.setRoute('home');
    // this.virtualRouter.routerActive = "home";
    return new Observable<any>((observer) => {
      observer.next(); // Indicar que la operación de cierre de sesión ha completado
      observer.complete();
    });
  }

  setToken(token: any): void {
    localStorage.setItem('accessToken', token);
  }

  setUser(user: UserInterface): void {
    let user_string = JSON.stringify(user);
    let type = JSON.stringify(user.type);
    localStorage.setItem('currentUser', user_string);
    localStorage.setItem('type', type);
  }
}
