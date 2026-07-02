import React, { useEffect, useState } from 'react';
import tableService from '../../services/tableService';

const TableManagementPage = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTable, setCurrentTable] = useState(null);
  
  const [formData, setFormData] = useState({
    tableNumber: '',
    seatingCapacity: '',
    active: true
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    setLoading(true);
    try {
      const res = await tableService.getAllTables();
      if (res.success) {
        setTables(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (table = null) => {
    setFormError('');
    if (table) {
      setCurrentTable(table);
      setFormData({
        tableNumber: table.tableNumber,
        seatingCapacity: table.seatingCapacity,
        active: table.active
      });
    } else {
      setCurrentTable(null);
      const nextNumber = tables.length > 0 ? Math.max(...tables.map(t => t.tableNumber)) + 1 : 1;
      setFormData({
        tableNumber: nextNumber,
        seatingCapacity: 4,
        active: true
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentTable(null);
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    try {
      const payload = {
        ...formData,
        tableNumber: Number(formData.tableNumber),
        seatingCapacity: Number(formData.seatingCapacity)
      };

      if (currentTable) {
        await tableService.updateTable(currentTable._id, payload);
      } else {
        await tableService.createTable(payload);
      }
      
      await fetchTables();
      closeModal();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save table');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this table?')) return;
    try {
      await tableService.deleteTable(id);
      await fetchTables();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete table');
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Tables</h1>
          <p className="page-subtitle">Manage restaurant seating capacity.</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          + Add Table
        </button>
      </div>

      <div className="grid-4">
        {loading ? (
          [...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: '140px' }}></div>)
        ) : tables.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
            No tables found. Create one to get started.
          </div>
        ) : (
          tables.map(table => (
            <div key={table._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', opacity: table.active ? 1 : 0.6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--color-primary)' }}>
                  #{table.tableNumber}
                </div>
                {table.active ? (
                  <span className="badge badge-success">Active</span>
                ) : (
                  <span className="badge badge-danger">Inactive</span>
                )}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-secondary)' }}>
                <span style={{ fontSize: '20px' }}>👥</span> {table.seatingCapacity} Seats
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => openModal(table)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(table._id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 style={{ fontSize: '20px', marginBottom: '24px', fontWeight: '700' }}>
              {currentTable ? 'Edit Table' : 'Add New Table'}
            </h2>

            {formError && <div className="alert alert-error" style={{ marginBottom: '16px' }}>{formError}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Table Number</label>
                <input 
                  type="number" 
                  name="tableNumber"
                  className="form-input" 
                  min="1" 
                  value={formData.tableNumber}
                  onChange={handleChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Seating Capacity</label>
                <input 
                  type="number" 
                  name="seatingCapacity"
                  className="form-input" 
                  min="1" 
                  max="50"
                  value={formData.seatingCapacity}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <input 
                  type="checkbox" 
                  id="active"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="active" style={{ cursor: 'pointer', fontWeight: '500' }}>Table is active (can be booked)</label>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={formLoading}>
                  {formLoading ? 'Saving...' : 'Save Table'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableManagementPage;
