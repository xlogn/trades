import * as fs from "fs";

import { OrderOrch } from "./Order";

console.log("please work !@!");

// basic algorithm
// have a min heap on limit_price for sell orders.
// have a max heap on limit_price for buy orders.
// when buy heap top price >= sell heap top price then trade makes somehow,
// because user wants to sell at eg 4 and there is a buy ready to buy at 6,
// then this trade make both of them happy.
// also see quantity they want to sell or by, take minimum of it, make the trade.
// whichever is not finsihed push it back to queeueu
// and keep processing, so maybe a while loop.
// catch is avoid same account trades, can be blocked by remving one of the same account trade
// and checking if there is a progress that is being made, to make sure no inifite calls is done.
// then push back all removed to it.

const orderData = fs.readFileSync("./src/proofOfWork/order.json", "utf8");
const orderDataJSONList = JSON.parse(orderData);
// console.log(orderDataJSON);

const orderOrch = new OrderOrch();
// orderOrch.addOrder(orderDataJSONList[0]);
for (let x = 0; x < orderDataJSONList.length; x++) {
  orderOrch.addOrder(orderDataJSONList[x]);
}
