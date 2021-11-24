<template>
  <v-app white>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-toolbar-title v-text="title" />&nbsp;&nbsp;&nbsp;
      <a href="/"><v-toolbar-title>Home</v-toolbar-title></a>&nbsp;&nbsp;&nbsp;
      <a href="/about"><v-toolbar-title>About</v-toolbar-title></a>
      <v-spacer />
      <div v-if="us">
        <a href="/contact">Contacts</a>
        Hello {{ us }}&nbsp;&nbsp;&nbsp;
        <a color="info" @click="logout()">Logout</a>
      </div>
      <div v-else>
        <v-btn color="success" to="/auth/signup">Signup</v-btn>&nbsp;
        <v-btn color="info" to="/auth/login">Login</v-btn>
      </div>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer
      :absolute="!fixed"
      app
    >
      <span>Copyright Protected &copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import jwt from 'jsonwebtoken';

export default {
  data () {
    return {
      clipped: false,
      fixed: false,
      title: 'Web Contact'
    }
  },
  methods: {
    logout(){
      window.localStorage.removeItem('accessToken')
      window.location.replace('/')
    }
  },
  computed: {
        us () {
            var d = ''
            var em = ''
            if (window.localStorage.getItem('accessToken')) {
              d = window.localStorage.getItem('accessToken')
              const decoded = jwt.verify(d, 'your-secret')
              const st = JSON.stringify(decoded['https://hasura.io/jwt/claims']['x-hasura-user-email'])
              em = st.substr(1, st.length-2)
            }
            return em
        }
    },
}
</script>
<style scoped>
a {
  text-decoration: none;
}
</style>