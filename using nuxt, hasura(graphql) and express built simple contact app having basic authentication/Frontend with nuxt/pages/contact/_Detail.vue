<template>
    <div>
        <h3>{{ contact.first_name }} Details</h3>
        <v-card-title class="cyan darken-1">
        <img src="~/static/user.png" class="img-circle" width="40" height="40">&nbsp;&nbsp;
        <span class="text-h5 white--text">{{contact.first_name}} {{contact.last_name}}</span>
        <v-spacer></v-spacer>
        </v-card-title>
        <v-list>
            <v-list-item>
                <v-list-item-action>
                    <v-icon>mdi-phone</v-icon>
                </v-list-item-action>

                <v-list-item-content>
                    <v-list-item-title v-if="contact.phone">{{contact.phone}}</v-list-item-title>
                    <v-list-item-title v-else><v-icon>mdi-minus</v-icon></v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-divider inset></v-divider>

            <v-list-item>
                <v-list-item-action>
                    <v-icon>mdi-email</v-icon>
                </v-list-item-action>

                <v-list-item-content>
                    <v-list-item-title v-if="contact.email">{{contact.email}}</v-list-item-title>
                    <v-list-item-title v-else><v-icon>mdi-minus</v-icon></v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-divider inset></v-divider>

            <v-list-item>
                <v-list-item-action>
                    <v-icon>mdi-map-marker</v-icon>
                </v-list-item-action>

                <v-list-item-content>
                    <v-list-item-title v-if="contact.country">{{contact.country}}</v-list-item-title>
                    <v-list-item-title v-else><v-icon>mdi-minus</v-icon></v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item>
                <v-list-item-action>
                    <v-icon>mdi-account-group</v-icon>
                </v-list-item-action>

                <v-list-item-content>
                    <v-list-item-title v-if="contact.group">{{contact.group}}</v-list-item-title>
                    <v-list-item-title v-else><v-icon>mdi-minus</v-icon></v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item>
                <v-list-item-action>
                    <v-icon>mdi-timetable</v-icon>
                </v-list-item-action>

                <v-list-item-content>
                    <v-list-item-title>{{contact.created_at}}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
</div>
</template>
<script>
import gql from 'graphql-tag'
import jwt from 'jsonwebtoken'

// getting id from the accessToken
export function us () {
    var d = ''
    var id = ''
    if (window.localStorage.getItem('accessToken')) {
        d = window.localStorage.getItem('accessToken')
        const decoded = jwt.verify(d, 'your-secret')
        const stt = JSON.stringify(decoded['https://hasura.io/jwt/claims']['x-hasura-user-id'])
        id = stt.substr(1, stt.length-2)
    }
    return id
}

// quering contacts which equals contact id and contact owner/user id
const st = gql`
    query a($d: uuid!, $dd: uuid!){
        contacts(where: {id: {_eq: $d}, userId:{_eq: $dd}}){
            id
            first_name
            last_name
            country
            created_at
            email
            pic
            phone
            group
        }
    }
`

export default {
    middleware: 'authenticated',
    name: 'Detail',
    head () {
        return{
            title: 'Detail'
        }
    },
    data () {
        return {
            s: this.$route.params,
            contact: []
        }
    },
    mounted () {
        this.$apollo.query({
            prefetch: true,
            query: st,
            variables: {
                d: this.$route.params.Detail,
                dd: us()
            },
            context: {
                headers: {
                    'Authorization': 'Bearer '+window.localStorage.getItem('accessToken')
                }
            }
        }).then(res => {
            const d = JSON.stringify(res.data.contacts)
            const c = JSON.parse(d.substr(1, d.length-2))
            this.contact = c
        }).catch(er => {
            alert('Contact not found may be deleted.')
            this.$router.replace('/contact')
            console.log(er)
        })
    }
}
</script>