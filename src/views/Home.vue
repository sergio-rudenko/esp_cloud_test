<template>
    <v-container>
        <v-layout text-center wrap>
            <v-flex xs12>
                <v-img :src="require('../assets/logo.svg')" class="my-3" contain height="200"></v-img>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
// @ is an alias to /src

export default {
    name: 'home',
    components: {},

    beforeMount() {
        // window.console.log('Home:: cred: ', this.$store.state.credentials);
        if (this.$store.state.credentials.wifi.ssid === undefined) {
            this.$router.push({path: '/setup/wifi'});
        }
    }
};
</script>
