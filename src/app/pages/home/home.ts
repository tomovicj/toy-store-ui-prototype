import { Component, signal } from '@angular/core';
import { ToyCard } from '../../components/toy-card/toy-card';
import { Toy } from '../../models/toy';
import { ToyService } from '../../services/toy';

@Component({
  selector: 'app-home',
  imports: [ToyCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  toys = signal<Toy[]>([]);

  constructor(private toyService: ToyService) {
    this.toys.set(this.toyService.getToys());
  }
}
