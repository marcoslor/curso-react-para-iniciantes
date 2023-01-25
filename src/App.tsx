
import { ChangeEvent, ChangeEventHandler, useState } from 'react';
import { Container } from 'react-bootstrap';
import styled from 'styled-components'
import './App.css'

const Nav = styled.nav`
    background-color: rgba(0, 0, 0, 0.3);
    color: #fff;
    padding: 0.8rem 0.5rem;
    font-size: 1.5rem;
    font-weight: 600;
`
const MainDiv = styled.div`
    background-color: #0079bf;
    min-height: 100vh;
`
const CardGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    grid-gap: 0.6rem;
`

const StatusColumnsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 0.6rem;
`

const StatusColumn = styled.div`
    display: grid;
    grid-template-rows: 0fr;
    grid-gap: 0.6rem;
`

const Status = {
    Pending: 'Pending',
    InProgress: 'In Progress',
    Done: 'Done'
} as const;

type Status = typeof Status[keyof typeof Status];

interface Task {
    id: number,
    title: string,
    status: Status
}

const statuses = Object.values(Status)

const getUUID = () => Math.floor(Math.random() * 1000000)

const TaskCard = ({ task, updateTask }: { task: Task, updateTask: (task: Task) => void}) => {
    const [isEditing, setIsEditing] = useState(false)
    const [title, setTitle] = useState(task.title)

    const onTitleClick = () => {
        setIsEditing(true)
    }

    const onStatusChange = (e) => {
        updateTask({ ...task, status: e.target.value as Status })
    }

    const onTitleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
    }

    const onSaveClick = () => {
        setIsEditing(false)
        updateTask({ ...task, title })
    }
    return (
        <div className='card'>
            <div className='card-body'>
                {isEditing &&
                    <>
                        <input type='text' className='form-control mb-2' value={title} onChange={onTitleInputChange} />
                        <div className='d-flex mb-2'>
                            <button className='btn btn-success me-2' onClick={onSaveClick}>Save</button>
                            <button className='btn btn-danger' onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    </> || <h5 className='card-title' onClick={onTitleClick}>{task.title}</h5>
                }
                <select className='form-control' onChange={onStatusChange} defaultValue={task.status}>
                    {statuses.map(status => (
                        <option value={status} key={status}>{status}</option>
                    ))}
                </select>
            </div>
        </div>
    )
}

const App = () => {
    const [tasks, setTasks] = useState<Task[]>([
        { id: getUUID(), title: 'Task 1', status: Status.Pending },
        { id: getUUID(), title: 'Task 2', status: Status.InProgress },
        { id: getUUID(), title: 'Task 3', status: Status.Done },
    ])
    const tasksByStatus = statuses.reduce((acc, status) => {
        acc[status] = tasks.filter(task => task.status === status)
        return acc
    }, {} as { [key in Status]: Task[] })

    const updateTask = (updatedTask: Task) => {
        const updatedTasks = tasks.map(t => t.id === updatedTask.id ? updatedTask : t)
        setTasks(updatedTasks)
    }

    const onAddTaskClick = () => {
        const newTask = {
            id: getUUID(),
            title: 'New Task',
            status: Status.Pending
        }
        setTasks([...tasks, newTask])
    }
    return (
        <MainDiv>
            <Nav>React Kanban</Nav>
            <main>
                <Container>
                    <StatusColumnsGrid className='mt-4'>
                        {statuses.map(status => (
                            <StatusColumn key={status}>
                                <h3 className='p-2 text-light'>{status}</h3>
                                <div className="p-2" style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}>
                                    <CardGrid>
                                        {tasksByStatus[status].map(task => (
                                            <TaskCard task={task} updateTask={updateTask} key={task.id}/>
                                        ))}
                                    </CardGrid>
                                </div>
                            </StatusColumn>
                        ))}
                    </StatusColumnsGrid>
                    <div className="mt-4">
                        <button className="btn btn-success" onClick={onAddTaskClick}>Add Task</button>
                    </div>
                </Container>
            </main>
        </MainDiv>
    )
}

export default App