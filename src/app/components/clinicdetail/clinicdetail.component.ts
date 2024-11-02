import { CommonModule } from '@angular/common';
import { Component,OnInit ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { GlobalService } from '@app/services/global.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DeviceService } from '@app/services/device.service';
import { RealtimeProfessionalsService } from '@app/services/realtime-professional.service';
import { AuthPocketbaseService } from '@app/services/auth-pocketbase.service';
import { BehaviorSubject } from 'rxjs';
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
  constructor(
    public device:DeviceService,
    public breakpointObserver: BreakpointObserver,
    public global:GlobalService,
    public auth:AuthPocketbaseService,
    public realtimeProfessionals:RealtimeProfessionalsService
  ){}
  ngOnInit() {
    this.device.isMobile().subscribe(isMobile => {
      this.isMobile = isMobile;
    });
  
  }
  

  }