import { Toaster } from 'react-hot-toast';

import { useHistory, useParams } from 'react-router-dom'

import logo from '../assets/img/logo.svg'
import deleteImage from '../assets/img/delete.svg'
import check from '../assets/img/check.svg'
import answerImage from '../assets/img/answer.svg'
import deleteImageQuestion from '../assets/img/delete-question.svg'
import questionsImage from '../assets/img/questions.svg'
import loadingImage from '../assets/img/loading.svg'


import { Button } from '../components/Button'
import { RoomCode } from '../components/roomCode'
import { useAuth } from '../hooks/useAuth'
// import { database } from '../services/firebase'

import '../styles/room.scss'

import { Question } from '../components/question'
import { useRoom } from '../hooks/useRoom'
import { useEffect, useState } from 'react'
import { Modal } from '../components/Modal'
import { database } from '../services/firebase';
import { Logout } from '../components/Logout';

type RoomParams = {
  id: string
}

export function AdminRoom() {
  const history = useHistory()
  const [idQuestion, setIdQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const params = useParams<RoomParams>()
  const { user } = useAuth()
  const roomId = params.id
  const { title, questions, code, authorId } = useRoom(roomId)

  const handleClose = (id: string) => {
    const modalId = document.getElementById(id)
    modalId?.classList.remove('open')
    console.log(id)
  }

  function handOpenModal(id: string, argument: string) {
    const modalId = document.getElementById(id)
    modalId?.classList.add('open')
    setIdQuestion(argument)
  }

  async function handDeleteQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    handleClose('modal-delete-question')
  }

  async function handEndRoom(roomId: string) {
    await database.ref(`rooms/${roomId}/`).update({
      endedAt: new Date()
    })
    const modalId = document.getElementById('modal-delete-room')
    modalId?.classList.remove('open')

    history.push('/')
  }

  async function handleCheckAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
      answer: answer
    })
    handleClose('modal-answer')
  }

  async function handleHighlight(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighLighted: true
    })
  }

  if (user?.id === authorId) {
    return (
      <div id="page-room">
        <header>
          <div className="content">
            <img src={logo} alt="" />
            <div>
              <RoomCode code={code} />
              <Button isOutlined onClick={() => handOpenModal('modal-delete-room', roomId)}>Encerrar sala</Button>
            </div>
          </div>
        </header>
  
        <main>
          <div className="room-title">
            <h1>Sala: {title}</h1>
            {questions.length > 0 && <span>{questions.length} Pergunta(s)</span>}
          </div>
  
          <div className="question-list">
            {questions.map(question => {
              return (
                <Question
                  key={question.id}
                  content={question.content}
                  author={question.author}
                  isHighLighted={question.isHighLighted}
                  isAnswered={question.isAnswered}
                  answer={question.answer}
                >
                  {!question.isAnswered && (
                    <>
                    <button
                    type="button"
                    onClick={() => handOpenModal('modal-answer', question.id)}
                  >
                    <img src={check} alt="Marcar como respondida" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleHighlight(question.id)}
                  >
                    <img src={answerImage} alt="Dar destaque" />
                  </button>
                  </>
                  )}
                  <button
                    type="button"
                    onClick={() => handOpenModal('modal-delete-question', question.id)}
                  >
                    <img src={deleteImage} alt="Remover pergunta" />
                  </button>
                </Question>
              )
            })}
          </div>
  
        </main>
        <Toaster />
  
        <Modal
          id="modal-delete-question"
        // title="Meu modal"
        >
          <div className="modal-question">
            <img src={deleteImageQuestion} alt="" />
            <h2>Excluir pergunta</h2>
            <p>Tem certeza que deseja excluir essa pergunta?</p>
            <div>
              <Button onClick={() => handleClose('modal-delete-question')}>Cancelar</Button>
              <Button onClick={() => handDeleteQuestion(idQuestion)}>Sim, excluir</Button>
            </div>
          </div>
        </Modal>
  
        <Modal
          id="modal-delete-room"
        // title="Meu modal"
        >
          <div className="modal-question">
            <img src={deleteImageQuestion} alt="" />
            <h2>Xablau</h2>
            <p>Tem certeza que deseja excluir essa pergunta?</p>
            <div>
              <Button onClick={() => handleClose('modal-delete-room')}>Cancelar</Button>
              <Button onClick={() => handEndRoom(idQuestion)}>Sim, excluir</Button>
            </div>
          </div>
        </Modal>
  
        <Modal
          id="modal-answer"
        // title="Meu modal"
        >
          <div className="modal-question">
            <img src={questionsImage} alt="" />
            <form>
              <textarea 
                onChange={(e) => setAnswer(e.target.value)}
              />
            </form>
            <div>
              <Button onClick={() => handleClose('modal-answer')}>Cancelar</Button>
              <Button onClick={() => handleCheckAnswered(idQuestion)}>Responder</Button>
            </div>
          </div>
        </Modal>
            
        <Logout />

      </div>
    )
  } else {
    return (
      <div className="loading">
        <img src={loadingImage} alt="Error" />
      </div>
    )
  }

}