
import { AfterViewInit, Component, Input, OnChanges } from '@angular/core';
import * as Leaflet from 'leaflet';
import {BarMarker} from '../../commun/bar.model';

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

  private iconCache = new Map<string, Leaflet.Icon>();

  ngAfterViewInit(): void {
    this.initializeMap();
    this.refreshMarkers();
  }

  ngOnChanges(changes: import('@angular/core').SimpleChanges): void {
    console.log('LeafletMap ngOnChanges', changes, 'map defined ?', !!this.map);

    if (this.map) {
      if (changes['showMarkers']) {
        console.log('showMarkers changed to', this.showMarkers);
        this.toggleMarkersVisibility();
      }
    }
  }

  private initializeMap(): void {
    this.map = Leaflet.map('map').setView([47.218371, -1.553621], 14);

    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    const center: [number, number] = [47.218371, -1.553621];
    const radius = 7500;

    Leaflet.circle(center, {
      radius,
      color: 'oklch(27.4% 0.072 132.109)',
      weight: 1,
      fillOpacity: 0
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
      this.refreshMarkers();
    } else {
      this.markersLayer.remove();
    }
  }

  private refreshMarkers(): void {
    if (!this.map) return;
    this.markersLayer.clearLayers();
    this.addMarkersToMap();
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
      .setIcon(this.getIconForRank(marker.rank))
      .bindPopup(popupContent, customOptions);
  }

  private getIconForRank(rank: string): Leaflet.Icon {
    if (!this.iconCache.has(rank)) {
      this.iconCache.set(rank, Leaflet.icon({
        iconUrl: 'markers/custom/' + rank + '.png',
        iconSize: [64, 64],
        iconAnchor: [32, 64]
      }));
    }
    return this.iconCache.get(rank)!;
    }
}
