import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
} from 'firebase/firestore/lite'

const firebaseConfig = {
  apiKey: 'AIzaSyCsBVdTmiEAgxVfJO8mMir8GmO1YnUwC0E',
  authDomain: 'hope-private-school.firebaseapp.com',
  projectId: 'hope-private-school',
  storageBucket: 'hope-private-school.firebasestorage.app',
  messagingSenderId: '235697705051',
  appId: '1:235697705051:web:962fc37e98b750e950ef7e',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export async function getCourses() {
  const coursesCollectionRef = collection(db, 'cours') // Nom exact de la collection
  const snapshot = await getDocs(coursesCollectionRef)

  const courses = snapshot.docs.map((doc) => {
    const data = doc.data()

    return {
      id: doc.id,
      name: data.name,
      description: data.description,
      price: data.price,
      level: data.level,
      imageUrl: data.imageUrl,
    }
  })

  return courses
}

export async function getCourse(id: string) {
  const docRef = doc(db, 'cours', id)
  const snapshot = await getDoc(docRef)

  if (!snapshot.exists()) {
    throw new Error('Cours non trouvé')
  }

  const data = snapshot.data()

  return {
    id: snapshot.id,
    name: data.name,
    description: data.description,
    price: data.price,
    level: data.level,
    imageUrl: data.imageUrl,
  }
}

export async function loginUser(creds: { email: string; password: string }) {
  const res = await fetch('/api/login', {
    method: 'post',
    body: JSON.stringify(creds),
  })
  const data = await res.json()

  if (!res.ok) {
    throw {
      message: data.message,
      statusText: res.statusText,
      status: res.status,
    }
  }

  return data
}
