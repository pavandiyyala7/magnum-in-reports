import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-canteen-menu',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './canteen-menu.component.html',
  styleUrl: './canteen-menu.component.scss'
})
export class CanteenMenuComponent {

  user = { id: 'U001', name: 'Sanjay Singh' }

  foodMenu = [
    {
      name: 'Breakfast',
      image: 'assets/demo/images/food/break fast.jpg',
      booked: false,
      timeSlot: '6 AM - 10 AM',
      bookedTime: 'NA'
    },
    {
      name: 'Lunch',
      image: 'assets/demo/images/food/lunch.jpg',
      booked: false,
      timeSlot: '11 AM - 3 PM',
      bookedTime: 'NA'
    },
    {
      name: 'Dinner',
      image: 'assets/demo/images/food/dinner.jpg',
      booked: false,
      timeSlot: '6 PM - 9 PM',
      bookedTime: 'NA'
    },
    {
      name: 'Snacks',
      image: 'assets/demo/images/food/snacks.webp',
      booked: false,
      timeSlot: '3 PM - 6 PM',
      bookedTime: 'NA '
    }
  ];

  orderDate = '18/04/2025';
  orderAcceptTime = '6 AM to 9 PM';
  transactionId = '123455';

  bookItem(item: any) {
    item.booked = true;
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    item.bookedTime = `${hours}:${minutes}`;
  }

  cancelBooking(item: any) {
    item.booked = false;
    item.bookedTime = 'NA';
  }
}