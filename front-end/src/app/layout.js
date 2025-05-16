import './globals.css';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'Sistema de Facturación',
  description: 'App para gestión de clientes, productos y facturas',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        <main style={{ padding: '20px' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
