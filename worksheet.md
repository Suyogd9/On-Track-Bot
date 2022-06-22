## Deploy documentation

## **Meeting Notes**

#### TEAM MEMBERS: 
1) Vinay Deshmukh (vsdeshmu)
2) Suyog Dharmadhikari (sdharma2)
3) Sairaj Nemmaniwar (ssnemman)
4) Vedang Pingle (vspingle)

#### Date: 04/17/2022
1)  What did you accomplish since the last meeting?:
    * Tested working of all use cases.
    * Fixed critical bugs in the code discovered during acceptance testing.
    * Reviewed final code
2) What you're working on next
    * Creating screencast
    * Start work on Project Report

#### Date: 04/16/2022
1)  What did you accomplish since the last meeting?:
    * Created a completely new instance for bot and tested the ansible scripts.
    * Documented additional instructions required for setting up database.

2) What you're working on next
    * Testing the working of all use cases.
    * Reviewing through all deployment instructions , acceptance testing information provided.
    * Reviewing the final code.

#### Date: 04/15/2022
1)  What did you accomplish since the last meeting?:
    * Successfully tested the working of forever.
    * Documented acceptance test instructions required to evaluate the use cases. 
    * Database is created and setup using ansible and database is populated manually.

2) What you're working on next
    * Testing the working of ansible scripts.
    * Documenting instructions on setting up database.

3) Any blockers or obstacles
    * Deciding on the best way to run the ansible scripts. Either from local machine or directly on bot server?

#### Date: 04/14/2022
1)  What did you accomplish since the last meeting?:
    * Found a way to clone repository using Personal Access Token.
    * Created ansible script that would clone repository ,install required packages and run the bot.
    * Code developed for integrating forever.

2) What you're working on next
    * Testing the working of forever by manually crashing the bot.
    * Developing acceptance tests for all the use cases.

3) Any blockers or obstacles
    * How to setup database for bot? Two available options are using ansible script or manually creating the database.

#### Date: 04/13/2022
1)  What did you accomplish since the last meeting?:
    * Documenting step by step process to obtain various keys required by a new user to run the bot.
    * Created a yml file to store all environment variables.    
    * Made required changes to code to handle edge cases.

2) What you're working on next
    * Creating instructions for setting up database and populating data in tables.
    * Integrating the use of forever with existing code. 

3) Any blockers or obstacles 
    *  Facing diffculty Cloning a private repository using ssh. 
    *  Getting clarifications on whether storing all variables in a single file is the correct approach.

#### Date: 04/12/2022
1)  What did you accomplish since the last meeting?:
    * Created a server instance for bot and tested access for all team members.
    * Reviewed the code to look for edge cases and analyze possible changes.

2) What you're working on next
    *  Creating a list of all Keys and Tokens that is being used in the code.
    *  Creating ansible scripts to automate deployment.

3) Any blockers or obstacles 
    * None

#### Date: 04/11/2022
1)  What did you accomplish since the last meeting?:
    * There are no prior pending tasks.

2) What you're working on next
    * Planning tasks/stories for the deployment milestone.
    * Handling code changes to adapt to edge cases.

3) Any blockers or obstacles 
    * No blockers so far, as stories are being created.

4) Tasks to complete for deploy milestone:
   * Create Acceptance tests
   * Setup forever and test its working
   * Create instructions for deployment (includes setting up keys, tokens and populating database)  
   * Creating ansible scripts for deployment

#### Date: 04/01/2022
1)  What did you accomplish since the last meeting?:
    * Ensured there were no edge cases to cover.
    * Demo was completed smoothly.
    * Reviewed the final version of PROCESS.md file.

#### Date: 03/31/2022
1)  What did you accomplish since the last meeting?:
    * Tested all the usecases successfully without any blockers.
    * Tested multiuser support functionality successfully.

2) What you're working on next
    * Working on creating the iteration worksheet for iteration 2.
    * Working on documenting the status and process reflection as discussed during meeting.

#### Date: 03/30/2022
1)  What did you accomplish since the last meeting?:
    * Completed set active board task.
    * Completed test cases for set active board task.
    * Updated DB schema by adding a column for user token.

2) What you're working on next
    * Testing all the tasks using mattermost for functionality.
    * Testing multiuser support.

#### Date: 03/29/2022
1)  What did you accomplish since the last meeting?:
    * Completed moveTask test cases.  
    * Completed basic code structure for set active board task.
    * Started working on multi-user support.

2) What you're working on next
    * Complete set Active board task.
    * Add set active board test cases.

#### Date: 03/28/2022
1)  What did you accomplish since the last meeting?:
    * Started working on setActive board task.
    * Completed moveTask

2) What you're working on next
    * Add tests for moveTask
    * Complete setActive board task.

3) Any blockers or obstacles
    * ShortId cannot be used to update db, so need to resolve this.
      (Resolve is to query all boards, and find board based on shortid and then use the matched board object to get the 23 digit id.)

#### Date: 03/27/2022
1)  What did you accomplish since the last meeting?:
    * Finalized the specifics in deciding how to implemet moveTask.
    * Created the basic structure of the moveTask

2) What you're working on next
    * Add multi-user support by storing more details in the database.

#### Date: 03/26/2022
1)  What did you accomplish since the last meeting?:
    * Completed iteration one successfully.
    * Discussed approach for iteration 2 tasks.
    * Created initial stories for iteration 2.

2) What you're working on next
    * Start working on the assigned stories.


#### Date: 03/25/2022
1)  What did you accomplish since the last meeting?:
    * Special characters were allowed in task names.
    * Use cases such as Addtask, createBoard and the required test cases were completed.
    * Removed unnecessary console log statements and added comments in code.
    * Added API calls for addtask command.

2) What you're working on next
    * Plan and discuss user stories and tasks for next sprint.

#### Date: 03/24/2022
1)  What did you accomplish since the last meeting?:
    * Ran tests on updated code merged with dev
    * Display active board task completed
    * Create board mocking removed

2) What you're working on next
    * Note prerequisite conditions for add task to work
    * Implement tests to test the list tasks use case
    * Code style checks. Cleaning up code. Refactoring. Adding comments.

3) Any blockers or obstacles
    * How can we increase test coverage further?
    * How to handle special characters in task names? (Permit special char or only alphanumeric characters?)
    * Fix database entries to simplify trello board lookup

#### Date: 03/23/2022
1)  What did you accomplish since the last meeting?:
    * Submitted and merged PR for running Trello API calls for List Tasks use case
    * Setup Postgres SQL locally to work on show active board task

2) What you're working on next
    * Work on display active board task
    * Implement tests to test the list tasks use case

3) Any blockers or obstacles 
    * Discuss assumptions regarding add task (Add tasks to todo by default or not?)
    * Add task command syntax for adding collaborators.

#### Date: 03/22/2022
1)  What did you accomplish since the last meeting?:
    * Remove mocks from the ListTasksHandler and test code with actual API calls
    * Settled on Collective Code Ownership as core practice and shared code as corollary practice

2) What you're working on next
    * Merge updated code for list tasks use case with dev
    * Implement tests to test the list tasks use case

3) Any blockers or obstacles 
    * None

#### Date: 03/21/2022
1)  What did you accomplish since the last meeting?:
    * This is the first meeting of the coding sprint. Hence, no prior pending tasks.

2) What you're working on next
    * Planning tasks/stories for the first iteration.
    * Decide core and corollary practices for coding sprints

3) Any blockers or obstacles 
    * No blockers so far, as stories are being created.

4) Stories to implement in sprint 1:
   * Create new project board on Trello
   * Add task to a list on current active project board with collaborators
   * Display tasks in a list (todo, inprogress, done)
   * List tasks in the current board
   * Tests for the use cases

































