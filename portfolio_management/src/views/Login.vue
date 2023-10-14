<template>
  <h1>Login</h1>
  <p><input type="text" placeholder="email" v-model="email" /></p>
  <p><input type="password" placeholder="password" v-model="password" /></p>
  <p v-if="errMsg">{{ errMsg }}</p>
  <p><button @click="login">Login</button></p>
  <p><router-link to="/register">Create an Account</router-link></p>
</template>

<script setup>
import { ref } from 'vue'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const errMsg = ref('')
const router = useRouter()

const login = () => {
  signInWithEmailAndPassword(getAuth(), email.value, password.value)
    .then((userCredential) => {
      const user = userCredential.user
      console.log(user)
      router.push('/')
    })
    .catch((error) => {
      console.log(error.code, error.message)
      switch (error.code) {
        case 'auth/invalid-email':
          errMsg.value = 'Invalid email address format.'
          break
        case 'auth/user-disabled':
          errMsg.value = 'User with this email has been disabled.'
          break
        case 'auth/user-not-found':
          errMsg.value = 'User with this email does not exist.'
          break
        case 'auth/wrong-password':
          errMsg.value = 'Incorrect password.'
          break
        default:
          errMsg.value = 'An error occurred.'
          break
      }
    })
}
</script>
