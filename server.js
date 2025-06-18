// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Initialize Stripe only if secret key is provided
let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  console.log('✅ Stripe initialized with secret key');
} else {
  console.log('⚠️  Stripe secret key not found. Running in demo mode.');
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.raw({ type: 'application/json' }));

// Mock data storage
const raffleData = {
  'user1': { ticketCount: 5 },
  'user2': { ticketCount: 2 },
  'user3': { ticketCount: 0 },
  'default': { ticketCount: 1 }
};

// Track enrolled users
const enrolledUsers = new Set();

// Track created collectibles
const createdCollectibles = new Map();

// Helper function to enroll user
const enrollUser = (userId, platform = 'Evaltree') => {
  try {
    enrolledUsers.add(userId);
    console.log(`✅ User ${userId} enrolled in ${platform} ecosystem`);
    console.log('Current enrolled users:', Array.from(enrolledUsers));
    return true;
  } catch (error) {
    console.error('Error enrolling user:', error);
    return false;
  }
};

// Helper function to generate unique collectible ID
const generateCollectibleId = () => {
  return `collectible_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const prizePool = [
  "€10 Gift Card",
  "€25 Gift Card", 
  "€50 Gift Card",
  "Free Collectible",
  "Premium Membership",
  "€100 Cash Prize",
  "Exclusive NFT",
  "VIP Event Access"
];

// API Routes
let userData = 0;
// GET /api/raffle-status
app.get('/api/raffle-status', (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const userData =raffleData.default;

  res.json({
    userId: userId,
    ticketCount: userData.ticketCount,
    lastUpdated: new Date().toISOString()
  });
});

// POST /api/raffle-award
app.post('/api/raffle-award', (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  // Random prize selection
  const randomPrize = prizePool[Math.floor(Math.random() * prizePool.length)];

  // Reset ticket count after award
  if (raffleData[userId]) {
    raffleData[userId].ticketCount = 0;
  }

  res.json({
    success: true,
    userId: userId,
    prize: randomPrize,
    awardedAt: new Date().toISOString(),
    message: `Congratulations! You won: ${randomPrize}`
  });
});

// POST /api/enroll
app.post('/api/enroll', (req, res) => {
  const { userId, platform } = req.body;

  if (!userId || !platform) {
    return res.status(400).json({ error: 'User ID and platform are required' });
  }

  try {
    // Use helper function to enroll user
    const success = enrollUser(userId, platform);

    if (success) {
      res.json({
        success: true,
        userId: userId,
        platform: platform,
        enrolledAt: new Date().toISOString(),
        message: `Successfully enrolled ${userId} in ${platform} ecosystem`
      });
    } else {
      res.status(500).json({ error: 'Failed to enroll user' });
    }
  } catch (error) {
    console.error('Error enrolling user:', error);
    res.status(500).json({ error: 'Failed to enroll user' });
  }
});

// GET /api/enrollment-status
app.get('/api/enrollment-status', (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const isEnrolled = enrolledUsers.has(userId);

  res.json({
    userId: userId,
    isEnrolled: isEnrolled,
    enrolledAt: isEnrolled ? new Date().toISOString() : null
  });
});

// POST /api/createCollectible
app.post('/api/createCollectible', (req, res) => {
  const { title, description, editionCap, price, imageUrl, userId } = req.body;

  if (!title || !editionCap || !price || !userId) {
    return res.status(400).json({ 
      error: 'Title, edition cap, price, and user ID are required' 
    });
  }

  try {
    // Generate unique collectible ID
    const collectibleId = generateCollectibleId();
    
    // Create collectible object
    const collectible = {
      id: collectibleId,
      title: title,
      description: description || 'Limited edition digital collectible',
      editionCap: parseInt(editionCap),
      available: parseInt(editionCap), // Initially all editions are available
      price: parseFloat(price),
      imageUrl: imageUrl || '/placeholder.svg?height=300&width=300',
      createdBy: userId,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    // Store collectible
    createdCollectibles.set(collectibleId, collectible);

    console.log(`✅ Collectible created: ${title} (ID: ${collectibleId})`);
    console.log(`📊 Total collectibles created: ${createdCollectibles.size}`);

    res.json({
      success: true,
      collectible: collectible,
      message: `Successfully created collectible: ${title}`
    });
  } catch (error) {
    console.error('Error creating collectible:', error);
    res.status(500).json({ error: 'Failed to create collectible' });
  }
});

// GET /api/collectibles
app.get('/api/collectibles', (req, res) => {
  try {
    const collectibles = Array.from(createdCollectibles.values());
    res.json({
      success: true,
      collectibles: collectibles,
      total: collectibles.length
    });
  } catch (error) {
    console.error('Error fetching collectibles:', error);
    res.status(500).json({ error: 'Failed to fetch collectibles' });
  }
});

// POST /api/create-checkout-session
app.post('/api/create-checkout-session', async (req, res) => {
  const { price, userId, isIssued, title } = req.body;

  if (!price || !userId) {
    return res.status(400).json({ error: 'Price and User ID are required' });
  }

  try {
    if (stripe) {
      // Real Stripe integration
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: title || 'Digital Collectible',
                description: 'Limited edition digital art piece',
              },
              unit_amount: price, // amount in cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}&userId=${userId}`,
        cancel_url: `${req.headers.origin}/cancel`,
        metadata: {
          userId: userId,
          isIssued: isIssued,
          title: title
        },
      });

      res.json(session);
    } else {
      // Demo mode - mock session
      const mockSession = {
        id: `cs_${Math.random().toString(36).substr(2, 9)}`,
        url: `https://checkout.stripe.com/pay/${Math.random().toString(36).substr(2, 9)}`,
        amount_total: price,
        currency: 'eur',
        metadata: {
          userId: userId,
          isIssued: isIssued,
          title: title
        }
      };

      // Add raffle ticket for demo mode
      if (!raffleData[userId]) {
        raffleData[userId] = { ticketCount: 0 };
      }
      raffleData[userId].ticketCount += 1;

      // Automatically enroll user in demo mode using the enrollment function
      const enrollmentSuccess = enrollUser(userId, 'Evaltree');
      if (enrollmentSuccess) {
        console.log(`🎉 User ${userId} successfully enrolled in demo mode!`);
      } else {
        console.log(`❌ Failed to enroll user ${userId} in demo mode`);
      }

      res.json(mockSession);
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// POST /api/webhook
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe) {
    console.log('Webhook received but Stripe not configured');
    return res.json({ received: true, mode: 'demo' });
  }

  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      
      // Add raffle ticket for successful payment
      const userId = session.metadata.userId;
      if (userId) {
        if (!raffleData[userId]) {
          raffleData[userId] = { ticketCount: 0 };
        }
        raffleData[userId].ticketCount += 1;
        console.log(`Payment successful for user ${userId}. Raffle ticket added.`);
        
        // Automatically enroll user in ecosystem using the enrollment function
        const enrollmentSuccess = enrollUser(userId, 'Evaltree');
        if (enrollmentSuccess) {
          console.log(`🎉 User ${userId} successfully enrolled after purchase!`);
        } else {
          console.log(`❌ Failed to enroll user ${userId} after purchase`);
        }
      }
      break;
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API server is running',
    stripe: stripe ? 'configured' : 'demo mode'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 API Server is running on port ${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api/`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`💳 Stripe mode: ${stripe ? 'REAL PAYMENTS' : 'DEMO MODE'}`);
}); 