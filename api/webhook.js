const axios = require('axios');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const data = req.body;
  
  if (data.transaction_status === 'settlement' || data.transaction_status === 'capture') {
     try {
        const vpaymentUrl = 'https://api.vpayment.com/v1/transaction';
        const vpayResponse = await axios.post(vpaymentUrl, {
            merchant_id: process.env.VPAYMENT_MERCHANT_ID,
            product_code: 'AUTO_DETECT_FROM_DB', 
            target: data.order_id, 
        }, {
            headers: { 'X-API-KEY': process.env.VPAYMENT_API_KEY }
        });
        console.log('Vpayment Success:', vpayResponse.data);
     } catch(err) {
        console.error('Vpayment Error:', err.message);
     }
  }
  res.status(200).json({ status: 'OK' });
}