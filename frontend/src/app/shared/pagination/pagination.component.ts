import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pagination-container" *ngIf="totalPages > 1">
      <span class="page-info">Showing {{ startIndex + 1 }} - {{ endIndex }} of {{ totalItems }}</span>
      <div class="page-controls">
        <button class="btn ghost-btn" 
                [disabled]="currentPage === 1" 
                (click)="setPage(currentPage - 1)">
          Previous
        </button>
        <div class="page-numbers">
          <button *ngFor="let p of pages" 
                  class="page-num-btn" 
                  [class.active]="p === currentPage"
                  (click)="setPage(p)">
            {{ p }}
          </button>
        </div>
        <button class="btn ghost-btn" 
                [disabled]="currentPage === totalPages" 
                (click)="setPage(currentPage + 1)">
          Next
        </button>
      </div>
    </div>
  `,
  styles: [`
    .pagination-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      background: transparent;
      font-family: inherit;
    }
    .page-info {
      font-size: 13px;
      color: var(--ink-soft);
      font-weight: 500;
    }
    .page-controls {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .page-numbers {
      display: flex;
      gap: 4px;
    }
    .page-num-btn {
      background: transparent;
      border: 1px solid transparent;
      color: var(--ink-soft);
      font-size: 14px;
      font-weight: 500;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .page-num-btn:hover:not(.active) {
      background: var(--paper);
      color: var(--ink);
    }
    .page-num-btn.active {
      background: var(--ink);
      color: #ffffff;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      transform: translateY(-1px);
    }
    .ghost-btn {
      background: var(--surface);
      border: 1px solid var(--line);
      color: var(--ink);
      padding: 6px 16px;
      font-size: 13px;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .ghost-btn:hover:not(:disabled) {
      background: var(--paper);
      border-color: var(--ink-soft);
    }
    .ghost-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      background: transparent;
    }
  `]
})
export class PaginationComponent {
  @Input() totalItems = 0;
  @Input() pageSize = 10;
  @Input() currentPage = 1;
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.pageSize, this.totalItems);
  }

  get pages(): number[] {
    const pages = [];
    const maxPagesToShow = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let end = Math.min(this.totalPages, start + maxPagesToShow - 1);

    if (end - start + 1 < maxPagesToShow) {
      start = Math.max(1, end - maxPagesToShow + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }
}
