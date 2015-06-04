using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Frllk.ViewModels
{
    public class PostResult<T> : ResultBase
    {
        public T Id { get; set; }
        public bool isCreated { get; set; }
    }
}
