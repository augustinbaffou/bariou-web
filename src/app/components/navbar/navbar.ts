
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class NavbarComponent {
  @Input() showMarkers = true;
  @Output() toggleMarkersEvent = new EventEmitter<void>();

  onToggleMarkers() {
    this.toggleMarkersEvent.emit();
  }
}
