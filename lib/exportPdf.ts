import jsPDF from 'jspdf';

export function exportVehiclePdf(vehicle: any, namePredictions?: string | null, aiReport?: string | null) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 15;

  // Header Banner
  doc.setFillColor(15, 15, 20);
  doc.rect(0, 0, pageWidth, 25, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('HUNTME OSINT — VEHICLE INTELLIGENCE DOSSIER', 14, 15);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(160, 160, 175);
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 14, 15, { align: 'right' });

  y = 34;

  // Title
  const plate = vehicle.registrationNumber || 'VEHICLE RECORD';
  doc.setTextColor(20, 20, 25);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`Target Plate: ${plate}`, 14, y);

  y += 6;
  if (vehicle.modelName) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 90);
    doc.text(`Model: ${vehicle.modelName}`, 14, y);
    y += 8;
  }

  // Key Details Table Grid
  doc.setDrawColor(210, 210, 220);
  doc.setFillColor(245, 246, 248);
  doc.roundedRect(14, y, pageWidth - 28, 48, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setTextColor(40, 40, 50);

  const c1 = 18;
  const c2 = 105;

  doc.setFont('helvetica', 'bold'); doc.text('Owner Name:', c1, y + 8);
  doc.setFont('helvetica', 'normal'); doc.text(String(vehicle.ownerName || 'N/A'), c1 + 32, y + 8);

  doc.setFont('helvetica', 'bold'); doc.text('Vehicle Class:', c2, y + 8);
  doc.setFont('helvetica', 'normal'); doc.text(String(vehicle.vehicleClass || 'N/A'), c2 + 32, y + 8);

  doc.setFont('helvetica', 'bold'); doc.text('Fuel Type:', c1, y + 16);
  doc.setFont('helvetica', 'normal'); doc.text(String(vehicle.fuelType || 'N/A'), c1 + 32, y + 16);

  doc.setFont('helvetica', 'bold'); doc.text('Reg Date:', c2, y + 16);
  doc.setFont('helvetica', 'normal'); doc.text(String(vehicle.registrationDate || 'N/A'), c2 + 32, y + 16);

  doc.setFont('helvetica', 'bold'); doc.text('Insurance Expiry:', c1, y + 24);
  doc.setFont('helvetica', 'normal'); doc.text(String(vehicle.insuranceExpiry || 'N/A'), c1 + 32, y + 24);

  doc.setFont('helvetica', 'bold'); doc.text('Registered RTO:', c2, y + 24);
  doc.setFont('helvetica', 'normal'); doc.text(String(vehicle.registeredRTO || 'N/A'), c2 + 32, y + 24);

  doc.setFont('helvetica', 'bold'); doc.text('Registered Address:', c1, y + 32);
  doc.setFont('helvetica', 'normal');
  const addr = doc.splitTextToSize(String(vehicle.address || 'N/A'), pageWidth - 70);
  doc.text(addr, c1 + 32, y + 32);

  y += 56;

  // Name Predictions section
  if (namePredictions) {
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(20, 20, 25);
    doc.text('AI Owner Name Pattern & Top 10 Predictions', 14, y);
    y += 6;

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 60);
    const cleanPred = namePredictions.replace(/###?\s*/g, '').replace(/\*\*/g, '');
    const predLines = doc.splitTextToSize(cleanPred, pageWidth - 28);
    for (const line of predLines) {
      if (y > 275) { doc.addPage(); y = 20; }
      doc.text(line, 14, y);
      y += 4.5;
    }
    y += 6;
  }

  // AI Vehicle Report section
  if (aiReport) {
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(20, 20, 25);
    doc.text('AI Vehicle Intelligence Report', 14, y);
    y += 6;

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 60);
    const cleanReport = aiReport.replace(/###?\s*/g, '').replace(/\*\*/g, '');
    const reportLines = doc.splitTextToSize(cleanReport, pageWidth - 28);
    for (const line of reportLines) {
      if (y > 275) { doc.addPage(); y = 20; }
      doc.text(line, 14, y);
      y += 4.5;
    }
  }

  doc.save(`Huntme_OSINT_Vehicle_${plate}.pdf`);
}

export function exportPhonePdf(phoneResult: any, aiReport?: string | null) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 15;

  // Header Banner
  doc.setFillColor(15, 15, 20);
  doc.rect(0, 0, pageWidth, 25, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('HUNTME OSINT — PHONE INTELLIGENCE DOSSIER', 14, 15);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(160, 160, 175);
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 14, 15, { align: 'right' });

  y = 34;

  const name = phoneResult.name || 'SUBJECT DOSSIER';
  doc.setTextColor(20, 20, 25);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`Target Name: ${name}`, 14, y);

  y += 10;

  // Key Details Table Grid
  doc.setDrawColor(210, 210, 220);
  doc.setFillColor(245, 246, 248);
  doc.roundedRect(14, y, pageWidth - 28, 40, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setTextColor(40, 40, 50);

  const c1 = 18;
  const c2 = 105;

  doc.setFont('helvetica', 'bold'); doc.text('Primary Mobile:', c1, y + 8);
  doc.setFont('helvetica', 'normal'); doc.text(String(phoneResult.mobile || 'N/A'), c1 + 32, y + 8);

  doc.setFont('helvetica', 'bold'); doc.text('Alt Mobile:', c2, y + 8);
  doc.setFont('helvetica', 'normal'); doc.text(String(phoneResult.alternativeMobile || 'N/A'), c2 + 32, y + 8);

  doc.setFont('helvetica', 'bold'); doc.text('Circle / Carrier:', c1, y + 16);
  doc.setFont('helvetica', 'normal'); doc.text(String(phoneResult.circle || 'N/A'), c1 + 32, y + 16);

  doc.setFont('helvetica', 'bold'); doc.text('Father Name:', c2, y + 16);
  doc.setFont('helvetica', 'normal'); doc.text(String(phoneResult.fatherName || 'N/A'), c2 + 32, y + 16);

  doc.setFont('helvetica', 'bold'); doc.text('Address:', c1, y + 24);
  doc.setFont('helvetica', 'normal');
  const addr = doc.splitTextToSize(String(phoneResult.address || 'N/A'), pageWidth - 70);
  doc.text(addr, c1 + 32, y + 24);

  y += 48;

  if (aiReport) {
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(20, 20, 25);
    doc.text('AI Intelligence Analysis Report', 14, y);
    y += 6;

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 60);
    const cleanReport = aiReport.replace(/###?\s*/g, '').replace(/\*\*/g, '');
    const reportLines = doc.splitTextToSize(cleanReport, pageWidth - 28);
    for (const line of reportLines) {
      if (y > 275) { doc.addPage(); y = 20; }
      doc.text(line, 14, y);
      y += 4.5;
    }
  }

  doc.save(`Huntme_OSINT_Phone_${phoneResult.mobile || 'Report'}.pdf`);
}
