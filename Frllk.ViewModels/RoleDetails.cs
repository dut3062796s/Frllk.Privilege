using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Frllk.ViewModels
{
    public class RoleDetails : IdWithName
    {
        public List<IdWithName> Funs { get; set; }
        public List<IdWithName> Users { get; set; }
    }
}
