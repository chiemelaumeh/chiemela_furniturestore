# MERN Chiemela Store


Welcome to my React and Node tutorial to build a fully-functional e-commerce website.

Watch it on Youtube:

## Demo Website

- 👉 Render : [https://amazona.onrender.com](https://amazona.onrender.com)


## Run Locally

### 1. Clone repo

```
$ git clone https://github.com/chiemelaumeh/Mern_e_commerce.git
$ cd  MERN-E-commerce
```

### 2. Create .env File

- create .env file in backend folder 

### 3. Setup MongoDB

 Atlas Cloud MongoDB
  - Create database at [https://cloud.mongodb.com](https://cloud.mongodb.com)
  - In .env file type MONGODB_URI=mongodb+srv://your-db-connection

### 4. Run Backend

```
$ cd backend
$ npm install
$ npm start
```

### 5. Run Frontend

```
# open new terminal
$ cd frontend
$ npm install
$ npm start
```

### 6. Seed Users and Products

- Run this on browser: http://localhost:4000/api/seed
- It returns admin email and password and 6 sample products

### 7. Admin Login

- Run http://localhost:3000/signin
- Enter admin email and password and click signin
