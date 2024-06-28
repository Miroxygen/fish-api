# Overview

This repository contains a web application built using Koa.js, designed to manage user authentication, fish catch records, and webhook subscriptions. It leverages MongoDB for data storage and JWT for authentication, offering a robust and scalable solution for managing various user-related and data recording functionalities.

## Core Functionalities


### Authentication

AuthController: Manages user authentication using GitLab OAuth and JWT. Provides endpoints to display the authentication page, authenticate with an external token, generate internal JWT tokens, and verify these tokens.

### Fish Catch Records

CatchController: Handles CRUD operations for fish catch records. Allows users to register new catches, retrieve all catches, get specific catch details, update, and delete catch records.

### Webhook Subscriptions

SubscribeController: Manages webhook subscriptions, allowing clients to register and delete webhook subscriptions, retrieve all subscribers, and send webhook notifications.

### Static Data Management

TestDataManager: Facilitates the addition of static data for testing purposes and ensures the cleanup of test data on server exit.

### Technologies Used

   - Koa.js: A lightweight and modular Node.js framework.
   - MongoDB: A NoSQL database for storing user and fish catch data.
  -  Mongoose: An ODM for MongoDB to manage data models.
  -  JWT: For secure authentication.
  -  dotenv: For managing environment variables.
  -  axios: For making HTTP requests to external services.
  -  helmet: For enhancing security.
  -  koa-session: For session management.
 -   koa-bodyparser: For parsing request bodies.

## Flow

  1. Authentication Flow:
      -  Users authenticate via GitLab OAuth.
      -  Tokens are generated and verified using JWT.
      -  Authenticated sessions are managed using Koa's session middleware.

  2.  Fish Catch Management:
      -  Users can register new fish catches with detailed information.
      -  Retrieve all catches or specific catches by ID.
      -  Update or delete existing catches.

   3. Webhook Subscription:
      -  Register new webhook subscriptions.
      -  Delete existing subscriptions.
      -  Send notifications to subscribers when events occur.

  4.  Static Data Management:
      -  Populate the database with test data for development and testing.
      -  Cleanup test data on server shutdown.

## Setup

  1. Clone the repository.
   2. Install dependencies: npm install
  3.  Set up environment variables in a .env file.
  4.  Start the application: npm start

## Environment Variables

   - PORT: The port on which the server will run.
  -  SESSION_SECRET: Secret for session management.
  -  MONGODB_PASSWORD: Password for MongoDB.
  -  PRIVATE_KEY: Private key for JWT signing.
  -  PUBLIC_KEY: Public key for JWT verification.
  -  BASE_URL: Base URL for the application.
  -  GITLAB_CLIENT_ID: GitLab OAuth client ID.
  -  GITLAB_CLIENT_SECRET: GitLab OAuth client secret.
  -  GITLAB_REDIRECT_URI: GitLab OAuth redirect URI.

## Models

### FishCatch Model

   Represents a fish catch record with properties for fish_id, catcher, position, waterBodyName, city, species, weight, length, imageUrl, and catchTimestamp.

### Subscriber Model

  Represents a webhook subscriber with properties for url and clientSecret.

## Services

### GitLabOauthService

  Manages OAuth interactions with GitLab, including generating authorization URLs and exchanging authorization codes for tokens.

## Middleware

### Authentication Middleware

  -  alreadyAuthenticatedMiddleware: Ensures the user is not already authenticated.
  -  notAuthenticatedMiddleware: Ensures the user is authenticated.
  -  verifyToken: Verifies JWT tokens.

## License

This project is licensed under the MIT License.
