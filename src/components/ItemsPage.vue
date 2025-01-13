<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Items Management</h1>
      </v-col>
    </v-row>

    <!-- Add/Edit Item Dialog -->
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
          Add New Item
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
                <v-col cols="12">
                  <v-text-field
                    v-model="editedItem.name"
                    label="Item Name*"
                    :rules="[v => !!v || 'Name is required']"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="editedItem.price"
                    label="Price*"
                    type="number"
                    prefix="₹"
                    :rules="[
                      v => !!v || 'Price is required',
                      v => v > 0 || 'Price must be greater than 0'
                    ]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="editedItem.stock"
                    label="Stock*"
                    type="number"
                    :rules="[
                      v => !!v || 'Stock is required',
                      v => v >= 0 || 'Stock cannot be negative'
                    ]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="editedItem.description"
                    label="Description"
                    rows="3"
                  ></v-textarea>
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
        <v-card-title class="text-h5">Delete Item</v-card-title>
        <v-card-text>
          Are you sure you want to delete this item?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" text @click="closeDelete">Cancel</v-btn>
          <v-btn color="error" text @click="deleteItemConfirm">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Items Table -->
    <v-data-table
      :headers="headers"
      :items="items"
      :search="search"
      :loading="loading"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-text-field
          v-model="search"
          label="Search Items"
          class="mx-4"
          prepend-inner-icon="mdi-magnify"
          clearable
        ></v-text-field>
      </template>

      <template v-slot:item.price="{ item }">
        ₹{{ item.price.toFixed(2) }}
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
  name: 'ItemsPage',

  data: () => ({
    dialog: false,
    deleteDialog: false,
    valid: true,
    loading: false,
    search: '',
    headers: [
      { text: 'Name', value: 'name' },
      { text: 'Price', value: 'price' },
      { text: 'Stock', value: 'stock' },
      { text: 'Description', value: 'description' },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    editedIndex: -1,
    editedItem: {
      name: '',
      price: 0,
      stock: 0,
      description: ''
    },
    defaultItem: {
      name: '',
      price: 0,
      stock: 0,
      description: ''
    }
  }),

  computed: {
    ...mapState(['items']),
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item';
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
      await this.$store.dispatch('fetchItems');
      this.loading = false;
    },

    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.deleteDialog = true;
    },

    async deleteItemConfirm() {
      try {
        await deleteDoc(doc(db, 'Items', this.editedItem.id));
        this.initialize();
        this.closeDelete();
      } catch (error) {
        console.error('Error deleting item:', error);
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
            // Update existing item
            const itemRef = doc(db, 'Items', this.editedItem.id);
            await updateDoc(itemRef, {
              name: this.editedItem.name,
              price: this.editedItem.price,
              stock: this.editedItem.stock,
              description: this.editedItem.description
            });
          } else {
            // Add new item
            await addDoc(collection(db, 'Items'), {
              name: this.editedItem.name,
              price: this.editedItem.price,
              stock: this.editedItem.stock,
              description: this.editedItem.description
            });
          }
          this.initialize();
          this.close();
        } catch (error) {
          console.error('Error saving item:', error);
        }
      }
    }
  }
};
</script> 