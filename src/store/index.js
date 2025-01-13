import Vue from 'vue';
import Vuex from 'vuex';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    items: [],
    clients: [],
    employees: [],
    quotations: [],
    orders: []
  },
  mutations: {
    setItems(state, items) {
      state.items = items;
    },
    setClients(state, clients) {
      state.clients = clients;
    },
    setEmployees(state, employees) {
      state.employees = employees;
    },
    setQuotations(state, quotations) {
      state.quotations = quotations;
    },
    setOrders(state, orders) {
      state.orders = orders;
    }
  },
  actions: {
    async fetchItems({ commit }) {
      const querySnapshot = await getDocs(collection(db, 'Items'));
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      commit('setItems', items);
    },
    async fetchClients({ commit }) {
      const querySnapshot = await getDocs(collection(db, 'Clients'));
      const clients = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      commit('setClients', clients);
    },
    async fetchEmployees({ commit }) {
      const querySnapshot = await getDocs(collection(db, 'Employees'));
      const employees = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      commit('setEmployees', employees);
    },
    async fetchQuotations({ commit }) {
      const querySnapshot = await getDocs(collection(db, 'Quotations'));
      const quotations = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      commit('setQuotations', quotations);
    },
    async fetchOrders({ commit }) {
      const querySnapshot = await getDocs(collection(db, 'Orders'));
      const orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      commit('setOrders', orders);
    }
  },
  getters: {
    getItems: state => state.items,
    getClients: state => state.clients,
    getEmployees: state => state.employees,
    getQuotations: state => state.quotations,
    getOrders: state => state.orders
  }
}); 