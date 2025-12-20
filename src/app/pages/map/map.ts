
import { Component } from '@angular/core';
import {BarMarker, LeafletMapComponent} from '../../components/leaflet-map/leaflet-map';
import {NavbarComponent} from '../../components/navbar/navbar';

@Component({
  selector: 'app-map',
  templateUrl: './map.html',
  standalone: true,
  imports: [
    LeafletMapComponent,
    NavbarComponent
  ]
})
export class MapComponent {
  showMarkers = true;

  bars: BarMarker[] = [
    { lat: 47.21586701600259, lng: -1.552332505406107, name: 'Le Pti Zinc', rank: 'A' },
    { lat: 47.21372544912577, lng: -1.5537666949395479, name: 'Le Chemin de Traverse', rank: 'S' },
    { lat: 47.21505311084935, lng: -1.556742516429673, name: 'Le Tabarnak', rank: 'B' },
    { lat: 47.21570471600971, lng: -1.5525603107226769, name: 'John McByrne', rank: 'C' },
    { lat: 47.21122766115359, lng: -1.5567164804819056, name: 'La Scierie', rank: 'D' }
  ];

  toggleMarkers(): void {
    this.showMarkers = !this.showMarkers;
  }
}
