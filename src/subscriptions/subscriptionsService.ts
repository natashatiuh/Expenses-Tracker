import { subscriptionsRepository } from "./subscriptionsRepository";

class SubscriptionsService {
    async addSubscription(userId: string) {
        const wasSubscriptionAdded = await subscriptionsRepository.addSubscription(userId)
        return wasSubscriptionAdded
    }

    async stopSubscription(userId: string) {
        const wasSubscriptionStopped = await subscriptionsRepository.deleteSubscription(userId)
        return wasSubscriptionStopped
    }
}

export const subscriptionService = new SubscriptionsService()

