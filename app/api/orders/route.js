import connectToDatabase from "@/lib/dbConnect";
import { Order } from "@/Models/Order";

export async function GET() {
  await connectToDatabase();

  try {
    const orders = await Order.find().populate('products.productId').sort({ createdAt: -1 });
    return new Response(JSON.stringify({ orders }), { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch orders' }), { status: 500 });
  }
}

export async function POST(request) {
  await connectToDatabase();

  try {
    const body = await request.json();
    const order = new Order(body);
    await order.save();
    return new Response(JSON.stringify({ message: 'Order created successfully', order }), { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return new Response(JSON.stringify({ error: 'Failed to create order' }), { status: 500 });
  }
}