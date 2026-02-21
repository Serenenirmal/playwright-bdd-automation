Feature: Checkout functionality
  
  Scenario: Happy path E2E
    Given I login as "standard_user"
    When I add "Sauce Labs Backpack" to the cart
    And I checkout with valid customer details
    Then I should see the order confirmation page
