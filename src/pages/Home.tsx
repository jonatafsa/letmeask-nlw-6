
//Ferramenta usada para navegação
import { useHistory } from 'react-router-dom'

//Imagens
import illustration from '../assets/img/illustration.svg'
import logo from '../assets/img/logo.svg'
import googleIcon from '../assets/img/google-icon.svg'
import notFound from '../assets/img/not-found.svg'

// CSS e ícones
import '../styles/auth.scss'
import { IoIosCreate } from 'react-icons/io'

//Componentes
import { Button } from '../components/Button'
import { useAuth } from '../hooks/useAuth'
import { FormEvent, useState } from 'react'
import { Modal } from '../components/Modal'

import { database } from '../services/firebase'

export function Home() {

  const [roomCode, setRoomCode] = useState('')

  //Constante com a função de navegação
  const history = useHistory()

  //Funções de autenticação e usuário
  const { signInWithGoogle, user } = useAuth()

  //Definindo o valor de contexto obtido do {TestContext}


  //Função responsável por logar o usuário
  async function handleCreateRoom() {

    //Condição que inicia a função e verifica se o usuário está autenticado
    if (!user) {
      //OBS: dentro de um await, o restante da função
      //só vai executar caso receba uma resposta de sucesso
      await signInWithGoogle()
    }

    //Caso o usuário tenha se autenticado com sucesso, ele é redirecionado
    history.push('/rooms/new')
  }

  async function handleJoinRoom(e: FormEvent) {
    //Previne o formulário de redirecionar a página
    e.preventDefault()
    var roomKey

    //Verifica se o código da sala digitado no formulário está vazio
    if (roomCode.trim() === '') {
      //Se vazio ele não retorna nada e para a função
      return
    }

    //Constante que pega a referencia do Database
    const parsedCode = database.ref('rooms')

    //Função assíncrona, que pega os valores da database referenciada
    await parsedCode.once('value', room => {
      //Constante responsável por armazenar só os valores da sala
      const databaseRoom = room.val()

      //Mapeamento dos índices da sala, que sempre retorna uma chave(key) e um valor(value)
      //Por padrão o Firebase sempre retorna um Json
      //Para ser mapeado é necessário os valores serem um array
      //O provider 'Object' abaixo é responsável em converter o Json para Array
      //A função 'entries' é responsável por retornar a chave(key) e o valor(value) dos objetos
      Object.entries(databaseRoom).map(([key, value]) => {
        //Constante que armazena o valor do Objeto
        const getCode: any = value
        //Condição que verifica so o valor do Objeto é igual ao valor do código da sala
        if (getCode.code === roomCode) {
          //Se a condição for verdadeira, salva o valor da chave(key)
          roomKey = key
        }
      })
    })

    //Constante que pega a referencia do database passando a chave(key)
    const roomRef = await database.ref(`rooms/${roomKey}`).get()


    //Se não existir nenhuma chave no database, abre modal de erro
    if (!roomRef.exists()) {
      const modalId = document.getElementById('modal')
      modalId?.classList.add('open')
      return
    }

    //Se a sala já foi encerrada, abre modal de erro
    if (roomRef.val().endedAt) {
      const modalId = document.getElementById('modal')
      modalId?.classList.add('open')
      return
    }

    //Redireciona o usuário para a sala com a chave(key) associada
    history.push(`/rooms/${roomKey}`)
  }

  const handleClose = () => {
    const modalId = document.getElementById('modal')
    modalId?.classList.remove('open')
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
          {user ? (
            <button className="create-room" onClick={handleCreateRoom}>
              <IoIosCreate size={30} className="create-room-icon" />
              Gerenciar suas salas
            </button>
          ) : (
            <button className="create-room" onClick={handleCreateRoom}>
              <img src={googleIcon} alt="Logo do google" />
              Cria sua sala com o google
            </button>
          )}
          <div className="divider">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={e => setRoomCode(e.target.value)}
              value={roomCode}
            />
            <Button type="submit"> Entrar na sala </Button>
          </form>
        </div>
      </main>

      <Modal
        id="modal"
      // title="Meu modal"
      >
        <div className="modal-delete-question">
          <img src={notFound} alt="" />
          <h2>Sala não encontrada</h2>
          <p>Essa sala pode ter sido deletada ou o código digitado não confere.</p>
          <div>
            <Button onClick={handleClose}>Sair</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}