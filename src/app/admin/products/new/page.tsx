'use client';

import { useState, useCallback, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ImageUploader } from '@/components/ImageUploader';
import { IProductImage } from '@/models/Product';


interface ProductFormData {
  name: string;
  description: string;
  price: number;
  mprice: number;
  stock?: number;
  category: string;
  brand?: string;
  featured: boolean;
  images: IProductImage[];
}

export default function CreateProductForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    mprice: 0,
    stock: 0,
    category: '',
    brand: '',
    featured: false,
    images: [],
  });

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: name.includes('price') || name === 'stock' ? Number(value) : value,
      }));
    },
    []
  );

  const handleImagesUpload = useCallback((uploadedImages: IProductImage[]) => {
    setFormData(prev => ({ ...prev, images: uploadedImages }));
  }, []);

  const handleRemoveImage = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }, []);

  const handleSwitchChange = useCallback((checked: boolean) => {
    setFormData(prev => ({ ...prev, featured: checked }));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.images.length === 0) {
      toast.error('Please upload at least one product image');
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return;
    }

    if (formData.price <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        }),
      });

      if (!response.ok) {
        throw new Error(response.statusText || 'Failed to create product');
      }

      await response.json();
      toast.success('Product created successfully');
      router.push('/products');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <InputField
              label="Product Name*"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
              required
            />

            <TextareaField
              label="Description*"
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={isLoading}
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium">Product Images*</label>
              <ImageUploader
                onUploadComplete={handleImagesUpload}
                initialImages={formData.images}
                onRemoveImage={handleRemoveImage}
            
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Price*"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                min={0.01}
                step={0.01}
                required
                disabled={isLoading}
              />

              <InputField
                label="Market Price"
                name="mprice"
                type="number"
                value={formData.mprice}
                onChange={handleChange}
                min={0}
                step={0.01}
                disabled={isLoading}
              />
            </div>

            <InputField
              label="Stock Quantity"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              min={0}
              disabled={isLoading}
            />

            <InputField
              label="Category*"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              disabled={isLoading}
            />

            <InputField
              label="Brand"
              name="brand"
              value={formData.brand || ''}
              onChange={handleChange}
              disabled={isLoading}
            />

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <label className="block text-sm font-medium">Featured Product</label>
                <p className="text-sm text-muted-foreground">
                  Show this product on homepage
                </p>
              </div>
              <Switch
                checked={formData.featured}
                onCheckedChange={handleSwitchChange}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading || formData.images.length === 0}
            className="min-w-32"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Product'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

function InputField({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      <Input {...props} />
    </div>
  );
}

function TextareaField({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      <Textarea rows={5} {...props} />
    </div>
  );
}
