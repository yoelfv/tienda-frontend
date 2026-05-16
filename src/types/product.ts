export interface Product {
  id: number;
  nombre: string;
  precio: number;
  imagen: {
    url: string;
  } | null; // ✅ Explicitamente puede ser null
}
