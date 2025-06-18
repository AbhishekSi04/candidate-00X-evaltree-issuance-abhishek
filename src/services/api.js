// Mock API service for raffle and checkout functionality
// This simulates the backend API without requiring a separate server

// Mock data storage
let raffleData = {
  'user1': { ticketCount: 5 },
  'user2': { ticketCount: 2 },
  'user3': { ticketCount: 0 },
  'default': { ticketCount: 1 }
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

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // GET /api/raffle-status
  async getRaffleStatus(userId) {
    await delay(100); // Simulate network delay
    
    if (!userId) {
      throw new Error('User ID is required');
    }

    const userData = raffleData[userId] || raffleData['default'];

    return {
      userId: userId,
      ticketCount: userData.ticketCount,
      lastUpdated: new Date().toISOString()
    };
  },

  // POST /api/raffle-award
  async triggerRaffleAward(userId) {
    await delay(200); // Simulate network delay
    
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Random prize selection
    const randomPrize = prizePool[Math.floor(Math.random() * prizePool.length)];

    // Reset ticket count after award
    if (raffleData[userId]) {
      raffleData[userId].ticketCount = 0;
    }

    return {
      success: true,
      userId: userId,
      prize: randomPrize,
      awardedAt: new Date().toISOString(),
      message: `Congratulations! You won: ${randomPrize}`
    };
  },

  // POST /api/create-checkout-session
  async createCheckoutSession(price, userId, isIssued) {
    await delay(300); // Simulate network delay
    
    if (!price || !userId) {
      throw new Error('Price and User ID are required');
    }

    // Mock Stripe checkout session creation
    const mockSession = {
      id: `cs_${Math.random().toString(36).substr(2, 9)}`,
      url: `https://checkout.stripe.com/pay/${Math.random().toString(36).substr(2, 9)}`,
      amount_total: price,
      currency: 'eur',
      metadata: {
        userId: userId,
        isIssued: isIssued
      }
    };

    // Add raffle ticket for successful purchase simulation
    if (!raffleData[userId]) {
      raffleData[userId] = { ticketCount: 0 };
    }
    raffleData[userId].ticketCount += 1;

    return mockSession;
  }
}; 