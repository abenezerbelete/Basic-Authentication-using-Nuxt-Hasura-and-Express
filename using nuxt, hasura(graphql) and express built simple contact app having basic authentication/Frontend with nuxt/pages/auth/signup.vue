<template>
    <v-container>
        <v-card max-width="1000" class="mx-auto" shaped>
            <v-card-title>Signup Here</v-card-title>
            <v-card-text>
                <v-form ref="registerForm" v-model="valid" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field v-model="firstName" :rules="[rules.required, rules.alpha]" label="First Name" maxlength="20" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field v-model="lastName" :rules="[rules.required, rules.alpha]" label="Last Name" maxlength="20" required></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field v-model="email"  :rules="emailRules" label="E-mail" required></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field v-model="password" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :rules="[rules.required, rules.min]" :type="show1 ? 'text' : 'password'" name="input-10-1" label="Password" hint="At least 8 characters" counter @click:append="show1 = !show1"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field block v-model="verify" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :rules="[rules.required, passwordMatch]" :type="show1 ? 'text' : 'password'" name="input-10-1" label="Confirm Password" counter @click:append="show1 = !show1"></v-text-field>
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col class="d-flex">
                            <v-btn x-large block :disabled="!valid" color="success" @click="validate">Register</v-btn>
                        </v-col>
                    </v-row>
                </v-form>
                <p>If you're already registered please login <a href="/auth/login">here</a></p>
            </v-card-text>
        </v-card>
    </v-container>
</template>
<script>
import { gql } from 'graphql-tag';

// quering passhash action in hasura graphql 
const jab = gql`
  mutation sign_up($pwd: String!){
    passhash(pwd: $pwd) {
    hash
  }
  
}
`

// mutation to insert a new user in hasura graphql
const ins = gql`
    mutation log($fn: String!, $ln: String!, $em: String!, $pwd: String!) {
  insert_users(objects: {first_name: $fn, last_name: $ln, email: $em, password: $pwd}) {
      returning{
          id
  }
  }
}
`
export default {
    middleware: 'jab',
    name: 'Signup',
    head () {
        return {
            title: 'Signup'
        }
    },
    computed: {
        passwordMatch() {
            return () => this.password === this.verify || "Password must match";
        }
    },
    methods: {
        validate() {
            if (this.$refs.registerForm.validate()) {
                    this.$apollo.query({
                        query: gql`
                            query j ($em: String!) {
                                users(where: {email: {_eq: $em}}){
                                    id
                                }
                            }
                        `,
                        variables: {
                            em: this.email
                        }
                    }).then(l => {
                        if (l.data.users.length == 1){
                            alert('Please use another email this is already registered!')
                        }
                        else{
                            this.$apollo.mutate({
                                    mutation: jab,
                                    variables: {
                                        pwd: this.verify
                                    },
                                }).then(rs => {
                                    const s = JSON.stringify(rs.data.passhash.hash).toString()
                                    const hs = s.substring(1, s.length-1)

                                    this.$apollo.mutate({
                                        mutation: ins,
                                        variables: {
                                            fn: this.firstName,
                                            ln: this.lastName,
                                            em: this.email,
                                            pwd: hs
                                        },
                                    }).then(abe => {
                                        alert('Thank you have registered!')
                                        window.location.replace('/auth/login')
                                    }).catch(err => {
                                        console.log(err)
                                    })

                                }).catch(err => {
                                    alert('Your logic server may not be initiated! Unable to connect.')
                                    console.log(err)
                                })
                        }
                    })
                }
            },
        reset() {
            this.$refs.form.reset();
        },
        resetValidation() {
            this.$refs.form.resetValidation();
        }
    },
    data () {
        return {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            verify: "",
            valid: false,
            show1: false,
            rules: {
                required: value => !!value || "Required.",
                min: v => (v && v.length >= 8) || "Min 8 characters",
                alpha: v => (v && /^[A-Z][a-z]+$/.test(v)) || 'First letter capital and Letter only, 2 letter atleast.',
            },
            emailRules: [
                v => !!v || "Required",
                v => /.+@.+\..+/.test(v) || "E-mail must be valid"
            ],

        }
    }
}
</script>