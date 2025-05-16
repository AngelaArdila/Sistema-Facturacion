  'use client';

  import {
    Container, Typography, Stack, Button,
    Autocomplete, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
  } from '@mui/material';
  import { useEffect, useState } from 'react';
  import api from '../service/apiService';
  import ClienteModal from '../components/modals/ClienteModal';
  import ProductoModal from '../components/modals/ProductoModal';
  import ListaFacturasModal from '../components/modals/ListaFacturaModal';
  import FormularioFactura from '../components/forms/FormularioFactura';

  export default function Dashboard() {
    const [clientes, setClientes] = useState([]);
    const [productos, setProductos] = useState([]);
    const [facturas, setFacturas] = useState([]);
    const [openClienteModal, setOpenClienteModal] = useState(false);
    const [openProductoModal, setOpenProductoModal] = useState(false);
    const [openListaFacturasModal, setOpenListaFacturasModal] = useState(false);
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);

    useEffect(() => {
      api.get('/customers').then(res => setClientes(res.data)).catch(() => setClientes([]));
      api.get('/products').then(res => setProductos(res.data)).catch(() => setProductos([]));
      api.get('/invoices').then(res => setFacturas(res.data)).catch(() => setFacturas([]));
    }, [openClienteModal, openProductoModal]);

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
          <Button variant="outlined" onClick={() => setOpenListaFacturasModal(true)}>📄 Ver Facturas</Button>
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

        <FormularioFactura
          clientes={clientes}
          productos={productos}
          onSuccess={() => api.get('/invoices').then(res => setFacturas(res.data))}
        />

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

        <ListaFacturasModal
          open={openListaFacturasModal}
          onClose={() => setOpenListaFacturasModal(false)}
          facturas={facturas}
        />
      </Container>
    );
  }
