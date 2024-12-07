function HelpPage() {
  return (
    <>
      <section className="box-top">
        <h1>Contact Us</h1>
        <h3>Fill the form...</h3>
      </section>

      <section className="box-bottom">
        <h1>Write whatever you like</h1>
        <form action="#">
          <input type="text" placeholder="Name"/>
          <input type="text" placeholder="Message"/>
          <input type="submit" value="Send"/>
        </form>
      </section>
    </>
  )
}

export default HelpPage
