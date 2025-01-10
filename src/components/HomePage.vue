<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Welcome to CRM System</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="4">
        <v-card class="mb-4">
          <v-card-title class="primary white--text">
            <v-icon left color="white">mdi-package-variant</v-icon>
            Items
          </v-card-title>
          <v-card-text class="text-h5 text-center py-4">
            {{ itemCount }} Items
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="mb-4">
          <v-card-title class="success white--text">
            <v-icon left color="white">mdi-account-group</v-icon>
            Clients
          </v-card-title>
          <v-card-text class="text-h5 text-center py-4">
            {{ clientCount }} Clients
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="mb-4">
          <v-card-title class="warning white--text">
            <v-icon left color="white">mdi-file-document</v-icon>
            Quotations
          </v-card-title>
          <v-card-text class="text-h5 text-center py-4">
            {{ quotationCount }} Quotations
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            Recent Quotations
            <v-spacer></v-spacer>
            <v-btn color="primary" text to="/saved-quotations">
              View All
              <v-icon right>mdi-chevron-right</v-icon>
            </v-btn>
          </v-card-title>
          <v-list>
            <v-list-item v-for="quotation in recentQuotations" :key="quotation.id">
              <v-list-item-content>
                <v-list-item-title>{{ quotation.clientName }}</v-list-item-title>
                <v-list-item-subtitle>{{ quotation.date }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-chip :color="getStatusColor(quotation.status)" small>
                  {{ quotation.status }}
                </v-chip>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            Pending Orders
            <v-spacer></v-spacer>
            <v-btn color="primary" text to="/pending-orders">
              View All
              <v-icon right>mdi-chevron-right</v-icon>
            </v-btn>
          </v-card-title>
          <v-list>
            <v-list-item v-for="order in pendingOrders" :key="order.id">
              <v-list-item-content>
                <v-list-item-title>{{ order.clientName }}</v-list-item-title>
                <v-list-item-subtitle>Order #{{ order.orderNumber }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-chip color="warning" small>Pending</v-chip>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'HomePage',
  
  computed: {
    ...mapState(['items', 'clients', 'quotations', 'orders']),
    
    itemCount() {
      return this.items.length;
    },
    
    clientCount() {
      return this.clients.length;
    },
    
    quotationCount() {
      return this.quotations.length;
    },
    
    recentQuotations() {
      return this.quotations
        .slice()
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    },
    
    pendingOrders() {
      return this.orders
        .filter(order => order.status === 'pending')
        .slice(0, 5);
    }
  },

  methods: {
    getStatusColor(status) {
      const colors = {
        pending: 'warning',
        approved: 'success',
        rejected: 'error'
      };
      return colors[status.toLowerCase()] || 'grey';
    }
  },

  created() {
    // Fetch all required data when component is created
    this.$store.dispatch('fetchItems');
    this.$store.dispatch('fetchClients');
    this.$store.dispatch('fetchQuotations');
    this.$store.dispatch('fetchOrders');
  }
};
</script> 