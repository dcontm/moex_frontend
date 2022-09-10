<template>
  <v-card>
  <v-card-title>Портфель</v-card-title>
    <p>Общая стоимость валюты:{{portfolio.total_amount_currencies}}</p>
    <p>Общая стоимость акции: {{portfolio.total_amount_shares}}</p>
    <p>Общая стоимость облигации:{{portfolio.total_amount_bonds}}</p>
    <p>Общая стоимость фьючерсов:{{portfolio.total_amount_futures}}</p>
    <p>Общее изменение баланса:{{portfolio.expected_yield}}</p>
    <v-simple-table>
      <h2>Открытые позиции</h2>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">
              Актив
            </th>
            <th class="text-left">
              Цена
            </th>
            <th class="text-left">
              Изменение
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="position in portfolio.positions"
            :key="position"
          >
            <th>
              {{position.figi}}
            </th>
            <th>
              {{position.average_position_price}}
            </th>
            <th>
              {{position.expected_yield}}
            </th>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-card>
</template>
  </v-card>
</template>

<script>

import {getAPI} from '../../axios-api' 

export default {
  data: () => ({
    portfolio: '',
  }),
  async created () {
    const config = {headers: { 'Authorization': 'Bearer ' + this.$store.getters.getToken}}
    await getAPI.get('/users/portfolio', config)
    .then((response) => {
      this.portfolio = response.data
    }).catch((error) => {
      this.portfolio = [];
    });
  }
}
</script>