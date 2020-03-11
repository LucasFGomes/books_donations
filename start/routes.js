'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.post('/register', 'UserController.register');
Route.post('/auth', 'UserController.auth');

Route.get('/users/:donor_id/books', 'BookController.index').middleware(['auth']);
Route.post('/users/:donor_id/books', 'BookController.store').middleware(['auth']);
Route.put('/users/books/:book_id', 'BookController.registerInterest').middleware(['auth']);
Route.put('/users/books/:book_id/donations', 'BookController.registerDonation').middleware(['auth']);

Route.get('/users/donations', 'DonationController.index').middleware(['auth']);
Route.get('/users/:donor_id/donations', 'DonationController.show').middleware(['auth']);
Route.post('/users/donations', 'DonationController.store').middleware(['auth']);
