import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// This wrapper helps Angular resolve the module statically
@NgModule({
  imports: [CommonModule],
  exports: [CommonModule],
})
export class ApexChartsWrapperModule {
  // This method provides a static reference to the problematic module
  static forRoot() {
    return {
      ngModule: CommonModule,
      providers: [],
    };
  }
}
