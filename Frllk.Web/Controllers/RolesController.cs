using Frllk.Interfaces;
using Frllk.Services;
using Frllk.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Frllk.Web.Controllers
{
    public class RolesController : ApiController
    {
        public IRoles Service { get; set; }
        public RolesController()
        {
            Service = new RolesService();
        }
        public ResultBase Get([FromUri]PageParams param)
        {
            return Service.Get(param);
        }
        public ResultBase Put(RoleDetails model)
        {
            return Service.Put(model);
        }
        public ResultBase Post(RoleDetails model)
        {
            return Service.Post(model);
        }
        public ResultBase Delete(int id)
        {
            return Service.Delete(id);
        }
        [AcceptVerbs("PUT")]
        public ResultBase PermissionPut(RoleDetails model)
        {
            return Service.PermissionPut(model);
        }
    }
}
