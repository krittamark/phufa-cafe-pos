const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/api-spec.json');

dotenv.config({path: '.env'});

const app = express();
const port = process.env.PORT || 3000;

const errorHandlerMiddleware = require('./middlewares/errorServer.middleware');
const orderRoutes = require('./routes/order.route');
const reportsRouter = require('./routes/report.route');
const employeesRouter = require('./routes/employee.route');
const customerRouter = require('./routes/customer.route');
const ingredientRoutes = require('./routes/ingredient.route');
const menuRoutes = require('./routes/menu.route');
const uploadRoutes = require('./routes/upload.route');

const ingredientCategoriesRoutes = require('./routes/ingredient-categories.route');
const errorNotFoundMiddleware = require('./middlewares/errorNotFound.middleware');

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/orders', orderRoutes);
app.use('/reports', reportsRouter);
app.use('/employees', employeesRouter);
app.use('/customers', customerRouter);
app.use('/ingredients', ingredientRoutes);
app.use('/menu', menuRoutes);
app.use('/ingredient-categories', ingredientCategoriesRoutes);
app.use('/uploads', uploadRoutes);

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend service is operational.',
    serviceName: 'PhufaCafeAPI',
    timestamp: new Date().toISOString(),
  });
});

app.use(errorNotFoundMiddleware);
app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log(`Backend service listening on port ${port}`);
});

module.exports = app;
