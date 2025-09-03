    'use client';

    // Note: This is a placeholder; actual MapPin would be used in GoogleMap markers
    export default function MapPin({ active }: { active: boolean }) {
      return <div className={`pin ${active ? 'bg-accent' : 'bg-primary'}`}>Pin</div>;
    }
  