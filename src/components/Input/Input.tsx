import React, { FC } from 'react';
import { InputProps } from './Input.types'
import './Input.css';


const Input: FC<InputProps> = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, inputName, inputType, inputErrorMessage, ...props }, ref) => {

    return(
        <div className='Input'>
            <label htmlFor={inputName}>{label}</label>
            <input className={inputErrorMessage && 'has-error'} id={inputName} type={inputType} ref={ref} {...props} />
            <p className='error'>{inputErrorMessage}</p>
        </div>
    )
})

export default Input;