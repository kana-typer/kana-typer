function HelpPage() {
  return (
    <>
      <section className="box-top">
        <h1>Contact Us</h1>
        <h3>Fill the form...</h3>
      </section>

      <section className="box-bottom">
        <h1>Write whatever you like</h1>
        <form action="#" method="get">
          <input className="fname" type="text" placeholder="Name"/>
          <input className="fmessage" type="text" placeholder="Message"/>
          <input className="fsubmit" type="submit" value="Send"/>
        </form>
      </section>
    </>
  )
}

export default HelpPage
