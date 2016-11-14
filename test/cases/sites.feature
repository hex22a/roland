Feature: Sites
  Adding and removing sites

  Scenario Outline: Adding site
    Given Registered user with username: <email> and password: <password>
    And I send POST request to login with username: <email> and password: <password>
    When User adds site with name: <siteName>, url: <url>, destinations: <destinations>
    Then User can get UUID of new site