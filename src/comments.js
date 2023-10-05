import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    onSnapshot,
    orderBy,
    serverTimestamp,
    query,
} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyCcCAfI1Z7IjqcDn3OAH08gp1wUjYnxtSU",
    authDomain: "wad2-6c47d.firebaseapp.com",
    projectId: "wad2-6c47d",
    storageBucket: "wad2-6c47d.appspot.com",
    messagingSenderId: "135258660698",
    appId: "1:135258660698:web:de8552be48855a29621d63",
    measurementId: "G-P2WY9RPN04"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const nameInput = document.getElementById("name-box");
const commentInput = document.getElementById("comment-box");
const commentsSection = document.getElementById("comments-section");
const commRef = collection(db, "stock-comments");

const q = query(commRef, orderBy("createdAt", "desc"));

document.getElementById("post").addEventListener("click", (e) => {
    e.preventDefault();

    let name = nameInput.value;
    let comment = commentInput.value;

    if (name.trim() === "" || comment.trim() === "") {
        alert("Name and comment cannot be empty");
        return;
    }

    addDoc(commRef, {
        name: name,
        comment: comment,
        createdAt: serverTimestamp()
    })
        .then(() => {
            nameInput.value = "";
            commentInput.value = "";
        })
        .catch((error) => {
            console.error("Error adding comment: ", error);
        });
});

// Function to display comments
function displayComments() {
    getDocs(q)
        .then((querySnapshot) => {
            commentsSection.innerHTML = "";
            querySnapshot.forEach((doc) => {
                let commentData = doc.data();
                let card = document.createElement('div');
                let card_body = document.createElement('div');
                let comment_name = document.createElement('h5');
                let comment_text = document.createElement('p');
                card.setAttribute('class', 'card m-3');
                card_body.setAttribute('class', 'card-body');
                comment_name.setAttribute('class', 'card-title');
                comment_text.setAttribute('class', 'card-text');
                comment_text.textContent = commentData.comment;
                comment_name.textContent = commentData.name;
                card_body.appendChild(comment_name);
                card_body.appendChild(comment_text);
                card.appendChild(card_body);
                commentsSection.appendChild(card);
            });
        })
        .catch((error) => {
            console.error("Error getting comments: ", error);
        });
}

// Real-time listener
onSnapshot(q, () => {
    displayComments();
});
