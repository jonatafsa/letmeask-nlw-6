
import { ReactNode } from 'react'
import '../styles/question.scss'

type QuestionProps = {
  content: string
  author: {
    name: string
    avatar: string
  }
  children?: ReactNode
  isAnswered?: boolean
  isHighLighted?: boolean
  answer?: string
}

export function Question({
  content,
  author,
  isAnswered = false,
  isHighLighted = false,
  answer,
  children
}: QuestionProps) {
  return (
    <div id="question-answer">
      <div
        className={`question ${isAnswered ? 'answered' : ''} ${isHighLighted && !isAnswered ? 'highlighted' : ''}`}
      >
        <p>{content}</p>
        <footer>
          <div className="user-info">
            <img src={author.avatar} alt="{props.author.name}" />
            <span>{author.name}</span>
          </div>
          <div>{children}</div>
        </footer>
      </div>
      {isAnswered && (
        <div className="answer">
          <h2>Resposta:</h2>
          <p>{answer}</p>
        </div>
      )}
    </div>
  )
}