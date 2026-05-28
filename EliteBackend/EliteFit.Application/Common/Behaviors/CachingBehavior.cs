using EliteFit.Application.Common.Interfaces;
using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;

namespace EliteFit.Application.Common.Behaviors;

public class CachingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly IDistributedCache _cache;

    public CachingBehavior(IDistributedCache cache)
    {
        _cache = cache;
    }

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        // Nëse kërkesa nuk kërkon Caching, kalojmë direkt te Handler-i (databaza)
        if (request is not ICachableQuery cachableQuery)
        {
            return await next();
        }

        // 1. Kontrollojmë nëse të dhënat janë në Cache
        var cachedData = await _cache.GetStringAsync(cachableQuery.CacheKey, cancellationToken);

        if (cachedData != null)
        {
            // Nëse po, i kthejmë ato menjëherë pa shkuar te Handler-i fare!
            return JsonSerializer.Deserialize<TResponse>(cachedData)!;
        }

        // 2. Nëse nuk janë në cache (Cache Miss), ekzekutojmë Handler-in (shkon në MongoDB)
        var response = await next();

        // 3. Rezultatin e marrë e ruajmë në Cache për herën tjetër
        var options = new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = cachableQuery.Expiration ?? TimeSpan.FromMinutes(5)
        };

        var serializedData = JsonSerializer.Serialize(response);
        await _cache.SetStringAsync(cachableQuery.CacheKey, serializedData, options, cancellationToken);

        return response;
    }
}