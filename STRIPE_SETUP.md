# Stripe Setup Guide - Manual Configuration

## 🎯 Current Status
✅ Server running on port 3001  
✅ React app starting on port 3000  
✅ Stripe integration code ready  

## 📋 Next Steps to Complete Setup

### 1. Configure Environment Variables
1. Copy the environment template:
   ```bash
   cp env.template .env
   ```

2. Edit `.env` and add your Stripe keys:
   ```
   REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
   STRIPE_SECRET_KEY=sk_test_your_actual_key_here
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   PORT=3001
   ```

### 2. Get Your Stripe Keys
1. Go to [stripe.com](https://stripe.com) and sign up/login
2. Navigate to **Developers → API keys**
3. Copy your **Publishable key** (starts with `pk_test_`)
4. Copy your **Secret key** (starts with `sk_test_`)

### 3. Set Up Webhooks (Optional for Testing)
For local development, you can skip webhooks initially and test with demo mode.

**To set up webhooks later:**
1. Download Stripe CLI from: https://stripe.com/docs/stripe-cli
2. Run: `stripe login`
3. Run: `stripe listen --forward-to localhost:3001/api/webhook`
4. Copy the webhook secret to your `.env`

### 4. Test the Application
1. Open your browser to: `http://localhost:3000`
2. Try clicking "Buy Now" on any collectible
3. If Stripe keys are configured, you'll see real Stripe checkout
4. If not configured, you'll see demo mode

### 5. Test Cards
Use these test card numbers:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`

## 🔧 Troubleshooting

### Server Not Starting
- Check if port 3001 is available
- Ensure `.env` file exists
- Check for syntax errors in server.js

### Payment Not Working
- Verify Stripe keys are correct
- Check browser console for errors
- Ensure server is running on port 3001

### Raffle Tickets Not Updating
- Webhooks are required for automatic ticket awarding
- For now, tickets are awarded in demo mode

## 🎉 You're Ready!
Once you add your Stripe keys to `.env`, your app will process real payments!

**Current Status:** ✅ Ready for configuration 