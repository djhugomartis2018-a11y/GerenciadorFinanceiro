import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno&no-check=true';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!);
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;

const PRICE_TO_PLAN: Record<string, string> = {
  [Deno.env.get('STRIPE_PRICE_ESSENTIAL_MONTHLY') ?? '']: 'essential',
  [Deno.env.get('STRIPE_PRICE_ESSENTIAL_YEARLY') ?? '']:  'essential',
  [Deno.env.get('STRIPE_PRICE_PRO_MONTHLY') ?? '']:       'pro',
  [Deno.env.get('STRIPE_PRICE_PRO_YEARLY') ?? '']:        'pro',
};

Deno.serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  if (!signature) return new Response('Missing signature', { status: 400 });

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return new Response('Invalid signature', { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.CheckoutSession;
    const userId = session.metadata?.user_id ?? session.client_reference_id;
    if (!userId) return new Response('Missing user_id', { status: 400 });

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
    const priceId = lineItems.data[0]?.price?.id ?? '';
    const plan = PRICE_TO_PLAN[priceId] ?? 'basic';

    await supabase.from('user_plans').upsert({
      user_id: userId,
      plan,
      status: 'active',
      updated_at: new Date().toISOString(),
    });
  }

  if (
    event.type === 'customer.subscription.deleted' ||
    event.type === 'customer.subscription.paused'
  ) {
    const subscription = event.data.object as Stripe.Subscription;
    const userId = subscription.metadata?.user_id;
    if (!userId) return new Response('Missing user_id', { status: 400 });

    await supabase.from('user_plans').upsert({
      user_id: userId,
      plan: 'basic',
      status: 'canceled',
      updated_at: new Date().toISOString(),
    });
  }

  return new Response('ok', { status: 200 });
});
