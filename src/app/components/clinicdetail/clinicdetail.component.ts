import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GlobalService } from '@app/services/global.service';

@Component({
  selector: 'app-clinicdetail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clinicdetail.component.html',
  styleUrl: './clinicdetail.component.css'
})
export class ClinicdetailComponent {
  constructor(
    public global:GlobalService,
  ){}
  }