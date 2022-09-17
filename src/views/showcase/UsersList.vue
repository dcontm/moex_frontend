<template>
  <v-card>
    <v-card-title>
      Пользователи
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
      :items="users"
      :items-per-page="100"
      item-key="id"
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
                    <v-text-field v-model="editedItem.email" label="email">
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.is_active" label="is_active">
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.is_superuser" label="is_superuser">
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
            <v-card-title class="text-h5">Вы уверены что хотите удалить пользователя?</v-card-title>
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
      users: [],
      headers: [
        { text: 'Email', value: 'email'},
        { text: 'Is_active', value: 'is_active'},
        { text: 'Is_superuser', value: 'is_superuser'},
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      editedIndex: -1,
      editedItem: {
        email: '',
        is_acrive: Boolean,
        is_superuser: Boolean,
      },
      defaultItem: {
        email: '',
        is_active: false,
        is_superuser: false,
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
        this.editedIndex = this.users.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem (item) {
        this.editedIndex = this.users.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },
      deleteItemConfirm () {
        this.users.splice(this.editedIndex, 1)
        this.deleteUser(this.editedItem.id)
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
          Object.assign(this.users[this.editedIndex], this.editedItem)
          this.updateUser(this.editedItem.id, this.editedItem)
        }
        this.close()
      },
      async deleteUser(id) {
        const config = {headers: { 'Authorization': 'Bearer ' + this.$store.getters.getToken}}
        await getAPI.delete('/users/'+id, config)
        .then((response) => {
        }).catch((error) => {
        });
      },
      async updateUser(id, updated) {
        const config = {headers: { 'Authorization': 'Bearer ' + this.$store.getters.getToken}}
        await getAPI.patch('/users/'+id, updated, config)
        .then((response) => {
        }).catch((error) => {
        });
      },
    },

    async created () {
      const config = {headers: { 'Authorization': 'Bearer ' + this.$store.getters.getToken}}
      await getAPI.get('/users/', config)
      .then((response) => {
        this.users = response.data.users;
      }).catch((error) => {
        this.users = [];
      });
    }
  }
</script>