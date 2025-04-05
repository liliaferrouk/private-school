import React from 'react'
import { NotificationItem } from '../../types'
import { getStudentNotifications, markNotificationAsRead } from '../../api'

function Notifications() {
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([])
  const [etudiantId, setEtudiantId] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function fetchNotifications() {
      setLoading(true)
      try {
        const storedEtudiant = localStorage.getItem('etudiant')
        
        if (!storedEtudiant) {
          throw new Error("Vous n'êtes pas connecté.")
        }
        
        const etudiant = JSON.parse(storedEtudiant)
        setEtudiantId(etudiant.id || null)
        
        // Si nous avons des notifications localement, les utiliser immédiatement
        if (etudiant.notifications) {
          setNotifications(etudiant.notifications)
        }
        
        // Mais aussi rafraîchir depuis Firestore pour avoir les plus récentes
        if (etudiant.id) {
          const freshNotifications = await getStudentNotifications(etudiant.id)
          setNotifications(freshNotifications)
          
          // Mettre à jour le localStorage avec les données fraîches
          etudiant.notifications = freshNotifications
          localStorage.setItem('etudiant', JSON.stringify(etudiant))
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err)
        } else {
          setError(new Error("Une erreur inconnue s'est produite"))
        }
      } finally {
        setLoading(false)
      }
    }
    
    fetchNotifications()
  }, [])
  
  const handleMarkAsRead = async (notificationId: string) => {
    if (!etudiantId) return
    
    try {
      await markNotificationAsRead(etudiantId, notificationId)
      
      // Mettre à jour l'état local
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read: true } 
            : notif
        )
      )
    } catch (err) {
      console.error("Erreur lors du marquage comme lu:", err)
    }
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }
  
  if (loading) {
    return <h1>Chargement de vos notifications...</h1>
  }
  
  if (error) {
    return <div className="error-container">
      <h2>Erreur</h2>
      <p>{error.message}</p>
    </div>
  }
  
  if (!notifications || notifications.length === 0) {
    return (
      <div className="empty-notifications">
        <h2>Vous n'avez aucune notification</h2>
        <p>Les mises à jour importantes apparaîtront ici.</p>
      </div>
    )
  }
  
  // Trier les notifications par date (plus récentes d'abord)
  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  
  return (
    <div className="notifications-container">
      <h1>Vos notifications</h1>
      <div className="notifications-list">
        {sortedNotifications.map(notification => (
          <div 
            key={notification.id} 
            className={`notification-item ${notification.read ? 'read' : 'unread'}`}
          >
            <div className="notification-content">
              <p className="notification-message">{notification.message}</p>
              <p className="notification-date">{formatDate(notification.date)}</p>
            </div>
            {!notification.read && (
              <button 
                className="mark-read-button"
                onClick={() => handleMarkAsRead(notification.id)}
              >
                Marquer comme lu
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Notifications