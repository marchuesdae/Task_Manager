'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import TaskForm from '../../../components/TaskForm';
import { taskAPI } from '../../../lib/api';

export default function TaskDetailPage({ params }) {
  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setIsLoading(true);
        const response = await taskAPI.getTask(params.id);
        setTask(response.data);
      } catch (error) {
        console.error('Error fetching task:', error);
        alert('Task not found');
        router.push('/tasks');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchTask();
    }
  }, [params.id, router]);

  const handleUpdate = async (formData) => {
    try {
      setIsSaving(true);
      const response = await taskAPI.updateTask(params.id, formData);
      setTask(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskAPI.deleteTask(params.id);
        router.push('/tasks');
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task. Please try again.');
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pending', class: 'status-badge status-pending' },
      'in-progress': { label: 'In Progress', class: 'status-badge status-in-progress' },
      completed: { label: 'Completed', class: 'status-badge status-completed' },
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <span className={config.class}>{config.label}</span>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="card animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-32 bg-gray-200 rounded mb-6"></div>
            <div className="h-6 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Task Not Found</h1>
            <p className="text-gray-600 mb-6">The task you're looking for doesn't exist.</p>
            <button
              onClick={() => router.push('/tasks')}
              className="btn btn-primary"
            >
              Back to Tasks
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isEditing ? (
          <div className="card">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {task.title}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                  {task.updatedAt !== task.createdAt && (
                    <span>Updated: {new Date(task.updatedAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
              <div className="ml-4">
                {getStatusBadge(task.status)}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {task.description}
              </p>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => router.push('/tasks')}
                className="btn btn-secondary"
              >
                Back to Tasks
              </button>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary"
                >
                  Edit Task
                </button>
                <button
                  onClick={handleDelete}
                  className="btn btn-danger"
                >
                  Delete Task
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Edit Task
              </h1>
              <p className="text-gray-600">
                Update your task details
              </p>
            </div>

            <TaskForm
              task={task}
              onSubmit={handleUpdate}
              isLoading={isSaving}
            />

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsEditing(false)}
                className="btn btn-secondary"
                disabled={isSaving}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
