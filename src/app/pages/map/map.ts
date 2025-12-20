import { AfterViewInit, Component } from '@angular/core';
import * as Leaflet from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.html'
})
export class MapComponent implements AfterViewInit {

  private map!: Leaflet.Map;

  ngAfterViewInit(): void {
    this.map = Leaflet.map('map').setView([47.218371, -1.553621], 14); // Paris

    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    this.addBarMarker(47.21586701600259, -1.552332505406107,
      'Le Pti Zinc', 'A'
    );

    this.addBarMarker(47.21372544912577, -1.5537666949395479,
      'Le Chemin de Traverse', 'S'
    );

    this.addBarMarker(47.21505311084935, -1.556742516429673,
      'Le Tabarnak', 'B'
    );

    this.addBarMarker(47.21570471600971, -1.5525603107226769,
      'John McByrne', 'C'
    );

    this.addBarMarker(47.21122766115359, -1.5567164804819056,
      'La Scierie', 'D'
    );
  }

  // ... existing code ...
  addBarMarker(lat: number, lng: number, name: string, rank: string) {
    const popupContent = `
      <div class="p-1">
        <h3 class="text-lg font-bold text-gray-900 mb-1">${name}</h3>
        <p class="text-sm text-gray-600 mb-3">Un super endroit pour se détendre entre amis.</p>
        <button class="w-full bg-indigo-600 text-white text-xs font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
          Voir les détails
        </button>
      </div>
    `;

    const customOptions = {
      maxWidth: 250,
      className: 'custom-leaflet-popup'
    };

    Leaflet.marker([lat, lng])
      .addTo(this.map)
      .setIcon(Leaflet.icon({
        iconUrl: 'markers/custom/' + rank + '.png',
        iconSize: [64, 64],
        iconAnchor: [32, 64]
      }))
      .bindPopup(popupContent, customOptions);
  }
}
