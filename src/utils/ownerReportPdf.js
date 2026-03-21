import jsPDF from 'jspdf';

function buildStamp() {
  const now = new Date();
  return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
}

function fitText(pdf, value, maxWidth) {
  const text = String(value ?? '-');
  const lines = pdf.splitTextToSize(text, Math.max(4, maxWidth - 2));
  return lines?.[0] || '-';
}

function drawFooter(pdf, pageNumber, totalPages, pageWidth, pageHeight, marginX) {
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(100);
  pdf.text(`Page ${pageNumber} of ${totalPages}`, pageWidth - marginX, pageHeight - 6, { align: 'right' });
  pdf.setTextColor(0);
}

function drawSimpleTablePdf({
  title,
  scopeLabel,
  rows,
  columns,
  filenamePrefix,
  filenameKey,
  generatedAt,
  formatDateTime,
}) {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const marginX = 10;
  const marginTop = 12;
  const rowsPerPage = 28;
  const totalPages = Math.max(1, Math.ceil(rows.length / rowsPerPage));

  const drawHeader = () => {
    let y = marginTop;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text(title, marginX, y);
    y += 6;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.text(`Scope: ${scopeLabel}`, marginX, y);
    pdf.text(`Generated: ${formatDateTime(generatedAt)}`, pageWidth - marginX, y, { align: 'right' });
    y += 5;
    pdf.text(`Visible rows: ${rows.length}`, marginX, y);
    y += 4;
    pdf.setDrawColor(220, 225, 235);
    pdf.line(marginX, y, pageWidth - marginX, y);
    return y + 4;
  };

  const drawTableHeader = (startY) => {
    let x = marginX;
    pdf.setFillColor(244, 247, 252);
    pdf.rect(marginX, startY, pageWidth - marginX * 2, 8, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    columns.forEach((column) => {
      pdf.text(column.label, x + 1.5, startY + 5.3);
      x += column.width;
    });
    return startY + 8;
  };

  for (let pageIndex = 0; pageIndex < totalPages; pageIndex += 1) {
    if (pageIndex > 0) pdf.addPage();

    const pageNumber = pageIndex + 1;
    const pageRows = rows.slice(pageIndex * rowsPerPage, pageIndex * rowsPerPage + rowsPerPage);
    let y = drawHeader();
    y = drawTableHeader(y);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);

    if (!pageRows.length) {
      pdf.text('No records.', marginX + 1.5, y + 5.3);
    } else {
      pageRows.forEach((row) => {
        let x = marginX;
        columns.forEach((column) => {
          pdf.text(fitText(pdf, column.value(row), column.width), x + 1.5, y + 5.3);
          x += column.width;
        });
        pdf.setDrawColor(236, 240, 246);
        pdf.line(marginX, y + 8, pageWidth - marginX, y + 8);
        y += 8;
      });
    }

    drawFooter(pdf, pageNumber, totalPages, pageWidth, pageHeight, marginX);
  }

  pdf.save(`${filenamePrefix}-${filenameKey}-${buildStamp()}.pdf`);
}

export function generateTenantSummaryPdf({ rows, statusLabel, generatedAt, filenameKey, formatDateTime }) {
  return drawSimpleTablePdf({
    title: 'Tenant Summary Report',
    scopeLabel: statusLabel,
    rows,
    filenamePrefix: 'tenant-summary',
    filenameKey,
    generatedAt,
    formatDateTime,
    columns: [
      {
        label: 'Tenant',
        width: 52,
        value: (tenant) => `${tenant.first_name || ''} ${tenant.last_name || ''}`.trim() || '-',
      },
      { label: 'Email', width: 58, value: (tenant) => tenant.email || '-' },
      { label: 'Property', width: 50, value: (tenant) => tenant.property_title || '-' },
      { label: 'Status', width: 30, value: (tenant) => tenant.status || '-' },
    ],
  });
}

export function generateBookingLogsPdf({ rows, statusLabel, generatedAt, filenameKey, formatDate, formatDateTime }) {
  return drawSimpleTablePdf({
    title: 'Booking Logs Report',
    scopeLabel: statusLabel,
    rows,
    filenamePrefix: 'booking-logs',
    filenameKey,
    generatedAt,
    formatDateTime,
    columns: [
      { label: 'Date', width: 35, value: (row) => formatDate(row.created_at) },
      {
        label: 'Tenant',
        width: 58,
        value: (row) => `${row.first_name || ''} ${row.last_name || ''}`.trim() || '-',
      },
      { label: 'Property', width: 62, value: (row) => row.property_title || '-' },
      { label: 'Status', width: 35, value: (row) => row.status || '-' },
    ],
  });
}

export function generatePaymentReportPdf({
  monthlyRows,
  paymentRows,
  generatedAt,
  scopeLabel,
  formatAmount,
  formatDate,
  formatDateTime,
  formatMonth,
  formatStatus,
  totals,
}) {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const marginX = 10;
  const marginTop = 12;
  const rowsPerPage = 24;
  const totalPages = Math.max(1, Math.ceil(paymentRows.length / rowsPerPage));

  const detailColumns = [
    { label: 'Date', width: 28, value: (row) => formatDate(row.paid_at || row.created_at) },
    {
      label: 'Tenant',
      width: 42,
      value: (row) => row.tenant_name || `${row.first_name || ''} ${row.last_name || ''}`.trim() || '-',
    },
    { label: 'Property', width: 42, value: (row) => row.property_title || '-' },
    { label: 'Type', width: 25, value: (row) => formatStatus(row.payment_type || 'payment') },
    { label: 'Status', width: 24, value: (row) => formatStatus(row.status) },
    { label: 'Amount', width: 29, value: (row) => `PHP ${formatAmount(row.amount || row.amount_paid)}` },
  ];

  const drawHeader = (pageNumber) => {
    let y = marginTop;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('Payment Report', marginX, y);
    y += 6;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.text(`Monthly scope: ${scopeLabel}`, marginX, y);
    pdf.text(`Generated: ${formatDateTime(generatedAt)}`, pageWidth - marginX, y, { align: 'right' });
    y += 5;
    pdf.text(
      `Filtered amount: PHP ${formatAmount(totals.totalAmount)} | Pending: ${totals.pending} | Verified: ${totals.verified} | Rejected: ${totals.rejected}`,
      marginX,
      y
    );
    y += 5;
    pdf.text(`Filtered payment rows: ${paymentRows.length} | Monthly summary rows: ${monthlyRows.length}`, marginX, y);
    y += 4;
    pdf.setDrawColor(220, 225, 235);
    pdf.line(marginX, y, pageWidth - marginX, y);
    return y + 4;
  };

  const drawMonthlySummary = (startY) => {
    let y = startY;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text('Monthly Summary', marginX, y);
    y += 5;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.5);
    if (!monthlyRows.length) {
      pdf.text('No monthly summary rows.', marginX, y);
      return y + 6;
    }

    monthlyRows.slice(0, 6).forEach((row) => {
      pdf.text(
        `${formatMonth(row.month)} - PHP ${formatAmount(row.verified_amount)} - ${row.total_payments ?? 0} payments`,
        marginX,
        y
      );
      y += 4.5;
    });

    y += 1;
    pdf.setDrawColor(236, 240, 246);
    pdf.line(marginX, y, pageWidth - marginX, y);
    return y + 4;
  };

  const drawTableHeader = (startY) => {
    let x = marginX;
    pdf.setFillColor(244, 247, 252);
    pdf.rect(marginX, startY, pageWidth - marginX * 2, 8, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8.5);
    detailColumns.forEach((column) => {
      pdf.text(column.label, x + 1.5, startY + 5.3);
      x += column.width;
    });
    return startY + 8;
  };

  for (let pageIndex = 0; pageIndex < totalPages; pageIndex += 1) {
    if (pageIndex > 0) pdf.addPage();

    const pageNumber = pageIndex + 1;
    const pageRows = paymentRows.slice(pageIndex * rowsPerPage, pageIndex * rowsPerPage + rowsPerPage);
    let y = drawHeader(pageNumber);

    if (pageIndex === 0) {
      y = drawMonthlySummary(y);
    }

    y = drawTableHeader(y);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.5);

    if (!pageRows.length) {
      pdf.text('No payment rows for the selected filters.', marginX + 1.5, y + 5.3);
    } else {
      pageRows.forEach((row) => {
        let x = marginX;
        detailColumns.forEach((column) => {
          pdf.text(fitText(pdf, column.value(row), column.width), x + 1.5, y + 5.3);
          x += column.width;
        });
        pdf.setDrawColor(236, 240, 246);
        pdf.line(marginX, y + 8, pageWidth - marginX, y + 8);
        y += 8;
      });
    }

    drawFooter(pdf, pageNumber, totalPages, pageWidth, pageHeight, marginX);
  }

  pdf.save(`payment-report-${buildStamp()}.pdf`);
}
