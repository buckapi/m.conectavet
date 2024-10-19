import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GlobalService } from '@app/services/global.service';
import { RealtimeServicesService } from '@app/services/realtime-services.service';

@Component({
  selector: 'app-activeservices',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activeservices.component.html',
  styleUrl: './activeservices.component.css'
})
export class ActiveservicesComponent {
constructor(
  public global:GlobalService,
  public realtimeServices: RealtimeServicesService,
  
){}
}
