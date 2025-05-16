"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Autocomplete,
  Box,
  Typography,
  Stack,
} from "@mui/material";
import { useState } from "react";
import api from "../../service/apiService";

export default function FacturaModal({ open, onClose, clientes, productos }) {
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
    console.log("🧾 Cliente seleccionado:", cliente); // 👈 AQUI

    try {
      await api.post("/invoices", {
        customerId: cliente.id,

        items: items.map(({ productId, quantity, totalPrice }) => ({
          productId,
          quantity,
          totalPrice,
        })),
      });
      setMensaje("Factura creada con éxito");
      setError("");
      setCliente(null);
      setItems([]);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Error al crear factura");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Nueva Factura</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Autocomplete
            options={clientes}
            getOptionLabel={(c) => c.name}
            value={cliente}
            onChange={(e, v) => setCliente(v)}
            renderInput={(params) => (
              <TextField {...params} label="Selecciona cliente" />
            )}
          />

          <Stack direction="row" spacing={2}>
            <Autocomplete
              options={productos}
              getOptionLabel={(p) => `${p.name} ($${p.price})`}
              value={productoSeleccionado}
              onChange={(e, v) => setProductoSeleccionado(v)}
              sx={{ flex: 2 }}
              renderInput={(params) => (
                <TextField {...params} label="Producto" />
              )}
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
            <Box>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Detalle:
              </Typography>
              {items.map((i, idx) => (
                <Typography key={idx}>
                  {i.quantity} x {i.name} = ${i.totalPrice.toFixed(2)}
                </Typography>
              ))}
              <Typography sx={{ mt: 1 }}>
                Subtotal: ${subtotal.toFixed(2)}
              </Typography>
              <Typography>Impuesto (15%): ${tax.toFixed(2)}</Typography>
              <Typography variant="h6">Total: ${total.toFixed(2)}</Typography>
            </Box>
          )}

          {error && <Typography color="error">{error}</Typography>}
          {mensaje && <Typography color="green">{mensaje}</Typography>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={guardarFactura} variant="contained">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
