using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Frllk.ViewModels
{
    public class UserDetails : IdWithName
    {
        public string Password { get; set; }
        public DateTime CreateTime { get; set; }
        public string Email { get; set; }
        public bool IsVerify { get; set; }
        public List<IdWithName> Roles { get; set; }
    }
}
