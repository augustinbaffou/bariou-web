import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface OverpassElement {
  type: string;
  id: number;
  lat: number;
  lon: number;
  tags: {
    amenity: string;
    name?: string;
    [key: string]: any;
  };
}

export interface OverpassResponse {
  version: number;
  generator: string;
  osm3s: {
    timestamp_osm_base: string;
    timestamp_areas_base: string;
    copyright: string;
  };
  elements: OverpassElement[];
}

@Injectable({
  providedIn: 'root'
})
export class OverpassService {
  private readonly API_URL = 'https://overpass-api.de/api/interpreter';

  private readonly SEARCH_RADIUS = 7500;
  private readonly NANTES_CENTER_LAT = 47.218371;
  private readonly NANTES_CENTER_LNG = -1.553621;

  private readonly AMENITY_BAR_KEY = 'bar';
  private readonly AMENITY_CAFE_KEY = 'cafe';
  private readonly AMENITY_PUB_KEY = 'pub';

  constructor(private http: HttpClient) {}

  getBarsInNantes(): Observable<OverpassElement[]> {
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"=${this.AMENITY_BAR_KEY}](around:${this.SEARCH_RADIUS},${this.NANTES_CENTER_LAT},${this.NANTES_CENTER_LNG});
        node["amenity"=${this.AMENITY_CAFE_KEY}](around:${this.SEARCH_RADIUS},${this.NANTES_CENTER_LAT},${this.NANTES_CENTER_LNG});
        node["amenity"=${this.AMENITY_PUB_KEY}](around:${this.SEARCH_RADIUS},${this.NANTES_CENTER_LAT},${this.NANTES_CENTER_LNG});

        way["amenity"=${this.AMENITY_BAR_KEY}](around:${this.SEARCH_RADIUS},${this.NANTES_CENTER_LAT},${this.NANTES_CENTER_LNG});
        way["amenity"=${this.AMENITY_CAFE_KEY}](around:${this.SEARCH_RADIUS},${this.NANTES_CENTER_LAT},${this.NANTES_CENTER_LNG});
        way["amenity"=${this.AMENITY_PUB_KEY}](around:${this.SEARCH_RADIUS},${this.NANTES_CENTER_LAT},${this.NANTES_CENTER_LNG});
      );
      out center;
    `;

    return this.http.post<OverpassResponse>(this.API_URL, query, {
      headers: {
        'Content-Type': 'text/plain'
      }
    }).pipe(
      map(response => response.elements)
    );
  }
}
