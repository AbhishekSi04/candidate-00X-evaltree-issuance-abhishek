# Avaltree React App with Stripe Integration

This React application features a digital collectibles marketplace with Stripe payment integration and a persistent raffle system.

## Features

- **Stripe Checkout Integration**: Secure payment processing for €1 purchases
- **Persistent Raffle Widget**: Real-time ticket tracking and prize claiming
- **Digital Collectibles**: Limited edition digital art pieces
- **Responsive Design**: Modern UI with Tailwind CSS
- **Real Payment Processing**: Live Stripe integration with webhooks

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Stripe Configuration

#### Get Your Stripe Keys
1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Go to the Stripe Dashboard
3. Navigate to Developers → API keys
4. Copy your **Publishable key** and **Secret key**

#### Environment Setup
Copy the environment template and configure your Stripe keys:

```bash
cp env.template .env
```

Edit `.env` and add your actual Stripe keys:
```
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
PORT=3001
```

### 3. Webhook Configuration

#### Set Up Stripe Webhook
1. In your Stripe Dashboard, go to Developers → Webhooks
2. Click "Add endpoint"
3. Set the endpoint URL to: `https://your-domain.com/api/webhook`
4. Select the following events:
   - `checkout.session.completed`
5. Copy the webhook signing secret and add it to your `.env` file

#### For Local Development
Use Stripe CLI to forward webhooks to your local server:

```bash
# Install Stripe CLI
stripe listen --forward-to localhost:3001/api/webhook
```

This will give you a webhook secret starting with `whsec_`. Add this to your `.env` file.

### 4. Start the Application

#### Development Mode (Recommended)
```bash
npm run dev
```
This starts both the React app (port 3000) and the API server (port 3001).

#### Production Mode
```bash
npm run build
npm run server
```

## API Endpoints

The application includes the following API endpoints:

### Raffle System
- `GET /api/raffle-status?userId=<id>` - Get current raffle ticket count
- `POST /api/raffle-award` - Trigger raffle prize distribution

### Payment Processing
- `POST /api/create-checkout-session` - Create Stripe checkout session
- `POST /api/webhook` - Handle Stripe webhooks

## How It Works

### Purchase Flow
1. User clicks "Buy Now" on a collectible
2. StripeCheckout component creates a checkout session via server
3. User is redirected to Stripe Checkout
4. Upon successful payment, Stripe sends webhook to `/api/webhook`
5. Server processes webhook and awards raffle tickets
6. User is redirected to success page

### Raffle System
1. RaffleWidget displays current ticket count
2. Tickets are awarded automatically via webhooks
3. Users can claim prizes using the "Claim Prize" button
4. Ticket count resets after claiming

### Webhook Processing
- Server receives webhook from Stripe
- Verifies webhook signature for security
- Processes `checkout.session.completed` events
- Awards raffle tickets to users
- Logs successful payments

## Testing

### Test Cards
Use these Stripe test card numbers:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

### Test Mode
- All payments are processed in test mode
- No real charges are made
- Use test card numbers for testing

## File Structure

```
src/
├── components/
│   ├── StripeCheckout.jsx      # Payment processing
│   ├── RaffleWidget.jsx        # Raffle system UI
│   ├── CollectibleCard.jsx     # Individual collectible
│   ├── SuccessPage.jsx         # Payment success page
│   ├── CancelPage.jsx          # Payment cancel page
│   └── ...
├── services/
│   └── api.js                  # Mock API service (fallback)
├── App.js                      # Main application
└── index.css                   # Global styles

server.js                       # Express API server with Stripe
```

## Security Notes

- **Never commit your Stripe secret key** to version control
- Use environment variables for all sensitive configuration
- Webhook signatures are verified for security
- Implement proper authentication in production
- Add rate limiting to API endpoints

## Production Deployment

### Environment Variables
Ensure these are set in your production environment:
- `REACT_APP_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

### Webhook URL
Update your Stripe webhook endpoint URL to your production domain:
```
https://your-domain.com/api/webhook
```

### SSL Certificate
Ensure your production server has a valid SSL certificate for webhook security.

## Troubleshooting

### Common Issues

1. **Webhook not receiving events**: Check webhook URL and SSL certificate
2. **Payment not processing**: Verify Stripe keys are correct
3. **Raffle tickets not updating**: Check webhook endpoint is working
4. **CORS errors**: Ensure server is running on correct port

### Development Tips

- Use Stripe CLI for local webhook testing
- Check Stripe Dashboard for payment status
- Monitor server logs for webhook events
- Use browser dev tools to monitor API calls

## License

This project is for demonstration purposes. Please ensure compliance with Stripe's terms of service for production use. 