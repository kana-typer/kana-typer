import { useTranslation } from 'react-i18next'

import LoginHandler from './LoginHandler'

import '../css/Nav.css'
import { Link } from 'react-router-dom'

function Nav() {
  const { i18n, t } = useTranslation()

  return (
    <nav id='main-navigation'>
      <ul className='main-navigation__list'>
        <li><Link className='main-navigation__link' to='/' >Home</Link></li>
        <li><Link className='main-navigation__link' to='/typer'>Typer</Link></li>
        <li><Link className='main-navigation__link' to='/progress'>Progress</Link></li>
        <li><Link className='main-navigation__link' to='/Help'>Help</Link></li>
        <li><Link className='main-navigation__link' to='/user'>Account</Link></li>
        <li><Link className='main-navigation__link' to='/wrong-page'>Wrong page</Link></li>
      </ul>
      <div className='lang-picker'>
        <i>{t('title')}</i>
        <select defaultValue={i18n.language} onChange={e => {
          i18n.changeLanguage(e.target.value)
        }}>
          <option key={1} value='en'>English</option>
          <option key={2} value='pl'>Polski</option>
        </select>
      </div>
      <span className='v-divider'>|</span>
      <LoginHandler />
    </nav>
  )
}

export default Nav