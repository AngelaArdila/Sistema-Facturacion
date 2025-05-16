'use client';

import { useEffect, useState } from 'react';
import {
  Container, Typography, Stack, Button,
  Autocomplete, TextField, Table, TableHead,
  TableBody, TableRow, TableCell, Paper
} from '@mui/material';
import api from '../service/apiService';
import ClienteModal from '../components/modals/ClienteModal';
import ProductoModal from '../components/modals/ProductoModal';
import FacturaModal from '../components/modals/FacturaModal';

export default function Dashboard() {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [openClienteModal, setOpenClienteModal] = useState(false);
  const [openProductoModal, setOpenProductoModal] = useState(false);
  const [openFacturaModal, setOpenFacturaModal] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    api.get('/customers').then(res => setClientes(res.data)).catch(() => setClientes([]));
    api.get('/products').then(res => setProductos(res.data)).catch(() => setProductos([]));
    api.get('/invoices').then(res => setFacturas(res.data)).catch(() => setFacturas([]));
  }, [openClienteModal, openProductoModal, openFacturaModal]);

  const abrirEdicionCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    setOpenClienteModal(true);
  };

  const abrirEdicionProducto = (producto) => {
    setProductoSeleccionado(producto);
    setOpenProductoModal(true);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">Sistema de Facturación</Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button variant="contained" onClick={() => { setClienteSeleccionado(null); setOpenClienteModal(true); }}>+ Cliente</Button>
        <Button variant="outlined" onClick={() => { setProductoSeleccionado(null); setOpenProductoModal(true); }}>+ Producto</Button>
        <Button variant="outlined" onClick={() => setOpenFacturaModal(true)}>+ Factura</Button>
      </Stack>

      <Autocomplete
        options={clientes}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => <TextField {...params} label="Buscar cliente" fullWidth />}
        onChange={(e, value) => value && abrirEdicionCliente(value)}
        sx={{ mb: 2, width: '100%' }}
      />

      <Autocomplete
        options={productos}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => <TextField {...params} label="Buscar producto" fullWidth />}
        onChange={(e, value) => value && abrirEdicionProducto(value)}
        sx={{ mb: 4, width: '100%' }}
      />

      <Typography variant="h6" gutterBottom>Facturas Emitidas</Typography>
      <Paper elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>N°</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {facturas.map((f) => (
              <TableRow key={f.id}>
                <TableCell>{f.invoiceNumber}</TableCell>
                <TableCell>{f.Customer?.name || 'Sin cliente'}</TableCell>
                <TableCell>{new Date(f.date).toLocaleDateString()}</TableCell>
                <TableCell>${f.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Button size="small" variant="outlined">Ver / Imprimir</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <ClienteModal
        open={openClienteModal}
        onClose={() => setOpenClienteModal(false)}
        clienteEditado={clienteSeleccionado}
      />

      <ProductoModal
        open={openProductoModal}
        onClose={() => setOpenProductoModal(false)}
        productoEditado={productoSeleccionado}
      />

      <FacturaModal
        open={openFacturaModal}
        onClose={() => setOpenFacturaModal(false)}
        clientes={clientes}
        productos={productos}
      />
    </Container>
  );
}
