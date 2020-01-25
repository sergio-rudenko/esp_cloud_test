<template>
    <v-layout class="ma-4">
        <v-btn @click="reload()" color="warning" block>Reload source</v-btn>
    </v-layout>
</template>

<script>
export default {
    methods: {
        reload() {
            this.$router.push({ name: 'home', params: { userId: '123' } });
            window.location.reload();
        }
    },

    data: () => ({
        counter: 0
    })
};
</script>