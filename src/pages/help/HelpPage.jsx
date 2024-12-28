import '../css/HelpPage.css'

function HelpPage() {
  return (
    <>
      <section className="help-page__box-top">
        <h1 className="help-page__header">Contact Us</h1>
        <h3 className="help-page__description">Fill the form...</h3>
      </section>

      <section className="help-page__box-bottom">
        <h1 className="help-page__title">Write whatever you like</h1>
        <form className="help-page__form" action="#" method="get">
          <input className="help-page__fname" type="text" placeholder="Name..."/>
          <textarea className="help-page__fmessage" type="text" placeholder="Message..."/>
          <button className="help-page__fsubmit" type="submit">Send</button>
        </form>
      </section>
    </>
  )
}

export default HelpPage
