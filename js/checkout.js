// Client-side Stripe Checkout
const STRIPE_PUBLIC_KEY = 'pk_test_51T4WcsCyvj2kuPvedD11L8LFAlulgcVr10NuE0c3kaatnj2AeNCQwPC9M8VcGPE1021IGdX70cIURRCjm44L0ore00THY7lbC9';

const PRICES = {
  'video-transcription': 'price_1T4aYwCyvj2kuPveunx56EgG',
  'x-automation': 'price_1T4aYxCyvj2kuPve3xYNhRx4',
  'playbook': 'price_1T4aYxCyvj2kuPveMEGsOEbI'
};

async function checkout(product) {
  const button = document.querySelector(`[data-product="${product}"]`);
  if (button) {
    button.classList.add('loading');
    button.textContent = 'Redirecting...';
  }

  try {
    const stripe = Stripe(STRIPE_PUBLIC_KEY);
    const priceId = PRICES[product];
    
    if (!priceId) {
      throw new Error('Invalid product');
    }

    const { error } = await stripe.redirectToCheckout({
      lineItems: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'payment',
      successUrl: 'https://shopcliffmart.com/checkout/success.html',
      cancelUrl: 'https://shopcliffmart.com/checkout/cancel.html',
    });

    if (error) {
      throw error;
    }
  } catch (err) {
    alert('Error: ' + err.message);
    if (button) {
      button.classList.remove('loading');
      button.textContent = 'Buy Now';
    }
  }
}