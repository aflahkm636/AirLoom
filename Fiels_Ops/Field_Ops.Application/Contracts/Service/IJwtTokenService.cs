using Field_Ops.Application.DTO.UserDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Field_Ops.Application.Contracts.Service
{
    public interface IJwtTokenService
    {
        string GenerateToken(UserForJwtDto user);
    }
}
