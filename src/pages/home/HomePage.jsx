import { Link } from 'react-router-dom'
function HomePage() {
  return (
    <div>
      <h1>hello!</h1>
      <button><Link to='/login'>Join us</Link></button>
    </div>
  )
}

export default HomePage
