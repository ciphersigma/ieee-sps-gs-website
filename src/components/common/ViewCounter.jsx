// src/components/common/SimpleViewCounter.jsx
import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const SimpleViewCounter = () => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Create a self-contained Supabase client
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase credentials. Check your .env.local file.");
      setLoading(false);
      return;
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const updateViewCount = async () => {
      try {
        // First, get current count
        const { data, error } = await supabase
          .from('site_stats')
          .select('view_count')
          .eq('id', 'main')
          .single();
        
        if (error) {
          console.error("Error fetching view count:", error);
          
          // If no record exists, create one
          if (error.code === 'PGRST116') {
            await supabase.from('site_stats').insert({
              id: 'main',
              view_count: 1
            });
            setCount(1);
          }
          setLoading(false);
          return;
        }
        
        // Got current count successfully
        const currentCount = data?.view_count || 0;
        const newCount = currentCount + 1;
        
        // Update the counter
        const { error: updateError } = await supabase
          .from('site_stats')
          .update({ view_count: newCount })
          .eq('id', 'main');
          
        if (updateError) {
          console.error("Error updating view count:", updateError);
          setCount(currentCount); // Still show current count
        } else {
          setCount(newCount);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    updateViewCount();
  }, []);
  
  return (
    <div className="flex items-center space-x-2 text-gray-400">
      <Eye size={16} />
      <span>{loading ? "..." : `${count.toLocaleString()} site visits`}</span>
    </div>
  );
};

export default SimpleViewCounter;