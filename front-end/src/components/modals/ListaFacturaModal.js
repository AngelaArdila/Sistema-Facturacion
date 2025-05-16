'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography
} from '@mui/material';
import { useState } from 'react';
import FacturaDetalleModal from './FacturaDetalleModal';

export default function ListaFacturasModal({ open, onClose, facturas }) {
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);

  const handleVerFactura = (factura) => {
    setFacturaSeleccionada(factura);
  };

  const handleCerrarDetalle = () => {
    setFacturaSeleccionada(null);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>Facturas Emitidas</DialogTitle>
        <DialogContent>
          {facturas.length === 0 ? (
            <Typography>No hay facturas registradas.</Typography>
          ) : (
            <Table>
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
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleVerFactura(f)}
                      >
                        Ver / Imprimir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <FacturaDetalleModal
        open={!!facturaSeleccionada}
        onClose={handleCerrarDetalle}
        factura={facturaSeleccionada}
      />
    </>
  );
}
