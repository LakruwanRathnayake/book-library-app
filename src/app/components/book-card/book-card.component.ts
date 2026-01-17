import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Book } from '../../services/book.service';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.css']
})
export class BookCardComponent {
  @Input() book!: Book;
  @Input() viewMode: 'grid' | 'list' = 'grid';
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  stars = [1, 2, 3, 4, 5];

  onEdit(): void {
    this.edit.emit();
  }

  onDelete(): void {
    this.delete.emit();
  }

  getStarIcon(star: number): string {
    return star <= this.book.rating ? '⭐' : '☆';
  }

  onImageError(event: any): void {
    // Replace with high-quality fallback image
    event.target.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop&q=80';

    // Optional: Add error class for styling
    event.target.classList.add('image-error');
  }
}
