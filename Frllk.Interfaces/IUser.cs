using Frllk.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Frllk.Interfaces
{
    public interface IUser
    {
        GetsResult<UserDetails> Get(PageParams param);

        PutResult Put(UserDetails user);

        PostResult<int> Post(UserDetails user);

        DeleteResult Delete(int id);

        PutResult PwdPut(UserDetails user);

        PutResult RolesPut(UserDetails user);
    }
}
