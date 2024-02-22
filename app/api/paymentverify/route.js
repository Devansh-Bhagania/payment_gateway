import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import shortid from "shortid";
import crypto from "crypto";

const instance = new Razorpay({
  key_id: process.env.NEXT_RAZORPAY_KEY_ID,
  key_secret: process.env.NEXT_RAZORPAY_SECRET,
});

export async function POST(req, res) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    await req.json();
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  console.log("id==", body);

  const expectedSignature = crypto
    .createHmac("sha256", process.env.NEXT_RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");
  console.log("expectedSignature==", expectedSignature);
  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    console.log("Payment is authentic");
    // Save payment details in the database
    console.log(razorpay_order_id, razorpay_payment_id, razorpay_signature);

    // await dbConnect()

    //  await Payment.create({
    //    razorpay_order_id,
    //    razorpay_payment_id,
    //    razorpay_signature,
    //  });

    return NextResponse.json({
      message: "success"
    }, {
      status: 200,
    });
  } else {
    return NextResponse.json({
      message: "fail"
    }, {
      status: 400,
    });
  }
}
  


// return NextResponse.json({
//     message: "success"
//   }, {
//     status: 200,
//   })

// }






