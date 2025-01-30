import { Navigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useGoogleAuth } from '../../context/GoogleAuthContext'

import '../css/HelpPage.css'


function HelpPage() {
  const { currentUser } = useGoogleAuth()
  const location = useLocation()
  const { t } = useTranslation()

  if (currentUser === null || currentUser.isAnonymous)
    return <Navigate to='/login' state={{ from: location }} replace />

  return (
    <>
      <section className="help-page__box-top">
        <h1 className="help-page__header">{t('helpDetails.helpTitle')}</h1>
        <h3 className="help-page__description">{t('helpDetails.helpDesc')}</h3>
      </section>

      <div className='help-page__content'>

        <section className="help-page__box-middle">
          <div className='help-page__link'>
            <h3 className='help-page__topic'>{t('helpDetails.writeLink')}</h3>
            <h4 className='help-page__desc'>{t('helpDetails.linkIssue')}</h4>
            <a className='help-page__issues' href='https://github.com/kana-typer/kana-typer/issues'>{t('helpDetails.helpLink')}</a>
          </div>
        </section>

        <section className="help-page__box-bottom">
          <div className='help-page__dictionary'>
            <h3 className='help-page__topic'>{t('helpDetails.helpDictionary')}</h3>
            <ul className='help-page__dictionary__ul'>
              <li><h4 className='help-page__dictionary__ul-phrase'>{t('helpDetails.helpHira')}</h4> {t('helpDetails.helpHiraDesc')}</li>
              <li><h4 className='help-page__dictionary__ul-phrase'>{t('helpDetails.helpKata')}</h4> {t('helpDetails.helpKataDesc')}</li>
              <li><h4 className='help-page__dictionary__ul-phrase'>{t('helpDetails.helpGojuon')}</h4> {t('helpDetails.helpGojuonDesc')}</li>
              <li><h4 className='help-page__dictionary__ul-phrase'>{t('helpDetails.helpDakuten')}</h4> {t('helpDetails.helpDakutenDesc')}</li>
              <li><h4 className='help-page__dictionary__ul-phrase'>{t('helpDetails.helpHandakuten')}</h4> {t('helpDetails.helpHandakutenDesc')}</li>
              <li><h4 className='help-page__dictionary__ul-phrase'>{t('helpDetails.helpKanji')}</h4> {t('helpDetails.helpKanjiDesc')}</li>
              <li><h4 className='help-page__dictionary__ul-phrase'>{t('helpDetails.helpRomaji')}</h4> {t('helpDetails.helpRomajiDesc')}</li>
              <li><h4 className='help-page__dictionary__ul-phrase'>{t('helpDetails.helpFurigana')}</h4> {t('helpDetails.helpFuriganaDesc')}</li>
            </ul>
          </div>
          <div className='help-page__tutorial'>
            <h3 className='help-page__topic'>{t('helpDetails.helpTutorial')}</h3>
            <ol className='help-page__tutorial__ol'>
                <li>{t('helpDetails.helpTutorial1')}</li>
                <li>{t('helpDetails.helpTutorial2')}</li>
                <li>{t('helpDetails.helpTutorial3')}</li>
                <li>{t('helpDetails.helpTutorial4')}</li>
                <li>{t('helpDetails.helpTutorial5')}</li>
                <li>{t('helpDetails.helpTutorial6')}</li>
            </ol>
          </div>
        </section>
      </div>
    </>
  )
}

export default HelpPage
