# Basel HRMS React

This project is a React-based HRMS application.

## Recent Changes

A bug was fixed in the `PunchTimings` component that caused the UI to flicker or appear to crash after performing a punch-in, punch-out, or break action. The issue was a race condition where an optimistic UI update was being overwritten by a slightly delayed API call that returned stale data.

The fix removes the immediate refetching of data after these actions, relying on the optimistic update to provide a stable and responsive user experience.

## Testing

A test file, `src/components/PunchTimings.test.jsx`, has been added to verify the fix and ensure the component behaves as expected.

### Running Tests

The project was not previously set up for testing. To run the tests, you will need to install the necessary dependencies and configure the project.

1.  **Install testing libraries:**

    ```bash
    npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom babel-jest @babel/preset-env @babel/preset-react
    ```

2.  **Configure Babel:**

    Create a `babel.config.json` file in the root of the project with the following content:

    ```json
    {
      "presets": [
        ["@babel/preset-env", { "targets": { "node": "current" } }],
        ["@babel/preset-react", { "runtime": "automatic" }]
      ]
    }
    ```

3.  **Configure Jest:**

    Create a `jest.config.json` file in the root of the project with the following content:
    
    ```json
    {
      "testEnvironment": "jsdom",
      "setupFilesAfterEnv": ["<rootDir>/jest.setup.js"],
      "transform": {
        "^.+\\.(js|jsx)$": "babel-jest"
      },
      "moduleNameMapper": {
        "\\.css$": "<rootDir>/__mocks__/styleMock.js"
      }
    }
    ```

4.  **Create Jest Setup File:**

    Create a `jest.setup.js` file in the root of the project with the following content:

    ```javascript
    import '@testing-library/jest-dom';
    ```

5. Create Style Mock File:

   Create a directory `__mocks__` in the root and a file `styleMock.js` inside it with the following content: 
   
   ```javascript
   module.exports = {};
   ```

6.  **Add Test Script:**

    Add the following script to your `package.json`:

    ```json
    "scripts": {
      "test": "jest"
    }
    ```

7.  **Run Tests:**

    ```bash
    npm test
    ```

