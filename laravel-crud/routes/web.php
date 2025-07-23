<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostController;

Route::get('/', [PostController::class, 'index'])->name('index');
Route::get('/create', [PostController::class, 'create'])->name('create');
Route::post('/store', [PostController::class, 'store'])->name('store');
Route::get('/show/{post}', [PostController::class, 'show'])->name('show');
Route::get('/edit/{post}', [PostController::class, 'edit'])->name('edit');
Route::put('/update/{post}', [PostController::class, 'update'])->name('update');
Route::delete('/delete/{post}', [PostController::class, 'destroy'])->name('delete');
