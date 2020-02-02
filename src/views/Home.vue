<template>
    <v-container>
        <v-layout text-center wrap class="ma-2">
            <v-flex xs12>
                <v-img :src="require('../assets/logo.svg')" height="256" contain></v-img>
            </v-flex>
        </v-layout>
        <v-layout text-center wrap class="ma-8">
            <v-flex>
                <v-progress-circular
                    :indeterminate="isWsConnected !== true"
                    color="primary"
                    size="128"
                >{{ isWsConnected !== true ? 'connect...' : 'connected' }}</v-progress-circular>
            </v-flex>
        </v-layout>
        <v-layout text-center wrap class="ma-8">
            <!-- <v-flex>{{ title }}</v-flex> -->
        </v-layout>
    </v-container>
</template>

<script>
// import {F mapGetters } from 'vuex';

export default {
    name: 'home',
    components: {},

    beforeMount() {
        this.$store.commit('setMenuIcon', 'wifi-strength-off');  
    },
   
    computed: {
        isWsConnected() {
            return this.$store.getters.isWsConnected;
        }
    },

    data: () => ({

    })
};
</script>
