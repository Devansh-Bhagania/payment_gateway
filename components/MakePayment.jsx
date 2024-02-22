"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import payforpdf from '../actions/payforpdf/payforpdf';


const MakePaymentComponent = (props) => {

  // const clicker = async () => {
  //   console.log("props1==",props.props.id)
  // try{
  //   const revertfrombackendpay = await payforpdf(props.props.id);
  //   console.log("getting reply from backend for ispaid update",revertfrombackendpay);
  // }
  // catch (error){
  //   console.log("error in updating ispaid",error);
  // }
  // }
  
  // console.log(props)
  const router = useRouter();
  const makePayment = async () => {
    console.log("Initializing Razorpay Pay Checkout...");
    console.log("props1==",props)
    const res = await initializeRazorpay();
    if (res) {
      console.log("Razorpay SDK loaded");
    }
    if (!res) {
      alert("Razorpay SDK Failed to load");
      return;
    }


    const data = await fetch("/api/razorpay", { method: "POST" }).then((t) =>
      t.json()
    );
    console.log(data);


    // trying make payemnts afer server error 
    // const data = await axios.post('/api/razorpay', {
    //     data:100,
    // });

    // const orderdata = data.data
    // console.log(orderdata.id);
    // console.log(orderdata.currency);
    // console.log(orderdata.amount);
    // console.log(data.json());
    var options = {
      key: 'rzp_test_v4wZXK8tUjyXFX',
      amount: "10000",
      currency: 'INR',// Enter the Key ID generated from the Dashboard
      name: "Indradhanu online",
      description: "Thankyou for your test donation",
      order_id: data.id,
      receipt: 'receipt11',
      notes: {
        pdfid: props,
        country: "India"
      },
      // image: "https://manuarora.in/logo.png",

      // handler: async  function (response) {
      //   if(!response){
      //       console.log("response is coming")
      //   }
      //   console.log(response.razorpay_order_id);
      //   console.log(response);
      //   // Validate payment at server - using webhooks is a better idea.
      //   alert("Razorpay Response: "+response.razorpay_payment_id);
      //   //alert(response.razorpay_order_id);
      //   //alert(response.razorpay_signature);
      // },
      // callback_url: 'https://localhost:3000/api/paymentverify',
      handler:async  function (response) {
        // Validate payment at server - using webhooks is a better idea.
        console.log(response);
        const verifypayment = await  fetch("http://localhost:3000/api/paymentverify", {
          method: "POST",
          // headers: {
          //   // Authorization: 'YOUR_AUTH_HERE'
          // },
          body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          }),
        });

        const res = await verifypayment.json();

        console.log("response verify==",res)

        if(res?.message=="success")
        {
          try{
            const revertfrombackendpay = await payforpdf(props.props.id,response.razorpay_payment_id);
            console.log("getting reply from backend for ispaid update",revertfrombackendpay);
          }
          catch (error){
            console.log("error in updating ispaid",error);
          }
           

          console.log("redirected.......")
          router.push("/protected/paymentsuccess",308);

        }
      },
      prefill: {
        name: "pradeep das",
        email: "devanshbhagania19@gmail.com",
        contact: '8847064872'
      },

    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    paymentObject.on("payment.failed", function (response) {
      // console.log(response);
      alert("Payment failed. Please try again. Contact support for help");
    });
  };
  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      // document.body.appendChild(script);

      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  }
  return (
    <div>
      <button
        type="button"
        className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
         onClick={() => makePayment()}
        // onClick={clicker}
      >
        Pay
      </button>
    </div>
  )
}

export default MakePaymentComponent