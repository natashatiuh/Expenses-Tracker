import express from 'express';
import { subscriptionService } from './subscriptionsService';
import { auth } from '../common/middlewares/auth';
import { validation } from '../common/middlewares/validation';
import { MyRequest } from '../auth/requestDefinition';

export const router = express.Router()

router.patch('/add-subscription', auth(), async (req, res) => {
    try {
        const wasSubscriptionAdded = await subscriptionService.addSubscription((req as MyRequest).userId)
        if (!wasSubscriptionAdded) {
            res.send("Your subscription was NOT activated!")
        } else {
            res.send("Your subscription was activated successfully!")
        }
    } catch (error) {
        console.log(error)
        res.send(error)
    }
})

router.patch('/stop-subscription', auth(), async (req, res) => {
    try {
        const wasSubscriptionStopped = await subscriptionService.stopSubscription((req as MyRequest).userId)
        if (!wasSubscriptionStopped) {
            res.send("Your subscription was NOT stopped!")
        } else {
            res.send("Your subscription was stopped successfully!")
        }
    } catch(error) {
        console.log(error)
        res.send(error)
    }
})