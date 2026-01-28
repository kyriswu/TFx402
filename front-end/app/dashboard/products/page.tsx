'use client';

import { useState } from 'react';

export default function ProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    description: '',
    price: '',
    difficulty: 'easy',
    ticketPrice: '',
  });

  // 验证表单数据
  const validateForm = (): boolean => {
    setFormError('');
    
    if (!formData.title.trim()) {
      setFormError('商品标题不能为空');
      return false;
    }
    
    if (formData.title.trim().length < 2) {
      setFormError('商品标题至少需要2个字符');
      return false;
    }
    
    if (!formData.price || parseFloat(formData.price) < 0) {
      setFormError('请输入有效的商品价格');
      return false;
    }
    
    if (!formData.ticketPrice || parseFloat(formData.ticketPrice) < 0) {
      setFormError('请输入有效的票价');
      return false;
    }
    
    if (formData.description.length > 500) {
      setFormError('商品描述不能超过500个字符');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('Submitting form data:', formData);
    e.preventDefault();
    
    // 校验表单
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setFormSuccess('');
    
    try {
      // 准备请求数据
      const payload = {
        title: formData.title.trim(),
        image: formData.image,
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        ticketPrice: parseFloat(formData.ticketPrice),
        difficulty: formData.difficulty,
      };

      console.log('Submitting product:', payload);
      
      // 发起 POST 请求
      const response = await fetch('http://localhost:4000/addProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `请求失败: ${response.status}`);
      }
      
      const result = await response.json();
      
      // 成功处理
      setFormSuccess('商品添加成功！');
      console.log('Product added:', result);
      
      // 延迟关闭弹窗和清空表单
      setTimeout(() => {
        setIsModalOpen(false);
        setFormData({
          title: '',
          image: '',
          description: '',
          price: '',
          difficulty: 'easy',
          ticketPrice: '',
        });
        setFormSuccess('');
      }, 1500);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '添加商品失败，请重试';
      setFormError(errorMessage);
      console.error('Error adding product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock product data
  const products = [
    {
      id: 1,
      name: "高级护肤精华液",
      category: "护肤品",
      price: 298.00,
      stock: 156,
      status: "active",
      image: "/api/placeholder/300/200",
      sales: 1234
    },
    {
      id: 2,
      name: "天然有机面膜",
      category: "面部护理",
      price: 128.00,
      stock: 89,
      status: "active",
      image: "/api/placeholder/300/200",
      sales: 856
    },
    {
      id: 3,
      name: "保湿润肤霜",
      category: "护肤品",
      price: 189.00,
      stock: 0,
      status: "out_of_stock",
      image: "/api/placeholder/300/200",
      sales: 2145
    },
    {
      id: 4,
      name: "清洁洁面乳",
      category: "清洁",
      price: 98.00,
      stock: 234,
      status: "active",
      image: "/api/placeholder/300/200",
      sales: 3421
    },
    {
      id: 5,
      name: "抗皱眼霜",
      category: "护肤品",
      price: 368.00,
      stock: 45,
      status: "low_stock",
      image: "/api/placeholder/300/200",
      sales: 567
    },
    {
      id: 6,
      name: "温和卸妆水",
      category: "清洁",
      price: 88.00,
      stock: 178,
      status: "active",
      image: "/api/placeholder/300/200",
      sales: 1890
    },
    {
      id: 7,
      name: "修复精华套装",
      category: "套装",
      price: 588.00,
      stock: 23,
      status: "low_stock",
      image: "/api/placeholder/300/200",
      sales: 234
    },
    {
      id: 8,
      name: "美白淡斑霜",
      category: "护肤品",
      price: 258.00,
      stock: 112,
      status: "active",
      image: "/api/placeholder/300/200",
      sales: 789
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="3" />
            </svg>
            在售
          </span>
        );
      case "out_of_stock":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="3" />
            </svg>
            缺货
          </span>
        );
      case "low_stock":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="3" />
            </svg>
            库存低
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-dark dark:text-white font-fira-code">
            商品管理
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            管理您的产品库存和销售信息
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-200 cursor-pointer">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            筛选
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white transition-colors duration-200 cursor-pointer shadow-sm"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            添加商品
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">总商品数</p>
              <p className="text-2xl font-bold text-text-dark dark:text-white mt-1">
                {products.length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">在售商品</p>
              <p className="text-2xl font-bold text-text-dark dark:text-white mt-1">
                {products.filter(p => p.status === 'active').length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">库存预警</p>
              <p className="text-2xl font-bold text-text-dark dark:text-white mt-1">
                {products.filter(p => p.status === 'low_stock' || p.status === 'out_of_stock').length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">总销量</p>
              <p className="text-2xl font-bold text-text-dark dark:text-white mt-1">
                {products.reduce((sum, p) => sum + p.sales, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-shadow duration-200 cursor-pointer group"
          >
            {/* Product Image */}
            <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-16 h-16 text-purple-300 dark:text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              
              {/* Status Badge - Absolute positioned */}
              <div className="absolute top-3 left-3">
                {getStatusBadge(product.status)}
              </div>

              {/* Quick Actions */}
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors duration-200">
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors duration-200">
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4 space-y-3">
              {/* Category */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                  {product.category}
                </span>
              </div>

              {/* Product Name */}
              <h3 className="text-lg font-semibold text-text-dark dark:text-white line-clamp-1">
                {product.name}
              </h3>

              {/* Price */}
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-primary">
                  ¥{product.price.toFixed(2)}
                </span>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-700">
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span>库存: {product.stock}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span>销量: {product.sales}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* Modal Container */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div 
              className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-text-dark dark:text-white">
                      添加新商品
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                      填写商品基本信息
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200 cursor-pointer"
                >
                  <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Body - Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Error Message */}
                {formError && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-red-800 dark:text-red-300">
                        {formError}
                      </p>
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {formSuccess && (
                  <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-green-800 dark:text-green-300">
                        {formSuccess}
                      </p>
                    </div>
                  </div>
                )}
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    商品标题 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="请输入商品标题"
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    商品图片 URL
                  </label>
                    <div className="space-y-3">
                    <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-6 text-center hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors duration-200 cursor-pointer group">
                      <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setFormData({ ...formData, image: event.target?.result as string });
                        };
                        reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                      />
                      <label htmlFor="image" className="flex flex-col items-center gap-2 cursor-pointer">
                      <div className="w-12 h-12 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors duration-200">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        点击上传或拖拽图片
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        支持 JPG, PNG, GIF (最大 5MB)
                        </p>
                      </div>
                      </label>
                    </div>
                    </div>
                    {formData.image && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg flex items-center justify-center">
                      <img
                      src={formData.image}
                      alt="Preview"
                      className="max-w-full max-h-40 object-contain rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                      />
                    </div>
                    )}
                </div>

                {/* Description (Rich Text) */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    商品描述
                  </label>
                  <div className="border border-gray-300 dark:border-slate-600 rounded-lg overflow-hidden">
                    {/* Rich Text Toolbar */}
                    <div className="flex items-center gap-1 p-2 bg-gray-50 dark:bg-slate-700/50 border-b border-gray-300 dark:border-slate-600">
                      <button type="button" className="p-2 hover:bg-gray-200 dark:hover:bg-slate-600 rounded transition-colors duration-200 cursor-pointer" title="粗体">
                        <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
                        </svg>
                      </button>
                      <button type="button" className="p-2 hover:bg-gray-200 dark:hover:bg-slate-600 rounded transition-colors duration-200 cursor-pointer" title="斜体">
                        <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m8 4l-4-4-4 4m-8 0l-4 4 4 4" />
                        </svg>
                      </button>
                      <button type="button" className="p-2 hover:bg-gray-200 dark:hover:bg-slate-600 rounded transition-colors duration-200 cursor-pointer" title="链接">
                        <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      </button>
                      <div className="w-px h-6 bg-gray-300 dark:bg-slate-600 mx-1"></div>
                      <button type="button" className="p-2 hover:bg-gray-200 dark:hover:bg-slate-600 rounded transition-colors duration-200 cursor-pointer" title="列表">
                        <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                      </button>
                    </div>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="请输入商品详细描述..."
                      rows={4}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none resize-none"
                    ></textarea>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {formData.description.length} / 500 字符
                  </p>
                </div>

                {/* Price */}
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    商品价格 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                      ¥
                    </span>
                    <input
                      type="number"
                      id="price"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
                    />
                  </div>
                </div>

                {/* Ticket Price */}
                <div>
                  <label htmlFor="ticketPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  票价 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                    ¥
                  </span>
                  <input
                    type="number"
                    id="ticketPrice"
                    required
                    min="0"
                    step="0.01"
                    value={formData.ticketPrice}
                    onChange={(e) => setFormData({ ...formData, ticketPrice: e.target.value })}
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
                  />
                  </div>
                </div>

                {/* Difficulty Level (Tabs) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    难度等级 <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, difficulty: 'easy' })}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                        formData.difficulty === 'easy'
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-300 dark:border-slate-600 hover:border-green-300 dark:hover:border-green-700'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          formData.difficulty === 'easy'
                            ? 'bg-green-500'
                            : 'bg-gray-200 dark:bg-slate-600'
                        }`}>
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className={`font-medium ${
                          formData.difficulty === 'easy'
                            ? 'text-green-700 dark:text-green-300'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          简单
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, difficulty: 'medium' })}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                        formData.difficulty === 'medium'
                          ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                          : 'border-gray-300 dark:border-slate-600 hover:border-yellow-300 dark:hover:border-yellow-700'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          formData.difficulty === 'medium'
                            ? 'bg-yellow-500'
                            : 'bg-gray-200 dark:bg-slate-600'
                        }`}>
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <span className={`font-medium ${
                          formData.difficulty === 'medium'
                            ? 'text-yellow-700 dark:text-yellow-300'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          中等
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, difficulty: 'hard' })}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                        formData.difficulty === 'hard'
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'border-gray-300 dark:border-slate-600 hover:border-red-300 dark:hover:border-red-700'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          formData.difficulty === 'hard'
                            ? 'bg-red-500'
                            : 'bg-gray-200 dark:bg-slate-600'
                        }`}>
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <span className={`font-medium ${
                          formData.difficulty === 'hard'
                            ? 'text-red-700 dark:text-red-300'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          困难
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Modal Footer - Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isLoading}
                    className="px-5 py-2.5 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-200 cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors duration-200 cursor-pointer shadow-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        提交中...
                      </>
                    ) : (
                      '添加商品'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
