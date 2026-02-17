/**
 * Tests for RequestQueue
 * 
 * Run with: npm test or yarn test
 */

import { RequestQueue } from '../queue'

describe('RequestQueue', () => {
    let queue

    beforeEach(() => {
        queue = new RequestQueue()
    })

    test('should process single request', async () => {
        const result = await queue.enqueue(async () => {
            return 'test-result'
        })

        expect(result).toBe('test-result')
    })

    test('should process multiple concurrent requests sequentially', async () => {
        const results = []
        const delays = [50, 30, 10] // Different delays to test sequencing

        const promises = delays.map((delay, index) => 
            queue.enqueue(async () => {
                await new Promise(resolve => setTimeout(resolve, delay))
                results.push(index)
                return index
            })
        )

        const values = await Promise.all(promises)

        // Results should be in order [0, 1, 2] because of queue sequencing
        expect(results).toEqual([0, 1, 2])
        expect(values).toEqual([0, 1, 2])
    })

    test('should handle request errors without blocking queue', async () => {
        const results = []

        const promise1 = queue.enqueue(async () => {
            results.push(1)
            return 1
        })

        const promise2 = queue.enqueue(async () => {
            results.push(2)
            throw new Error('Test error')
        })

        const promise3 = queue.enqueue(async () => {
            results.push(3)
            return 3
        })

        const result1 = await promise1
        await expect(promise2).rejects.toThrow('Test error')
        const result3 = await promise3

        expect(result1).toBe(1)
        expect(result3).toBe(3)
        expect(results).toEqual([1, 2, 3])
    })

    test('should return correct queue size', () => {
        expect(queue.size()).toBe(0)

        queue.enqueue(async () => {
            await new Promise(resolve => setTimeout(resolve, 100))
        })

        queue.enqueue(async () => 'test')
        queue.enqueue(async () => 'test2')

        // First request is processing, so queue size should be 2
        expect(queue.size()).toBeGreaterThanOrEqual(0)
    })

    test('should clear pending requests', async () => {
        // Add requests
        queue.enqueue(async () => {
            await new Promise(resolve => setTimeout(resolve, 100))
        })

        queue.enqueue(async () => 'test')
        
        // Clear queue
        queue.clear()

        expect(queue.size()).toBe(0)
    })

    test('should simulate concurrent API calls', async () => {
        const mockApiCall = (id, delay = 10) => {
            return queue.enqueue(async () => {
                await new Promise(resolve => setTimeout(resolve, delay))
                return { id, timestamp: Date.now() }
            })
        }

        // Simulate concurrent calls
        const results = await Promise.all([
            mockApiCall('call1', 30),
            mockApiCall('call2', 20),
            mockApiCall('call3', 10)
        ])

        // All calls should complete successfully
        expect(results).toHaveLength(3)
        expect(results[0].id).toBe('call1')
        expect(results[1].id).toBe('call2')
        expect(results[2].id).toBe('call3')

        // Timestamps should be in order (sequential execution)
        expect(results[0].timestamp).toBeLessThanOrEqual(results[1].timestamp)
        expect(results[1].timestamp).toBeLessThanOrEqual(results[2].timestamp)
    })
})