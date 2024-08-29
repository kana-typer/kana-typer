import '../css/Stats.css'

function Stats({ stats }) {
  return (
    <div className='stats'>
      <table>
        <tbody>
          <tr>
            <td>Correct</td>
            <td>{Object.values(stats.correct).length}</td>
          </tr>
          <tr>
            <td>Incorrect</td>
            <td>{Object.values(stats.incorrect).length}</td>
          </tr>
          <tr>
            <td>Accuracy</td>
            <td>{0}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Stats