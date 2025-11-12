import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ToyCard } from '../../components/toy-card/toy-card';
import { ToyReserved } from '../../components/modals/toy-reserved/toy-reserved';
import { Toy } from '../../models/toy';
import { ToyService } from '../../services/toy';
import { SortCriteria, SortToysPipe } from '../../pipes/sort-toys';
import { ToySort } from '../../components/dropdowns/toy-sort/toy-sort';
import { ActivatedRoute } from '@angular/router';
import { ToyFilter } from '../../components/dropdowns/toy-filter/toy-filter';
import { FilterToysPipe, ToyFilterParams } from '../../pipes/filter-toys';

@Component({
  selector: 'app-home',
  imports: [ToyCard, ToyReserved, ToyFilter, FilterToysPipe, ToySort, SortToysPipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  constructor(private toyService: ToyService, private route: ActivatedRoute) {}

  @ViewChild(ToyReserved) toyReservedModal!: ToyReserved;

  toys = signal<Toy[]>([]);
  sortOption = signal<SortCriteria>('name-asc');
  filterParams = signal<ToyFilterParams>({});

  ngOnInit(): void {
    this.toys.set(this.toyService.getToys());
    this.route.queryParams.subscribe(params => {
      this.sortOption.set(params['sort'] ? params['sort'] : 'name-asc');
      this.filterParams.set(params['filter'] ? JSON.parse(params['filter']) : {});
    });
  }

  onToyReserved({ toyId, quantity }: { toyId: string; quantity: number }) {
    this.toyReservedModal?.show(toyId, quantity);
  }
}
