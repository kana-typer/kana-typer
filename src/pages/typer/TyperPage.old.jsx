import { useState } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'

import { db } from '../../config/firebase'

import Typer from './components/Typer'

import './css/TyperPage.css'
import FromGroup from '../../components/FormGroup'
import FormCheckbox from '../../components/FormCheckbox'
import FormRadiobox from '../../components/FormRadiobox'
import FormText from '../../components/FormText'

const MORA_SCRIPTS = {
  hiragana: 'hiragana',
  katakana: 'katakana',
}

const MORA_TYPES = {
  gojuon: 'gojuon',
  dakuten: 'dakuten',
  handakuten: 'handakuten',
}

const WORDS_GROUPS = {
  clothes: 'clothes',
  numbers: 'numbers',
  colors: 'colors',
}

const WORDS_TAGS = {
  verbs: 'verbs',
  nouns: 'nouns',
  adjectives: 'adjectives',
  particles: 'particles',
}

function TyperPage() {
  function Tester() {
    const [typerFilters, setTyperFilters] = useState({
      mora: {
        use: true,
        scripts: ['hiragana'], // MORA_SCRIPTS, non-empty
        types: [], // MORA_TYPES, non-empty
        extended: true, // only for katakana, e.g. che, ti, tsa
        sokuon: true, // e.g. kka, dde, hhya
        yoon: true, // e.g. kya, ju, hhyo
      },
      words: {
        use: false,
        categories: [], // WORDS_CATEGORIES, non-empty
        types: [], // WORDS_TYPES, non-empty
      },
      typer: {
        time: 20, // in seconds, or null|undefined for no timer
        incognito: false, // if true, does not save progress
        furigana: 'auto', // auto for auto-detected from progress, romaji for romaji only, hiragana for hiragana only, null|undefined for no furigana
      },
    })
  
    const [typerData, setTyperData] = useState({
      mora: {
        raw: [],
        map: null,
  
      },
      words: {
        raw: [],
        map: null,
      },
      modifiers: {
        sokuon: { 
          hiragana: null, 
          katakana: null,
        },
        yoon: {
          hiragana: { ya: null, yu: null, yo: null },
          katakana: { ya: null, yu: null, yo: null },
        },
      },
      user: {}
    })
  
    const [typerPool, setTyperPool] = useState({})
  
    const loadUniqueFromDb = async (filters, group, source, collectionName, propertyName) => {
      const sample = await import('../../data/db-sample.json')
  
      let data = null
  
      if (filters.use) {
        const occurences = [] // value=true if group exists in target
        const uniqueGroups = [] // names of groups that do not exist in target
  
        for (const groupName of filters?.[group] || []) {
          const res = source.find(obj => obj?.[propertyName] === groupName) !== undefined
          occurences.push(res)
          if (res === false)
            uniqueGroups.push(groupName)
        }
  
        if (occurences.length < 1 || occurences.some(x => x === false)) {
          data = sample?.[collectionName]?.filter(obj => uniqueGroups.includes(obj?.[propertyName])) || null
        }
  
        console.debug('HERE1', occurences, uniqueGroups)
      }
  
      console.debug('HERE2', data)
  
      return data
    }

    const getRawDataFromDb = () => {
      // // TODO: remove after testing
      // const uniqueArrayFilter = (arr, obj) => arr.length > 0 && arr.length < Object.keys(obj).length

      // const getSmallSymbol = (source, script, target) => source
      //   .filter(obj => obj.script === script)
      //   .find(obj => obj.furigana.romaji == target)
      //   ?.small || null

    //   const modifierValues = [
    //   ...Object.values(data.modifiers.sokuon),
    //   ...Object.values(data.modifiers.yoon.hiragana),
    //   ...Object.values(data.modifiers.yoon.katakana),
    // ]

    //   console.log(typerData.modifiers)
    }

    return (
      <div>
        {getRawDataFromDb()}
      </div>
    )
  }

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
    groups: [], // WORDS_GROUPS
    tags: [], // WORDS_TAGS
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

  const onWords = (groups) => {
    setMoraFilters(prev => ({
      ...prev,
      use: false,
    }))
    setWordsFilters(prev => ({
      ...prev,
      use: true,
      groups: groups,
      tags: prev?.tags?.length < 2 
        ? [WORDS_TAGS.nouns] 
        : prev.tags,
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
      groups: Object.values(WORDS_GROUPS),
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
      groups: Object.values(WORDS_GROUPS),
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

          <FormCheckbox 
            uid='filter-mora-sokuon'
            label='Sokuon'
            checked={moraFilters?.sokuon ?? false}
            onChange={e => setMoraFilters(prev => ({
              ...prev,
              sokuon: e.target.checked
            }))}
          />

          {/* <label htmlFor='filter-mora-sokuon'>sokuon</label>
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
          <br /> */}


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
          <legend>Word categories</legend>

          {Object.entries(WORDS_GROUPS).map(([key, value]) => (
            <div key={`filter-words-group-${key}`}>
              <label 
                htmlFor={`filter-words-group-${key}`} 
              >{value}</label>
              <input 
                type='checkbox' 
                name={`filter-words-group-${key}`} 
                id={`filter-words-group-${key}`} 
                checked={wordsFilters?.groups?.includes(value) ?? false}
                  onChange={event => {
                    const { checked } = event.target

                    setWordsFilters(prev => {
                      let newGroups = []
                      const oldGroups = prev?.groups ?? []
                      const isIncluded = oldGroups.includes(value)
                      const isLastItem = oldGroups.length < 2

                      if (checked && !isIncluded) 
                        newGroups = [...oldGroups, value]
                      else if (!checked && isIncluded)
                        newGroups = isLastItem 
                          ? oldGroups 
                          : oldGroups.filter(item => item !== value)

                      return {
                        ...prev,
                        groups: newGroups,
                      }
                    })
                  }}
              />
              <br />
            </div>
          ))}
        </fieldset>
        <fieldset>
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
      <nav>
        <ul>
          <li><button onClick={onHiragana}>Hiragana</button></li>
          <li><button onClick={onKatakana}>Katakana</button></li>
          <li><hr /></li>
          <li><button onClick={() => onWords([WORDS_GROUPS.clothes])}>Clothes</button></li>
          <li><button onClick={() => onWords([WORDS_GROUPS.numbers])}>Numbers</button></li>
          <li><hr /></li>
          <li><button onClick={onKana}>All kana</button></li>
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
            <button onClick={() => setShowTyper(true)}>Start</button>
            <Tester />
          </section>
        )
      }
    </>
  )
}

export default TyperPage
