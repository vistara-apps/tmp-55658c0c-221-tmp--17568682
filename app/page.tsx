    'use client';

    import { useState, useEffect } from 'react';
    import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
    import AppHeader from './components/AppHeader';
    import RecommendationCard from './components/RecommendationCard';
    import VibeTag from './components/VibeTag';
    import { createClient } from '@supabase/supabase-js';
    import { OpenAI } from 'openai';
    import { useAccount } from 'wagmi';
    import { ConnectWallet } from '@coinbase/onchainkit/wallet';

    // Supabase client (use env vars in production)
    const supabase = createClient('https://your-supabase-url.supabase.co', 'your-supabase-anon-key');

    // OpenAI client
    const openai = new OpenAI({
      apiKey: '',
      baseURL: "https://openrouter.ai/api/v1",
      dangerouslyAllowBrowser: true,
    });

    const mapStyles = { height: "400px", width: "100%" };

    export default function Home() {
      const { address } = useAccount();
      const [recommendations, setRecommendations] = useState([]);
      const [userPreferences, setUserPreferences] = useState([]);
      const [mapCenter, setMapCenter] = useState({ lat: 37.7749, lng: -122.4194 }); // Default to SF
      const [selectedRec, setSelectedRec] = useState(null);
      const [isOnboarded, setIsOnboarded] = useState(false);

      useEffect(() => {
        if (address) {
          checkOnboarding();
          fetchRecommendations();
        }
      }, [address]);

      const checkOnboarding = async () => {
        const { data } = await supabase.from('users').select('*').eq('userId', address).single();
        if (data && data.onboarding_complete) {
          setIsOnboarded(true);
          setUserPreferences(data.preferences || []);
        }
      };

      const fetchRecommendations = async () => {
        // Simulate API calls: EnsembleData -> SocialKit -> OpenAI -> Google Maps -> Supabase
        try {
          // Placeholder: Fetch trending data (replace with real API calls)
          const trendingData = await fetchTrendingFromEnsemble(); // Implement as needed
          const analyzed = await analyzeWithSocialKit(trendingData);
          const summarized = await summarizeWithOpenAI(analyzed);
          const geocoded = await geocodeWithGoogle(summarized);
          const saved = await saveToSupabase(geocoded);

          // Filter by user preferences if onboarded
          const filtered = isOnboarded ? filterByVibe(saved, userPreferences) : saved;
          setRecommendations(filtered);

          // Set map center to first recommendation
          if (filtered.length > 0) {
            setMapCenter({ lat: filtered[0].latitude, lng: filtered[0].longitude });
          }
        } catch (error) {
          console.error('Error fetching recommendations:', error);
        }
      };

      // Placeholder functions (implement with real APIs)
      const fetchTrendingFromEnsemble = async () => {
        // Call /apis/tt/hashtag_search?hashtag=localtrend&token=...
        return [{ video_url: 'example', hashtag: 'trend' }]; // Mock
      };

      const analyzeWithSocialKit = async (data) => {
        // Call /video/summary, etc.
        return data.map(d => ({ ...d, summary: 'Trending spot' })); // Mock
      };

      const summarizeWithOpenAI = async (data) => {
        const completion = await openai.chat.completions.create({
          model: 'google/gemini-2.0-flash-001',
          messages: [{ role: 'user', content: 'Summarize this: ' + JSON.stringify(data) }],
        });
        return JSON.parse(completion.choices[0].message.content); // Assume structured output
      };

      const geocodeWithGoogle = async (data) => {
        // Use Google Maps Geocoding API (client-side or server-side)
        return data.map(d => ({ ...d, latitude: 37.7749, longitude: -122.4194 })); // Mock
      };

      const saveToSupabase = async (data) => {
        const { error } = await supabase.from('recommendations').insert(data);
        if (error) throw error;
        return data;
      };

      const filterByVibe = (recs, prefs) => {
        return recs.filter(rec => rec.vibe_tags.some(tag => prefs.includes(tag)));
      };

      const handleOnboard = async (prefs) => {
        await supabase.from('users').upsert({
          userId: address,
          preferences: prefs,
          onboarding_complete: true,
        });
        setIsOnboarded(true);
        setUserPreferences(prefs);
        fetchRecommendations();
      };

      return (
        <div className="container">
          <AppHeader />
          {!address ? (
            <ConnectWallet />
          ) : !isOnboarded ? (
            <OnboardingForm onSubmit={handleOnboard} />
          ) : (
            <>
              <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
                <GoogleMap
                  mapContainerStyle={mapStyles}
                  zoom={13}
                  center={mapCenter}
                >
                  {recommendations.map(rec => (
                    <Marker
                      key={rec.recommendationId}
                      position={{ lat: rec.latitude, lng: rec.longitude }}
                      onClick={() => setSelectedRec(rec)}
                    />
                  ))}
                </GoogleMap>
              </LoadScript>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {recommendations.map(rec => (
                  <RecommendationCard
                    key={rec.recommendationId}
                    recommendation={rec}
                    onSave={() => saveRecommendation(rec)}
                  />
                ))}
              </div>
              {selectedRec && (
                <div className="modal">
                  <h2>{selectedRec.title}</h2>
                  <video src={selectedRec.video_url} controls width="300" />
                  {selectedRec.vibe_tags.map(tag => <VibeTag key={tag} tag={tag} />)}
                </div>
              )}
            </>
          )}
        </div>
      );
    }

    // Placeholder OnboardingForm component
    function OnboardingForm({ onSubmit }) {
      const [prefs, setPrefs] = useState([]);
      // Form to select preferences or connect social (implement UI)
      return (
        <form onSubmit={() => onSubmit(prefs)}>
          {/* Inputs for preferences */}
          <button type="submit">Complete Onboarding</button>
        </form>
      );
    }

    async function saveRecommendation(rec) {
      // Save to user's saved_locations in Supabase
    }
  