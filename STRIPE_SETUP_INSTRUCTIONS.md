# Stripe Setup Instructions

## Problem
The subscription functionality is not working because Stripe is not properly configured.

## Solution
You need to set up real Stripe API keys to enable payments.

### Steps:

1. **Create a Stripe Account**
   - Go to https://stripe.com
   - Sign up for a free account
   - Complete the verification process

2. **Get Your API Keys**
   - Go to your Stripe Dashboard
   - Navigate to Developers > API keys
   - Copy your **Publishable key** and **Secret key**
   - For testing, use the **Test** keys (they start with `pk_test_` and `sk_test_`)

3. **Update Environment Variables**
   Create a `.env.local` file in your project root and add:
   ```
   STRIPE_SECRET_KEY=sk_test_your_secret_key_here
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   ```

4. **Create Products and Prices in Stripe**
   - Go to Products in your Stripe Dashboard
   - Create a product called "AxIom Pro Subscription"
   - Add two prices:
     - Monthly: $20/month
     - Annual: $144/year
   - Copy the Price IDs and add them to your `.env.local`:
   ```
   NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID=price_your_monthly_price_id
   NEXT_PUBLIC_STRIPE_PRO_ANNUAL_PRICE_ID=price_your_annual_price_id
   ```

5. **Restart Your Development Server**
   ```bash
   npm run dev
   ```

## Current Status
- ✅ Code is ready for Stripe integration
- ❌ Stripe API keys are not configured
- ❌ Stripe products/prices are not set up

## Test Mode
While in test mode, you can use Stripe's test card numbers:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

For more test cards, see: https://stripe.com/docs/testing#cards