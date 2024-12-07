import '../css/ProgressPage.css'

function ProgressPage() {
  return (
    <>
      <h1>Progress</h1>

      <form action="#">
        <input type="text" placeholder="Search" name="search"/>
        <button>Search</button>
      </form>

      <section className="progress">
        <ul>
          <li>
            <h3>Some_Word</h3>
            <div className="progress-bar">
              <div className="bar"></div>
            </div>
          </li>
          <li>
            <h3>Some_Word</h3>
            <div className="progress-bar">
              <div className="bar"></div>
            </div>
          </li>
          <li>
            <h3>Some_Word</h3>
            <div className="progress-bar">
              <div className="bar"></div>
            </div>
          </li>
          <li>
            <h3>Some_Word</h3>
            <div className="progress-bar">
              <div className="bar"></div>
            </div>
          </li>
          <li>
            <h3>Some_Word</h3>
            <div className="progress-bar">
              <div className="bar"></div>
            </div>
          </li>
        </ul>
      </section>
    </>
  )
}

export default ProgressPage
