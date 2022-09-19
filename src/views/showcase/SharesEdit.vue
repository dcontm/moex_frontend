<template>
  <v-card>
    <v-card-title>
      Список торговых инструментов
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Поиск"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      dense
      :search="search"
      :headers="headers"
      :items="shares"
      :items-per-page="100"
      item-key="figi"
      class="elevation-1"
    >
      <template slot="top">
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="text-h5">Редактирование</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.figi" label="figi">
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.ticker" label="ticker">
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.name" label="name">
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.price" label="price">
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.old_price" label="old_price">
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">
                Закрыть
              </v-btn>
              <v-btn color="blue darken-1" text @click="save">
                Сохранить
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Вы уверены что хотите удалить торговый инструмент?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Закрыть</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">Удалить</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
  </v-card>
</template>

<script>
  import {getAPI} from '../../axios-api' 
  export default {
    data: () => ({
      search: '',
      dialog: false,
      dialogDelete: false,
      shares: [],
      headers: [
        { text: 'figi', value: 'figi'},
        { text: 'ticker', value: 'ticker'},
        { text: 'name', value: 'name'},
        { text: 'price', value: 'price'},
        { text: 'old_price', value: 'old_price'},
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      editedIndex: -1,
      editedItem: {
        figi: '',
        ticker: '',
        name : '',
      },
      defaultItem: {
        figi: '',
        ticker: '',
        name: '',
      }
    }),

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    methods: {
      editItem (item) {
        this.editedIndex = this.shares.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem (item) {
        this.editedIndex = this.shares.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },
      deleteItemConfirm () {
        this.shares.splice(this.editedIndex, 1)
        this.deleteShare(this.editedItem.figi)
        this.closeDelete()
      },
      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.shares[this.editedIndex], this.editedItem)
          this.updateShare(this.editedItem.figi, this.editedItem)
        }
        this.close()
      },
      async deleteShare(figi) {
        const config = {headers: { 'Authorization': 'Bearer ' + this.$store.getters.getToken}}
        await getAPI.delete('/shares/'+figi, config)
        .then((response) => {
        }).catch((error) => {
        });
      },
      async updateShare(figi, updated) {
        const config = {headers: { 'Authorization': 'Bearer ' + this.$store.getters.getToken}}
        await getAPI.put('/shares/'+figi+'/edit', updated, config)
        .then((response) => {
        }).catch((error) => {
        });
      },
    },

    async created () {
      const config = {headers: { 'Authorization': 'Bearer ' + this.$store.getters.getToken}}
      await getAPI.get('/shares', config)
      .then((response) => {
        this.shares = response.data;
      }).catch((error) => {
        this.shares = [];
      });
    }
  }
</script>