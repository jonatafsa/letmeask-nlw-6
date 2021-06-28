//Hooks Nativos do React
import { createContext, ReactNode, useEffect, useState } from "react"

//Import do firebase
import { auth, firebase } from "../services/firebase"

//Definindo o tipo do usuário de contexto
type User = {
  id: string;
  name: string;
  avatar: string;
}

//Definindo o tipo do Contexto
type AuthContextType = {
  //user recebe a Tipagem 'User do usuário de contexto'
  user: User | undefined;
  //signInWithGoogle recebe uma função de processamento assíncrona(Promise), sem retorno'<void>'
  signInWithGoogle: () => Promise<void>;
}

//As propriedades do contexto(children) recebe o tipo ReactNode(JSX.Element), nativo do React
type AuthContextProviderProps = {
  children: ReactNode
}

//Exporta o contexto
//o contexto recebe como valor um objeto e esse objeto é do tipo 'AuthContextType'
export const AuthContext = createContext({} as AuthContextType)

//Exporta o Provider que é responsável por conter toda a lógica do contexto
export function AuthContextProvider(props: AuthContextProviderProps) {
  //Cria um estado que recebe os dados do usuário
  const [user, setUser] = useState<User>()

  //Hook nativo do react, responsável por verificar se o usuário já está autenticado
  useEffect(() => {
    //Função que verifica se o usuário já esta autenticado
    const unsubscribe = auth.onAuthStateChanged(user => {
      
      //LÓGICA:
      //Se o useEffect achar um usuário(user)
      if (user) {
        //Cria uma constante contendo os seguintes dados a seguir
        const { displayName, photoURL, uid } = user;

        //Se dentro desse usuário(user), não houver os seguintes dados
        if (!displayName || !photoURL) {
          //Retorna uma mensagem de erro
          throw new Error('Missing information from Google Account.');
        }

        //define o usuário com os dados existentes
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }
    })

    //Retorna uma função do useEffect para fazer a limpeza
    return () => {
      unsubscribe()
    }
  }, [])

  //Função que tenta autenticar o usuário
  async function signInWithGoogle() {
    //Define o provider como função vinda do firebase
    const provider = new firebase.auth.GoogleAuthProvider()

    //Função que abre a tentativa de autenticar o usuário, 
    //que recebe como propriedade uma função vinda do firebase
    const result = await auth.signInWithPopup(provider);

    //Condição verifica o usuário autenticado
    //LÓGICA: se a função 'signInWithGoogle' achar um usuário
    if (result.user) {
      //Cria uma constante contendo os seguintes dados a seguir
      const { displayName, photoURL, uid } = result.user;

      //Se dentro desse usuário(user), não houver os seguintes dados
      if (!displayName || !photoURL) {
        //Retorna uma mensagem de erro
        throw new Error('Missing information from Google Account.');
      }

      //define o usuário com os dados existentes
      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL
      })
    }
  }

  //Retorno do contexto do Provider
  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {props.children}
    </AuthContext.Provider>
  )
}