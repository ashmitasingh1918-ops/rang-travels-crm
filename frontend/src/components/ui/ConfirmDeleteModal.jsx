import React from 'react';

function ConfirmDeleteModal({ isOpen, onClose, onConfirm, itemName }) {
  if (!isOpen) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content border-0 shadow-lg rounded-xl">
          <div className="modal-header border-0 bg-danger text-white rounded-top-xl py-3">
            <h5 className="modal-title fw-bold fs-6">
              <i className="bi bi-exclamation-triangle-fill me-2"></i> Confirm Delete
            </h5>
            <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body py-4">
            <p className="mb-0 fs-6 text-dark">
              Are you sure you want to delete <strong className="text-danger">{itemName}</strong>? This action cannot be undone.
            </p>
          </div>
          <div className="modal-footer border-0 bg-light rounded-bottom-xl">
            <button type="button" className="btn btn-secondary px-4 py-2 text-dark border-0 bg-white" onClick={onClose} style={{ boxShadow: 'none' }}>
              Cancel
            </button>
            <button type="button" className="btn btn-danger px-4 py-2" onClick={onConfirm}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;
