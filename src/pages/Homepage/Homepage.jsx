import { useContext, useState } from 'react';
import axios from 'axios';
import style from "./Homepage.module.css";
import { LuMail } from "react-icons/lu";
import { IoMdLock } from "react-icons/io";
import { FaUserAlt } from "react-icons/fa";
import { UserContext } from '../../App';
import { useNavigate } from 'react-router-dom';

function Homepage() {
    const navigate = useNavigate()

    const { BASE_USER_URL, token } = useContext(UserContext)

    const [isLogin, setIsLogin] = useState(true)

    const [isLoading, setIsLoading] = useState(false)

    const [inputValue, setInputValue] = useState({ email: "", password: "" })

    const [error, setError] = useState([])

    const fetchLogin = async () => {
        try {
            const response = await axios.post(BASE_USER_URL + '/login', { ...inputValue });
            if (response) {
                const data = await response.data;
                localStorage.setItem('tasktracker-authtoken', data.AuthToken)
                navigate('/dashboard')
            }
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    const fetchRegister = async () => {
        try {
            const response = await axios.post(BASE_USER_URL + '/register', { ...inputValue }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response) {
                const data = await response.data;
                console.log(data);
            }
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    const handleInput = (e) => {
        const fieldName = e.target.name
        const fieldValue = e.target.value
        setInputValue(prevValue => ({
            ...prevValue, [fieldName]: fieldValue
        }))
    }

    // User Login Input Validation
    const validateLoginInput = () => {
        const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        let err = {}

        if (inputValue.email === "" && inputValue.password === "") {
            err.both = "Email and Password Required"
        } else {
            if (inputValue.email === "") {
                err.email = "Email Required"
            }
            if (inputValue.name === "") {
                err.name = "Name Required"
            }
            else if (!inputValue.email.match(regex)) {
                err.email = "Email Is Invalid"
            }
            if (inputValue.password === "") {
                err.password = "Password Required"
            }
        }
        setError(Object.values(err))
        return Object.keys(err).length < 1
    }

    const handleLogin = async () => {
        let isValid = validateLoginInput()

        if (isValid) {
            setIsLoading(true)
            try {
                if (isLogin) {
                    await fetchLogin()
                } else {
                    await fetchRegister()
                }
            } finally {
                setIsLoading(false)
            }
        }
    }

    return (
        <div className={style.Homepage}>
            <div className={style.AuthPage}>

                <div className={style.AuthPagecontainer}>

                    <div className={style.headingBox}>
                        <h2>Task Tracker...</h2>
                    </div>

                    <div className={style.AuthPageLoginBox}>

                        <div className={style.email}>
                            <LuMail size={22} />
                            <input type="email" name="email" value={inputValue.email} onChange={handleInput} placeholder='Email' />
                        </div>

                        {!isLogin &&
                            <div className={style.name}>
                                <FaUserAlt size={21} />
                                <input type="name" name='username' value={inputValue.username} onChange={handleInput} placeholder='Name' />
                            </div>}

                        <div className={style.password}>
                            <IoMdLock size={25} />
                            <input type="password" name='password' value={inputValue.password} onChange={handleInput} placeholder='Password' />
                        </div>

                        {error && <label className={style.errorMsg}>{error.length == 2 ? (error[0] + " & " + error[1]) : error}</label>}

                        <p>Dont have an account? <span onClick={() => {
                            isLogin ? setIsLogin(false) : setIsLogin(true)
                        }}>{!isLogin ? "Log in" : "Sign Up"}</span></p>

                        <div className={style.loginButton}>
                            <button className={style.loginBtn} onClick={handleLogin} disabled={isLoading}>{isLoading ? "Loading..." : (isLogin ? "Log in" : "Sign Up")}</button>
                        </div>

                    </div>
                </div>
            </div>
        </div >
    )
}

export default Homepage;