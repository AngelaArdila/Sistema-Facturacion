import { useEffect, useState } from 'react';
import api from '../../service/apiService';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import Link from 'next/link';

export default function ListaFacturas() {
  const [facturas, setFacturas] = useState([]);

  useEffect(() => {
    api.get('/invoices')
      .then(res => setFacturas(res.data))
      .catch(() => setFacturas([]));
  }, []);

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>Facturas Emitidas</Typography>
      {facturas.length === 0 ? (
        <Typography>No hay facturas registradas.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell># Factura</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {facturas.map((factura) => (
                <TableRow key={factura.id}>
                  <TableCell>{factura.invoiceNumber}</TableCell>
                  <TableCell>{new Date(factura.date).toLocaleDateString()}</TableCell>
                  <TableCell>{factura.Customer?.name}</TableCell>
                  <TableCell>${factura.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Link href={`/facturas/${factura.id}`} passHref>
                      <Button variant="outlined">Ver / Imprimir</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}