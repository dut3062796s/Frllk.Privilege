using Frllk.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Frllk.Interfaces
{
    public interface IFunctionality
    {
        GetsResult<FunctionalityDetails> Get(PageParams param);

        PutResult Put(FunctionalityDetails model);

        PostResult<int> Post(FunctionalityDetails model);

        DeleteResult Delete(int id);
    }
}
