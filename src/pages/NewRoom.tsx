import { FormEvent, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Button } from '../components/Button'

import illustration from '../assets/img/illustration.svg'
import logo from '../assets/img/logo.svg'
import '../styles/auth.scss'
import { useAuth } from '../hooks/useAuth'
import { database } from '../services/firebase'

import firebase from 'firebase';
import { Logout } from '../components/Logout'
import { useRoom } from '../hooks/useRoom'

type FirebaseQuestions = Record<string, {
  authorId: string
  code: string
  title: string
}>

export function NewRoom() {
  //Definindo o valor de contexto obtido do {TestContext}
  const { user } = useAuth()
  const [newRoom, setNewRoom] = useState('')
  const [codeGenerate, setCodeGenerate] = useState('')
  const [selectedFile, setSelectedFile] = useState<any>(null)
  const history = useHistory()
  const { rooms } = useRoom('')

  async function handleCreateRoom(e: FormEvent) {
    e.preventDefault()

    for (var x = 1, code = ''; x < 7; x++) {
      var letter = String.fromCharCode(65 + Math.floor(Math.random() * 26))
      var number = Math.floor(Math.random() * 9)
      code += number % 2 === 0 ? letter : number
      setCodeGenerate(code)
    }

    if (newRoom.trim() === '') {
      return
    }

    const roomRef = database.ref('rooms')

    roomRef.once('child_added', (child, key) => {
      if (child.val().code === codeGenerate) {
        for (var x = 1, code = ''; x < 7; x++) {
          var letter = String.fromCharCode(65 + Math.floor(Math.random() * 26))
          var number = Math.floor(Math.random() * 9)
          code += number % 3 === 0 ? letter : number
          setCodeGenerate(code)
        }
      }
    })

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      username: user?.name,
      authorId: user?.id,
      code: code
    })

    const storageRef = firebase.storage().ref();
    // Create a reference to 'images/mountains.jpg'
    storageRef.child(`images/${code}-header.jpg`).put(selectedFile)
      .then(result => {
        // const path = `https://firebasestorage.googleapis.com/v0/b/letmeask-fcce4.appspot.com/o/images%2F${user?.id}-header.jpg`
        console.log(result.metadata)
      })

    history.push(`/rooms/${firebaseRoom.key}`)
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
          {/* <img src={logo} alt="Letmeask" /> */}
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <label className="custom-file-upload">
              <input
                type="file"
                placeholder="Escolha uma capa para a sala"
                onChange={(e: any) => setSelectedFile(e.target.files[0])}
              />
              Selecionar imagem de capa
            </label>
            <input
              type="text"
              placeholder="Nome da sala"
              onChange={e => setNewRoom(e.target.value)}
              value={newRoom}
            />
            <Button type="submit"> Criar sala </Button>
            {/* <Button onClick={newRoomGenerate}> {codeGenerate} </Button> */}
          </form>
          <p>Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link></p>
        </div>

        <div className="rooms-content">
          {rooms.length > 0 ? (<h2>Minhas salas</h2>) : ''}
          {rooms.map((result: any) => {
            if (result !== undefined) {
              return (
                <a href={`/admin/rooms/${result.id}`}>
                  <div className="my-rooms" key={result.key}>
                    <span>{result.title}</span>
                    <p><strong>#</strong>{result.code}</p>
                  </div>
                </a>
              )
            }
          })}
        </div>

      </main>

      {user ? (
        <Logout />
      ) : (
        <div></div>
      )}
    </div>
  )
}