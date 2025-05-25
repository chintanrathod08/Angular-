import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [HttpClientModule,
    ReactiveFormsModule
  ],
})
export class AppModule {}
