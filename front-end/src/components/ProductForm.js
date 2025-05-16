import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import api from '../service/apiService';

const ProductForm = () => {
  const [form, setForm] = useState({ name: '', description: '', price: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const priceNum = parseFloat(form.price);
    if (isNaN(priceNum) || priceNum < 0) {
      setError('El precio debe ser un número positivo');
      return;
    }

    try {
      await api.post('/products', { ...form, price: priceNum });
      setSuccess('Producto registrado con éxito');
      setForm({ name: '', description: '', price: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar producto');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Registrar Producto</Typography>
      <TextField label="Nombre" name="name" value={form.name} onChange={handleChange} fullWidth margin="normal" required />
      <TextField label="Descripción" name="description" value={form.description} onChange={handleChange} fullWidth margin="normal" required />
      <TextField label="Precio" name="price" value={form.price} onChange={handleChange} fullWidth margin="normal" required />

      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="green">{success}</Typography>}

      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Guardar</Button>
    </Box>
  );
};

export default ProductForm;
