function FormSelect({ uid, label, options, ...props }) {
  const customProps = {
    name: uid,
    id: uid,
    ...props,
  }

  return (
    <div className={`${uid}__wrapper`}>
      <label htmlFor={customProps.id}>{label}</label>
      <select {...customProps}>{options}</select>
    </div>
  )
}

export default FormSelect