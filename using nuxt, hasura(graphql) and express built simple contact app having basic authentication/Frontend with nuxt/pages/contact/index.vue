<template>
    <div class="container">
        <h2>Contact Page</h2>
        <v-btn v-bind:color="color" @click="toggleAddContact"><v-icon>{{ic}}</v-icon>{{tt}}</v-btn>
        <div v-if="showAddContact">
            <AddContact />
        </div>
        <Contacts :contacts="contacts" @delete-contact="deleteContact" />
        <p></p>
        <v-card v-if="emda == 0">
            <v-card-title>
                You have no contacts
            </v-card-title>
        </v-card>
    </div>
</template>
<script>
import Contacts from '../contact/Contacts'
import AddContact from '../contact/AddContact'
import cons from '~/apollo/query/fetchcontacts.gql'
import jwt from 'jsonwebtoken'
import gql from 'graphql-tag'

// getting email from the accessToken
export function us () {
    var d = ''
    var em = ''
    if (window.localStorage.getItem('accessToken')) {
        d = window.localStorage.getItem('accessToken')
        try{
            const decoded = jwt.verify(d, 'your-secret')
            const ss = JSON.stringify(decoded['https://hasura.io/jwt/claims']['x-hasura-user-id'])
            em = ss.substr(1, ss.length-2)
        }
        catch(er){
            console.log('er '+er)
        }
    }
    return em
}

export default {
    middleware: 'authenticated',
    components: {
        Contacts,
        AddContact
    },
    data() {
        return {
            contacts: [],
            emda: Number,
            showAddContact: false,
            tt: 'Add Contact',
            ic: 'mdi-plus',
            color: 'primary'
        }
    },
    head() {
        return {
            title: 'Contacts', 
            titleTemplate: ''
        }
    },
    apollo: {
        conts:{
            prefetch: true,
            query: cons,
            variables: {
                em: us()
            },
            context: {
                headers: {
                    'Authorization': 'Bearer '+window.localStorage.getItem('accessToken')
                }
            },
            update(data){
                this.contacts = data.contacts
                this.emda = data.contacts.length
            },
            error(er){
                console.log(er)
            }
        }
    },
    methods: {
        toggleAddContact() {
            this.showAddContact = !this.showAddContact
            if(this.showAddContact){
                this.tt = ''
                this.color = 'secondary'
                this.ic = 'mdi-minus'
            }
            else{
                this.tt = 'Add Contact'
                this.color = 'primary'
                this.ic = 'mdi-plus'
            }
        },
        deleteContact(id) {
            if(confirm('Are you sure?')){
                this.$apollo.mutate({
                    prefetch: true,
                    mutation: gql`
                        mutation d($id: uuid!){
                            delete_contacts(where: {id: {_eq: $id}}){
                                returning{
                                    id
                                }
                            }}
                    `,
                    variables:{
                        id: id
                    },
                    context: {
                        headers: {
                            Authorization: 'Bearer '+window.localStorage.getItem('accessToken')
                        }
                    }
                }).then(res => {
                    console.log(res)
                    window.location.replace('/contact')
                }).catch(er =>{
                    console.log(er)
                })
            }
        }
    }
};
</script>