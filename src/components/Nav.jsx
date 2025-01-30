import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import LoginHandler from './LoginHandler'

import Logo from '/logo.svg'

import '../css/Nav.css'
import '../../node_modules/flag-icons/css/flag-icons.min.css'


const languages = {
  en: {
    name: 'English',
    code: 'en',
    icon: 'fi fi-us',
  },
  pl: {
    name: 'Polski',
    code: 'pl',
    icon: 'fi fi-pl'
  },
}

function Nav() {
  const { i18n, t } = useTranslation()

  const [langPickerIsOpen, setLangPickerIsOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState(languages?.[i18n.language] || languages?.['en'] || {})

  const changeLanguage = (code) => {
    i18n.changeLanguage(code || 'en')
    setSelectedLanguage(languages?.[code] || languages?.['en'] || {})
    setLangPickerIsOpen(false)
  }

  return (
    <nav id='main-navigation'>
      <img src={Logo} alt='Kana Typer logo' className='main-navigation__logo' />

      <ul className='main-navigation__list'>
        <li><Link className='main-navigation__link' to='/' >{t('navigation.home')}</Link></li>
        <li><Link className='main-navigation__link' to='/typer'>{t('navigation.typer')}</Link></li>
        <li><Link className='main-navigation__link' to='/progress'>{t('navigation.progress')}</Link></li>
        <li><Link className='main-navigation__link' to='/help'>{t('navigation.help')}</Link></li>
      </ul>

      <div className={`main-navigation__language-picker ${langPickerIsOpen ? 'language-picker__open' : ''}`}>
        <button type='button' className='language-picker__selected' onClick={() => setLangPickerIsOpen(prev => !prev)}>
          <span className={selectedLanguage?.icon || ''}></span>
          <span>{selectedLanguage?.name || '...'}</span>
        </button>

        {langPickerIsOpen && (
          <ul className='language-picker__dropdown'>
            {Object.values(languages).filter(lang => lang.code !== selectedLanguage?.code || '').map((lang, idx) => (
              <li key={idx}>
                <button type='button' onClick={() => changeLanguage(lang.code)}>
                  <span className={lang?.icon || ''}></span>
                  <span>{lang?.name || '...'}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <LoginHandler />
    </nav>
  )
}

export default Nav