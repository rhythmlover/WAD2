<template>
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet" />
  <link id="pagestyle" href="src/assets/css/soft-ui-dashboard.css?v=1.0.7" rel="stylesheet" />
  <link href="src/assets/css/nucleo-icons.css" rel="stylesheet" />
  <link href="src/assets/css/nucleo-svg.css" rel="stylesheet" />

  <nav
    class="navbar navbar-expand-lg blur blur-rounded top-0 z-index-3 shadow position-absolute my-3 py-2 start-0 end-0 mx-10">
    <div class="container-fluid pe-0">
      <a class="navbar-brand font-weight-bolder ms-lg-0 ms-3">
        <span v-if="isLoggedIn">{{ username }}</span>
        <span v-if="!isLoggedIn">Portfolio Management</span>
      </a>
      <button class="navbar-toggler shadow-none ms-2" type="button" data-bs-toggle="collapse" data-bs-target="#navigation"
        aria-controls="navigation" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon mt-2">
          <span class="navbar-toggler-bar bar1"></span>
          <span class="navbar-toggler-bar bar2"></span>
          <span class="navbar-toggler-bar bar3"></span>
        </span>
      </button>
      <div class="collapse navbar-collapse" id="navigation">
        <ul class="navbar-nav mx-auto ms-xl-auto">
          <li class="nav-item">
            <a class="nav-link d-flex align-items-center me-2">
              <i class="fa fa-chart-pie opacity-6 text-dark me-1"></i>
              <RouterLink to="/">Portfolio</RouterLink>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link me-2">
              <i class="fas fa-poll opacity-6 text-dark me-1"></i>
              <RouterLink to="/markets">Markets</RouterLink>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link me-2">
              <i class="fas fa-search opacity-6 text-dark me-1"></i>
              <RouterLink to="/stockList">Search</RouterLink>
            </a>
          </li>
        </ul>
        <ul class="navbar-nav d-lg-block d-none">
          <li class="nav-item">
            <a class="btn btn-sm btn-round mb-0 me-1 bg-gradient-dark" @click="handleLogIn" v-if="!isLoggedIn">Sign In</a>
          </li>
          <li class="nav-item">
            <a class="btn btn-sm btn-round mb-0 me-1 bg-gradient-dark" @click="handleLogOut" v-if="isLoggedIn">Sign Out</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <RouterView />
</template>
``
<style scoped>
li {
  padding-left: 10px;
  padding-right: 10px;
}

li a {
  text-decoration: none;
  color: black;
}

.router-link-active {
  text-decoration: underline;
}
</style>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { onMounted, ref } from 'vue'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import {
  getFirestore,
  collection,
  getDocs,
} from 'firebase/firestore'

const isLoggedIn = ref(true)
const router = useRouter()
var username = ref('')
var uid = ''

var auth = getAuth();

const db = getFirestore();
const userRef = collection(db, 'users');

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      uid = user.uid;
      userDetailsInit() 
      isLoggedIn.value = true
    } else {
      isLoggedIn.value = false
    }
  })
})

const userDetailsInit = async () => {
  const querySnapshot = await getDocs(userRef);
  querySnapshot.forEach((doc) => {
    if (doc.data().uid == uid) {
      username.value = doc.data().username
    }
  });
}

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
