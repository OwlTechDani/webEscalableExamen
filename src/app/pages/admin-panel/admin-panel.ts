import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { ResourcesService } from '../../services/resources.service';

@Component({
  selector: 'app-admin-panel',
  imports: [RouterLink],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css',
})
export class AdminPanel {
  private auth = inject(AuthService);

  catalog = inject(ResourcesService);

  users = this.auth.users;
  tabs = ['Users', 'Resources', 'Categories', 'Tags', 'Resource types'];
  activeTab = 'Users';

  classificationItems(): string[] {
    if (this.activeTab === 'Categories') {
      return this.catalog.categories;
    }

    if (this.activeTab === 'Tags') {
      return this.catalog.tags;
    }

    return this.catalog.resourceTypes;
  }
}
