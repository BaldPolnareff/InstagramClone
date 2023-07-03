<script setup>
import Card from './Card.vue';
import Observer from './Observer.vue';
import { supabase } from '../supabase';
import { useUserStore } from '../stores/users';
import { storeToRefs } from 'pinia';
import { ref, onMounted } from 'vue';

const userStore = useUserStore();

const { user } = storeToRefs(userStore);

const posts = ref([]);
const lastCardIndex = ref(2);
const ownerIds = ref([]);
const reachEnd = ref(false);
// dummy data
// const data = [
    // {
        // id: 1,
        // username: 'johncena',
        // url: 'https://static.tvtropes.org/pmwiki/pub/images/06_cena_09142009rf_031_8a1d8885e9ee285288d46da8ae7e86ae.jpg',
        // caption: 'I love Lao Gan Ma'
    // }, 
    // {
        // id: 2,
        // username: 'laoganma',
        // url: 'https://cdn.shopify.com/s/files/1/0398/9307/4080/products/2222_5d96d8b3-7433-46e5-a0aa-56edb303be05_800x.jpg?v=1600787591',
        // caption: 'I love John Cena'
    // }
// ]

const fetchData = async () => {
    // fetch data from supabase
    const { data: followings} = await supabase
        .from('followers_following')
        .select('following_id')
        .eq('follower_id', user.value.id);

    ownerIds.value = followings.map(following => following.following_id);

    const { data } = await supabase
        .from('posts')
        .select()
        .in('owner_id', ownerIds.value)
        .range(0, lastCardIndex.value)
        .order('created_at', { ascending: false });

    posts.value = data;
    
}

const fetchNextSet = async () => {
    if (!reachEnd.value) {
        const { data } = await supabase
            .from('posts')
            .select()
            .in('owner_id', ownerIds.value)
            .range(lastCardIndex.value + 1, lastCardIndex.value + 3)
            .order('created_at', { ascending: false });

        // Weird syntax that pushes the new data into the posts array (the push method can only push one item at a time)
        posts.value = [
            ...posts.value,
            ...data
        ]
        
        console.log(data);
        lastCardIndex.value += 3;

        if (!data.length) {
            reachEnd.value = true;
        } 
    }
}

onMounted(() => {
    fetchData();
})

</script>

<template>
    <div class="timeline-container">
        <Card 
            v-for="post in posts" 
            :key="post.id" 
            :post="post"
        ></Card>
        <Observer v-if="posts.length" @intersect="fetchNextSet"/>
    </div>
</template>