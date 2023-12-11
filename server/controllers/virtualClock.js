var cron = require('node-cron');
var FakeTimers = require("@sinonjs/fake-timers");
const schedule = require('node-schedule');
const dao = require("../dao");
const { validationResult } = require("express-validator");
const CronJob = require('cron').CronJob;


var clock = null;

async function setVirtualClock(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors });
    }
    try {
        await dao.beginTransaction();
        const newvirtual = req.body.datetime;
        if (clock && (typeof clock.setSystemTime === 'function')) {
            clock.setSystemTime(newvirtual);
        } else {
            clock = FakeTimers.install({
                now: newvirtual,
                shouldAdvanceTime: true
            });
        }
        const now = new Date();
        console.log("Server time is: ", now.toString());
        const response_msg = await dao.setExpired(newvirtual);
        text = {
            update: response_msg,
            now: newvirtual
        }
        await dao.commit();
        return res.status(200).json(text);
    } catch (err) {
        await dao.rollback();
        console.log(err)
        return res.status(500).json(err);
    }
};

async function uninstallVirtualClock(req, res) {
    try {
        if (clock && (typeof clock.uninstall === 'function')) {
            clock.uninstall();
            clock = null;
        }
        const current = new Date();
        const response_msg = await dao.setExpired(current);
        console.log("Current Time:", current.toLocaleString('italy'));
        text = {
            update: response_msg,
            now: current
        }
        return res.status(200).json(text);
    } catch (err) {
        console.log(err)
        return res.status(500).json(err);
    }
};


function create_schedule() {
    const scheduledTask = cron.schedule('0 0 0 * * *', async () => {
        await update();
    });
}

const update = async () => {
    try {
        const now = new Date();
        const result = await dao.setExpired(now);
        console.log('Task executed at 00:00 am every day in Rome timezone.');
    } catch (err) {
        console.error(err);
    }
}
module.exports = { setVirtualClock, uninstallVirtualClock, create_schedule };