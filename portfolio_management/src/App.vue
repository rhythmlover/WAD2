<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand">Portfolio Management</a>
      <ul class="navbar-nav me-auto mb-2 mb-lg-0 justify-content-end">
        <li class="nav-item">
          <RouterLink to="/">Portfolio</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/markets">Markets</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/stockList">Search</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/stockpage">Stock Page(TEMP)</RouterLink>
        </li>
      </ul>
      <form @submit.prevent class="d-flex" role="log-in">
        <button @click="handleLogIn" v-if="!isLoggedIn">Log In</button>
      </form>
      <form @submit.prevent class="d-flex" role="log-out">
        <button @click="handleLogOut" v-if="isLoggedIn">Log Out</button>
      </form>
    </div>
  </nav>
  <RouterView />
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { onMounted, ref } from 'vue'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'

const isLoggedIn = ref(false)
const router = useRouter()

let auth
onMounted(() => {
  auth = getAuth()
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true
    } else {
      isLoggedIn.value = false
    }
  })
})

const handleLogIn = () => {
  router.push('/login')
}

const handleLogOut = () => {
  signOut(auth)
    .then(() => {
      console.log('Sign-out successful.')
      router.push('/')
    })
    .catch((error) => {
      console.log(error)
    })
}
</script>

<style></style>
