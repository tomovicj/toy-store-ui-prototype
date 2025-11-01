import { Component, signal, ViewChild } from '@angular/core';
import { ToyCard } from '../../components/toy-card/toy-card';
import { ToyReserved } from '../../components/modals/toy-reserved/toy-reserved';
import { Toy } from '../../models/toy';
import { ToyService } from '../../services/toy';

@Component({
  selector: 'app-home',
  imports: [ToyCard, ToyReserved],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  @ViewChild(ToyReserved) toyReservedModal!: ToyReserved;

  toys = signal<Toy[]>([]);

  constructor(private toyService: ToyService) {
    this.toys.set(this.toyService.getToys());
  }

  onToyReserved({ toyId, quantity }: { toyId: string; quantity: number }) {
    this.toyReservedModal?.show(toyId, quantity);
  }
}
