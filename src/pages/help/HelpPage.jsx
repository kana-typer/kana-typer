import '../css/HelpPage.css'

import { useTranslation } from 'react-i18next'


function HelpPage() {
  const { i18n, t } = useTranslation()

  return (
    <>
      <section className="help-page__box-top">
        <h1 className="help-page__header">{t('helpDetails.contact')}</h1>
        <h3 className="help-page__description">{t('helpDetails.helpDesc')}</h3>
      </section>

      <section className="help-page__box-bottom">
        <h1 className="help-page__title">{t('helpDetails.writeForm')}</h1>
        <form className="help-page__form" action="#" method="get">
          <input className="help-page__fname" type="text" placeholder={t('helpDetails.nameForm')}/>
          <textarea className="help-page__fmessage" type="text" placeholder={t('helpDetails.messageForm')}/>
          <button className="help-page__fsubmit" type="submit">{t('helpDetails.sendForm')}</button>
        </form>
      </section>
    </>
  )
}

export default HelpPage
