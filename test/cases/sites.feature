Feature: Sites
  Adding and removing sites

  Scenario Outline: Adding site
    When I send POST request to register with <email> and <password>
    Given I send POST request to login with username: <email> and password: <password>
    When User adds site with name: <siteName>, url: <url>, destinations: <destinations>
    Then User can get new site as an object
    Examples:
      | email           | password | siteName | url               | destinations                    |
      | admin@test.test | 123456   | site1    | http://test1.test | mail@test.test;mail2@test.test  |
      | admin@test.test | 123456   | site2    | http://test2.test | mail@test.test;mail2@test.test  |
      | admin@test.test | 123456   | site3    | http://test3.test | mail@test.test;mail2@test.test  |
      | admin@test.test | 123456   | site4    | http://test4.test | mail@test.test;mail2@test.test  |