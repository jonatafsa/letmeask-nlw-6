
//Ferramenta usada para navegação
import { useHistory } from 'react-router-dom'

//Imagens
import illustration from '../assets/img/illustration.svg'
import logo from '../assets/img/logo.svg'
import googleIcon from '../assets/img/google-icon.svg'

// CSS
import '../styles/auth.scss'

//Componentes
import { Button } from '../components/Button'
import { useAuth } from '../hooks/useAuth'

export function Home() {
  //Constante com a função de navegação
  const history = useHistory()
  const { signInWithGoogle, user } = useAuth()

  //Definindo o valor de contexto obtido do {TestContext}
  

  //Função responsável por logar o usuário
  async function handleCreateRoom() {
    if(!user){
      await signInWithGoogle()
    }
    history.push('/rooms/new')
  }

  return (
    <div id="page-auth">
      <aside>
        <strong>Crie sala ou faça perguntas</strong>
        <p>Aprenda ajudando outras pessoas com seu conhecimento</p>
        <img src={illustration} alt="illustration" />
      </aside>
      <main>
        <div className="main-content">
          <img src={logo} alt="Letmeask" />
          <button className="create-room" onClick={handleCreateRoom}>
            <img src={googleIcon} alt="Logo do google" />
            Cria sua sala com o google
          </button>
          <div className="divider">ou entre em uma sala</div>
          <form>
            <input
              type="text"
              placeholder="Digite o código da sala"
            />
            <Button type="submit"> Entrar na sala </Button>
          </form>
        </div>
      </main>
    </div>
  )
}