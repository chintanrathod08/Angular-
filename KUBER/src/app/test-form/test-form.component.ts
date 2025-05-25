// File: src/app/test-form/test-form.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-test-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form">
      <label>Name:</label>
      <input formControlName="name" />
      <p>Form value: {{ form.value | json }}</p>
    </form>
  `,
  providers: [FormBuilder]  
})
export class TestFormComponent {
  form = this.fb.group({
    name: ['']
  });

  constructor(private fb: FormBuilder) {}
}
