import {Component, OnInit} from '@angular/core';
import {LeafletMapComponent} from '../../components/leaflet-map/leaflet-map';
import {NavbarComponent} from '../../components/navbar/navbar';
import {OverpassElement, OverpassService} from '../../services/overpass.service';
import {catchError, Observable, of, shareReplay, tap} from 'rxjs';
import {map} from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
import {BarMarker} from '../../commun/bar.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.html',
  standalone: true,
  imports: [
    LeafletMapComponent,
    NavbarComponent,
    AsyncPipe
  ]
})
export class MapComponent implements OnInit {
  showMarkers = true;

  bars$!: Observable<BarMarker[]>;
  isLoading = true;

  constructor(private overpassService: OverpassService) {
  }

  ngOnInit(): void {
    this.loadBarsFromOverpass();
  }

  private loadBarsFromOverpass(): void {
    console.log('Chargement des bars depuis Overpass...');
    this.bars$ = this.overpassService.getBarsInNantes().pipe(
      map((elements: OverpassElement[]) => this.convertToBarMarkers(elements)),
      tap(bars => {
        console.log('Bars chargés depuis Overpass, count =', bars.length);
        this.isLoading = false;
      }),
      catchError(error => {
        console.error('Erreur lors du chargement des bars:', error);
        this.isLoading = false;
        return of([]);
      }),
      shareReplay(1)
    );
  }

  private convertToBarMarkers(elements: OverpassElement[]): BarMarker[] {
    const possibleRanks = ['S', 'A', 'B', 'C', 'D'];
    return elements.map(element => {
      const randomValue = Math.random();
      let rank: string;
      if (randomValue < 0.75) {
        rank = 'NA';
      } else {
        rank = possibleRanks[Math.floor(Math.random() * possibleRanks.length)];
      }
      return {
        lat: element.lat,
        lng: element.lon,
        name: element.tags.name || 'Bar sans nom',
        rank: rank,
        description: this.buildDescription(element.tags)
      };
    });
  }

  private buildDescription(tags: any): string {
    const parts: string[] = [];

    if (tags['contact:street'] && tags['contact:housenumber']) {
      parts.push(`${tags['contact:housenumber']} ${tags['contact:street']}`);
    }

    if (tags['opening_hours']) {
      parts.push(`Horaires: ${tags['opening_hours']}`);
    }

    if (tags['contact:phone']) {
      parts.push(`Tél: ${tags['contact:phone']}`);
    }

    return parts.length > 0 ? parts.join(' • ') : 'Un super endroit pour se détendre entre amis.';
  }

  toggleMarkers(): void {
    this.showMarkers = !this.showMarkers;
  }
}
