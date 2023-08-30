import { useContext, useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import style from "./Dashboard.module.css";
import Task from "../../components/Task/Task";
import SearchSort from "../../components/SearchSort/SearchSort";
import { UserContext } from "../../App";
import axios from "axios"
import jwt_decode from "jwt-decode"

function Dashboard() {

    const { BASE_TASK_URL, token } = useContext(UserContext)
    const [isLoading, setIsLoading] = useState(false);
    const [tasks, setTasks] = useState([]) // Tasks store here
    const [searchedTasks, setSearchedTasks] = useState([]) // here keyword tasks are saved
    const [isEdit, setIsEdit] = useState(false)

    const [inputTaskValue, setInputTaskValue] = useState({ title: "", description: "", priority: "", date: "" }) // add task input value  here

    const decode = token ? jwt_decode(token) : "";

    const userId = decode.isUserValid._id // userid here

    // For fetching tasks
    const fetchTasks = async () => {
        try {
            setIsLoading(true)
            const response = await axios.get(BASE_TASK_URL + '/', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response) {
                const data = await response.data
                setIsEdit(false)
                setTasks(data)
            }
        } catch (error) {
            console.log(`Error in fetch Tasks: ${error}`)
        } finally {
            setIsLoading(false)
        }
    }


    const fetchAddTask = async () => {
        try {
            let response
            if (isEdit) {
                response = await axios.patch(BASE_TASK_URL + '/update/' + inputTaskValue._id, {
                    ...inputTaskValue
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            }
            else if (!isEdit) {
                response = axios.post(BASE_TASK_URL + '/add', {
                    userId,
                    ...inputTaskValue
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            }
            if (response) {
                fetchTasks()
            }
        } catch (error) {
            console.log(`Error Adding Task:${error}`)
        }
    }

    const handleInput = (e) => {
        const fieldName = e.target.name
        const fieldValue = e.target.value
        setInputTaskValue(prevValue => ({
            ...prevValue, [fieldName]: fieldValue
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        await fetchAddTask()
        setInputTaskValue({ title: "", description: "", priority: "", date: "" })
    }



    return (
        <div className={style.Dashboard}>
            <Header />

            <div className={style.mainContainer}>

                <form action="" onSubmit={handleSubmit} className={style.taskForm}>

                    <div className={style.task}>
                        <label htmlFor="">Enter Title:</label>
                        <input type="text" name="title" value={inputTaskValue.title} placeholder="Title..." onChange={handleInput} />
                    </div>

                    <div className={style.task}>
                        <label htmlFor="">Enter Description:</label>
                        <input type="text" name="description" value={inputTaskValue.description} placeholder="Description..." onChange={handleInput} />
                    </div>

                    <div className={style.priority}>
                        <label htmlFor="priority">Priority Level:</label>
                        <select name="priority" id="priority" onChange={handleInput} value={inputTaskValue.priority}>
                            <option>Select Priority</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                    <div className={style.date}>
                        <label htmlFor="date">Date:</label>
                        <input type="date" name="date" value={inputTaskValue.date} onChange={handleInput} />
                    </div>

                    <div className={style.submitBtn}>
                        <button type="submit">{isEdit ? "Update" : "Add"} Task</button>
                    </div>

                </form>

                <div className={style.displayTask}>

                    <SearchSort tasks={tasks} setTasks={setTasks} setSearchedTasks={setSearchedTasks} />

                    <Task tasks={searchedTasks.length > 0 ? searchedTasks : tasks} fetchTasks={fetchTasks} inputTaskValue={inputTaskValue} setInputTaskValue={setInputTaskValue} fetchAddTask={fetchAddTask} setIsEdit={setIsEdit} isLoading={isLoading} setIsLoading={setIsLoading} />

                </div>
            </div>
        </div>
    )
}

export default Dashboard;