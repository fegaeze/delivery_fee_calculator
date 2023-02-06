import React, { FC } from "react";
import "./Input.css";

interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
    label: string, 
    inputName: string, 
    inputType: string, 
    inputErrorMessage?: string
}

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