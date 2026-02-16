/**
 * RequestQueue - Manages sequential execution of async native calls
 * Prevents concurrent promise conflicts in native bridge layer
 */
export class RequestQueue {
    constructor() {
        this.queue = []
        this.isProcessing = false
    }

    /**
     * Add a request to the queue and return a promise
     * @param {Function} requestFunction - Async function that returns a promise
     * @returns {Promise} Promise that resolves/rejects with the request result
     */
    enqueue(requestFunction) {
        return new Promise((resolve, reject) => {
            this.queue.push({
                execute: requestFunction,
                resolve,
                reject
            })

            // Start processing if not already running
            if (!this.isProcessing) {
                this.processNext()
            }
        })
    }

    /**
     * Process the next request in the queue
     */
    async processNext() {
        // Check if there are requests in the queue
        if (this.queue.length === 0) {
            this.isProcessing = false
            return
        }

        this.isProcessing = true

        // Get the next request
        const request = this.queue.shift()

        try {
            // Execute the request function and wait for its result
            const result = await request.execute()
            request.resolve(result)
        } catch (error) {
            request.reject(error)
        }

        // Process next request
        this.processNext()
    }

    /**
     * Clear all pending requests (useful for cleanup)
     */
    clear() {
        this.queue = []
        this.isProcessing = false
    }

    /**
     * Get the number of pending requests
     */
    size() {
        return this.queue.length
    }
}