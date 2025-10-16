# Inventory Management API

A complete RESTful API for inventory management built with Node.js, Express, and MongoDB. Manages Products, Suppliers, Orders, and Users with full CRUD operations.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file in project root:
   ```bash
   MONGO_URI=mongodb://127.0.0.1:27017/inventory
   PORT=3000
   ```

4. Start the server:
   ```bash
   npm start        # Production
   npm run dev      # Development with nodemon
   ```

## 📁 Project Structure

```
Inventory/
├── app.js                 # Main application entry point
├── config/
│   └── db.js            # MongoDB connection configuration
├── controllers/          # Business logic
│   ├── productController.js
│   ├── supplierController.js
│   ├── orderController.js
│   └── userController.js
├── models/              # Mongoose schemas
│   ├── productModel.js
│   ├── supplierModels.js
│   ├── orderModel.js
│   └── userModel.js
├── routes/              # API route definitions
│   ├── productRoutes.js
│   ├── supplierRoutes.js
│   ├── orderRoutes.js
│   └── userRoutes.js
├── package.json
└── README.md
```

## 🔗 API Endpoints

Base URL: `http://localhost:3000/api`

### Health Check
- `GET /health` - API status and health check

### Products
- `POST /products` - Create new product
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Suppliers
- `POST /suppliers` - Create new supplier
- `GET /suppliers` - Get all suppliers
- `GET /suppliers/:id` - Get supplier by ID
- `PUT /suppliers/:id` - Update supplier
- `DELETE /suppliers/:id` - Delete supplier

### Orders
- `POST /orders` - Create new order
- `GET /orders` - Get all orders (with populated references)
- `GET /orders/:id` - Get order by ID
- `PUT /orders/:id` - Update order
- `DELETE /orders/:id` - Delete order

### Users
- `POST /users` - Create new user
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

## 📝 Data Models

### Product
```json
{
  "sku": "string (unique, required)",
  "name": "string (required)",
  "price": "number (min: 0, required)",
  "stock": "number (min: 0, default: 0, required)"
}
```

### Supplier
```json
{
  "name": "string (required)",
  "contact": "string (optional)"
}
```

### Order
```json
{
  "supplierId": "ObjectId (required)",
  "status": "string (enum: pending, approved, shipped, received, cancelled)",
  "items": [
    {
      "productId": "ObjectId (required)",
      "qty": "number (min: 1, required)",
      "price": "number (min: 0, required)"
    }
  ]
}
```

### User
```json
{
  "name": "string (required)",
  "email": "string (unique, required)",
  "age": "number (optional)"
}
```

## 🧪 API Testing Examples

### Create Product
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "sku": "SKU-001",
    "name": "Blue Pen",
    "price": 1.99,
    "stock": 100
  }'
```

### Create Supplier
```bash
curl -X POST http://localhost:3000/api/suppliers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acme Supplies",
    "contact": "acme@example.com"
  }'
```

### Create Order
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "supplierId": "SUPPLIER_OBJECT_ID",
    "status": "pending",
    "items": [
      {
        "productId": "PRODUCT_OBJECT_ID",
        "qty": 5,
        "price": 1.99
      }
    ]
  }'
```

### Get All Products
```bash
curl http://localhost:3000/api/products
```

### Health Check
```bash
curl http://localhost:3000/health
```

## 🔧 Configuration

### Environment Variables
- `MONGO_URI` - MongoDB connection string
- `PORT` - Server port (default: 3000)

### MongoDB Atlas Setup
For MongoDB Atlas, use:
```bash
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/inventory?retryWrites=true&w=majority
```

### Local MongoDB Setup
For local MongoDB:
```bash
MONGO_URI=mongodb://127.0.0.1:27017/inventory
```

## 🛠️ Development

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (not implemented)

### Dependencies
- **express** - Web framework
- **mongoose** - MongoDB ODM
- **body-parser** - Request body parsing
- **dotenv** - Environment variable management
- **nodemon** - Development auto-restart

## 📋 Features

- ✅ Complete CRUD operations for all entities
- ✅ Data validation and error handling
- ✅ MongoDB integration with Mongoose
- ✅ RESTful API design
- ✅ Population of related documents
- ✅ Health check endpoint
- ✅ Environment configuration
- ✅ Clean project structure

## 🚨 Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

Error responses include descriptive messages:
```json
{
  "message": "Product not found"
}
```

## 📄 License

ISC License

## Author
