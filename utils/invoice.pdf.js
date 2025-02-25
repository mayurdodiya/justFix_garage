const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require("path");

// const filePath = path.join(__dirname, '..', 'views', 'invoice.html');
// console.log(filePath,'--------------------------------- inside path')

async function generateInvoice(invoiceData) {
    const filePath = path.join(__dirname, '..', 'views', 'invoice.html');
    let html = fs.readFileSync(filePath, 'utf8');

    const logoBase64 = fs.readFileSync('uploads/logo2.png', { encoding: 'base64' });
    const logoDataURI = `data:image/png;base64,${logoBase64}`;

    // Replace placeholders with actual data
    html = html.replace('{{logoPath}}', logoDataURI);
    html = html.replace('{{invoiceDate}}', invoiceData.invoiceDate);
    html = html.replace('{{user.name}}', invoiceData.user.name);
    html = html.replace('{{user.phone}}', invoiceData.user.phone);
    html = html.replace('{{user.email}}', invoiceData.user.email);
    html = html.replace('{{garage.name}}', invoiceData.garage.name);
    html = html.replace('{{garage.location}}', invoiceData.garage.location);
    html = html.replace('{{appointmentId}}', invoiceData.appointmentId);

    // Generate service rows
    let serviceRows = '';
    invoiceData.services.forEach((service, index) => {
        serviceRows += `
            <tr>
                <td>${index + 1}</td>
                <td>${service.name}</td>
                <td>₹${service.charge}</td>
                <td>${service.status}</td>
                <td>${service.transactionId}</td>
            </tr>`;
    });

    html = html.replace('{{serviceRows}}', serviceRows);
    html = html.replace('{{totalPaid}}', invoiceData.totalPaid);

    // Launch Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set content and generate PDF
    await page.setContent(html, { waitUntil: 'load' });
    await page.pdf({ path: 'invoice.pdf', format: 'A4' });

    await browser.close();
    console.log('PDF Invoice Generated: invoice.pdf');
}

module.exports = { generateInvoice };