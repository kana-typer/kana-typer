function SettingsPage() {
  return (
    <>
      <section className="box-top">
        <h1>Settings</h1>
        <h3>Here you can reset or change...</h3>
      </section>

      <section className="box-bottom">
        <button className="reset" type="button">Reset your progress</button>
        <button className="account-settings" type="button">Account settings</button>
        <button className="delete" type="button">Delete account</button>
      </section>
    </>
  )
}

export default SettingsPage
