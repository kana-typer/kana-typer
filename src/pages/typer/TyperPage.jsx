import { useState } from 'react'
import Typer from './components/Typer'

const MORA_TYPES = {
  gojuon: 'gojuon',
  dakuten: 'dakuten',
  handakuten: 'handakuten',
}

const WORDS_TAGS = {
  verbs: 'verbs',
  nouns: 'nouns',
  adjectives: 'adjectives',
  particles: 'particles',
}

function TyperPage() {
  const [moraFilters, setMoraFilters] = useState({
    type: [], // MORA_TYPES
    extended: true, // only for katakana, e.g. che, ti, tsa
    sokuon: true, // e.g. kka, dde, hhya
    yoon: true, // e.g. kya, ju, hhyo
  })
  const [wordsFilters, setWordsFilters] = useState({
    tags: [], // MORA_TAGS
  })
  const [typerSettings, setTyperSettings] = useState({
    time: 20, // in seconds, or null|undefined for no timer
    incognito: false, // if true, does not save progress
    furigana: 'auto', // auto for auto-detected from progress, romaji for romaji only, hiragana for hiragana only, null|undefined for no furigana
  })

  return (
    <>
      <span className='vl'></span>
      <Typer moraFilters={moraFilters} wordsFilters={wordsFilters} typerSettings={typerSettings} />
    </>
  )
}

export default TyperPage
