
# Real-Time Chat Application

Welcome to the Real-Time Chat Application! This guide will walk you through setting up and running the project.  

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js**: Version 16+ recommended  
- **Package Manager**: Yarn or npm  
- **MongoDB**: Ensure your database is accessible  

---

### 📂 Installation

To set up the project, follow these steps:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies for each service:

   ```bash
   # Service API
   cd service
   yarn install # or npm install

   # GraphQL Server
   cd ../graphql
   yarn install # or npm install

   # Client Application
   cd ../client
   yarn install # or npm install
   ```

---

### 🔧 Configuration

1. Navigate to the `service` directory:  
   ```bash
   cd service
   ```

2. Rename the `.env.example` file to `.env`:
   ```bash
   mv .env.example .env
   ```

3. Edit the `.env` file and configure your MongoDB connection:
   ```env
   DATABASE_URL=your_connection_mongodb
   ```

---

### ▶️ Running the Application

Start each service in development mode:

1. **Service API**:  
   ```bash
   cd service
   yarn dev # or npm run dev
   ```

2. **GraphQL Server**:  
   ```bash
   cd graphql
   yarn dev # or npm run dev
   ```

3. **Client Application**:  
   ```bash
   cd client
   yarn dev # or npm run dev
   ```

---

### 🌐 Access the Application

Once all services are running, open your browser and go to:  
**[http://localhost:3000](http://localhost:3000)**

Enjoy chatting in real time! 🎉

---

### 🛠️ Troubleshooting

- If dependencies fail to install, ensure your package manager and Node.js are up to date.
- Verify that your MongoDB server is running and the `DATABASE_URL` is correctly set.

Feel free to contribute to the project or raise an issue if you encounter any problems. 😊
