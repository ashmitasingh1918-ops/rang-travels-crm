const prisma = require("../config/prisma");

/**
 * Calculates the Indian Financial Year (April 1 to March 31) for a given date.
 * July 28, 2026 -> "26-27"
 * March 31, 2027 -> "26-27"
 * April 1, 2027 -> "27-28"
 * @param {Date} date
 * @returns {string} Returns fiscal year formatted as "YY-YY", e.g. "26-27"
 */
function getIndianFinancialYear(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-indexed (0 = Jan, 11 = Dec)
  
  let fiscalStartYear;
  if (month >= 3) { // April is index 3
    fiscalStartYear = year;
  } else {
    fiscalStartYear = year - 1;
  }
  
  const start = String(fiscalStartYear).slice(-2);
  const end = String(fiscalStartYear + 1).slice(-2);
  return `${start}-${end}`;
}

/**
 * Generates the next sequential Tour ID in format: RT|MS|{SEQUENTIAL_NUMBER}|{FINANCIAL_YEAR}
 * Safely handles transaction-level concurrency using PostgreSQL SELECT FOR UPDATE.
 * @param {object} tx - Prisma transaction client
 * @param {Date} date - Optional date to calculate the financial year
 * @returns {Promise<string>} Generated unique/exclusive Tour ID
 */
async function generateNextTourId(tx, date = new Date()) {
  const financialYear = getIndianFinancialYear(date);
  
  let generatedId;
  let isUnique = false;
  const maxAttempts = 100;
  let attempt = 0;

  while (!isUnique && attempt < maxAttempts) {
    attempt++;
    
    // Ensure counter entry exists for the financial year
    await tx.$executeRaw`
      INSERT INTO "TourCounter" ("financialYear", "nextValue")
      VALUES (${financialYear}, 1)
      ON CONFLICT ("financialYear") DO NOTHING
    `;

    // Lock the row exclusively to prevent concurrent reads/writes
    const counters = await tx.$queryRaw`
      SELECT "nextValue" FROM "TourCounter"
      WHERE "financialYear" = ${financialYear}
      FOR UPDATE
    `;

    if (!counters || counters.length === 0) {
      throw new Error(`Failed to lock/retrieve TourCounter for FY ${financialYear}`);
    }

    const currentVal = counters[0].nextValue;
    const paddedNumber = String(currentVal).padStart(2, '0');
    generatedId = `RT|MS|${paddedNumber}|${financialYear}`;

    // Increment current sequential counter
    await tx.$executeRaw`
      UPDATE "TourCounter"
      SET "nextValue" = "nextValue" + 1
      WHERE "financialYear" = ${financialYear}
    `;

    // Query output double check. Verify uniqueness in Booking table
    const existing = await tx.booking.findUnique({
      where: { fileNo: generatedId }
    });

    if (!existing) {
      isUnique = true;
    }
  }

  if (!isUnique) {
    throw new Error("Unable to generate a unique Tour ID after maximum attempts");
  }

  return generatedId;
}

module.exports = {
  getIndianFinancialYear,
  generateNextTourId
};
