import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthPocketbaseService } from '@app/services/auth-pocketbase.service';
import { DeviceService } from '@app/services/device.service';
import { GlobalService } from '@app/services/global.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  isMobile: boolean = false;
  option: string = '';
  currentStep: number = 1;
  circles: number[] = [1, 2, 3];
  
  // Propiedades para el registro de usuario
  name: string = '';
  email: string = '';
  password: string = '';
  address: string = ''; // Nueva propiedad para la dirección del usuario
  
  // Propiedades para el registro de clínica
  clinicName: string = '';
  clinicEmail: string = '';
  clinicPhone: string = '';
  clinicAddress: string = '';
  clinicPassword: string = '';
  
  constructor(
    public global: GlobalService,
    public auth: AuthPocketbaseService,
    public device: DeviceService
  ) {}

  nextStep() {
    if (this.currentStep < this.circles.length) {
      this.currentStep++;
      this.updateProgress();
    }
  }

  updateProgress() {
    const indicator: HTMLElement | null = document.querySelector('.indicator');
    if (indicator) {
      const progressPercentage = ((this.currentStep - 1) / (this.circles.length - 1)) * 100;
      indicator.style.width = `${progressPercentage}%`;
    }

    const circles = document.querySelectorAll('.circle');
    circles.forEach((circle, index) => {
      if (index < this.currentStep) {
        circle.classList.add('active');
      } else {
        circle.classList.remove('active');
      }
    });
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateProgress();
    }
  }
  
  setOption(option: string) {
    if (option != '') {
      this.nextStep();
    } else {
      this.previousStep();
    }
    this.global.option = option;
  }

  ngOnInit() {
    this.device.isMobile().subscribe(isMobile => {
      this.isMobile = isMobile;
    });
  }

  // Método para registrar usuario
  registerUser() {
    this.auth.registerUser(this.email, this.password, 'tutor', this.name, this.address).subscribe(
      (response) => {
        console.log('Usuario registrado exitosamente', response);
        this.loginAfterRegistration(this.email, this.password);
      },
      (error) => {
        console.error('Error al registrar usuario', error);
      }
    );
  }

  // Método para registrar clínica
  registerClinic() {
    this.auth.registerUser(this.clinicEmail, this.clinicPassword, 'clinica', this.clinicName, this.clinicAddress).subscribe(
      (response) => {
        console.log('Clínica registrada exitosamente', response);
        // Aquí podrías agregar lógica adicional para guardar los datos específicos de la clínica
        this.loginAfterRegistration(this.clinicEmail, this.clinicPassword);
      },
      (error) => {
        console.error('Error al registrar clínica', error);
      }
    );
  }

   // Método para registrar tutor
   registerTutor() {
     if (this.name && this.email && this.password) {
       this.auth.registerUser(this.email, this.password, 'tutor', this.name,'').subscribe(
         (response) => {
           console.log('Tutor registrado exitosamente', response);
           this.loginAfterRegistration(this.email, this.password);
         },
         (error) => {
           console.error('Error al registrar tutor', error);
         }
       );
     } else {
       console.error('Por favor, complete todos los campos requeridos');
     }
   }

  // Método para iniciar sesión después del registro
  loginAfterRegistration(email: string, password: string) {
    this.auth.loginUser(email, password).subscribe(
      (response) => {
        console.log('Inicio de sesión exitoso', response);
        this.global.setRoute('home'); // O la ruta que desees después del inicio de sesión
      },
      (error) => {
        console.error('Error al iniciar sesión después del registro', error);
        this.global.setRoute('login'); // Redirigir al login en caso de error
      }
    );
  }
}
