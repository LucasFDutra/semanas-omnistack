const express = require('express');
const multer = require('multer');
const SessionController = require('./controllers/SessionController');
const SpotController = require('./controllers/SpotController');
const uploadConfig = require('./config/upload');
const DashboardController = require('./controllers/DashboardController');
const BookingsController = require('./controllers/BookingController');

const routes = express.Router();
const upload = multer(uploadConfig);

routes.post('/sessions', SessionController.store);
routes.get('/spots', SpotController.index);
routes.post('/spots', upload.single('thumbnail'), SpotController.store);
routes.get('/dashboard', DashboardController.show);
routes.post('/spots/:spot_id/bookings', BookingsController.store);

module.exports = routes;
