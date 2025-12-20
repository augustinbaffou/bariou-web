
import { AfterViewInit, Component, Input, OnChanges } from '@angular/core';
import * as Leaflet from 'leaflet';

export interface BarMarker {
  lat: number;
  lng: number;
  name: string;
  rank: string;
  description?: string;
}

@Component({
  selector: 'app-leaflet-map',
  templateUrl: './leaflet-map.html',
  styleUrls: ['./leaflet-map.scss'],
  standalone: true
})
export class LeafletMapComponent implements AfterViewInit, OnChanges {
  @Input() markers: BarMarker[] = [];
  @Input() showMarkers = true;

  private map!: Leaflet.Map;
  private markersLayer = new Leaflet.LayerGroup();

  ngAfterViewInit(): void {
    this.initializeMap();
    this.addMarkersToMap();
  }

  ngOnChanges(): void {
    if (this.map) {
      this.toggleMarkersVisibility();
    }
  }

  private initializeMap(): void {
    this.map = Leaflet.map('map').setView([47.218371, -1.553621], 14);

    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    this.markersLayer.addTo(this.map);
  }

  private addMarkersToMap(): void {
    this.markers.forEach(marker => {
      this.addBarMarker(marker);
    });
  }

  private toggleMarkersVisibility(): void {
    if (this.showMarkers) {
      this.markersLayer.addTo(this.map);
    } else {
      this.markersLayer.remove();
    }
  }

  private addBarMarker(marker: BarMarker): void {
    const popupContent = `
      <div class="p-1">
        <h3 class="text-lg font-bold text-gray-900 mb-1">${marker.name}</h3>
        <p class="text-sm text-gray-600 mb-3">${marker.description || 'Un super endroit pour se détendre entre amis.'}</p>
        <button class="w-full bg-indigo-600 text-white text-xs font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
          Voir les détails
        </button>
      </div>
    `;

    const customOptions = {
      maxWidth: 250,
      className: 'custom-leaflet-popup'
    };

    Leaflet.marker([marker.lat, marker.lng])
      .addTo(this.markersLayer)
      .setIcon(Leaflet.icon({
        iconUrl: 'markers/custom/' + marker.rank + '.png',
        iconSize: [64, 64],
        iconAnchor: [32, 64]
      }))
      .bindPopup(popupContent, customOptions);
  }
}
