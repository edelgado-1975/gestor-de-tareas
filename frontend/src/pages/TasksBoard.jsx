import { useState, useEffect, useContext } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import AuthContext from '../context/AuthContext';
import axiosClient from '../config/axios';
import TaskColumn from '../components/TaskColumn';
import Modal from '../components/Modal';
import styles from './TasksBoard.module.css';

const TasksBoard = () => {
    const [tasks, setTasks] = useState([]);
    const { auth } = useContext(AuthContext);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [descripcion, setDescripcion] = useState('');
    const [fechaVencimiento, setFechaVencimiento] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        if (auth.id) {
            const obtenerTareas = async () => {
                try {
                    const token = localStorage.getItem('token');
                    if (!token) return;
                    const config = { headers: { "x-auth-token": token } };
                    const { data } = await axiosClient.get('/tareas', config);
                    setTasks(data.tareas);
                } catch (error) {
                    toast.error('No se pudieron cargar las tareas');
                }
            };
            obtenerTareas();
        }
    }, [auth]);

    const handleCardClick = (task) => {
        if (task.fechaVencimiento) {
            const date = new Date(task.fechaVencimiento);
            const userTimezoneOffset = date.getTimezoneOffset() * 60000;
            const localDate = new Date(date.getTime() - userTimezoneOffset);
            const formattedDate = localDate.toISOString().slice(0, 16);
            setSelectedTask({...task, fechaVencimiento: formattedDate});
        } else {
            setSelectedTask(task);
        }
        setIsEditModalOpen(true);
    };
    
    const handleCreateTask = (e) => {
        e.preventDefault();
        if (!descripcion || !fechaVencimiento) {
            toast.error('La descripción y la fecha son obligatorias');
            return;
        }
        const token = localStorage.getItem('token');
        const config = { headers: { "x-auth-token": token } };
        toast.promise(
            axiosClient.post('/tareas', { descripcion, fechaVencimiento }, config).then(response => {
                setTasks([...tasks, response.data]);
                setIsCreateModalOpen(false);
                setDescripcion('');
                setFechaVencimiento('');
                return response.data;
            }),
            { loading: 'Creando tarea...', success: '¡Tarea creada con éxito!', error: 'Error al crear la tarea.' }
        );
    };
    
    const handleUpdateTask = (e) => {
        e.preventDefault();
        if (!selectedTask) return;
        const token = localStorage.getItem('token');
        const config = { headers: { "x-auth-token": token } };
        const body = {
            descripcion: selectedTask.descripcion,
            estado: selectedTask.estado,
            fechaVencimiento: selectedTask.fechaVencimiento
        };
        toast.promise(
            axiosClient.put(`/tareas/${selectedTask._id}`, body, config).then(response => {
                setTasks(tasks.map(task => task._id === response.data.tarea._id ? response.data.tarea : task));
                setIsEditModalOpen(false);
                setSelectedTask(null);
                return response.data.tarea;
            }),
            { loading: 'Actualizando tarea...', success: '¡Tarea actualizada con éxito!', error: 'Error al actualizar la tarea.' }
        );
    };

    const handleDeleteTask = (taskId) => {
        toast((t) => (
            <span>
                ¿Eliminar esta tarea?
                <button onClick={() => { performDelete(taskId); toast.dismiss(t.id); }} style={{ marginLeft: '10px', background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px' }}>Sí</button>
                <button onClick={() => toast.dismiss(t.id)} style={{ marginLeft: '10px' }}>No</button>
            </span>
        ), { duration: 5000 });
    };

    const performDelete = async (taskId) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { "x-auth-token": token } };
            await axiosClient.delete(`/tareas/${taskId}`, config);
            setTasks(tasks.filter(task => task._id !== taskId));
            toast.success('Tarea eliminada');
        } catch (error) {
            toast.error('Error al eliminar la tarea');
        }
    };
    
    const onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;
        const taskId = draggableId;
        const newStatus = destination.droppableId;
        const originalTasks = tasks;
        const updatedTasks = tasks.map(task => 
            task._id === taskId ? { ...task, estado: newStatus } : task
        );
        setTasks(updatedTasks);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { "x-auth-token": token } };
            await axiosClient.put(`/tareas/${taskId}`, { estado: newStatus }, config);
            toast.success('Tarea movida');
        } catch (error) {
            toast.error('No se pudo mover la tarea');
            setTasks(originalTasks);
        }
    };

    const pendingTasks = tasks.filter(task => task.estado === 'Pendiente');
    const inProgressTasks = tasks.filter(task => task.estado === 'En Progreso');
    const completedTasks = tasks.filter(task => task.estado === 'Completada');

    return (
        <div className={styles.boardContainer}>
            <div className={styles.header}>
                <h1>Tu Tablero de Tareas</h1>
                <button onClick={() => setIsCreateModalOpen(true)} className={styles.createTaskBtn}>+ Crear Tarea</button>
            </div>
            
            <DragDropContext onDragEnd={onDragEnd}>
                <div className={styles.board}>
                    <TaskColumn title="Pendiente" tasks={pendingTasks} onCardClick={handleCardClick} onDeleteTask={handleDeleteTask} />
                    <TaskColumn title="En Progreso" tasks={inProgressTasks} onCardClick={handleCardClick} onDeleteTask={handleDeleteTask} />
                    <TaskColumn title="Completada" tasks={completedTasks} onCardClick={handleCardClick} onDeleteTask={handleDeleteTask} />
                </div>
            </DragDropContext>

            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
                <h2>Crear Nueva Tarea</h2>
                <form onSubmit={handleCreateTask}>
                    <div><label htmlFor="descripcion">Descripción</label><input id="descripcion" type="text" value={descripcion} onChange={e => setDescripcion(e.target.value)} /></div>
                    <div><label htmlFor="fechaVencimiento">Fecha de Vencimiento</label><input id="fechaVencimiento" type="datetime-local" value={fechaVencimiento} onChange={e => setFechaVencimiento(e.target.value)} /></div>
                    <button type="submit">Guardar Tarea</button>
                </form>
            </Modal>
            {selectedTask && (
                <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                    <h2>Editar Tarea</h2>
                    <form onSubmit={handleUpdateTask}>
                        <div><label htmlFor="edit-descripcion">Descripción</label><input id="edit-descripcion" type="text" value={selectedTask.descripcion} onChange={e => setSelectedTask({ ...selectedTask, descripcion: e.target.value })} /></div>
                        <div><label htmlFor="edit-estado">Estado</label><select id="edit-estado" value={selectedTask.estado} onChange={e => setSelectedTask({ ...selectedTask, estado: e.target.value })}><option value="Pendiente">Pendiente</option><option value="En Progreso">En Progreso</option><option value="Completada">Completada</option></select></div>
                        <div><label htmlFor="edit-fechaVencimiento">Fecha de Vencimiento</label><input id="edit-fechaVencimiento" type="datetime-local" value={selectedTask.fechaVencimiento} onChange={e => setSelectedTask({ ...selectedTask, fechaVencimiento: e.target.value })} /></div>
                        <button type="submit">Guardar Cambios</button>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default TasksBoard;