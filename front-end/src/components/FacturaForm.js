import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, MenuItem, Grid, Divider } from '@mui/material';
import api from '../service/apiService';

const FacturaForm = () => {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [clienteId, setClienteId] = useState('');
  const [item, setItem] = useState({ productId: '', quantity: '' });
  const [items, setItems] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const [totales, setTotales] = useState({ subtotal: 0, tax: 0, total: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const [resClientes, resProductos] = await Promise.all([
        api.get('/customers'),
        api.get('/products'),
      ]);
      setClientes(resClientes.data);
      setProductos(resProductos.data);
    };
    fetchData();
  }, []);

  const agregarItem = () => {
    const producto = productos.find(p => p.id === parseInt(item.productId));
    const cantidad = parseInt(item.quantity);

    if (!producto || isNaN(cantidad) || cantidad <= 0) return;

    const totalPrice = producto.price * cantidad;
    const nuevoItem = {
      productId: producto.id,
      name: producto.name,
      quantity: cantidad,
      totalPrice,
    };

    const nuevosItems = [...items, nuevoItem];
    setItems(nuevosItems);
    setItem({ productId: '', quantity: '' });

    // Calcular totales
    const subtotal = nuevosItems.reduce((sum, i) => sum + i.totalPrice, 0);
    const tax = +(subtotal * 0.15).toFixed(2);
    const total = +(subtotal + tax).toFixed(2);
    setTotales({ subtotal, tax, total });
  };

  const guardarFactura = async () => {
    try {
      const payload = {
        customerId: clienteId,
        items: items.map(({ productId, quantity }) => ({ productId, quantity })),
      };

      await api.post('/invoices', payload);
      setMensaje('Factura creada exitosamente');
      setItems([]);
      setClienteId('');
      setTotales({ subtotal: 0, tax: 0, total: 0 });
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar factura');
      setMensaje('');
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Crear Factura</Typography>

      <TextField
        select
        label="Selecciona Cliente"
        value={clienteId}
        onChange={(e) => setClienteId(e.target.value)}
        fullWidth
        margin="normal"
      >
        {clientes.map(cliente => (
          <MenuItem key={cliente.id} value={cliente.id}>
            {cliente.name} - {cliente.address}
          </MenuItem>
        ))}
      </TextField>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={6}>
          <TextField
            select
            label="Producto"
            name="productId"
            value={item.productId}
            onChange={(e) => setItem({ ...item, productId: e.target.value })}
            fullWidth
            margin="normal"
          >
            {productos.map(prod => (
              <MenuItem key={prod.id} value={prod.id}>
                {prod.name} (${prod.price})
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Cantidad"
            type="number"
            name="quantity"
            value={item.quantity}
            onChange={(e) => setItem({ ...item, quantity: e.target.value })}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={2}>
          <Button onClick={agregarItem} variant="contained" sx={{ mt: 2 }}>Agregar</Button>
        </Grid>
      </Grid>

      {items.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Detalle</Typography>
          {items.map((i, idx) => (
            <Typography key={idx}>
              {i.quantity}x {i.name} = ${i.totalPrice.toFixed(2)}
            </Typography>
          ))}
          <Divider sx={{ my: 2 }} />
          <Typography>Subtotal: ${totales.subtotal.toFixed(2)}</Typography>
          <Typography>Impuesto (15%): ${totales.tax.toFixed(2)}</Typography>
          <Typography variant="h6">Total: ${totales.total.toFixed(2)}</Typography>
        </>
      )}

      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
      {mensaje && <Typography color="green" sx={{ mt: 2 }}>{mensaje}</Typography>}

      <Button
        variant="contained"
        color="primary"
        onClick={guardarFactura}
        disabled={!clienteId || items.length === 0}
        sx={{ mt: 3 }}
      >
        Guardar Factura
      </Button>
    </Box>
  );
};

export default FacturaForm;
