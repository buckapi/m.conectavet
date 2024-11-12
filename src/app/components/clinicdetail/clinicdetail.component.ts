import { CommonModule } from '@angular/common';
import { Component,OnInit ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { GlobalService } from '@app/services/global.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DeviceService } from '@app/services/device.service';
import { RealtimeProfessionalsService } from '@app/services/realtime-professional.service';
import { AuthPocketbaseService } from '@app/services/auth-pocketbase.service';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clinicdetail',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
  templateUrl: './clinicdetail.component.html',
  styleUrl: './clinicdetail.component.css'
})
export class ClinicdetailComponent implements OnInit {
  isMobile: boolean = false;
  selectedDates: any; 
  selectedService: any = null;
  
  constructor(
    public device:DeviceService,
    public breakpointObserver: BreakpointObserver,
    public global:GlobalService,
    public auth:AuthPocketbaseService,
    public realtimeProfessionals:RealtimeProfessionalsService
  ){}
  
  getQuantityInCart(serviceId:string) {
    const serviceInCart = this.global.cart.find(item => item.id === serviceId);
    return serviceInCart ? serviceInCart.quantity : 0;
  }
  goToOrden() {
    // Lógica para redirigir a la página de la orden pendiente
    console.log('Redirigir a la orden pendiente...');
  }
  addToCart(service: any) {
    if (!this.global.cart) {
      this.global.cart = [];
    }
  
    const clinicInCart = this.global.cart.length > 0 ? this.global.cart[0].clinicId : null;
    const currentClinicId = this.global.clinicSelected.id;
  
    if (clinicInCart && clinicInCart !== currentClinicId) {
      // Mostrar alerta si la clínica es diferente
      Swal.fire({
        title: 'Orden pendiente',
        html: 'Para crear una nueva orden, usted debe completar la orden que tiene pendiente.',
        icon: 'warning',
        showConfirmButton: true,
        confirmButtonText: 'Entendido'
      });
      return;
    }
  
    // Agregar servicio al carrito
    const existingService = this.global.cart.find(item => item.id === service.id);
    if (existingService) {
      existingService.quantity += 1;
    } else {
      this.global.cart.push({ ...service, quantity: 1, clinicId: currentClinicId });
    }
  
    // Guardar en localStorage
    this.saveCartToLocalStorage();
  }
  saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.global.cart));
  }  
  
  selectService(service: any) {
    // Verifica si el carrito tiene servicios de otra clínica
    const clinicInCart = this.global.cart.length > 0 ? this.global.cart[0].clinicId : null;
    const currentClinicId = this.global.clinicSelected.id;
  
    if (clinicInCart && clinicInCart !== currentClinicId) {
      // Mostrar alerta de advertencia con SweetAlert2
      Swal.fire({
        title: 'Orden pendiente',
        html: 'Para crear una nueva orden, usted debe <a href="javascript:void(0)" style="text-decoration: underline;" id="goToOrderLink">completar la orden</a> que tiene pendiente.',
        icon: 'warning',
        showConfirmButton: false
      });
      return; // Evita que seleccione el servicio
    }
  
    // Selecciona el servicio si pertenece a la misma clínica o el carrito está vacío
    this.selectedService = service;
  }
  
  
  isServiceSelected(service: any): boolean {
    return this.selectedService === service;
  }
  ngOnInit() {
    this.device.isMobile().subscribe(isMobile => {
      this.isMobile = isMobile;
    });
  
    // Cargar el carrito desde localStorage si existe
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.global.cart = JSON.parse(savedCart);
    }
    
  }
  shouldShowStepper(service: any): boolean {
    const serviceInCart = this.global.cart.find(item => item.id === service.id);
    const quantityInCart = serviceInCart ? serviceInCart.quantity : 0;
    
    // Mostrar si el servicio está seleccionado o si su cantidad en el carrito es mayor a 0
    return this.isServiceSelected(service) || quantityInCart > 0;
  }
  isSameClinic(service: any): boolean {
    // Verifica si el carrito está vacío o si el primer servicio en el carrito es de la misma clínica
    if (!this.global.cart || this.global.cart.length === 0) {
      return true;
    }
  
    // Compara el `clinicId` del primer servicio en el carrito con el `global.clinicSelected.id`
    const clinicInCart = this.global.cart[0].clinicId;
    return clinicInCart === this.global.clinicSelected.id;
  }
  
  removeFromCart(service: any) {
    if (!this.global.cart) {
      this.global.cart = [];
    }
  
    const existingService = this.global.cart.find(item => item.id === service.id);
    if (existingService) {
      if (existingService.quantity > 1) {
        existingService.quantity -= 1;
      } else {
        this.global.cart = this.global.cart.filter(item => item.id !== service.id);
      }
    }
  
    // Guardar en localStorage
    this.saveCartToLocalStorage();
  }
  
  
  }