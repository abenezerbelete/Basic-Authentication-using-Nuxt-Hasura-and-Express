<template>
    <div class="container">
        <v-card max-width="500">
            <v-card-title>Add your contact here.</v-card-title>
                <v-card-text>
                    <v-form ref="addContact" v-model="valid" lazy-validation>
                        <v-file-input v-model="pic" accept="image/*" label="Choose you picture" />
                        <v-text-field :rules="[rules.required, rules.alpha]" v-model="fn" label="First name" />
                        <v-text-field :rules="[rules.required, rules.alpha]" v-model="ln" label="Last name" />
                        <div class="row">
                            <div class="col-10" id="emails">
                                <v-text-field :rules="EmailRules" v-model="email" label="Email" />
                            </div>
                            <div class="col-2 md-6">
                                <v-btn color="info"><v-icon>mdi-plus</v-icon></v-btn>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-10" id="phones">
                                <v-text-field :rules="[rules.bzat]" v-model="phone" label="Phone" />
                            </div>
                            <div class="col-2 md-6">
                                <v-btn color="info"><v-icon>mdi-plus</v-icon></v-btn>
                            </div>
                        </div>
                        
                        <v-text-field v-model="country" label="Country" />
                        <v-select
                            :items="items"
                            v-model="group"
                            label="Group"
                        >
                        </v-select>
                        <v-btn x-large block @click="validate" :disabled="!valid" color="success">Save</v-btn>
                    </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>
<script>
import gql from 'graphql-tag'
import jwt from 'jsonwebtoken'

// getting id from the accessToken

export function iid () {
    var d = ''
    var id = ''
    if (window.localStorage.getItem('accessToken')) {
        d = window.localStorage.getItem('accessToken')
        const decoded = jwt.verify(d, 'your-secret')
        const st = JSON.stringify(decoded['https://hasura.io/jwt/claims']['x-hasura-user-id'])
        id = st.substr(1, st.length-2)
    }
    return id
}

// inserting contact to graphql 
export const x = gql `
    mutation cont($fn: String!, $ln: String!, $em: String!, $ph: String!, $pic: String!, $cou: String!, $us: uuid!, $gr: String!){
        insert_contacts(objects: {first_name: $fn, last_name: $ln, email: $em, phone: $ph, pic: $pic, country: $cou, userId: $us, group: $gr}){
    returning{
      id
    }
  }
}
`

export default {
    middleware: 'authenticated',
    name: 'AddContact',
    data() {
        return {
            items: [
                'Home', 
                'Work',
                'Mobile'
            ],
            pic: '',
            ii: iid(),
            fn: '',
            ln: '',
            group: '',
            country: '',
            email: '',
            phone: '',
            valid: false,
            EmailRules: [
                v => /.+@.+\..+/.test(v)  || "E-mail must be valid"
            ],
            rules: {
                required: value => !!value || "Required.",
                bzat: v => /^\+{1}2{1}5{1}1{1}\d{9}$/.test(v) || " '+ 8 - 11 numbers' ",
                alpha: v => (v && /^[A-Z][a-z]+$/.test(v)) || 'First letter capital and Letter only, 2 letter atleast.',
            }
        }
    },
    mounted () {
        this.$forceUpdate();
    },
    methods: {
        validate() {
            if (this.$refs.addContact.validate()) {
                    this.$apollo.mutate({
                        prefetch: true,
                        mutation: x,
                        variables: {
                            fn: this.fn,
                            ln: this.ln,
                            gr: this.group,
                            cou: this.country,
                            ph: this.phone+' , '+this.yene2(),
                            us: this.ii,
                            em: this.email + ' , '+this.yene(),
                            pic: this.pic ? this.pic.name : ''
                        },
                        context: {
                            headers: {
                                Authorization: 'Bearer '+window.localStorage.getItem('accessToken')
                            }
                        }
                    }).then(res => {
                        window.location.replace('/contact')
                    }).catch(er =>{
                        console.log(er)
                    })
                }
            },
        reset() {
            this.$refs.form.reset();
        },
        resetValidation() {
            this.$refs.form.resetValidation();
        },
    }
};
</script>
