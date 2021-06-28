import { useEffect, useState } from "react"
import { database } from "../services/firebase"
import { useAuth } from "./useAuth"

type QuestionType = {
  id: string
  author: {
    name: string
    avatar: string
  }
  content: string
  isHighLighted: boolean
  isAnswered: boolean
  answer: string
  likeCount: number
  likeId: string | undefined
}

type RoomType = {
  author: {
    authorId: string
    title: string
    code: string
  }
}

type FirebaseQuestions = Record<string, {
  author: {
    name: string
    avatar: string
  }
  content: string
  isHighLighted: boolean
  isAnswered: boolean
  answer: string
  likes: Record<string, {
    authorId: string
  }>
}>

export function useRoom(roomId: string) {
  const { user } = useAuth()
  const [questions, setQuestions] = useState<QuestionType[]>([])
  const [rooms, setRooms] = useState<any>([])
  const [title, setTitle] = useState('')
  const [code, setCode] = useState('')
  const [authorId, setAuthorId] = useState('')

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`)

    roomRef.on('value', room => {
      const databaseRoom = room.val()
      const firebaseQuestions = databaseRoom.questions as FirebaseQuestions ?? {}
      setCode(room.val().code)
      setAuthorId(room.val().authorId)

      const parsedQuestion = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighLighted: value.isHighLighted,
          isAnswered: value.isAnswered,
          answer: value.answer,
          likeCount: Object.values(value.likes ?? {}).length,
          likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
          //A função '.some' retorna um boolean como resposta
          // hasLiked: Object.values(value.likes ?? {}).some(like => like.authorId === user?.id)
        }
      })

      setTitle(databaseRoom.title)
      setQuestions(parsedQuestion)
    })

    return () => {
      roomRef.off('value')
    }
  }, [roomId, user?.id])

  useEffect(() => {
    const data = database.ref(`rooms`)
    
    data.on('value', room => {
      const databaseRoom = room.val()
      const firebaseQuestions = databaseRoom as RoomType ?? {}

      const parsedRoom = Object.entries(firebaseQuestions).map(([key, value]) => {
        if (value.authorId === user?.id) {
          return {
            id: key,
            title: value.title,
            code: value.code
          }
        }
      })
      setRooms(parsedRoom)
    })
  }, [user?.id])

  return { questions, title, code, authorId, rooms }
}