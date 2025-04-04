import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="home-container">
    <h1>Bienvenue à HopeSchool – Votre École de Cours Particuliers</h1>
    <p>
      Offrez à votre enfant l'éducation qu'il mérite, avec des cours personnalisés adaptés à ses besoins.
      Rejoignez HopeSchool pour une expérience d'apprentissage sur mesure et un soutien constant.
    </p>
    <Link to="courses">Découvrez nos cours</Link>
  </div>
  )
}

export default Home
