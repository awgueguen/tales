import React from 'react'
import '@styles/custominput.scss'


const CustomInput = (props) => {

  const divClass = `${props?.divClassName || ''} form__group`;
  const inputClass = "form__field";
  const labelClass = "form__label";
  const required = props?.required || false;
  const hasLabel =!props?.hasLabel || false;
  

  const focus = (e) => {
    /*
    permet de focus un champ en cliquant sur le label, nécessite props.id!
    */  
    const target = document.getElementById(`${props.id}`)
    target.focus()
  }

  return (
    <>
    <div className={props?.positionClass}>
      <div className={divClass}>
        <input
          id = {props.id}
          type = {props.type}
          className = {inputClass}
          name = {props.name}
          value = {props.value}
          onChange = {props.onChange}
          {... props.required ? {required} : {}}
        />
        { props.value === '' ?
            <>
            {hasLabel ?
            <label 
              id='labelId'
              htmlFor={props.name}
              className={labelClass}
              onClick={focus}
            >
              {props.placeHolder}
            </label>
            : '' }
            </>
        : '' }

      </div>
    </div>
    </>
  )
}

export default CustomInput