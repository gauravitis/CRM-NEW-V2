import { defineStore } from 'pinia';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

interface Item {
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
}

interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  gst: string;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  mobile: string;
}

interface Quotation {
  id: string;
  company: string;
  clientId: string;
  employeeId: string;
  items: Array<{
    itemId: string;
    quantity: number;
    unitRate: number;
    discount: number;
    gst: number;
  }>;
  status: 'draft' | 'sent' | 'approved' | 'rejected';
  date: string;
}

interface Order {
  id: string;
  quotationId: string;
  status: 'pending' | 'shipped' | 'delivered';
  paymentStatus: 'pending' | 'partial' | 'paid';
}

export const useStore = defineStore('main', {
  state: () => ({
    items: [] as Item[],
    clients: [] as Client[],
    employees: [] as Employee[],
    quotations: [] as Quotation[],
    orders: [] as Order[]
  }),

  actions: {
    async fetchItems() {
      const querySnapshot = await getDocs(collection(db, 'Items'));
      this.items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Item[];
    },

    async fetchClients() {
      const querySnapshot = await getDocs(collection(db, 'Clients'));
      this.clients = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Client[];
    },

    async fetchEmployees() {
      const querySnapshot = await getDocs(collection(db, 'Employees'));
      this.employees = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Employee[];
    },

    async fetchQuotations() {
      const querySnapshot = await getDocs(collection(db, 'Quotations'));
      this.quotations = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Quotation[];
    },

    async fetchOrders() {
      const querySnapshot = await getDocs(collection(db, 'Orders'));
      this.orders = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
    }
  },

  getters: {
    getItemById: (state) => (id: string) => state.items.find(item => item.id === id),
    getClientById: (state) => (id: string) => state.clients.find(client => client.id === id),
    getEmployeeById: (state) => (id: string) => state.employees.find(employee => employee.id === id),
    getQuotationById: (state) => (id: string) => state.quotations.find(quotation => quotation.id === id),
    getOrderById: (state) => (id: string) => state.orders.find(order => order.id === id)
  }
}); 