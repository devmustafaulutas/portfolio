using Infrastructure;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddInfrastructure(builder.Configuration);

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.MapGet("/health", () => Results.Ok("ok"));

app.MapGet("/api/posts", async (AppDbContext db) =>
{
    var posts = await db.Posts
        .OrderByDescending(x => x.PublishedAt ?? x.CreatedAt)
        .Select(x => new
        {
            x.Id,
            x.Slug,
            x.Title,
            x.Summary,
            x.IsPublished,
            x.PublishedAt,
            x.CreatedAt
        })
        .ToListAsync();

    return Results.Ok(posts);
});

app.MapPost("/api/posts", async (AppDbContext db, CreatePostRequest req) =>
{
    var slug = req.Slug.Trim().ToLowerInvariant();

    var exists = await db.Posts.AnyAsync(x => x.Slug == slug);
    if (exists) return Results.Conflict(new { message = "Slug already exists" });

    var post = new Domain.Entities.Post
    {
        Slug = slug,
        Title = req.Title.Trim(),
        Summary = req.Summary?.Trim(),
        ContentMarkdown = req.ContentMarkdown ?? "",
        IsPublished = false
    };

    db.Posts.Add(post);
    await db.SaveChangesAsync();

    return Results.Created($"/api/posts/{post.Slug}", new { post.Id, post.Slug });
});

app.Run();

public sealed record CreatePostRequest(
    string Slug,
    string Title,
    string? Summary,
    string ContentMarkdown
);
