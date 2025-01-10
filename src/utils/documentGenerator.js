import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, BorderStyle } from 'docx';
import { jsPDF } from 'jspdf';
import { storage } from '../services/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

// Generate Word document
export const generateWordDocument = async (quotationData) => {
  const {
    company,
    quotationNumber,
    date,
    client,
    items,
    subtotal,
    totalGST,
    grandTotal,
    paymentTerms,
    commonTerms,
    notes,
    createdBy
  } = quotationData;

  // Create header
  const header = new Paragraph({
    children: [
      new TextRun({
        text: company.name,
        bold: true,
        size: 24
      }),
      new TextRun({
        text: `\n${company.address}`,
        size: 20,
        break: 1
      })
    ]
  });

  // Create quotation details
  const quotationDetails = new Paragraph({
    children: [
      new TextRun({
        text: `Quotation Number: ${quotationNumber}\n`,
        bold: true
      }),
      new TextRun({
        text: `Date: ${date}\n`,
        bold: true
      })
    ]
  });

  // Create client details
  const clientDetails = new Paragraph({
    children: [
      new TextRun({
        text: 'To,\n',
        bold: true
      }),
      new TextRun({
        text: `${client.name}\n${client.company}\n${client.address}`
      })
    ]
  });

  // Create items table
  const tableRows = [
    new TableRow({
      children: [
        'Sr.No.',
        'Catalogue ID',
        'Description',
        'Pack Size',
        'Quantity',
        'Unit Rate',
        'Discount %',
        'Discounted Rate',
        'GST %',
        'Total GST',
        'Total'
      ].map(header => 
        new TableCell({
          children: [new Paragraph({
            children: [new TextRun({ text: header, bold: true })]
          })]
        })
      )
    }),
    ...items.map((item, index) => 
      new TableRow({
        children: [
          (index + 1).toString(),
          item.catalogueId,
          item.description,
          item.packSize,
          item.quantity.toString(),
          formatCurrency(item.unitRate),
          `${item.discountPercentage}%`,
          formatCurrency(item.discountedRate),
          `${item.gstPercentage}%`,
          formatCurrency(item.totalGST),
          formatCurrency(item.total)
        ].map(text => 
          new TableCell({
            children: [new Paragraph({
              children: [new TextRun({ text })]
            })]
          })
        )
      })
    )
  ];

  const itemsTable = new Table({
    rows: tableRows,
    width: {
      size: 100,
      type: 'pct'
    }
  });

  // Create totals section
  const totalsSection = new Paragraph({
    children: [
      new TextRun({
        text: `\nSubtotal: ${formatCurrency(subtotal)}\n`,
        bold: true
      }),
      new TextRun({
        text: `Total GST: ${formatCurrency(totalGST)}\n`,
        bold: true
      }),
      new TextRun({
        text: `Grand Total: ${formatCurrency(grandTotal)}\n`,
        bold: true
      })
    ]
  });

  // Create terms section
  const termsSection = new Paragraph({
    children: [
      new TextRun({
        text: '\nTerms and Conditions\n',
        bold: true,
        break: 1
      }),
      new TextRun({
        text: `Payment Terms: ${paymentTerms}\n\n`
      }),
      new TextRun({
        text: commonTerms
      })
    ]
  });

  // Create notes section
  const notesSection = new Paragraph({
    children: [
      new TextRun({
        text: '\nNotes:\n',
        bold: true,
        break: 1
      }),
      new TextRun({
        text: notes
      })
    ]
  });

  // Create signature section
  const signatureSection = new Paragraph({
    children: [
      new TextRun({
        text: '\n\nPrepared By:\n',
        bold: true,
        break: 1
      }),
      new TextRun({
        text: `${createdBy.name}\n${createdBy.email}\n${createdBy.mobile}`
      })
    ]
  });

  // Create the document
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        header,
        quotationDetails,
        clientDetails,
        itemsTable,
        totalsSection,
        termsSection,
        notesSection,
        signatureSection
      ]
    }]
  });

  // Generate buffer
  const buffer = await Packer.toBuffer(doc);

  // Upload to Firebase Storage
  const storageRef = ref(storage, `quotations/${quotationNumber}.docx`);
  await uploadBytes(storageRef, buffer);

  // Get download URL
  return await getDownloadURL(storageRef);
};

// Generate PDF document
export const generatePDFDocument = async (quotationData) => {
  const doc = new jsPDF();
  const {
    company,
    quotationNumber,
    date,
    client,
    items,
    subtotal,
    totalGST,
    grandTotal,
    paymentTerms,
    commonTerms,
    notes,
    createdBy
  } = quotationData;

  // Set font
  doc.setFont('helvetica');

  // Add company header
  doc.setFontSize(16);
  doc.text(company.name, 20, 20);
  doc.setFontSize(10);
  doc.text(company.address, 20, 30);

  // Add quotation details
  doc.setFontSize(12);
  doc.text(`Quotation Number: ${quotationNumber}`, 20, 45);
  doc.text(`Date: ${date}`, 20, 52);

  // Add client details
  doc.text('To:', 20, 65);
  doc.text(`${client.name}\n${client.company}\n${client.address}`, 20, 72);

  // Add items table
  const headers = ['Sr.No.', 'Cat. ID', 'Description', 'Pack Size', 'Qty', 'Rate', 'Disc%', 'Disc. Rate', 'GST%', 'GST', 'Total'];
  const data = items.map((item, index) => [
    index + 1,
    item.catalogueId,
    item.description,
    item.packSize,
    item.quantity,
    formatCurrency(item.unitRate),
    `${item.discountPercentage}%`,
    formatCurrency(item.discountedRate),
    `${item.gstPercentage}%`,
    formatCurrency(item.totalGST),
    formatCurrency(item.total)
  ]);

  doc.autoTable({
    startY: 90,
    head: [headers],
    body: data,
    theme: 'grid',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [66, 66, 66] }
  });

  // Add totals
  const finalY = doc.previousAutoTable.finalY + 10;
  doc.text(`Subtotal: ${formatCurrency(subtotal)}`, 140, finalY);
  doc.text(`Total GST: ${formatCurrency(totalGST)}`, 140, finalY + 7);
  doc.text(`Grand Total: ${formatCurrency(grandTotal)}`, 140, finalY + 14);

  // Add terms and conditions
  doc.text('Terms and Conditions:', 20, finalY + 30);
  doc.setFontSize(10);
  doc.text(`Payment Terms: ${paymentTerms}`, 20, finalY + 37);
  doc.text(commonTerms, 20, finalY + 44, { maxWidth: 170 });

  // Add notes
  const termsHeight = doc.getTextDimensions(commonTerms, { maxWidth: 170 }).h;
  doc.text('Notes:', 20, finalY + 44 + termsHeight + 10);
  doc.text(notes, 20, finalY + 44 + termsHeight + 17, { maxWidth: 170 });

  // Add signature
  doc.text('Prepared By:', 20, finalY + 44 + termsHeight + 40);
  doc.text(`${createdBy.name}\n${createdBy.email}\n${createdBy.mobile}`, 20, finalY + 44 + termsHeight + 47);

  // Generate buffer
  const buffer = doc.output('arraybuffer');

  // Upload to Firebase Storage
  const storageRef = ref(storage, `quotations/${quotationNumber}.pdf`);
  await uploadBytes(storageRef, buffer);

  // Get download URL
  return await getDownloadURL(storageRef);
};
