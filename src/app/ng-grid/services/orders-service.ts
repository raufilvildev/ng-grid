import { Injectable, signal, WritableSignal } from '@angular/core';
import { TOrders } from '../types/t-orders';
import { TOrder } from '../types/t-order';

@Injectable()
export class OrdersService {
  internalOrders: WritableSignal<TOrders> = signal({});

  columnSortUpdate(field: string) {
    const orders: TOrders = { ...this.internalOrders() };
    if (!orders[field]) {
      orders[field] = 'ASC';
    } else if (orders[field] === 'ASC') {
      orders[field] = 'DESC';
    } else {
      delete orders[field];
    }

    this.internalOrders.set(orders);
  }

  setColumnSort(field: string, order: TOrder) {
    const orders: TOrders = { ...this.internalOrders() };
    if (!orders[field] || orders[field] !== order) {
      orders[field] = order;
    } else {
      delete orders[field];
    }

    this.internalOrders.set(orders);
  }
}
