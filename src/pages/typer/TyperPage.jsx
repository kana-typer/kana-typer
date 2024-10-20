import { useState } from 'react'

import { useTyperData } from '../../context/TyperDataContext'

import FormGroup from '../../components/FormGroup'
import FormCheckbox from '../../components/FormCheckbox'
import FormText from '../../components/FormText'
import FormSelect from '../../components/FormSelect'

import { MORA_TYPES, WORDS_TYPES } from '../../utils/kana'

import './css/TyperPage.css'


const MoraFilterFields = ({ filters, setFiltersProp }) => {
  return <FormGroup uid='typer-settings__filter-mora' legend='Mora'>
    <FormGroup uid='typer-settings__filter-mora__scripts' legend='Scripts'>
      <ul>
        {(filters?.scripts ?? []).map(script => (
          <li key={`filter-mora__scripts-${script}`}>{script}</li>
        ))}
      </ul>
    </FormGroup>
    <FormGroup uid='typer-settings__filter-mora__types' legend='Types'>
      {Object.entries(MORA_TYPES).map(([key, value]) => (
        <FormCheckbox 
          key={`filter-mora__types-${key}`}
          uid={`filter-mora__types-${key}`}
          label={value}
          checked={filters?.types?.includes(value) ?? false}
          onChange={e => setFiltersProp('types', value, e.target.checked)}
        />
      ))}
    </FormGroup>
    <FormGroup uid='typer-settings__filter-mora__other' legend='Other'>
      <FormCheckbox 
        uid='filter-mora__sokuon'
        label='sokuon'
        checked={filters?.sokuon ?? false}
        onChange={e => setFiltersProp('sokuon', e.target.checked)}
      />
      <FormCheckbox 
        uid='filter-mora__yoon'
        label='yoon'
        checked={filters?.yoon ?? false}
        onChange={e => setFiltersProp('yoon', e.target.checked)}
      />
      <FormCheckbox 
        uid='filter-mora__extended'
        label='extended'
        checked={filters?.extended ?? false}
        onChange={e => setFiltersProp('extended', e.target.checked)}
      />
    </FormGroup>
  </FormGroup>
}

const WordsFilterFields = ({ filters, setFiltersProp }) => {
  return <FormGroup uid='typer-settings__filter-words' legend='Words'>
    <FormGroup uid='typer-settings__filter-words__categories' legend='Categories'>
      <ul>
        {(filters?.categories ?? []).map(category => (
          <li key={`filter-words__cateories-${category}`}>{category}</li>
        ))}
      </ul>
    </FormGroup>
    <FormGroup uid='typer-settings__filter-words__types' legend='Types'>
      {Object.entries(WORDS_TYPES).map(([key, value]) => (
        <FormCheckbox 
          key={`filter-words__types-${key}`}
          uid={`filter-words__types-${key}`}
          label={value}
          checked={filters?.types?.includes(value) ?? false}
          onChange={e => setFiltersProp('types', value, e.target.checked)}
        />
      ))}
    </FormGroup>
  </FormGroup>
}

const TyperFilterFields = ({ filters, setFiltersProp }) => {
  return <FormGroup uid='typer-settings__filter-typer' legend='Typer'>
    <FormText 
      uid='filter-typer__time'
      label='time'
      type='number'
      value={filters?.time || 0}
      onChange={e => setFiltersProp('time', e.target.value)}
    />
    <FormCheckbox 
      uid='filter-typer__incognito'
      label='incognito'
      checked={filters?.incognito ?? false}
      onChange={e => setFiltersProp('incognito', e.target.checked)}
    />
    <FormSelect 
      uid='filter-typer__furigana'
      label='furigana'
      value={filters?.furigana ?? 'auto'}
      onChange={e => setFiltersProp('furigana', e.target.value)}
      options={<>
        <option value='auto'>auto</option>
        <option value='romaji'>romaji</option>
        <option value='hiragana'>hiragana</option>
        <option value='none'>none</option>
      </>}
    />
  </FormGroup>
}

function TyperPage() {
  const { filterNames, typerFilters, setTyperFilters, setTyperFiltersProp } = useTyperData()

  const [showTyper, setShowTyper] = useState(false)

  return (
    <>
      <nav>
        <ul>
          <li><button onClick={() => setTyperFilters(filterNames.hiragana)}>Hiragana</button></li>
          <li><button onClick={() => setTyperFilters(filterNames.katakana)}>Katakana</button></li>
          <li><hr /></li>
          <li><button onClick={() => setTyperFilters(filterNames.clothes)}>Clothes</button></li>
          <li><button onClick={() => setTyperFilters(filterNames.numbers)}>Numbers</button></li>
          <li><hr /></li>
          <li><button onClick={() => setTyperFilters(filterNames.allKana)}>All kana</button></li>
          <li><button onClick={() => setTyperFilters(filterNames.allWords)}>All words</button></li>
          <li><button onClick={() => setTyperFilters(filterNames.all)}>Everything</button></li>
        </ul>
      </nav>
      {showTyper
        ? (
          <div>Typer here</div>
        ) : (
          <section className="typer-settings">
            <MoraFilterFields 
              filters={typerFilters.mora}
              setFiltersProp={(prop, value, checked) => setTyperFiltersProp('mora', prop, value, checked)}
            />
            <WordsFilterFields 
              filters={typerFilters.words}
              setFiltersProp={(prop, value, checked) => setTyperFiltersProp('words', prop, value, checked)}
            />
            <TyperFilterFields 
              filters={typerFilters.typer}
              setFiltersProp={(prop, value, checked) => setTyperFiltersProp('typer', prop, value, checked)}
            />
          </section>
        )
      }
    </>
  )
}

export default TyperPage