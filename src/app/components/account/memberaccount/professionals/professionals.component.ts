import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthPocketbaseService } from '@app/services/auth-pocketbase.service';
import { GlobalService } from '@app/services/global.service';
import { RealtimeProfessionalsService } from '@app/services/realtime-professional.service';
import { Observable } from 'rxjs';

export interface Professional {
  name: string; 
  gender:string;
    images?: string; // JSON array or object
    services?: string[]; // JSON array or object
    IdMember?: string; // ID del miembro
    status?: string; 
}
@Component({
  selector: 'app-professionals',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './professionals.component.html',
  styleUrls: ['./professionals.component.css'], // Fixed styleUrls typo
})
export class ProfessionalsComponent implements OnInit {
  constructor(
    public auth:AuthPocketbaseService,
    public global: GlobalService,
    public realtimeProfessionals: RealtimeProfessionalsService,
  ) {
    // Assign the observable to a public property
    this.realtimeProfessionals.professionals$;
  }
  ngOnInit() {
    this.realtimeProfessionals.professionals$.subscribe(professionals => {
      console.log(professionals); // Verifica los datos que se reciben
    });
  }
}
