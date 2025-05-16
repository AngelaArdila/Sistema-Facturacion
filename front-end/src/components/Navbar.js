'use client';

import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import Link from 'next/link';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6">Sistema de Facturación</Typography>
        <div>
          <Link href="/clientes/nuevo" passHref>
            <Button color="inherit">Nuevo Cliente</Button>
          </Link>
          <Link href="/productos/nuevo" passHref>
            <Button color="inherit">Nuevo Producto</Button>
          </Link>
          <Link href="/facturas/nueva" passHref>
            <Button color="inherit">Nueva Factura</Button>
          </Link>
          <Link href="/facturas" passHref>
            <Button color="inherit">Facturas</Button>
          </Link>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
