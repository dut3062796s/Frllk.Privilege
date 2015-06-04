using Frllk.Interfaces;
using Frllk.ViewModels;
using FRLLK.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Frllk.Web.Controllers
{
    public class UsersController : ApiController
    {
        public IUser Service { get; set; }
        public UsersController()
        {
            Service = new UserService();
        }
        public ResultBase Get([FromUri]PageParams param)
        {
            return Service.Get(param);
        }
        public ResultBase Put(UserDetails user)
        {
            return Service.Put(user);
        }
        public ResultBase Post(UserDetails user)
        {
            return Service.Post(user);
        }
        public ResultBase Delete(int id)
        {
            return Service.Delete(id);
        }
        [AcceptVerbs("PUT")]
        public ResultBase PwdPut(UserDetails user)
        {
            return Service.PwdPut(user);
        }
        [AcceptVerbs("PUT")]
        public ResultBase RolesPut(UserDetails user)
        {
            return Service.RolesPut(user);
        }
    }
}
