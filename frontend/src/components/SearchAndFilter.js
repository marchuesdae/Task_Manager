'use client';

import { useState } from 'react';

export default function SearchAndFilter({ onSearch, onFilter, onClear, isLoading = false }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setStatusFilter(value);
    onFilter(value);
  };

  const handleClear = () => {
    setSearchTerm('');
    setStatusFilter('');
    onClear();
  };

  const hasActiveFilters = searchTerm || statusFilter;

  return (
    <div className="card mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search Tasks
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={handleSearchChange}
            className="input"
            placeholder="Search by title or description..."
            disabled={isLoading}
          />
        </div>

        {/* Status Filter */}
        <div className="sm:w-48">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Status
          </label>
          <select
            id="status"
            value={statusFilter}
            onChange={handleFilterChange}
            className="input"
            disabled={isLoading}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Clear Button */}
        {hasActiveFilters && (
          <div className="flex items-end">
            <button
              onClick={handleClear}
              className="btn btn-secondary"
              disabled={isLoading}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-gray-600">Active filters:</span>
          {searchTerm && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              Search: "{searchTerm}"
            </span>
          )}
          {statusFilter && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              Status: {statusFilter.replace('-', ' ')}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
