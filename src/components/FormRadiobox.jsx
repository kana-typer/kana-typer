function FormRadiobox({ uid, group, label, ...props }) {
  const customProps = {
    name: uid,
    id: uid,
    ...props,
  }

  if (group !== undefined)
    customProps.name = group

  return (
    <div className={`${uid}__wrapper`}>
      <input type='radio' {...customProps} />
      <label htmlFor={customProps.id}>{label}</label>
    </div>
  )
}

export default FormRadiobox