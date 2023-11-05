<template>
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet" />
  <link id="pagestyle" href="src/assets/css/soft-ui-dashboard.css?v=1.0.7" rel="stylesheet" />
  <link href="src/assets/css/nucleo-icons.css" rel="stylesheet" />
  <link href="src/assets/css/nucleo-svg.css" rel="stylesheet" />
  <div class="container-fluid position-sticky z-index-sticky top-0">
    <div class="row">
      <div class="col-12">
        <nav
          class="navbar navbar-expand-lg blur blur-rounded top-0 z-index-3 shadow position-absolute my-3 py-2 start-0 end-0 mx-4">
          <div class="container-fluid">
            <a class="navbar-brand font-weight-bolder ms-lg-0 ms-3">
              <span>Portfolio Management</span>
            </a>
            <button class="navbar-toggler shadow-none ms-2" type="button" data-bs-toggle="collapse"
              data-bs-target="#navigation" aria-controls="navigation" aria-expanded="false"
              aria-label="Toggle navigation">
              <span class="navbar-toggler-icon mt-2">
                <span class="navbar-toggler-bar bar1"></span>
                <span class="navbar-toggler-bar bar2"></span>
                <span class="navbar-toggler-bar bar3"></span>
              </span>
            </button>
            <div class="collapse navbar-collapse" id="navigation">
              <ul class="navbar-nav mx-lg-auto ms-xl-auto">
                <li class="nav-item">
                  <a class="nav-link me-2">
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
                <li class="nav-item">
                  <a class="nav-link font-weight-bold" style="cursor: pointer;" @click="handleLogIn" v-if="!isLoggedIn">
                    <i class="fa fa-user me-sm-1"></i>
                    Sign In
                  </a>
                </li>
                <li class="nav-item dropdown" v-if="isLoggedIn">
                  <a class="nav-link me-2" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fa fa-cog fixed-plugin-button-nav cursor-pointer"></i>
                  </a>
                  <ul class="dropdown-menu dropdown-menu-end px-2 py-3 me-sm-n4" aria-labelledby="dropdownMenuButton">
                    <li class="mb-2">
                      <span class="text-truncate">Welcome! {{ username }}</span>
                    </li>
                    <li class="mb-2">
                      <a class="dropdown-item border-radius-md">
                        <div class="d-flex">
                          <div class="my-auto me-2">
                            <i class="fa fa-user me-sm-1 me-3"></i>
                          </div>
                          <div class="d-flex flex-column justify-content-center">
                            <RouterLink to="/profile">
                              <h6 class="text-sm font-weight-normal my-auto">
                                <span class="font-weight-bold">Profile</span>
                              </h6>
                            </RouterLink>
                          </div>
                        </div>
                      </a>
                    </li>
                    <li class="">
                      <a class="dropdown-item border-radius-md" @click="handleLogOut">
                        <div class="d-flex">
                          <div class="my-auto me-2">
                            <i class="fas fa-sign-out-alt me-sm-1 me-3"></i>
                          </div>
                          <div class="d-flex flex-column justify-content-center">
                            <h6 class="text-sm font-weight-normal my-auto">
                              <span class="font-weight-bold">Sign Out</span>
                            </h6>
                          </div>
                        </div>
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <RouterView />
      </div>
    </div>
  </div>
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

.hide-at-small-screen {
  display: block;
}

@media (max-width: 490px) {
  .hide-at-small-screen {
    display: none;
  }
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
