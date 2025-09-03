'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TaskList({ tasks = [], onDelete, onStatusChange, isLoading = false }) {
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pending', class: 'status-badge status-pending' },
      'in-progress': { label: 'In Progress', class: 'status-badge status-in-progress' },
      completed: { label: 'Completed', class: 'status-badge status-completed' },
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <span className={config.class}>{config.label}</span>;
  };

  const handleStatusChange = (taskId, newStatus) => {
    if (onStatusChange) {
      onStatusChange(taskId, newStatus);
    }
  };

  const handleDeleteClick = (taskId) => {
    setDeleteConfirm(taskId);
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirm && onDelete) {
      onDelete(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-20"></div>
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📝</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
        <p className="text-gray-500 mb-6">Get started by creating your first task!</p>
        <Link href="/add-task" className="btn btn-primary">
          Create Task
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task._id} className="card hover:shadow-lg transition-shadow duration-200">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {task.title}
              </h3>
              <p className="text-gray-600 mb-3">{task.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
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

          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task._id, e.target.value)}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={isLoading}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="flex space-x-2">
              <Link
                href={`/tasks/${task._id}`}
                className="text-primary-600 hover:text-primary-800 text-sm font-medium"
              >
                View Details
              </Link>
              <button
                onClick={() => handleDeleteClick(task._id)}
                className="text-danger-600 hover:text-danger-800 text-sm font-medium"
                disabled={isLoading}
              >
                Delete
              </button>
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          {deleteConfirm === task._id && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Confirm Delete
                </h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this task? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={handleDeleteCancel}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
