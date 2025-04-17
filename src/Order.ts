import { Heap } from "heap-js";

export interface Order {
  type_op: "CREATE";
  account_id: string;
  amount: number;
  order_id: string;
  pair: string;
  limit_price: number;
  side: "BUY" | "SELL";
}

export interface Trade {
  buy_order: Object;
  sell_order: Object;
  amountTraded: number;
  sellingPrice: number;
}

export interface OrderBook {
  order_id: string;
  side: string;
  amount: number;
  price: number;
  account_id: string;
}

const buyMaxHeapComparator = (a: Order, b: Order) => {
  return b.limit_price - a.limit_price;
};

const sellMinHeapComparator = (a: Order, b: Order) => {
  return a.limit_price - b.limit_price;
};

export class OrderOrch {
  buyHeap = new Heap<Order>(buyMaxHeapComparator);
  sellHeap = new Heap<Order>(sellMinHeapComparator);
  trades: Trade[] = [];
  orderBook: OrderBook[] = [];

  addOrder(order: Order) {
    if (order.side == "BUY") {
      this.buyHeap.push(order);
    } else {
      this.sellHeap.push(order);
    }
    this.collideOrder();
  }

  collideOrder() {
    let isTradeDone = false; // this should check if my trades make progess.
    do {
      isTradeDone = false;
      // if on top i have orders of same account,
      // i park one of them here, and continue so others can match
      const removedOrdersForMatching: Order[] = [];
      while (!this.buyHeap.isEmpty() && !this.sellHeap.isEmpty()) {
        const buy = this.buyHeap.pop();
        const sell = this.sellHeap.pop();
        if (buy!.account_id === sell!.account_id) {
          // remove any of this shit, lets do only buy
          removedOrdersForMatching.push(buy!);
          this.sellHeap.push(sell!);
          continue;
        }
        if (buy!.limit_price >= sell!.limit_price) {
          const quantity = Math.min(buy!.amount, sell!.amount);
          const sellingPrice = sell!.limit_price;
          // log trade done.
          console.log(
            `trade done from buyer: buy_order_id: ${
              buy!.order_id
            }, buy_account_id ${buy!.account_id}, to , sell_order_id: ${
              sell!.order_id
            }  sell_account_id ${
              sell!.account_id
            } at price: ${sellingPrice}, quantity: ${quantity}`
          );
          const trade: Trade = {
            buy_order: buy!,
            sell_order: sell!,
            amountTraded: quantity,
            sellingPrice: sellingPrice,
          };
          const buyerSideOrderEntry: OrderBook = {
            order_id: buy!.order_id,
            side: buy!.side,
            price: sellingPrice,
            amount: quantity,
            account_id: buy!.account_id,
          };
          const sellerSideOrderEntry: OrderBook = {
            order_id: sell!.order_id,
            side: sell!.side,
            price: sellingPrice,
            amount: quantity,
            account_id: sell!.account_id,
          };
          this.orderBook.push(buyerSideOrderEntry);
          this.orderBook.push(sellerSideOrderEntry);
          this.trades.push(trade);
          const leftOutBuyQuanity = buy!.amount - quantity;
          const leftOutSellQuantity = sell!.amount - quantity;
          if (leftOutBuyQuanity !== 0) {
            // console.log(`buy trade pushed back ${leftOutBuyQuanity}`);

            buy!.amount = leftOutBuyQuanity;
            this.buyHeap.add(buy!); // add and re heaaapifyu this
          }
          if (leftOutSellQuantity !== 0) {
            // console.log(`buy trade pushed back ${leftOutSellQuantity}`);
            sell!.amount = leftOutSellQuantity;
            this.sellHeap.add(sell!); // add and re heaaapifyu this
          }
          isTradeDone = true;
        } else {
          break;
        }
      }
      for (const order of removedOrdersForMatching) {
        if (order.side == "BUY") {
          this.buyHeap.add(order);
        } else {
          this.sellHeap.add(order);
        }
      }
    } while (isTradeDone);
  }
}
