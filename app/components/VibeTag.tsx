    'use client';

    export default function VibeTag({ tag }: { tag: string }) {
      return (
        <span className="bg-primary text-white px-2 py-1 rounded-sm text-sm mr-2 mb-2">
          {tag}
        </span>
      );
    }
  