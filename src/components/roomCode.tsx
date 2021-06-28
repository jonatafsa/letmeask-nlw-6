import toast, { Toaster } from 'react-hot-toast';
import copy from '../assets/img/copy.svg'

import '../styles/room-code.scss'

type RoomCodeProps = {
  code: string
}
 
export function RoomCode(props: RoomCodeProps) {

  function codeRoomCodeToClipboard() {
    navigator.clipboard.writeText(props.code)
    toast.success('Código Copiado!')
  }

  return (
    <button className="room-code" onClick={codeRoomCodeToClipboard}>
      <div>
        <img src={copy} alt="Copy from code" />
        <Toaster />
      </div>
      <span>Sala #{props.code}</span>
    </button>
  )
}