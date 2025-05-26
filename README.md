# PIX Homologation API

RESTful API built with **Node.js**, **TypeScript**, **Express**, **MongoDB**, and **Prisma** to simulate a PIX payment homologation system.

---

## Technologies Used

- Node.js  
- TypeScript  
- Express.js  
- MongoDB + Mongoose  
- Prisma ORM  
- Zod (data validation)  
- JWT (authentication)  
- Bcrypt (password hashing)  

---

## 📚 Features

- User registration and authentication  
- Payment registration with initial status `PENDING`  
- Payment homologation simulation:  
  - Automatic approval for valid payments (`PIX` and amount > 0)  
  - Automatic rejection for invalid payments  
- Global error handling middleware  
- Integration with MongoDB and Prisma  

---

##  Installation

```bash
# Clone the repository
git clone https://github.com/carlos-macha/pix-homologation-api.git
cd pix-homologation-api

# Install dependencies
yarn install

# Configure environment variables
cp .env.example .env

# Run the server in development mode
yarn dev
