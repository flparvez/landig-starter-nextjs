import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { IIOrder } from '@/types/product';


export async function generateInvoicePdf(order: IIOrder) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const { height } = page.getSize();

  const drawText = (
    text: string,
    x: number,
    y: number,
    size: number = 12
  ) => {
    page.drawText(text, {
      x,
      y,
      size,
      font,
      color: rgb(0, 0, 0),
    });
  };

  let y = height - 50;

  // ❌ Emojis removed for compatibility
  drawText('Unique Store BD - Order Invoice', 50, y, 16);
  y -= 30;

  drawText(`Order ID: ${order?.orderId}`, 50, y);
  y -= 20;

  drawText(`Name: ${order.fullName}`, 50, y);
  drawText(`Number: ${order.phone}`, 320, y);
  y -= 20;

  drawText(`Address: ${order.address}`, 50, y);
  y -= 30;

  drawText(
    ` Status: ${order.status}`,
    50,
    y
  );
  y -= 30;

  drawText('Products:', 50, y, 14);
  y -= 20;

  order.items.forEach((item, index: number) => {
    const productName = item?.product?.name || 'Unnamed Product';
    drawText(
      `${index + 1}. ${productName} (${item.quantity} x ${item.price} Tk)`,
      60,
      y
    );
    y -= 18;
  });

  y -= 10;
  drawText(`Delivery Charge: ${order.deliveryCharge} Tk`, 50, y);
  y -= 20;
  drawText(`Total: ${order.totalAmount} Tk`, 50, y, 14);

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });

  saveAs(blob, `invoice-${order._id}.pdf`);
}
