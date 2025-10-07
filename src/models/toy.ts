import { Review } from './review';

export interface Toy {
  id: string;
  name: string;
  description: string;
  category: string;
  forAgeGroup: '0-2' | '3-5' | '6-8' | '9-12' | '13+';
  forGender: 'boy' | 'girl' | 'unisex';
  manufactureDate: string; // ISO date string
  price: number;
  reviews: Review[];
}
