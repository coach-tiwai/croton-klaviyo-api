import axios from 'axios';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  const { email, first_name, last_name } = req.body;

  try {
    const response = await axios.post(
      'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/',
      {
        data: {
          type: 'profile-subscription-bulk-create-job',
          attributes: {
            list_id: 'RJfme4',
            profiles: [
              {
                email,
                first_name,
                last_name,
                consent: ['EMAIL']
              }
            ]
          }
        }
      },
      {
        headers: {
          Authorization: `Klaviyo-API-Key ${process.env.KLAVIYO_API_KEY}`,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      }
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Klaviyo API error:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to subscribe' });
  }
}
