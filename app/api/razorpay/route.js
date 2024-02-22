//razorpay.js
import { NextResponse } from "next/server";
const Razorpay = require("razorpay");
const shortid = require("shortid");

export const POST = async (req, res)=> {
//   const { taxAmt } = req.body;
console.log("In Razorpay Api Localhost Server")
// const actualdata = await req.json();
//     console.log(actualdata.data)
//   console.log('taxAmt',taxAmt*100)
  if (req.method === "POST") {
    // Initialize razorpay object
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_RAZORPAY_KEY_ID,
      key_secret: process.env.NEXT_RAZORPAY_SECRET,
    });

    // Create an order -> generate the OrderID -> Send it to the Front-end
    // Also, check the amount and currency on the backend (Security measure)
    
    const payment_capture = 1;
    const amount = 100;
    const currency = "INR";
    const options = {
      amount: (amount * 100).toString(),
      currency,
      receipt: shortid.generate(),
      payment_capture,
    };

    try {
      const orderdata = await razorpay.orders.create(options);
      console.log(orderdata)
      return NextResponse.json({
        id: orderdata.id,
        currency: orderdata.currency,
        amount: orderdata.amount,
      });
    } catch (err) {
      console.log(err);
      return NextResponse.json({ error: 'failed to load data' });
    }
  } else {
    // Handle any other HTTP method
  }
}