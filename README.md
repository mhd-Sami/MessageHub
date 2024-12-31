# MessageHub Backend

## Overview
MessageHub is a real-time chat application that allows users to communicate with each other through text messages. The backend of MessageHub is built using Node.js, Express, and MongoDB. It provides RESTful APIs for user authentication, chat management, and message handling. The backend also integrates with Socket.io for real-time communication and supports features like group chats, disappearing messages, and email verification.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Socket.io Events](#socketio-events)
- [Error Handling](#error-handling)
- [Contributing](#contributing)
- [License](#license)

## Features
- User authentication (registration, login, password reset)
- Email verification
- Create, update, and delete chats
- Group chat management (add/remove users, update group admin)
- Real-time messaging with Socket.io
- Disappearing messages
- File attachments in messages
- Email notifications for password reset

## Technologies Used
- Node.js
- Express
- MongoDB
- Mongoose
- Socket.io
- JWT (JSON Web Tokens)
- Nodemailer
- Bcrypt.js
- Cloudinary (for file uploads)

## Project Structure
```
backend/
├── config/
│   ├── db.js
│   ├── generateToken.js
│   └── nodemailer.js
├── controllers/
│   ├── chatControllers.js
│   ├── messageControllers.js
│   └── userControllers.js
├── email_verification_utils/
│   └── sendEmail.js
├── mailers/
│   └── password_mailer.js
├── middleware/
│   ├── authMiddleware.js
│   └── errorMiddleware.js
├── models/
│   ├── chatModel.js
│   ├── message.js
│   ├── token.js
│   └── userModel.js
├── routes/
│   ├── chatRoutes.js
│   ├── messageRoutes.js
│   └── userRoutes.js
├── data.js
└── server.js
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/mhd-Sami/MessageHub.git
cd MessageHub/backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (see [Environment Variables](#environment-variables))

4. Start the server:
```bash
npm start
```

## Environment Variables
Create a `.env` file in the backend directory and add the following environment variables:

```
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
EMAIL=<your_email_address>
PASSWORD=<your_email_password>
LOCALHOST=http://localhost:3000
```

## API Endpoints

### User Routes
- **POST** `/api/user` - Register a new user
- **POST** `/api/user/login` - Login a user
- **GET** `/api/user` - Get all users (requires authentication)
- **PUT** `/api/user/:userId` - Update user profile (requires authentication)
- **PUT** `/api/user/:userId/updatepassword` - Update user password (requires authentication)
- **POST** `/api/user/forgot-password` - Send password reset email
- **POST** `/api/user/:userId/:token/postResetPassword` - Reset password
- **GET** `/api/user/:id/verify/:token` - Verify user email

### Chat Routes
- **POST** `/api/chat` - Access or create a chat (requires authentication)
- **GET** `/api/chat` - Fetch all chats for the logged-in user (requires authentication)
- **POST** `/api/chat/group` - Create a group chat (requires authentication)
- **PUT** `/api/chat/rename` - Rename a group chat (requires authentication)
- **PUT** `/api/chat/updatePic` - Update group chat profile picture (requires authentication)
- **PUT** `/api/chat/groupadd` - Add a user to a group chat (requires authentication)
- **PUT** `/api/chat/groupremover` - Remove a user from a group chat (requires authentication)
- **PUT** `/api/chat/updateGroupAdmin` - Update group chat admin (requires authentication)

### Message Routes
- **POST** `/api/message` - Send a message (requires authentication)
- **GET** `/api/message/:chatId` - Get all messages for a chat (requires authentication)
- **DELETE** `/api/message/:id` - Delete a message (requires authentication)

## Socket.io Events
- `setup` - Initialize socket connection
- `join chat` - Join a chat room
- `new message` - Send a new message
- `message received` - Receive a new message
- `typing` - Notify that a user is typing
- `stop typing` - Notify that a user stopped typing

## Error Handling
The backend uses custom middleware for error handling. The `errorMiddleware.js` file contains two middleware functions:

- `notFound` - Handles 404 errors for undefined routes
- `errorHandler` - Handles all other errors and sends a JSON response with the error message and stack trace (in development mode)

## Contributing
Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some feature'`)
5. Push to the branch (`git push origin feature/your-feature`)
6. Open a pull request

## License
This project is licensed under the MIT License. See the LICENSE file for details.
