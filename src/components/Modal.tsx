import { ReactNode } from "react"
// import { AiFillCloseCircle } from 'react-icons/ai'
// import { Button } from '../components/Button'
import '../styles/modal.scss'

type ModalProps = {
  children?: ReactNode
  id: string
  title?: string
}

export function Modal(props: ModalProps) {
  
  // const handleClose = () => {
  //   const modalId = document.getElementById(props.id)
  //   modalId?.classList.remove('open')
  // }



  return (
    <div className={'modal'} id={props.id}>
      <div className="container-modal">
        
        {/* <div className="header-modal">
          <h1>{props.title}</h1>
          <AiFillCloseCircle className="icon" onClick={handleClose} />
        </div> */}

        <div className="content-modal">
          {props.children}
        </div>

        {/* <div className="footer-modal">
          <Button onClick={handleClose}>Fechar</Button>
        </div> */}
      </div>
    </div>
  )
}