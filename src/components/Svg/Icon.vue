<template>
    <svg
        :viewBox="'0 0 ' + calculated_size + ' ' + calculated_size"
        :height="size"
        :width="size"
    >
        <g
            filter="url(#filter0_d)"
            :transform="'scale(' + scale + ')'"
            :fill="calculated_color"
        >
            <path fill-rule="evenodd" clip-rule="evenodd" :d="path" />
        </g>
        <defs>
            <filter
                id="filter0_d"
                color-interpolation-filters="sRGB"
                filterUnits="userSpaceOnUse"
            >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                    in="SourceAlpha"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                />
                <feOffset dx=".333" dy=".333" />
                <feGaussianBlur stdDeviation="0.333" />
                <feColorMatrix
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                />
                <feBlend in="SourceGraphic" result="shape" />
            </filter>
        </defs>
    </svg>
</template>

<script>
import svgData from './data/iconGlyphs.json';
import { isUndefined } from 'util';

export default {
    props: {
        name: {
            type: String,
            required: true
        },
        size: {
            type: [String, Number],
            default: 24
        },
        color: {
            type: String,
            default: 'primary'
        }
    },

    computed: {
        calculated_color() {
            var c = this.$vuetify.theme.dark
                ? this.$vuetify.theme.themes.dark[this.color]
                : this.$vuetify.theme.themes.light[this.color];

            return isUndefined(c) ? this.color : c;
        },

        calculated_size() {
            const size = parseInt(this.size);
            return size ? size : 24;
        },

        path() {
            return svgData[this.name];
        },

        scale() {
            return this.calculated_size / 24;
        },

        filter() {
            return svgData['filter-shadow-05'];
        }
    }
};
</script>
