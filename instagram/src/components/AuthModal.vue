<script setup>
import { ref, defineProps, reactive } from 'vue';
import { useUserStore } from '../stores/users';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();

const { errorMessage, loading, user } = storeToRefs(userStore);


const props = defineProps(['isLogin'])
const visible = ref(false);

const UserCredentials = reactive({
  username: '',
  email: '',
  password: '',
});

const clearCredentials = () => {
  UserCredentials.email = '';
  UserCredentials.password = '';
  UserCredentials.username = '';
};

const showModal = () => {
  visible.value = true;
  userStore.getUser();
};
const handleOk = async () => {
  if (props.isLogin) {
    await userStore.handleLogin({
      email: UserCredentials.email,
      password: UserCredentials.password
    })
  }
  else {
    await userStore.handleSignup(UserCredentials);
  }

  if (user.value) {
    visible.value = false;
    clearCredentials();
  }
};
const handleCancel = () => {
    userStore.clearErrorMessage();
    visible.value = false;
    clearCredentials();
};

const title = props.isLogin ? 'Login' : 'Sign Up';
    
</script>

<template>
    <div>
      <a-button type="primary" @click="showModal" class="btn">{{ title }}</a-button>
      <a-modal v-model:visible="visible" :title="title" @ok="handleOk">
        <template #footer>
            <a-button key="back" @click="handleCancel">Cancel</a-button>
            <a-button :disabled="loading" key="submit" type="primary" :loading="loading" @click="handleOk">Submit</a-button>
        </template>
        <div v-if="!loading" class="input-container">
            <a-input class="input" v-if="!isLogin" v-model:value="UserCredentials.username" placeholder="Username" />
            <a-input class="input" v-model:value="UserCredentials.email" placeholder="Email" />
            <a-input class="input" v-model:value="UserCredentials.password" placeholder="Password" type="password" />
        </div>
        <div v-else class="spinner">
            <a-spin size="large"/>
        </div>
        <ATypographyText type="danger" v-if="errorMessage">{{ errorMessage }}</ATypographyText>
      </a-modal>
    </div>
  </template>

    

<style scoped>

.btn {
    margin-right: 10px;
}

.input {
    margin-bottom: 10px;
}

.input-container {
    display: flex;
    flex-direction: column;
    height: 120px;
}

.spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 120px;
}

</style>
