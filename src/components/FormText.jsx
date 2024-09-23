function FormText({ uid, label, ...props }) {
  const customProps = {
    name: uid,
    id: uid,
    ...props,
  }

  return (
    <div className={`${uid}__wrapper`}>
      <label htmlFor={customProps.id}>{label}</label>
      <input type='text' {...customProps} />
    </div>
  )
}

export default FormText