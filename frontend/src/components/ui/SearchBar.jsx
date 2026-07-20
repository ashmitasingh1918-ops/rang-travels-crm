import React from 'react';

function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="input-group shadow-sm border rounded overflow-hidden">
      <span className="input-group-text bg-white border-0 text-muted">
        <i className="bi bi-search"></i>
      </span>
      <input
        type="text"
        className="form-control border-0 px-2 py-2"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ boxShadow: 'none' }}
      />
      {value && (
        <button 
          className="btn btn-link bg-white border-0 text-muted px-3" 
          type="button"
          onClick={() => onChange("")}
        >
          <i className="bi bi-x-circle-fill"></i>
        </button>
      )}
    </div>
  );
}

export default SearchBar;
