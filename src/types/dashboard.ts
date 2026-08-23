import { OrderStatus } from "@prisma/client";

export interface DashboardCard {
  title: string;
  value: number;
  change: number;
  icon: string;
  color: string;
}

export interface DashboardOrder {
  id: string;
  orderNumber: string;
  customer: string;
  total: number;
  status: OrderStatus;
  createdAt: Date;
}

export interface DashboardCustomer {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  createdAt: Date;
}

export interface DashboardProduct {
  id: string;
  name: string;
  sku: string | null;
  stock: number;
  image?: string | null;
}

export interface DashboardActivity {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
}

export interface DashboardSales {
  month: string;
  revenue: number;
}

export interface DashboardData {
  cards: {
    revenue: number;
    orders: number;
    customers: number;
    products: number;
  };

  sales: DashboardSales[];

  recentOrders: DashboardOrder[];

  recentCustomers: DashboardCustomer[];

  lowStockProducts: DashboardProduct[];

  recentActivities: DashboardActivity[];
}