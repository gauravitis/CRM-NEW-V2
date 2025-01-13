<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Clients Management</h1>
      </v-col>
    </v-row>

    <!-- Add/Edit Client Dialog -->
    <v-dialog v-model="dialog" max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          class="mb-4"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon left>mdi-plus</v-icon>
          Add New Client
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="editedItem.name"
                    label="Client Name*"
                    :rules="[v => !!v || 'Name is required']"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="editedItem.company"
                    label="Company Name*"
                    :rules="[v => !!v || 'Company name is required']"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="editedItem.email"
                    label="Email"
                    type="email"
                    :rules="emailRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="editedItem.phone"
                    label="Phone Number*"
                    :rules="[v => !!v || 'Phone number is required']"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="editedItem.address"
                    label="Address*"
                    :rules="[v => !!v || 'Address is required']"
                    required
                    rows="3"
                  ></v-textarea>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="editedItem.gst"
                    label="GST Number"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" text @click="close">Cancel</v-btn>
          <v-btn color="primary" text @click="save" :disabled="!valid">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Delete Client</v-card-title>
        <v-card-text>
          Are you sure you want to delete this client? This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" text @click="closeDelete">Cancel</v-btn>
          <v-btn color="error" text @click="deleteItemConfirm">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Clients Table -->
    <v-data-table
      :headers="headers"
      :items="clients"
      :search="search"
      :loading="loading"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-text-field
          v-model="search"
          label="Search Clients"
          class="mx-4"
          prepend-inner-icon="mdi-magnify"
          clearable
        ></v-text-field>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { collection, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

export default {
  name: 'ClientsPage',

  data: () => ({
    dialog: false,
    deleteDialog: false,
    valid: true,
    loading: false,
    search: '',
    emailRules: [
      v => !v || /.+@.+\..+/.test(v) || 'E-mail must be valid'
    ],
    headers: [
      { text: 'Name', value: 'name' },
      { text: 'Company', value: 'company' },
      { text: 'Email', value: 'email' },
      { text: 'Phone', value: 'phone' },
      { text: 'Address', value: 'address' },
      { text: 'GST Number', value: 'gst' },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    editedIndex: -1,
    editedItem: {
      name: '',
      company: '',
      email: '',
      phone: '',
      address: '',
      gst: ''
    },
    defaultItem: {
      name: '',
      company: '',
      email: '',
      phone: '',
      address: '',
      gst: ''
    }
  }),

  computed: {
    ...mapState(['clients']),
    formTitle() {
      return this.editedIndex === -1 ? 'New Client' : 'Edit Client';
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    deleteDialog(val) {
      val || this.closeDelete();
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    async initialize() {
      this.loading = true;
      await this.$store.dispatch('fetchClients');
      this.loading = false;
    },

    editItem(item) {
      this.editedIndex = this.clients.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.clients.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.deleteDialog = true;
    },

    async deleteItemConfirm() {
      try {
        await deleteDoc(doc(db, 'Clients', this.editedItem.id));
        this.initialize();
        this.closeDelete();
      } catch (error) {
        console.error('Error deleting client:', error);
      }
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.deleteDialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {
      if (this.$refs.form.validate()) {
        try {
          if (this.editedIndex > -1) {
            // Update existing client
            const clientRef = doc(db, 'Clients', this.editedItem.id);
            await updateDoc(clientRef, {
              name: this.editedItem.name,
              company: this.editedItem.company,
              email: this.editedItem.email,
              phone: this.editedItem.phone,
              address: this.editedItem.address,
              gst: this.editedItem.gst
            });
          } else {
            // Add new client
            await addDoc(collection(db, 'Clients'), {
              name: this.editedItem.name,
              company: this.editedItem.company,
              email: this.editedItem.email,
              phone: this.editedItem.phone,
              address: this.editedItem.address,
              gst: this.editedItem.gst
            });
          }
          this.initialize();
          this.close();
        } catch (error) {
          console.error('Error saving client:', error);
        }
      }
    }
  }
};
</script> 