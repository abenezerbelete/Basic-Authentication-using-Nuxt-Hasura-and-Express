<template>
  <v-container>
      <v-card>
        <v-card-title class="headline">
          Welcome to your web contact manager
        </v-card-title>
        <v-card-text>
          <div class="row">
            <div class="col-6">
              <h3>We have <i>{{cons}}+</i> contacts</h3>
              <img src="../static/contact.jpeg" alt="Contact Pic">
            </div>
            <div class="col-6">
              <h3>We have <i>{{user}}+</i> users</h3>
              <img src="../static/user.png" alt="Users Pic">
            </div>
          </div>
          <h3>What are you waiting, create your account <a href="/auth/signup">here</a></h3>
        </v-card-text>
      </v-card>
  </v-container>
</template>
<script>
import abe from '~/apollo/query/fetch.gql';

export default {
  data () {
    return {
      user: '',
      cons: ''
    }
  },
  apollo: {
    users: {
      prefetch: true,
      query: abe, 
      update (data) {
        this.user = data.users_aggregate.aggregate.count -1
        this.cons = data.contacts_aggregate.aggregate.count -1
      }
    }
  },
  head () {
    return{
      title: 'Home'
    }
  }
}
</script>