import { useContext, useEffect, useState } from "react";
import style from "./SearchSort.module.css"
import axios from "axios";
import { UserContext } from "../../App";

function SearchSort({ tasks, setTasks, setSearchedTasks }) {
    const { BASE_USER_URL, BASE_TASK_URL, token, setToken, } = useContext(UserContext)

    const [sortValue, setSortValue] = useState({}) // sort value here
    const [searchValue, setSearchValue] = useState("") // Search input value here

    //fetch filter
    const fetchFilteredTasks = async () => {
        try {
            const response = await axios.get(BASE_TASK_URL + '/', {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: sortValue
            })
            if (response) {
                const data = response.data
                setTasks(data)
            }
        } catch (error) {
            console.log(`Error in filter tasks:${error}`);
        }
    }

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        if (name == "searchValue") {
            setSearchValue(value)
            const filteredTasks = tasks.filter(task =>
                task.title.toLowerCase().includes(value.toLowerCase())
            )
            setSearchedTasks(filteredTasks)
        } else {
            setSortValue((prevValue) => ({ ...prevValue, [name]: value }))
        }
    }

    useEffect(() => {
        fetchFilteredTasks()
    }, [sortValue,])

    return (
        <div className={style.searchSort}>

            <div className={style.search}>
                <label htmlFor="searchValue">Search:</label>
                <input type="text" name="searchValue" id="searchValue" onChange={handleFilterChange} placeholder="Enter Search...." />
            </div>

            <div className={style.complete}>
                <label htmlFor="isCompleted">Completed Status:</label>
                <select name="isCompleted" id="isCompleted" onChange={handleFilterChange}>
                    <option disabled selected>Select</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                </select>
            </div>

            <div className={style.sort}>
                <label htmlFor="priority">Priority:</label>
                <select name="priority" id="priority" onChange={handleFilterChange}>
                    <option disabled selected>Select</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>
            <div className={style.clearBtn}>
                <button onClick={() => setSortValue({})} >Clear</button>
            </div>
        </div>
    )
}

export default SearchSort;