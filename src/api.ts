import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  query,
  orderBy,
  limit,
} from 'firebase/firestore/lite'
import { Testimonial } from './pages/About'

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

export async function getTestimonials(): Promise<Testimonial[]> {
  const testimonialsCollectionRef = collection(db, 'temoignages')
  
  // Créer une requête qui trie par date (décroissant) et limite à 3 résultats
  const q = query(
    testimonialsCollectionRef,
    orderBy('date', 'desc'), // Tri par date décroissante (plus récent d'abord)
    limit(3) // Limite à 3 témoignages
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      name: data.name || 'Nom inconnu',
      message: data.message || 'Aucun message fourni.',
      date: data.date || new Date().toISOString(),
    }
  })
}

export async function addTestimonial(testimonialData: Omit<Testimonial, 'id'>): Promise<string> {
  try {
    const testimonialsCollectionRef = collection(db, 'temoignages')
    const docRef = await addDoc(testimonialsCollectionRef, testimonialData)
    return docRef.id
  } catch (error: unknown) {
    // Gestion appropriée du type unknown
    console.error("Erreur lors de l'ajout du témoignage:", error)
    
    // Convertir l'erreur en type Error pour avoir accès à la propriété message
    if (error instanceof Error) {
      throw error;
    } else {
      // Si ce n'est pas une instance d'Error, créer une nouvelle erreur
      throw new Error("Une erreur inconnue s'est produite lors de l'ajout du témoignage");
    }
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
