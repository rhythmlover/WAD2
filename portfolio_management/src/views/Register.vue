<template>
  <main class="main-content mt-0">
    <!-- min-vh-100 to scroll -->
    <section>
      <div
        class="page-header align-items-start min-vh-50 pt-5 pb-11 m-3 border-radius-lg"
        style="background-image: url('src/assets/img/curved-images/curved14.jpg')"
      >
        <span class="mask bg-gradient-dark opacity-6"></span>
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-lg-5 text-center mx-auto">
              <h1 class="text-white mb-2 mt-5">Welcome!</h1>
              <p class="text-lead text-white">
                You are one step closer to a better stock portfolio!
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="row mt-lg-n10 mt-md-n11 mt-n10">
          <div class="col-xl-4 col-lg-5 col-md-7 mx-auto">
            <div class="card z-index-0">
              <div class="card-header text-center pt-4">
                <h5>Registration</h5>
              </div>
              <div class="card-body">
                <form role="form text-left">
                  <div class="mb-3">
                    <input type="text" class="form-control" placeholder="Name" v-model="username" />
                  </div>
                  <div class="mb-3">
                    <input type="email" class="form-control" placeholder="Email" v-model="email" />
                  </div>
                  <div class="mb-3">
                    <input
                      type="password"
                      class="form-control"
                      placeholder="Password"
                      v-model="password"
                    />
                  </div>
                  <div class="text-center">
                    <button
                      type="button"
                      class="btn bg-gradient-dark w-100 my-4 mb-2"
                      @click="register"
                    >
                      Sign up
                    </button>
                  </div>
                  <div class="text-center">
                    <span class="text-danger">{{ errorMessage }}</span>
                  </div>
                  <p class="text-sm mt-3 mb-0">
                    Already have an account?
                    <router-link to="/login" class="text-dark font-weight-bolder"
                      >Sign In</router-link
                    >
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { getFirestore, doc, setDoc } from 'firebase/firestore'

const username = ref('')
const email = ref('')
const password = ref('')
const router = useRouter()
var errorMessage = ref('')

const db = getFirestore()
// const usersCollection = collection(db, 'users')

const register = () => {
  createUserWithEmailAndPassword(getAuth(), email.value, password.value)
    .then((userCredential) => {
      const userUID = userCredential.user.uid
      const userDocRef = doc(db, 'users', userUID)
      setDoc(userDocRef, {
        username: username.value,
        email: email.value,
        uid: userUID,
        data: [],
    })
      router.push('/login')
    })
    .catch((error) => {
      const errorCode = error.code
      if (errorCode === 'auth/email-already-in-use') {
        errorMessage.value = 'Email already in use.'
      } else if (errorCode === 'auth/invalid-email') {
        errorMessage.value = 'Invalid email address format.'
      } else if (errorCode === 'auth/weak-password') {
        errorMessage.value = 'Password must be at least 6 characters long.'
      }
      console.log(errorCode, errorMessage)
    })
}
</script>
