import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Dropdown } from 'bootstrap';
import { ToyService } from '../../../services/toy';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AgeGroup, Gender, ToyFilterParams } from '../../../pipes/filter-toys';

@Component({
  selector: 'app-toy-filter',
  imports: [ReactiveFormsModule],
  templateUrl: './toy-filter.html',
  styleUrl: './toy-filter.css',
})
export class ToyFilter implements AfterViewInit {
  constructor(
    private toyService: ToyService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  @ViewChild('dropdown') dropdown!: ElementRef;

  private dropdownInstance: Dropdown | null = null;

  form = new FormGroup({
    search: new FormControl(''),
    minPrice: new FormControl(''),
    maxPrice: new FormControl(''),
    minRating: new FormControl(''),
    maxRating: new FormControl(''),
    category: new FormControl(''),
    genderBoy: new FormControl(false),
    genderGirl: new FormControl(false),
    genderUnisex: new FormControl(false),
    ageGroup0to2: new FormControl(false),
    ageGroup3to5: new FormControl(false),
    ageGroup6to8: new FormControl(false),
    ageGroup9to12: new FormControl(false),
    ageGroup13plus: new FormControl(false),
  });

  ngAfterViewInit() {
    this.dropdownInstance = new Dropdown(this.dropdown.nativeElement);

    const params = this.route.snapshot.queryParams;
    if (params['filter']) {
      const filterParams: ToyFilterParams = JSON.parse(params['filter']);

      this.form.patchValue({
        search: filterParams.nameQuery || '',
        minPrice: filterParams.minPrice !== undefined ? filterParams.minPrice.toString() : '',
        maxPrice: filterParams.maxPrice !== undefined ? filterParams.maxPrice.toString() : '',
        minRating: filterParams.minRating !== undefined ? filterParams.minRating.toString() : '',
        maxRating: filterParams.maxRating !== undefined ? filterParams.maxRating.toString() : '',
        category: filterParams.category || '',
        genderBoy: filterParams.forGender ? filterParams.forGender.includes('boy') : false,
        genderGirl: filterParams.forGender ? filterParams.forGender.includes('girl') : false,
        genderUnisex: filterParams.forGender ? filterParams.forGender.includes('unisex') : false,
        ageGroup0to2: filterParams.forAgeGroup ? filterParams.forAgeGroup.includes('0-2') : false,
        ageGroup3to5: filterParams.forAgeGroup ? filterParams.forAgeGroup.includes('3-5') : false,
        ageGroup6to8: filterParams.forAgeGroup ? filterParams.forAgeGroup.includes('6-8') : false,
        ageGroup9to12: filterParams.forAgeGroup ? filterParams.forAgeGroup.includes('9-12') : false,
        ageGroup13plus: filterParams.forAgeGroup ? filterParams.forAgeGroup.includes('13+') : false,
      });
    }
  }

  toggleDropdown() {
    if (this.dropdownInstance) {
      this.dropdownInstance.toggle();
    }
  }

  getToyCategories(): string[] {
    return this.toyService.getToyCategories();
  }

  applyFilter() {
    const filterValues = this.form.value;
    const filterParams: ToyFilterParams = {};

    if (filterValues.search) {
      filterParams.nameQuery = filterValues.search;
    }
    if (filterValues.minPrice) {
      filterParams.minPrice = parseFloat(filterValues.minPrice);
    }
    if (filterValues.maxPrice) {
      filterParams.maxPrice = parseFloat(filterValues.maxPrice);
    }
    if (filterValues.minRating) {
      filterParams.minRating = parseFloat(filterValues.minRating);
    }
    if (filterValues.maxRating) {
      filterParams.maxRating = parseFloat(filterValues.maxRating);
    }
    if (filterValues.category) {
      filterParams.category = filterValues.category;
    }

    const genderFilters: Gender[] = [];
    if (filterValues.genderBoy) {
      genderFilters.push('boy');
    }
    if (filterValues.genderGirl) {
      genderFilters.push('girl');
    }
    if (filterValues.genderUnisex) {
      genderFilters.push('unisex');
    }
    if (genderFilters.length !== 0) {
      filterParams.forGender = genderFilters;
    }

    const ageGroupFilters: AgeGroup[] = [];
    if (filterValues.ageGroup0to2) {
      ageGroupFilters.push('0-2');
    }
    if (filterValues.ageGroup3to5) {
      ageGroupFilters.push('3-5');
    }
    if (filterValues.ageGroup6to8) {
      ageGroupFilters.push('6-8');
    }
    if (filterValues.ageGroup9to12) {
      ageGroupFilters.push('9-12');
    }
    if (filterValues.ageGroup13plus) {
      ageGroupFilters.push('13+');
    }
    if (ageGroupFilters.length !== 0) {
      filterParams.forAgeGroup = ageGroupFilters;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { filter: JSON.stringify(filterParams) },
      queryParamsHandling: 'merge',
    });

    this.dropdownInstance?.hide();
  }

  clearFilters() {
    this.form.reset();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { filter: null },
      queryParamsHandling: 'merge',
    });
  }
}
