"use client";
import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Package, Image as ImageIcon, Tag, Sparkles, AlertTriangle, Grid3x3, CheckCircle2 } from "lucide-react";

const Page = () => {
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [open, setOpen] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, productId: null, productTitle: "" });
  const [deleting, setDeleting] = useState(false);

  const [newProduct, setNewProduct] = useState({
    title: "",
    price: "",
    description: "",
    compareAtPrice: "",
    images: [],
    status: "active",
    vendor: "",
    productType: "",
    collection: "",
    hasVariants: false,
    options: [],
    variants: [],
  });

  // Fetch products
  const fetchProducts = async () => {
    const res = await fetch("/api/getProducts");
    const data = await res.json();
    setProducts(data.products);
  };

  // Fetch collections
  const fetchCollections = async () => {
    const res = await fetch("/api/collections");
    const data = await res.json();
    setCollections(data.collections || []);
  };

  useEffect(() => {
    fetchProducts();
    fetchCollections();
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  // Handle images
  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setNewProduct((prev) => ({ ...prev, images: files }));
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  // Remove image
  const removeImage = (index) => {
    const newImages = newProduct.images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setNewProduct((prev) => ({ ...prev, images: newImages }));
    setPreviews(newPreviews);
  };

  // Add new option
  const addOption = () => {
    if (newProduct.options.length >= 3) {
      alert("Maximum 3 options allowed");
      return;
    }
    setNewProduct((prev) => ({
      ...prev,
      options: [...prev.options, { name: "", values: [""] }],
    }));
  };

  // Remove option
  const removeOption = (index) => {
    setNewProduct((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  // Update option name
  const updateOptionName = (index, name) => {
    const updated = [...newProduct.options];
    updated[index].name = name;
    setNewProduct((prev) => ({ ...prev, options: updated }));
  };

  // Add value to option
  const addOptionValue = (optionIndex) => {
    const updated = [...newProduct.options];
    updated[optionIndex].values.push("");
    setNewProduct((prev) => ({ ...prev, options: updated }));
  };

  // Update option value
  const updateOptionValue = (optionIndex, valueIndex, value) => {
    const updated = [...newProduct.options];
    updated[optionIndex].values[valueIndex] = value;
    setNewProduct((prev) => ({ ...prev, options: updated }));
  };

  // Remove option value
  const removeOptionValue = (optionIndex, valueIndex) => {
    const updated = [...newProduct.options];
    updated[optionIndex].values = updated[optionIndex].values.filter(
      (_, i) => i !== valueIndex
    );
    setNewProduct((prev) => ({ ...prev, options: updated }));
  };

  // Generate variants from options
  const generateVariants = () => {
    const options = newProduct.options.filter(
      (opt) => opt.name && opt.values.some((v) => v)
    );

    if (options.length === 0) {
      setNewProduct((prev) => ({ ...prev, variants: [] }));
      return;
    }

    // Generate combinations
    const combinations = cartesianProduct(
      options.map((opt) => opt.values.filter((v) => v))
    );

    const variants = combinations.map((combo) => {
      const variant = {
        option1: combo[0] || "",
        option2: combo[1] || "",
        option3: combo[2] || "",
        price: newProduct.price || "",
        compareAtPrice: newProduct.compareAtPrice || "",
        sku: "",
      };
      return variant;
    });

    setNewProduct((prev) => ({ ...prev, variants }));
  };

  // Cartesian product helper
  const cartesianProduct = (arrays) => {
    return arrays.reduce(
      (acc, array) => {
        return acc.flatMap((x) => array.map((y) => [...x, y]));
      },
      [[]]
    );
  };

  // Update variant field
  const updateVariant = (index, field, value) => {
    const updated = [...newProduct.variants];
    updated[index][field] = value;
    setNewProduct((prev) => ({ ...prev, variants: updated }));
  };

  // Apply base price to all variants
  const applyBasePriceToAll = () => {
    const updated = newProduct.variants.map(v => ({
      ...v,
      price: newProduct.price,
      compareAtPrice: newProduct.compareAtPrice
    }));
    setNewProduct((prev) => ({ ...prev, variants: updated }));
  };

  // Upload product
  const handleUpload = async () => {
    const formData = new FormData();

    formData.append("title", newProduct.title);
    formData.append("price", newProduct.price);
    formData.append("description", newProduct.description);
    formData.append("status", newProduct.status);
    formData.append("vendor", newProduct.vendor);
    formData.append("productType", newProduct.productType);
    formData.append("compareAtPrice", newProduct.compareAtPrice);
    formData.append("collection", newProduct.collection);
    formData.append("hasVariants", newProduct.hasVariants);

    if (newProduct.hasVariants) {
      formData.append("options", JSON.stringify(newProduct.options));
      formData.append("variants", JSON.stringify(newProduct.variants));
    }

    newProduct.images.forEach((img) => {
      formData.append("uploads", img);
    });

    const res = await fetch("/api/products", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      setProducts((prev) => [...prev, data.product]);
      setOpen(false);
      setPreviews([]);
      setNewProduct({
        title: "",
        price: "",
        description: "",
        compareAtPrice: "",
        images: [],
        status: "active",
        vendor: "",
        productType: "",
        collection: "",
        hasVariants: false,
        options: [],
        variants: [],
      });
    } else {
      const error = await res.json();
      alert(error.message || "Upload failed");
    }
  };

  // Delete product
  const handleDelete = async (productId) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/products?id=${productId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== productId));
        setDeleteConfirm({ show: false, productId: null, productTitle: "" });
      } else {
        const error = await res.json();
        alert(error.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  // Show delete confirmation
  const showDeleteConfirm = (product) => {
    setDeleteConfirm({
      show: true,
      productId: product._id,
      productTitle: product.title,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product Inventory</h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage your product catalog and variants
            </p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center cursor-pointer gap-2 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <Plus size={20} />
            Add Product
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div
              key={product._id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
              style={{
                animation: "slideUp 0.3s ease-out forwards",
                animationDelay: `${index * 50}ms`,
                opacity: 0,
              }}
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden bg-linear-to-br from-slate-100 to-slate-50">
                <img
                  src={product.images?.[0]}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${
                      product.status === "active"
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                        : "bg-slate-100 text-slate-700 border border-slate-300"
                    }`}
                  >
                    {product.status === "active" ? (
                      <>
                        <CheckCircle2 size={12} />
                        Active
                      </>
                    ) : (
                      "Draft"
                    )}
                  </span>
                </div>

                {/* Delete Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                  <button
                    onClick={() => showDeleteConfirm(product)}
                    className="flex items-center cursor-pointer gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl font-semibold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                  >
                    <Trash2 size={18} />
                    Delete Product
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5">
                <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 min-h-14">
                  {product.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 min-h-14">
                  {product.description}
                </p>

                {/* Pricing */}
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-2xl font-bold text-gray-900">
                    Rs. {product.price.toLocaleString()}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      Rs. {product.compareAtPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Discount Badge */}
                {product.compareAtPrice && product.price && (
                  <div className="inline-flex items-center gap-1 bg-linear-to-r from-orange-100 to-red-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold mb-3 border border-orange-200">
                    <Tag size={12} />
                    {(
                      ((product.compareAtPrice - product.price) /
                        product.compareAtPrice) *
                      100
                    ).toFixed(0)}
                    % OFF
                  </div>
                )}

                {/* Variants Info */}
                {product.hasVariants && (
                  <div className="flex items-center gap-1.5 bg-linear-to-r from-purple-50 to-pink-50 px-3 py-2 rounded-lg border border-purple-200">
                    <Sparkles size={14} className="text-purple-600" />
                    <span className="text-xs font-bold text-purple-900">
                      {product.variants?.length || 0} Variants Available
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
          <div className="w-24 h-24 bg-linear-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package size={48} className="text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No products yet</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Start building your product catalog by adding your first product
          </p>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus size={20} />
            Add Your First Product
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slideUp">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-rose-100 p-3 rounded-full">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Delete Product?</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-bold text-gray-900">"{deleteConfirm.productTitle}"</span>?
              This will permanently remove the product and all its data.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm({ show: false, productId: null, productTitle: "" })}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.productId)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-linear-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Delete Forever
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Product Modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-start overflow-y-auto p-4">
          <div className="bg-white w-full max-w-7xl my-10 rounded-2xl shadow-2xl relative animate-slideUp">
            {/* Header */}
            <div className="bg-linear-to-r from-purple-600 via-purple-500 to-pink-600 px-8 py-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                    <Package className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Create New Product</h2>
                    <p className="text-purple-100 text-sm mt-1">
                      Add a new product to your inventory
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="bg-white/20 hover:bg-white/30 cursor-pointer backdrop-blur-sm p-2.5 rounded-xl transition-all duration-200"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Content - continuation in next message due to length */}
            <div className="grid grid-cols-12 gap-6 p-8">
              {/* LEFT COLUMN */}
              <div className="col-span-12 lg:col-span-8 space-y-6">
                {/* Title */}
                <div className="bg-linear-to-br from-white to-slate-50 p-6 rounded-xl border-2 border-slate-200 shadow-sm">
                  <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-purple-600" />
                    Product Title
                  </label>
                  <input
                    value={newProduct.title}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, title: e.target.value })
                    }
                    type="text"
                    placeholder="e.g., Premium Cotton T-Shirt"
                    className="w-full border-2 border-slate-200 focus:border-purple-500 rounded-xl p-3.5 outline-none transition-all duration-200 focus:ring-4 focus:ring-purple-100 text-gray-900 font-medium"
                  />
                </div>

                {/* Description */}
                <div className="bg-linear-to-br from-white to-slate-50 p-6 rounded-xl border-2 border-slate-200 shadow-sm">
                  <label className="text-sm font-bold text-gray-700 mb-3 block">
                    Product Description
                  </label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, description: e.target.value })
                    }
                    rows={5}
                    placeholder="Describe your product features, materials, and benefits..."
                    className="w-full border-2 border-slate-200 focus:border-purple-500 rounded-xl p-3.5 outline-none transition-all duration-200 focus:ring-4 focus:ring-purple-100 resize-none text-gray-900"
                  />
                </div>

                {/* Media Upload */}
                <div className="bg-linear-to-br from-white to-slate-50 p-6 rounded-xl border-2 border-slate-200 shadow-sm">
                  <label className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-purple-600" />
                    Product Images
                  </label>

                  {previews.length === 0 ? (
                    <label className="flex flex-col items-center justify-center border-3 border-dashed border-slate-300 hover:border-purple-400 rounded-2xl h-56 cursor-pointer transition-all duration-200 bg-linear-to-br from-slate-50 to-white hover:from-purple-50 hover:to-pink-50 group">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImages}
                        className="hidden"
                      />
                      <div className="bg-linear-to-br from-purple-100 to-pink-100 p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-200">
                        <ImageIcon className="w-10 h-10 text-purple-600" />
                      </div>
                      <span className="text-gray-700 font-semibold text-lg group-hover:text-purple-600 transition-colors">
                        Upload Product Images
                      </span>
                      <span className="text-sm text-gray-500 mt-2">
                        Click to browse or drag & drop • PNG, JPG, WEBP
                      </span>
                    </label>
                  ) : (
                    <div className="grid grid-cols-4 gap-4">
                      {previews.map((src, i) => (
                        <div key={i} className="relative group aspect-square">
                          <img
                            src={src}
                            alt={`Preview ${i + 1}`}
                            className="w-full h-full object-cover rounded-xl shadow-md border-2 border-slate-200"
                          />
                          <button
                            onClick={() => removeImage(i)}
                            className="absolute -top-2 -right-2 bg-rose-600 hover:bg-rose-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          {i === 0 && (
                            <div className="absolute bottom-2 left-2 bg-linear-to-r from-purple-600 to-pink-600 text-white text-xs px-3 py-1.5 rounded-lg font-bold shadow-lg">
                              PRIMARY
                            </div>
                          )}
                        </div>
                      ))}
                      <label className="aspect-square border-3 border-dashed border-slate-300 hover:border-purple-400 rounded-xl cursor-pointer transition-all duration-200 bg-linear-to-br from-slate-50 to-white hover:from-purple-50 hover:to-pink-50 flex items-center justify-center group">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => {
                            const files = Array.from(e.target.files);
                            setNewProduct((prev) => ({
                              ...prev,
                              images: [...prev.images, ...files],
                            }));
                            setPreviews((prev) => [
                              ...prev,
                              ...files.map((f) => URL.createObjectURL(f)),
                            ]);
                          }}
                          className="hidden"
                        />
                        <Plus className="w-10 h-10 text-slate-400 group-hover:text-purple-600 transition-colors" />
                      </label>
                    </div>
                  )}
                </div>

                {/* Pricing */}
                <div className="bg-linear-to-br from-white to-slate-50 p-6 rounded-xl border-2 border-slate-200 shadow-sm">
                  <label className="text-sm font-bold text-gray-700 mb-4 block">
                    Pricing Information
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-2 block">
                        Regular Price (Rs.)
                      </label>
                      <input
                        value={newProduct.price}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, price: e.target.value })
                        }
                        type="number"
                        placeholder="0.00"
                        className="w-full border-2 border-slate-200 focus:border-purple-500 rounded-xl p-3.5 outline-none transition-all duration-200 focus:ring-4 focus:ring-purple-100 text-gray-900 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-2 block">
                        Compare at Price (Rs.)
                      </label>
                      <input
                        value={newProduct.compareAtPrice}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            compareAtPrice: e.target.value,
                          })
                        }
                        type="number"
                        placeholder="0.00"
                        className="w-full border-2 border-slate-200 focus:border-purple-500 rounded-xl p-3.5 outline-none transition-all duration-200 focus:ring-4 focus:ring-purple-100 text-gray-900 font-semibold"
                      />
                    </div>
                  </div>
                  {newProduct.compareAtPrice && newProduct.price && parseFloat(newProduct.compareAtPrice) > parseFloat(newProduct.price) && (
                    <div className="mt-4 p-4 bg-linear-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Tag className="w-5 h-5 text-orange-600" />
                        <div>
                          <p className="text-sm font-bold text-orange-900">
                            {(
                              ((parseFloat(newProduct.compareAtPrice) - parseFloat(newProduct.price)) /
                                parseFloat(newProduct.compareAtPrice)) *
                              100
                            ).toFixed(0)}
                            % DISCOUNT
                          </p>
                          <p className="text-xs text-orange-700 mt-0.5">
                            Save Rs. {(parseFloat(newProduct.compareAtPrice) - parseFloat(newProduct.price)).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Variants Section */}
                <div className="bg-linear-to-br from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-200 shadow-lg">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <div className="bg-linear-to-br from-purple-600 to-pink-600 p-2 rounded-lg">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-800">Product Variants</h3>
                        <p className="text-xs text-gray-600 mt-0.5">Add size, color, or style options</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newProduct.hasVariants}
                        onChange={(e) => {
                          setNewProduct({
                            ...newProduct,
                            hasVariants: e.target.checked,
                            options: e.target.checked ? newProduct.options : [],
                            variants: e.target.checked ? newProduct.variants : [],
                          });
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-linear-to-r peer-checked:from-purple-600 peer-checked:to-pink-600 shadow-inner"></div>
                      <span className="ms-3 text-sm font-bold text-gray-700">
                        {newProduct.hasVariants ? "ON" : "OFF"}
                      </span>
                    </label>
                  </div>

                  {newProduct.hasVariants && (
                    <div className="space-y-5">
                      {/* Options */}
                      <div className="space-y-4">
                        {newProduct.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className="bg-white rounded-xl p-5 border-2 border-purple-100 shadow-sm"
                          >
                            <div className="flex items-center gap-3 mb-4">
                              <div className="flex-1">
                                <label className="text-xs font-semibold text-gray-600 mb-2 block">
                                  Option Name
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g., Size, Color, Material"
                                  value={option.name}
                                  onChange={(e) =>
                                    updateOptionName(optIndex, e.target.value)
                                  }
                                  className="w-full border-2 border-slate-200 focus:border-purple-500 rounded-lg p-3 outline-none transition-all duration-200 focus:ring-4 focus:ring-purple-100 font-semibold text-gray-900"
                                />
                              </div>
                              <button
                                onClick={() => removeOption(optIndex)}
                                className="mt-6 bg-rose-100 hover:bg-rose-200 text-rose-600 cursor-pointer p-3 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>

                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-gray-600 block">
                                Option Values
                              </label>
                              {option.values.map((value, valIndex) => (
                                <div key={valIndex} className="flex gap-2">
                                  <input
                                    type="text"
                                    placeholder={`Value ${valIndex + 1}`}
                                    value={value}
                                    onChange={(e) =>
                                      updateOptionValue(
                                        optIndex,
                                        valIndex,
                                        e.target.value
                                      )
                                    }
                                    className="flex-1 border-2 border-slate-200 focus:border-purple-500 rounded-lg p-2.5 outline-none transition-all duration-200 text-sm font-medium"
                                  />
                                  {option.values.length > 1 && (
                                    <button
                                      onClick={() =>
                                        removeOptionValue(optIndex, valIndex)
                                      }
                                      className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 cursor-pointer p-2 rounded-lg transition-colors"
                                    >
                                      <X className="w-5 h-5" />
                                    </button>
                                  )}
                                </div>
                              ))}
                              <button
                                onClick={() => addOptionValue(optIndex)}
                                className="text-sm text-purple-600 hover:text-purple-700 cursor-pointer font-semibold flex items-center gap-1.5 mt-2 hover:bg-purple-50 px-3 py-2 rounded-lg transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                                Add another value
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {newProduct.options.length < 3 && (
                        <button
                          onClick={addOption}
                          className="w-full border-2 border-dashed border-purple-300 hover:border-purple-500 bg-white hover:bg-purple-50 text-purple-600 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-sm"
                        >
                          <Plus className="w-5 h-5" />
                          Add Another Option
                        </button>
                      )}

                      {newProduct.options.some(
                        (opt) => opt.name && opt.values.some((v) => v)
                      ) && (
                        <button
                          onClick={generateVariants}
                          className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <Grid3x3 className="w-5 h-5" />
                          Generate All Variants
                        </button>
                      )}

                      {/* Variants Table */}
                      {newProduct.variants.length > 0 && (
                        <div className="bg-white rounded-xl border-2 border-purple-100 overflow-hidden shadow-md">
                          <div className="bg-linear-to-r from-purple-600 to-pink-600 px-6 py-4 flex items-center justify-between">
                            <h4 className="font-bold text-white flex items-center gap-2 text-lg">
                              <Package className="w-5 h-5" />
                              Variant Details ({newProduct.variants.length})
                            </h4>
                            {newProduct.price && (
                              <button
                                onClick={applyBasePriceToAll}
                                className="text-xs bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-colors font-semibold"
                              >
                                Apply base price
                              </button>
                            )}
                          </div>

                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead className="bg-slate-50 border-b-2 border-slate-200">
                                <tr>
                                  {newProduct.options.map((opt, i) => (
                                    <th
                                      key={i}
                                      className="px-5 py-3 text-left font-bold text-gray-700 uppercase text-xs tracking-wide"
                                    >
                                      {opt.name}
                                    </th>
                                  ))}
                                  <th className="px-5 py-3 text-left font-bold text-gray-700 uppercase text-xs tracking-wide">
                                    Price
                                  </th>
                                  <th className="px-5 py-3 text-left font-bold text-gray-700 uppercase text-xs tracking-wide">
                                    Compare At
                                  </th>
                                  <th className="px-5 py-3 text-left font-bold text-gray-700 uppercase text-xs tracking-wide">
                                    SKU
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {newProduct.variants.map((variant, vIndex) => (
                                  <tr
                                    key={vIndex}
                                    className="hover:bg-purple-50/50 transition-colors"
                                  >
                                    {[variant.option1, variant.option2, variant.option3]
                                      .filter((v) => v)
                                      .map((val, i) => (
                                        <td key={i} className="px-5 py-4">
                                          <span className="inline-block bg-slate-100 px-3 py-1.5 rounded-lg text-sm font-semibold text-gray-700 border border-slate-200">
                                            {val}
                                          </span>
                                        </td>
                                      ))}
                                    <td className="px-5 py-4">
                                      <input
                                        type="number"
                                        value={variant.price}
                                        onChange={(e) =>
                                          updateVariant(vIndex, "price", e.target.value)
                                        }
                                        placeholder="0.00"
                                        className="w-32 border-2 border-slate-200 focus:border-purple-500 rounded-lg p-2.5 outline-none transition-all font-semibold"
                                      />
                                    </td>
                                    <td className="px-5 py-4">
                                      <input
                                        type="number"
                                        value={variant.compareAtPrice}
                                        onChange={(e) =>
                                          updateVariant(
                                            vIndex,
                                            "compareAtPrice",
                                            e.target.value
                                          )
                                        }
                                        placeholder="0.00"
                                        className="w-32 border-2 border-slate-200 focus:border-purple-500 rounded-lg p-2.5 outline-none transition-all font-semibold"
                                      />
                                    </td>
                                    <td className="px-5 py-4">
                                      <input
                                        type="text"
                                        value={variant.sku}
                                        onChange={(e) =>
                                          updateVariant(vIndex, "sku", e.target.value)
                                        }
                                        placeholder="SKU-001"
                                        className="w-36 border-2 border-slate-200 focus:border-purple-500 rounded-lg p-2.5 outline-none transition-all font-mono text-xs"
                                      />
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="col-span-12 lg:col-span-4 space-y-4">
                {/* Status */}
                <div className="bg-linear-to-br from-white to-slate-50 p-5 rounded-xl border-2 border-slate-200 shadow-sm">
                  <label className="text-sm font-bold text-gray-700 mb-3 block">
                    Product Status
                  </label>
                  <select
                    value={newProduct.status}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, status: e.target.value })
                    }
                    className="w-full border-2 border-slate-200 focus:border-purple-500 rounded-xl p-3.5 outline-none transition-all duration-200 bg-white font-semibold text-gray-900 cursor-pointer"
                  >
                    <option value="active">✅ Active - Visible to customers</option>
                    <option value="draft">📝 Draft - Hidden from store</option>
                  </select>
                </div>

                {/* Collection */}
                <div className="bg-linear-to-br from-white to-slate-50 p-5 rounded-xl border-2 border-slate-200 shadow-sm">
                  <label className="text-sm font-bold text-gray-700 mb-3 block">
                    Collection
                  </label>
                  <select
                    value={newProduct.collection}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, collection: e.target.value })
                    }
                    className="w-full border-2 border-slate-200 focus:border-purple-500 rounded-xl p-3.5 outline-none transition-all duration-200 bg-white font-medium text-gray-900 cursor-pointer"
                  >
                    <option value="">No collection</option>
                    {collections.map((col) => (
                      <option key={col._id} value={col._id}>
                        {col.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Product Type */}
                <div className="bg-linear-to-br from-white to-slate-50 p-5 rounded-xl border-2 border-slate-200 shadow-sm">
                  <label className="text-sm font-bold text-gray-700 mb-3 block">
                    Product Category
                  </label>
                  <input
                    value={newProduct.productType}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, productType: e.target.value })
                    }
                    placeholder="e.g., Clothing, Accessories"
                    className="w-full border-2 border-slate-200 focus:border-purple-500 rounded-xl p-3.5 outline-none transition-all duration-200 bg-white font-medium"
                  />
                </div>

                {/* Vendor */}
                <div className="bg-linear-to-br from-white to-slate-50 p-5 rounded-xl border-2 border-slate-200 shadow-sm">
                  <label className="text-sm font-bold text-gray-700 mb-3 block">
                    Brand / Vendor
                  </label>
                  <input
                    value={newProduct.vendor}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, vendor: e.target.value })
                    }
                    placeholder="e.g., Nike, Zara"
                    className="w-full border-2 border-slate-200 focus:border-purple-500 rounded-xl p-3.5 outline-none transition-all duration-200 bg-white font-medium"
                  />
                </div>

                {/* Tips Card */}
                <div className="bg-linear-to-br from-purple-600 to-pink-600 p-5 rounded-xl shadow-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-white" />
                    <h4 className="font-bold text-white">Pro Tips</h4>
                  </div>
                  <ul className="text-sm text-purple-50 space-y-2.5">
                    <li className="flex items-start gap-2">
                      <span className="text-white mt-0.5 font-bold">•</span>
                      <span>High-quality images boost conversions by 40%</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-white mt-0.5 font-bold">•</span>
                      <span>Use variants for sizes, colors, and styles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-white mt-0.5 font-bold">•</span>
                      <span>Compare price creates urgency with discounts</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-4 px-8 py-6 bg-linear-to-r from-slate-50 to-white border-t-2 border-slate-200 rounded-b-2xl">
              <button
                onClick={() => setOpen(false)}
                className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 cursor-pointer font-semibold rounded-xl transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="flex items-center cursor-pointer gap-2 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <Package className="w-5 h-5" />
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Page;