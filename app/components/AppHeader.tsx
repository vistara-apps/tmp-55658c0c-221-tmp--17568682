    'use client';

    import { Name } from '@coinbase/onchainkit/identity';

    export default function AppHeader() {
      return (
        <header className="flex justify-between items-center p-4 bg-surface shadow-card">
          <h1 className="text-display text-primary">VibeFinder</h1>
          <p className="text-body">Stop doomscrolling, start discovering</p>
          <Name address="0x..."/> {/* User's ENS name */}
        </header>
      );
    }
  