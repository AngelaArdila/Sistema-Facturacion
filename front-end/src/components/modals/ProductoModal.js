"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import api from "../../service/apiService";

export default function ProductoModal({ open, onClose, productoEditado }) {
  const [form, setForm] = useState({ name: "", description: "", price: "" });
  const [error, setError] = useState("");
  const modoEdicion = Boolean(productoEditado);

  useEffect(() => {
    if (modoEdicion) {
      setForm({
        name: productoEditado.name || "",
        description: productoEditado.description || "",
        price: productoEditado.price || "",
      });
    } else {
      setForm({ name: "", description: "", price: "" });
    }
  }, [productoEditado, open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
      };

      if (modoEdicion) {
        await api.put(`/products/${productoEditado.id}`, payload);
      } else {
        await api.post("/products", payload);
      }

      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Error al guardar producto");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        {modoEdicion ? "Editar Producto" : "Nuevo Producto"}
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Nombre"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Descripción"
          name="description"
          value={form.description}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Precio"
          name="price"
          value={form.price}
          onChange={handleChange}
          fullWidth
          margin="dense"
          type="number"
          inputProps={{ min: 0, inputMode: "decimal" }}
          sx={{
            "& input::-webkit-outer-spin-button": { display: "none" },
            "& input::-webkit-inner-spin-button": { display: "none" },
            "& input[type=number]": { MozAppearance: "textfield" },
          }}
        />

        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">
          {modoEdicion ? "Guardar Cambios" : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
