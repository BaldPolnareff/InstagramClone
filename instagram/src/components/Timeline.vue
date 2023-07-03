<script setup>
import Cards from './Cards.vue';
import LogInMessage from './LogInMessage.vue';
import Container from './Container.vue';
import { ref } from 'vue';
import { useUserStore } from '../stores/users';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();

const { user, loadingUser } = storeToRefs(userStore);

</script>

<template>
    <Container>
        <div v-if="!loadingUser">
            <Cards v-if="user" />
            <LogInMessage v-else />
        </div>
        <div v-else>
            <a-spin class="timeline-spinner"></a-spin>
        </div>
    </Container>
</template>

<style>
.timeline-container {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    align-items: center;
    padding: 20px 0;
}

.timeline-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
</style>