using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public sealed class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Post> Posts => Set<Post>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Post>(b =>
        {
            b.HasKey(x => x.Id);
            b.Property(x => x.Slug).IsRequired().HasMaxLength(200);
            b.HasIndex(x => x.Slug).IsUnique();

            b.Property(x => x.Title).IsRequired().HasMaxLength(200);
            b.Property(x => x.ContentMarkdown).IsRequired();

            b.Property(x => x.CreatedAt).IsRequired();
            b.Property(x => x.UpdatedAt).IsRequired();
        });
    }
}
