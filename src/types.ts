export interface Testimonial {
  id: string
  name: string
  message: string
  date: string
}

export interface NotificationItem {
    id: string
    message: string
    date: string
    read: boolean
  }

export interface Etudiant {
  id?: string
  email: string
  mdp: string
  name: string
  niveau?: string
  dateInscription?: string
  derniereConnexion?: string
  coursId?: string[] // IDs des cours auxquels l'étudiant est inscrit
  notifications?: NotificationItem[]
}

export interface Cours {
  id: string
  name: string
  description: string
  price: number
  level: 'primaire' | 'secondaire' | 'universite'
  imageUrl: string
}
