import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Resource } from '../../interfaces/resource.interface';

@Component({
  selector: 'app-resource-card',
  imports: [RouterLink],
  templateUrl: './resource-card.html',
  styleUrl: './resource-card.css',
})
export class ResourceCard {
  resource = input.required<Resource>();

  imageFailed = false;
}
