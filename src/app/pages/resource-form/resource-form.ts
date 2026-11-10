import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Resource } from '../../interfaces/resource.interface';
import { AuthService } from '../../services/auth.service';
import { ResourcesService } from '../../services/resources.service';

@Component({
  selector: 'app-resource-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './resource-form.html',
  styleUrl: './resource-form.css',
})
export class ResourceForm {
  catalog = inject(ResourcesService);
  auth = inject(AuthService);

  private router = inject(Router);

  error = '';

  form = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    url: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    category: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    resourceType: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    tags: new FormControl<string[]>([], {
      nonNullable: true,
    }),
    imageUrl: new FormControl('', {
      nonNullable: true,
    }),
  });

  onSubmit(): void {
    this.error = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const author = this.auth.user();

    if (!author) {
      this.error = 'Choose a demo profile before publishing.';
      return;
    }

    const values = this.form.getRawValue();
    const title = values.title.trim();
    const description = values.description.trim();
    const url = values.url.trim();
    const imageUrl = values.imageUrl.trim();

    if (title === '' || description === '') {
      this.error = 'Title and description cannot be blank.';
      return;
    }

    if (!url.startsWith('https://') && !url.startsWith('http://')) {
      this.error = 'The URL must start with http:// or https://.';
      return;
    }

    if (imageUrl !== '' && !imageUrl.startsWith('https://') && !imageUrl.startsWith('http://')) {
      this.error = 'The image URL must start with http:// or https://.';
      return;
    }

    const newResource: Resource = {
      id: 0,
      title: title,
      url: url,
      description: description,
      category: values.category,
      resourceType: values.resourceType,
      tags: values.tags,
      imageUrl: imageUrl,
      author: author,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    const savedResource = this.catalog.addResource(newResource);

    this.catalog.clearFilters();
    this.router.navigate(['/resources', savedResource.id]);
  }
}
