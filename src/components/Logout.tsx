import { RiLogoutBoxFill } from 'react-icons/ri'
import { firebase } from "../services/firebase"
import '../styles/logout.scss'

export function Logout() {

  async function logoutUser() {
    await firebase.auth().signOut()
    window.location.reload()
  }

  return (
    <>
      <RiLogoutBoxFill size={35} className="logout-icon" onClick={logoutUser} />
    </>
  )
}