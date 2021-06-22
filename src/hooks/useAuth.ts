import { AuthContext } from '../contexts/AuthContext'
//Iniciando a Api de contexto do React
import { useContext } from 'react'

export function useAuth() {
  const value = useContext(AuthContext)

  return value
}