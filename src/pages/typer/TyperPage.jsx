import { useState } from 'react'

import Typer from './components/Typer'

import './css/TyperPage.css'

const MORA_SCRIPTS = {
  hiragana: 'hiragana',
  katakana: 'katakana',
}

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
  let settingsContent = (
    <div>Nothing chosen</div>
  )

  const [showTyper, setShowTyper] = useState(false)

  const [moraFilters, setMoraFilters] = useState({
    use: false,
    scripts: [], // MORA_SCRIPTS
    type: [], // MORA_TYPES
    extended: true, // only for katakana, e.g. che, ti, tsa
    sokuon: true, // e.g. kka, dde, hhya
    yoon: true, // e.g. kya, ju, hhyo
  })
  const [wordsFilters, setWordsFilters] = useState({
    use: false,
    tags: [], // MORA_TAGS
  })
  const [typerSettings, setTyperSettings] = useState({
    time: 20, // in seconds, or null|undefined for no timer
    incognito: false, // if true, does not save progress
    furigana: 'auto', // auto for auto-detected from progress, romaji for romaji only, hiragana for hiragana only, null|undefined for no furigana
  })

  const moraNotEmpty = moraFilters?.use && moraFilters.use === true
  const wordsNotEmpty = wordsFilters?.use && wordsFilters.use === true

  const onHiragana = () => {
    setMoraFilters(prev => ({
      ...prev,
      use: true,
      scripts: [MORA_SCRIPTS.hiragana],
      type: prev?.type?.length < 2
        ? [MORA_TYPES.gojuon]
        : prev.type,
      extended: false,
    }))
    setWordsFilters(prev => ({
      ...prev,
      use: false,
    }))
  }

  const onKatakana = () => {
    setMoraFilters(prev => ({
      ...prev,
      use: true,
      scripts: [MORA_SCRIPTS.katakana],
      type: prev?.type?.length < 2
        ? [MORA_TYPES.gojuon]
        : prev.type,
      extended: true,
    }))
    setWordsFilters(prev => ({
      ...prev,
      use: false,
    }))
  }

  const onKana = () => {
    setMoraFilters(prev => ({
      ...prev,
      use: true,
      scripts: [MORA_SCRIPTS.hiragana, MORA_SCRIPTS.katakana],
      type: prev?.type?.length < 2
        ? [MORA_TYPES.gojuon]
        : prev.type,
      extended: true,
    }))
    setWordsFilters(prev => ({
      ...prev,
      use: false,
    }))
  }

  const onWords = (tags) => {
    setMoraFilters(prev => ({
      ...prev,
      use: false,
    }))
    setWordsFilters(prev => ({
      ...prev,
      use: true,
      tags: tags.length < 2 
        ? [WORDS_TAGS.particles] 
        : tags,
    }))
  }

  const onAllWords = () => {
    setMoraFilters(prev => ({
      ...prev,
      use: false,
    }))
    setWordsFilters(prev => ({
      ...prev,
      use: true,
      tags: Object.values(WORDS_TAGS),
    }))
  }

  const onEverything = () => {
    setMoraFilters(prev => ({
      ...prev,
      use: true,
      scripts: [MORA_SCRIPTS.hiragana, MORA_SCRIPTS.katakana],
      type: [MORA_TYPES.gojuon, MORA_TYPES.dakuten, MORA_TYPES.handakuten],
      extended: true,
      sokuon: true,
      yoon: true,
    }))
    setWordsFilters(prev => ({
      ...prev,
      use: true,
      tags: Object.values(WORDS_TAGS),
    }))
  }

  if (moraNotEmpty || wordsNotEmpty) {
    settingsContent = (<></>) // reset default on-first-load components
  }

  if (moraNotEmpty) {
    settingsContent = (
      <>
        {settingsContent}
        <fieldset className='typer-settings__mora-filters-form'>
          <legend>Mora</legend>

          <fieldset>
            <legend>Type</legend>

            {Object.entries(MORA_TYPES).map(([key, value]) => (
              <div key={`filter-mora-type-${key}`}>
                <label htmlFor={`filter-mora-type-${key}`}>{value}</label>
                <input 
                  type='checkbox' name={`filter-mora-type-${key}`} 
                  id={`filter-mora-type-${key}`} 
                  checked={moraFilters?.type?.includes(value) ?? false}
                  onChange={event => {
                    const { checked } = event.target

                    setMoraFilters(prev => {
                      let newType = []
                      const oldType = prev?.type ?? []
                      const isIncluded = oldType.includes(value)
                      const isLastItem = oldType.length < 2

                      if (checked && !isIncluded) 
                        newType = [...oldType, value]
                      else if (!checked && isIncluded)
                        newType = isLastItem 
                          ? oldType 
                          : oldType.filter(item => item !== value)

                      return {
                        ...prev,
                        type: newType,
                      }
                    })
                  }}
                />
                <br />
              </div>
            ))}
          </fieldset>

          {moraFilters?.scripts?.includes(MORA_SCRIPTS.katakana) ?? false
            ? (
              <>
                <label htmlFor='filter-mora-extended'>extended</label>
                <input 
                  type='checkbox' 
                  name='filter-mora-extended' 
                  id='filter-mora-extended' 
                  checked={moraFilters?.extended ?? false}
                  onChange={event => {
                    setMoraFilters(prev => ({
                      ...prev,
                      extended: event.target.checked
                    }))
                  }}
                />
                <br />
              </>
            ) : (null)
          }

          <label htmlFor='filter-mora-sokuon'>sokuon</label>
          <input 
            type='checkbox' 
            name='filter-mora-sokuon' 
            id='filter-mora-sokuon' 
            checked={moraFilters?.sokuon ?? false}
            onChange={event => {
              setMoraFilters(prev => ({
                ...prev,
                sokuon: event.target.checked
              }))
            }}
          />
          <br />

          <label htmlFor='filter-mora-yoon'>yoon</label>
          <input 
            type='checkbox' 
            name='filter-mora-yoon' 
            id='filter-mora-yoon' 
            checked={moraFilters?.yoon ?? false}
            onChange={event => {
              setMoraFilters(prev => ({
                ...prev,
                yoon: event.target.checked
              }))
            }}
          />
        </fieldset>
      </>
    )
  }
  
  if (wordsNotEmpty) {
    settingsContent = (
      <>
        {settingsContent}
        <fieldset className='typer-settings__words-filters-form'>
          <legend>Word types</legend>

          {Object.entries(WORDS_TAGS).map(([key, value]) => (
            <div key={`filter-words-tag-${key}`}>
              <label 
                htmlFor={`filter-words-tag-${key}`} 
              >{value}</label>
              <input 
                type='checkbox' 
                name={`filter-words-tag-${key}`} 
                id={`filter-words-tag-${key}`} 
                checked={wordsFilters?.tags?.includes(value) ?? false}
                  onChange={event => {
                    const { checked } = event.target

                    setWordsFilters(prev => {
                      let newTags = []
                      const oldTags = prev?.tags ?? []
                      const isIncluded = oldTags.includes(value)
                      const isLastItem = oldTags.length < 2

                      if (checked && !isIncluded) 
                        newTags = [...oldTags, value]
                      else if (!checked && isIncluded)
                        newTags = isLastItem 
                          ? oldTags 
                          : oldTags.filter(item => item !== value)

                      return {
                        ...prev,
                        tags: newTags,
                      }
                    })
                  }}
              />
              <br />
            </div>
          ))}
        </fieldset>
      </>
    )
  }

  return (
    <>
      {/* <span className='vl'></span> */}
      <nav>
        <ul>
          <li><button onClick={onHiragana}>Hiragana</button></li>
          <li><button onClick={onKatakana}>Katakana</button></li>
          <li><button onClick={onKana}>All kana</button></li>
          <li><button onClick={() => onWords([WORDS_TAGS.particles])}>Particles</button></li>
          <li><button onClick={onAllWords}>All words</button></li>
          <li><button onClick={onEverything}>Everything</button></li>
        </ul>
      </nav>
      {showTyper 
        ? (
          <Typer 
            moraFilters={moraFilters} 
            wordsFilters={wordsFilters} 
            typerSettings={typerSettings} 
          />
        ) : (
          <section className='typer-settings'>
            <form action=''>
              {settingsContent}
            </form>
          </section>
        )
      }
    </>
  )
}

export default TyperPage
