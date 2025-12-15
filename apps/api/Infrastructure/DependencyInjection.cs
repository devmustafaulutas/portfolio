using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration config)
    {
        var cs = config.GetConnectionString("Default");
        services.AddDbContext<AppDbContext>(opt => opt.UseNpgsql(cs));
        return services;
    }
}
