const { Redis } = require('@upstash/redis');

const kv = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const KEY = 'cap_benat_reservations';

const PRELOADED = [
  {id:1,people:["Lucas"],start:"2026-05-01",end:"2026-05-04",note:"",uncertain:false,addedBy:"Lucas"},
  {id:2,people:["Laurent"],start:"2026-06-13",end:"2026-06-14",note:"",uncertain:false,addedBy:"Laurent"},
  {id:3,people:["Lee-Lou"],start:"2026-06-21",end:"2026-06-27",note:"",uncertain:true,addedBy:"Lee-Lou"},
  {id:4,people:["Alice"],start:"2026-06-27",end:"2026-07-04",note:"",uncertain:false,addedBy:"Alice"},
  {id:5,people:["Patrick","Cecile"],start:"2026-07-01",end:"2026-07-17",note:"a confirmer",uncertain:true,addedBy:"Patrick"},
  {id:6,people:["Christine","Maryse"],start:"2026-07-17",end:"2026-07-26",note:"",uncertain:false,addedBy:"Christine"},
  {id:7,people:["Margot"],start:"2026-07-17",end:"2026-07-27",note:"",uncertain:false,addedBy:"Margot"}
];

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    try {
      let raw = await kv.get(KEY);
      let reservations;
      if (!raw) {
        reservations = PRELOADED;
        await kv.set(KEY, JSON.stringify(PRELOADED));
      } else if (typeof raw === 'string') {
        try { reservations = JSON.parse(raw); } catch(e) { reservations = PRELOADED; }
      } else if (Array.isArray(raw)) {
        reservations = raw;
      } else {
        reservations = PRELOADED;
      }
      return res.status(200).json({ reservations });
    } catch (e) {
      return res.status(200).json({ reservations: PRELOADED });
    }
  }

  if (req.method === 'POST') {
    try {
      const { reservations } = req.body;
      if (!Array.isArray(reservations)) return res.status(400).json({ error: 'Invalid data' });
      await kv.set(KEY, JSON.stringify(reservations));
      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};