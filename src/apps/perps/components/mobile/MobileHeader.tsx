import { User, Clock } from 'lucide-react';
import { Button } from '../ui/button';

export function MobileHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50 px-4 py-3 flex items-center justify-between border-b border-gray-100">
      {/* Profile Button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-full bg-purple-100 hover:bg-purple-200"
      >
        <User className="h-5 w-5 text-purple-600" />
      </Button>

      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
          <span className="text-white text-xs font-bold">∞</span>
        </div>
        <span className="text-lg font-bold">Perps</span>
      </div>

      {/* History Button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200"
      >
        <Clock className="h-5 w-5 text-gray-700" />
      </Button>
    </header>
  );
}
