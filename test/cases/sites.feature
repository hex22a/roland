Feature: Sites
  Adding and removing sites

  Scenario: Register Admin
    Given I send POST request to register with admin@test.test and 123456 to register

  Scenario Outline: Adding site
    Given I send POST request to login with username: <email> and password: <password>
    When User adds site with name: <siteName>, url: <url>, destinations: <destinations>, SMTP login: <SMTPLogin>, SMTP Password: <SMTPPassword>
    Then User can get new site as an object
    Examples:
      | email           | password | siteName | url               | destinations                    | SMTPLogin| SMTPPassword|
      | admin@test.test | 123456   | site1    | http://test1.test | mail@test.test;mail2@test.test  | foo      | bar         |
      | admin@test.test | 123456   | site2    | http://test2.test | mail@test.test;mail2@test.test  | foo      | bar         |
      | admin@test.test | 123456   | site3    | http://test3.test | mail@test.test;mail2@test.test  | foo      | bar         |
      | admin@test.test | 123456   | site4    | http://test4.test | mail@test.test;mail2@test.test  | foo      | bar         |