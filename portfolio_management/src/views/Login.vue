<template>
  <main class="main-content mt-0">
    <section>
      <div class="page-header">
        <div class="container">
          <div class="row">
            <div class="col-xl-4 col-lg-5 col-md-6 d-flex flex-column ms-8 mt-6">
              <div class="card card-plain mt-8">
                <div class="card-header pb-0 text-left bg-transparent">
                  <h3 class="font-weight-bolder text-dark text-gradient">Welcome back</h3>
                  <p class="mb-0">Enter your email and password to sign in</p>
                </div>
                <div class="card-body">
                  <form role="form">
                    <label>Email</label>
                    <div class="mb-3">
                      <input
                        type="email"
                        class="form-control"
                        placeholder="Email"
                        v-model="email"
                      />
                    </div>
                    <label>Password</label>
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
                        class="btn bg-gradient-dark w-100 mt-4 mb-0"
                        @click="login"
                      >
                        Sign in
                      </button>
                    </div>
                    <div class="text-center mt-4">
                      <span class="text-danger">{{ errMsg }}</span>
                    </div>
                  </form>
                </div>
                <div class="card-footer text-center pt-0 px-lg-2 px-1">
                  <p class="mb-8 text-sm mx-auto">
                    Don't have an account?
                    <router-link to="/register" class="text-dark text-gradient font-weight-bold"
                      >Sign up</router-link
                    >
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6">
              <div class="oblique position-absolute top-0 h-100 d-md-block d-none me-n8">
                <div
                  class="oblique-image bg-cover position-absolute fixed-top ms-auto h-100 z-index-0 ms-n8"
                  style="background-image: url('src/assets/img/curved-images/curved-6.jpg')"
                ></div>
              </div>
            </div>
    </section>
  </main>
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
      // const user = userCredential.user
      // console.log(user)
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
