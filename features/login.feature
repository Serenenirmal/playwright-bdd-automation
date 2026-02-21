Feature: Login functionality

  Scenario: Negative login
    Given I attempt login with invalid credentials
    Then I should see an authentication error message
    And I should remain on the login page
