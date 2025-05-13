'use client';

export interface MenuItem {
  menuId: string;
  menuName: string;
  menuDescription: string;
  menuPrice: number;
  menuStatus: string;
  menuCategory: string;
  menuUrl: string;
}

interface MenuTableProps {
  onSelectMenu: (menu: MenuItem | null) => void;
}

const menuItems: MenuItem[] = [
  {
    menuId: 'M000000001',
    menuName: 'อเมริกาโน่Test',
    menuDescription:'GoodCoffee',
    menuPrice: 45,
    menuStatus: 'พร้อมขาย',
    menuCategory: 'กาแฟ',
    menuUrl: 'picture'
  },
  {
    menuId: 'M000000002',
    menuName: 'ชาไทยTest',
    menuDescription: 'ILoveIt',
    menuPrice: 40,
    menuStatus: 'พร้อมขาย',
    menuCategory: 'ชา',
    menuUrl: 'picture'
  }
];

export default function MenuTable({ onSelectMenu }: MenuTableProps) {
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">MenuID</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Name</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Description</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Price</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Category</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Image</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {menuItems.map((item) => (
            <tr
              key={item.menuId}
              onClick={() => onSelectMenu(item)}
              className="hover:bg-gray-50 cursor-pointer"
            >
              <td className="px-6 py-4 text-sm text-gray-900">{item.menuId}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{item.menuStatus}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{item.menuName}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{item.menuDescription}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{item.menuPrice}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{item.menuCategory}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{item.menuUrl}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 