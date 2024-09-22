import { Component } from '@angular/core';
import { ConfigService } from '@app/services/config.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
constructor(public configService:ConfigService){}
}
