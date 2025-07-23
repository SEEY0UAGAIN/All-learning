@extends('layout')

@section('content')

@if($error->any())
<div class="alert alert-danger">
    <ul>
        @foreach($errors->all() as $error)
        <li>{{$error}}</li>
        @endforeach
    </ul>
</div>
@endif

<form action="{{ route ('store') }}" method="POST">
    @csrf
    <div class="mb-3">
        <label for="title">Title</label>
        <input type="text" name="title" class="form-control" require>
    </div>
    <div class="mb-3">
        <label for="content">Content</label>
        <textarea name="content" class="form-control" rows="5" require></textarea>
    </div>
    <button type="submit" class="btn btn-success">Create Post</button>
    <a href="{{ route('index') }}" class="btn btn-secondary">Back</a>
</form>
@endsection