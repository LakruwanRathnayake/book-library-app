import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BookStateService {
    // Search state
    private _searchTerm = new BehaviorSubject<string>('');
    searchTerm$ = this._searchTerm.asObservable();

    // View mode state
    private _viewMode = new BehaviorSubject<'grid' | 'list'>('grid');
    viewMode$ = this._viewMode.asObservable();

    // Add book event
    addBook$ = new Subject<void>();

    get searchTerm(): string {
        return this._searchTerm.value;
    }

    get viewMode(): 'grid' | 'list' {
        return this._viewMode.value;
    }

    setSearchTerm(term: string): void {
        this._searchTerm.next(term);
    }

    setViewMode(mode: 'grid' | 'list'): void {
        this._viewMode.next(mode);
    }

    triggerAddBook(): void {
        this.addBook$.next();
    }
}
