'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import TaskList from '../../components/TaskList';
import SearchAndFilter from '../../components/SearchAndFilter';
import { taskAPI } from '../../lib/api';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const fetchTasks = async (page = 1, search = '', status = '') => {
    try {
      setIsLoading(true);
      const params = {
        page,
        limit: 10,
        ...(search && { search }),
        ...(status && { status }),
      };
      
      const response = await taskAPI.getTasks(params);
      setTasks(response.data.tasks);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(currentPage, searchTerm, statusFilter);
  }, [currentPage]);

  const handleSearch = (search) => {
    setSearchTerm(search);
    setCurrentPage(1);
    fetchTasks(1, search, statusFilter);
  };

  const handleFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
    fetchTasks(1, searchTerm, status);
  };

  const handleClear = () => {
    setSearchTerm('');
    setStatusFilter('');
    setCurrentPage(1);
    fetchTasks(1, '', '');
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskAPI.updateTask(taskId, { status: newStatus });
      // Refresh the current page
      fetchTasks(currentPage, searchTerm, statusFilter);
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Failed to update task status');
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await taskAPI.deleteTask(taskId);
      // Refresh the current page
      fetchTasks(currentPage, searchTerm, statusFilter);
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            All Tasks
          </h1>
          <p className="text-gray-600">
            Manage and organize your tasks
          </p>
        </div>

        <SearchAndFilter
          onSearch={handleSearch}
          onFilter={handleFilter}
          onClear={handleClear}
          isLoading={isLoading}
        />

        <TaskList
          tasks={tasks}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          isLoading={isLoading}
        />

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrev || isLoading}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {[...Array(pagination.totalPages)].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    disabled={isLoading}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      page === currentPage
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNext || isLoading}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        )}

        {/* Task Count */}
        {pagination && (
          <div className="mt-4 text-center text-sm text-gray-600">
            Showing {tasks.length} of {pagination.totalTasks} tasks
          </div>
        )}
      </div>
    </div>
  );
}
