# Quick Setup Guide for Real Stripe Payments

## 🚀 Get Started in 5 Minutes

### 1. Get Your Stripe Keys
1. Go to [stripe.com](https://stripe.com) and create an account
2. Navigate to **Developers → API keys** in your dashboard
3. Copy your **Publishable key** (starts with `pk_test_`)
4. Copy your **Secret key** (starts with `sk_test_`)

### 2. Configure Environment
1. Copy the environment template:
   ```bash
   cp env.template .env
   ```

2. Edit `.env` and replace the placeholder values:
   ```
   REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
   STRIPE_SECRET_KEY=sk_test_your_actual_key_here
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   PORT=3001
   ```

### 3. Set Up Webhooks (Local Development)
1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Run this command in a new terminal:
   ```bash
   stripe listen --forward-to localhost:3001/api/webhook
   ```
3. Copy the webhook secret (starts with `whsec_`) and add it to your `.env`

### 4. Start the Application
```bash
npm run dev
```

### 5. Test Payments
Use these test card numbers:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`

## ✅ What Happens Now

1. **Real Payments**: Users can make actual payments through Stripe
2. **Automatic Raffle Tickets**: Tickets are awarded via webhooks
3. **Secure Processing**: All payments are processed securely by Stripe
4. **Success/Cancel Pages**: Users are redirected appropriately

## 🔧 Troubleshooting

- **Payment not working?** Check your Stripe keys are correct
- **Raffle tickets not updating?** Ensure webhook is running
- **Server not starting?** Check your `.env` file is configured

## 🎯 Next Steps

- Test with real cards in production
- Set up webhook endpoint on your domain
- Monitor payments in Stripe Dashboard
- Customize success/cancel pages

Your app is now ready for real payments! 🎉 