'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '../../../service/apiService';
import { Box, Typography, Divider, Button } from '@mui/material';

export default function FacturaDetalle() {
  const { id } = useParams();
  const [factura, setFactura] = useState(null);

  useEffect(() => {
    if (id) {
      api.get(`/invoices/${id}`)
        .then(res => setFactura(res.data))
        .catch(() => setFactura(null));
    }
  }, [id]);

  const imprimir = () => {
    window.print();
  };

  if (!factura) return <Typography sx={{ mt: 4 }}>Cargando factura...</Typography>;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 3, border: '1px solid #ccc', borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom>Factura #{factura.invoiceNumber}</Typography>
      <Typography>Fecha: {new Date(factura.date).toLocaleDateString()}</Typography>
      <Typography>Cliente: {factura.Customer.name}</Typography>
      <Typography>Dirección: {factura.Customer.address}</Typography>
      <Typography>Teléfono: {factura.Customer.phone || '-'}</Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Productos:</Typography>
      {factura.InvoiceItems.map((item, idx) => (
        <Typography key={idx}>
          {item.quantity} x {item.Product.name} = ${item.totalPrice.toFixed(2)}
        </Typography>
      ))}

      <Divider sx={{ my: 2 }} />

      <Typography>Subtotal: ${factura.subtotal.toFixed(2)}</Typography>
      <Typography>Impuesto (15%): ${factura.tax.toFixed(2)}</Typography>
      <Typography variant="h6">Total: ${factura.total.toFixed(2)}</Typography>

      <Button variant="outlined" sx={{ mt: 3 }} onClick={imprimir}>Imprimir</Button>
    </Box>
  );
}
