import { useTranslation } from 'react-i18next'

import LoginHandler from './LoginHandler'

import '../css/Nav.css'

function Nav() {
  const { i18n, t } = useTranslation()

  return (
    <nav id='main-navigation'>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="typer">Typer</a></li>
        <li><a href="progress">Progress</a></li>
        <li><a href="Help">Help</a></li>
        <li><a href="user">Account</a></li>
        <li><a href="wrong-page">Wrong page</a></li>
      </ul>
      <div className='lang-picker'>
        <i>{t('title')}</i>
        <select defaultValue={i18n.language} onChange={e => {
          i18n.changeLanguage(e.target.value)
        }}>
          <option key={1} value="en">English</option>
          <option key={2} value="pl">Polski</option>
        </select>
      </div>
      <span className='v-divider'>|</span>
      <LoginHandler />
    </nav>
  )
}

export default Nav