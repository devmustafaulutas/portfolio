namespace Domain.Entities;

public sealed class Post
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Slug { get; set; } = default!;
    public string Title { get; set; } = default!;
    public string? Summary { get; set; }
    public string ContentMarkdown { get; set; } = default!;
    public bool IsPublished { get; set; }
    public DateTimeOffset? PublishedAt { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
}
