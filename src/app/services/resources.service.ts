import { Injectable, computed, signal } from '@angular/core';

import { Resource } from '../interfaces/resource.interface';

@Injectable({ providedIn: 'root' })
export class ResourcesService {
  private readonly items = signal<Resource[]>([
    {
      id: 1,
      title: 'MDN Web Docs',
      url: 'https://developer.mozilla.org/en-US/',
      description: 'HTML, CSS and JavaScript documentation with examples.',
      category: 'Development',
      resourceType: 'Documentation',
      tags: ['Web', 'Tutorials'],
      imageUrl: '/images/mdn.svg',
      author: {
        id: 1,
        name: 'Demo user',
        email: 'user@freehub.demo',
        role: 'user',
      },
      createdAt: '2026-10-19',
    },
    {
      id: 2,
      title: 'Excalidraw',
      url: 'https://excalidraw.com/',
      description: 'A tool for drawing diagrams and organizing ideas.',
      category: 'Design',
      resourceType: 'Tool',
      tags: ['Open source'],
      imageUrl: '/images/excalidraw.svg',
      author: {
        id: 2,
        name: 'Demo admin',
        email: 'admin@freehub.demo',
        role: 'admin',
      },
      createdAt: '2026-10-18',
    },
    {
      id: 3,
      title: 'freeCodeCamp',
      url: 'https://www.freecodecamp.org/',
      description: 'Courses and exercises to practice programming and web development.',
      category: 'Learning',
      resourceType: 'Course',
      tags: ['Tutorials', 'Web'],
      imageUrl: '/images/freecodecamp.svg',
      author: {
        id: 1,
        name: 'Demo user',
        email: 'user@freehub.demo',
        role: 'user',
      },
      createdAt: '2026-10-17',
    },
  ]);

  readonly resources = this.items.asReadonly();

  readonly categories = ['Development', 'Design', 'Learning'];
  readonly tags = ['Web', 'Open source', 'Tutorials'];
  readonly resourceTypes = ['Documentation', 'Tool', 'Course'];

  readonly searchText = signal('');
  readonly category = signal('');
  readonly tag = signal('');
  readonly resourceType = signal('');

  readonly filteredResources = computed(() => {
    return this.resources().filter((resource) => {
      const matchesTitle = resource.title.toLowerCase().includes(this.searchText());
      const matchesCategory = this.category() === '' || resource.category === this.category();
      const matchesTag = this.tag() === '' || resource.tags.includes(this.tag());
      const matchesType =
        this.resourceType() === '' || resource.resourceType === this.resourceType();

      return matchesTitle && matchesCategory && matchesTag && matchesType;
    });
  });

  search(value: string): void {
    this.searchText.set(value.trim().toLowerCase());
  }

  clearFilters(): void {
    this.searchText.set('');
    this.category.set('');
    this.tag.set('');
    this.resourceType.set('');
  }

  addResource(resource: Resource): Resource {
    const savedResource: Resource = {
      ...resource,
      id: Math.max(0, ...this.resources().map((item) => item.id)) + 1,
    };

    this.items.update((resources) => [savedResource, ...resources]);

    return savedResource;
  }
}
