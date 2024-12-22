import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import mapboxgl from 'mapbox-gl';
import { MarkersService, Marker } from '@app/services/markers.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
  private map!: mapboxgl.Map;
  private markers: Marker[] = [];
  
  constructor(private markersService: MarkersService) {
    // Token público de Mapbox
    (mapboxgl as any).accessToken = 'pk.eyJ1IjoiY29uZWN0YXZldC1jb20iLCJhIjoiY20ybDZpc2dmMDhpMDJpb21iZGI1Y2ZoaCJ9.WquhO_FA_2FM0vhYBaZ_jg';
  }

  ngOnInit() {
    console.log('Iniciando componente de mapa');
    this.loadMarkers();
  }

  ngAfterViewInit() {
    this.initializeMap();
  }

  private loadMarkers() {
    console.log('Cargando marcadores...');
    this.markersService.getMarkers().subscribe({
      next: (markers) => {
        console.log('Marcadores recibidos:', markers);
        this.markers = markers;
        if (this.map) {
          this.addMarkersToMap();
        }
      },
      error: (error) => {
        console.error('Error al cargar los marcadores:', error);
      }
    });
  }

  private initializeMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-70.6483, -33.4489], // Santiago, Chile coordinates
      zoom: 13
    });

    // Agregar controles de navegación
    this.map.addControl(new mapboxgl.NavigationControl());

    // Esperar a que el mapa esté completamente cargado
    this.map.on('load', () => {
      console.log('Mapa cargado correctamente');
      if (this.markers.length > 0) {
        console.log('Agregando', this.markers.length, 'marcadores al mapa');
        this.addMarkersToMap();
      }
    });
  }

  private addMarkersToMap() {
    // Limpiar marcadores existentes si los hay
    const existingMarkers = document.querySelectorAll('.marker');
    existingMarkers.forEach(marker => marker.remove());

    this.markers.forEach(marker => {
      console.log('Creando marcador para:', marker.name);
      
      // Crear un elemento DIV para el marcador personalizado
      const el = document.createElement('div');
      el.className = 'marker';
      
      // Usar un marcador por defecto de Mapbox si la imagen personalizada no está disponible
      new mapboxgl.Marker()
        .setLngLat([marker.lng, marker.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(
              `<h3>${marker.name}</h3>
               <p>${marker.description}</p>`
            )
        )
        .addTo(this.map);
    });
  }
}
