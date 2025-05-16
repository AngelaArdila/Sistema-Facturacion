'use client';

import {
  Container, Typography, Stack, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import { useEffect, useState } from 'react';
import api from '../service/apiService';
import ClienteModal from '../components/modals/ClienteModal';
import ProductoModal from '../components/modals/ProductoModal';
import FacturaDetalleModal from '../components/modals/FacturaDetalleModal';
import FormularioFactura from '../components/forms/FormularioFactura';

export default function Dashboard() {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [openClienteModal, setOpenClienteModal] = useState(false);
  const [openProductoModal, setOpenProductoModal] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [vista, setVista] = useState('factura');

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

  const abrirDetalleFactura = (factura) => {
    setFacturaSeleccionada(factura);
  };

  const cerrarDetalleFactura = () => {
    setFacturaSeleccionada(null);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">Sistema de Facturación</Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button variant={'contained'} onClick={() => setVista('factura')}>Crear Factura</Button>
        <Button variant={'outlined'} onClick={() => setVista('clientes')}>Clientes</Button>
        <Button variant={'outlined'} onClick={() => setVista('productos')}>Productos</Button>
        <Button variant={'outlined'} onClick={() => setVista('facturas')}>📄 Facturas</Button>
      </Stack>

      {vista === 'clientes' && (
        <>
          <Button variant="outlined" sx={{ mb: 2 }} onClick={() => { setClienteSeleccionado(null); setOpenClienteModal(true); }}>+ Nuevo Cliente</Button>
          <Typography variant="h6" gutterBottom>Clientes Registrados</Typography>
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Dirección</TableCell>
                  <TableCell>Teléfono</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clientes.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.address}</TableCell>
                    <TableCell>{c.phone}</TableCell>
                    <TableCell>
                      <Button size="small" onClick={() => abrirEdicionCliente(c)}>Editar</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {vista === 'productos' && (
        <>
          <Button variant="outlined" sx={{ mb: 2 }} onClick={() => { setProductoSeleccionado(null); setOpenProductoModal(true); }}>+ Nuevo Producto</Button>
          <Typography variant="h6" gutterBottom>Productos Registrados</Typography>
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Precio</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productos.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.description}</TableCell>
                    <TableCell>${p.price}</TableCell>
                    <TableCell>
                      <Button size="small" onClick={() => abrirEdicionProducto(p)}>Editar</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {vista === 'factura' && (
        <FormularioFactura
          clientes={clientes}
          productos={productos}
          onSuccess={() => api.get('/invoices').then(res => setFacturas(res.data))}
        />
      )}

      {vista === 'facturas' && (
        <>
          <Typography variant="h6" gutterBottom>Facturas Emitidas</Typography>
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell># Factura</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Acción</TableCell>
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
                      <Button size="small" variant="outlined" onClick={() => abrirDetalleFactura(f)}>Ver / Imprimir</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

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

      <FacturaDetalleModal
        open={!!facturaSeleccionada}
        onClose={cerrarDetalleFactura}
        factura={facturaSeleccionada}
      />
    </Container>
  );
}
