import { useState } from 'react'

import { useTyperData } from '../../context/TyperDataContext'

import TyperSettings from './components/TyperSettings'

import './css/TyperPage.css'
import Typer from './components/Typer'


function TyperPage() {
  const { filterNames, typerFilters, setTyperFilters, setTyperFiltersProp } = useTyperData()

  const [showTyper, setShowTyper] = useState(false)
  const [settingSelected, setSettingSelected] = useState(false)
  const [filtersActive, setFiltersActive] = useState(true)

  const sel = (filterName) => {
    if (settingSelected === false)
      setSettingSelected(true)
    setTyperFilters(filterName)
  }

  const toggleFiltersClickability = (state) => setFiltersActive(state)

  const FilterButton = ({ label, group }) => (
    <button onClick={() => sel(group)} disabled={!filtersActive}>{label}</button>
  )

  let content = null

  if (showTyper) {
    content = (
      <Typer 
        typerSettings={typerFilters.typer} 
        toggleFiltersClickability={toggleFiltersClickability}
      />
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
          <li><FilterButton label='Hiragana' group={filterNames.hiragana} /></li>
          <li><FilterButton label='Katakana' group={filterNames.katakana} /></li>
          <li><hr /></li>
          <li><FilterButton label='Clothes' group={filterNames.clothes} /></li>
          <li><FilterButton label='Numbers' group={filterNames.numbers} /></li>
          <li><hr /></li>
          <li><FilterButton label='All kana' group={filterNames.allKana} /></li>
          <li><FilterButton label='All words' group={filterNames.allWords} /></li>
          <li><FilterButton label='Everything' group={filterNames.all} /></li>
        </ul>
      </nav>
      {content}
    </>
  )
}

export default TyperPage