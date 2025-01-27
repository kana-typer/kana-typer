import { Navigate, useLocation } from 'react-router-dom'

import { useTranslation } from 'react-i18next'
import { useGoogleAuth } from '../../context/GoogleAuthContext'

import '../css/TermsOfServicePage.css'


function TermsOfServicePage() {
  const { currentUser } = useGoogleAuth()
  const location = useLocation()

  const { i18n, t } = useTranslation()

  return (
    <>
      <section className="tos-page__intro">
        <h1 className="tos-page__header">{t('termsOfService.tos')}</h1>
        <h3 className="tos-page__intro">{t('termsOfService.tosIntro')}</h3>
        <h4 className='tos-page__desc'>{t('termsOfService.tosDesc')}</h4>
      </section>

      <section className="tos-page__terms">
        <h2 className='tos-page__title'>{t('termsOfService.tosTerms')}</h2>
        <h3 className="tos-page__topic">{t('termsOfService.tosTerm1')}</h3>
          <ul>
            <li>{t('termsOfService.tosTerm11')}</li>
            <li>{t('termsOfService.tosTerm12')}</li>
          </ul>
          <h3 className="tos-page__topic">{t('termsOfService.tosTerm2')}</h3>
          <ul>
            <li>{t('termsOfService.tosTerm21')}</li>
            <li>{t('termsOfService.tosTerm22')}</li>
          </ul>
          <h3 className="tos-page__topic">{t('termsOfService.tosTerm3')}</h3>
          <ul>
            <li>{t('termsOfService.tosTerm31')}</li>
          </ul>
          <h3 className="tos-page__topic">{t('termsOfService.tosTerm4')}</h3>
          <ul>
            <li>{t('termsOfService.tosTerm41')}</li>
          </ul>
      </section>

      <section className="tos-page__policy">
        <h2 className='tos-page__title'>{t('termsOfService.tosPolicy')}</h2>
        <h3 className="tos-page__topic">{t('termsOfService.tosPolicy1')}</h3>
        <ul>
          <li>{t('termsOfService.tosPolicy11')}</li>
        </ul>
        <h3 className="tos-page__topic">{t('termsOfService.tosPolicy2')}</h3>
        <ul>
          <li>{t('termsOfService.tosPolicy21')}</li>
          <li>{t('termsOfService.tosPolicy22')}</li>
        </ul>
        <h3 className="tos-page__topic">{t('termsOfService.tosPolicy3')}</h3>
        <ul>
          <li>{t('termsOfService.tosPolicy31')}</li>
          <li>{t('termsOfService.tosPolicy32')}</li>
        </ul>
        <h3 className="tos-page__topic">{t('termsOfService.tosPolicy4')}</h3>
        <ul>
          <li>{t('termsOfService.tosPolicy41')}</li>
          <li>{t('termsOfService.tosPolicy42')}</li>
        </ul>
        <h3 className="tos-page__topic">{t('termsOfService.tosPolicy5')}</h3>
        <ul>
          <li>{t('termsOfService.tosPolicy51')}</li>
        </ul>
        <h3 className="tos-page__topic">{t('termsOfService.tosPolicy6')}</h3>
        <ul>
          <li>{t('termsOfService.tosPolicy61')}</li>
        </ul>
      </section>
    </>
  )
}

export default TermsOfServicePage
