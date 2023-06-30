import React, { useEffect, useState } from 'react';
import { Card, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import './styles.css';
import logo from '../pages/background2.jpg'

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
}

const HomePage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState<Task>({
    id: 0,
    title: '',
    description: '',
    status: 'pending',
  });
  const [backgroundImage, setBackgroundImage] = useState<string>('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get<Task[]>('http://localhost:3000/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNewTask = () => {
    setShowModal(true);
    setSelectedTask(null);
    setNewTask({ id: 0, title: '', description: '', status: 'pending' });
  };

  const handleEditTask = (task: Task) => {
    setShowModal(true);
    setSelectedTask(task);
    setNewTask({ ...task });
  };

  const handleSaveTask = async () => {
    try {
      if (selectedTask) {
        await axios.put(`http://localhost:3000/tasks/${selectedTask.id}`, newTask);
      } else {
        await axios.post('http://localhost:3000/tasks', newTask);
      }
      fetchTasks();
      handleCloseModal();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await axios.delete(`http://localhost:3000/tasks/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const selectRandomBackground = () => {
    const backgrounds = ['background-image1.jpg', 'background-image2.jpg', 'background-image3.jpg'];
    const randomIndex = Math.floor(Math.random() * backgrounds.length);
    const randomBackground = backgrounds[randomIndex];
    setBackgroundImage(randomBackground);
  };

  return (
    <div className='main'>
      <div className='imgDiv'>
        <img src={logo} className='img'/>
      </div>
      <div className='buttonDiv'>
        <Button variant="primary" onClick={handleNewTask} className='button'>
          Criar Nova Task
        </Button>
      </div>

      <div className="card-list">
        {tasks.map((task) => (
          <Card key={task.id} className={`card ${backgroundImage ? 'custom-background' : ''}`}>
            <div>
              <div className='statusColorDiv'>
                <div className='status'>{task.status}</div>
                <div className={`statusColor ${task.status.toLowerCase()}`}></div>
              </div>

              <div className='title'>{task.title}</div>
              <div className='text'>{task.description}</div>
              <div className='button'>
                <Button variant="primary" onClick={() => handleEditTask(task)}>
                  Editar
                </Button>
                <Button variant="danger" onClick={() => handleDeleteTask(task.id)}>
                  Excluir
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <div className="modal-overlay" onClick={handleCloseModal}></div>
        <div className="modal-container">
          <Modal.Header closeButton>
            <Modal.Title>{selectedTask ? 'Editar Task' : 'Criar Nova Task'}</Modal.Title>
            <Button variant="secondary" onClick={handleCloseModal}>
              Sair
            </Button>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="formTitle">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o título"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite a descrição"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                value={newTask.status}
                onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
              >
                <option value="Pending">Pendente</option>
                <option value="Completed">Concluído</option>
                <option value="Doing">Fazendo</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formBackground">
              <Form.Label>Plano de Fundo</Form.Label>
              <div className="background-images">
                <img src="background1.jpg" alt="Background 1" onClick={() => setBackgroundImage('background1.jpg')} />
                <img src="background2.jpg" alt="Background 2" onClick={() => setBackgroundImage('background2.jpg')} />
                <img src="background3.jpg" alt="Background 3" onClick={() => setBackgroundImage('background3.jpg')} />
              </div>
              <Button variant="primary" onClick={selectRandomBackground}>
                Selecionar Aleatoriamente
              </Button>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSaveTask}>
              Salvar
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </div>
  );
};

export default HomePage;
