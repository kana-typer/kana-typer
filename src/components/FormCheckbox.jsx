function FormCheckbox({ uid, label, ...props }) {
  const customProps = {
    name: uid,
    id: uid,
    ...props,
  }

  return (
    <div className={`${uid}__wrapper`}>
      <input type='checkbox' {...customProps} />
      <label htmlFor={customProps.id}>{label}</label>
    </div>
  )
}

export default FormCheckbox