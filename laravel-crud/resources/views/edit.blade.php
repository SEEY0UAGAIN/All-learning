@extends('layout')

@section('content')

<h1>Edit Post</h1>

@if($errors->any())
<div class="alert alert-danger">
    <ul>
        @foreach($errors->all() as $error)
        <li>{{$error}}</li>
        @endforeach
    </ul>
</div>
@endif

<form action="{{route ('update',$post)}}" method="POST">
    @csrf
    @method('PUT')
    <div class="mb-3">
        <label for="title">Title</label>
        <input type="text" name="title" class="form-control" value="{{$post->title}}" require>
    </div>
    <div class="mb-3">
        <label for="content">Content</label>
        <textarea name="content" class="form-control" rows="5" require>{{$post->content}}</textarea>
    </div>
    <button type="submit" class="btn btn-success">Edit</button>
    <a href="{{ route('index') }}" class="btn btn-secondary">Back</a>
</form>

@endsection