<template>
  <h1>Create an Account</h1>
  <p><input type="text" placeholder="username" v-model="username" /></p>
  <p><input type="text" placeholder="email" v-model="email" /></p>
  <p><input type="password" placeholder="password" v-model="password" /></p>
  <p><button @click="register">Register</button></p>
  <p><router-link to="/login">Already have an account?</router-link></p>
</template>

<script setup>
import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'

const username = ref('')
const email = ref('')
const password = ref('')
const router = useRouter()

const register = () => {
  createUserWithEmailAndPassword(getAuth(), email.value, password.value)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user
      console.log(user)
      router.push('/login')
      // ...
    })
    .catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message
      console.log(errorCode, errorMessage)
      // ..
    })
}
</script>
