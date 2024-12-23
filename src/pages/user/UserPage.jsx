import '../css/UserPage.css'
import '@fortawesome/fontawesome-free/css/all.min.css';

function UserPage() {
  return (
    <>
      <section className="user-page__box-top">
        <h1 className="user-page__header">Profile</h1>
        <h3 className="user-page__description">This webside provides info about your account</h3>
      </section>

      <section className="user-page__box-bottom">
        <i className="fas fa-cog fa-2x"></i>
        <div className='user-page__profile-pic'></div>
        <h1 className='user-page__profile-text'>Account Info</h1>
        <ul className='user-page__profile-fields'>
          <li>
            <h3 className='user-page__profile__name'>Username:</h3>
            <h4 className='user-page__profile__content'>username1</h4>
            <a className="fa-solid fa-pen" href='#'></a>
          </li>
          <li>
            <h3 className='user-page__profile__name'>E-mail:</h3>
            <h4 className='user-page__profile__content'>email@gmail.com</h4>
            <a className="fa-solid fa-pen" href='#'></a>
          </li>
          <li>
            <h3 className='user-page__profile__name'>Date of First Login:</h3>
            <h4 className='user-page__profile__content'>01-01-2025</h4>
            <a href='#'></a>
          </li>
        </ul>
        
        <section className='user-page__settings'>
          <h1 className='user-page__settings-text'>Account Settings</h1>
          <button className='user-page__reset'>Reset your progress</button>
          <button className='user-page__delete'>Delete account</button>
        </section>
      </section>
    </>
  )
}

export default UserPage
