'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { Upload } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface FormData {
  name: string;
  address: string;
  city: string;
  state: string;
  contact: string;
  email_id: string;
  image?: FileList;
}

export default function AddSchool() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    let imageUrl = '';

    try {
      // Upload image
      if (data.image && data.image[0]) {
        const formData = new FormData();
        formData.append('image', data.image[0]);

        const uploadResponse = await fetch('/api/schools/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const uploadError = await uploadResponse.json();
          throw new Error(uploadError.error || 'Failed to upload image');
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.imageUrl;
      }

      // Submit school data
      const schoolData = {
        name: data.name.trim(),
        address: data.address.trim(),
        city: data.city.trim(),
        state: data.state.trim(),
        contact: data.contact.trim(),
        email_id: data.email_id.trim().toLowerCase(),
        image: imageUrl,
      };

      const response = await fetch('/api/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(schoolData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add school');
      }

      toast.success('✅ School added successfully!');
      reset();
      setImagePreview(null);

      // Redirect after 1.5 seconds
      setTimeout(() => router.push('/schools'), 1500);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '❌ An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6 mt-20">
        {/* Toast container */}
        <Toaster position="top-right" reverseOrder={false} />

        {/* Card Wrapper */}
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
          {/* Header */}
          <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
            Add <span className="text-blue-600">New School</span>
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                School Name *
              </label>
              <input
                type="text"
                {...register('name', {
                  required: 'School name is required',
                  minLength: { value: 3, message: 'Minimum 3 characters' },
                })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Enter school name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Address *
              </label>
              <textarea
                {...register('address', {
                  required: 'Address is required',
                  minLength: { value: 10, message: 'Minimum 10 characters' },
                })}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Enter full address"
              />
              {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
            </div>

            {/* City & State */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">City *</label>
                <input
                  type="text"
                  {...register('city', { required: 'City is required' })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Enter city"
                />
                {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">State *</label>
                <input
                  type="text"
                  {...register('state', { required: 'State is required' })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Enter state"
                />
                {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>}
              </div>
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm font-semibold mb-2">Contact Number *</label>
              <input
                type="tel"
                {...register('contact', {
                  required: 'Contact number is required',
                  pattern: { value: /^[0-9]{10}$/, message: 'Enter a valid 10-digit number' },
                })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="10-digit number"
              />
              {errors.contact && <p className="mt-1 text-sm text-red-600">{errors.contact.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-2">Email *</label>
              <input
                type="email"
                {...register('email_id', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Enter a valid email',
                  },
                })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="example@email.com"
              />
              {errors.email_id && <p className="mt-1 text-sm text-red-600">{errors.email_id.message}</p>}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold mb-2">School Logo/Image</label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 transition">
                  <Upload className="w-5 h-5" />
                  <span>Upload</span>
                  <input
                    type="file"
                    {...register('image')}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </label>
                {imagePreview && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden border relative">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Adding...' : 'Add School'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/schools')}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
