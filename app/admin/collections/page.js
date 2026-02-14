"use client";
import React, { useState, useEffect } from "react";
import { Plus, Edit2, Search, X, Image as ImageIcon, ChevronDown, Package } from "lucide-react";

const CollectionsPage = () => {
  const [collections, setCollections] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [newCollection, setNewCollection] = useState({ name: "", description: "", image: null });
  const [imagePreview, setImagePreview] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCollections, setExpandedCollections] = useState(new Set());

  const fetchCollections = async () => {
    try {
      const req = await fetch("/api/collections");
      const res = await req.json();
      setCollections(res.collections || []);
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/getProducts");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
    fetchProducts();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewCollection({ ...newCollection, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreateOrUpdateCollection = async () => {
    const formData = new FormData();
    formData.append("name", newCollection.name);
    formData.append("description", newCollection.description);
    if (newCollection.image) {
      formData.append("image", newCollection.image);
    }
    selectedProducts.forEach(productId => {
      formData.append("products", productId);
    });

    if (isEditing) {
      formData.append("id", editingCollection._id);
    }

    const url = "/api/collections";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        body: formData,
      });
      if (res.ok) {
        fetchCollections();
        setShowCreateForm(false);
        setIsEditing(false);
        setEditingCollection(null);
        setNewCollection({ name: "", description: "", image: null });
        setImagePreview("");
        setSelectedProducts([]);
        setSearchTerm("");
      } else {
        const errorData = await res.json();
        alert(`Failed to ${isEditing ? "update" : "create"} collection: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(`Failed to ${isEditing ? "update" : "create"} collection`);
    }
  };

  const handleEditCollection = (collection) => {
    setIsEditing(true);
    setEditingCollection(collection);
    setNewCollection({
      name: collection.name,
      description: collection.description,
      image: null,
    });
    setImagePreview(collection.image || "");
    setSelectedProducts(collection.products.map(p => p._id));
    setShowCreateForm(true);
  };

  const toggleCollection = (collectionId) => {
    const newExpanded = new Set(expandedCollections);
    if (newExpanded.has(collectionId)) {
      newExpanded.delete(collectionId);
    } else {
      newExpanded.add(collectionId);
    }
    setExpandedCollections(newExpanded);
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white backdrop-blur-sm border-b w-full border-slate-200 sticky top-0 z-10 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Collections</h2>
            <p className="text-gray-500 text-sm mt-1">Organize your products into collections</p>
          </div>
          <button
            onClick={() => {
              setIsEditing(false);
              setEditingCollection(null);
              setNewCollection({ name: "", description: "", image: null });
              setImagePreview("");
              setSelectedProducts([]);
              setSearchTerm("");
              setShowCreateForm(true);
            }}
            className="flex items-center gap-2 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Plus size={20} />
            Create Collection
          </button>
        </div>
      </div>

      {/* Collections List */}
      <div className="space-y-4">
        {collections.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-linear-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package size={40} className="text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No collections yet</h3>
            <p className="text-gray-500 mb-6">Start organizing your products by creating your first collection</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center gap-2 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus size={20} />
              Create Your First Collection
            </button>
          </div>
        ) : (
          collections.map((collection) => (
            <div
              key={collection._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Collection Header */}
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Collection Image */}
                    {collection.image ? (
                      <div className="w-20 h-20 rounded-xl overflow-hidden shadow-md">
                        <img
                          src={collection.image}
                          alt={collection.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 bg-linear-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                        <Package size={32} className="text-purple-600" />
                      </div>
                    )}

                    {/* Collection Info */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{collection.name}</h3>
                      <p className="text-gray-500 text-sm mt-1 line-clamp-1">{collection.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                          <Package size={14} />
                          {collection.products.length} Products
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleEditCollection(collection)}
                      className="flex items-center cursor-pointer gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium transition-all duration-200"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => toggleCollection(collection._id)}
                      className="p-2 hover:bg-slate-100 cursor-pointer rounded-lg transition-all duration-200"
                    >
                      <ChevronDown
                        size={20}
                        className={`text-gray-600 transition-transform duration-300 ${
                          expandedCollections.has(collection._id) ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Products */}
              {expandedCollections.has(collection._id) && (
                <div className="border-t border-gray-100 bg-linear-to-b from-slate-50 to-white p-6">
                  {collection.products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {collection.products.map((product) => (
                        <div
                          key={product._id}
                          className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100"
                        >
                          <div className="aspect-square bg-gray-100 overflow-hidden">
                            <img
                              src={product.images?.[0]}
                              alt={product.title}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="p-3">
                            <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">{product.title}</h4>
                            <p className="text-purple-600 font-bold text-sm mt-1">Rs. {product.price.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No products in this collection</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Collection Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-start overflow-y-auto p-4">
          <div className="bg-white w-full max-w-6xl my-10 rounded-2xl shadow-2xl relative animate-slideUp">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-linear-to-r from-purple-50 to-pink-50 rounded-t-2xl">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {isEditing ? "Edit Collection" : "Create New Collection"}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {isEditing ? "Update your collection details" : "Add a new collection to organize your products"}
                </p>
              </div>
              <button
                onClick={() => setShowCreateForm(false)}
                className="p-2 hover:bg-white cursor-pointer rounded-full transition-all duration-200"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="grid grid-cols-12 gap-6 p-8">
              {/* LEFT SIDE */}
              <div className="col-span-8 space-y-6">
                {/* Name */}
                <div className="bg-linear-to-br from-slate-50 to-white p-6 rounded-xl border border-gray-200">
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Collection Name</label>
                  <input
                    value={newCollection.name}
                    onChange={(e) =>
                      setNewCollection({ ...newCollection, name: e.target.value })
                    }
                    type="text"
                    placeholder="e.g., Summer Collection 2024"
                    className="w-full border-2 border-gray-200 focus:border-purple-500 rounded-xl p-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-200"
                  />
                </div>

                {/* Description */}
                <div className="bg-linear-to-br from-slate-50 to-white p-6 rounded-xl border border-gray-200">
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Description</label>
                  <textarea
                    value={newCollection.description}
                    onChange={(e) =>
                      setNewCollection({
                        ...newCollection,
                        description: e.target.value,
                      })
                    }
                    rows={4}
                    placeholder="Describe this collection..."
                    className="w-full border-2 border-gray-200 focus:border-purple-500 rounded-xl p-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-200 resize-none"
                  />
                </div>

                {/* Select Products */}
                <div className="bg-linear-to-br from-slate-50 to-white p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-semibold text-gray-700">Select Products</label>
                    <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                      {selectedProducts.length} selected
                    </span>
                  </div>

                  {/* Search */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search products by title..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 focus:border-purple-500 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    />
                  </div>

                  {/* Products List */}
                  <div className="max-h-80 overflow-y-auto space-y-2 pr-2">
                    {loading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                      </div>
                    ) : filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <label
                          key={product._id}
                          className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                            selectedProducts.includes(product._id)
                              ? "bg-purple-50 border-purple-300"
                              : "bg-white border-gray-200 hover:border-purple-200"
                          }`}
                        >
                          <input
                            type="checkbox"
                            value={product._id}
                            checked={selectedProducts.includes(product._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedProducts([...selectedProducts, product._id]);
                              } else {
                                setSelectedProducts(selectedProducts.filter(id => id !== product._id));
                              }
                            }}
                            className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                          />
                          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                            <img
                              src={product.images?.[0]}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm truncate">{product.title}</p>
                            <p className="text-purple-600 font-semibold text-sm">Rs. {product.price.toLocaleString()}</p>
                          </div>
                        </label>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <Package size={48} className="text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No products match your search</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="col-span-4 space-y-6">
                {/* Media Upload */}
                <div className="bg-linear-to-br from-slate-50 to-white p-6 rounded-xl border border-gray-200">
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">Collection Image</label>
                  <label
                    className={`relative flex flex-col items-center justify-center rounded-xl cursor-pointer overflow-hidden transition-all duration-200 ${
                      imagePreview
                        ? "border-2 border-purple-300 aspect-square"
                        : "border-2 border-dashed border-gray-300 hover:border-purple-400 h-64"
                    }`}
                  >
                    {imagePreview ? (
                      <div className="relative w-full h-full group">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                          <span className="text-white font-medium">Change Image</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-6">
                        <div className="w-16 h-16 bg-linear-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <ImageIcon size={32} className="text-purple-600" />
                        </div>
                        <p className="text-gray-700 font-medium mb-1">Upload Image</p>
                        <p className="text-gray-500 text-xs">Click to browse or drag & drop</p>
                        <p className="text-gray-400 text-xs mt-2">PNG, JPG up to 10MB</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-8 py-6 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-6 py-2.5 cursor-pointer bg-white hover:bg-gray-100 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateOrUpdateCollection}
                className="px-6 py-2.5 cursor-pointer bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                {isEditing ? "Update Collection" : "Create Collection"}
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

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        /* Custom scrollbar for product list */
        .space-y-2::-webkit-scrollbar {
          width: 8px;
        }

        .space-y-2::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .space-y-2::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #a855f7, #ec4899);
          border-radius: 10px;
        }

        .space-y-2::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #9333ea, #db2777);
        }
      `}</style>
    </div>
  );
};

export default CollectionsPage;