import React from 'react'

const FormCheckBox = ({ label, name, defaultValue, size }) => {
  return (
    <div className='form-control items-center'>
      <label htmlFor={name} className='label cursor-pointer'>
        <span className='label-text capitalize'>{label}</span>
      </label>
      <input 
      type="text" 
      name={name}
      defaultChecked={defaultValue}
      className={`checkbox checkbox-primary ${size}`}
      />
    </div>
  )
}

export default FormCheckBox
