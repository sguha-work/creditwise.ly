import { Link, Outlet, useLocation } from 'react-router-dom';
import { CreditCard, Receipt, HandCoins, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useState, useEffect } from 'react';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function Layout() {
  const location = useLocation();
  const [isExpensesOpen, setIsExpensesOpen] = useState(
    location.pathname.includes('/expenses')
  );

  useEffect(() => {
    if (location.pathname.includes('/expenses')) {
      setIsExpensesOpen(true);
    }
  }, [location.pathname]);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: CreditCard },
    { name: 'Manage Cards', path: '/cards', icon: CreditCard },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 p-1 to-emerald-400 bg-clip-text text-transparent">
            creditwise.ly
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                  isActive
                    ? 'bg-slate-800 text-white font-medium'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                )}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}

          {/* Manage Expenses Accordion */}
          <div>
            <button
              onClick={() => setIsExpensesOpen(!isExpensesOpen)}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors',
                location.pathname.includes('/expenses')
                  ? 'text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              )}
            >
              <div className="flex items-center gap-3">
                <Receipt className="w-5 h-5" />
                <span>Manage Expenses</span>
              </div>
              {isExpensesOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {isExpensesOpen && (
              <div className="mt-1 ml-9 space-y-1">
                <Link
                  to="/expenses/monthly"
                  className={cn(
                    'block px-3 py-2 text-sm rounded-lg transition-colors',
                    location.pathname === '/expenses/monthly'
                      ? 'bg-slate-800 text-white font-medium'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  )}
                >
                  Monthly Manage
                </Link>
                <Link
                  to="/expenses/yearly"
                  className={cn(
                    'block px-3 py-2 text-sm rounded-lg transition-colors',
                    location.pathname === '/expenses/yearly'
                      ? 'bg-slate-800 text-white font-medium'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  )}
                >
                  Yearly Manage
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/payments"
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
              location.pathname === '/payments'
                ? 'bg-slate-800 text-white font-medium'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            )}
          >
            <HandCoins className="w-5 h-5" />
            Manage Payments
          </Link>

        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <Link
            to="/about"
            className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-slate-400 hover:text-white hover:bg-slate-800/50"
          >
            <Info className="w-5 h-5" />
            About Creator
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-slate-950 p-8">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
