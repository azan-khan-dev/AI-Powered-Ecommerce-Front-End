// Dummy data for the admin dashboard

export const products = [
  {
    id: 1,
    title: "Wireless Bluetooth Headphones",
    description: "High-quality wireless headphones with noise cancellation and premium sound quality. Perfect for music lovers and professionals.",
    price: 199.99,
    discountPrice: 149.99,
    category: "Electronics",
    categoryId: 1,
    sku: "WBH-001",
    stock: 25,
    images: [
      "https://via.placeholder.com/400x300/4A90E2/FFFFFF?text=Headphones+1",
      "https://via.placeholder.com/400x300/4A90E2/FFFFFF?text=Headphones+2",
      "https://via.placeholder.com/400x300/4A90E2/FFFFFF?text=Headphones+3"
    ],
    variants: [
      { id: 1, name: "Color", options: ["Black", "White", "Blue"] },
      { id: 2, name: "Size", options: ["Standard"] }
    ],
    status: "active",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20"
  },
  {
    id: 2,
    title: "Cotton T-Shirt",
    description: "Comfortable 100% cotton t-shirt available in multiple colors and sizes.",
    price: 29.99,
    discountPrice: null,
    category: "Clothing",
    categoryId: 2,
    sku: "CTS-002",
    stock: 50,
    images: [
      "https://via.placeholder.com/400x300/E94B3C/FFFFFF?text=T-Shirt+1",
      "https://via.placeholder.com/400x300/E94B3C/FFFFFF?text=T-Shirt+2"
    ],
    variants: [
      { id: 3, name: "Color", options: ["Red", "Blue", "Green", "Black"] },
      { id: 4, name: "Size", options: ["S", "M", "L", "XL"] }
    ],
    status: "active",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-12"
  },
  {
    id: 3,
    title: "Gardening Tools Set",
    description: "Complete set of premium gardening tools including shovel, rake, and pruners.",
    price: 89.99,
    discountPrice: 69.99,
    category: "Home & Garden",
    categoryId: 3,
    sku: "GTS-003",
    stock: 8,
    images: [
      "https://via.placeholder.com/400x300/50E3C2/FFFFFF?text=Gardening+Tools"
    ],
    variants: [],
    status: "active",
    createdAt: "2024-01-20",
    updatedAt: "2024-01-25"
  },
  {
    id: 4,
    title: "Programming Book",
    description: "Comprehensive guide to modern web development with React and Node.js.",
    price: 49.99,
    discountPrice: null,
    category: "Books",
    categoryId: 4,
    sku: "PBK-004",
    stock: 15,
    images: [
      "https://via.placeholder.com/400x300/F5A623/FFFFFF?text=Programming+Book"
    ],
    variants: [],
    status: "active",
    createdAt: "2024-02-01",
    updatedAt: "2024-02-05"
  },
  {
    id: 5,
    title: "Smart Watch",
    description: "Feature-rich smartwatch with health tracking and notifications.",
    price: 299.99,
    discountPrice: 249.99,
    category: "Electronics",
    categoryId: 1,
    sku: "SW-005",
    stock: 3,
    images: [
      "https://via.placeholder.com/400x300/4A90E2/FFFFFF?text=Smart+Watch+1",
      "https://via.placeholder.com/400x300/4A90E2/FFFFFF?text=Smart+Watch+2"
    ],
    variants: [
      { id: 5, name: "Color", options: ["Black", "Silver", "Gold"] },
      { id: 6, name: "Size", options: ["42mm", "44mm"] }
    ],
    status: "active",
    createdAt: "2024-01-25",
    updatedAt: "2024-01-30"
  }
];

export const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1-555-0123",
    avatar: "https://via.placeholder.com/100x100/4A90E2/FFFFFF?text=JD",
    address: "123 Main St, New York, NY 10001",
    registrationDate: "2024-01-01",
    totalOrders: 5,
    totalSpent: 1250.50,
    status: "active"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1-555-0456",
    avatar: "https://via.placeholder.com/100x100/E94B3C/FFFFFF?text=JS",
    address: "456 Oak Ave, Los Angeles, CA 90210",
    registrationDate: "2024-01-05",
    totalOrders: 3,
    totalSpent: 850.75,
    status: "active"
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    phone: "+1-555-0789",
    avatar: "https://via.placeholder.com/100x100/50E3C2/FFFFFF?text=BJ",
    address: "789 Pine Rd, Chicago, IL 60601",
    registrationDate: "2024-01-10",
    totalOrders: 2,
    totalSpent: 450.25,
    status: "active"
  }
];

export const orders = [
  {
    id: "ORD-001",
    customerId: 1,
    customerName: "John Doe",
    customerEmail: "john.doe@example.com",
    items: [
      {
        productId: 1,
        productName: "Wireless Bluetooth Headphones",
        quantity: 1,
        price: 149.99,
        variant: { color: "Black" }
      },
      {
        productId: 2,
        productName: "Cotton T-Shirt",
        quantity: 2,
        price: 29.99,
        variant: { color: "Blue", size: "L" }
      }
    ],
    subtotal: 209.97,
    tax: 16.80,
    shipping: 9.99,
    total: 236.76,
    status: "delivered",
    paymentMethod: "Credit Card",
    shippingAddress: "123 Main St, New York, NY 10001",
    orderDate: "2024-12-01",
    deliveredDate: "2024-12-05"
  },
  {
    id: "ORD-002",
    customerId: 2,
    customerName: "Jane Smith",
    customerEmail: "jane.smith@example.com",
    items: [
      {
        productId: 3,
        productName: "Gardening Tools Set",
        quantity: 1,
        price: 69.99,
        variant: {}
      }
    ],
    subtotal: 69.99,
    tax: 5.60,
    shipping: 9.99,
    total: 85.58,
    status: "shipped",
    paymentMethod: "PayPal",
    shippingAddress: "456 Oak Ave, Los Angeles, CA 90210",
    orderDate: "2024-12-10",
    shippedDate: "2024-12-12"
  },
  {
    id: "ORD-003",
    customerId: 3,
    customerName: "Bob Johnson",
    customerEmail: "bob.johnson@example.com",
    items: [
      {
        productId: 4,
        productName: "Programming Book",
        quantity: 1,
        price: 49.99,
        variant: {}
      },
      {
        productId: 5,
        productName: "Smart Watch",
        quantity: 1,
        price: 249.99,
        variant: { color: "Black", size: "44mm" }
      }
    ],
    subtotal: 299.98,
    tax: 24.00,
    shipping: 9.99,
    total: 333.97,
    status: "processing",
    paymentMethod: "Credit Card",
    shippingAddress: "789 Pine Rd, Chicago, IL 60601",
    orderDate: "2024-12-15"
  },
  {
    id: "ORD-004",
    customerId: 1,
    customerName: "John Doe",
    customerEmail: "john.doe@example.com",
    items: [
      {
        productId: 2,
        productName: "Cotton T-Shirt",
        quantity: 3,
        price: 29.99,
        variant: { color: "Black", size: "M" }
      }
    ],
    subtotal: 89.97,
    tax: 7.20,
    shipping: 9.99,
    total: 107.16,
    status: "pending",
    paymentMethod: "Credit Card",
    shippingAddress: "123 Main St, New York, NY 10001",
    orderDate: "2024-12-18"
  }
];

export const salesData = {
  totalSales: 763.47,
  totalRevenue: 763.47,
  totalOrders: 4,
  averageOrderValue: 190.87,
  recentOrders: orders.slice(0, 5),
  lowStockProducts: products.filter(p => p.stock <= 10),
  // Sales data for charts
  dailySales: [
    { date: "2024-12-01", sales: 236.76, orders: 1 },
    { date: "2024-12-02", sales: 0, orders: 0 },
    { date: "2024-12-03", sales: 0, orders: 0 },
    { date: "2024-12-04", sales: 0, orders: 0 },
    { date: "2024-12-05", sales: 0, orders: 0 },
    { date: "2024-12-06", sales: 0, orders: 0 },
    { date: "2024-12-07", sales: 0, orders: 0 },
    { date: "2024-12-08", sales: 0, orders: 0 },
    { date: "2024-12-09", sales: 0, orders: 0 },
    { date: "2024-12-10", sales: 85.58, orders: 1 },
    { date: "2024-12-11", sales: 0, orders: 0 },
    { date: "2024-12-12", sales: 0, orders: 0 },
    { date: "2024-12-13", sales: 0, orders: 0 },
    { date: "2024-12-14", sales: 0, orders: 0 },
    { date: "2024-12-15", sales: 333.97, orders: 1 },
    { date: "2024-12-16", sales: 0, orders: 0 },
    { date: "2024-12-17", sales: 0, orders: 0 },
    { date: "2024-12-18", sales: 107.16, orders: 1 }
  ],
  weeklySales: [
    { week: "Week 1 (Dec)", sales: 322.34, orders: 2 },
    { week: "Week 2 (Dec)", sales: 85.58, orders: 1 },
    { week: "Week 3 (Dec)", sales: 333.97, orders: 1 },
    { week: "Week 4 (Dec)", sales: 107.16, orders: 1 }
  ],
  monthlySales: [
    { month: "November 2024", sales: 1250.50, orders: 8 },
    { month: "October 2024", sales: 2100.75, orders: 15 },
    { month: "September 2024", sales: 1850.25, orders: 12 },
    { month: "August 2024", sales: 1675.00, orders: 10 },
    { month: "July 2024", sales: 1425.50, orders: 9 },
    { month: "June 2024", sales: 1980.75, orders: 14 }
  ],
  yearlySales: [
    { year: "2024", sales: 9282.75, orders: 68 },
    { year: "2023", sales: 15680.50, orders: 125 }
  ]
};
