// Pre-seeded realistic demo data matching MySQL database schema
export const initialFarmers = [
  { id: 1, username: 'farmer_ramesh', fullName: 'Ramesh Patel', email: 'ramesh.farmer@farmassist.in', phone: '9876543210', role: 'ROLE_FARMER' },
  { id: 2, username: 'farmer_anita', fullName: 'Anita Sharma', email: 'anita.sharma@farmassist.in', phone: '9876543211', role: 'ROLE_FARMER' }
];

export const initialProfiles = {
  1: { id: 1, userId: 1, village: 'Khed', district: 'Pune', state: 'Maharashtra', totalExperienceYears: 14, primaryWaterSource: 'Borewell & Drip Irrigation' },
  2: { id: 2, userId: 2, village: 'Kurnool Rural', district: 'Kurnool', state: 'Andhra Pradesh', totalExperienceYears: 9, primaryWaterSource: 'Canal & Open Well' }
};

export const initialLandParcels = [
  { id: 1, userId: 1, farmerName: 'Ramesh Patel', parcelName: 'North Canal Field', surveyNumber: 'SY-104/A', totalAreaAcres: 4.5, soilType: 'Black', irrigationType: 'Drip', villageLocation: 'Khed North Sector', createdAt: '2026-05-10T10:00:00' },
  { id: 2, userId: 1, farmerName: 'Ramesh Patel', parcelName: 'Riverside Plot', surveyNumber: 'SY-108/2', totalAreaAcres: 3.0, soilType: 'Alluvial', irrigationType: 'Canal', villageLocation: 'Near Bhima River Basin', createdAt: '2026-05-12T10:00:00' },
  { id: 3, userId: 2, farmerName: 'Anita Sharma', parcelName: 'Hill View Meadow', surveyNumber: 'SY-45/B', totalAreaAcres: 5.2, soilType: 'Red', irrigationType: 'Borewell', villageLocation: 'Kurnool East Ridge', createdAt: '2026-05-15T10:00:00' }
];

export const initialCrops = [
  { id: 1, landParcelId: 1, landParcelName: 'North Canal Field', userId: 1, farmerName: 'Ramesh Patel', cropName: 'Cotton', variety: 'Bt-Cotton RCH-659', season: 'Kharif', sowingDate: '2026-06-15', expectedHarvestDate: '2026-11-20', expectedYieldQuintals: 35.0, status: 'GROWING', notes: 'Second weeding completed; boll formation stage.' },
  { id: 2, landParcelId: 2, landParcelName: 'Riverside Plot', userId: 1, farmerName: 'Ramesh Patel', cropName: 'Paddy (Basmati)', variety: 'Pusa 1121', season: 'Kharif', sowingDate: '2026-07-01', expectedHarvestDate: '2026-10-30', expectedYieldQuintals: 50.0, status: 'FLOWERING', notes: 'Irrigation scheduled every 3 days; panicle initiation observed.' },
  { id: 3, landParcelId: 3, landParcelName: 'Hill View Meadow', userId: 2, farmerName: 'Anita Sharma', cropName: 'Groundnut', variety: 'Kadiri-6', season: 'Kharif', sowingDate: '2026-06-25', expectedHarvestDate: '2026-10-15', expectedYieldQuintals: 28.0, status: 'GROWING', notes: 'Gypsum application completed; healthy pod development.' }
];

export const initialRecords = [
  { id: 1, cropId: 1, cropName: 'Cotton', activityType: 'LAND_PREPARATION', activityDate: '2026-06-05', description: 'Deep ploughing and disc harrowing', inputsUsed: 'Tractor & Harrow', quantityUsed: '2 passes', costIncurred: 2500, observations: 'Soil texture optimized for moisture retention' },
  { id: 2, cropId: 1, cropName: 'Cotton', activityType: 'SOWING', activityDate: '2026-06-15', description: 'Direct seed drilling with spacing 90x60cm', inputsUsed: 'Bt-Cotton Seeds', quantityUsed: '2 packets/acre', costIncurred: 3800, observations: 'Good germination rate observed (>90%)' },
  { id: 3, cropId: 1, cropName: 'Cotton', activityType: 'FERTILIZER', activityDate: '2026-07-10', description: 'First basal dose of DAP and Potash', inputsUsed: 'DAP + MOP', quantityUsed: '50 kg DAP + 25 kg MOP', costIncurred: 2200, observations: 'Applied along root zone before drip irrigation' },
  { id: 4, cropId: 1, cropName: 'Cotton', activityType: 'IRRIGATION', activityDate: '2026-07-28', description: 'Drip fertigation run', inputsUsed: 'Water + Micronutrient mix', quantityUsed: '4 hours run', costIncurred: 450, observations: 'Soil moisture maintained at optimum field capacity' },
  { id: 5, cropId: 2, cropName: 'Paddy (Basmati)', activityType: 'SOWING', activityDate: '2026-07-01', description: 'Transplantation of 25-day old seedlings', inputsUsed: 'Pusa 1121 Seedlings', quantityUsed: '2 seedlings/hill', costIncurred: 3200, observations: 'Standing water maintained at 2-3 cm' },
  { id: 6, cropId: 2, cropName: 'Paddy (Basmati)', activityType: 'PEST_CONTROL', activityDate: '2026-08-14', description: 'Preventive spray against stem borer', inputsUsed: 'Chlorantraniliprole 18.5 SC', quantityUsed: '60 ml/acre', costIncurred: 1150, observations: 'No visible pest infestation afterwards' }
];

export const initialResources = [
  { id: 1, title: 'Neem Coated Urea (46% N)', category: 'FERTILIZERS', description: 'Slow-release nitrogenous fertilizer providing sustained nutrition and minimizing leaching losses.', recommendedDosage: '45 kg per acre in split doses', contactOrLink: 'Local Agri Cooperative Society', status: 'AVAILABLE' },
  { id: 2, title: 'Single Super Phosphate (SSP - 16% P)', category: 'FERTILIZERS', description: 'Rich in Phosphorus and Calcium; ideal for root development and oilseed crops.', recommendedDosage: '100 kg per acre as basal dose', contactOrLink: 'IFFCO Kisan Kendra', status: 'AVAILABLE' },
  { id: 3, title: 'Trichoderma Viride (Bio-Fungicide)', category: 'PESTICIDES', description: 'Eco-friendly biocontrol agent against root rot, wilt, and damping-off fungal pathogens.', recommendedDosage: '2.5 kg mixed with 100 kg FYM per acre', contactOrLink: 'KVK Agri Center', status: 'SUBSIDIZED' },
  { id: 4, title: 'Custom Hiring Center - Laser Land Leveler', category: 'MACHINERY', description: 'Precision GPS/laser land leveling to conserve up to 25% irrigation water and increase crop yield.', recommendedDosage: 'Once every 3 years before Kharif', contactOrLink: 'Toll-free: 1800-180-1551', status: 'AVAILABLE' },
  { id: 5, title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)', category: 'GOVT_SCHEME', description: 'Comprehensive crop insurance coverage against non-preventable natural risks from pre-sowing to post-harvest.', recommendedDosage: '2% premium for Kharif, 1.5% for Rabi', contactOrLink: 'https://pmfby.gov.in', status: 'INFO_ONLY' },
  { id: 6, title: 'PM-KISAN Samman Nidhi', category: 'GOVT_SCHEME', description: 'Direct income support of Rs. 6,000 per year in three equal installments to all landholding farmer families.', recommendedDosage: 'Direct bank transfer to Aadhaar linked account', contactOrLink: 'https://pmkisan.gov.in', status: 'SUBSIDIZED' }
];

export const initialAnnouncements = [
  { id: 1, title: 'Heavy Rainfall & Gusty Winds Advisory for Next 48 Hours', category: 'WEATHER_ALERT', content: 'District meteorological department forecasts moderate to heavy rain. Postpone fertilizer top-dressing and ensure proper drainage in low-lying fields.', urgency: 'HIGH', postedBy: 'Dr. S. K. Verma, District Agri Officer', createdAt: '2026-10-10T09:30:00' },
  { id: 2, title: 'Subsidized Drip Irrigation Equipment Applications Open', category: 'GOVT_SCHEME', content: 'State Agriculture Department is accepting applications for up to 80% subsidy on micro-irrigation systems under PMKSY.', urgency: 'MEDIUM', postedBy: 'Agricultural Officer, Horticulture Wing', createdAt: '2026-10-08T11:00:00' },
  { id: 3, title: 'Pink Bollworm Vigilance in Cotton Fields', category: 'PEST_WARNING', content: 'Install 4-5 pheromone traps per acre to monitor moth activity. Spray recommended biopesticides if threshold crossed.', urgency: 'HIGH', postedBy: 'State Agricultural Extension Center', createdAt: '2026-10-05T14:15:00' }
];
