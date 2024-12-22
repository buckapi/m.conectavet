import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Marker {
  id: number;
  name: string;
  lat: number;
  lng: number;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class MarkersService {
  private markers: Marker[] = [
    {
      id: 1,
      name: 'Clínica Veterinaria Central',
      lat: -33.4489,
      lng: -70.6483,
      description: 'Atención 24/7, Urgencias veterinarias'
    },
    {
      id: 2,
      name: 'Hospital Veterinario Norte',
      lat: -33.4372,
      lng: -70.6506,
      description: 'Especialistas en cirugía y tratamientos avanzados'
    },
    {
      id: 3,
      name: 'Centro Veterinario Sur',
      lat: -33.4596,
      lng: -70.6455,
      description: 'Servicios de emergencia y hospitalización'
    }
  ];

  constructor() { }

  getMarkers(): Observable<Marker[]> {
    return of(this.markers);
  }
}
