import { Component, OnInit, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import mapboxgl from 'mapbox-gl';
import { MarkersService, Marker } from '@app/services/markers.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  private map!: mapboxgl.Map;
  private markers: Marker[] = [];
  private markerSubscription: Subscription;
  private userLocationMarker?: mapboxgl.Marker;

  @Input() centerLat: number = -33.4489; // Santiago, Chile por defecto
  @Input() centerLng: number = -70.6483;

  constructor(private markersService: MarkersService) {
    // Token público de Mapbox
    (mapboxgl as any).accessToken = 'pk.eyJ1IjoiY29uZWN0YXZldC1jb20iLCJhIjoiY20ybDZpc2dmMDhpMDJpb21iZGI1Y2ZoaCJ9.WquhO_FA_2FM0vhYBaZ_jg';
    this.markerSubscription = this.markersService.getMarkers().subscribe(
      markers => {
        this.markers = markers;
        if (this.map) {
          this.addMarkersToMap();
        }
      }
    );
  }

  ngOnInit() {
    // Ya no necesitamos loadMarkers() aquí
  }

  ngOnDestroy() {
    if (this.markerSubscription) {
      this.markerSubscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.initializeMap();
  }

  private createUserLocationMarker(lngLat: [number, number]) {
    // Eliminar el marcador anterior si existe
    if (this.userLocationMarker) {
      this.userLocationMarker.remove();
    }

    // Crear elemento para el marcador personalizado
    const el = document.createElement('div');
    el.className = 'user-location-marker';
    el.style.backgroundImage = 'url(assets/images/markerred.png)';
    el.style.width = '32px';
    el.style.height = '32px';
    el.style.backgroundSize = 'cover';
    el.style.cursor = 'pointer';

    // Crear el nuevo marcador
    this.userLocationMarker = new mapboxgl.Marker(el)
      .setLngLat(lngLat)
      .addTo(this.map);
  }

  private async initializeMap() {
    try {
      // Intentar obtener la ubicación del usuario antes de inicializar el mapa
      const position = await this.getCurrentPosition();
      const initialCenter: [number, number] = position ? 
        [position.coords.longitude, position.coords.latitude] : 
        [-70.6483, -33.4489]; // Coordenadas por defecto si falla la geolocalización

      // Inicializar el mapa con la ubicación del usuario
      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: initialCenter,
        zoom: 15,
        language: 'es',
        maxZoom: 19,
        minZoom: 11,
        pitch: 45,
        bearing: -17.6
      });

      // Agregar controles de navegación
      this.map.addControl(
        new mapboxgl.NavigationControl({
          showCompass: true,
          showZoom: true,
          visualizePitch: true
        })
      );

      // Agregar control de geolocalización
      this.map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      }));

      // Si tenemos la posición del usuario, crear el marcador
      if (position) {
        this.createUserLocationMarker([position.coords.longitude, position.coords.latitude]);
      }

      // Iniciar el seguimiento de la ubicación
      this.startLocationTracking();

      // Configurar el idioma del mapa cuando se cargue
      this.map.on('load', () => {
        // Hacer las calles más visibles
        const streetLayers = {
          'road-street': '#ffffff',
          'road-secondary-tertiary': '#ffffff',
          'road-primary': '#ffffff',
          'road-motorway-trunk': '#ffffff',
          'road-construction': '#ffffff',
          'road-path': '#ffffff',
          'road-steps': '#ffffff',
          'road-pedestrian': '#ffffff'
        };

        // Configurar cada capa de calle
        Object.entries(streetLayers).forEach(([layerId, color]) => {
          if (this.map.getLayer(layerId)) {
            // Hacer las calles más anchas y visibles
            this.map.setPaintProperty(layerId, 'line-width', [
              'interpolate', ['linear'], ['zoom'],
              14, 2,  // zoom 14, ancho 2
              16, 4,  // zoom 16, ancho 4
              18, 6   // zoom 18, ancho 6
            ]);

            // Añadir borde a las calles
            this.map.setPaintProperty(layerId, 'line-color', color);
          }
        });

        // Configurar las etiquetas de las calles
        const labelLayers = [
          'road-label',
          'road-number-shield'
        ];

        labelLayers.forEach(layerId => {
          if (this.map.getLayer(layerId)) {
            // Hacer el texto más grande
            this.map.setLayoutProperty(layerId, 'text-size', [
              'interpolate', ['linear'], ['zoom'],
              14, 14,  // zoom 14, tamaño 14
              16, 16,  // zoom 16, tamaño 16
              18, 18   // zoom 18, tamaño 18
            ]);

            // Hacer el texto más visible
            this.map.setPaintProperty(layerId, 'text-color', '#000000');
            this.map.setPaintProperty(layerId, 'text-halo-color', '#ffffff');
            this.map.setPaintProperty(layerId, 'text-halo-width', 2);

            // Mostrar más etiquetas
            this.map.setLayoutProperty(layerId, 'symbol-placement', 'line');
            this.map.setLayoutProperty(layerId, 'text-field', [
              'coalesce',
              ['get', 'name_es'],
              ['get', 'name']
            ]);
            
            // Aumentar la densidad de etiquetas
            this.map.setLayoutProperty(layerId, 'symbol-spacing', 250);
          }
        });

        // Debug: Imprimir las capas disponibles
        const style = this.map.getStyle();
        if (style && style.layers) {
          console.log('Capas disponibles:', style.layers.map(l => l.id).join(', '));
        }

        // Agregar los marcadores
        this.addMarkersToMap();
      });

      // Hacer zoom out al límite
      this.map.setZoom(0);
    } catch (error) {
      console.error('Error initializing map:', error);
      // Si hay error, inicializar el mapa con las coordenadas por defecto
      this.initializeMapWithDefaultLocation();
    }
  }

  private getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        position => resolve(position),
        error => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    });
  }

  private initializeMapWithDefaultLocation() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-70.6483, -33.4489],
      zoom: 15,
      language: 'es',
      maxZoom: 19,
      minZoom: 11,
      pitch: 45,
      bearing: -17.6
    });

    // Agregar controles de navegación
    this.map.addControl(
      new mapboxgl.NavigationControl({
        showCompass: true,
        showZoom: true,
        visualizePitch: true
      })
    );

    this.startLocationTracking();
  }

  private startLocationTracking() {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          this.createUserLocationMarker([longitude, latitude]);
        },
        (error) => {
          console.log('Error tracking location:', error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 5000
        }
      );
    }
  }

  private fitMapToMarkers() {
    if (this.markers.length === 0) return;

    // Crear un bounds que incluya todos los marcadores
    const bounds = new mapboxgl.LngLatBounds();
    this.markers.forEach(marker => {
      bounds.extend([marker.lng, marker.lat]);
    });

    // Ajustar el mapa para mostrar todos los marcadores con padding
    this.map.fitBounds(bounds, {
      padding: 50,
      maxZoom: 15
    });
  }

  private addMarkersToMap() {
    // Limpiar marcadores existentes
    const existingMarkers = document.getElementsByClassName('mapboxgl-marker');
    Array.from(existingMarkers).forEach((marker: any) => {
      marker.remove();
    });

    this.markers.forEach(marker => {
      // Crear un elemento div para el marcador personalizado
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.backgroundImage = 'url(assets/images/marker.png)';
      el.style.width = '62px';
      el.style.height = '62px';
      el.style.backgroundSize = 'cover';
      
      // Crear el popup con imagen
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="marker-popup">
            <img src="${marker.imageUrl}" alt="${marker.name}" class="marker-image" style="padding: 5px; border-radius: 15%;"/>
            <h3>${marker.name}</h3>
            <p>${marker.description}</p>
          </div>
        `);

      // Crear y agregar el marcador al mapa
      new mapboxgl.Marker(el)
        .setLngLat([marker.lng, marker.lat])
        .setPopup(popup)
        .addTo(this.map);
    });
  }
}
