const nodemailer = require('nodemailer');

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return nodemailer.createTransport({ jsonTransport: true });
  }

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user, pass }
  });
}

async function sendSaleSummary(client, sale, items) {
  if (!client?.email) return;

  const transporter = getTransporter();
  const itemLines = items
    .map((item) => `${item.productName} - Qtd: ${item.quantity} - Subtotal: R$ ${Number(item.subtotal).toFixed(2)}`)
    .join('\n');

  const text = [
    `Ola, ${client.name}!`,
    '',
    `Sua compra #${sale.id} foi registrada com sucesso.`,
    '',
    'Resumo:',
    itemLines,
    '',
    `Total: R$ ${Number(sale.total).toFixed(2)}`
  ].join('\n');

  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'no-reply@empresa.com',
    to: client.email,
    subject: `Resumo da compra #${sale.id}`,
    text
  });
}

module.exports = {
  sendSaleSummary
};
