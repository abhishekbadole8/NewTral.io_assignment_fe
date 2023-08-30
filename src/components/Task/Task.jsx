import { useContext, useEffect, useState } from "react";
import style from "./Task.module.css";
import axios from "axios";
import { UserContext } from "../../App";

function Task({ tasks, setInputTaskValue, fetchTasks, setIsEdit, isLoading }) {

    const { BASE_TASK_URL, token, } = useContext(UserContext)

    const handleUpdate = (task) => {
        setInputTaskValue(task)
        setIsEdit(true)
    }

    // fetch update checkbox
    const fetchUpdateCheck = async (taskId, isCompleted) => {
        try {
            const response = await axios.patch(BASE_TASK_URL + '/update/' + taskId, { isCompleted: !isCompleted }, { headers: { Authorization: `Bearer ${token}` } })
            if (response) {
                fetchTasks()
            }
        } catch (error) {
            console.log(`Error in updating check:${error}`)
        }
    }

    //form delete task
    const fetchDeleteTask = async (storyId) => {
        try {
            const response = await axios.delete(BASE_TASK_URL + '/delete/' + storyId, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response) {
                fetchTasks()
            }
        } catch (error) {
            console.log(`Error in Deleting task:${error}`);
        }
    }

    useEffect(() => {
        fetchTasks()
    }, [])

    return (
        <div className={style.task}>
            <table className={style.tableTask}>
                <thead>
                    <tr>
                        <th>Check</th>
                        <th>Priority</th>
                        <th>Title</th>
                        <th>description</th>
                        <th>Date</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>

                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={7}>Loading tasks...</td>
                        </tr>
                    ) : (
                        tasks.map((task) => {

                            const { _id, title, description, date, priority, isCompleted } = task
                            const formattedDate = new Date(date).toISOString().split('T')[0]

                            return (
                                <tr key={_id} className={isCompleted ? style.complete : style.notComplete} >
                                    <td>
                                        <input type="checkbox" name="isComplete" value={!isCompleted} checked={isCompleted}
                                            onChange={(e) => {
                                                setIsEdit(true)
                                                fetchUpdateCheck(_id, isCompleted)
                                            }} />
                                    </td>
                                    <td>{priority}</td>
                                    <td>{title}</td>
                                    <td>{description}.</td>
                                    <td>{formattedDate}</td>
                                    <td><button onClick={() => handleUpdate(task)}>Edit</button></td>
                                    <td><button onClick={() => fetchDeleteTask(_id)}>Delete</button></td>
                                </tr>
                            )
                        }))}

                </tbody>
            </table>
        </div>
    )
}
export default Task;