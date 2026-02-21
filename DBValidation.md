# Database Validation Strategy

This document outlines how UI tests would validate database records post-action, including a sample SQL query, isolation strategy, cleanup strategy, and retry logic.

## How a UI Test Validates a DB Record Post-Action

In a real-world scenario, after a user performs an action in the UI (e.g., placing an order), the UI test should verify that the corresponding data is correctly persisted in the database. 

1. **Perform UI Action**: The test executes the steps to place an order (e.g., happy path checkout).
2. **Retrieve Data**: The test extracts unique identifiers from the UI, such as an Order ID from the confirmation page.
3. **Query Database**: The test uses the DB utility (`support/database.ts`) to query the database using the extracted Order ID.
4. **Assert**: The test asserts that the returned database record matches the expected data (e.g., status, customer details, total amount).

## Sample SQL Query

```sql
-- Querying the orders table using an Order ID extracted from the UI
SELECT order_id, customer_id, status, total_amount 
FROM orders 
WHERE order_id = $1;
```

## Isolation Strategy

To ensure tests do not interfere with each other, we implement the following isolation strategies:

*   **Unique Test Data**: Each test scenario uses unique identifiers (e.g., generating unique email addresses or order numbers using UUIDs or timestamps) so that queries target specific records.
*   **Dedicated Test Database**: Tests run against a separate, dedicated test database instance, segregated from development or production environments.
*   **Transactional Tests**: If supported by the testing framework and database, wrap each test scenario in a database transaction that is rolled back at the end of the test, ensuring a clean state.

## Cleanup Strategy

Data created during test execution should be cleaned up to prevent database bloat and ensure consistency for subsequent runs.

*   **After Hooks**: Use Cucumber `After` hooks to execute SQL `DELETE` or `UPDATE` (e.g., soft delete) statements to remove the records created during the specific scenario.
*   **Data Teardown Scripts**: For complex scenarios, dedicated teardown functions can be called to walk the relational mapping and clean up child records before parent records.
*   **Database Reset**: Periodically (e.g., nightly or before a full test suite run), reset the entire test database to a known, baseline state using seed scripts.

## Retry Logic for Eventual Consistency

In modern architectural patterns (e.g., microservices, message queues, asynchronous processing), data might not be immediately available in the database right after the UI action completes. To handle this **eventual consistency**, we implement retry logic (polling) instead of hard waits.

```typescript
// Pseudocode for Retry Logic
import { Database } from '../support/database';

async function waitForDatabaseRecord(orderId: string, maxRetries = 5, retryIntervalMs = 2000) {
  for (let i = 0; i < maxRetries; i++) {
    const query = 'SELECT status FROM orders WHERE order_id = $1';
    const result = await Database.query(query, [orderId]);
    
    // If record found and status is expected, return success
    if (result.rows.length > 0 && result.rows[0].status === 'COMPLETED') {
      return result.rows[0];
    }
    
    // Wait before retrying
    if (i < maxRetries - 1) {
       await new Promise(resolve => setTimeout(resolve, retryIntervalMs));
    }
  }
  
  throw new Error(`Record ${orderId} not found or status not updated after ${maxRetries} retries.`);
}
```
