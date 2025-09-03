    'use client';

    import Image from 'next/image';
    import VibeTag from './VibeTag';

    interface Recommendation {
      title: string;
      description: string;
      image_url: string;
      video_url: string;
      vibe_tags: string[];
      trend_score: number;
    }

    export default function RecommendationCard({ recommendation, onSave }: { recommendation: Recommendation; onSave: () => void }) {
      return (
        <div className="bg-surface rounded-lg shadow-card p-4 transition duration-base hover:shadow-modal">
          <Image src={recommendation.image_url} alt={recommendation.title} width={300} height={200} className="rounded-md" />
          <h3 className="text-heading mt-2">{recommendation.title}</h3>
          <p className="text-body">{recommendation.description}</p>
          <div className="flex flex-wrap mt-2">
            {recommendation.vibe_tags.map(tag => <VibeTag key={tag} tag={tag} />)}
          </div>
          <button onClick={onSave} className="mt-4 bg-accent text-white px-4 py-2 rounded-md">Save</button>
        </div>
      );
    }
  