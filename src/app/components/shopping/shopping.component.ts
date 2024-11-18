import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCommonModule } from '@angular/material/core';
import { GlobalService } from '@app/services/global.service';
import { AuthboxComponent } from "../sections/authbox/authbox.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shopping',
  standalone: true,
  imports: [MatCommonModule, CommonModule, AuthboxComponent, FormsModule],
  templateUrl: './shopping.component.html',
  styleUrl: './shopping.component.css'
})
export class ShoppingComponent {
  isMobile: boolean = false;
  shippingAddress: string = '';

  
constructor(public global: GlobalService){

} 

ngOnInit(): void {
  // Detectar si es dispositivo móvil
  this.checkMobileDevice();
  // Escuchar cambios en el tamaño de la ventana
  window.addEventListener('resize', () => {
    this.checkMobileDevice();
  });
}

private checkMobileDevice(): void {
  this.isMobile = window.innerWidth < 992; // Bootstrap lg breakpoint
}

calculateTotal(): number {
  let subtotal = 0;
  this.global.cart.forEach(item => {
      subtotal += item.price * item.quantity;
  });
  
  // Agregar 7% de comisión Conectavet
  const comision = subtotal * 0.07;
  
  return subtotal + comision;
}
ngOnDestroy(): void {
  // Remover el event listener cuando el componente se destruye
  window.removeEventListener('resize', () => {
    this.checkMobileDevice();
  });
}

increaseQuantity(item: any) {
    item.quantity = (item.quantity || 1) + 1;
    this.updateCart();
}

decreaseQuantity(item: any) {
    if (item.quantity > 1) {
        item.quantity--;
        this.updateCart();
    }
}

updateCart() {
    // Actualizar totales y cantidad en el carrito
    this.global.cartQuantity = this.global.cart.reduce((total, item) => total + item.quantity, 0);
    // Puedes agregar aquí cualquier otra lógica necesaria para actualizar el carrito
}


  // ... existing code ...

 removeItem(item: any) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas eliminar este producto del carrito?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const index = this.global.cart.indexOf(item);
        if (index > -1) {
          this.global.cart.splice(index, 1);
          this.global.cartQuantity = this.global.cart.reduce((total, item) => total + item.quantity, 0);
          
          // Actualizar localStorage
          localStorage.setItem('cart', JSON.stringify(this.global.cart));
          
          Swal.fire(
            '¡Eliminado!',
            'El producto ha sido eliminado del carrito.',
            'success'
          );
        }
      }
    });
}
}

