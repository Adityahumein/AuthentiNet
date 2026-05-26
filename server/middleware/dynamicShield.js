// CRITICAL: Verify the path dots step back correctly into your models directory!
const SecurityLog = require('../models/SecurityLog'); 

const BASE_LOCKDOWN_TIME = 1 * 60 * 1000; 
const STRIKE_MAX_MULTIPLIER = 15;        
const REPUTATION_CLEAN_WINDOW = 24 * 60 * 60 * 1000; 

const dynamicShield = async (req, res, next) => {
  const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const currentTime = new Date();

  try {
    let record = await SecurityLog.findOne({ clientIp });

    if (record) {
      if (currentTime - record.lastIncidentTime > REPUTATION_CLEAN_WINDOW && record.strikes > 0) {
        record.strikes = 0;
        await record.save();
      }

      if (currentTime < record.lockoutUntil) {
        const remainingSeconds = Math.ceil((record.lockoutUntil - currentTime) / 1000);
        return res.status(429).json({
          success: false,
          error: "Automated scraping signature detected.",
          securityStatus: "Long-Term Reputational Lockdown Active",
          cooldownRemaining: `${remainingSeconds} seconds`
        });
      }
    }

    res.triggerSecurityStrike = async () => {
      const updateTime = new Date();
      if (!record) {
        record = new SecurityLog({ clientIp });
      }
      record.strikes += 1;
      record.lastIncidentTime = updateTime;
      const multiplier = Math.min(record.strikes, STRIKE_MAX_MULTIPLIER);
      const dynamicPenaltyDuration = BASE_LOCKDOWN_TIME * multiplier;
      record.lockoutUntil = new Date(updateTime.getTime() + dynamicPenaltyDuration);
      await record.save();
      console.error(`🚨 [Security Escalation] IP ${clientIp} penalized. Strikes: ${record.strikes}.`);
    };

    next();
  } catch (error) {
    console.error("[Security Middleware Error]:", error.message);
    next();
  }
};

module.exports = dynamicShield;