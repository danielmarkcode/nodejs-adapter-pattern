const uuid = require('uuid');

class ExternalPaymentServiceAdapter {
  constructor(externalPaymentService) {
    this.externalPaymentService = externalPaymentService;
  }

  async createCharge({ customerId, amount, currency }) {
    try {
      const chargeId = await this.externalPaymentService.createCharge(customerId, `${amount} ${currency}`);
      return chargeId;
    } catch (err) {
      throw new Error(`Error creating charge: ${err.message}`);
    }
  }

  async cancelCharge({ chargeId }) {
    try {
      await this.externalPaymentService.cancelCharge(chargeId);
    } catch (err) {
      throw new Error(`Error cancelling charge: ${err.message}`);
    }
  }

  async updateCharge({ chargeId, customerId, amount, currency }) {
    try {
      await this.externalPaymentService.cancelCharge(chargeId);
      const newChargeId = await this.externalPaymentService.createCharge(customerId, `${amount} ${currency}`);
      return newChargeId;
    } catch (err) {
      throw new Error(`Error updating charge: ${err.message}`);
    }
  }

  listCharges() {
    const charges = [];

    for (const charge of this.externalPaymentService.pendingCharges) {
      const [amount, currency] = charge.value.split(' ');
      charges.push({
        chargeId: charge.chargeId,
        customerId: charge.customerId,
        amount: parseFloat(amount),
        currency: currency,
      });
    }

    return charges;
  }
}

module.exports = ExternalPaymentServiceAdapter;
