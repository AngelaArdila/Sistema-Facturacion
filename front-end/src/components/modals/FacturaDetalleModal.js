'use client';

import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Table, TableHead, TableRow, TableCell, TableBody, Typography
} from '@mui/material';

export default function FacturaDetalleModal({ open, onClose, factura }) {
  if (!open || !factura) return null;

  const { invoiceNumber, date, total, Customer, InvoiceItems = [] } = factura;
  const subtotal = +(total / 1.15).toFixed(2);
  const tax = +(total - subtotal).toFixed(2);

  const handlePrint = () => window.print();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Factura {invoiceNumber}</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Cliente: {Customer?.name || 'Sin cliente'}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Fecha: {new Date(date).toLocaleDateString()}
        </Typography>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Producto</TableCell>
              <TableCell align="right">Precio</TableCell>
              <TableCell align="right">Cantidad</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {InvoiceItems.map((item, i) => {
              const producto = item.Product;
              return (
                <TableRow key={i}>
                  <TableCell>{producto?.name || 'Producto no encontrado'}</TableCell>
                  <TableCell align="right">
                    {producto?.price !== undefined ? `$${producto.price.toFixed(2)}` : '$'}
                  </TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">
                    {item.total !== undefined ? `$${item.total.toFixed(2)}` : '$'}
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow>
              <TableCell rowSpan={3} />
              <TableCell colSpan={2}>Subtotal</TableCell>
              <TableCell align="right">${subtotal.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>Impuesto (15%)</TableCell>
              <TableCell align="right">${tax.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}><strong>Total</strong></TableCell>
              <TableCell align="right"><strong>${total.toFixed(2)}</strong></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
        <Button onClick={handlePrint} variant="contained">Imprimir</Button>
      </DialogActions>
    </Dialog>
  );
}
