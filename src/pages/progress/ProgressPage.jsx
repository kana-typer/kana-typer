import '../css/ProgressPage.css'
import '@fortawesome/fontawesome-free/css/all.min.css';

function ProgressPage() {
  return (
    <>
      <h1 className='progress-page__title'>Progress</h1>

      <div className='progress-page__container'>

        <form className='progress-page__form' action='#'>
          <input className='progress-page__search-input' type='text' placeholder='Search' name='search'/>
          <button className='progress-page__search-button'>
            <i class="fa-solid fa-magnifying-glass"></i>Search
          </button>
        </form>

        <section className='progress'>
          <ul>
            <li>
              <h3>兎</h3>
              <div className='progress-bar'>
                <div className='bar'></div>
              </div>
            </li>
            <li>
              <h3>私</h3>
              <div className='progress-bar'>
                <div className='bar'></div>
              </div>
            </li>
            <li>
              <h3>する</h3>
              <div className='progress-bar'>
                <div className='bar'></div>
              </div>
            </li>
            <li>
              <h3>か</h3>
              <div className='progress-bar'>
                <div className='bar'></div>
              </div>
            </li>
            <li>
              <h3>時々</h3>
              <div className='progress-bar'>
                <div className='bar'></div>
              </div>
            </li>
          </ul>
        </section>

      </div>
    </>
  )
}

export default ProgressPage
