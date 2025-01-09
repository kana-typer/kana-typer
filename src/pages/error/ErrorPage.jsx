import { useTranslation } from 'react-i18next'

function ErrorPage() {
  const { i18n, t } = useTranslation()
  
  return (
    <>
      <p>
        <span>ERROR - </span>
        <a href='/'>go back</a>
      </p>
    </>
  )
}

export default ErrorPage