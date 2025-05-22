# Forge Jira Expense Tracker

This project is a Jira Forge app built using the UI Kit and the `jira:issuePanel` module. The app allows users to manage a list of expenses directly within the context of a Jira issue. Initially, the app displays test expense data in a tabular format along with a calculated total. As the app progresses, it is enhanced to allow users to create, update, and retrieve their own expense data, which is stored securely using Forge’s key-value storage API.

The user interface was developed using UI Kit components like Box, Button, DynamicTable, Textfield, and Text, providing a clean and responsive in-Jira experience. By the end of the project, users have a functional, persistent, and interactive panel embedded in their Jira issues for expense tracking.

See [developer.atlassian.com/platform/forge/](https://developer.atlassian.com/platform/forge) for documentation and tutorials explaining Forge.

## Requirements

See [Set up Forge](https://developer.atlassian.com/platform/forge/set-up-forge/) for instructions to get set up.

## Quick start

- Modify your app frontend by editing the `src/frontend/index.jsx` file.

- Modify your app backend by editing the `src/resolvers/index.js` file to define resolver functions. See [Forge resolvers](https://developer.atlassian.com/platform/forge/runtime-reference/custom-ui-resolver/) for documentation on resolver functions.

- Build and deploy your app by running:

```
forge deploy
```

- Install your app in an Atlassian site by running:

```
forge install
```

- Develop your app by running `forge tunnel` to proxy invocations locally:

```
forge tunnel
```

### Notes

- Use the `forge deploy` command when you want to persist code changes.
- Use the `forge install` command when you want to install the app on a new site.
- Once the app is installed on a site, the site picks up the new app changes you deploy without needing to rerun the install command.

## Support

See [Get help](https://developer.atlassian.com/platform/forge/get-help/) for how to get help and provide feedback.
