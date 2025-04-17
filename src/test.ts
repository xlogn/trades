import * as fs from "fs";

import { OrderOrch } from "./Order";

const ordersFromSameAccountTest = fs.readFileSync(
  "./src/tests/ordersFromSameAccountTest.json",
  "utf8"
);

const partailOrderTest = fs.readFileSync(
  "./src/tests/partailOrderTest.json",
  "utf8"
);

const partialTradesExpected = [
  {
    buy_order: {
      type_op: "CREATE",
      account_id: "1",
      amount: "0.00230",
      order_id: "1",
      pair: "BTC/USDC",
      limit_price: "63500.00",
      side: "BUY",
    },
    sell_order: {
      type_op: "CREATE",
      account_id: "2",
      amount: 1,
      order_id: "2",
      pair: "BTC/USDC",
      limit_price: "63500.00",
      side: "SELL",
    },
    amountTraded: 0.0023,
    sellingPrice: "63500.00",
  },
  {
    buy_order: {
      type_op: "CREATE",
      account_id: "1",
      amount: "1",
      order_id: "3",
      pair: "BTC/USDC",
      limit_price: "63500.00",
      side: "BUY",
    },
    sell_order: {
      type_op: "CREATE",
      account_id: "2",
      amount: 1,
      order_id: "2",
      pair: "BTC/USDC",
      limit_price: "63500.00",
      side: "SELL",
    },
    amountTraded: 1,
    sellingPrice: "63500.00",
  },
];

const parialOrderBookExpected = [
  {
    order_id: "1",
    side: "BUY",
    price: "63500.00",
    amount: 0.0023,
    account_id: "1",
  },
  {
    order_id: "2",
    side: "SELL",
    price: "63500.00",
    amount: 0.0023,
    account_id: "2",
  },
  { order_id: "3", side: "BUY", price: "63500.00", amount: 1, account_id: "1" },
  {
    order_id: "2",
    side: "SELL",
    price: "63500.00",
    amount: 1,
    account_id: "2",
  },
];

function testForOrderOnlyFromOneAccount() {
  const orderOrch = new OrderOrch();
  const orderDataJSONList = JSON.parse(ordersFromSameAccountTest);
  for (let x = 0; x < orderDataJSONList.length; x++) {
    orderOrch.addOrder(orderDataJSONList[x]);
  }
  const trades = orderOrch.trades;
  const orderbook = orderOrch.orderBook;
  // assert
  if (trades.length == 0 && orderbook.length == 0) {
    console.log("[PASSED]: Test case for ordersFromSameAccountTest");
  } else {
    console.log("[FAILED]: Test case for ordersFromSameAccountTest");
  }
}

function testForPartailOrderTest() {
  const orderOrch = new OrderOrch();
  const orderDataJSONList = JSON.parse(partailOrderTest);
  for (let x = 0; x < orderDataJSONList.length; x++) {
    orderOrch.addOrder(orderDataJSONList[x]);
  }

  const trades = orderOrch.trades;
  const orderbook = orderOrch.orderBook;
  console.log(JSON.stringify(orderbook));

  // assert
  if (
    JSON.stringify(trades) === JSON.stringify(partialTradesExpected) &&
    JSON.stringify(orderbook) === JSON.stringify(parialOrderBookExpected)
  ) {
    console.log("[PASSED]: Test case for ordersFromSameAccountTest");
  } else {
    console.log("[FAILED]: Test case for ordersFromSameAccountTest");
  }
}

testForOrderOnlyFromOneAccount();
testForPartailOrderTest();
