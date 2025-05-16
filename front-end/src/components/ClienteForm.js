import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import api from '../service/apiService';

const ClienteForm = () => {
  const [form, setForm] = useState({ name: '', address: '', phone: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/customers', form);
      setSuccess('Cliente creado con éxito');
      setForm({ name: '', address: '', phone: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear cliente');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Registrar Cliente</Typography>
      <TextField label="Nombre" name="name" value={form.name} onChange={handleChange} fullWidth margin="normal" required />
      <TextField label="Dirección" name="address" value={form.address} onChange={handleChange} fullWidth margin="normal" required />
      <TextField label="Teléfono (10 dígitos)" name="phone" value={form.phone} onChange={handleChange} fullWidth margin="normal" />

      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="green">{success}</Typography>}

      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Guardar</Button>
    </Box>
  );
};

export default ClienteForm;
