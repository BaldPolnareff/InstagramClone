import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '../supabase'

export const useUserStore = defineStore('users', () => {
  const user = ref(null);
  const errorMessage = ref("");
  const loading = ref(false);
  const loadingUser = ref(true);

  function validateEmail(email) {
    const regex = /^[a-zA-Z0-9.!#$%&`*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return regex.test(email);
  }
  

  const handleLogin = async (credentials) => {
    const { email, password } = credentials;
    if (!validateEmail(email)) {
      return errorMessage.value = "Email is invalid";
    }

    if (password.length == 0) {
      return errorMessage.value = "Password field is empty!";
    }

    loading.value = true;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      loading.value = false;
      return errorMessage.value = error.message;
    }

    const { data: existingUser } = await supabase.from('users').select().eq('email', email).single()

    user.value = {
      email: existingUser.email,
      username: existingUser.username,
      id: existingUser.id
    }

    loading.value = false;
    errorMessage.value = ""
  }


  const handleLogout = async () => {
    loading.value = true;
    await supabase.auth.signOut();
  }
  const handleSignup = async (credentials) => {
    const { email, password, username } = credentials;
    if (password.length < 8) {
      return errorMessage.value = "Password must be at least 8 characters long";
    }

    if (username.length < 4) {
      return errorMessage.value = "Username must be at least 4 characters long";
    }

    if (!validateEmail(email)) {
      return errorMessage.value = "Email is invalid";
    }

    loading.value = true;

    const { data: userWithUsername} = await supabase.from('users').select().eq('username', username).single()

    if (userWithUsername) {
      loading.value = false;
      return errorMessage.value = "Username is taken";
    }

    errorMessage.value = "";


    const { error } = await supabase.auth.signUp({ 
      email, 
      password 
    })

    if (error) {
      loading.value = false;
      return errorMessage.value = error.message;
    }

    await supabase.from('users').insert({
      username, 
      email
    })

    const { data: newUser } = await supabase.from('users').select().eq('email', email).single()
    user.value = {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username
    }

    loading.value = false;
  }

  const getUser = async () => {
    // loadingUser.value = false;
    const { data } = await supabase.auth.getUser()

    console.log(data)

    if (!data.user) {
      loadingUser.value = false; 
      return user.value = null;
    }
    
    const {data:userWithEmail} = await supabase
    .from('users')
    .select()
    .eq('email', data.user.email).single()

    user.value = {
      id: userWithEmail.id,
      email: userWithEmail.email,
      username: userWithEmail.username
    }
    // const {data:userWithEmail} = await supabase
      // .from('users')
      // .select()
      // .eq('email', data.user.email).single()

    // user.value = {
      // id: userWithEmail.id,
      // email: userWithEmail.email,
      // username: userWithEmail.username
    // }


   loadingUser.value = false;
  }

  const clearErrorMessage = () => {
    errorMessage.value = "";
  }


  return { 
    user, 
    errorMessage, 
    loading,
    loadingUser,
    handleLogin, 
    handleLogout, 
    handleSignup, 
    getUser, 
    clearErrorMessage 
  }
})
