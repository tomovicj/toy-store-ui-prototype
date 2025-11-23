import {
  AfterViewInit,
  Component,
  ElementRef,
  signal,
  ViewChild,
} from '@angular/core';
import { Dropdown } from 'bootstrap';
import { SortCriteria } from '../../../pipes/sort-toys';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-toy-sort',
  imports: [],
  templateUrl: './toy-sort.html',
  styleUrl: './toy-sort.css',
})
export class ToySort implements AfterViewInit {
  constructor(private router: Router, private route: ActivatedRoute) {}

  @ViewChild('dropdown') dropdown!: ElementRef;

  private dropdownInstance: Dropdown | null = null;

  sortOptions: { value: SortCriteria; label: string }[] = [
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'price-asc', label: 'Price (Low to High)' },
    { value: 'price-desc', label: 'Price (High to Low)' },
    { value: 'rating-asc', label: 'Rating (Low to High)' },
    { value: 'rating-desc', label: 'Rating (High to Low)' },
  ];

  selectedOption = signal<SortCriteria>('name-asc');

  ngAfterViewInit() {
    this.dropdownInstance = new Dropdown(this.dropdown.nativeElement);

    this.route.queryParams.subscribe(params => {
      if (params['sort']) {
        const sortOptionParam = params['sort'] as SortCriteria;
        if (this.sortOptions.some((opt) => opt.value === sortOptionParam)) {
          this.selectedOption.set(sortOptionParam);
        }
      } else {
        this.selectedOption.set('name-asc');
      }
    });
  }

  toggleDropdown() {
    if (this.dropdownInstance) {
      this.dropdownInstance.toggle();
    }
  }

  selectOption(option: SortCriteria) {
    this.toggleDropdown();

    this.router.navigate([], {
      relativeTo: this.route, // Ensures updating params for the current route
      queryParams: { sort: option },
      queryParamsHandling: 'merge', // Keep other existing query params
      replaceUrl: true, // Replaces the current history state instead of adding a new one
    });
  }

  getSelectedOptionLabel(): string {
    const selected = this.selectedOption();
    const option = this.sortOptions.find((opt) => opt.value === selected);
    return option ? option.label : '';
  }
}
