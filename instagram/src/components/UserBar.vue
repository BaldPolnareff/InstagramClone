<script setup>
import { defineProps } from 'vue';
import UploadPhotoModal from './UploadPhotoModal.vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '../stores/users';
import { storeToRefs } from 'pinia';
import { supabase } from '../supabase';

const route = useRoute();
const userStore = useUserStore();

const { user } = storeToRefs(userStore);
const { username: profileUsername } = route.params;

const props = defineProps(['user', 'username', 'userinfo', 'addNewPost', 'isFollowing', 'updateIsFollowing'])

const followUser = async () => {
    props.updateIsFollowing(true);
    await supabase.from('followers_following')
        .insert({
            follower_id: user.value.id,
            following_id: props.user.id
        })

}

const unfollowUser = async () => {
    props.updateIsFollowing(false);
    await supabase.from('followers_following')
        .delete()
        .eq('follower_id', user.value.id)
        .eq('following_id', props.user.id)
}


</script>

<template>
    <div class="userbar-container" v-if="props.user">
        <div class="top-content">
            <a-typography-title :level="2">{{ props.user.username }}</a-typography-title>
            <div v-if="user">
                <UploadPhotoModal 
                    v-if="profileUsername===user.username"
                    :addNewPost="addNewPost"
                ></UploadPhotoModal>
                <div v-else>
                    <a-button 
                        v-if="!props.isFollowing"
                        @click="followUser" 
                    >Follow</a-button>
                    <a-button 
                        v-else
                        @click="unfollowUser"
                        type="danger"
                    >Unfollow</a-button>
                </div>
            </div>
        </div>
        <div class="bottom-content">
            <a-typography-title :level="5">{{ props.userinfo.posts }} posts</a-typography-title>
            <a-typography-title :level="5">{{ props.userinfo.followers }} followers</a-typography-title>
            <a-typography-title :level="5">{{ props.userinfo.following }} following</a-typography-title>
        </div>
    </div>
    <div v-else class="userbar-container">
        <a-typography-title :level="2">User not found!</a-typography-title>
    </div>
</template>

<style scoped>

.userbar-container {
    padding-bottom: 75px;
}

.top-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-right: 50px;
}

.bottom-content {
    display: flex;
    align-items: center;
}

.bottom-content h5 {
    margin: 0 !important;
    padding: 0;
    margin-right: 30px !important;
}

.top-content h2{
    margin-bottom: 10px !important;
    padding: 0;
}


</style>