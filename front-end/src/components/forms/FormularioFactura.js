"use client";

import {
  Box,
  Typography,
  Stack,
  TextField,
  Autocomplete,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useState } from "react";
import api from "../../service/apiService";

export default function FormularioFactura({
  clientes,
  productos,
  onSuccess,
  mostrarPrecio = true,
}) {
  const [cliente, setCliente] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState("");
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const agregarItem = () => {
    if (!productoSeleccionado || !cantidad || parseInt(cantidad) <= 0) {
      setError("Producto y cantidad válidos requeridos");
      return;
    }

    const yaExiste = items.find((i) => i.productId === productoSeleccionado.id);
    if (yaExiste) {
      setError("Producto ya agregado");
      return;
    }

    const totalPrice = productoSeleccionado.price * parseInt(cantidad);
    setItems([
      ...items,
      {
        productId: productoSeleccionado.id,
        name: productoSeleccionado.name,
        price: productoSeleccionado.price,
        quantity: parseInt(cantidad),
        totalPrice,
      },
    ]);
    setProductoSeleccionado(null);
    setCantidad("");
    setError("");
  };

  const subtotal = items.reduce((acc, i) => acc + i.totalPrice, 0);
  const tax = +(subtotal * 0.15).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);

  const guardarFactura = async () => {
    if (!cliente || items.length === 0) {
      setError("Selecciona cliente y productos");
      return;
    }

    try {
      await api.post("/invoices", {
        customerId: cliente.id,
        items: items.map(({ productId, quantity }) => ({
          productId,
          quantity,
        })),
      });
      setMensaje("Factura creada con éxito");
      setError("");
      setCliente(null);
      setItems([]);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || "Error al crear factura");
    }
  };

  return (
    <Box sx={{ p: 3, border: "1px solid #ccc", borderRadius: 2, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Nueva Factura
      </Typography>

      <Autocomplete
        options={clientes}
        getOptionLabel={(c) => c.name}
        value={cliente}
        onChange={(e, v) => setCliente(v)}
        renderInput={(params) => (
          <TextField {...params} label="Selecciona cliente" />
        )}
        sx={{ mb: 2 }}
      />

      <Stack direction="row" spacing={2}>
        <Autocomplete
          options={productos}
          getOptionLabel={(p) => p.name}
          value={productoSeleccionado}
          onChange={(e, v) => setProductoSeleccionado(v)}
          sx={{ flex: 2 }}
          renderInput={(params) => <TextField {...params} label="Producto" />}
        />
        <TextField
          label="Precio"
          value={productoSeleccionado ? `$${productoSeleccionado.price}` : ""}
          InputProps={{ readOnly: true }}
          sx={{ flex: 1 }}
        />
        <TextField
          label="Cantidad"
          type="number"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          sx={{ flex: 1 }}
          inputProps={{ min: 1 }}
        />
        <Button onClick={agregarItem} variant="contained">
          Agregar
        </Button>
      </Stack>

      {items.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Producto</TableCell>
                {mostrarPrecio && <TableCell align="right">Precio</TableCell>}
                <TableCell align="right">Cantidad</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.name}</TableCell>
                  {mostrarPrecio && (
                    <TableCell align="right">
                      ${item.price.toFixed(2)}
                    </TableCell>
                  )}
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">
                    ${item.totalPrice.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell rowSpan={3} />
                <TableCell colSpan={mostrarPrecio ? 2 : 1}>Subtotal</TableCell>
                <TableCell align="right">${subtotal.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={mostrarPrecio ? 2 : 1}>
                  Impuesto (15%)
                </TableCell>
                <TableCell align="right">${tax.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={mostrarPrecio ? 2 : 1}>
                  <strong>Total</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>${total.toFixed(2)}</strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {error && (
        <Typography color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
      {mensaje && (
        <Typography color="green" sx={{ mt: 1 }}>
          {mensaje}
        </Typography>
      )}

      <Stack
        direction="row"
        justifyContent="flex-end"
        spacing={2}
        sx={{ mt: 2 }}
      >
        <Button onClick={guardarFactura} variant="contained">
          Guardar
        </Button>
      </Stack>
    </Box>
  );
}
