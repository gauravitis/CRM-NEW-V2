<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path"
          link
        >
          <template v-slot:prepend>
            <v-icon>{{ item.icon }}</v-icon>
          </template>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="primary">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>CRM System</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const drawer = ref(null);

const menuItems = [
  { title: 'Home', path: '/', icon: 'mdi-home' },
  { title: 'Items', path: '/items', icon: 'mdi-package-variant' },
  { title: 'Clients', path: '/clients', icon: 'mdi-account-group' },
  { title: 'Employees', path: '/employees', icon: 'mdi-account-tie' },
  { title: 'Create Quotation', path: '/quotation', icon: 'mdi-file-document-edit' },
  { title: 'Saved Quotations', path: '/saved-quotations', icon: 'mdi-file-document' },
  { title: 'Pending Orders', path: '/pending-orders', icon: 'mdi-clock-outline' }
];
</script>

<style>
html {
  overflow-y: auto;
}
</style>
