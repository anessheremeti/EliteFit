using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.Common.Interfaces
{
    public interface ICachableQuery
    {
        // Çelësi unik i cache-it (p.sh. "recipes-user1-cal600-prot25")
        string CacheKey { get; }

        // Sa kohë dëshiron t'i mbash të dhënat (opsionale, p.sh. 5 ose 10 minuta)
        TimeSpan? Expiration { get; }
    }
}
