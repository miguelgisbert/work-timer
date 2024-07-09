import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBZr3W2feV81BW7r7KZHwe0qGDYkkZoBzc",
  authDomain: "mg-work-timer.firebaseapp.com",
  projectId: "mg-work-timer",
  storageBucket: "mg-work-timer.appspot.com",
  messagingSenderId: "571792365902",
  appId: "1:571792365902:web:927c302f9b5c85a028e61f",
  measurementId: "G-85XYQY3R7R"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

console.log("app", app)
console.log("auth", getAuth(app))
console.log("db", getFirestore(app))

export const auth = getAuth(app)
export const db = getFirestore(app)