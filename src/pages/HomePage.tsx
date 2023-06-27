import React, { useEffect, useState } from 'react';
import { Card, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

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

  return (
    <div>
      <Button variant="primary" onClick={handleNewTask}>
        Criar Nova Task
      </Button>

      <div className="card-list">
        {tasks.map((task) => (
          <Card key={task.id} style={{ width: '18rem', margin: '10px' }}>
            <Card.Body>
              <Card.Title>{task.title}</Card.Title>
              <Card.Text>{task.description}</Card.Text>
              <Button variant="primary" onClick={() => handleEditTask(task)}>
                Editar
              </Button>
              <Button variant="danger" onClick={() => handleDeleteTask(task.id)}>
                Excluir
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <div className="modal-overlay" onClick={handleCloseModal}></div>
        <div className="modal-container">
          <Modal.Header closeButton>
            <Modal.Title>{selectedTask ? 'Editar Task' : 'Criar Nova Task'}</Modal.Title>
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
                <option value="pending">Pendente</option>
                <option value="completed">Concluído</option>
              </Form.Control>
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

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }

        .modal-container {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          z-index: 1000;
        }
        .card-list {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            margin: 20px;
          }
      `}</style>
    </div>
  );
};

export default HomePage;
