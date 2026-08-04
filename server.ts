import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { Trip, Batch, Booking, DatabaseState } from './src/sharetour/types';

// Load environment variables
dotenv.config();

const PORT = 3000;
const DB_PATH = path.join(process.cwd(), 'src', 'db.json');

// Helper to generate a unique booking code: SJ-[6 RANDOM ALPHANUMERIC CHARACTERS]
function generateUniqueBookingCode(existingCodes: string[]): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let attempt = 0;
  while (attempt < 1000) {
    let code = 'SJ-';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const exists = existingCodes.some(c => c.toUpperCase() === code.toUpperCase());
    if (!exists) {
      return code;
    }
    attempt++;
  }
  return 'SJ-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Initial Mock/Pre-seeded DB
const defaultDB: DatabaseState = {
  trips: [
    {
      id: 'trip-2',
      title: 'Ancient Java: Bromo Sunrise & Mt. Ijen Blue Fire',
      slug: 'bromo-ijen',
      location: 'East Java (Probolinggo & Banyuwangi)',
      duration: '3 Days 2 Nights',
      description: 'Witness the surreal sea of sand surrounding Mount Bromo, feel the cold mountain air as the sun rises over smoke-venting volcanos, and venture deep inside Mount Ijen to see the magical neon-blue sulfuric fire of Banyuwangi.',
      coverImage: 'https://images.unsplash.com/photo-1605538032432-a9f0c8d9baac?auto=format&fit=crop&w=1200&q=80',
      included: [
        'AC Transport throughout Java tour (3 days)',
        '4x4 Private Jeep in Mount Bromo',
        'Local mountain guides for Bromo & Ijen',
        'Entrance fees for Bromo and Ijen National Parks',
        '1 Night at Bromo mountain lodge, 1 Night at Banyuwangi hotel',
        'Gas masks for Mt. Ijen sulfuric fumes',
        'Daily mineral water and breakfast'
      ],
      excluded: [
        'Lunch and Dinner meals',
        'Horse riding fees in Bromo',
        'Flights or trains to Surabaya/Malang',
        'Tips for guides and drivers'
      ],
      highlight: 'Private 4x4 Jeep sunrise convoy across Bromo\'s whispering sand sea, and a midnight trek into Ijen crater to see the rare glowing sulfuric blue flame.',
      gallery: [
        'https://images.unsplash.com/photo-1605538032432-a9f0c8d9baac?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format'
      ],
      faq: [
        {
          question: 'Do you supply protective equipment?',
          answer: 'Yes, we provide professional active-carbon gas masks and headlamps for the Mt. Ijen sulfur hike.'
        }
      ],
      status: 'published',
      startingPrice: 150,
      price: 150,
      itinerary: [
        {
          day: 1,
          title: 'Pick up from Surabaya & Bromo Mountain Check-in',
          description: 'Pick up from Surabaya Airport/Train Station. Enjoy a private scenic 4-hour drive to Cemoro Lawang village. Check into your cozy room sitting directly on the rim of the Tengger Caldera. Feel the crisp mountain air and rest early for the pre-dawn expedition.',
          timeSchedules: [
            { time: '12:00', activity: 'Surabaya airport pickup & meet private driver' },
            { time: '16:00', activity: 'Check-in at mountain caldera overlook lodge' }
          ]
        },
        {
          day: 2,
          title: 'Bromo Sunrise, Crater Trek & Banyuwangi Drive',
          description: 'Wake up at 3:00 AM. Board your private 4x4 Jeep to Penanjakan viewpoint to witness the world-famous sunrise over Mt. Bromo, Mt. Batok, and Mt. Semeru. Afterward, cross the dramatic Whispering Sand and hike 250 steps to Bromo\'s active crater rim. Return, check out, and take a 6-hour scenic drive to Banyuwangi.',
          timeSchedules: [
            { time: '03:00', activity: 'Board 4x4 Offroad Jeep to sunrise overlook' },
            { time: '08:00', activity: 'Volcanic crater rim hike & Whispering Sand crossing' },
            { time: '12:00', activity: 'Checkout and transfer drive to Banyuwangi' }
          ]
        },
        {
          day: 3,
          title: 'Ijen Midnight Hike, Blue Flame Experience & Bali Ferry Transfer',
          description: 'Start at 1:00 AM. Hike 2 hours up Mount Ijen. Descent safely into the crater alongside sulfur miners to see the stunning Neon Blue Acid Flames of Ijen. Walk around the giant turquoise acidic lake at sunrise. Return to base for breakfast, then transfer to Banyuwangi harbor or catch a ferry to Bali.',
          timeSchedules: [
            { time: '01:00', activity: 'Midnight departure and trek up Mt. Ijen summit' },
            { time: '03:30', activity: 'Sulfur crater descent & glowing blue fire viewing' },
            { time: '06:00', activity: 'Sunrise view over toxic acid green lake' },
            { time: '11:00', activity: 'Breakfast checkout & ferry transfer drop-off' }
          ]
        }
      ]
    }
  ],
  batches: [
    {
      id: 'batch-4',
      tripId: 'trip-2',
      departureDate: '2026-07-22',
      quota: 12,
      availableSeats: 12,
      price: 150,
      status: 'Open'
    },
    {
      id: 'batch-5',
      tripId: 'trip-2',
      departureDate: '2026-08-18',
      quota: 12,
      availableSeats: 12,
      price: 150,
      status: 'Open'
    }
  ],
  bookings: []
};

function readDB(): DatabaseState {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const parentDir = path.dirname(DB_PATH);
      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
      }
      fs.writeFileSync(DB_PATH, JSON.stringify(defaultDB, null, 2), 'utf8');
      return defaultDB;
    }
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    const db = JSON.parse(raw) as DatabaseState;
    return db;
  } catch (error) {
    console.error('Error reading database file, returning default map:', error);
    return defaultDB;
  }
}

function writeDB(data: DatabaseState) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing database file:', error);
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '15mb' }));

  // -------------------------------------------------------------
  // Share Tour Database & Core API Routes
  // -------------------------------------------------------------

  app.get('/api/db', (req, res) => {
    try {
      const db = readDB();
      res.json(db);
    } catch {
      res.status(500).json({ error: 'Failed to read database state' });
    }
  });

  app.post('/api/import-bulk', (req, res) => {
    try {
      const { trips: newTrips, batches: newBatches, mode } = req.body;
      const db = readDB();

      if (mode === 'overwrite') {
        db.trips = newTrips || [];
        db.batches = newBatches || [];
      } else {
        if (newTrips && newTrips.length > 0) {
          db.trips = [...db.trips, ...newTrips];
        }
        if (newBatches && newBatches.length > 0) {
          db.batches = [...db.batches, ...newBatches];
        }
      }

      writeDB(db);
      res.json({ success: true, tripsCount: db.trips.length, batchesCount: db.batches.length });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to process bulk import of trips and batches' });
    }
  });

  app.post('/api/trips', (req, res) => {
    try {
      const db = readDB();
      const newTrip: Trip = {
        ...req.body,
        id: 'trip-' + Date.now().toString()
      };
      db.trips.push(newTrip);
      writeDB(db);
      res.status(201).json(newTrip);
    } catch {
      res.status(500).json({ error: 'Failed to save trip' });
    }
  });

  app.put('/api/trips/:id', (req, res) => {
    try {
      const db = readDB();
      const index = db.trips.findIndex((t) => t.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ error: 'Trip not found' });
      }
      db.trips[index] = { ...db.trips[index], ...req.body };
      writeDB(db);
      res.json(db.trips[index]);
    } catch {
      res.status(500).json({ error: 'Failed to update trip' });
    }
  });

  app.delete('/api/trips/:id', (req, res) => {
    try {
      const db = readDB();
      db.trips = db.trips.filter((t) => t.id !== req.params.id);
      db.batches = db.batches.filter((b) => b.tripId !== req.params.id);
      writeDB(db);
      res.json({ success: true });
    } catch {
      res.status(500).json({ error: 'Failed to delete trip' });
    }
  });

  app.post('/api/batches', (req, res) => {
    try {
      const db = readDB();
      const newBatch: Batch = {
        ...req.body,
        id: 'batch-' + Date.now().toString()
      };
      db.batches.push(newBatch);
      writeDB(db);
      res.status(201).json(newBatch);
    } catch {
      res.status(500).json({ error: 'Failed to create batch' });
    }
  });

  app.put('/api/batches/:id', (req, res) => {
    try {
      const db = readDB();
      const index = db.batches.findIndex((b) => b.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ error: 'Batch not found' });
      }
      db.batches[index] = { ...db.batches[index], ...req.body };
      writeDB(db);
      res.json(db.batches[index]);
    } catch {
      res.status(500).json({ error: 'Failed to update batch' });
    }
  });

  app.delete('/api/batches/:id', (req, res) => {
    try {
      const db = readDB();
      db.batches = db.batches.filter((b) => b.id !== req.params.id);
      writeDB(db);
      res.json({ success: true });
    } catch {
      res.status(500).json({ error: 'Failed to delete batch' });
    }
  });

  app.post('/api/bookings', (req, res) => {
    try {
      const db = readDB();
      const payload = req.body;
      
      const batchIndex = db.batches.findIndex((b) => b.id === payload.batchId);
      if (batchIndex === -1) {
        return res.status(404).json({ error: 'Departure batch not found' });
      }
      
      const batch = db.batches[batchIndex];
      const count = Number(payload.participantsCount);

      if (batch.status === 'Closed' || batch.availableSeats < count) {
        return res.status(400).json({ error: 'Requested batch quota is insufficient' });
      }

      batch.availableSeats -= count;
      if (batch.availableSeats <= 0) {
        batch.status = 'Closed';
      }

      const trip = db.trips.find((t) => t.id === payload.tripId);

      const newBooking: Booking = {
        id: 'book-' + Date.now().toString(),
        bookingCode: generateUniqueBookingCode(db.bookings.map(b => b.bookingCode)),
        tripId: payload.tripId,
        tripTitle: trip ? trip.title : 'Unknown Trip',
        batchId: payload.batchId,
        departureDate: batch.departureDate,
        fullName: payload.fullName || payload.participantData?.name || 'Unknown traveler',
        email: payload.email || payload.participantData?.email || 'unknown@example.com',
        phone: payload.phone || payload.participantData?.whatsapp || 'N/A',
        participantsCount: count || 1,
        participantsNames: payload.participantsNames || [payload.fullName || payload.participantData?.name || 'Unknown traveler'],
        proofOfPayment: payload.proofOfPayment || 'NOT_APPLICABLE_SLEEK_THEME',
        status: 'Pending',
        totalPrice: payload.totalPrice || (batch ? batch.price : 0),
        createdAt: new Date().toISOString(),
        participantData: payload.participantData,
        adminNotes: payload.adminNotes || ''
      };

      db.bookings.push(newBooking);
      writeDB(db);

      res.status(201).json(newBooking);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Failed to register booking' });
    }
  });

  app.put('/api/bookings/:id', (req, res) => {
    try {
      const db = readDB();
      const index = db.bookings.findIndex((b) => b.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ error: 'Booking code not found' });
      }

      const originalBooking = db.bookings[index];
      const nextBooking = { ...originalBooking, ...req.body };

      if (nextBooking.status === 'Rejected' && originalBooking.status !== 'Rejected') {
        const bIdx = db.batches.findIndex((b) => b.id === originalBooking.batchId);
        if (bIdx !== -1) {
          db.batches[bIdx].availableSeats += originalBooking.participantsCount;
          if (db.batches[bIdx].availableSeats > 0) {
            db.batches[bIdx].status = 'Open';
          }
        }
      }
      if (originalBooking.status === 'Rejected' && nextBooking.status !== 'Rejected') {
        const bIdx = db.batches.findIndex((b) => b.id === originalBooking.batchId);
        if (bIdx !== -1) {
          db.batches[bIdx].availableSeats -= originalBooking.participantsCount;
          if (db.batches[bIdx].availableSeats < 0) db.batches[bIdx].availableSeats = 0;
          if (db.batches[bIdx].availableSeats <= 0) {
            db.batches[bIdx].status = 'Closed';
          }
        }
      }

      db.bookings[index] = nextBooking;
      writeDB(db);
      res.json(db.bookings[index]);
    } catch {
      res.status(500).json({ error: 'Failed to update booking' });
    }
  });

  app.post('/api/bookings/purge', (req, res) => {
    try {
      const db = readDB();
      db.bookings = [];
      db.batches.forEach((b) => {
        b.availableSeats = b.quota;
        b.status = 'Open';
      });
      writeDB(db);
      res.json({ success: true, message: 'All bookings cleared and batch quotas reset.' });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Failed to purge bookings database' });
    }
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const validEmails = ['sawahjayagroup@gmail.com', 'admin@smartjourney.com'];
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are both required.' });
    }

    if (validEmails.includes(email.trim().toLowerCase()) && password === 'smartjourney2026') {
      res.json({ token: 'admin-smart-journey-token', success: true });
    } else {
      res.status(401).json({ error: 'Invalid email or passcode. Please try again.' });
    }
  });

  // -------------------------------------------------------------
  // Midtrans API Routes
  // -------------------------------------------------------------

  // Endpoint to fetch public configuration
  app.get('/api/midtrans/config', (req, res) => {
    const rawServerKey = process.env.MIDTRANS_SERVER_KEY || '';
    const rawClientKey = process.env.VITE_MIDTRANS_CLIENT_KEY || '';
    const rawIsProduction = process.env.MIDTRANS_IS_PRODUCTION || 'false';

    const serverKey = rawServerKey.replace(/^["']|["']$/g, '').trim();
    const clientKey = rawClientKey.replace(/^["']|["']$/g, '').trim();
    let isProduction = rawIsProduction.replace(/^["']|["']$/g, '').trim() === 'true';

    // Auto-detect production keys (they do not start with 'SB-')
    if (serverKey && !serverKey.startsWith('SB-')) {
      isProduction = true;
    }

    res.json({
      isConfigured: !!serverKey,
      clientKey: clientKey,
      isProduction: isProduction,
      message: serverKey 
        ? "Midtrans is configured and ready." 
        : "Midtrans keys are not set. The application is running in Demo Simulation Mode."
    });
  });

  // Endpoint to create a Midtrans Snap Token
  app.post('/api/midtrans/token', async (req, res) => {
    try {
      const { 
        orderId, 
        amount, 
        customerName, 
        customerEmail, 
        customerPhone, 
        serviceName 
      } = req.body;

      if (!orderId || !amount || !serviceName) {
        return res.status(400).json({ error: 'Missing required fields: orderId, amount, serviceName' });
      }

      const rawServerKey = process.env.MIDTRANS_SERVER_KEY || '';
      const rawIsProduction = process.env.MIDTRANS_IS_PRODUCTION || 'false';

      const serverKey = rawServerKey.replace(/^["']|["']$/g, '').trim();
      let isProduction = rawIsProduction.replace(/^["']|["']$/g, '').trim() === 'true';

      // Auto-detect production keys (they do not start with 'SB-')
      if (serverKey && !serverKey.startsWith('SB-')) {
        isProduction = true;
      }

      // Graceful fallback for Demo Simulation Mode if Server Key is missing
      if (!serverKey) {
        console.warn('MIDTRANS_SERVER_KEY is missing. Providing simulated Snap redirect URL.');
        
        // Build simulated query params
        const qParams = new URLSearchParams({
          id: orderId,
          amount: String(amount),
          service: serviceName,
          name: customerName || 'Guest Customer',
          email: customerEmail || 'sawahjayatrans@gmail.com',
          phone: customerPhone || '085212347289'
        });

        return res.json({
          token: `demo-token-${orderId}-${Math.floor(100000 + Math.random() * 900000)}`,
          redirect_url: `/#/midtrans-pay?${qParams.toString()}`,
          isDemo: true,
          message: 'Operating in Demo Simulation Mode. Set MIDTRANS_SERVER_KEY to use real Midtrans Snap.'
        });
      }

      // Midtrans Snap API Url
      const midtransUrl = isProduction
        ? 'https://app.midtrans.com/snap/v1/transactions'
        : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

      // Midtrans Authorization: Basic base64(serverKey + ":")
      const authHeader = Buffer.from(`${serverKey}:`).toString('base64');

      // Setup payload matching Midtrans specifications
      const payload = {
        transaction_details: {
          order_id: `${orderId}-${Date.now()}`, // Append unique timestamp to bypass Sandbox duplicate ID limits
          gross_amount: Math.round(amount)
        },
        customer_details: {
          first_name: customerName || 'Guest Customer',
          email: customerEmail || 'customer@example.com',
          phone: customerPhone || '085212347289'
        },
        item_details: [
          {
            id: orderId,
            price: Math.round(amount),
            quantity: 1,
            name: serviceName.substring(0, 50) // Midtrans requires <= 50 characters for item names
          }
        ]
      };

      console.log(`Requesting Midtrans Snap token for order: ${orderId}, amount: IDR ${amount}`);

      const response = await fetch(midtransUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Basic ${authHeader}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Midtrans API Error response:', errorText);
        return res.status(response.status).json({
          error: `Midtrans Snap API returned error status ${response.status}`,
          details: errorText
        });
      }

      const data: any = await response.json();
      return res.json({
        token: data.token,
        redirect_url: data.redirect_url,
        isDemo: false
      });

    } catch (error: any) {
      console.error('Midtrans Snap backend handler crashed:', error);
      return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  });

  // Endpoint to handle Midtrans Webhook Notifications
  app.post('/api/midtrans/notification', async (req, res) => {
    try {
      const notification = req.body;
      const { order_id, transaction_status, fraud_status } = notification;

      if (!order_id) {
        return res.status(400).json({ error: 'Missing order_id in notification body' });
      }

      console.log(`[Midtrans Webhook] Received notification for order_id: ${order_id}, status: ${transaction_status}`);

      const db = readDB();

      // Look up booking in ShareTour DB by checking order_id match
      const booking = db.bookings.find(b => 
        order_id.includes(b.bookingCode) || order_id.includes(b.id) || b.id === order_id || b.bookingCode === order_id
      );

      if (booking) {
        let isFailed = false;

        if (transaction_status === 'capture') {
          if (fraud_status === 'challenge') {
            booking.status = 'Pending';
          } else if (fraud_status === 'accept') {
            booking.status = 'Confirmed';
          }
        } else if (transaction_status === 'settlement') {
          booking.status = 'Confirmed';
        } else if (transaction_status === 'cancel' || transaction_status === 'deny' || transaction_status === 'expire') {
          if (booking.status !== 'Rejected') {
            booking.status = 'Rejected';
            isFailed = true;
          }
        } else if (transaction_status === 'pending') {
          booking.status = 'Pending';
        }

        // Lock/unlock seat quota on failure
        if (isFailed) {
          const batchIdx = db.batches.findIndex(b => b.id === booking.batchId);
          if (batchIdx !== -1) {
            db.batches[batchIdx].availableSeats += booking.participantsCount;
            if (db.batches[batchIdx].availableSeats > db.batches[batchIdx].quota) {
              db.batches[batchIdx].availableSeats = db.batches[batchIdx].quota;
            }
            if (db.batches[batchIdx].availableSeats > 0) {
              db.batches[batchIdx].status = 'Open';
            }
          }
        }

        writeDB(db);
        console.log(`[Midtrans Webhook] Updated ShareTour booking ${booking.bookingCode} status to ${booking.status}`);
        return res.json({ success: true, bookingCode: booking.bookingCode, status: booking.status });
      }

      return res.json({ success: true, message: 'Notification received successfully' });
    } catch (error: any) {
      console.error('Midtrans notification handler error:', error);
      return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  });

  // -------------------------------------------------------------
  // Frontend Asset Handling (Vite / Static production)
  // -------------------------------------------------------------

  if (process.env.NODE_ENV !== 'production') {
    // Development Mode: Use Vite Dev Server Middleware
    console.log('Running in Development mode. Mounting Vite Dev Server Middleware...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode: Serve Compiled Frontend Assets from /dist
    console.log('Running in Production mode. Serving static assets from /dist...');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SmartJourney Fullstack Engine] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
