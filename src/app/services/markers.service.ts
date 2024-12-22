import { Injectable } from '@angular/core';
import { RealtimeSpecialistsService } from './realtime-specialists.service';
import { Observable, map } from 'rxjs';

export interface Marker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description: string;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class MarkersService {
  private markers$: Observable<Marker[]>;

  // Límites aproximados de Santiago
  private readonly SANTIAGO_BOUNDS = {
    north: -33.3567, // Huechuraba
    south: -33.5147, // La Pintana
    east: -70.5516,  // La Reina
    west: -70.7516   // Pudahuel
  };

  constructor(private realtimeService: RealtimeSpecialistsService) {
    this.markers$ = this.realtimeService.specialists$.pipe(
      map(specialists => specialists.map(specialist => {
        const randomCoords = this.getRandomSantiagoCoordinates();
        return {
          id: specialist.id,
          name: `${specialist.full_name }`,
          lat: specialist.latitude || randomCoords.lat,
          lng: specialist.longitude || randomCoords.lng,
          description: `${specialist.specialty || 'Veterinario'} - ${specialist.status || 'Disponible'}`,
          imageUrl: specialist.images?.[0] || 'assets/images/default-profile.png'
        };
      }))
    );
  }

  private getRandomSantiagoCoordinates(): { lat: number; lng: number } {
    const lat = this.SANTIAGO_BOUNDS.south + 
                (Math.random() * (this.SANTIAGO_BOUNDS.north - this.SANTIAGO_BOUNDS.south));
    const lng = this.SANTIAGO_BOUNDS.west + 
                (Math.random() * (this.SANTIAGO_BOUNDS.east - this.SANTIAGO_BOUNDS.west));
    
    return {
      lat: Number(lat.toFixed(6)),
      lng: Number(lng.toFixed(6))
    };
  }

  getMarkers(): Observable<Marker[]> {
    return this.markers$;
  }
}
