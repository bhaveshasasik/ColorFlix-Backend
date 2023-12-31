# Color Palette Genarator - Color Flix Backend

This is a backend for [Color Flix app](https://github.com/bhaveshasasik/color-palette-app). The users can either take pictures by using the camera or pick images from their gallery to get the palette. Their pictures then will be posted on their profile page and visible to other users. Other users can give feedbacks by `like` and `comment` on the posts.

## Technologies
- TypeScript
- Node, Express
- MongoDB, Mongoose
- Docker
- AWS S3
- JWT
- Redis

## Database Model
- USER
- POST
- COMMENT
- LIKE

## Features

### Encrypted and salt password
The application uses JWT (access token and refresh token) for secure authentication. Besides, to increase the security, all users have a distinct salt string adding to their password. All passwords are encrypted and stored in database.

### NoSQL database - MongoDB
The code utilize pipeline MongoDB operations for reducing the runtime performance. Also, the database design implements 1-to-1, 1-to-many relationships.

### Upload photos
Photos are posted and stored on AWS S3 service. They can be retrieved and showed by the return urls saved in MongoDB Atlas.

### Redis cache
Reduce triple the times to GET information about post, like, and comment by implementing Redis cache in Controller.

### Color palette generated
The colors are generated from [Flask Machine Learning server](https://github.com/suyashgoel/color-palette-model) also developed by our team and then stored in the database with the post information.

## How to run the web-app

### Set up environment variables

Create a `.env` file for enviroment variables with the format below:
```
PORT=5000
COLORFLIX_DB_URI=

ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRATION=7d
REFRESH_TOKEN_EXPIRATION=30d

AWS_SECRET_ACCESS_KEY=
AWS_ACCESS_KEY_ID=
S3_REGION=
S3_BUCKET_NAME=colorflix-s3

FLASK_SERVER=http://0.0.0.0:8000/upload
```

You need a MongoDB Atlas cluster and an AWS S3 bucket to run the web app. The port number can be changed if you like. You also need to install and run our [Color Flix Model server](https://github.com/suyashgoel/color-palette-model).

### npm install
Install all dependencies for the web-app.

### npm run start
Run the web-app on the desired port (e.g. 5000).

### Swagger - API documentation
The API document is written through Swagger and can be accessed at [this page](http://localhost:5000/api-docs/) (Port number should be followed the one you run the app).
