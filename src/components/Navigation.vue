<template>
    <span>
        <v-app-bar color="primary" dark app>
            <v-btn icon :disabled="icon !== 'MENU'" @click="drawer = !drawer">
                <svg-icon size="40px" color="white" :name="icon" />
            </v-btn>
            <v-toolbar-title>{{ title }}</v-toolbar-title>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" :dark="$vuetify.theme.dark" temporary app>
            <!-- user credentials -->
            <template v-if="menu" v-slot:prepend>
                <v-sheet color="primary" dark tile>
                    <v-list-item>
                        <v-list-item-avatar color="white">
                            <svg-icon name="USER" color="gray" />
                        </v-list-item-avatar>

                        <v-list-item-content>
                            <v-list-item-title v-text="user.name" />
                            <v-list-item-subtitle v-text="user.phone" />
                            <v-list-item-subtitle v-text="user.mail" />
                        </v-list-item-content>
                    </v-list-item>
                    <div class="pa-2">
                        <v-btn block rounded text to="/login">{{ logoutTitle }}</v-btn>
                    </div>
                </v-sheet>
            </template>

            <!-- application menu -->
            <v-list shaped dense flat>
                <template v-for="(item, i) in menu">
                    <v-subheader v-if="item.heading" :key="i">{{ item.heading }}</v-subheader>

                    <v-divider v-else-if="item.divider" :key="i" class="my-2" />

                    <v-list-item v-else link :disabled="item.disabled" :to="item.path" :key="i">
                        <v-list-item-action>
                            <svg-icon :name="item.icon" />
                        </v-list-item-action>

                        <v-list-item-content>
                            <v-list-item-title>{{ item.title }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </template>
            </v-list>

            <!-- dark mode switch -->
            <template v-slot:append>
                <v-list shaped dense flat>
                    <v-list-item dense rounded @click="$vuetify.theme.dark = !$vuetify.theme.dark">
                        <v-list-item-action>
                            <svg-icon name="NIGHT" size="24px" />
                        </v-list-item-action>
                        <v-list-item-title>Night mode</v-list-item-title>
                        <v-switch v-model="$vuetify.theme.dark" @click.prevent />
                    </v-list-item>
                </v-list>
            </template>
        </v-navigation-drawer>
    </span>
</template>

<style scoped></style>

<script>
// import { isUndefined } from 'util';

export default {
    mounted() {
        window.console.log('store: ', this.$store);
    },

    computed: {
        title() {
            return this.$store.state.application.title;
        },

        icon() {
            return this.$store.state.application.icon;
        },

        menu() {
            return this.$store.state.application.menu;
        },

        user() {
            return this.$store.state.credentials.user;
        }

        // iconColor() {
        //     var c = this.$vuetify.theme.dark
        //         ? this.$vuetify.theme.themes.dark['secondary']
        //         : this.$vuetify.theme.themes.light['primary'];

        //     return isUndefined(c) ? 'black' : c;
        // }
    },

    // props: {
    //     title: {
    //         type: String,
    //         default: 'ESP::Cloud'
    //     }
    // },

    data() {
        return {
            drawer: false,

            logoutTitle: 'Выход из системы'
        };
    }
};
</script>
