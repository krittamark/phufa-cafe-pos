'use client';

import { useState, useEffect } from 'react';

interface DefaultRecipeItem {
  ingredientId: string;
  quantity: number;
  isBaseIngredient: boolean;
  isReplaceable: boolean;
}
interface MenuItem {
  menuId?: string;
  menuName: string;
  menuPrice: number;
  menuStatus: string;
  menuDescription: string;
  menuUrl: string;
  menuCategory: string;
  defaultRecipe?: DefaultRecipeItem[];
}

interface MenuDetailProps {
  menu: MenuItem | null;
  isCreating?: boolean;
  onSaved?: () => void;
}

export default function MenuDetail({ menu, isCreating, onSaved }: MenuDetailProps) {
  const [form, setForm] = useState<MenuItem>({
    menuName: '',
    menuPrice: 0,
    menuStatus: 'พร้อมขาย',
    menuDescription: '',
    menuUrl: '',
    menuCategory: '',
    defaultRecipe: []
  });

   // เมื่อ menu เปลี่ยน → เซ็ตค่าเริ่มต้นให้ form (กรณีไม่ใช่เพิ่มใหม่)
  useEffect(() => {
    if (menu && !isCreating) {
      setForm(menu);
    } else {
      // รีเซ็ตฟอร์มเมื่อสร้างใหม่
      setForm({
        menuName: '',
        menuPrice: 0,
        menuStatus: 'พร้อมขาย',
        menuDescription: '',
        menuUrl: '',
        menuCategory: '',
        defaultRecipe: []
      });
    }
  }, [menu, isCreating]);

  const handleChange = (field: keyof MenuItem, value: string | number) => {
    setForm({ ...form, [field]: value });
  };

  const handleSave = async () => {
    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error('Failed to save menu');

      alert('Menu saved successfully');
      onSaved?.(); // เรียก callback ให้ parent รีเฟรชหรือปิด form
    } catch (err: any) {
      alert('Error occurred: ' + err.message);
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold mb-4">
        {isCreating ? 'Add New Menu' : form.menuId}
        </h2>
        
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            value={form.menuStatus}
            onChange={(e) => handleChange('menuStatus', e.target.value)}
            className="w-full border rounded px-2 py-1"
          >
            <option value="พร้อมขาย">พร้อมขาย</option>
            <option value="ไม่พร้อมขาย">ไม่พร้อมขาย</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Menu ID</label>
          <input
            type="text"
            value={form.menuId}
            onChange={(e) => handleChange('menuId', e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={form.menuName}
            onChange={(e) => handleChange('menuName', e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={form.menuDescription}
            onChange={(e) => handleChange('menuDescription', e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            value={form.menuPrice}
            onChange={(e) => handleChange('menuPrice', Number(e.target.value))}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <input
            type="text"
            value={form.menuCategory}
            onChange={(e) => handleChange('menuCategory', e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Image</label>
          <input
            type="text"
            value={form.menuUrl}
            onChange={(e) => handleChange('menuUrl', e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 sm:text-sm"
          />
        </div>
      </div>

      <button
      onClick={handleSave} 
      className="mt-6 w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
        Save
      </button>
    </div>
  );
} 