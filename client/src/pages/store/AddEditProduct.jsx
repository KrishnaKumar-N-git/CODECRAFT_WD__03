import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import api from '../../services/api';
import { ArrowLeft, Save, Upload, X, ImagePlus, CheckCircle2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getProductSvg } from '../../utils/grocerySvgLibrary';

export const AddEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const fileInputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Selected File (not yet uploaded â€” just a local preview)
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // Already-saved image URL (from DB when editing)
  const [savedImageUrl, setSavedImageUrl] = useState('');

  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: '',
    weight: '1 kg',
    mrp: '',
    sellingPrice: '',
    stock: 50,
    description: ''
  });

  // â”€â”€ Load categories & product (if editing) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/categories');
        const list = res.data.data?.categories || [];
        setCategories(list);
        if (list.length > 0 && !formData.category) {
          setFormData((prev) => ({ ...prev, category: list[0]._id }));
        }
      } catch (err) {
        console.error('Failed to load categories');
      }
    };
    fetchCats();

    if (isEdit) {
      const fetchProduct = async () => {
        try {
          const res = await productService.getProductById(id);
          const p = res.product;
          setFormData({
            name: p.name || '',
            category: p.category?._id || p.category || '',
            brand: p.brand || '',
            weight: p.weight || '1 kg',
            mrp: p.mrp || '',
            sellingPrice: p.sellingPrice || '',
            stock: p.stock || 0,
            description: p.description || ''
          });
          // Show existing image from DB
          const existingImg = p.images?.[0]?.url || '';
          if (existingImg && existingImg.startsWith('http')) {
            setSavedImageUrl(existingImg);
          }
        } catch (err) {
          toast.error('Failed to fetch product details');
        }
      };
      fetchProduct();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit]);

  // â”€â”€ File helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const processFile = (file) => {
    if (!file) return;
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      toast.error('Only JPG, PNG, or WebP images are allowed');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File must be smaller than 10 MB');
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setSavedImageUrl('');
  };

  const handleFileChange = (e) => processFile(e.target.files?.[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const clearImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setSavedImageUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // â”€â”€ Upload image to Cloudinary via server â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const uploadImageToServer = async (productId) => {
    if (!selectedFile) return;
    setUploadingImage(true);
    setUploadProgress(0);

    const formPayload = new FormData();
    formPayload.append('images', selectedFile);

    try {
      await api.post(`/products/${productId}/images`, formPayload, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(pct);
        }
      });
      toast.success('Image uploaded to Cloudinary âœ…');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Image upload failed';
      toast.error(`Image upload failed: ${msg}`);
    } finally {
      setUploadingImage(false);
      setUploadProgress(0);
    }
  };

  // â”€â”€ Form submit â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        brand: formData.brand,
        weight: formData.weight,
        mrp: Number(formData.mrp),
        sellingPrice: Number(formData.sellingPrice),
        stock: Number(formData.stock),
        description: formData.description
      };

      let productId = id;

      if (isEdit) {
        await productService.updateProduct(id, payload);
        toast.success('Product details updated âœ…');
      } else {
        const res = await productService.createProduct(payload);
        productId = res.product?._id;
        toast.success('Product created âœ…');
      }

      // Step 2: Upload image to Cloudinary if a new file was selected
      if (selectedFile && productId) {
        await uploadImageToServer(productId);
      }

      navigate('/store/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  // â”€â”€ Display logic â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const displayImage = previewUrl || savedImageUrl;
  const fallbackSvg = getProductSvg(formData.name || 'Product', '');
  const isImageReady = Boolean(displayImage);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/store/products"
          className="flex items-center space-x-2 text-xs font-bold text-gray-600 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
        <h2 className="text-xl font-black text-gray-900">{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5">

        {/* Product Name */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-700">Product Name *</label>
          <input
            type="text"
            required
            placeholder="e.g. Aashirvaad Sharbati Atta 5kg"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Category *</label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Brand Name</label>
            <input
              type="text"
              placeholder="e.g. Fortune, Amul, Tata"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">MRP (â‚¹) *</label>
            <input
              type="number"
              required
              min="1"
              placeholder="340"
              value={formData.mrp}
              onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Selling Price (â‚¹) *</label>
            <input
              type="number"
              required
              min="1"
              placeholder="295"
              value={formData.sellingPrice}
              onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Stock Quantity *</label>
            <input
              type="number"
              required
              min="0"
              placeholder="50"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-700">Weight / Package Size</label>
          <input
            type="text"
            placeholder="e.g. 500g Pack, 1 L Bottle, 5 kg Bag"
            value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {/* â”€â”€ Image Upload Section â”€â”€ */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-700 block">
            Product Photo
            <span className="ml-1 text-[10px] text-gray-400 font-normal">(JPG, PNG, WebP Â· Max 10 MB)</span>
          </label>

          {isImageReady ? (
            /* Preview card shown when image is selected or already saved */
            <div className="flex items-start space-x-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
              {/* Thumbnail */}
              <div className="relative flex-shrink-0">
                <img
                  src={displayImage}
                  alt="Product preview"
                  className="w-20 h-20 object-cover rounded-xl border-2 border-emerald-300 shadow-sm bg-white"
                  onError={(e) => { e.target.src = fallbackSvg; }}
                />
                {uploadingImage && (
                  <div className="absolute inset-0 bg-black/60 rounded-xl flex flex-col items-center justify-center">
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                    <span className="text-[9px] text-white font-bold mt-1">{uploadProgress}%</span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                {previewUrl ? (
                  <>
                    <div className="flex items-center space-x-1.5 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <p className="text-xs font-bold text-emerald-900">Photo ready to upload</p>
                    </div>
                    <p className="text-[10px] text-gray-500 truncate">{selectedFile?.name}</p>
                    <p className="text-[10px] text-gray-400">
                      {selectedFile ? (selectedFile.size / 1024 / 1024).toFixed(2) + ' MB' : ''} Â· Will be uploaded to Cloudinary on save
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-1.5 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <p className="text-xs font-bold text-emerald-900">Current photo (on Cloudinary)</p>
                    </div>
                    <p className="text-[10px] text-gray-400">Upload a new file below to replace it.</p>
                  </>
                )}

                <div className="flex items-center space-x-3 mt-2">
                  <label className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer flex items-center space-x-1 bg-white px-2 py-1 rounded-lg border border-emerald-200 hover:border-emerald-400 transition-colors">
                    <Upload className="w-3 h-3" />
                    <span>Change Photo</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={clearImage}
                    className="text-[10px] text-red-500 font-bold hover:text-red-700 flex items-center space-x-1"
                  >
                    <X className="w-3 h-3" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Drag-and-drop drop zone */
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 select-none ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-50 scale-[1.01]'
                  : 'border-gray-300 bg-gray-50 hover:border-emerald-400 hover:bg-emerald-50/50'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-colors ${
                isDragging ? 'bg-emerald-100' : 'bg-white border border-gray-200 shadow-sm'
              }`}>
                <ImagePlus className={`w-6 h-6 ${isDragging ? 'text-emerald-600' : 'text-gray-400'}`} />
              </div>
              <p className="text-xs font-bold text-gray-700 mb-1">
                {isDragging ? 'Drop your image here!' : 'Drag & drop or click to upload'}
              </p>
              <p className="text-[10px] text-gray-400">JPG, PNG, WebP â€” up to 10 MB</p>
              <p className="text-[10px] text-emerald-600 font-semibold mt-1">Stored permanently on Cloudinary</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}

          {!isImageReady && (
            <p className="text-[10px] text-gray-400 font-medium italic">
              If no photo is uploaded, GrocMart automatically generates a beautiful graphic for this item.
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-700">Product Description</label>
          <textarea
            rows={3}
            placeholder="Fresh, organic and high quality grocery staple..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || uploadingImage}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-xl shadow-emerald-600/30 flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {loading || uploadingImage ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{uploadingImage ? `Uploading to Cloudinaryâ€¦ ${uploadProgress}%` : 'Saving Productâ€¦'}</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{isEdit ? 'Update Product' : 'Create Product'}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddEditProduct;
