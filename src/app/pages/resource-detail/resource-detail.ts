import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Comment } from '../../interfaces/comment.interface';
import { Resource } from '../../interfaces/resource.interface';
import { ResourcesService } from '../../services/resources.service';

@Component({
  selector: 'app-resource-detail',
  imports: [RouterLink],
  templateUrl: './resource-detail.html',
  styleUrl: './resource-detail.css',
})
export class ResourceDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private catalog = inject(ResourcesService);

  private allComments: Comment[] = [
    {
      id: 1,
      resourceId: 1,
      author: {
        id: 2,
        name: 'Demo admin',
        email: 'admin@freehub.demo',
        role: 'admin',
      },
      text: 'The CSS examples are useful.',
      createdAt: '2026-10-19',
    },
    {
      id: 2,
      resourceId: 2,
      author: {
        id: 1,
        name: 'Demo user',
        email: 'user@freehub.demo',
        role: 'user',
      },
      text: 'I used it for a project diagram.',
      createdAt: '2026-10-18',
    },
  ];

  resource: Resource | undefined;
  comments: Comment[] = [];
  imageFailed = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));

      this.resource = this.catalog.resources().find((resource) => resource.id === id);
      this.comments = this.allComments.filter((comment) => comment.resourceId === id);
      this.imageFailed = false;
    });
  }
}
