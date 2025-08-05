"use client"

import React from 'react'
import { Table, TableBody,  TableCell,  TableHead, TableHeader, TableRow } from '@/components/ui/table';

import Link from 'next/link';

import { generateInvoicePdf } from '@/hooks/invoiceGenerator';
import { IIOrder } from '@/types/product';
const OrderInformationPage = ({order}:{order: IIOrder}) => {

if (order) {
  return (
    <div className="container mx-auto px-4 py-8">
       <div className="mt-8 p-4 bg-green-100 text-green-800 rounded-md shadow-md text-center">
      <h3 className="text-lg font-semibold">অর্ডারটি সফলভাবে সম্পন্ন হয়েছে!</h3>
      <p className="mt-2">আপনার অর্ডার আইডি: <span className="font-bold">{order?._id.toString()}</span></p>
    </div>
<button
        onClick={() => generateInvoicePdf(order)}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        📄 Download Invoice
      </button>
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl  font-semibold mb-4">Order ID: {order?._id.toString().slice(-6)}</h2>
      <div className="mb-4">
        <span className="font-medium">Customer Name:</span> {order.fullName}
      </div>   
      
       <div className="mb-4">
        <span className="font-medium">Tracking number:</span> <Link href={"#"}>Tracking Link</Link>
      </div>  
      {
        order.paymentMethod === "BKASH" ?   <div className="mb-4">
        <span className="font-medium">Pay To Rider:</span> {order.deliveryCharge} Tk
      </div> : ""
      }
      
    
      <div className="mb-4">
        <span className="font-medium">Phone:</span> {order.phone}
      </div>
      <div className="mb-4">
        <span className="font-medium">Address:</span> {order.address}, {order.city}
      </div>
      <div className="mb-4">
        <span className="font-medium">Total:</span> ৳{order.totalAmount}
      </div>
      <div className="mb-4">
        <span className="font-medium">Transaction ID:</span> {order?.paymentMethod || "N/A"}
      </div>
      <div className="mb-4">
        <span className="font-medium">Status:</span> {order.status}
      </div>    

      <div className="mb-4">
        <span className="font-bold text-xl">Products:</span>
        <Table>
      
      <TableHeader>
        <TableRow>
          <TableHead >Product</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Price</TableHead>
         
          
        </TableRow>
      </TableHeader>
      <TableBody>
        {order?.items?.map((product) => (
          <TableRow key={product.quantity}>

            <TableCell>{product.product.name}</TableCell>
            <TableCell>{product.quantity}</TableCell>
            <TableCell>৳{product.price}</TableCell>
  
          </TableRow>
        ))}
      </TableBody>
      
    </Table>
    
       
      </div>
    </div>
  </div>
  )
}
}

export default OrderInformationPage