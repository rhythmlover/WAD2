<template>
    <main>
        <div class="container-fluid">
            <div class="page-header min-height-300 border-radius-xl mt-5"
                style="background-image: url('src/assets/img/curved-images/curved0.jpg'); background-position-y: 50%;">
                <span class="mask bg-gradient-primary opacity-6"></span>
            </div>
            <div class="card card-body blur shadow-blur mx-4 mt-n6 overflow-hidden">
                <div class="row gx-4">
                    <div class="col-auto">
                        <div class="avatar avatar-xl position-relative">
                            <img src="src/assets/img/bruce-mars.jpg" alt="profile_image"
                                class="w-100 border-radius-lg shadow-sm">
                        </div>
                    </div>
                    <div class="col-auto my-auto">
                        <div class="h-100">
                            <h5 class="mb-1">
                                {{ username }}
                            </h5>
                            <p class="mb-0 font-weight-bold text-sm">
                                Investor / Trader
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid py-4">
            <div class="row">
                <div class="col-12 col-xl-6 col-lg-6 d-flex justify-content-lg-end justify-content-center mb-3">
                    <div class="card shadow-lg h-100 w-50">
                        <div class="card-header pb-0 p-3">
                            <h6 class="mb-0">Change Username</h6>
                        </div>
                        <div class="card-body p-3">
                            <ul class="list-group">
                                <li class="list-group-item border-0 px-0 pb-4">
                                    <div class="input-group">
                                        <span class="input-group-text" id="basic-addon1">@</span>
                                        <input type="text" class="form-control" placeholder="Username" aria-label="Username"
                                            aria-describedby="basic-addon1" v-model="changedUsername">
                                    </div>
                                </li>
                                <div class="d-flex justify-content-center">
                                    <button type="button" class="btn bg-gradient-primary w-50"
                                        @click="changeUsername">Change</button>
                                </div>
                                <div class="text-center text-danger" v-if="usernameChangedBool">
                                    <span>{{ username_msg }}</span>
                                </div>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-xl-6 col-lg-6 d-flex justify-content-lg-start justify-content-center mb-3">
                    <div class="card shadow-lg h-100 w-50">
                        <div class="card-header pb-0 p-3">
                            <h6 class="mb-0">Clear Portfolio Data</h6>
                        </div>
                        <div class="card-body p-3">
                            <ul class="list-group">
                                <li class="list-group-item border-0 px-0 pb-4">
                                    <h6 class="text-uppercase text-body text-xs font-weight-bolder">WARNING: This will clear
                                        your portfolio list</h6>
                                </li>
                            </ul>
                            <div class="d-flex justify-content-center pt-3">
                                <button type="button" class="btn bg-gradient-danger text-white w-50"
                                    @click="clearPortfolio">Clear</button>
                            </div>
                            <div class="text-center text-danger" v-if="dataClearedBool">
                                <span>{{ data_msg }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
    getFirestore,
    doc,
    updateDoc,
    getDocs,
    collection
} from 'firebase/firestore'

var changedUsername = ref('')
var uid = ''
var usernameChangedBool = ref(false)
var dataClearedBool = ref(false)
var username = ref('')
var username_msg = ref('')
var data_msg = ref('')

var auth = getAuth();

const db = getFirestore();

onMounted(() => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            uid = user.uid;
            userDetailsInit()
        } else {
            console.log("No user signed in")
        }
    })
})

const userDetailsInit = async () => {
    const userDocRef = collection(db, 'users')
    const querySnapshot = await getDocs(userDocRef);
    try {
        querySnapshot.forEach((doc) => {
            if (doc.data().uid == uid) {
                username.value = doc.data().username
            }
        });
    } catch (e) {
        console.log(e)
    }
}

const changeUsername = async () => {
    if (changedUsername.value == '') {
        username_msg.value = 'Username cannot be empty!'
        usernameChangedBool.value = true
        return
    }
    const userDocRef = doc(db, 'users', uid)
    await updateDoc(userDocRef, {
        username: changedUsername.value
    })
    changeUsername.value = ''
    username_msg.value = 'Username changed! Please refresh the page.'
    usernameChangedBool.value = true
}

const clearPortfolio = async () => {
    try {
        const userDocRef = doc(db, 'users', uid)
        await updateDoc(userDocRef, {
            data: []
        })
        data_msg.value = 'Data cleared!'
        dataClearedBool.value = true
    } catch (e) {
        data_msg.value = 'Error clearing data!'
        console.log(e)

    }
}
</script>