const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Test data
const testSupplier = {
  name: 'Test Supplier Co',
  contact: {
    email: 'test@supplier.com',
    phone: '+1-555-0123',
    address: '123 Test St, Test City, TC 12345'
  }
};

const testProducts = [
  {
    sku: 'TEST001',
    name: 'Test Product 1',
    price: 19.99,
    stock: 100
  },
  {
    sku: 'TEST002',
    name: 'Test Product 2',
    price: 29.99,
    stock: 50
  }
];

async function testAPI() {
  try {
    console.log('🚀 Starting API Tests...\n');

    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data.message);

    // Test 2: Create Supplier
    console.log('\n2. Creating Test Supplier...');
    const supplierResponse = await axios.post(`${BASE_URL}/suppliers`, testSupplier);
    const supplierId = supplierResponse.data._id;
    console.log('✅ Supplier Created:', supplierResponse.data.name);

    // Test 3: Create Products
    console.log('\n3. Creating Test Products...');
    const productIds = [];
    for (const product of testProducts) {
      const productResponse = await axios.post(`${BASE_URL}/products`, product);
      productIds.push(productResponse.data._id);
      console.log(`✅ Product Created: ${productResponse.data.name} (SKU: ${productResponse.data.sku})`);
    }

    // Test 4: Create Order
    console.log('\n4. Creating Test Order...');
    const testOrder = {
      items: [
        {
          productId: productIds[0],
          qty: 5,
          price: testProducts[0].price
        },
        {
          productId: productIds[1],
          qty: 3,
          price: testProducts[1].price
        }
      ],
      supplierId: supplierId
    };
    const orderResponse = await axios.post(`${BASE_URL}/orders`, testOrder);
    const orderId = orderResponse.data._id;
    console.log('✅ Order Created:', orderResponse.data._id);

    // Test 5: Get All Products
    console.log('\n5. Getting All Products...');
    const productsResponse = await axios.get(`${BASE_URL}/products`);
    console.log(`✅ Found ${productsResponse.data.total} products`);

    // Test 6: Get All Suppliers
    console.log('\n6. Getting All Suppliers...');
    const suppliersResponse = await axios.get(`${BASE_URL}/suppliers`);
    console.log(`✅ Found ${suppliersResponse.data.total} suppliers`);

    // Test 7: Get All Orders
    console.log('\n7. Getting All Orders...');
    const ordersResponse = await axios.get(`${BASE_URL}/orders`);
    console.log(`✅ Found ${ordersResponse.data.total} orders`);

    // Test 8: Update Order Status
    console.log('\n8. Updating Order Status...');
    const statusUpdateResponse = await axios.patch(`${BASE_URL}/orders/${orderId}/status`, {
      status: 'confirmed'
    });
    console.log('✅ Order Status Updated to:', statusUpdateResponse.data.status);

    // Test 9: Update Product Stock
    console.log('\n9. Updating Product Stock...');
    const stockUpdateResponse = await axios.patch(`${BASE_URL}/products/${productIds[0]}/stock`, {
      operation: 'add',
      quantity: 25
    });
    console.log(`✅ Stock Updated for ${stockUpdateResponse.data.name}: ${stockUpdateResponse.data.stock} units`);

    // Test 10: Search Products
    console.log('\n10. Searching Products...');
    const searchResponse = await axios.get(`${BASE_URL}/products?search=Test`);
    console.log(`✅ Found ${searchResponse.data.products.length} products matching "Test"`);

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Supplier ID: ${supplierId}`);
    console.log(`- Product IDs: ${productIds.join(', ')}`);
    console.log(`- Order ID: ${orderId}`);

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = testAPI;

