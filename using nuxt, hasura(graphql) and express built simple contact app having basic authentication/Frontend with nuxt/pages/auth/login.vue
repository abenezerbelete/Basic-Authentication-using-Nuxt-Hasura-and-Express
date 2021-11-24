<template>
    <v-container>
        <v-card max-width="500" class="mx-auto ma-16" shaped>
            <v-card-title>Please Login</v-card-title>
            <v-card-text>
                <v-form ref="loginForm" v-model="valid" lazy-validation>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="loginEmail" :rules="loginEmailRules" label="E-mail" required></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field v-model="loginPassword" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :rules="[rules.required, rules.min]" :type="show1 ? 'text' : 'password'" name="input-10-1" label="Password" hint="At least 8 characters" counter @click:append="show1 = !show1"></v-text-field>
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col class="d-flex">
                            <v-btn x-large block :disabled="!valid" color="success" @click="validate"> Login </v-btn>
                        </v-col>
                    </v-row>
                    <p>If you don't have an account register <a href="/auth/signup">here</a></p>
                </v-form>
            </v-card-text>
        </v-card>
    </v-container>
</template>
<script>
import gql from 'graphql-tag';

const mu = gql`
    mutation log ($id: String!, $em: String!, $pwd: String!, $epwd: String!){
        login (id: $id, password: $pwd, encpass: $epwd, email: $em) {
            accessToken
        }
    }
`

export default {
    middleware: 'jab',
    name: 'Login', 
    head () {
        return {
            title: 'Login'
        }
    },
    methods: {
        validate() {
            if (this.$refs.loginForm.validate()) {
                    this.$apollo.query({
                        prefetch: true,
                        query: gql`
                                query MyQuery($em: String!) {
                                users(where: {email: {_eq: $em}}){
                                    id
                                    password
                                }
                                }
                            `,
                        variables: {
                            em: this.loginEmail
                        }, 
                        }).then(rs => {
                            if (rs.data.users.length == 1){

                            const p = JSON.stringify(rs.data.users)
                            const pp = p.substr(1, p.length-2)
                            const s = JSON.parse(pp)
                            const ii = JSON.stringify(s.id)
                            const id = ii.substr(1, ii.length-2)
                            const ep = JSON.stringify(s.password)
                            const epd = ep.substr(1, ep.length-2)
                            this.$apollo.mutate({
                                prefetch: true,
                                mutation: mu,
                                variables: {
                                    pwd: this.loginPassword,
                                    epwd: epd,
                                    id: id,
                                    em: this.loginEmail
                                }
                            }).then(s => {
                                const d = JSON.stringify(s.data.login.accessToken)
                                    const dd = d.substr(1, d.length-2)
                                    if (dd == 'Wrong Credentials')
                                        alert(dd)
                                    else{
                                        window.localStorage.setItem('accessToken', d.substr(1, d.length-2))
                                        window.location.replace('/contact')
                                    }        
                            }).catch(re => {
                                console.log(re)
                                alert('Your logic end may not be initiated, Unable to connect the server.')
                            })
                            }
                            else alert('Wrong credentials!')
                            
                        }).catch(err => {
                        console.log('err bel '+err)
                        alert(err)
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
        return{
            valid: false,
            show1: false,
            loginEmail: "",
            loginPassword: "",
            loginEmailRules: [
                v => !!v || "Required",
                v => /.+@.+\..+/.test(v) || "E-mail must be valid"
            ],
            rules: {
                required: value => !!value || "Required.",
                min: v => (v && v.length >= 8) || "Min 8 characters"
                }
        }
    }
}
</script>