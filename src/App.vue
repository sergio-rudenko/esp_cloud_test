<template>
    <v-app>
        <app-navigation />

        <!-- Sizes your content based upon application components -->
        <v-content>
            <router-view></router-view>
        </v-content>
        <!-- <v-footer app> </v-footer> -->
    </v-app>
</template>

<script>
import AppNavigation from './components/Navigation';

export default {
    name: 'App',

    components: {
        AppNavigation
    },

    mounted() {},

    computed: {},
    data: () => ({})
};
</script>
