'use client';

import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Typography
} from '@mui/material';
import { useState, useEffect } from 'react';
import api from '../../service/apiService';

export default function ClienteModal({ open, onClose, clienteEditado }) {
  const [form, setForm] = useState({ name: '', address: '', phone: '' });
  const [error, setError] = useState('');
  const modoEdicion = Boolean(clienteEditado);

  useEffect(() => {
    if (modoEdicion && clienteEditado) {
      setForm({
        name: clienteEditado.name || '',
        address: clienteEditado.address || '',
        phone: clienteEditado.phone || '',
      });
    } else {
      setForm({ name: '', address: '', phone: '' });
    }
  }, [clienteEditado, open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError('');
    try {
      if (modoEdicion) {
        await api.put(`/customers/${clienteEditado.id}`, form);
      } else {
        await api.post('/customers', form);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{modoEdicion ? 'Editar Cliente' : 'Registrar Cliente'}</DialogTitle>
      <DialogContent>
        <TextField
          label="Nombre"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Dirección"
          name="address"
          value={form.address}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Teléfono"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">
          {modoEdicion ? 'Guardar Cambios' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
