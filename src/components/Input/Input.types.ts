import {  AllHTMLAttributes } from "react"

export interface InputProps extends AllHTMLAttributes<HTMLElement> {
    label: string, 
    inputName: string, 
    inputType: string, 
    inputErrorMessage?: string
}