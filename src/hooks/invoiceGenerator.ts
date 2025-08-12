// lib/generateInvoice.ts
import {
  PDFDocument,
  rgb,
  PDFFont,
  PageSizes,
  PDFPage,
  StandardFonts,
} from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { saveAs } from "file-saver";
import { IIOrder } from "@/types/product";

async function fetchResource(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load resource: ${url}`);
  return res.arrayBuffer();
}

async function drawHeader(
  pdfDoc: PDFDocument,
  page: PDFPage,
  boldFont: PDFFont,
  logoUrl: string
) {
  try {
    const logoBytes = await fetchResource(logoUrl);
    const logo = await pdfDoc.embedPng(logoBytes);
    const dims = logo.scale(0.3);
    page.drawImage(logo, {
      x: 50,
      y: page.getHeight() - 80,
      width: dims.width,
      height: dims.height,
    });
  } catch {
    page.drawText("Your Company", {
      x: 50,
      y: page.getHeight() - 60,
      font: boldFont,
      size: 20,
      color: rgb(0.2, 0.2, 0.2),
    });
  }

  page.drawText("Unique Store Bd", {
    x: page.getWidth() - 150,
    y: page.getHeight() - 60,
    font: boldFont,
    size: 18,
    color: rgb(0.1, 0.1, 0.1),
  });
}

function drawSection(
  page: PDFPage,
  font: PDFFont,
  boldFont: PDFFont,
  title: string,
  content: string[],
  x: number,
  y: number
) {
  page.drawText(title, { x, y, font: boldFont, size: 11, color: rgb(0.4, 0.4, 0.4) });
  let offsetY = y - 18;
  content.forEach((line) => {
    page.drawText(line, { x, y: offsetY, font, size: 12, color: rgb(0, 0, 0) });
    offsetY -= 16;
  });
  return offsetY;
}

async function drawInvoiceTable(
  pdfDoc: PDFDocument,
  page: PDFPage,
  defaultFont: PDFFont,
  boldFont: PDFFont,
  bengaliFont: PDFFont,
  y: number,
  order: IIOrder
) {
  const imageLeft = 50;
  const itemLeft = 95;
  const qtyLeft = 350;
  const priceLeft = 420;
  const totalLeft = 500;

  page.drawRectangle({
    x: 45,
    y: y - 5,
    width: page.getWidth() - 90,
    height: 25,
    color: rgb(0.93, 0.93, 0.93),
  });

  page.drawText("Product", { x: itemLeft, y, font: boldFont, size: 12 });
  page.drawText("Qty", { x: qtyLeft, y, font: boldFont, size: 12 });
  page.drawText("Price", { x: priceLeft, y, font: boldFont, size: 12 });
  page.drawText("Total", { x: totalLeft, y, font: boldFont, size: 12 });

  let currentY = y - 40;
  for (const item of order.items) {
    try {
      const imgUrl = item.product?.images?.[0]?.url || "";
      if (imgUrl) {
        const imgBytes = await fetchResource(imgUrl);
        const embedImg = imgBytes.toString().includes("PNG")
          ? await pdfDoc.embedPng(imgBytes)
          : await pdfDoc.embedJpg(imgBytes);
        page.drawImage(embedImg, { x: imageLeft, y: currentY - 5, width: 35, height: 35 });
      }
    } catch {}

    const nameFont = /[\u0980-\u09FF]/.test(item.product?.name)
      ? bengaliFont
      : defaultFont;

    page.drawText(item.product?.name || "N/A", {
      x: itemLeft,
      y: currentY,
      font: nameFont,
      size: 11,
    });
    page.drawText(item.quantity.toString(), { x: qtyLeft, y: currentY, font: defaultFont, size: 11 });
    page.drawText(`${item.price.toFixed(2)}`, { x: priceLeft, y: currentY, font: defaultFont, size: 11 });
    page.drawText(`${(item.quantity * item.price).toFixed(2)}`, {
      x: totalLeft,
      y: currentY,
      font: defaultFont,
      size: 11,
    });

    page.drawLine({
      start: { x: 45, y: currentY - 20 },
      end: { x: page.getWidth() - 45, y: currentY - 20 },
      thickness: 0.4,
      color: rgb(0.85, 0.85, 0.85),
    });

    currentY -= 45;
  }
  return currentY;
}

export async function generateInvoicePdf(order: IIOrder) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const page = pdfDoc.addPage(PageSizes.A4);
  const { width, height } = page.getSize();

  const defaultFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const bengaliFontBytes = await fetchResource("/fonts/HindSiliguri-Medium.ttf");
  const bengaliFont = await pdfDoc.embedFont(bengaliFontBytes);

  await drawHeader(pdfDoc, page, boldFont, "https://res.cloudinary.com/dxmvrhcjx/image/upload/v1736267263/hm8yhv7pehnbxw4klxym.png");

  let y = height - 120;
  drawSection(page, defaultFont, boldFont, "Invoice To:", [order.fullName, order.address, order.phone], 50, y);
  drawSection(
    page,
    defaultFont,
    boldFont,
    "Invoice Details:",
    [`Invoice ID: ${order.orderId}`, `Date: ${new Date(order.createdAt).toLocaleDateString()}`, `Status: ${order.status}`],
    350,
    y
  );

  y = height - 240;
  y = await drawInvoiceTable(pdfDoc, page, defaultFont, boldFont, bengaliFont, y, order);

  const totalsY = y + 10;
  const totalsX = width - 200;
  page.drawText("Delivery Charge:", { x: totalsX, y: totalsY, font: defaultFont, size: 12 });
  page.drawText(`${order.deliveryCharge.toFixed(2)} Tk`, { x: width - 100, y: totalsY, font: defaultFont, size: 12 });
  page.drawText("Total Amount:", { x: totalsX, y: totalsY - 25, font: boldFont, size: 14 });
  page.drawText(`${order.totalAmount.toFixed(2)} Tk`, { x: width - 100, y: totalsY - 25, font: boldFont, size: 14 });

  page.drawText("Thank you for your business!", {
    x: width / 2 - 100,
    y: 50,
    font: defaultFont,
    size: 14,
    color: rgb(0.5, 0.5, 0.5),
  });

  const pdfBytes = await pdfDoc.save();
  saveAs(new Blob([pdfBytes], { type: "application/pdf" }), `Invoice-${order.orderId}.pdf`);
}
