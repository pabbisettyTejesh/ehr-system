import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  template: `<span class="skeleton-block" [style.width]="width" [style.height]="height" [style.borderRadius]="radius"></span>`
})
export class SkeletonComponent {
  @Input() width = '100%';
  @Input() height = '14px';
  @Input() radius = 'var(--radius-sm)';
}
