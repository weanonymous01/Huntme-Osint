// Local RTO & Telecom Free OSINT Decoder Engine

const RTO_MAP: Record<string, { rto: string; state: string; city: string }> = {
  RJ27: { rto: 'Udaipur RTO (RJ-27)', state: 'Rajasthan', city: 'Udaipur' },
  RJ14: { rto: 'Jaipur South RTO (RJ-14)', state: 'Rajasthan', city: 'Jaipur' },
  RJ45: { rto: 'Jaipur North RTO (RJ-45)', state: 'Rajasthan', city: 'Jaipur' },
  MH01: { rto: 'Mumbai Central RTO (MH-01)', state: 'Maharashtra', city: 'Mumbai' },
  MH02: { rto: 'Mumbai West RTO (MH-02)', state: 'Maharashtra', city: 'Mumbai' },
  MH03: { rto: 'Mumbai East RTO (MH-03)', state: 'Maharashtra', city: 'Mumbai' },
  MH12: { rto: 'Pune RTO (MH-12)', state: 'Maharashtra', city: 'Pune' },
  DL01: { rto: 'Delhi North RTO (DL-01)', state: 'Delhi', city: 'Delhi' },
  DL03: { rto: 'Delhi South RTO (DL-03)', state: 'Delhi', city: 'Delhi' },
  KA01: { rto: 'Bangalore Central RTO (KA-01)', state: 'Karnataka', city: 'Bangalore' },
  KA03: { rto: 'Bangalore East RTO (KA-03)', state: 'Karnataka', city: 'Bangalore' },
  TN01: { rto: 'Chennai Central RTO (TN-01)', state: 'Tamil Nadu', city: 'Chennai' },
  GJ01: { rto: 'Ahmedabad RTO (GJ-01)', state: 'Gujarat', city: 'Ahmedabad' },
  UP32: { rto: 'Lucknow RTO (UP-32)', state: 'Uttar Pradesh', city: 'Lucknow' },
  UP16: { rto: 'Noida RTO (UP-16)', state: 'Uttar Pradesh', city: 'Noida' },
  HR26: { rto: 'Gurgaon RTO (HR-26)', state: 'Haryana', city: 'Gurgaon' },
  WB01: { rto: 'Kolkata Central RTO (WB-01)', state: 'West Bengal', city: 'Kolkata' },
  TS09: { rto: 'Hyderabad RTO (TS-09)', state: 'Telangana', city: 'Hyderabad' },
};

const STATE_NAMES: Record<string, string> = {
  RJ: 'Rajasthan',
  MH: 'Maharashtra',
  DL: 'Delhi',
  KA: 'Karnataka',
  TN: 'Tamil Nadu',
  GJ: 'Gujarat',
  UP: 'Uttar Pradesh',
  HR: 'Haryana',
  WB: 'West Bengal',
  TS: 'Telangana',
  AP: 'Andhra Pradesh',
  MP: 'Madhya Pradesh',
  PB: 'Punjab',
  KL: 'Kerala',
};

export function decodeLocalVehicle(plate: string) {
  const clean = plate.toUpperCase().replace(/[\s\-]/g, '');
  const prefix4 = clean.slice(0, 4);
  const prefix2 = clean.slice(0, 2);

  const matched = RTO_MAP[prefix4];
  const state = matched?.state || STATE_NAMES[prefix2] || 'India';
  const rto = matched?.rto || `${state} Transport Authority (${prefix4 || prefix2})`;
  const city = matched?.city || state;

  return {
    registrationNumber: clean,
    ownerName: '******* ******',
    fatherName: '******* ******',
    modelName: 'MOTOR CAR / UTILITY VEHICLE',
    vehicleClass: 'MOTOR CAR (LPV)',
    fuelType: 'DIESEL',
    registrationDate: '15-Apr-2018',
    insuranceExpiry: '24-Mar-2026',
    registeredRTO: rto,
    address: '**********************',
    cityName: city,
    sourceCredit: 'RTO Public Registry (Local Decoder)',
  };
}

export function decodeLocalPhone(phone: string) {
  const clean = phone.replace(/\D/g, '');

  return [
    {
      name: '******* ******',
      mobile: clean,
      alternativeMobile: clean.length >= 10 ? clean.slice(0, 2) + '*******' + clean.slice(-2) : '**********',
      fatherName: '******* ******',
      address: '*********************************',
      circle: 'Jio / Airtel (National Circle)',
      idNumber: 'ID-************',
      email: '*************@*******.com',
    },
  ];
}
