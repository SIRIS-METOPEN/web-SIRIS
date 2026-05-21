import { Outlet } from 'react-router';

export function RootLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
      <Outlet />
    </div>
  );
}
