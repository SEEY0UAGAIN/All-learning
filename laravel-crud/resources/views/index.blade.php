@extends('layout')

@section('content')
<h1>All Posts</h1>
<a href="{{ route('create') }}" class="btn btn-primary mb-3">+ Create Post</a>

@if(session('success'))
<div class="alert alert-success">{{session('success')}}</div>
@endif

@if($posts->count())
@foreach($posts as $post)
<div class="card mb-3">
    <div class="card-body">
        <h3>{{$post->title}}</h3>
        <p>{{Str::limit($post->content,20)}}</p>
        <a href="{{route('show',$post)}}" class="btn btn-secondary">View</a>
        <a href="{{route('edit',$post)}}" class="btn btn-warning">Edit</a>
        <form action="{{route('delete',$post)}}" method="POST" style="display:inline" onsubmit="return confirm('คุณแน่ใจว่าจะลบโพสต์นี้');">
            @csrf
            @method('DELETE')
            <button type="submit" class="btn btn-danger">Delete</button>
        </form>
    </div>
</div>
@endforeach
@else
<div class="alert alert-info">ยังไม่มีโพสต์ในระบบ</div>
@endif
@endsection