import { useState, useEffect } from 'react';
import { Plan } from './plans';
import { supabase } from './supabase';

export function useSubscription(userId: string | null): { plan: Plan; isLoading: boolean } {
  const [plan, setPlan] = useState<Plan>('basic');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    supabase
      .from('user_plans')
      .select('plan')
      .eq('user_id', userId)
      .single()
      .then(({ data }) => {
        setPlan((data?.plan as Plan) ?? 'basic');
        setIsLoading(false);
      });
  }, [userId]);

  return { plan, isLoading };
}
