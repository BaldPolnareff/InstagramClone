<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
    router.push('/');
};

</script>

<template>
    <a-result status="404" title="404" sub-title="Sorry, the page you visited does not exist.">
      <template #extra>
        <a-button @click="goHome" type="primary">Back Home</a-button>
      </template>
    </a-result>
  </template>