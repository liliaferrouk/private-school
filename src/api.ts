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
  updateDoc,
  setDoc,
  where,
} from 'firebase/firestore/lite'
import { Testimonial } from './pages/About'

import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from 'firebase/auth'
import { Etudiant } from './pages/Login'

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

export async function loginStudent(email: string, password: string): Promise<Etudiant> {
  const q = query(collection(db, 'etudiants'), where('email', '==', email))
  const querySnapshot = await getDocs(q)

  if (querySnapshot.empty) {
    throw new Error("Aucun étudiant avec cet email.")
  }

  const docSnap = querySnapshot.docs[0]
  const data = docSnap.data() as Etudiant

  if (data.mdp !== password) {
    throw new Error("Mot de passe incorrect.")
  }

  // Mettre à jour la date de dernière connexion
  await updateDoc(doc(db, 'etudiants', docSnap.id), {
    derniereConnexion: new Date().toISOString()
  })

  return { id: docSnap.id, ...data }
}

export async function registerStudent(email: string, password: string, name: string, niveau?: string): Promise<Etudiant> {
  try {
    const q = query(collection(db, 'etudiants'), where('email', '==', email))
    const existing = await getDocs(q)

    if (!existing.empty) {
      throw new Error("Un compte avec cet email existe déjà.")
    }

    const newId = `${Date.now()}` // ou utilise nanoid / uuid
    const etudiant: Etudiant = {
      email,
      name,
      niveau: niveau || '',
      mdp: password,
      dateInscription: new Date().toISOString(),
      derniereConnexion: new Date().toISOString()
    }

    await setDoc(doc(db, 'etudiants', newId), etudiant)

    return { id: newId, ...etudiant }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error
    } else {
      throw new Error("Erreur lors de l'inscription")
    }
  }
}

export async function logoutStudent(): Promise<void> {
  try {
    localStorage.removeItem('etudiant')
  } catch (error: unknown) {
    throw new Error("Erreur lors de la déconnexion")
  }
}

export async function getStudentInfo(userId: string): Promise<Etudiant | null> {
  try {
    const docRef = doc(db, 'etudiants', userId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Etudiant
    } else {
      return null
    }
  } catch (error: unknown) {
    console.error("Erreur lors de la récupération des informations de l'étudiant:", error)
    return null
  }
}