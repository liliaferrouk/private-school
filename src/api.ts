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
import { Etudiant, NotificationItem, Testimonial } from './types'

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

    const newId = `${Date.now()}`
    const currentDate = new Date().toISOString()

    const etudiant: Etudiant = {
      email,
      name,
      niveau: niveau || '',
      mdp: password,
      dateInscription: new Date().toISOString(),
      derniereConnexion: new Date().toISOString(),
      coursId: [],
      notifications: [
        {
          id: `welcome-${newId}`,
          message: `Bienvenue sur notre plateforme, ${name}! Nous sommes ravis de vous compter parmi nos étudiants.`,
          date: currentDate,
          read: false
        }
      ]
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

export async function inscrireEtudiantAuCours(etudiantId: string, coursId: string): Promise<void> {
  try {
    // Référence du document de l'étudiant dans Firestore
    const etudiantRef = doc(db, 'etudiants', etudiantId)
    
    // Récupérer les données actuelles de l'étudiant
    const docSnap = await getDoc(etudiantRef)

    if (!docSnap.exists()) {
      throw new Error("Étudiant non trouvé.")
    }

    const data = docSnap.data()
    const coursInscrits: string[] = data.coursId || []

    // Vérifie si l'étudiant est déjà inscrit au cours
    if (coursInscrits.includes(coursId)) {
      throw new Error("Vous êtes déjà inscrit à ce cours.")
    }

    // Ajoute l'ID du cours à la liste des cours inscrits
    const updatedCours = [...coursInscrits, coursId]

    // Mise à jour de l'étudiant avec le nouveau tableau de cours inscrits
    await updateDoc(etudiantRef, {
      coursId: updatedCours,
    })

    console.log("Inscription réussie au cours.")
  } catch (err) {
    console.error("Erreur lors de l'inscription au cours : ", err)
    throw new Error("Erreur lors de l'inscription au cours.")
  }
}

export async function getStudentNotifications(etudiantId: string): Promise<NotificationItem[]> {
  try {
    const docRef = doc(db, 'etudiants', etudiantId)
    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists()) {
      throw new Error("Étudiant non trouvé.")
    }
    
    const data = docSnap.data()
    return data.notifications || []
  } catch (error: unknown) {
    console.error("Erreur lors de la récupération des notifications:", error)
    if (error instanceof Error) {
      throw error
    } else {
      throw new Error("Erreur lors de la récupération des notifications.")
    }
  }
}

// Fonction pour ajouter une notification à un étudiant
export async function addNotificationToStudent(
  etudiantId: string, 
  message: string
): Promise<void> {
  try {
    const etudiantRef = doc(db, 'etudiants', etudiantId)
    const docSnap = await getDoc(etudiantRef)
    
    if (!docSnap.exists()) {
      throw new Error("Étudiant non trouvé.")
    }
    
    const data = docSnap.data()
    const notifications = data.notifications || []
    
    const newNotification = {
      id: `notif-${Date.now()}`,
      message,
      date: new Date().toISOString(),
      read: false
    }
    
    await updateDoc(etudiantRef, {
      notifications: [...notifications, newNotification]
    })
    
    // Update localStorage if the student is currently logged in
    const storedEtudiant = localStorage.getItem('etudiant')
    if (storedEtudiant) {
      const etudiant: Etudiant = JSON.parse(storedEtudiant)
      if (etudiant.id === etudiantId) {
        if (!etudiant.notifications) {
          etudiant.notifications = []
        }
        etudiant.notifications.push(newNotification)
        localStorage.setItem('etudiant', JSON.stringify(etudiant))
      }
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout de la notification:", error)
    throw new Error("Erreur lors de l'ajout de la notification.")
  }
}

// Fonction pour marquer une notification comme lue
export async function markNotificationAsRead(
  etudiantId: string,
  notificationId: string
): Promise<void> {
  try {
    const etudiantRef = doc(db, 'etudiants', etudiantId)
    const docSnap = await getDoc(etudiantRef)
    
    if (!docSnap.exists()) {
      throw new Error("Étudiant non trouvé.")
    }
    
    const data = docSnap.data()
    if (!data.notifications) return
    
    const updatedNotifications = data.notifications.map((notif: any) => {
      if (notif.id === notificationId) {
        return { ...notif, read: true }
      }
      return notif
    })
    
    await updateDoc(etudiantRef, {
      notifications: updatedNotifications
    })
    
    // Update localStorage if the student is currently logged in
    const storedEtudiant = localStorage.getItem('etudiant')
    if (storedEtudiant) {
      const etudiant: Etudiant = JSON.parse(storedEtudiant)
      if (etudiant.id === etudiantId && etudiant.notifications) {
        etudiant.notifications = updatedNotifications
        localStorage.setItem('etudiant', JSON.stringify(etudiant))
      }
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la notification:", error)
    throw new Error("Erreur lors de la mise à jour de la notification.")
  }
}