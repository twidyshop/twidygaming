export default function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });

  // Expose ONLY the Public Client Key to the frontend
  res.status(200).json({ 
      clientKey: process.env.MIDTRANS_CLIENT_KEY || ''
  });
}