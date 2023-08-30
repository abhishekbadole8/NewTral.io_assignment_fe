import { useContext, useState } from "react";
import style from "./Header.module.css"
import { UserContext } from "../../App";
import { useNavigate } from "react-router-dom";

function Header() {
const navigate=useNavigate()
    const { setToken } = useContext(UserContext)

    return (
        <div className={style.header}>

            <div className={style.logo} >
                <h4>Task-Tracker</h4>
            </div>

            <div className={style.logoutContainer}>
                <button onClick={()=>{
                    setToken("")
                    localStorage.removeItem('tasktracker-authtoken')
                    navigate('/homepage')
                }}>Logout</button>
            </div>

        </div>
    )
}

export default Header;