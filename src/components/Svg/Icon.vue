<template>
    <svg :viewBox="'0 0 ' + _size + ' ' + _size" :height="_size" :width="_size">
        <g filter="url(#filter0_d)" :transform="'scale(' + scale + ')'" :fill="color">
            <path fill-rule="evenodd" clip-rule="evenodd" :d="path" />
        </g>
        <defs>
            <filter id="filter0_d" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx=".333" dy=".333" />
                <feGaussianBlur stdDeviation="0.333" />
                <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend in="SourceGraphic" result="shape" />
            </filter>
        </defs>
    </svg>
</template>

<script>
import svgData from './data/iconGlyphs.json';

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
            default: 'currentColor'
        }
    },

    computed: {
        _size() {
            const size = parseInt(this.size);
            return size ? size : 24;
        },

        path() {
            return svgData[this.name];
        },

        scale() {
            return this._size / 24;
        },

        filter() {
            return svgData['filter-shadow-05'];
        }
    }
};
</script>
