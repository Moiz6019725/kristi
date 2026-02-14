import connectToDatabase from "@/lib/dbConnect";
import { Order } from "@/Models/Order";

export async function GET(request, { params }) {
  await connectToDatabase();
  const { id } = await params; // Await params here

  console.log("GET: Fetching order with ID:", id); // Debug log

  try {
    const order = await Order.findById(id).populate('products.productId');
    if (!order) {
      console.log("GET: Order not found for ID:", id);
      return new Response(JSON.stringify({ error: 'Order not found' }), { status: 404 });
    }
    console.log("GET: Order fetched successfully:", order);
    return new Response(JSON.stringify({ order }), { status: 200 });
  } catch (error) {
    console.error('Error fetching order:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch order' }), { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  await connectToDatabase();
  const { id } = await params; // Await params here

  console.log("PATCH: Updating order with ID:", id); // Debug log

  try {
    const body = await request.json();
    console.log("PATCH: Request body:", body); // Debug log
    const updatedOrder = await Order.findByIdAndUpdate(id, body, { new: true });
    if (!updatedOrder) {
      console.log("PATCH: Order not found for ID:", id);
      return new Response(JSON.stringify({ error: 'Order not found' }), { status: 404 });
    }
    console.log("PATCH: Order updated successfully:", updatedOrder);
    return new Response(JSON.stringify({ message: 'Order updated successfully', order: updatedOrder }), { status: 200 });
  } catch (error) {
    console.error('Error updating order:', error);
    return new Response(JSON.stringify({ error: 'Failed to update order' }), { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  await connectToDatabase();
  const { id } = await params; // Await params here

  console.log("DELETE: Deleting order with ID:", id); // Debug log (you already have this)

  try {
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      console.log("DELETE: Order not found for ID:", id);
      return new Response(JSON.stringify({ error: 'Order not found' }), { status: 404 });
    }
    console.log("DELETE: Order deleted successfully:", deletedOrder);
    return new Response(JSON.stringify({ message: 'Order deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error deleting order:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete order' }), { status: 500 });
  }
}