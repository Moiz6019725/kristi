// Updated OrderForm.jsx
// Now handles a list of products, with quantity inputs for each.

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OrderForm({ products }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  // Quantities as an array, one for each product
  const [quantities, setQuantities] = useState(products.map(p => p.quantity || 1));
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuantityChange = (index, value) => {
    const newQuantities = [...quantities];
    newQuantities[index] = Number(value) || 1;
    setQuantities(newQuantities);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Calculate total amount across all products
    const totalAmount = products.reduce((sum, product, index) => {
      return sum + (quantities[index] * product.price);
    }, 0);

    // Build products array for order
    const orderProducts = products.map((product, index) => ({
      productId: product.id, // Assuming 'id' is the _id from your example
      quantity: quantities[index],
      price: product.price
    }));

    const orderData = {
      products: orderProducts,
      totalAmount,
      status: 'pending',
      shippingAddress: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country
      },
      paymentMethod: 'cod',
      buyerName: formData.name,
      buyerPhone: formData.phone
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        alert('Order placed successfully!');
        router.push('/'); // Redirect to home or order confirmation page
      } else {
        alert('Failed to place order.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* LEFT SIDE */}
      <div className="col-span-8 space-y-6">
        {/* Name */}
        <div className="bg-white p-4 rounded-lg">
          <label className="text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Your full name"
            className="mt-2 w-full border border-[#d3d3d3] rounded-xl p-2"
          />
        </div>

        {/* Phone */}
        <div className="bg-white p-4 rounded-lg">
          <label className="text-sm font-medium">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="Your phone number"
            className="mt-2 w-full border border-[#d3d3d3] rounded-xl p-2"
          />
        </div>

        {/* Street */}
        <div className="bg-white p-4 rounded-lg">
          <label className="text-sm font-medium">Street</label>
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={handleChange}
            required
            placeholder="Street address"
            className="mt-2 w-full border border-[#d3d3d3] rounded-xl p-2"
          />
        </div>

        {/* City */}
        <div className="bg-white p-4 rounded-lg">
          <label className="text-sm font-medium">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            placeholder="City"
            className="mt-2 w-full border border-[#d3d3d3] rounded-xl p-2"
          />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="col-span-4 space-y-6">
        {/* State */}
        <div className="bg-white p-4 rounded-lg">
          <label className="text-sm font-medium">State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
            placeholder="State"
            className="mt-2 w-full border border-[#d3d3d3] rounded-xl p-2"
          />
        </div>

        {/* Zip Code */}
        <div className="bg-white p-4 rounded-lg">
          <label className="text-sm font-medium">Zip Code</label>
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            required
            placeholder="Zip Code"
            className="mt-2 w-full border border-[#d3d3d3] rounded-xl p-2"
          />
        </div>

        {/* Country */}
        <div className="bg-white p-4 rounded-lg">
          <label className="text-sm font-medium">Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            placeholder="Country"
            className="mt-2 w-full border border-[#d3d3d3] rounded-xl p-2"
          />
        </div>

        {/* Quantities for each product */}
        {products.map((product, index) => (
          <div key={index} className="bg-white p-4 rounded-lg">
            <label className="text-sm font-medium">Quantity for {product.title}</label>
            <input
              type="number"
              value={quantities[index]}
              onChange={(e) => handleQuantityChange(index, e.target.value)}
              min="1"
              required
              className="mt-2 w-full border border-[#d3d3d3] rounded-xl p-2"
            />
          </div>
        ))}

        {/* Summary */}
        <div className="bg-white p-4 rounded-lg">
          <p className="text-sm font-medium">
            Total Amount: Rs. {products.reduce((sum, product, index) => sum + (quantities[index] * product.price), 0)}
          </p>
          <p className="text-sm">Payment Method: Cash on Delivery (COD)</p>
        </div>

        {/* Submit Button */}
        <div className="bg-white p-4 rounded-lg">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-black text-white p-2 rounded-lg font-bold cursor-pointer hover:scale-[1.01]"
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </>
  );
}