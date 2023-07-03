<script setup>
import { defineProps } from 'vue';

const props = defineProps(['posts'])
const {VITE_BASE_PHOTO_URL} = import.meta.env;

</script>

<template>

    <div class="image-gallery-container">
        <img
            v-for="post in props.posts"
            :key="post.id" 
            :src="`${VITE_BASE_PHOTO_URL}${post.url}`" 
        >
    </div>

</template>

<style scoped>

template {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    align-items: center;
    padding: 20px 0;
}
.image-gallery-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: left;
    margin-top: 20px;
    align-items: center;
    padding: 20px 0;
}

img {
    width: 200px;
    margin: 10px;
}

</style>