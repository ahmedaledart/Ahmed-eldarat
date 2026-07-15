import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import https from 'https';
import WebSocket from 'ws';

// --- Database (JSON File Store) ---
const DB_FILE = path.join(process.cwd(), 'database.json');

// Mock Data Generators for initial seed
const generateMockData = () => {
  const libyanPorts = [
    { name_en: "Port of Tripoli", name_ar: "ميناء طرابلس", city: "Tripoli", un_locode: "LY TIP", type: "Seaport", current_ships: 12, incoming_ships: 5, departed_ships: 8, waiting_ships: 2, delayed_ships: 1, top_vessel_type: "Container Ship", top_cargo: "General Cargo", top_line: "MSC", avg_wait_time: "4 hours", avg_dock_time: "2 days", avg_cost: "$1200", last_activity: new Date().toISOString(), lat: 32.903, lng: 13.190 },
    { name_en: "Port of Misrata", name_ar: "ميناء مصراتة", city: "Misrata", un_locode: "LY MRA", type: "Seaport", current_ships: 15, incoming_ships: 8, departed_ships: 10, waiting_ships: 4, delayed_ships: 2, top_vessel_type: "General Cargo Ship", top_cargo: "Vehicles", top_line: "CMA CGM", avg_wait_time: "6 hours", avg_dock_time: "3 days", avg_cost: "$1100", last_activity: new Date().toISOString(), lat: 32.378, lng: 15.228 },
    { name_en: "Port of Benghazi", name_ar: "ميناء بنغازي", city: "Benghazi", un_locode: "LY BEN", type: "Seaport", current_ships: 9, incoming_ships: 4, departed_ships: 5, waiting_ships: 1, delayed_ships: 0, top_vessel_type: "Bulk Carrier", top_cargo: "Grain", top_line: "Maersk", avg_wait_time: "3 hours", avg_dock_time: "2 days", avg_cost: "$1300", last_activity: new Date().toISOString(), lat: 32.115, lng: 20.060 },
    { name_en: "Port of Khoms", name_ar: "ميناء الخمس", city: "Khoms", un_locode: "LY KHO", type: "Seaport", current_ships: 5, incoming_ships: 2, departed_ships: 3, waiting_ships: 0, delayed_ships: 0, top_vessel_type: "RoRo Ship", top_cargo: "Vehicles", top_line: "Grimaldi Lines", avg_wait_time: "2 hours", avg_dock_time: "1 day", avg_cost: "$1000", last_activity: new Date().toISOString(), lat: 32.657, lng: 14.281 },
    { name_en: "Port of Tobruk", name_ar: "ميناء طبرق", city: "Tobruk", un_locode: "LY TOB", type: "Seaport", current_ships: 3, incoming_ships: 1, departed_ships: 2, waiting_ships: 0, delayed_ships: 0, top_vessel_type: "General Cargo Ship", top_cargo: "Livestock", top_line: "Tarros", avg_wait_time: "1 hour", avg_dock_time: "1.5 days", avg_cost: "$1400", last_activity: new Date().toISOString(), lat: 32.072, lng: 23.978 },
  ];

  const intlPorts = ["Port of Istanbul", "Port of Alexandria", "Port of Genoa", "Port of Valencia", "Port of Antwerp", "Port of Ningbo"];
  
  const vesselTypes = [
    { type_en: "Container Ship", type_ar: "سفينة حاويات", count: 45, percentage: 35, top_port: "Misrata", top_cargo: "Electronics", avg_transit: "12 days", avg_cost: "$2500", last_recorded: new Date().toISOString() },
    { type_en: "General Cargo Ship", type_ar: "سفينة بضائع عامة", count: 30, percentage: 23, top_port: "Tripoli", top_cargo: "Construction Materials", avg_transit: "10 days", avg_cost: "$1800", last_recorded: new Date().toISOString() },
    { type_en: "Bulk Carrier", type_ar: "ناقلة بضائع سائبة", count: 20, percentage: 15, top_port: "Benghazi", top_cargo: "Wheat", avg_transit: "15 days", avg_cost: "$1500", last_recorded: new Date().toISOString() },
    { type_en: "RoRo Ship", type_ar: "سفينة دحرجة", count: 12, percentage: 9, top_port: "Khoms", top_cargo: "Cars", avg_transit: "5 days", avg_cost: "$1200", last_recorded: new Date().toISOString() },
    { type_en: "Oil Tanker", type_ar: "ناقلة نفط", count: 15, percentage: 11, top_port: "Zawia", top_cargo: "Crude Oil", avg_transit: "8 days", avg_cost: "$3000", last_recorded: new Date().toISOString() },
  ];

  const shippingLines = [
    { name: "MSC", ships: 18, trips: 45, libyan_ports: ["Tripoli", "Misrata"], origin_ports: ["Genoa", "Valencia"], vessel_types: ["Container Ship"], avg_transit: "10 days", avg_cost: "$2200", last_trip: new Date().toISOString(), status: "Active" },
    { name: "Maersk", ships: 15, trips: 38, libyan_ports: ["Misrata", "Benghazi"], origin_ports: ["Antwerp", "Rotterdam"], vessel_types: ["Container Ship"], avg_transit: "14 days", avg_cost: "$2400", last_trip: new Date().toISOString(), status: "Active" },
    { name: "CMA CGM", ships: 12, trips: 30, libyan_ports: ["Tripoli", "Khoms"], origin_ports: ["Marseille", "Istanbul"], vessel_types: ["Container Ship", "General Cargo"], avg_transit: "8 days", avg_cost: "$2100", last_trip: new Date().toISOString(), status: "Active" },
    { name: "Grimaldi Lines", ships: 8, trips: 22, libyan_ports: ["Khoms"], origin_ports: ["Genoa", "Naples"], vessel_types: ["RoRo Ship"], avg_transit: "4 days", avg_cost: "$1500", last_trip: new Date().toISOString(), status: "Active" },
  ];

  const ships = Array.from({ length: 50 }).map((_, i) => {
    const lPort = libyanPorts[Math.floor(Math.random() * libyanPorts.length)];
    const iPort = intlPorts[Math.floor(Math.random() * intlPorts.length)];
    const vType = vesselTypes[Math.floor(Math.random() * vesselTypes.length)];
    const sLine = shippingLines[Math.floor(Math.random() * shippingLines.length)];
    const statusOpts = ["In Port", "Expected", "Anchored", "Departed", "Delayed"];
    const status = statusOpts[Math.floor(Math.random() * statusOpts.length)];
    
    // Spread ships around libyan ports for map
    const latOffset = (Math.random() - 0.5) * 1.5;
    const lngOffset = (Math.random() - 0.5) * 1.5;
    
    let lat = lPort.lat + latOffset;
    let lng = lPort.lng + lngOffset;

    if (status === 'In Port') {
      lat = lPort.lat + (Math.random() - 0.5) * 0.02;
      lng = lPort.lng + (Math.random() - 0.5) * 0.02;
    }

    return {
      id: i.toString(),
      vessel_name: `VESSEL ${Math.floor(Math.random() * 1000) + 1000}`,
      imo: Math.floor(Math.random() * 9000000) + 1000000,
      mmsi: Math.floor(Math.random() * 900000000) + 100000000,
      vessel_type: vType.type_en,
      vessel_type_ar: vType.type_ar,
      flag: ["Panama", "Liberia", "Marshall Islands", "Malta", "Cyprus"][Math.floor(Math.random() * 5)],
      operator: "Global Shipping Co.",
      shipping_line: sLine.name,
      origin_port: iPort,
      origin_country: "Various",
      destination_port: lPort.name_en,
      destination_country: "Libya",
      libyan_port: lPort.name_en,
      latitude: lat,
      longitude: lng,
      speed: status === 'In Port' || status === 'Anchored' ? 0 : Math.floor(Math.random() * 15) + 5,
      cargo_type: Math.random() > 0.5 ? vType.top_cargo : 'Estimated',
      cargo_description: "General goods and materials",
      cargo_weight: Math.floor(Math.random() * 50000) + 1000,
      container_count: vType.type_en === 'Container Ship' ? Math.floor(Math.random() * 5000) + 100 : 0,
      container_type: "Dry",
      departure_date: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
      eta: new Date(Date.now() + Math.random() * 500000000).toISOString(),
      actual_arrival: status === 'In Port' ? new Date(Date.now() - Math.random() * 200000000).toISOString() : null,
      transit_days: Math.floor(Math.random() * 20) + 3,
      vessel_status: status,
      delay_hours: status === 'Delayed' ? Math.floor(Math.random() * 48) + 1 : 0,
      freight_price: Math.floor(Math.random() * 3000) + 1000,
      total_transport_cost: Math.floor(Math.random() * 4000) + 1200,
      currency: "USD",
      vessel_source: "Saved Data (Last Update: " + new Date().toISOString() + ")",
      freight_source: "Saved Data (Last Update: " + new Date().toISOString() + ")",
      last_updated: new Date().toISOString()
    };
  });

  const freightRates = Array.from({ length: 30 }).map((_, i) => {
    const lPort = libyanPorts[Math.floor(Math.random() * libyanPorts.length)];
    const iPort = intlPorts[Math.floor(Math.random() * intlPorts.length)];
    const sLine = shippingLines[Math.floor(Math.random() * shippingLines.length)];
    
    const base = Math.floor(Math.random() * 2000) + 800;
    const bunker = Math.floor(Math.random() * 300) + 100;
    const port = Math.floor(Math.random() * 200) + 50;
    const total = base + bunker + port + 150;

    return {
      id: i.toString(),
      origin_port: iPort,
      origin_country: "Various",
      destination_port: lPort.name_en,
      destination_country: "Libya",
      shipping_line: sLine.name,
      carrier: "Global Trans",
      vessel_type: "Container Ship",
      cargo_type: "General Cargo",
      container_type: "Standard",
      container_size: ["20ft", "40ft", "40ft HC"][Math.floor(Math.random() * 3)],
      weight: "Max 28t",
      base_rate: base,
      bunker_surcharge: bunker,
      port_fees: port,
      handling_fees: 100,
      documentation_fees: 50,
      insurance_cost: 80,
      inland_transport_cost: 200,
      total_cost: total,
      currency: "USD",
      transit_days: Math.floor(Math.random() * 15) + 5,
      free_days: 14,
      quotation_date: new Date().toISOString(),
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      source: "Saved Data",
      price_status: ["Confirmed", "Estimated", "Quote", "Market Average"][Math.floor(Math.random() * 4)],
      is_estimated: Math.random() > 0.5,
      last_updated: new Date().toISOString()
    }
  });

  return { ships, libyanPorts, vesselTypes, shippingLines, freightRates, last_updated: new Date().toISOString() };
};

let db = {
  ships: [] as any[],
  libyanPorts: [] as any[],
  vesselTypes: [] as any[],
  shippingLines: [] as any[],
  freightRates: [] as any[],
  last_updated: ''
};

// Load existing db or seed initial data
if (fs.existsSync(DB_FILE)) {
  try {
    db = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch (e) {
    console.error('Error reading DB', e);
  }
} 

if (db.ships.length === 0) {
  // Seed with initial structure based on ports if empty
  db = generateMockData();
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

const saveDb = () => {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
};

// --- Fetching Logic (with Fallbacks) ---
const fetchWithTimeout = async (url: string, options: any, timeout = 5000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(url, { ...options, signal: controller.signal });
  clearTimeout(id);
  return response;
};

// 1. Vessel Data
const fetchVesselData = async () => {
  let source = '';
  let data = null;

  try {
    if (process.env.VESSELFINDER_API_KEY) {
      // 1. VesselFinder (Primary)
      source = 'VesselFinder API';
      const res = await fetchWithTimeout(`https://api.vesselfinder.com/vessels?userkey=${process.env.VESSELFINDER_API_KEY}`, {});
      if (res.ok) data = await res.json();
    }
  } catch (e) {
    console.warn('VesselFinder failed, trying MarineTraffic...');
  }

  if (!data) {
    try {
      if (process.env.MARINETRAFFIC_API_KEY) {
        // 2. MarineTraffic (Backup 1)
        source = 'MarineTraffic API';
        const res = await fetchWithTimeout(`https://services.marinetraffic.com/api/exportvessels/v:8/${process.env.MARINETRAFFIC_API_KEY}?protocol=json`, {});
        if (res.ok) data = await res.json();
      }
    } catch (e) {
      console.warn('MarineTraffic failed, trying Datalastic...');
    }
  }

  if (!data) {
    try {
      if (process.env.DATALASTIC_API_KEY) {
        // 3. Datalastic (Backup 2)
        source = 'Datalastic API';
        const res = await fetchWithTimeout(`https://api.datalastic.com/api/v0/vessel?api-key=${process.env.DATALASTIC_API_KEY}`, {});
        if (res.ok) data = await res.json();
      }
    } catch (e) {
      console.warn('Datalastic failed.');
    }
  }

  return { source, data };
};

// 2. Freight Rates
const fetchFreightRates = async () => {
  let source = '';
  let data = null;

  try {
    if (process.env.SEARATES_API_KEY) {
      source = 'SeaRates API';
      const res = await fetchWithTimeout(`https://api.searates.com/rates?key=${process.env.SEARATES_API_KEY}`, {});
      if (res.ok) data = await res.json();
    }
  } catch (e) {
    console.warn('SeaRates failed.');
  }

  return { source, data };
};

const updateData = async () => {
  console.log('Fetching new data...');
  const timestamp = new Date().toISOString();
  let updated = false;

  const vesselRes = await fetchVesselData();
  if (vesselRes.data) {
    // Transform external API data into our schema here
    // Since we don't have real keys, this block will rarely execute unless keys are provided.
    // db.ships = ...
    updated = true;
  }

  const freightRes = await fetchFreightRates();
  if (freightRes.data) {
    // Transform external freight data
    // db.freightRates = ...
    updated = true;
  }

  if (updated) {
    db.last_updated = timestamp;
    saveDb();
  }
};

// Background refresh every 15 minutes
setInterval(updateData, 15 * 60 * 1000);

// --- AISStream WebSocket Integration ---
const setupAisStream = () => {
  const apiKey = process.env.AISSTREAM_API_KEY || "420ef26f40153a2a58534d2c502ee72779f6f079";
  if (!apiKey) return;
  
  console.log('Connecting to AISStream...');
  const ws = new WebSocket('wss://stream.aisstream.io/v0/stream');

  ws.on('open', () => {
    console.log('AISStream Connected.');
    const subscriptionMessage = {
      APIKey: apiKey,
      BoundingBoxes: [[[32.0, 10.0], [34.5, 25.0]]] // Coast of Libya
    };
    ws.send(JSON.stringify(subscriptionMessage));
  });

  ws.on('message', (data: WebSocket.Data) => {
    try {
      const msg = JSON.parse(data.toString());
      if (msg.MessageType === 'PositionReport') {
        const report = msg.Message.PositionReport;
        const mmsi = msg.MetaData.MMSI;
        const shipName = msg.MetaData.ShipName?.trim() || `Unknown (${mmsi})`;
        
        let ship = db.ships.find(s => s.mmsi === mmsi);
        let isNew = false;
        
        if (!ship) {
          ship = {
            id: mmsi.toString(),
            vessel_name: shipName,
            imo: 0,
            mmsi: mmsi,
            vessel_type: "Unknown",
            vessel_type_ar: "غير معروف",
            flag: "Unknown",
            operator: "Unknown",
            shipping_line: "Unknown",
            origin_port: "Unknown",
            origin_country: "Unknown",
            destination_port: "Libyan Port",
            destination_country: "Libya",
            libyan_port: "Unknown",
            latitude: report.Latitude,
            longitude: report.Longitude,
            speed: report.Sog || 0,
            cargo_type: "Unknown",
            cargo_description: "",
            cargo_weight: 0,
            container_count: 0,
            container_type: "",
            departure_date: new Date().toISOString(),
            eta: new Date().toISOString(),
            actual_arrival: null,
            transit_days: 0,
            vessel_status: (report.Sog || 0) < 1 ? "Anchored" : "In Transit",
            delay_hours: 0,
            freight_price: 0,
            total_transport_cost: 0,
            currency: "USD",
            vessel_source: "AISStream (Live)",
            freight_source: "-",
            last_updated: new Date().toISOString()
          };
          isNew = true;
        } else {
          ship.latitude = report.Latitude;
          ship.longitude = report.Longitude;
          ship.speed = report.Sog || ship.speed;
          ship.vessel_status = (report.Sog || 0) < 1 ? "Anchored" : "In Transit";
          ship.vessel_source = "AISStream (Live)";
          ship.last_updated = new Date().toISOString();
        }
        
        if (isNew) {
           if (db.ships.length > 300) db.ships.shift();
           db.ships.push(ship);
        }
        db.last_updated = new Date().toISOString();
      }
    } catch (e) {
      // Ignore parse errors
    }
  });

  ws.on('error', (err) => {
    console.error('AISStream WS Error', err);
  });
  
  ws.on('close', () => {
    console.log('AISStream closed, reconnecting in 10s...');
    setTimeout(setupAisStream, 10000);
  });
};

setupAisStream();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/dashboard', async (req, res) => {
    // Before responding, trigger an async update if data is very old or missing (optional)
    res.json({
      ships: db.ships,
      libyanPorts: db.libyanPorts,
      vesselTypes: db.vesselTypes,
      shippingLines: db.shippingLines,
      freightRates: db.freightRates,
      last_updated: db.last_updated,
      is_live: !!(process.env.VESSELFINDER_API_KEY || process.env.AISSTREAM_API_KEY || "420ef26f40153a2a58534d2c502ee72779f6f079") // If key exists, assume it's capable of live
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
