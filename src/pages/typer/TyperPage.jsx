import { useState } from 'react'

import { useTyperData } from '../../context/TyperDataContext'

import TyperSettings from './components/TyperSettings'

import './css/TyperPage.css'


function TyperPage() {
  const { filterNames, typerFilters, setTyperFilters, setTyperFiltersProp } = useTyperData()

  const [showTyper, setShowTyper] = useState(false)
  const [settingSelected, setSettingSelected] = useState(false)

  const sel = (filterName) => {
    if (settingSelected === false)
      setSettingSelected(true)
    setTyperFilters(filterName)
  }

  let content = null

  if (showTyper) {
    content = (
      <div>Typer here</div>
    )
  } else if (settingSelected) {
    content = (
      <>
        <TyperSettings 
          typerFilters={typerFilters}
          setTyperFiltersProp={setTyperFiltersProp}
        />
        <button onClick={() => setShowTyper(true)}>&nbsp; Begin &gt;</button>
      </>
    )
  } else {
    content = (
      <div>Select modes from the side nav</div>
    )
  }

  return (
    <>
      <nav>
        <ul>
          <li><button onClick={() => sel(filterNames.hiragana)}>Hiragana</button></li>
          <li><button onClick={() => sel(filterNames.katakana)}>Katakana</button></li>
          <li><hr /></li>
          <li><button onClick={() => sel(filterNames.clothes)}>Clothes</button></li>
          <li><button onClick={() => sel(filterNames.numbers)}>Numbers</button></li>
          <li><hr /></li>
          <li><button onClick={() => sel(filterNames.allKana)}>All kana</button></li>
          <li><button onClick={() => sel(filterNames.allWords)}>All words</button></li>
          <li><button onClick={() => sel(filterNames.all)}>Everything</button></li>
        </ul>
      </nav>
      {content}
    </>
  )
}

export default TyperPage