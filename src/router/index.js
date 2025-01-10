import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../components/HomePage.vue')
  },
  {
    path: '/items',
    name: 'Items',
    component: () => import('../components/ItemsPage.vue')
  },
  {
    path: '/clients',
    name: 'Clients',
    component: () => import('../components/ClientsPage.vue')
  },
  {
    path: '/employees',
    name: 'Employees',
    component: () => import('../components/EmployeesPage.vue')
  },
  {
    path: '/quotation',
    name: 'Quotation',
    component: () => import('../components/QuotationPage.vue')
  },
  {
    path: '/saved-quotations',
    name: 'SavedQuotations',
    component: () => import('../components/SavedQuotationsPage.vue')
  },
  {
    path: '/pending-orders',
    name: 'PendingOrders',
    component: () => import('../components/PendingOrdersPage.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router; 