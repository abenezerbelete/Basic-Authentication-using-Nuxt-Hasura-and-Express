<template>
    <div>
        <div v-for="contact in contacts" :key="contact.id">
            <Contact :contact="contact" @delete-contact="$emit('delete-contact', contact.id)" />
        </div>
    </div>
</template>
<script>
import Contact from "../contact/Contact";

export default {
    name: 'Contacts',
    components: {
        Contact
    },
    props: {
        contacts: [],
    },
    emits: ['delete-contact'],
}
</script>