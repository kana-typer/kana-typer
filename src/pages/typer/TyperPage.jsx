import { useState } from 'react'

import { useTyperData } from '../../context/TyperDataContext'

import Typer from './components/Typer'
import TyperSettings from './components/TyperSettings'

import Logo from '../../assets/logo-kana.svg'
import HiraganaA from '../../assets/ahiragana.svg'
import KatakanaA from '../../assets/akatakana.svg'
import Kana from '../../assets/kulturajap.svg'

import '../css/TyperPage.css'


function TyperPage() {
  const { filterNames, typerFilters, setTyperFilters, setTyperFiltersProp, typerMap, resetTyperMap } = useTyperData()

  const [showTyper, setShowTyper] = useState(false)             // false - filtering phase; true - gaming phase
  const [settingSelected, setSettingSelected] = useState(false) // false - show screen to let user know to pick a set of filtering options; true - user is modifying their typer experience
  const [filtersActive, setFiltersActive] = useState(true)      // false - set filters to being inactive / unable to be clicked; true - filter buttons are clickable

  const sel = (filterName) => {
    if (settingSelected === false)
      setSettingSelected(true)

    if (typerMap !== null)
      resetTyperMap()

    setTyperFilters(filterName)
    setShowTyper(false)
  }

  const toggleFiltersClickability = (state) => setFiltersActive(state)

  const FilterButton = ({ label, group }) => (
    <button onClick={() => sel(group)} disabled={!filtersActive}>{label}</button>
  )

  let content = null

  if (showTyper) {
    // typer game screen
    content = (
      <Typer 
        typerSettings={typerFilters.typer} 
        toggleFiltersClickability={toggleFiltersClickability}
      />
    )
  } else if (settingSelected) {
    // typer settings and filters screen
    content = (
      <>
        <TyperSettings 
          typerFilters={typerFilters}
          setTyperFiltersProp={setTyperFiltersProp}
        />
        <button className='typer-page__begin' onClick={() => setShowTyper(true)}>&nbsp; Begin &gt;</button>
      </>
    )
  } else {
    // pre-game and pre-settings screen, AKA welcome screen
    content = (
      <div className='typer-page__select'>Select modes from the side nav</div>
    )
  }

  return (
    <>
      <nav className='typer-page__left-nav'>
      <img src={Logo} alt="Logo" className="typer-page__logo" />
        <ul className='typer-page__ul'>
          <li>
            <div className="typer-page__icon">あ</div>
            <FilterButton label='Hiragana' group={filterNames.hiragana} />
          </li>
          <li>
            <div className="typer-page__icon">ア</div>
            <FilterButton label='Katakana' group={filterNames.katakana} /></li>
          <li><hr /></li>
          <li>
            <div className="typer-page__icon">着</div>
            <FilterButton label='Clothes' group={filterNames.clothes} /></li>
          <li>
            <div className="typer-page__icon">円</div>
            <FilterButton label='Numbers' group={filterNames.numbers} /></li>
          <li><hr /></li>
          <li>
            <div className="typer-page__icon">☻</div>
            <FilterButton label='All kana' group={filterNames.allKana} /></li>
          <li>
            <div className="typer-page__icon">☺</div>
            <FilterButton label='All words' group={filterNames.allWords} /></li>
          <li>
          <div className="typer-page__icon">文</div>
            <FilterButton label='Everything' group={filterNames.all} /></li>
        </ul>
      </nav>
      {content}
    </>
  )
}

export default TyperPage