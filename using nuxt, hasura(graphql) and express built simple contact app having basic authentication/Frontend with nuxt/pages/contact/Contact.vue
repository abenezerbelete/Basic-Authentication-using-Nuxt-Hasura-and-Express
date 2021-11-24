<template>
<div max-width="1000" max-height="300">
    <p></p>
        <v-card-title class="cyan darken-1">
        <img src="~/static/user.png" class="img-circle" width="40" height="40">&nbsp;&nbsp;
        <span class="text-h5 white--text">{{contact.first_name}} {{contact.last_name}}</span>
        <v-spacer></v-spacer>
        <v-btn
            dark
            icon
            @click="goto(contact.id)"
            >
            <v-icon>mdi-details</v-icon>
        </v-btn>
        <v-btn
            dark
            icon
            @click="onDelete(contact.id)"
            >
            <v-icon>mdi-delete</v-icon>
        </v-btn>
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
        </v-list>
</div>
</template>
<script>
export default {
    name: 'Contact',
    props: { 
        contact: []
    },
    methods: {
        onDelete(id) {
            this.$emit('delete-contact', id)
        },
        goto(id){
            this.$router.push('/contact/'+id+'/')
        }
    }
}
</script>
<style scoped>
.img-circle {
    border-radius: 50%;
}
</style>
