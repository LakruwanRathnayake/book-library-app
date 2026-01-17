import { Component, HostListener, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms'; // ADD THIS
import { BookStateService } from '../../services/book-state.service';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: false // or true if using standalone
})
export class HeaderComponent implements OnDestroy, AfterViewInit {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  viewMode: 'grid' | 'list' = 'grid';
  searchTerm = '';
  isScrolled = false;
  private routerSubscription!: Subscription;

  constructor(
    private router: Router,
    private bookState: BookStateService
  ) {
    // Initialize with default grid view
    this.viewMode = 'grid';

    this.routerSubscription = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        this.clearSearch();
      });
  }

  ngAfterViewInit() {
    // Sync with service after view init
    this.viewMode = this.bookState.viewMode || 'grid';
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.pageYOffset > 20;
  }
  onSearch(): void {  // Remove $event parameter
    const input = this.searchInput.nativeElement;
    this.searchTerm = input.value;
    this.bookState.setSearchTerm(this.searchTerm);
  }
  clearSearch(): void {
    this.searchTerm = '';
    this.bookState.setSearchTerm('');
    if (this.searchInput) {
      this.searchInput.nativeElement.focus();
    }
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
    this.bookState.setViewMode(mode);
  }

  onAddBook(): void {
    this.bookState.triggerAddBook();
  }

  navigateHome(): void {
    this.router.navigate(['/books']);
  }

  // header.component.ts - CORRECT onSearch method



  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
