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

Route.get('/users/:id', 'UserController.index')
Route.post('/register', 'UserController.register');
Route.post('/auth', 'UserController.auth');
Route.put('/users/:id', 'UserController.increaseCredit').middleware(['auth']);
Route.put('/users', 'UserController.giveNote').middleware(['auth']);

Route.get('/users/:donor_id/books', 'BookController.index').middleware(['auth']);
Route.post('/users/:donor_id/books', 'BookController.store').middleware(['auth']);
Route.put('/users/books/:book_id', 'BookController.registerInterest');
Route.put('/users/books/:book_id/donations', 'BookController.registerDonation');

Route.get('/users/books/donations', 'DonationController.index').middleware(['auth']);
Route.get('/users/:donor_id/books/donations', 'DonationController.show').middleware(['auth']);
Route.put('/users/:donor_id/books/donations/:donation_id', 'DonationController.completeDonation').middleware(['auth']);
Route.delete('/users/books/donations/:donation_id', 'DonationController.cancelDonation').middleware(['auth']);
Route.post('/users/books/donations', 'DonationController.store').middleware(['auth']);
