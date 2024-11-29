import { Toaster } from "@/components/ui/toaster"; // Importando o Toaster

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <main>{children}</main> {/* Aqui ficam seus componentes e páginas */}
        <Toaster /> {/* Colocando o Toaster aqui para que seja acessível em todo o app */}
      </body>
    </html>
  );
}
