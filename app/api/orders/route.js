import { NextResponse } from "next/server"
const Razorpay = require('razorpay');

export const GET = (req, res) =>{
    
    console.log("in order api route ")
    try {
    // const data = {
    //     name: "Devansh",
    //     email: "defaj@gmail.com",
    //     contact: "7814564601",
    //     address: "khanna khurd",
    // }

    // return NextResponse.json({msg:data})
    
        const instance = new Razorpay({ key_id: process.env.NEXT_RAZORPAY_KEY_ID, key_secret: process.env.NEXT_RAZORPAY_SECRET })
        const options = {
            amount: 2 * 100,
            currency: "INR",
            receipt: "TXN" + Date.now(),
            notes: {
                key1: 'Devraj',
                key2: 'devanshbhagania19@gmail.com',
                key3: '7814564601',
                key4: 'khanna khurd',
                key5: 'pdf data',
                key6: 'Deva pdf',
            }
        };

        instance.orders.create(options, function(err, order) {
            if(order){
                console.log(order.id)
                return NextResponse.json({msg:order.id})
            } else {
                console.log(err);
                return NextResponse.json({msg:err})
            }
        });
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({msg:error.message})
    }
}