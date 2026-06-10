using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EliteFit.Application.DTOs.Account;
using MediatR;

namespace EliteFit.Application.Features.Users.Queries.GetProfile
{
    
        public record GetProfileQuery(int UserId) : IRequest<AccountProfileDto?>;
    
}
