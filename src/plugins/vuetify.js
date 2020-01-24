import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: '#01488a',
                secondary: '#565656',
                accent: '#82B1FF',
                error: '#EB5757',
                info: '#4CAF50',
                success: '#01488a',
                warning: '#FFC107',
            },
            dark: {
                primary: '#82B1FF',
                secondary: '#A6A6A6',
                accent: '#82B1FF',
                error: '#EB5757',
                info: '#4CAF50',
                success: '#01488a',
                warning: '#FFC107',
            },

        },
    }
});

