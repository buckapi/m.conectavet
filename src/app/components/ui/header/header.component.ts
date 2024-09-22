import { CommonModule } from '@angular/common';
import { Component,HostListener } from '@angular/core';
import { CategoriesComponent } from '@app/components/categories/categories.component';
import { GlobalService } from '@app/services/global.service';
import { ServicesComponent } from "../../services/services.component";
import { ReeldetailComponent } from '@app/components/reeldetail/reeldetail.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ ReeldetailComponent, 
      CommonModule, CategoriesComponent, ServicesComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
 constructor(public global:GlobalService){}
  // Detectamos el evento de scroll
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > this.global.lastScrollTop && currentScroll > this.global.scrollThreshold) {
      // Si se desplaza hacia abajo más de 200 píxeles
      this.global.isScrollingDown = true;
    } else if (currentScroll < this.global.lastScrollTop) {
      // Si se desplaza hacia arriba
      this.global.isScrollingDown = false;
    }

    this.global.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // Para evitar valores negativos
  }
  toggleScroll() {
    // Si está a menos de 350 píxeles del top, desplazamos la ventana a esa altura
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    const targetScroll = 390;
  
    if (currentScroll < targetScroll) {
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  
    // Alternamos el estado de isScrollingDown
    this.global.isScrollingDown = !this.global.isScrollingDown;
  }
  
}
