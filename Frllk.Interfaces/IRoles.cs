using Frllk.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Frllk.Interfaces
{
    public interface IRoles
    {
        GetsResult<RoleDetails> Get(PageParams param);

        PutResult Put(RoleDetails model);

        PostResult<int> Post(RoleDetails model);

        DeleteResult Delete(int id);

        PutResult PermissionPut(RoleDetails model);
    }
}
