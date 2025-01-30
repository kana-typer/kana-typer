import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'

import FormGroup from '../../../components/FormGroup'
import FormCheckbox from '../../../components/FormCheckbox'
import FormText from '../../../components/FormText'
import FormSelect from '../../../components/FormSelect'

import { MORA_TYPES, WORDS_TYPES } from '../../../utils/kana'

import '../css/TyperSettings.css'

import { useTranslation } from 'react-i18next'

const MoraFilterFields = ({ filters, setFiltersProp }) => {
  return <FormGroup uid={`typer-settings__filter-mora ${filters?.use ? 'using' : ''}`} legend='Mora'>
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
  return <FormGroup uid={`typer-settings__filter-words ${filters?.use ? 'using' : ''}`} legend='Words'>
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
  return <FormGroup uid='typer-settings__filter-typer using' legend='Typer'>
    <FormText className={`typer-settings__text`}
      uid='filter-typer__time'
      label='time'
      type='number'
      value={filters?.time || 0}
      min={0}
      onChange={e => setFiltersProp('time', Number(e.target.value))}
    />
  </FormGroup>
}

function TyperSettings({ typerFilters, setTyperFiltersProp, toggleTyper }) {
  const { i18n, t } = useTranslation()

  return (
    <>
      <section className="typer-settings__box-top">
        <h1 className="typer-settings__header">{t('customizeDetails.customizeIntro1')}</h1>
        <h3 className="typer-settings__description">{t('customizeDetails.customizeIntro2')}</h3>
      </section>

      <button className='typer-page__begin btn' onClick={() => toggleTyper(true)}>
        <FontAwesomeIcon icon={faPlay} />
        <span>{t('customizeDetails.start')}</span>
      </button>
      
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
    </>
  )
}

export default TyperSettings
