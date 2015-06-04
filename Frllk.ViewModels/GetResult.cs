using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Frllk.ViewModels
{
    public class GetResult<T> : ResultBase
    {
        public T Data { get; set; }
    }
}
