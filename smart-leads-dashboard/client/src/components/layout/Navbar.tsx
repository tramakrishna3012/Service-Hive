import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div />
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-slate-900">{user?.name}</p>
          <p className="text-xs capitalize text-slate-500">{user?.role}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
