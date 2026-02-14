import connectToDatabase from "@/lib/dbConnect";
import { Order } from "@/Models/Order";

export async function GET() {
  await connectToDatabase();

  const sales = await Order.aggregate([
    {
      $match: { status: "delivered" } // ONLY real sales
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt"
          }
        },
        totalSales: { $sum: "$totalAmount" },
        ordersCount: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  return Response.json(sales);
}
