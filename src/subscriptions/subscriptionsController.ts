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
            res.json({success: false})
        } else {
            res.json({success: true})
        }
    } catch (error) {
        console.log(error)
        res.json({success: false})
    }
})

router.patch('/stop-subscription', auth(), async (req, res) => {
    try {
        const wasSubscriptionStopped = await subscriptionService.stopSubscription((req as MyRequest).userId)
        if (!wasSubscriptionStopped) {
            res.json({success: false})
        } else {
            res.json({success: true})
        }
    } catch(error) {
        console.log(error)
        res.json({success: false})
    }
})