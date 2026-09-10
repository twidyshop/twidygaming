const midtransClient = require('midtrans-client');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { userId, serverId, price, game, productCode, paymentMethod } = req.body;
  const orderId = `TWIDY-${Date.now()}`;
  const serverIdStr = serverId ? `(${serverId})` : '';

  let snap = new midtransClient.Snap({
    isProduction: true,
    serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  });

  // Map selected payment method to enabled_payments if needed, or let Midtrans show all
  let parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: price,
    },
    item_details: [{
      id: productCode || "GAME-ITEM",
      price: price,
      quantity: 1,
      name: `${game} - ID: ${userId}${serverIdStr}`
    }],
    customer_details: {
      first_name: "Pelanggan",
      last_name: "TwidyShop",
    }
  };

  if (paymentMethod && paymentMethod !== 'qris') {
     // Optional: restrict or prioritize specific payment methods if supported by Snap
  }

  try {
    const transaction = await snap.createTransaction(parameter);
    res.status(200).json({ token: transaction.token, orderId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}