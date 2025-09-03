'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { taskAPI } from '../lib/api';

export default function HomePage() {
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [statsData, tasksData] = await Promise.all([
          taskAPI.getTaskStats(),
          taskAPI.getTasks({ limit: 5 })
        ]);
        
        setStats(statsData.data);
        setRecentTasks(tasksData.data.tasks);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-warning-600',
      'in-progress': 'text-primary-600',
      completed: 'text-success-600',
    };
    return colors[status] || colors.pending;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Task Manager
          </h1>
          <p className="text-gray-600">
            Organize and track your tasks efficiently
          </p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stats.total}
              </div>
              <div className="text-gray-600">Total Tasks</div>
            </div>
            
            <div className="card text-center">
              <div className="text-3xl font-bold text-warning-600 mb-2">
                {stats.pending}
              </div>
              <div className="text-gray-600">Pending</div>
            </div>
            
            <div className="card text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {stats['in-progress']}
              </div>
              <div className="text-gray-600">In Progress</div>
            </div>
            
            <div className="card text-center">
              <div className="text-3xl font-bold text-success-600 mb-2">
                {stats.completed}
              </div>
              <div className="text-gray-600">Completed</div>
            </div>
          </div>
        )}

        {/* Recent Tasks */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Tasks
            </h2>
            <a
              href="/tasks"
              className="text-primary-600 hover:text-primary-800 font-medium"
            >
              View All Tasks →
            </a>
          </div>

          {recentTasks.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">📝</div>
              <p className="text-gray-600 mb-4">No tasks yet</p>
              <a
                href="/add-task"
                className="btn btn-primary"
              >
                Create Your First Task
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div key={task._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {task.description.length > 100 
                        ? `${task.description.substring(0, 100)}...` 
                        : task.description
                      }
                    </p>
                  </div>
                  <div className="ml-4">
                    <span className={`text-sm font-medium ${getStatusColor(task.status)}`}>
                      {task.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
