 import { ButtonHTMLAttributes } from 'react'
 import '../styles/button.scss'
 
 //Definindo a tipagem da propriedade do botão
 type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
   isOutlined?: boolean
 }

export function Button({isOutlined = false, ...props}: ButtonProps) {
  return (
    //Button com spread operator(...props)
    <button 
    className={`button ${isOutlined ? 'outlined' : ''}`} 
    {...props} 
    />
  )
}