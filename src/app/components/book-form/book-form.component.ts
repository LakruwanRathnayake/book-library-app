import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Book } from '../../services/book.service';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent implements OnInit {
  @Input() book: Book | null = null;
  @Output() onSubmit = new EventEmitter<Book>();
  @Output() onCancel = new EventEmitter<void>();

  bookForm!: FormGroup;
  submitted = false;

  // Image upload properties
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  uploadError: string | null = null;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.bookForm = this.fb.group({
      title: [this.book?.title || '', [Validators.required, Validators.minLength(2)]],
      author: [this.book?.author || '', [Validators.required, Validators.minLength(2)]],
      coverImage: [this.book?.coverImage || '', [Validators.required]],
      rating: [this.book?.rating || 0, [Validators.required, Validators.min(0), Validators.max(5)]],
      category: [this.book?.category || '', [Validators.required]]
    });

    // Set initial preview if editing
    if (this.book?.coverImage) {
      this.imagePreview = this.book.coverImage;
    }
  }

  // Handle file selection
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.uploadError = null;

    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        this.uploadError = 'Only JPG, PNG, and WEBP images are allowed';
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        this.uploadError = 'Image size must be less than 5MB';
        return;
      }

      this.selectedFile = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
        this.bookForm.patchValue({ coverImage: e.target.result });
        this.bookForm.get('coverImage')?.updateValueAndValidity();
      };
      reader.readAsDataURL(file);
    }
  }

  // Remove selected image
  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.uploadError = null;
    this.bookForm.patchValue({ coverImage: '' });

    // Reset file input
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  submitForm(): void {
    this.submitted = true;

    if (this.bookForm.valid) {
      const formValue = this.bookForm.value;

      if (this.book?.id) {
        formValue.id = this.book.id;
        formValue.createdAt = this.book.createdAt; // Preserve original timestamp
      } else {
        formValue.createdAt = new Date().toISOString(); // Add timestamp for new book
      }

      this.onSubmit.emit(formValue);
      this.submitted = false;
    }
  }

  cancel(): void {
    this.onCancel.emit();
  }

  // Getters for form controls
  get title() { return this.bookForm.get('title'); }
  get author() { return this.bookForm.get('author'); }
  get coverImage() { return this.bookForm.get('coverImage'); }
  get rating() { return this.bookForm.get('rating'); }
  get category() { return this.bookForm.get('category'); }
}
