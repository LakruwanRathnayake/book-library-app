import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookService, Book } from '../../services/book.service';
import { BookStateService } from '../../services/book-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit, OnDestroy {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  viewMode: 'grid' | 'list' = 'grid';
  showForm = false;
  selectedBook: Book | null = null;
  loading = false;
  error = '';

  private subscriptions = new Subscription();

  constructor(
    private bookService: BookService,
    private bookState: BookStateService
  ) { }

  ngOnInit(): void {
    this.loadBooks();

    this.subscriptions.add(
      this.bookState.viewMode$.subscribe(mode => {
        this.viewMode = mode;
      })
    );

    this.subscriptions.add(
      this.bookState.searchTerm$.subscribe(term => {
        this.filterBooks(term);
      })
    );

    this.subscriptions.add(
      this.bookState.addBook$.subscribe(() => {
        this.addNewBook();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadBooks(): void {
    this.loading = true;
    this.error = '';
    this.bookService.getBooks().subscribe({
      next: (books) => {
        // Sort by createdAt or ID (newest first)
        this.books = books.sort((a, b) => {
          // Try createdAt first
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          // Fallback to ID
          const idA = Number(a.id) || 0;
          const idB = Number(b.id) || 0;
          return  idA -idB;
        });

        this.filteredBooks = [...this.books];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load books. Please ensure JSON Server is running on port 3000.';
        this.loading = false;
        console.error('Error loading books:', err);
      }
    });
  }

  filterBooks(term: string): void {
    this.filteredBooks = this.books.filter(book =>
      book.title.toLowerCase().includes(term.toLowerCase()) ||
      book.author.toLowerCase().includes(term.toLowerCase())
    );
  }

  addNewBook(): void {
    this.selectedBook = null;
    this.showForm = true;
  }

  editBook(book: Book): void {
    this.selectedBook = book;
    this.showForm = true;
  }

  deleteBook(id: number): void {
    if (!confirm('Are you sure you want to delete this book?')) {
      return;
    }

    this.bookService.deleteBook(id).subscribe({
      next: () => {
        this.loadBooks();
        // Show success message (optional)
        console.log('Book deleted successfully');
      },
      error: (err) => {
        this.error = 'Failed to delete book';
        console.error('Error deleting book:', err);
      }
    });
  }

  saveBook(book: Book): void {
    if (book.id) {
      // Update existing book
      this.bookService.updateBook(book.id, book).subscribe({
        next: () => {
          this.loadBooks();
          this.showForm = false;
        },
        error: (err) => {
          this.error = 'Failed to update book';
          console.error('Error updating book:', err);
        }
      });
    } else {
      // Create new book - add timestamp if not present
      if (!book.createdAt) {
        book.createdAt = new Date().toISOString();
      }

      this.bookService.createBook(book).subscribe({
        next: () => {
          this.loadBooks();
          this.showForm = false;
        },
        error: (err) => {
          this.error = 'Failed to create book';
          console.error('Error creating book:', err);
        }
      });
    }
  }

  cancelForm(): void {
    this.showForm = false;
    this.selectedBook = null;
  }

  // Optional: Add trackBy for performance
  trackByFn(index: number, book: Book): any {
    return book.id;
  }
}
