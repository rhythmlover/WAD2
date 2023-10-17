import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: 'AIzaSyCcCAfI1Z7IjqcDn3OAH08gp1wUjYnxtSU',
  authDomain: 'wad2-6c47d.firebaseapp.com',
  projectId: 'wad2-6c47d',
  storageBucket: 'wad2-6c47d.appspot.com',
  messagingSenderId: '135258660698',
  appId: '1:135258660698:web:de8552be48855a29621d63',
  measurementId: 'G-P2WY9RPN04'
};

initializeApp(firebaseConfig);

const app = createApp(App);

app.use(router);

app.mount('#app');
